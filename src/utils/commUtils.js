import React from "react";
import styled, { keyframes } from "styled-components";


const setting = {
    'http_api': 'http://118.190.112.181:3000',
    'poolUrl': 'http://118.190.112.181:3003',
    'contract_eos': 'eosio.token',
    'contract_dice': 'clubtoken111',
    'contract_dexchange': 'hackdappexch',
    'chain_info': {
      blockchain: 'eos',
      protocol: 'http',
      host: '118.190.112.181',
      port: 7777,
      chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
    }
}

//1. 配置服务器IP地址
export const exchangeHost = '118.190.112.181';
//2. 配置交易所后端端口
export const poolUrl = setting.poolUrl;
export const exchangeBaseUrl = setting.http_api;
export const actionAccountEOS = setting.contract_eos;
export const actionAccountDICE = setting.contract_dice;
export const exchangeContract = setting.contract_dexchange;
export const chaininfo = setting.chain_info;

export const transactionUrl = 'https://bloks.io';

// 是否是空数组
export const strSplitSpace = (str) => {
  const result = str.trim().split(/\s+/)
  return result;
}
// 判断当前tab页
export const nowTab = (str) => {
  const result = window.location.pathname.match('[^/]+(?!.*/)') ? window.location.pathname.match('[^/]+(?!.*/)')[0] : "";
  return result;
}

// 邀请好友部分地址获取
export const nowUrl = (str) => {
  //获取字符串中最后一个斜杠后面的内容:
  const index = str.lastIndexOf("\/");
  // const str1  = str.substring(index + 1, str.length);
  //获取字符串中最后一个斜杠前面的内容
  const str2 = str.substring(0, index);
  // return str2 + str1;
  return str2;
}

// 代币单位

/**
 * 获取当前日期,显示在屏幕上 yyyy-mm-dd
 */
export const getNowFormatDate = (addDayCount) => {
  var day = new Date();
  day.setDate(day.getDate() + addDayCount);
  var Year = 0;
  var Month = 0;
  var Day = 0;
  var CurrentDate = "";
  // 初始化时间
  Year = day.getFullYear();
  Month = day.getMonth() + 1;
  Day = day.getDate();
  CurrentDate += Year + "-";
  if (Month >= 10) {
    CurrentDate += Month + "-";
  } else {
    CurrentDate += "0" + Month + "-";
  }
  if (Day >= 10) {
    CurrentDate += Day;
  } else {
    CurrentDate += "0" + Day;
  }
  return CurrentDate;
}
/**
  * 获取当前日期字符串(无'-'),发请求用
  */
export const getNowFormatDateStr = (addDayCount) => {
  var day = new Date();
  day.setDate(day.getDate() + addDayCount);
  var Year = 0;
  var Month = 0;
  var Day = 0;
  var CurrentDate = "";
  // 初始化时间
  Year = day.getFullYear();
  Month = day.getMonth() + 1;
  Day = day.getDate();
  CurrentDate += Year;
  if (Month >= 10) {
    CurrentDate += Month;
  } else {
    CurrentDate += "0" + Month;
  }
  if (Day >= 10) {
    CurrentDate += Day;
  } else {
    CurrentDate += "0" + Day;
  }
  return CurrentDate;
}
/**
 * 获取当前日期时间,显示在屏幕上 yyyy-mm-dd hh:00
 */
export const getNowFormatHour = (addHoursCount) => {
  var day = new Date();
  day.setHours(day.getHours() + addHoursCount);
  var Year = 0;
  var Month = 0;
  var Day = 0;
  var Hour = 0;
  var CurrentDate = "";
  // 初始化时间
  Year = day.getFullYear();
  Month = day.getMonth() + 1;
  Day = day.getDate();
  Hour = day.getHours();
  CurrentDate += Year + "-";
  if (Month >= 10) {
    CurrentDate += Month + "-";
  } else {
    CurrentDate += "0" + Month + "-";
  }
  if (Day >= 10) {
    CurrentDate += Day;
  } else {
    CurrentDate += "0" + Day;
  }
  if (Hour >= 10) {
    CurrentDate += " " + Hour + ":00:00 ";
  } else {
    CurrentDate += " 0" + Hour + ":00:00 ";
  }
  return CurrentDate;
}
/**
 * 获取当前日期时间,发请求用 yyyymmddhh
 */
