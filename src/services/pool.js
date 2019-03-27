import request from '../utils/request';
import { poolUrl } from '../utils/commUtils';
// 分红池 我的质押数量
export function queryMystake(account) {
  return request(poolUrl + `/pool/bonus/mystake?account=${account}`);
}
// 分红记录
export function records(timevalue) {
  return request(poolUrl + `/pool/bonus/records?timevalue=${timevalue}`);
}
// 分红记录 tab按钮 我的余额
export function bonus(account) {
  // return request(baseUrl+`/bonus/balance?account=lixu12341234`);
  return request(poolUrl + `/pool/bonus/balance?account=${account}`);
}
// 可质押部分 我的余额
export function balance(account) {
  return request(poolUrl + `/account/balance?account=${account}`);
}

export function fetchCPU(account) {
  return request(poolUrl + `/account/netinfo?account=${account}`);
}

// 代币奖励数量
export function query() {
  return request(poolUrl+`/pool/bonus/rewardamount`);
}
// 首页—英雄榜历史数据
export function herolist(timevalue) {
  return request(poolUrl + `/pool/hero/list?timevalue=${timevalue}`);
}
