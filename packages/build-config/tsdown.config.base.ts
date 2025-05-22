import type { UserConfig } from "tsdown";
import UnpluginUnused from "unplugin-unused/rolldown";

const config: UserConfig = {
  dts: true,
  clean: true,
  inputOptions: {
    plugins: [
      UnpluginUnused({
        level: "error",
        ignore: [
          "@fontsource/inter", // doesn't seem to understand import.meta.resolve
        ],
      }),
    ],
  },
};

export default config;
