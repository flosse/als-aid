var gulp = require("gulp");
var replace = require("gulp-replace");
var rename = require("gulp-rename");
var fs = require("fs");
var minimist = require("minimist");
var options = minimist(process.argv.slice(2), {});

gulp.task("process-env", function() {

  if (typeof options.use === "undefined") {
    console.log("Error: Please use --use parameter.");
    process.exit(0);
  }

  var env = JSON.parse(fs.readFileSync("./.env/" + options.use + ".env", "utf8"));

  gulp.src("./.env/__ionic.config.json")
    .pipe(rename("ionic.config.json"))
    .pipe(replace("@proxy@", env.proxy))
    .pipe(gulp.dest("./"));

  gulp.src("./src/AlsAID/Config/Config.ts")
    .pipe(replace(/endpoint: "[^"]*"/,'endpoint: "' + env.endpoint + '"'))
    .pipe(replace(/endpoint: '[^']*'/,'endpoint: "' + env.endpoint + '"'))
    .pipe(gulp.dest("./src/AlsAID/Config/"));
});

gulp.task("process-version", function() {

  if (typeof options.use === "undefined") {
    console.log("Error: Please use --use parameter.");
    process.exit(0);
  }

  gulp.src("./config.xml")
    .pipe(replace(/version="\d+\.\d+\.\d+"/,'version="' + options.use + '"'))
    .pipe(gulp.dest("./"));

  gulp.src("./src/AlsAID/Config/Config.ts")
    .pipe(replace(/version: "[^"]*"/,'version: "' + options.use + '"'))
    .pipe(replace(/version: '[^']*'/,'version: "' + options.use + '"'))
    .pipe(gulp.dest("./src/AlsAID/Config/"));
});

gulp.task("env", ["process-env"], function () {
  console.log("Application has been converted to {" + options.use + "} environment. Run {ionic build} to refresh.");
});

gulp.task("version", ["process-version"], function () {
  console.log("Application version has been updated to {" + options.use + "}. Run {ionic build} to refresh.\nNow, make sure to:\n- Git tag with this version\n- Update backend to accept connections from this version.");
});