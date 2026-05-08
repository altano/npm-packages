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

              # Distroless cc-debian12 provides glibc + libstdc++ + ca-certificates
              # at FHS paths, so foreign glibc-linked binaries (notably GitHub
              # Actions' /__e/node*/bin/node) and any prebuilt native modules
              # work out of the box. No shell, no coreutils — those we layer
              # on top from nixpkgs below.
              # Pinned to linux/amd64 manifest digest from gcr.io/distroless.
              baseImage = n2c.pullImage {
                imageName = "gcr.io/distroless/cc-debian12";
                imageDigest = "sha256:af49995f9f06255ca7d955735e5484a92018f4cfe95910952d9aee165cb96940";
                sha256 = "sha256-m8wB8PJCiCHhe12FIC44KOP6rtDKLqOgToU8EDvc1JE=";
                arch = "amd64";
                os = "linux";
              };

              # Tools the base image lacks — distroless is intentionally minimal,
              # so we add the standard POSIX toolkit that shell scripts and GHA
              # composite actions expect.
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
                pkgs.fontconfig
              ];

              # Fonts that headless browsers expect a real desktop to provide —
              # without these, Chromium falls back to a tiny set of stubs and
              # CSS-rendering tests (font-size assertions, text layout) fail.
              fonts = [
                pkgs.dejavu_fonts
                pkgs.liberation_ttf
                pkgs.noto-fonts
                pkgs.noto-fonts-color-emoji
              ];
              fontsConf = pkgs.makeFontsConf {
                fontDirectories = fonts;
              };

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
              fromImage = baseImage;
              # Tag is omitted → nix2container computes a content-addressed tag.
              config = {
                Env = [
                  "PATH=${pkgs.lib.makeBinPath (tools.packages ++ imageRuntime)}:/bin:/usr/bin:/sbin"
                  "PLAYWRIGHT_BROWSERS_PATH=${tools.playwrightBrowsers}"
                  "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1"
                  "PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1"
                  # Use the base image's FHS-located CA bundle so every TLS
                  # client (Node, curl, git, pnpm) finds it via the convention
                  # they each prefer.
                  "SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt"
                  "NIX_SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt"
                  "GIT_SSL_CAINFO=/etc/ssl/certs/ca-certificates.crt"
                  "CURL_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt"
                  "NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt"
                  "NPM_CONFIG_CAFILE=/etc/ssl/certs/ca-certificates.crt"
                  "FONTCONFIG_FILE=${fontsConf}"
                ];
              };
              copyToRoot = [
                (pkgs.buildEnv {
                  name = "dev-image-root";
                  paths = tools.packages ++ imageRuntime ++ fonts;
                  # Don't link /etc — keep distroless's /etc intact (it has
                  # /etc/passwd, /etc/ssl/certs, /etc/nsswitch.conf, etc.).
                  pathsToLink = [
                    "/bin"
                    "/share"
                  ];
                })
                gitConfig
              ];
            };
        }
      );
    };
}
