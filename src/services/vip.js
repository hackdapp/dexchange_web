import request from '../utils/request';
import { poolUrl } from '../utils/commUtils';
// VIP－等级
export function grade() {
  return request(poolUrl + `/pool/vip/grade`);
}
// VIP－我的累计赌注额
export function totalamount(account) {
  return request(poolUrl + `/pool/vip/totalamount?account=${account}`);
}
