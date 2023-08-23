var glob = require("glob");
var path = require("path");
var CDNTransformer = require(".");

const BASE_DIR = process.argv[2];
const PATHS_TO_PROCESS_GLOB = process.argv[3];
const OUTPUT_DIRECTORY = process.argv[4];

if (!BASE_DIR || !PATHS_TO_PROCESS_GLOB || !OUTPUT_DIRECTORY) {
  throw new Error("Invalid args");
}

glob(PATHS_TO_PROCESS_GLOB, {
  cwd: BASE_DIR,
  nodir: true,
  nonull: false,
  strict: true,
  nosort: true,
}, function(err: Error, files: string[]) {
  if (err) { throw err; }

  if (files && files.length > 0) {
    files.forEach(file => {
      // var outputFilePath = path.join(OUTPUT_DIRECTORY, file);

      // transformFile(BASE_DIR, file, outputFilePath);

      new CDNTransformer({
        cdnBaseUrl: "//cdn.alan.norbauer.com/cdn/",
        bufferPath: file
      }).write(OUTPUT_DIRECTORY);
    });
  }
});