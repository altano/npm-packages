# package-time-traveler

package-time-traveler tells you what `npm i` would do for a given package.json file on any given date. It does this by adhering to the existing package.json's package version specs while restricting the package to versions published before a given date.

This might be useful if you have an old package that predates package-lock.json, and that package has misbehaved dependencies that don't respect semver. package-time-traveler can help you simulate what dependencies the original author would have been using.

## Usage

package-time-traveler /path/to/package.json DATE

## Example

If you'd like to replicate what `npm i` would have done on 2018-07-31 for the `termux-appium` package, you would:

1. `npm i -g package-time-traveler`
1. `git clone git@github.com:goodguysoftware/termux-appium.git`
1. `package-time-traveler termux-appium/package.json 2018-07-31`

```
{
  "dependencies": {
    "adbkit": "2.11.0",
    "appium-adb": "6.14.0",
    "appium-android-driver": "3.3.0",
    "appium-base-driver": "3.4.0",
    "appium-support": "2.20.0",
    "appium-uiautomator2-server": "1.13.0",
    "asyncbox": "2.4.0",
    "babel-runtime": "5.8.24",
    "bluebird": "3.5.1",
    "lodash": "4.17.10",
    "portscanner": "2.2.0",
    "request": "2.87.0",
    "request-promise": "4.2.2",
    "source-map-support": "0.5.6",
    "teen_process": "1.13.0",
    "utf7": "1.0.2",
    "ws": "6.0.0"
  },
  "devDependencies": {
    "android-apidemos": "3.0.0",
    "appium-gulp-plugins": "2.4.1",
    "appium-test-support": "1.0.0",
    "babel-eslint": "7.2.3",
    "chai": "4.1.2",
    "chai-as-promised": "7.1.1",
    "eslint": "3.19.0",
    "eslint-config-appium": "2.1.0",
    "eslint-plugin-babel": "3.3.0",
    "eslint-plugin-import": "2.13.0",
    "eslint-plugin-mocha": "4.12.1",
    "eslint-plugin-promise": "3.8.0",
    "gps-demo-app": "2.1.1",
    "gulp": "3.9.1",
    "pngjs": "3.3.3",
    "pre-commit": "1.2.2",
    "rimraf": "2.6.2",
    "sinon": "6.1.4",
    "unzip": "0.1.11",
    "wd": "1.10.3",
    "xmldom": "0.1.27",
    "xpath": "0.0.27"
  }
}
```

1. Replace the dependencies in termux-appium/package.json with the output above and then `npm i` again.
