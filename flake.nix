{
  description = "altano/npm-packages development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    # Pin playwright separately from the rest of nixpkgs, so its version moves only
    # together with `@playwright/test` in pnpm-workspace.yaml. This revision has
    # 1.64.1.
    nixpkgs-playwright.url = "github:NixOS/nixpkgs/4fe25e12eb9f4c744966dd3de5a05246cf098601";
  };

  outputs =
    {
      self,
      nixpkgs,
      nixpkgs-playwright,
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
          pkgsPlaywright = import nixpkgs-playwright { inherit system; };
          # Assert playwright-driver version matches @playwright/test from pnpm-lock.yaml
          playwrightVersionCheck =
            assert
              pkgsPlaywright.playwright-driver.version == expectedPlaywrightVersion
              || builtins.throw ''
                Playwright version mismatch!
                  nixpkgs-playwright has: ${pkgsPlaywright.playwright-driver.version}
                  pnpm-lock.yaml expects: ${expectedPlaywrightVersion}

                Fix: update the nixpkgs-playwright input or the Playwright npm dependency so both resolve to the same version.
              '';
            true;

          base = [
            pkgs.nodejs_26
            pkgs.pnpm
            pkgs.jq
          ];

          vcs = [
            pkgs.git
            pkgs.jujutsu
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
            pkgsPlaywright.playwright-driver.browsers;

          # Linux WebKit (the WPE build) renders through EGL. nixpkgs' WebKit wrapper
          # used to fall back to Mesa when the host has no EGL vendor config, until
          # NixOS/nixpkgs#518611 removed that fallback and pointed users at
          # `llvmpipeHook`, which selects Mesa's software renderer through
          # environment variables. GitHub runners have no EGL vendor config, so
          # without this WebKit aborts with "Could not create EGL display". turbo.json
          # passes these variables through to `test:e2e`. The darwin WebKit doesn't
          # use EGL.
          playwrightRenderHooks = pkgs.lib.optionals pkgs.stdenv.hostPlatform.isLinux [
            pkgsPlaywright.mesa.llvmpipeHook
          ];

          localExtras = [
            pkgs.difftastic
            pkgs.nil
          ];
        in
        {
          # Local development — everything. This is the default `nix develop` shell.
          default = pkgs.mkShell {
            buildInputs = base ++ vcs ++ testDeps ++ [ playwrightBrowsers ] ++ localExtras;
            nativeBuildInputs = playwrightRenderHooks;
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
            nativeBuildInputs = playwrightRenderHooks;
            PLAYWRIGHT_BROWSERS_PATH = "${playwrightBrowsers}";
            PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = 1;
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = 1;
          };
        }
      );
    };
}
