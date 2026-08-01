{
  description = "altano/npm-packages development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    # Pin playwright to 1.59.1. On 1.61.1, webkit e2e tests stop working in GitHub Actions.
    nixpkgs-playwright-1-59-1.url = "github:NixOS/nixpkgs/afc5551119aae6eab73a95c1960891cfe63204f6";
    # Negative control: known-bad mesa 26.1.1, forced onto LD_LIBRARY_PATH over
    # the otherwise-good 1.59.1/26.0.6 combo above, to check that the
    # LD_LIBRARY_PATH override mechanism actually takes effect at runtime.
    nixpkgs-mesa-26-1-1.url = "github:NixOS/nixpkgs/5f85796ab70f9a6ac935b366065d4565288947ac";
  };

  outputs =
    {
      self,
      nixpkgs,
      nixpkgs-playwright-1-59-1,
      nixpkgs-mesa-26-1-1,
    }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-darwin"
      ];

      # Parse resolved @playwright/test version from pnpm-lock.yaml (exact installed version).
      # Matches lines like:  '@playwright/test@1.58.2':
      lockfileYaml = builtins.readFile ./pnpm-lock.yaml;
      lockfileLines = builtins.filter builtins.isString (builtins.split "\n" lockfileYaml);
      playwrightLines = builtins.filter (
        l: builtins.match ".*'@playwright/test@[0-9].*" l != null
      ) lockfileLines;
      expectedPlaywrightVersion = builtins.head (
        builtins.match ".*'@playwright/test@([0-9]+\\.[0-9]+\\.[0-9]+)'.*" (builtins.head playwrightLines)
      );
    in
    {
      devShells = nixpkgs.lib.genAttrs supportedSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
          pkgsPlaywright159 = import nixpkgs-playwright-1-59-1 { inherit system; };
          pkgsBadMesa = import nixpkgs-mesa-26-1-1 { inherit system; };
          # Assert playwright-driver version matches @playwright/test from pnpm-lock.yaml
          playwrightVersionCheck =
            assert
              pkgsPlaywright159.playwright-driver.version == expectedPlaywrightVersion
              || builtins.throw ''
                Playwright version mismatch!
                  nixpkgs-playwright-1-59-1 has: ${pkgsPlaywright159.playwright-driver.version}
                  pnpm-lock.yaml expects: ${expectedPlaywrightVersion}

                Fix: update the nixpkgs-playwright-1-59-1 input or the Playwright npm dependency so both resolve to the same version.
              '';
            true;

          base = [
            pkgs.nodejs_26
            pkgs.pnpm
          ];

          vcs = [
            pkgs.git
            pkgs.mercurialFull
            pkgs.sapling
            pkgs.subversion
          ];

          # Tools the unit test suite shells out to (e.g. globalSetup hashes the
          # repository-template directory tree with `tree`). Needed wherever unit
          # tests run, including the CI `test-unit` shell.
          testDeps = [
            pkgs.tree
          ];

          playwrightBrowsers =
            assert playwrightVersionCheck;
            pkgsPlaywright159.playwright-driver.browsers;

          localExtras = [
            pkgs.difftastic
            pkgs.nil
          ];
        in
        {
          # Local development — everything. This is the default `nix develop` shell.
          default = pkgs.mkShell {
            buildInputs = base ++ vcs ++ testDeps ++ [ playwrightBrowsers ] ++ localExtras;
            PLAYWRIGHT_BROWSERS_PATH = "${playwrightBrowsers}";
            PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = 1;
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = 1;
          };

          # CI: build, lint, format, check, release
          ci = pkgs.mkShell {
            buildInputs = base;
          };

          # CI: unit tests (needs VCS tools + test helpers like `tree`)
          test-unit = pkgs.mkShell {
            buildInputs = base ++ vcs ++ testDeps;
          };

          # CI: e2e tests (needs playwright browsers)
          test-e2e = pkgs.mkShell {
            buildInputs = base ++ [ playwrightBrowsers ];
            PLAYWRIGHT_BROWSERS_PATH = "${playwrightBrowsers}";
            PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = 1;
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = 1;
            LD_LIBRARY_PATH = "${pkgsBadMesa.mesa}/lib";
          };
        }
      );
    };
}
