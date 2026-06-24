{
  description = "altano/npm-packages development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    {
      self,
      nixpkgs,
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
          # Assert playwright-driver version matches @playwright/test from pnpm-lock.yaml
          playwrightVersionCheck =
            assert
              pkgs.playwright-driver.version == expectedPlaywrightVersion
              || builtins.throw ''
                Playwright version mismatch!
                  nixpkgs has: ${pkgs.playwright-driver.version}
                  pnpm-lock.yaml expects: ${expectedPlaywrightVersion}

                Fix: update the nixpkgs input or the Playwright npm dependency so both resolve to the same version.
              '';
            true;

          base = [
            pkgs.nodejs_25
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
            pkgs.playwright-driver.browsers;

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
          };
        }
      );
    };
}
