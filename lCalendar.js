/*
 * lCalendar日期控件
 * 
 * 作者：黄磊
 * 
 * 邮箱：xfhxbb@yeah.net
 * 
 * Copyright 2016
 * 
 * 创建于：2016-01-08
 */
var hlCalendar = {
        params: {
            minY: 1900, //
            minM: 1,
            minD: 1,
            maxY: 2099,
            maxM: 12,
            maxD: 31
        }
    }
    //初始化默认年段
var passY = hlCalendar.params.maxY - hlCalendar.params.minY + 1;
//呼出日期插件
function editDate(e) {
    hlCalendar.listener = e.target;
    hlCalendar.gearDate = document.querySelector(".gearDate");
    if (!hlCalendar.gearDate) {
        hlCalendar.gearDate = document.createElement("div");
        hlCalendar.gearDate.className = "gearDate";
        hlCalendar.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
            '<div class="date_btn_box">' +
            '<div class="date_btn" onclick="cancelDateEdit();">取消</div>' +
            '<div class="date_btn" onclick="finishDateEdit();">确定</div>' +
            '</div>' +
            '<div class="date_roll_mask">' +
            '<div class="date_roll">' +
            '<div>' +
            '<div class="gear date_yy" data-datetype="date_yy" ontouchstart="gearTouchStart(event)" ontouchmove="gearTouchMove(event)" ontouchend="gearTouchEnd(event)" onmousewheel="gearScroll(event)"></div>' +
            '<div class="date_grid" onmousewheel="gearScroll(event)">' +
            '<div>年</div>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<div class="gear date_mm" data-datetype="date_mm" ontouchstart="gearTouchStart(event)" ontouchmove="gearTouchMove(event)" ontouchend="gearTouchEnd(event)" onmousewheel="gearScroll(event)"></div>' +
            '<div class="date_grid" onmousewheel="gearScroll(event)">' +
            '<div>月</div>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<div class="gear date_dd" data-datetype="date_dd" ontouchstart="gearTouchStart(event)" ontouchmove="gearTouchMove(event)" ontouchend="gearTouchEnd(event)" onmousewheel="gearScroll(event)"></div>' +
            '<div class="date_grid" onmousewheel="gearScroll(event)">' +
            '<div>日</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        document.body.appendChild(hlCalendar.gearDate);
    }

    //得到插件初始化参数集合
    if (hlCalendar.listener.getAttribute("data-hl-calendar") != null) {
        var paramsArr = hlCalendar.listener.getAttribute("data-hl-calendar").split(',');
        var minDate = paramsArr[0]; //第一个值为最小日期
        var minArr = minDate.split('-');
        hlCalendar.params.minY = ~~minArr[0];
        hlCalendar.params.minM = ~~minArr[1]; //最小月
        hlCalendar.params.minD = ~~minArr[2]; //最小日
        var maxDate = paramsArr[1]; //第二个值为最大日期
        var maxArr = maxDate.split('-');
        hlCalendar.params.maxY = ~~maxArr[0];
        passY = hlCalendar.params.maxY - hlCalendar.params.minY + 1;
        hlCalendar.params.maxM = ~~maxArr[1]; //最大月
        hlCalendar.params.maxD = ~~maxArr[2]; //最大日
    }
    dateCtrlInit();
    if (!hlCalendar.gearDate.style.display || hlCalendar.gearDate.style.display == "none") {
        hlCalendar.gearDate.style.display = "block";
    }

}
//初始化插件默认值
function dateCtrlInit() {
    var date = new Date();
    var dateArr = {
        yy: date.getYear(),
        mm: date.getMonth(),
        dd: date.getDate() - 1
    };
    //hlCalendar.gearDate.querySelector(".date_head").innerHTML = "今天：" + (dateArr.yy + 1900) + "-" + (dateArr.mm + 1) + "-" + (dateArr.dd + 1);
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(hlCalendar.listener.value)) {
        rs = hlCalendar.listener.value.match(/(^|-)\d{1,4}/g);
        dateArr.yy = rs[0] - hlCalendar.params.minY;
        dateArr.mm = rs[1].replace(/-/g, "") - 1;
        dateArr.dd = rs[2].replace(/-/g, "") - 1;
    } else {
        dateArr.yy = dateArr.yy + 1900 - hlCalendar.params.minY;
    }
    hlCalendar.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
    hlCalendar.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
    hlCalendar.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd);
    setDateGear();
}
//重置日期节点个数
function setDateGear() {
    var date_yy = hlCalendar.gearDate.querySelector(".date_yy");
    var itemStr = "";
    if (date_yy && date_yy.getAttribute("val")) {
        //得到年份的值
        var yyVal = parseInt(date_yy.getAttribute("val"));
        //p 当前节点前后需要展示的节点个数
        for (var p = 0; p <= passY - 1; p++) {
            itemStr += "<div class='tooth'>" + (hlCalendar.params.minY + p) + "</div>";
        }
        date_yy.innerHTML = itemStr;
        var top = Math.floor(parseFloat(date_yy.style.top));
        if (!isNaN(top)) {
            top % 2 == 0 ? (top = top) : (top = top + 1);
            top > 8 && (top = 8);
            var minTop = 8 - (passY - 1) * 2;
            top < minTop && (top = minTop);
            date_yy.style.top = top + 'em';
            yyVal = Math.abs(top - 8) / 2;
            date_yy.setAttribute("val", yyVal);
        } else {
            date_yy.style.top = 8 - yyVal * 2 + 'em';
        }
    } else {
        return;
    }
    var date_mm = hlCalendar.gearDate.querySelector(".date_mm");
    if (date_mm && date_mm.getAttribute("val")) {
        itemStr = "";
        //得到月份的值
        var mmVal = parseInt(date_mm.getAttribute("val"));
        var maxM = 12;
        minM = 1;
        //当年份到达最大值
        if (yyVal == passY - 1) {
            maxM = hlCalendar.params.maxM;
        }
        //当年份到达最小值
        if (yyVal == 0) {
            minM = hlCalendar.params.minM;
        }
        //没滑动过
        var top = Math.floor(parseFloat(date_mm.style.top));
        if (!isNaN(top)) {
            top % 2 == 0 ? (top = top) : (top = top + 1);
            top > 8 && (top = 8);
            var minTop = 8 - (maxM - minM) * 2;
            top < minTop && (top = minTop);
            date_mm.style.top = top + 'em';
            mmVal = Math.abs(top - 8) / 2;
            date_mm.setAttribute("val", mmVal);
        } else {
            date_mm.style.top = 8 - mmVal * 2 + 'em';
        }
        //p 当前节点前后需要展示的节点个数
        for (var p = 0; p < (maxM - minM + 1); p++) {
            itemStr += "<div class='tooth'>" + (minM + p) + "</div>";
        }
        date_mm.innerHTML = itemStr;
    } else {
        return;
    }
    var date_dd = hlCalendar.gearDate.querySelector(".date_dd");
    if (date_dd && date_dd.getAttribute("val")) {
        itemStr = "";
        //得到日期的值
        var ddVal = parseInt(date_dd.getAttribute("val"));
        //返回月份的天数
        var maxMonthDays = calcDays(yyVal, mmVal);
        //p 当前节点前后需要展示的节点个数
        var maxD = maxMonthDays;
        minD = 1;
        //当年份月份到达最大值
        if (yyVal == passY - 1 && hlCalendar.params.maxM == mmVal + 1) {
            maxD = hlCalendar.params.maxD;
        }
        //当年份月份到达最小值
        if (yyVal == 0 && mmVal == 0) {
            minD = hlCalendar.params.minD;
        }
        var top = Math.floor(parseFloat(date_dd.style.top));
        //没滑动过
        if (!isNaN(top)) {
            top % 2 == 0 ? (top = top) : (top = top + 1);
            top > 8 && (top = 8);
            var minTop = 8 - (maxD - minD) * 2;
            top < minTop && (top = minTop);
            date_dd.style.top = top + 'em';
            ddVal = Math.abs(top - 8) / 2;
            date_dd.setAttribute("val", ddVal);
        } else {
            date_dd.style.top = 8 - ddVal * 2 + 'em';
        }
        for (var p = 0; p < (maxD - minD + 1); p++) {
            itemStr += "<div class='tooth'>" + (minD + p) + "</div>";
        }
        date_dd.innerHTML = itemStr;
    } else {
        return;
    }
}
//返回月份的天数
function calcDays(year, month) {
    if (month == 1) {
        year += hlCalendar.params.minY;
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year % 4000 != 0)) {
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

//呼出日期+时间插件
function editDatetime(e) {
    hlCalendar.listener = e.target;
    hlCalendar.gearDate = document.querySelector(".gearDatetime");
    if (!hlCalendar.gearDate) {
        hlCalendar.gearDate = document.createElement("div");
        hlCalendar.gearDate.className = "gearDatetime";
        hlCalendar.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
            '<div class="date_btn_box">' +
            '<div class="date_btn" onclick="cancelDateEdit();">取消</div>' +
            '<div class="date_btn" onclick="finishDatetimeEdit();">确定</div>' +
            '</div>' +
            '<div class="date_roll_mask">' +
            '<div class="datetime_roll">' +
            '<div>' +
            '<div class="gear date_yy" data-datetype="date_yy" ontouchstart="gearTouchStart(event)" ontouchmove="gearTouchMove(event)" ontouchend="gearTouchEnd(event)" onmousewheel="gearScroll(event)"></div>' +
            '<div class="date_grid" onmousewheel="gearScroll(event)">' +
            '<div>年</div>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<div class="gear date_mm" data-datetype="date_mm" ontouchstart="gearTouchStart(event)" ontouchmove="gearTouchMove(event)" ontouchend="gearTouchEnd(event)" onmousewheel="gearScroll(event)"></div>' +
            '<div class="date_grid" onmousewheel="gearScroll(event)">' +
            '<div>月</div>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<div class="gear date_dd" data-datetype="date_dd" ontouchstart="gearTouchStart(event)" ontouchmove="gearTouchMove(event)" ontouchend="gearTouchEnd(event)" onmousewheel="gearScroll(event)"></div>' +
            '<div class="date_grid" onmousewheel="gearScroll(event)">' +
            '<div>日</div>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<div class="gear time_hh" data-datetype="time_hh" ontouchstart="gearTouchStart(event)" ontouchmove="gearTouchMove(event)" ontouchend="gearTouchEnd(event)" onmousewheel="gearScroll(event)"></div>' +
            '<div class="date_grid" onmousewheel="gearScroll(event)">' +
            '<div>时</div>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<div class="gear time_mm" data-datetype="time_mm" ontouchstart="gearTouchStart(event)" ontouchmove="gearTouchMove(event)" ontouchend="gearTouchEnd(event)" onmousewheel="gearScroll(event)"></div>' +
            '<div class="date_grid" onmousewheel="gearScroll(event)">' +
            '<div>分</div>' +
            '</div>' +
            '</div>' +
            '</div>' + //date_roll
            '</div>' + //date_roll_mask
            '</div>';
        document.body.appendChild(hlCalendar.gearDate);
    }

    //得到插件初始化参数集合
    if (hlCalendar.listener.getAttribute("data-hl-calendar") != null) {
        var paramsArr = hlCalendar.listener.getAttribute("data-hl-calendar").split(',');
        var minDate = paramsArr[0]; //第一个值为最小日期
        var minArr = minDate.split('-');
        hlCalendar.params.minY = ~~minArr[0];
        hlCalendar.params.minM = ~~minArr[1]; //最小月
        hlCalendar.params.minD = ~~minArr[2]; //最小日
        var maxDate = paramsArr[1]; //第二个值为最大日期
        var maxArr = maxDate.split('-');
        hlCalendar.params.maxY = ~~maxArr[0];
        passY = hlCalendar.params.maxY - hlCalendar.params.minY + 1;
        hlCalendar.params.maxM = ~~maxArr[1]; //最大月
        hlCalendar.params.maxD = ~~maxArr[2]; //最大日
    }
    dateTimeCtrlInit(hlCalendar.gearDate);
    if (!hlCalendar.gearDate.style.display || hlCalendar.gearDate.style.display == "none") {
        hlCalendar.gearDate.style.display = "block";
    }
}
//初始化年月日时分插件默认值
function dateTimeCtrlInit(calendar) {
    var date = new Date();
    var dateArr = {
        yy: date.getYear(),
        mm: date.getMonth(),
        dd: date.getDate() - 1,
        hh: date.getHours(),
        mi: date.getMinutes()
    };
    if (/^\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}$/.test(hlCalendar.listener.value)) {
        rs = hlCalendar.listener.value.match(/(^|-|\s|:)\d{1,4}/g);
        dateArr.yy = rs[0] - hlCalendar.params.minY;
        dateArr.mm = rs[1].replace(/-/g, "") - 1;
        dateArr.dd = rs[2].replace(/-/g, "") - 1;
        dateArr.hh = parseInt(rs[3].replace(/\s0?/g, ""));
        dateArr.mi = parseInt(rs[4].replace(/:0?/g, ""))
    } else {
        dateArr.yy = dateArr.yy + 1900 - hlCalendar.params.minY;
    }
    calendar.querySelector(".date_yy").setAttribute("val", dateArr.yy);
    calendar.querySelector(".date_mm").setAttribute("val", dateArr.mm);
    calendar.querySelector(".date_dd").setAttribute("val", dateArr.dd);
    setDateGear();
    calendar.querySelector(".time_hh").setAttribute("val", dateArr.hh);
    calendar.querySelector(".time_mm").setAttribute("val", dateArr.mi);
    setTimeGear(calendar);
}

