import { src, dest, series } from "gulp";
import del from "del";
import fs from "fs";

function font(cb) {
  let filepath = "./src/font";
  let exist = fs.existsSync(filepath);
  if (!exist) {
    console.log(`not found ${filepath}`);
    cb();
  }
  src(["../src/font/**/*"])
    .pipe(dest("../dev/font"))
    .pipe(dest("../public/font"));
  cb();
}

function cleanFont() {
  return del(["../dev/font/**/*", "../public/font/**/*"], { force: true });
}
const fonttask = series(cleanFont, font);
export { font, fonttask };
