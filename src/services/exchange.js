import { exchangeContract, exchangeBaseUrl } from '../utils/commUtils';
import scatterEos from '../utils/scatterEos'
import { getTradingPairTable, drinkFinalData } from '../utils/utils'
import Eos from 'eosjs';
import request from '../utils/request';

const eosConfig = {
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    httpEndpoint: 'http://118.190.112.181:7777',
    keyProvider: '',
    authorization: 'desertchain@auth.trade',
    verbose: false
}
const eos = Eos(eosConfig);

export async function getCurrCoinPrice() {
    const timestamp = new Date().getTime()
    return request('https://min-api.cryptocompare.com/data/pricemulti?fsyms=EOS&tsyms=USD,CNY&ts=' + timestamp);
}

export async function fetchTradingPairPriceState() {
    return request(exchangeBaseUrl + '/price/query');
}

export function getUserHistory(datas) {
    const url = exchangeBaseUrl + '/orders/query'
    const body = { "pairid": datas.pairid, "username": datas.username }
    return request(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        },
    })
}
/**
 * 下买单
 * 
 * @param {*} currentTradingPair 当前交易对
 * @param {*} username 当前用户名称
 * @param {*} price    买单价格
 * @param {*} amount   买单数量
 */

export async function placeBuyOrder(params) {
        const { currentTradingPair, username, price, amount } = params
        const {
            baseToken,
            basePrecision,
            minimumVolume,
            exPrecision,
            pricePrecision,
            exToken,
            baseContract,
            pairID
        } = currentTradingPair;

        let tradeAmount = price * amount * 10 ** basePrecision;
        let transferQuantity = parseFloat(Math.ceil(tradeAmount) / 10 ** basePrecision).toFixed(basePrecision) + ' ' + baseToken;
        if (tradeAmount < Number(minimumVolume)) {
            //trade amount is too small, for example: minimum amount for per order is 0.1 EOS
            return { code: 101, message: '至少需要支付0.1 EOS' }
        }

        const quote_quantity = parseFloat(amount).toFixed(exPrecision) + ' ' + exToken;
        const maximum_price = Math.floor(price * pricePrecision);

        const data = {
            actions: [{
                account: baseContract,
                name: 'transfer',
                authorization: [{
                    actor: username,
                    permission: 'active'
                }],
                data: {
                    from: username,
                    to: exchangeContract,
                    quantity: transferQuantity,
                    memo: '',
                }
            },
            {
                account: exchangeContract,
                name: 'buyorder',
                authorization: [{
                    actor: username,
                    permission: 'active',
                }],
                data: {
                    remark: '',
                    user: username,
                    pair_id: pairID,
                    quote_quantity,
                    maximum_price,
                },
            },
            ],
        };
        const result = await scatterEos.pushEosAction(data)
        return { code: 0, message: '下单成功', data: result }
    }

    /**
     * 下卖单
     * 
     * @param {*} currentTradingPair 当前交易对
     * @param {*} username 当前用户名称
     * @param {*} price    买单价格
     * @param {*} amount   买单数量
     */

    export async function placeSellOrder(params) {

        const { currentTradingPair, username, price, amount } = params

        const {
            basePrecision,
            minimumVolume,
            exPrecision,
            pricePrecision,
            exToken,
            exContract,
            pairID
        } = currentTradingPair;

        const tradeAmount = amount * price * 10 ** basePrecision;
        if (tradeAmount < Number(minimumVolume)) {
            //trade amount is too small, for example: minimum amount for per order is 0.1 EOS
            return { code: 101, message: '至少需要交易0.1 EOS' }
        }

        const quantity = parseFloat(amount).toFixed(exPrecision) + ' ' + exToken;
        const quote_quantity = parseFloat(amount).toFixed(exPrecision) + ' ' + exToken;
        const minimum_price = Math.floor(price * pricePrecision);
        const data = {
            actions: [{
                account: exContract,
                name: 'transfer',
                authorization: [{
                    actor: username,
                    permission: 'active'
                }],
                data: {
                    from: username,
                    to: exchangeContract,
                    quantity,
                    memo: '',
                }
            },
            {
                account: exchangeContract,
                name: 'sellorder',
                authorization: [{
                    actor: username,
                    permission: 'active'
                }],
                data: {
                    remark: '',
                    user: username,
                    pair_id: pairID,
                    quote_quantity,
                    minimum_price,
                },
            },
            ],
        }
        const result = await scatterEos.pushEosAction(data)
        return { code: 0, message: '下单成功', data: result }
    }
    /**
     * 
     * @param  tradingPairList 当前交易对
     * @param  order 		   订单id
     * @param  username 	   当前用户名称
     */

    export async function cancelOrder(params) {

        const { currentTradingPair, username, order } = params

        const isBuyOrder = order.type % 100 == 1;
        const token_id = currentTradingPair[isBuyOrder ? 'baseID' : 'exID'];
        const data = {
            actions: [{
                account: exchangeContract,
                name: 'cancelorder',
                authorization: [{
                    actor: username,
                    permission: 'active',
                }],
                data: {
                    user: username,
                    record_id: order.id,
                },
            },
            {
                account: exchangeContract,
                name: 'withdraw',
                authorization: [{
                    actor: username,
                    permission: 'active',
                }],
                data: {
                    to: username,
                    token_id,
                },
            },
            ],
        };
        const result = await scatterEos.pushEosAction(data)
        return { code: 0, message: '取消成功', data: result }
    }

    export async function getTokenRelatedInfo() {

        const pairResult = await eos.getTableRows({
            json: true,
            code: exchangeContract,
            scope: exchangeContract,
            table: 'pairstruct',
            limit: 1000,
        })

        const tokenResult = await eos.getTableRows({
            json: true,
            code: exchangeContract,
            scope: exchangeContract,
            table: 'tokenstruct',
            limit: 1000,
        })

        const pairs = pairResult.rows
        const tokens = tokenResult.rows
        let tokenTable = {}
        tokens.map((token) => {
            tokenTable[token.id] = {
                precision: token.precision,
                symbol: token.symbol_name,
                value: token.ext_symbol.value,
                contract: token.ext_symbol.contract,
                id: token.id,
            }
        })


        const {
            tradingPairTable,
            tradingPairList
        } = getTradingPairTable(pairs, tokenTable);

        return {
            tradingPairList,
            tradingPairTable,
            tokens
        }


    }

    /**
     * 查询当前交易对的交易深度
     * 
     * @param {*} currentTradingPair 当前交易对
     */

    export async function getOrderBook(currentTradingPair) {
        if (!currentTradingPair.exToken) {
            return
        }

        const buyScope = currentTradingPair.pairID * 100 + 1;
        const sellScope = currentTradingPair.pairID * 100 + 2;
        const pricePrecision = currentTradingPair.pricePrecision;

        const buyResult = await eos.getTableRows({
            json: true,
            code: exchangeContract,
            scope: buyScope,
            table: 'orderstruct',
            key_type: 'i64',
            index_position: 2,
            limit: 30
        })

        const sellResult = await eos.getTableRows({
            json: true,
            code: exchangeContract,
            scope: sellScope,
            table: 'orderstruct',
            key_type: 'i64',
            index_position: 2,
            limit: 30
        })

        const [buyOrder, sellOrder] = drinkFinalData({
            buy: buyResult.rows,
            sell: sellResult.rows
        }, pricePrecision);
        return {
            buyOrder,
            sellOrder
        };

    }

    export async function getCurrentOrders(name) {

        const result = await eos.getTableRows({
            json: true,
            code: exchangeContract,
            scope: name,
            table: 'recordstruct',
            limit: 1000,
        })

        return result.rows
    }


    /**
     * 查询历史成交订单
     * @param {*} pairid 交易对id
     * @param {*} pos    查询起始位置
     * @param {*} offset 查询条数ß
     */
    export async function getMarketOrders(pairid, pos, offset) {

        const result = await eos.getActions(exchangeContract, pos, offset)

        const items = result.actions.filter(item => {
            return item.action_trace.act.name === 'log';
        }).map(item => {
            return item;
        }).sort((a, b) => {
            if (a.account_action_seq > b.account_action_seq) return -1;
            if (a.account_action_seq < b.account_action_seq) return 1;
            return 0;
        });

        const res = items.filter((item) => {
            return item.action_trace.act.data.log.pair_id == pairid;
        }).map(item => {
            return {
                trx_id: item.action_trace.trx_id,
                block_num: item.action_trace.block_num,
                block_time: item.action_trace.block_time,
                info: item.action_trace.act.data.log
            };
        })

        return res;
    }