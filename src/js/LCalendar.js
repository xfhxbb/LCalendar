class MobileCalendar {
  constructor() {
    this.gearDate;
    this.minY = 1900;
    this.minM = 1;
    this.minD = 1;
    this.maxY = 2099;
    this.maxM = 12;
    this.maxD = 31;
  }
  init(params) {
    this.type = params.type;
    this.trigger = document.querySelector(params.trigger);
    if (this.trigger.getAttribute("data-lcalendar") != null) {
      let arr = this.trigger.getAttribute("data-lcalendar").split(",");
      let minArr = arr[0].split("-");
      this.minY = ~~minArr[0];
      this.minM = ~~minArr[1];
      this.minD = ~~minArr[2];
      let maxArr = arr[1].split("-");
      this.maxY = ~~maxArr[0];
      this.maxM = ~~maxArr[1];
      this.maxD = ~~maxArr[2];
    }
    if (params.minDate) {
      let minArr = params.minDate.split("-");
      this.minY = ~~minArr[0];
      this.minM = ~~minArr[1];
      this.minD = ~~minArr[2];
    }
    if (params.maxDate) {
      let maxArr = params.maxDate.split("-");
      this.maxY = ~~maxArr[0];
      this.maxM = ~~maxArr[1];
      this.maxD = ~~maxArr[2];
    }
    this.bindEvent(this.type);
  }
  //求月份最大天数
  calcDays(year, month) {
    if (month == 1) {
      year += this.minY;
      if (
        (year % 4 == 0 && year % 100 != 0) ||
        (year % 400 == 0 && year % 4000 != 0)
      ) {
        return 29;
      } else {
        return 28;
      }
    } else {
      if (month == 3 || month == 5 || month == 8 || month == 10) {
        return 30;
      } else {
        return 31;
      }
    }
  }
  //初始化年月日时分插件默认值
  defaultValueInit() {
    let date = new Date();
    let dateArr = {
      yy: -1,
      mm: date.getMonth(),
      dd: date.getDate() - 1,
      hh: date.getHours(),
      mi: date.getMinutes(),
    };
    if (/^\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}$/.test(this.trigger.value)) {
      let [yy,mm,dd,hh,mi] = this.trigger.value.match(/(^|-|\s|:)\d{1,4}/g);
      dateArr.yy = yy - this.minY;
      dateArr.mm = mm.replace(/-/g, "") - 1;
      dateArr.dd = dd.replace(/-/g, "") - 1;
      dateArr.hh = ~~hh.replace(/\s0?/g, "");
      dateArr.mi = ~~mi.replace(/:0?/g, "");
    }
    //初始化年月日插件默认值
    else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(this.trigger.value)) {
      const [yy,mm,dd] = this.trigger.value.match(/(^|-)\d{1,4}/g);
      dateArr.yy = yy - this.minY;
      dateArr.mm = mm.replace(/-/g, "") - 1;
      dateArr.dd = dd.replace(/-/g, "") - 1;
    }
    //初始化年月插件默认值
    else if (/^\d{4}-\d{1,2}$/.test(this.trigger.value)) {
      let [yy,mm] = this.trigger.value.match(/(^|-)\d{1,4}/g);
      dateArr.yy = yy - this.minY;
      dateArr.mm = mm.replace(/-/g, "") - 1;
    }
    //初始化时分插件默认值
    else if (/^\d{2}:\d{2}$/.test(this.trigger.value)) {
      let [hh,mi] = this.trigger.value.match(/(^|:)\d{2}/g);
      dateArr.hh = ~~hh.replace(/^0?/g, "");
      dateArr.mi = ~~mi.replace(/:0?/g, "");
    }
    if (this.gearDate.querySelector(".date_yy")) {
      if(dateArr.yy<0){
        const nowY=date.getFullYear();
        const minY =nowY - this.minY;
        const maxY =nowY - this.maxY;
        if(minY<=0){
          dateArr.yy=0;
          const minM=this.minM-1;
          const minD=this.minD-1;
          if(dateArr.mm<=minM){
            dateArr.mm=minM;
            dateArr.dd=minD;
          }
        }else if(maxY>=0){
          dateArr.yy=minY;
          const maxM=this.maxM-1;
          const maxD=this.maxD-1;
          if(dateArr.mm>=maxM){
            dateArr.mm=maxM;
            dateArr.dd=maxD;
          }
        }else{
          dateArr.yy=minY;
        }
      }
      this.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
      this.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
      if (this.gearDate.querySelector(".date_dd")) {
        this.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd);
      }
      this.setDateGearTooth();
    }
    if (
      this.gearDate.querySelector(".time_hh") &&
      this.gearDate.querySelector(".time_mm")
    ) {
      this.gearDate.querySelector(".time_hh").setAttribute("val", dateArr.hh);
      this.gearDate.querySelector(".time_mm").setAttribute("val", dateArr.mi);
      this.setTimeGearTooth();
    }
  }
  //重置时间节点个数
  setTimeGearTooth() {
    let time_hh = this.gearDate.querySelector(".time_hh");
    if (time_hh && time_hh.getAttribute("val")) {
      let i = "";
      let hhVal = parseInt(time_hh.getAttribute("val"));
      for (let g = 0; g <= 23; g++) {
        i += "<div class='tooth'>" + g + "</div>";
      }
      time_hh.innerHTML = i;
      time_hh.style["-webkit-transform"] =
        "translate3d(0," + (8 - hhVal * 2) + "em,0)";
      time_hh.setAttribute("top", 8 - hhVal * 2 + "em");
    } else {
      return;
    }
    let time_mm = this.gearDate.querySelector(".time_mm");
    if (time_mm && time_mm.getAttribute("val")) {
      let i = "";
      let mmVal = parseInt(time_mm.getAttribute("val"));
      for (let g = 0; g <= 59; g++) {
        i += "<div class='tooth'>" + g + "</div>";
      }
      time_mm.innerHTML = i;
      time_mm.style["-webkit-transform"] =
        "translate3d(0," + (8 - mmVal * 2) + "em,0)";
      time_mm.setAttribute("top", 8 - mmVal * 2 + "em");
    } else {
      return;
    }
  }
  //重置节点个数
  setDateGearTooth() {
    let newY = new Date().getFullYear();
    let passY = this.maxY - this.minY + 1;
    let date_yy = this.gearDate.querySelector(".date_yy");
    let itemStr = "";
    if (!date_yy || !date_yy.getAttribute("val")) {
      return;
    }
    //得到年份的值
    let yyVal = parseInt(date_yy.getAttribute("val"));
    //p 当前节点前后需要展示的节点个数
    for (let p = 0; p <= passY - 1; p++) {
      itemStr += "<div class='tooth'>" + (this.minY + p) + "</div>";
    }
    date_yy.innerHTML = itemStr;
    let top = Math.floor(parseFloat(date_yy.getAttribute("top")));
    if (!isNaN(top)) {
      top % 2 == 0 ? (top = top) : (top = top + 1);
      top > 8 && (top = 8);
      let minTop = 8 - (passY - 1) * 2;
      top < minTop && (top = minTop);
      date_yy.style["-webkit-transform"] = "translate3d(0," + top + "em,0)";
      date_yy.setAttribute("top", top + "em");
      yyVal = Math.abs(top - 8) / 2;
      date_yy.setAttribute("val", yyVal);
    } else {
      let minTop = 8 - (passY - 1) * 2;
      let gearVal = Math.abs(minTop - 8) / 2;
      if (this.maxY < newY) {
        yyVal > gearVal && (yyVal = gearVal);
      } else if (this.minY > newY) {
        if(yyVal > gearVal){
          yyVal = gearVal
        }
      }
      date_yy.style["-webkit-transform"] =
        "translate3d(0," + (8 - yyVal * 2) + "em,0)";
      date_yy.setAttribute("top", 8 - yyVal * 2 + "em");
    }
    let date_mm = this.gearDate.querySelector(".date_mm");
    if (!date_mm || !date_mm.getAttribute("val")) {
      return;
    }
    itemStr = "";
    //得到月份的值
    let mmVal = parseInt(date_mm.getAttribute("val"));
    let maxM = 11;
    let minM = 0;
    //当年份到达最大值
    if (yyVal == passY - 1) {
      maxM = this.maxM - 1;
    }
    //当年份到达最小值
    if (yyVal == 0) {
      minM = this.minM - 1;
    }
    //p 当前节点前后需要展示的节点个数
    for (let p = 0; p < maxM - minM + 1; p++) {
      itemStr += "<div class='tooth'>" + (minM + p + 1) + "</div>";
    }
    date_mm.innerHTML = itemStr;
    if (mmVal > maxM) {
      mmVal = maxM;
    } else if (mmVal <= minM) {
      mmVal = minM;
    }
    date_mm.setAttribute("val", mmVal);
    date_mm.style["-webkit-transform"] =
      "translate3d(0," + (8 - (mmVal - minM) * 2) + "em,0)";
    date_mm.setAttribute("top", 8 - (mmVal - minM) * 2 + "em");
    let date_dd = this.gearDate.querySelector(".date_dd");
    if (date_dd && date_dd.getAttribute("val")) {
      itemStr = "";
      //得到日期的值
      let ddVal = parseInt(date_dd.getAttribute("val"));
      //返回月份的天数
      let maxMonthDays = this.calcDays(yyVal, mmVal);
      //p 当前节点前后需要展示的节点个数
      let maxD = maxMonthDays - 1;
      let minD = 0;
      //当年份月份到达最大值
      if (yyVal == passY - 1 && this.maxM == mmVal + 1) {
        maxD = this.maxD - 1;
        if (ddVal > maxD) {
          ddVal = maxD;
        }
      }
      //当年、月到达最小值
      if (yyVal == 0 && this.minM == mmVal + 1) {
        minD = this.minD - 1;
        if (ddVal <= minD) {
          ddVal = minD;
        }
      }
      for (let p = 0; p < maxD - minD + 1; p++) {
        itemStr += "<div class='tooth'>" + (minD + p + 1) + "</div>";
      }
      date_dd.innerHTML = itemStr;
      date_dd.setAttribute("val", ddVal);
      date_dd.style["-webkit-transform"] =
        "translate3d(0," + (8 - (ddVal - minD) * 2) + "em,0)";
      date_dd.setAttribute("top", 8 - (ddVal - minD) * 2 + "em");
    } else {
      return;
    }
  }
  //控制插件滚动后停留的值
  setGear() {
    return (target, val) => {
      if (this.gearDate !== null && !isNaN(val)) {
        val = Math.round(val);
        target.setAttribute("val", val);
        if (/date/.test(target.dataset.datetype)) {
          this.setDateGearTooth();
        } else {
          this.setTimeGearTooth();
        }
      }
    };
  }
  //缓动效果
  rollGear(target) {
    let setgear = this.setGear();
    let d = 0,
      stopGear = false,
      passY = this.maxY - this.minY + 1;
    const setDuration = () => {
      target.style.webkitTransitionDuration = target.style.transitionDuration =
        "200ms";
      stopGear = true;
    };
    cancelAnimationFrame(target["int_" + target.id]);
    const animate = () => {
      if (!this.gearDate) {
        cancelAnimationFrame(target["int_" + target.id]);
        return;
      }
      let pos = target["pos_" + target.id];
      let speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
      pos += speed;
      if (Math.abs(speed) > 0.1) {
      } else {
        let b = Math.round(pos / 2) * 2;
        pos = b;
        setDuration();
      }
      if (pos > 8) {
        pos = 8;
        setDuration();
      }
      let minTop, yyVal;
      let date_yy = this.gearDate.querySelector(".date_yy");
      switch (target.dataset.datetype) {
        case "date_yy":
          minTop = 8 - (passY - 1) * 2;
          if (pos < minTop) {
            pos = minTop;
            setDuration();
          }
          if (stopGear) {
            let gearVal = Math.abs(pos - 8) / 2;
            setgear(target, gearVal);
            cancelAnimationFrame(target["int_" + target.id]);
          }
          break;
        case "date_mm":
          //得到年份的值
          yyVal = parseInt(date_yy.getAttribute("val"));
          let maxM = 11;
          let minM = 0;
          //当年份到达最大值
          if (yyVal == passY - 1) {
            maxM = this.maxM - 1;
          }
          //当年份到达最小值
          if (yyVal == 0) {
            minM = this.minM - 1;
          }
          minTop = 8 - (maxM - minM) * 2;
          if (pos < minTop) {
            pos = minTop;
            setDuration();
          }
          if (stopGear) {
            let gearVal = Math.abs(pos - 8) / 2 + minM;
            setgear(target, gearVal);
            cancelAnimationFrame(target["int_" + target.id]);
          }
          break;
        case "date_dd":
          let date_mm = this.gearDate.querySelector(".date_mm");
          //得到年份的值
          yyVal = parseInt(date_yy.getAttribute("val"));
          //得到月份的值
          let mmVal = parseInt(date_mm.getAttribute("val"));
          //返回月份的天数
          let maxMonthDays = this.calcDays(yyVal, mmVal);
          let maxD = maxMonthDays - 1;
          let minD = 0;
          //当年份月份到达最大值
          if (yyVal == passY - 1 && this.maxM == mmVal + 1) {
            maxD = this.maxD - 1;
          }
          //当年、月到达最小值
          if (yyVal == 0 && this.minM == mmVal + 1) {
            minD = this.minD - 1;
          }
          minTop = 8 - (maxD - minD) * 2;
          if (pos < minTop) {
            pos = minTop;
            setDuration();
          }
          if (stopGear) {
            let gearVal = Math.abs(pos - 8) / 2 + minD;
            setgear(target, gearVal);
            cancelAnimationFrame(target["int_" + target.id]);
          }
          break;
        case "time_hh":
          if (pos < -38) {
            pos = -38;
            setDuration();
          }
          if (stopGear) {
            let gearVal = Math.abs(pos - 8) / 2;
            setgear(target, gearVal);
            cancelAnimationFrame(target["int_" + target.id]);
          }
          break;
        case "time_mm":
          if (pos < -110) {
            pos = -110;
            setDuration();
          }
          if (stopGear) {
            let gearVal = Math.abs(pos - 8) / 2;
            setgear(target, gearVal);
            cancelAnimationFrame(target["int_" + target.id]);
          }
          break;
        default:
      }
      target["pos_" + target.id] = pos;
      target.style["-webkit-transform"] = "translate3d(0," + pos + "em,0)";
      target.setAttribute("top", pos + "em");
      d++;
      if (!stopGear) {
        requestAnimationFrame(animate);
      }
    };
    target["int_" + target.id] = requestAnimationFrame(animate);
  }
  //触摸开始
  handleTouchStart() {
    return (e) => {
      e.preventDefault();
      let target = e.target;
      while (true) {
        if (!target.classList.contains("gear")) {
          target = target.parentElement;
        } else {
          break;
        }
      }
      cancelAnimationFrame(target["int_" + target.id]);
      target["old_" + target.id] = e.targetTouches[0].screenY;
      target["o_t_" + target.id] = new Date().getTime();
      let top = target.getAttribute("top");
      if (top) {
        target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
      } else {
        target["o_d_" + target.id] = 0;
      }
      target.style.webkitTransitionDuration = target.style.transitionDuration =
        "0ms";
    };
  }
  //手指移动
  handleTouchMove(gearTouchEnd) {
    return (e) => {
      e.preventDefault();
      let target = e.target;
      while (true) {
        if (!target.classList.contains("gear")) {
          target = target.parentElement;
        } else {
          break;
        }
      }
      target["new_" + target.id] = e.targetTouches[0].screenY;
      target["n_t_" + target.id] = new Date().getTime();
      let f =
        ((target["new_" + target.id] - target["old_" + target.id]) * 30) /
        window.innerHeight;
      target["pos_" + target.id] = target["o_d_" + target.id] + f;
      target.style["-webkit-transform"] =
        "translate3d(0," + target["pos_" + target.id] + "em,0)";
      target.setAttribute("top", target["pos_" + target.id] + "em");
      if (e.targetTouches[0].screenY < 1) {
        gearTouchEnd(e);
      }
    };
  }
  //离开屏幕
  handleTouchEnd() {
    return (e) => {
      e.preventDefault();
      let target = e.target;
      while (true) {
        if (!target.classList.contains("gear")) {
          target = target.parentElement;
        } else {
          break;
        }
      }
      let flag =
        (target["new_" + target.id] - target["old_" + target.id]) /
        (target["n_t_" + target.id] - target["o_t_" + target.id]);
      if (Math.abs(flag) <= 0.2) {
        target["spd_" + target.id] = flag < 0 ? -0.08 : 0.08;
      } else {
        if (Math.abs(flag) <= 0.5) {
          target["spd_" + target.id] = flag < 0 ? -0.16 : 0.16;
        } else {
          target["spd_" + target.id] = flag / 2;
        }
      }
      if (!target["pos_" + target.id]) {
        target["pos_" + target.id] = 0;
      }
      this.rollGear(target);
    };
  }
  //销毁
  destroy() {
    return (e) => {
      e.preventDefault();
      let evt;
      try {
        evt = new CustomEvent("input");
      } catch (e) {
        //兼容旧浏览器(注意：该方法已从最新的web标准中删除)
        evt = document.createEvent("Event");
        evt.initEvent("input", true, true);
      }
      this.trigger.dispatchEvent(evt);
      document.body.removeChild(this.gearDate);
      this.gearDate = null;
    };
  }
  //确认
  confirm(closeCalendar) {
    return (e) => {
      let passY, date_yy, date_mm, date_dd, time_hh, time_mm;
      let Y = this.gearDate.querySelector(".date_yy");
      let M = this.gearDate.querySelector(".date_mm");
      if (Y) {
        passY = this.maxY - this.minY + 1;
        date_yy = parseInt(Math.round(Y.getAttribute("val")));
        date_mm = parseInt(Math.round(M.getAttribute("val"))) + 1;
        date_mm = date_mm > 9 ? date_mm : "0" + date_mm;
      }
      let D = this.gearDate.querySelector(".date_dd");
      if (D) {
        date_dd = parseInt(Math.round(D.getAttribute("val"))) + 1;
        date_dd = date_dd > 9 ? date_dd : "0" + date_dd;
      }
      let H = this.gearDate.querySelector(".time_hh");
      let MI = this.gearDate.querySelector(".time_mm");
      if (H) {
        time_hh = parseInt(Math.round(H.getAttribute("val")));
        time_hh = time_hh > 9 ? time_hh : "0" + time_hh;
        time_mm = parseInt(Math.round(MI.getAttribute("val")));
        time_mm = time_mm > 9 ? time_mm : "0" + time_mm;
      }
      this.trigger.value = `${
        date_yy >= 0 ? (date_yy % passY) + this.minY : ""
      }${date_mm ? `-${date_mm}` : ""}${date_dd ? `-${date_dd}` : ""}${
        date_dd && time_hh ? " " : ""
      }${
        time_hh
          ? `${
              (time_hh.length < 2 ? "0" : "") +
              time_hh +
              (time_mm.length < 2 ? ":0" : ":") +
              time_mm
            }`
          : ""
      }`;
      closeCalendar(e);
    };
  }
  //呼出插件
  popup(className, template) {
    return () => {
      this.gearDate = document.createElement("div");
      this.gearDate.className = className;
      this.gearDate.innerHTML = template;
      document.body.appendChild(this.gearDate);
      this.bind();
    };
  }
  //呼出插件后绑定事件
  bind() {
    this.defaultValueInit();
    let closeCalendar = this.destroy();
    let confirmValue = this.confirm(closeCalendar);
    let gearTouchStart = this.handleTouchStart();
    let gearTouchEnd = this.handleTouchEnd();
    let gearTouchMove = this.handleTouchMove(gearTouchEnd);
    let lcalendar_cancel = this.gearDate.querySelector(".lcalendar_cancel");
    lcalendar_cancel.addEventListener("touchstart", closeCalendar);
    let lcalendar_finish = this.gearDate.querySelector(".lcalendar_finish");
    lcalendar_finish.addEventListener("touchstart", confirmValue);
    let date_yy = this.gearDate.querySelector(".date_yy");
    let date_mm = this.gearDate.querySelector(".date_mm");
    let date_dd = this.gearDate.querySelector(".date_dd");
    let time_hh = this.gearDate.querySelector(".time_hh");
    let time_mm = this.gearDate.querySelector(".time_mm");
    if (date_yy) {
      date_yy.addEventListener("touchstart", gearTouchStart);
      date_mm.addEventListener("touchstart", gearTouchStart);
      date_yy.addEventListener("touchmove", gearTouchMove);
      date_mm.addEventListener("touchmove", gearTouchMove);
      date_yy.addEventListener("touchend", gearTouchEnd);
      date_mm.addEventListener("touchend", gearTouchEnd);
      if (date_dd) {
        date_dd.addEventListener("touchstart", gearTouchStart);
        date_dd.addEventListener("touchmove", gearTouchMove);
        date_dd.addEventListener("touchend", gearTouchEnd);
      }
    }
    if (time_hh) {
      time_hh.addEventListener("touchstart", gearTouchStart);
      time_mm.addEventListener("touchstart", gearTouchStart);
      time_hh.addEventListener("touchmove", gearTouchMove);
      time_mm.addEventListener("touchmove", gearTouchMove);
      time_hh.addEventListener("touchend", gearTouchEnd);
      time_mm.addEventListener("touchend", gearTouchEnd);
    }
  }
  bindEvent(type) {
    function getTemp(containsStr, str) {
      let tempStr = `<div class="date_ctrl slideInUp">
            <div class="date_btn_box">
            <div class="date_btn lcalendar_cancel">取消</div>
            <div class="date_btn lcalendar_finish">确定</div>
            </div>
            <div class="date_roll_mask">
            <div class="${str ? str : "date_roll"}">
            ${containsStr}
            </div>
            </div>
            </div>`;
      return tempStr;
    }
    let ystr = `<div>
        <div class="gear date_yy" data-datetype="date_yy"></div>
        <div class="date_grid">
        <div>年</div>
        </div>
        </div>`;
    let mstr = `<div>
        <div class="gear date_mm" data-datetype="date_mm"></div>
        <div class="date_grid">
        <div>月</div>
        </div>
        </div>`;
    let dstr = `<div>
        <div class="gear date_dd" data-datetype="date_dd"></div>
        <div class="date_grid">
        <div>日</div>
        </div>
        </div>`;
    let hstr = `<div>
        <div class="gear time_hh" data-datetype="time_hh"></div>
        <div class="date_grid">
        <div>时</div>
        </div>
        </div>`;
    let mistr = `<div>
        <div class="gear time_mm" data-datetype="time_mm"></div>
        <div class="date_grid">
        <div>分</div>
        </div>
        </div>`;
    this.trigger.addEventListener(
      "click",
      {
        ym: this.popup("gearDate", getTemp(`${ystr}${mstr}`, "ym_roll")), //呼出年月插件
        date: this.popup("gearDate", getTemp(`${ystr}${mstr}${dstr}`)), //呼出年月日插件
        datetime: this.popup(
          "gearDatetime",
          getTemp(`${ystr}${mstr}${dstr}${hstr}${mistr}`, "datetime_roll")
        ), //呼出日期+时间插件
        time: this.popup("gearDate", getTemp(`${hstr}${mistr}`, "time_roll")), //呼出时间插件
      }[type]
    );
  }
}
window.LCalendar = MobileCalendar;
export default MobileCalendar;