//呼出时间插件
function editTime(e) {
    hlCalendar.listener = e.target;
    hlCalendar.gearDate = document.querySelector(".gearTime");
    if (!hlCalendar.gearDate) {
        hlCalendar.gearDate = document.createElement("div");
        hlCalendar.gearDate.className = "gearDate";
        hlCalendar.gearDate.innerHTML = '<div class="time_ctrl slideInUp">' +
            '<div class="date_btn_box">' +
            '<div class="date_btn" onclick="cancelDateEdit();">取消</div>' +
            '<div class="date_btn" onclick="finishTimeEdit();">确定</div>' +
            '</div>' +
            '<div class="date_roll_mask">' +
            '<div class="time_roll">' +
            '<div>' +
            '<div class="gear time_hh" data-datetype="time_hh" ontouchstart="gearTouchStart(event)" ontouchmove="gearTouchMove(event)" ontouchend="gearTouchEnd(event)" onmousewheel="gearScroll(event)"></div>' +
            '<div class="date_grid" onmousewheel="gearScroll(event)">' +
            '<div>时</div>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<div class="gear time_mm" data-datetype="time_mm" ontouchstart="gearTouchStart(event)" ontouchmove="gearTouchMove(event)" ontouchend="gearTouchEnd(event)" onmousewheel="gearScroll(event)"></div>' +
            '<div class="date_grid" onmousewheel="gearScroll(event)">' +
            '<div>分</div>' +
            '</div>' +
            '</div>' +
            '</div>' + //time_roll
            '</div>' +
            '</div>';
        document.body.appendChild(hlCalendar.gearDate);
    }

    //得到插件初始化参数集合
    timeCtrlInit(hlCalendar.gearDate);
    if (!hlCalendar.gearDate.style.display || hlCalendar.gearDate.style.display == "none") {
        hlCalendar.gearDate.style.display = "block";
    }
}
//初始化时分插件默认值
function timeCtrlInit(calendar) {
    var d = new Date();
    var e = {
        hh: d.getHours(),
        mm: d.getMinutes()
    };
    if (/^\d{2}:\d{2}$/.test(hlCalendar.listener.value)) {
        rs = hlCalendar.listener.value.match(/(^|:)\d{2}/g);
        e.hh = parseInt(rs[0].replace(/^0?/g, ""));
        e.mm = parseInt(rs[1].replace(/:0?/g, ""))
    }
    calendar.querySelector(".time_hh").setAttribute("val", e.hh);
    calendar.querySelector(".time_mm").setAttribute("val", e.mm);
    setTimeGear(calendar);
}
//重置时间节点个数
function setTimeGear(calendar) {
    var time_hh = calendar.querySelector(".time_hh");
    if (time_hh && time_hh.getAttribute("val")) {
        var i = "";
        var hhVal = parseInt(time_hh.getAttribute("val"));
        time_hh.style.top = 8 - hhVal * 2 + 'em';
        for (var g = 0; g <= 23; g++) {
            i += "<div class='tooth'>" + g + "</div>";
        }
        time_hh.innerHTML = i;
    } else {
        return
    }
    var time_mm = calendar.querySelector(".time_mm");
    if (time_mm && time_mm.getAttribute("val")) {
        var i = "";
        var mmVal = parseInt(time_mm.getAttribute("val"));
        time_mm.style.top = 8 - mmVal * 2 + 'em';
        for (var g = 0; g <= 59; g++) {
            i += "<div class='tooth'>" + g + "</div>";
        }
        time_mm.innerHTML = i;
    } else {
        return
    }
}
//取消
function cancelDateEdit() {
    var evt = new CustomEvent('input');
    hlCalendar.listener.dispatchEvent(evt);
    document.body.removeChild(hlCalendar.gearDate);
}
//日期确认
function finishDateEdit() {
    var date_yy = parseInt(hlCalendar.gearDate.querySelector(".date_yy").getAttribute("val"));
    var date_mm = parseInt(hlCalendar.gearDate.querySelector(".date_mm").getAttribute("val")) + minM;
    date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
    var date_dd = parseInt(hlCalendar.gearDate.querySelector(".date_dd").getAttribute("val")) + minD;
    date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
    hlCalendar.listener.value = (date_yy % passY + hlCalendar.params.minY) + "-" + date_mm + "-" + date_dd;
    cancelDateEdit();
}
//日期时间确认
function finishDatetimeEdit() {
    var date_yy = parseInt(hlCalendar.gearDate.querySelector(".date_yy").getAttribute("val"));
    var date_mm = parseInt(hlCalendar.gearDate.querySelector(".date_mm").getAttribute("val")) + minM;
    date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
    var date_dd = parseInt(hlCalendar.gearDate.querySelector(".date_dd").getAttribute("val")) + minD;
    date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
    var time_hh = parseInt(hlCalendar.gearDate.querySelector(".time_hh").getAttribute("val"));
    time_hh = time_hh > 9 ? time_hh : '0' + time_hh;
    var time_mm = parseInt(hlCalendar.gearDate.querySelector(".time_mm").getAttribute("val"));
    time_mm = time_mm > 9 ? time_mm : '0' + time_mm;
    hlCalendar.listener.value = (date_yy % passY + hlCalendar.params.minY) + "-" + date_mm + "-" + date_dd + " " + (time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm;
    cancelDateEdit();
}
//时间确认
function finishTimeEdit() {
    var time_hh = parseInt(hlCalendar.gearDate.querySelector(".time_hh").getAttribute("val"));
    time_hh = time_hh > 9 ? time_hh : '0' + time_hh;
    var time_mm = parseInt(hlCalendar.gearDate.querySelector(".time_mm").getAttribute("val"));
    time_mm = time_mm > 9 ? time_mm : '0' + time_mm;
    hlCalendar.listener.value = (time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm;
    cancelDateEdit();
}
//触摸开始
function gearTouchStart(e) {
    e.preventDefault();
    var target = e.target;
    while (true) {
        if (!target.classList.contains("gear")) {
            target = target.parentElement
        } else {
            break
        }
    }
    clearInterval(target["int_" + target.id]);
    target["old_" + target.id] = e.targetTouches[0].screenY;
    target["o_t_" + target.id] = (new Date()).getTime();
    if (target.style.top) {
        if (/em/.test(target.style.top)) {
            target["o_d_" + target.id] = parseFloat(target.style.top.replace(/em/g, ""))
        } else {
            if (/px/.test(target.style.top)) {
                target["o_d_" + target.id] = parseFloat(target.style.top.replace(/px/g, "")) * 18 / target.clientHeight
            } else {
                target["o_d_" + target.id] = 0
            }
        }
    } else {
        target["o_d_" + target.id] = 0
    }
}
//手指移动
function gearTouchMove(e) {
    e.preventDefault();
    var target = e.target;
    while (true) {
        if (!target.classList.contains("gear")) {
            target = target.parentElement
        } else {
            break
        }
    }
    target["new_" + target.id] = e.targetTouches[0].screenY;
    target["n_t_" + target.id] = (new Date()).getTime();
    //var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / target.clientHeight;
    var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / 370;
    target["pos_" + target.id] = target["o_d_" + target.id] + f;
    target.style.top = target["pos_" + target.id] + "em";
}
//离开屏幕
function gearTouchEnd(e) {
    e.preventDefault();
    var target = e.target;
    while (true) {
        if (!target.classList.contains("gear")) {
            target = target.parentElement;
        } else {
            break;
        }
    }
    var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
    if (Math.abs(flag) <= 0.2) {
        target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
    } else {
        if (Math.abs(flag) <= 0.5) {
            target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
        } else {
            target["spd_" + target.id] = flag / 2;
        }
    }
    if (!target["pos_" + target.id]) {
        target["pos_" + target.id] = 0;
    }
    rollGear(target);
}
//缓动效果
function rollGear(target) {
    var d = 0;
    clearInterval(target["int_" + target.id]);
    target["int_" + target.id] = setInterval(function() {
        var pos = target["pos_" + target.id];
        var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
        pos += speed;
        if (Math.abs(speed) > 0.05) {} else {
            speed = 0.05;
            var b = Math.round(pos / 2) * 2;
            if (Math.abs(pos - b) < 0.02) {
                setGear(target);
                clearInterval(target["int_" + target.id]);
                return
            } else {
                if (pos > b) {
                    pos -= speed
                } else {
                    pos += speed
                }
            }
        }
        target.style.top = pos + "em";
        target["pos_" + target.id] = pos;
        setGear(target);
        d++;
    }, 30);
}
//控制插件滚动后停留的值
function setGear(target) {
    var pos = target["pos_" + target.id];
    if (pos > 8) {
        pos = 8;
        clearInterval(target["int_" + target.id]);
    };
    var j = parseFloat(target.getAttribute("val"));
    switch (target.dataset.datetype) {
        case "date_yy":
            var minTop = 8 - (passY - 1) * 2;
            if (pos < minTop) {
                pos = minTop;
                clearInterval(target["int_" + target.id]);
            }
            break;
        case "date_mm":
            if (pos < -14) {
                pos = -14;
                clearInterval(target["int_" + target.id]);
            }
            break;
        case "date_dd":
            var date_yy = hlCalendar.gearDate.querySelector(".date_yy");
            var date_mm = hlCalendar.gearDate.querySelector(".date_mm");
            //得到年份的值
            var yyVal = parseInt(date_yy.getAttribute("val"));
            //得到月份的值
            var mmVal = parseInt(date_mm.getAttribute("val"));
            //返回月份的天数
            var maxMonthDays = calcDays(yyVal, mmVal);
            var minTop = 8 - (maxMonthDays - 1) * 2;
            if (pos < minTop) {
                pos = minTop;
                clearInterval(target["int_" + target.id]);
            }
            break;
        case "time_hh":
            if (pos < -38) {
                pos = -38;
                clearInterval(target["int_" + target.id]);
            }
            break;
        case "time_mm":
            if (pos < -110) {
                pos = -110;
                clearInterval(target["int_" + target.id]);
            }
            break;
        default:
    }
     j = Math.abs(pos - 8) / 2;
    target.setAttribute("val",j);
    if (/date/.test(target.dataset.datetype)) {
        setDateGear();
    } else {
        setTimeGear(hlCalendar.gearDate);
    }
}
