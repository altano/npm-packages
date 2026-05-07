{
  description = "altano/npm-packages development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    nix2container.url = "github:nlewo/nix2container";
    nix2container.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs =
    {
      self,
      nixpkgs,
      nix2container,
    }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-darwin"
      ];

      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;

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

      # Parse pnpm version from package.json's packageManager field.
      # pnpm v10 self-manages: it sees this field and tries to switch to that
      # exact version, downloading it if missing — which fails in our locked-
      # down container. Asserting equality here means a mismatch fails at
      # flake-eval (the next image build) rather than at `pnpm install`.
      packageJson = builtins.fromJSON (builtins.readFile ./package.json);
      expectedPnpmVersion =
        let
          parsed = builtins.match "^pnpm@([0-9]+\\.[0-9]+\\.[0-9]+).*" packageJson.packageManager;
        in
        if parsed == null then
          builtins.throw "package.json's packageManager field is not pnpm@X.Y.Z (got: ${packageJson.packageManager})"
        else
          builtins.head parsed;

      # Per-system packages and env, shared between the dev shell and the CI image so
      # local dev and CI run in the exact same closure.
      toolsFor =
        system:
        let
          pkgs = import nixpkgs { inherit system; };
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
          playwrightBrowsers =
            assert playwrightVersionCheck;
            pkgs.playwright-driver.browsers;
          pnpmVersionCheck =
            assert
              pkgs.pnpm.version == expectedPnpmVersion
              || builtins.throw ''
                pnpm version mismatch!
                  nixpkgs has: ${pkgs.pnpm.version}
                  package.json packageManager: pnpm@${expectedPnpmVersion}

                Fix: update the packageManager field in package.json or the nixpkgs input so both resolve to the same version.
              '';
            true;
          pnpm = assert pnpmVersionCheck; pkgs.pnpm;
        in
        {
          inherit pkgs playwrightBrowsers;
          packages = [
            pkgs.nodejs_25
            pnpm
            pkgs.git
            pkgs.mercurialFull
            pkgs.sapling
            pkgs.subversion
            playwrightBrowsers
            pkgs.difftastic
            pkgs.nil
            pkgs.tree
          ];
          env = {
            PLAYWRIGHT_BROWSERS_PATH = "${playwrightBrowsers}";
            PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "1";
          };
        };
    in
    {
      devShells = forAllSystems (
        system:
        let
          tools = toolsFor system;
        in
        {
          default = tools.pkgs.mkShell (
            {
              buildInputs = tools.packages;
            }
            // tools.env
          );
        }
      );

      packages = forAllSystems (
        system:
        let
          tools = toolsFor system;
          pkgs = tools.pkgs;
        in
        nixpkgs.lib.optionalAttrs (system == "x86_64-linux") {
          # Container image with the same closure as the default dev shell.
          # Analogous to a devcontainer, but built reproducibly from this flake.
          # Used by CI today; can also be pulled locally for reproducing CI failures.
          dev-image =
            let
              n2c = nix2container.packages.${system}.nix2container;
              # Standard POSIX toolkit that shell scripts (e.g. node_modules/.bin
              # wrappers, GitHub Actions composite actions) assume is on PATH.
              # coreutils alone is not enough — sed/grep/awk/find/jq each live
              # in their own packages in nixpkgs.
              imageRuntime = [
                pkgs.bashInteractive
                pkgs.coreutils
                pkgs.gnused
                pkgs.gnugrep
                pkgs.gawk
                pkgs.findutils
                pkgs.diffutils
                pkgs.which
                pkgs.jq
                pkgs.curl
                pkgs.gnutar
                pkgs.gzip
                pkgs.xz
                pkgs.unzip
                pkgs.cacert
              ];
              # nix-built images put everything under /nix/store, with no FHS
              # paths. Foreign glibc-linked binaries — most notably GitHub
              # Actions' bundled node at /__e/node*/bin/node, plus any prebuilt
              # native npm modules — fail with ENOENT (misleadingly: "no such
              # file or directory") because their hardcoded interpreter path
              # /lib64/ld-linux-x86-64.so.2 doesn't exist. This single symlink
              # plus LD_LIBRARY_PATH below is enough to make them runnable.
              dynamicLinker = pkgs.runCommand "dynamic-linker" { } ''
                mkdir -p $out/lib64
                ln -s ${pkgs.glibc}/lib/ld-linux-x86-64.so.2 $out/lib64/ld-linux-x86-64.so.2
              '';

              # Tell git to trust any directory regardless of UID. Containers
              # run as root by default, but GitHub Actions volume-mounts the
              # workspace owned by the runner user, and modern git refuses
              # operations on cross-uid worktrees unless safe.directory matches.
              gitConfig = pkgs.writeTextDir "etc/gitconfig" ''
                [safe]
                	directory = *
              '';
            in
            n2c.buildImage {
              name = "ghcr.io/altano/npm-packages-dev";
              # Tag is omitted → nix2container computes a content-addressed tag.
              config = {
                Env = [
                  "PATH=${pkgs.lib.makeBinPath (tools.packages ++ imageRuntime)}:/bin:/usr/bin"
                  # Search path for foreign glibc-linked binaries (see
                  # `dynamicLinker` above). nix-built binaries have RUNPATH
                  # baked in pointing at the same glibc, so this is a no-op
                  # for them.
                  "LD_LIBRARY_PATH=${pkgs.glibc}/lib:${pkgs.stdenv.cc.cc.lib}/lib"
                  "PLAYWRIGHT_BROWSERS_PATH=${tools.playwrightBrowsers}"
                  "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1"
                  "PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1"
                  "SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
                  "NIX_SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
                  "GIT_SSL_CAINFO=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
                  "CURL_CA_BUNDLE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
                  "NODE_EXTRA_CA_CERTS=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
                  # pnpm / npm honor NPM_CONFIG_CAFILE explicitly; some code
                  # paths in pnpm don't pick up NODE_EXTRA_CA_CERTS reliably.
                  "NPM_CONFIG_CAFILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
                ];
              };
              copyToRoot = [
                (pkgs.buildEnv {
                  name = "dev-image-root";
                  paths = tools.packages ++ imageRuntime;
                  pathsToLink = [
                    "/bin"
                    "/etc"
                    "/share"
                  ];
                })
                dynamicLinker
                gitConfig
              ];
            };
        }
      );
    };
}
