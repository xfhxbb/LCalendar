import { src, dest, series } from "gulp";
import del from "del";
import fileinclude from "gulp-file-include";
/*======= 文件MD5时间戳 ======*/
import cachebust from "gulp-cache-bust";

function html(cb) {
  src(["../src/html/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      })
    )
    .pipe(
      cachebust({
        type: "timestamp"
      })
    )
    .pipe(dest("../dev/html"))
    .pipe(dest("../public/html"));
  cb();
}

function cleanHtml() {
  return del(["../dev/html/**/*", "../public/html/**/*"], { force: true });
}

const htmltask = series(cleanHtml, html);
export { html, htmltask };
