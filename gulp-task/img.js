import { src, dest, series } from "gulp";
import del from "del";
import fs from "fs";

function img(cb) {
  let filepath = "./src/img";
  let exist = fs.existsSync(filepath);
  if (!exist) {
    console.log(`not found ${filepath}`);
    cb();
  }
  src(["../src/img/**/*"])
    .pipe(dest("../dev/img"))
    .pipe(dest("../public/img"));
  cb();
}

function cleanImg() {
  return del(["../dev/img/**/*", "../public/img/**/*"], { force: true });
}
const imgtask = series(cleanImg, img);
export { img, imgtask };
