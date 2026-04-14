{
  description = "altano/npm-packages development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    # Pinned nixpkgs commit with playwright-driver matching @playwright/test in
    # pnpm-workspace.yaml. When updating @playwright/test, find a matching
    # nixpkgs commit at https://www.nixhub.io and update this pin.
    nixpkgs-playwright.url = "github:NixOS/nixpkgs/13043924aaa7375ce482ebe2494338e058282925";
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
            };
            pkgs-playwright = import nixpkgs-playwright { inherit system; };
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
        { pkgs, pkgs-playwright, ... }:
        let
          # Assert playwright-driver version matches @playwright/test from pnpm-workspace.yaml
          playwrightVersionCheck =
            assert
              pkgs-playwright.playwright-driver.version == expectedPlaywrightVersion
              || builtins.throw ''
                Playwright version mismatch!
                  nixpkgs-playwright has: ${pkgs-playwright.playwright-driver.version}
                  pnpm-lock.yaml expects: ${expectedPlaywrightVersion}

                Fix: find a nixpkgs commit with playwright-driver ${expectedPlaywrightVersion}
                at https://www.nixhub.io and update the nixpkgs-playwright input in flake.nix.
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

          playwright =
            assert playwrightVersionCheck;
            pkgs-playwright.playwright-driver.browsers;

          localExtras = [
            pkgs.difftastic
            pkgs.nil
            pkgs.tree
            pkgs.graphite-cli
          ];

          playwrightShellHook = ''
            export PLAYWRIGHT_BROWSERS_PATH="${playwright}"
            export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
          '';
        in
        {
          # Local development — everything
          local-dev = pkgs.mkShell {
            buildInputs = base ++ vcs ++ [ playwright ] ++ localExtras;
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
            buildInputs = base ++ [ playwright ];
            shellHook = playwrightShellHook;
          };
        }
      );
    };
}
