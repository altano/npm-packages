{
  description = "altano/npm-packages development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    # Pinned to match @playwright/test version in pnpm-lock.yaml.
    # When updating @playwright/test, update this tag to match.
    # Available tags: https://github.com/pietdevries94/playwright-web-flake/tags
    playwright.url = "github:pietdevries94/playwright-web-flake/1.58.2";
  };

  outputs =
    {
      self,
      nixpkgs,
      playwright,
    }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-darwin"
      ];
      forEachSystem =
        f:
        nixpkgs.lib.genAttrs supportedSystems (
          system:
          f {
            pkgs = import nixpkgs {
              inherit system;
              config.allowUnfreePredicate =
                pkg:
                builtins.elem (nixpkgs.lib.getName pkg) [
                  "graphite-cli"
                ];
              overlays = [
                (final: prev: {
                  inherit (playwright.packages.${system}) playwright-test playwright-driver;
                })
              ];
            };
            inherit system;
          }
        );

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
      devShells = forEachSystem (
        { pkgs, ... }:
        let
          # Assert playwright-driver version matches @playwright/test from pnpm-lock.yaml
          playwrightVersionCheck =
            assert
              pkgs.playwright-driver.version == expectedPlaywrightVersion
              || builtins.throw ''
                Playwright version mismatch!
                  playwright-web-flake has: ${pkgs.playwright-driver.version}
                  pnpm-lock.yaml expects: ${expectedPlaywrightVersion}

                Fix: update the playwright input tag in flake.nix to ${expectedPlaywrightVersion}.
                Available tags: https://github.com/pietdevries94/playwright-web-flake/tags
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

          playwrightBrowsers =
            assert playwrightVersionCheck;
            pkgs.playwright-driver.browsers;

          localExtras = [
            pkgs.difftastic
            pkgs.nil
            pkgs.tree
            pkgs.graphite-cli
          ];

          playwrightShellHook = ''
            export PLAYWRIGHT_BROWSERS_PATH="${playwrightBrowsers}"
            export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
            export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1
          '';
        in
        {
          # Local development — everything
          local-dev = pkgs.mkShell {
            buildInputs = base ++ vcs ++ [ playwrightBrowsers ] ++ localExtras;
            shellHook = playwrightShellHook;
          };

          # CI: build, lint, format, check, release
          ci = pkgs.mkShell {
            buildInputs = base;
          };

          # CI: unit tests (needs VCS tools)
          test-unit = pkgs.mkShell {
            buildInputs = base ++ vcs;
          };

          # CI: e2e tests (needs playwright browsers)
          test-e2e = pkgs.mkShell {
            buildInputs = base ++ [ playwrightBrowsers ];
            shellHook = playwrightShellHook;
          };
        }
      );
    };
}
