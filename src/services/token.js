import { actionAccountDICE, balanceAccount } from '../utils/commUtils';
import scatterEos from '../utils/scatterEos'

//质押代币
export async function pledgeToken(datas) {
    let nums = datas.nums
    const account = datas.account
    nums = parseFloat(nums).toFixed(4);
    var value = nums + ' CLUB';
    const params = {
        actions: [
            {
                account: actionAccountDICE,
                name: 'stake',
                authorization: [{
                    actor: account,
                    permission: 'active'
                }],
                data: {
                    owner: account,
                    value: value
                }
            }
        ]
    }
    const result = await scatterEos.pushEosAction(params)
    return result
}

//赎回代币
export async function redeemToken(datas) {
    let nums = datas.nums
    const account = datas.account
    nums = parseFloat(nums).toFixed(4);
    var value = nums + ' CLUB';
    const params = {
        actions: [
            {
                account: actionAccountDICE,
                name: 'unstake',
                authorization: [{
                    actor: account,
                    permission: 'active'
                }],
                data: {
                    owner: account,
                    value: value
                }
            }
        ]
    }
    const result = await scatterEos.pushEosAction(params)
    return result
}


//提现
export async function drawdividend(datas) {
    const { account } = datas
    const params = {
        actions: [
            {
                account: balanceAccount,
                name: 'drawdividend',
                authorization: [{
                    actor: account,
                    permission: 'active'
                }],
                data: {
                    user: account
                }
            }
        ]
    }
    const result = await scatterEos.pushEosAction(params)
    return result
}

