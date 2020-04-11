"use strict";
import fs from "fs";
import gulp from "gulp";
/*======= 文件删除 ======*/
import del from "del";
import child_process from "child_process";
import bs from "browser-sync";
import { font, fonttask } from "./font";
import { img, imgtask } from "./img";
import { jstask } from "./script";
import { htmltask } from "./html";

let browserSync = bs.create();
let exist = fs.existsSync('./dev');
if (!exist) {
  fs.mkdirSync('dev');
}

/*======= css ======*/
function css() {
  return gulp
    .src(["../src/css/**/*"])
    .pipe(gulp.dest("../dev/css"))
    .pipe(gulp.dest("../public/css"));
}
/*======= lib ======*/
function lib() {
  return gulp
    .src(["../src/lib/**/*"])
    .pipe(gulp.dest("../dev/lib"))
    .pipe(gulp.dest("../public/lib"));
}

function clean() {
  return del(
    [
      "../dev/font/**/*",
      "../public/font/**/*",
      "../dev/img/**/*",
      "../public/img/**/*",
      "../dev/js/**/*",
      "../public/js/**/*",
      "../dev/html/**/*",
      "../public/html/**/*",
      "../dev/css/**/*",
      "../public/css/**/*"
    ],
    { force: true }
  );
}

let process,
  restart = function() {
    process && process.kill();
    process = child_process.spawn("gulp.cmd", ["run"], {
      stdio: "inherit"
    });
  };
function server(cb) {
  browserSync.init({
    server: {
      baseDir: "../"
    },
    startPath: "/dev/html/index.html"
  });
  cb();
}
function reload(done) {
  browserSync.reload();
  done();
}
function watch() {
  gulp.watch("../src/lib/**/*", lib);
  gulp.watch("../src/css/**/*", css);
  gulp.watch("../src/font/**/*", fonttask);
  gulp.watch("../src/img/**/*", imgtask);
  gulp.watch("../src/js/**/*", gulp.series(htmltask, jstask, reload));
  gulp.watch("../src/html/**", gulp.series(htmltask, reload));
  gulp.watch("./*.js", restart);
}

exports.run = gulp.series(
  clean,
  gulp.parallel(lib, font, img, css, jstask),
  htmltask,
  server,
  watch,
  done => {
    done();
  }
);

/*
 * auto restart gulp
 **/
exports.default = () => {
  restart();
};