export const getNowFormatHourStr = (addHoursCount) => {
  var day = new Date();
  day.setHours(day.getHours() + addHoursCount);
  var Year = 0;
  var Month = 0;
  var Day = 0;
  var Hour = 0;
  var CurrentDate = "";
  // 初始化时间
  Year = day.getFullYear();
  // Month = day.getMonth() + 1;
  Month = day.getMonth();
  Day = day.getDate();
  Hour = day.getHours();
  var d1 = new Date(Year, Month, Day, Hour, 0, 0);
  var d2 = d1.getTime() - 8 * 60 * 60 * 1000;//排行榜历史数据，传递的时间需作调整改为UTC时区，减少8个⼩时

  d2 = new Date(d2);
  Year = d2.getFullYear();
  Month = d2.getMonth() + 1;
  Day = d2.getDate();
  Hour = d2.getHours();
  CurrentDate += Year;
  if (Month >= 10) {
    CurrentDate += Month;
  } else {
    CurrentDate += "0" + Month;
  }
  if (Day >= 10) {
    CurrentDate += Day;
  } else {
    CurrentDate += "0" + Day;
  }
  if (Hour >= 10) {
    CurrentDate += Hour;
  } else {
    CurrentDate += "0" + Hour;
  }
  return CurrentDate;
}
//将科学计数法转换为小数
export const toNonExponentials = (num, length) => {
  var m = parseFloat(num).toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  // return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  return parseFloat(num).toFixed(length);
}
// 排行榜部分小时倒计时
//单纯分钟和秒倒计时
export const countTime = () => {
  // var times;
  var msg;
  const common = (time) => {
    return time > 9 ? time : ('0' + time);
  }
  //递归每秒调用countTime方法，显示动态时间效果
  setTimeout(countTime, 1000);
  //获取当前时间
  var date = new Date();
  var now = date.getTime();
  //设置截止时间
  // var endDate = new Date("2018-12-23 23:58:00");
  var Year = date.getFullYear();
  var Month = date.getMonth() + 1;
  var Day = date.getDate();
  var Hour = date.getHours() + 1;
  var endDate = new Date(common(Year) + "-" + common(Month) + "-" + common(Day) + " " + common(Hour) + ":00:00");

  var end = endDate.getTime();
  //时间差
  var leftTime = end - now;
  //定义变量 d,h,m,s保存倒计时的时间
  var h, m, s;
  if (leftTime >= 0) {
    // d = Math.floor(leftTime/1000/60/60/24);
    h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
    m = Math.floor(leftTime / 1000 / 60 % 60);
    s = Math.floor(leftTime / 1000 % 60);
    //将倒计时赋值到div中
    msg = common(h) + ":" + common(m) + ":" + common(s);
    //console.log(msg);
    // if (msg === "00:00:00") {
    //   setTimeout(() => {
    //     setTimeout(countTime, 1000);
    //   }, 60000);
    //   msg = '开奖中';
    //   console.log(msg);
    //   return;
    // }
    return msg;
  }
}
// 数字
export const numsCur = (num) => {
  var nums = parseFloat(num.split(" ")[0]);
  return nums;
}
// 数字的单位
export const numsUnit = (num) => {
  var nums = num.split(" ")[1];
  return nums;
}
export const IsPC = () => {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  /*
   const nowwidth = window.innerWidth
   const flag = nowwidth > 776 ? true : false;
   */
  return flag;//true为PC端，false为手机端和ipad
}
// 转化时间戳
export const timeformat = (parms) => {
  parms = parms.toString().length > 10 ? parms : parms * 1000
  const timeFun = (num) => {
    return num > 10 ? num : ('0' + num);
  }
  var date = new Date(parseInt(parms));
  var Y = date.getFullYear() + '-';
  var M = timeFun(date.getMonth() + 1) + '-';
  var D = timeFun(date.getDate()) + ' ';
  var h = timeFun(date.getHours()) + ':';
  var m = timeFun(date.getMinutes()) + ':';
  var s = timeFun(date.getSeconds());
  return Y + M + D + h + m + s;
}
// 是否是空数组
export const arrIsNull = (arr) => {
  return arr ? arr : [];
}

/**
 * 产生随机整数，包含下限值，但不包括上限值
 * @param {Number} lower 下限
 * @param {Number} upper 上限
 * @return {Number} 返回在下限到上限之间的一个随机整数
 */
export const random = (lower, upper) => {
  return Math.floor(Math.random() * (upper - lower)) + lower;
}
/**
 * 百家乐用 百分数
 */
export const randomPercent = () => {
  return Math.random() * 100 + "%";
}
// 向下取整
export const numMathFloor = (parms, numLength) => {
  return parseFloat(Math.floor(parms * numLength) / numLength).toFixed(numLength.toString().length - 1)
}

