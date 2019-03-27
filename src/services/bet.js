import request from '../utils/request';
import { diceUrl } from '../utils/commUtils';
import scatterEos from '../utils/scatterEos'

export function query(account) {
  return request(diceUrl + `/dice/mygames?account=${account}`);
}
export function allbetlist() {
  return request(diceUrl + '/dice/newgamelist');
}

export function seed() {
  return request(diceUrl+`/dice/seed`);
}

export async function betting(datas) {
  const { actionAccount, account, to, quantity, memo } = datas
  const params = {
    actions: [
      {
        account: actionAccount,
        name: 'transfer',
        authorization: [{
          actor: account,
          permission: 'active'
        }],
        data: {
          from: account,
          to: to,
          quantity: quantity,
          memo: memo
        }
      }
    ]
  }
  const result = await scatterEos.pushEosAction(params)
  return result
}
