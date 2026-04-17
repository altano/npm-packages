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

          playwrightBrowsers =
            assert playwrightVersionCheck;
            pkgs.playwright-driver.browsers;

          mesaEglVendorFile = "${pkgs.mesa}/share/glvnd/egl_vendor.d/50_mesa.json";

          localExtras = [
            pkgs.difftastic
            pkgs.nil
            pkgs.tree
            pkgs.graphite-cli
          ];
        in
        {
          # Local development — everything
          local-dev = pkgs.mkShell ({
            buildInputs = base ++ vcs ++ [ playwrightBrowsers ] ++ localExtras;
            PLAYWRIGHT_BROWSERS_PATH = "${playwrightBrowsers}";
            PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = 1;
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = 1;
          } // pkgs.lib.optionalAttrs pkgs.stdenv.hostPlatform.isLinux {
            # Work around Linux WebKit/EGL vendor selection issues until
            # https://github.com/NixOS/nixpkgs/pull/510475 lands in nixpkgs.
            __EGL_VENDOR_LIBRARY_FILENAMES = mesaEglVendorFile;
          });

          # CI: build, lint, format, check, release
          ci = pkgs.mkShell {
            buildInputs = base;
          };

          # CI: unit tests (needs VCS tools)
          test-unit = pkgs.mkShell {
            buildInputs = base ++ vcs;
          };

          # CI: e2e tests (needs playwright browsers)
          test-e2e = pkgs.mkShell ({
            buildInputs = base ++ [ playwrightBrowsers ];
            PLAYWRIGHT_BROWSERS_PATH = "${playwrightBrowsers}";
            PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = 1;
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = 1;
          } // pkgs.lib.optionalAttrs pkgs.stdenv.hostPlatform.isLinux {
            # Work around Linux WebKit/EGL vendor selection issues until
            # https://github.com/NixOS/nixpkgs/pull/510475 lands in nixpkgs.
            __EGL_VENDOR_LIBRARY_FILENAMES = mesaEglVendorFile;
          });
        }
      );
    };
}
