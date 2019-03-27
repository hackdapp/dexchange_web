import { message } from "antd";
import * as exchangeServices from '../services/exchange';
import { strSplitSpace } from '../utils/commUtils'

export default {
    namespace: 'exchange',
    state: {
        tradingPairList: [],
        baseKeys: [],
        tradingPairTable: [],
        defaultTradingPair: {},
        coinPrice: {},
        buyPrice: '',
        sellPrice: '',
        tradingPairPrice: [],
        buyOrderList: [],
        priceStateList: [],
        sellOrderList: [],
        marketOrders: [],
        userCurrentOrders: [],
        userHistoryOrders: []
    },
    effects: {
        *fetchTradingPair({ payload }, { call, put, select }) {  // eslint-disable-line
            try {
                const result = yield call(exchangeServices.getTokenRelatedInfo)
                const defaultTradingPair = result.tradingPairList[0] ? result.tradingPairList[0] : {};
                const baseKeys = []
                for (var item in result.tradingPairTable) {
                    baseKeys.push(item)
                }
                yield put({ type: 'saveTradingPair', payload: { tradingPairList: result.tradingPairList, tradingPairTable: result.tradingPairTable, defaultTradingPair, baseKeys } });
                yield put({ type: 'getCurrCoinPrice' })
                // yield put({ type: 'placeBuyOrder'} )
            } catch (error) {
                message.error(error.message);
            }

        },

        *fetchTradingPairPriceState({ payload }, { call, put, select }) {
            try {
                const res = yield call(exchangeServices.fetchTradingPairPriceState)
                const result = res.data
                yield put({
                    type: 'savePriceStateList', payload: {
                        priceStateList: result.data
                    }
                })
                yield put({
                    type: 'setTradingPairPrice', payload: {
                        data: result.data
                    }
                })
            } catch (error) {
                message.error(error.message);
            }
        },

        *getCurrCoinPrice({ payload }, { call, put, select }) {
            try {
                const result = yield call(exchangeServices.getCurrCoinPrice)
                yield put({
                    type: 'saveCoinPrice', payload: {
                        coinPrice: result.data
                    }
                })
            } catch (error) {
                message.error(error.message);
            }
        },

        *fetchOrderList({ payload }, { call, put, select }) {  // eslint-disable-line
            const state = yield select(state => state.exchange);
            try {
                const result = yield call(exchangeServices.getOrderBook, state.defaultTradingPair)
                const buyOrderList = result.buyOrder
                const sellOrderList = result.sellOrder
                yield put({ type: 'saveOrderList', payload: { buyOrderList, sellOrderList } });
            } catch (error) {
                message.error(error.message);
            }
        },
        *placeBuyOrder({ payload }, { call, put, select }) {  // eslint-disable-line
            const state = yield select(state => state.exchange);
            const exam = yield select(state => state.user);
            if (exam.account == "") {
                message.error("请先登录账户！");
                return false
            }
            try {
                const buyPrice = payload.buyPrice;
                const buyNum = payload.buyNum;
                const result = yield call(exchangeServices.placeBuyOrder, {
                    currentTradingPair: state.defaultTradingPair,
                    username: exam.account,
                    price: buyPrice,
                    amount: buyNum
                })
                if (result.code !== 0) {
                    message.error(result.message);
                } else {
                    message.success(result.message);
                    // 刷新交易列表 和 刷新我的余额
                    yield put({ type: 'getCurrUserOrder' })
                    yield put({ type: 'fetchOrderList' })
                    yield put({ type: 'user/fetchBalance' })
                }
            } catch (error) {
                message.error(error.message);
            }
        },

        *placeSellOrder({ payload }, { call, put, select }) {  // eslint-disable-line
            const state = yield select(state => state.exchange);
            const exam = yield select(state => state.user);
            if (exam.account == "") {
                message.error("请先登录账户！");
                return false
            }
            try {
                const sellPrice = payload.sellPrice;
                const sellNum = payload.sellNum;
                const result = yield call(exchangeServices.placeSellOrder, {
                    currentTradingPair: state.defaultTradingPair,
                    username: exam.account,
                    price: sellPrice,
                    amount: sellNum
                })

                if (result.code !== 0) {
                    message.error(result.message);
                } else {
                    message.success(result.message);
                    // 刷新交易列表 和 刷新我的余额
                    yield put({ type: 'getCurrUserOrder' })
                    yield put({ type: 'fetchOrderList' })
                    yield put({ type: 'user/fetchBalance' })
                }
            } catch (error) {
                message.error(error.message);
            }
        },

        *cancleOrder({ payload }, { call, put, select }) {  // eslint-disable-line
            const state = yield select(state => state.exchange);
            const exam = yield select(state => state.user);
            try {
                const order = payload.order;
                const result = yield call(exchangeServices.cancelOrder, {
                    currentTradingPair: state.defaultTradingPair,
                    username: exam.account,
                    order
                })
                if (result.code !== 0) {
                    message.error(result.message);
                } else {
                    message.success(result.message);
                    // 刷新交易列表 和 刷新我的余额
                    yield put({ type: 'getCurrUserOrder' })
                    yield put({ type: 'fetchOrderList' })
                    yield put({ type: 'user/fetchBalance' })
                }
            } catch (error) {
                message.error(error.message);
            }
        },

        *getMarketOrders({ payload }, { call, put, select }) {
            const state = yield select(state => state.exchange);
            try {
                const defaultTradingPair = state.defaultTradingPair;
                const marketOrders = yield exchangeServices.getMarketOrders(defaultTradingPair.pairID, -1, -100)
                yield put({ type: 'saveMarketOrders', payload: { marketOrders } });
            } catch (error) {
                message.error(error.message);
            }

        },

        *getCurrUserOrder({ payload }, { call, put, select }) {
            const exam = yield select(state => state.user);
            if (exam.account === "") {
                return false;
            }
            try {
                const orders = yield call(exchangeServices.getCurrentOrders, exam.account)
                let currentOrders = []
                orders.map(item => {
                    // const remaining = strSplitSpace(item.remaining_quantity)[0];
                    if (item.status == 2 || item.status == 3) {
                        // historyOrders.push(item)
                    } else {
                        currentOrders.push(item)
                    }
                })
                yield put({ type: 'saveUserOrders', payload: { currentOrders } });
            } catch (error) {
                message.error(error.message);
            }
        },

        *setTradingPairPrice({ payload }, { call, put, select }) {
            const state = yield select(state => state.exchange);
            try {
                const defaultTradingPair = state.defaultTradingPair;
                const result = payload.data;
                let tradingPairPrice = []
                result.map(item => {
                    if (defaultTradingPair.pairID == item[0]) {
                        tradingPairPrice = item
                    }
                })
                yield put({ type: 'saveTradingPairPrice', payload: { tradingPairPrice } });
            } catch (error) {
                message.error(error.message);
            }
        },

        *clearCurrUserOrder({ payload }, { call, put, select }) {
            yield put({
                type: 'saveUserOrders', payload: {
                    historyOrders: [],
                    currentOrders: []
                }
            })
        },
        *getUserHistory({ payload }, { call, put, select }) {
            try {
                const state = yield select(state => state.exchange);
                const exam = yield select(state => state.user);
                const defaultTradingPair = state.defaultTradingPair;
                const username = exam.account
                const req = yield call(exchangeServices.getUserHistory, { pairid: defaultTradingPair.pairID ? defaultTradingPair.pairID : 1  , username })
                const result = req.data
                let historyOrders = []
                result.data.map( item =>{
                    const orderItem = {}
                    orderItem['place_time'] = item[3]
                    orderItem['type'] = item[1]
                    orderItem['price'] = item[2]
                    orderItem['total_quantity'] = parseFloat(item[4]/10000).toFixed(4)
                    historyOrders.push(orderItem)
                })
                yield put({ type: 'saveHistoryOrders', payload: { historyOrders } });
            } catch (error) {
                message.error(error.message);
            }
        }
    },

    reducers: {
        saveTradingPair(state, action) {
            return {
                ...state,
                tradingPairList: action.payload.tradingPairList,
                tradingPairTable: action.payload.tradingPairTable,
                defaultTradingPair: action.payload.defaultTradingPair,
                baseKeys: action.payload.baseKeys
            };
        },
        savePriceStateList(state, action) {
            return {
                ...state,
                priceStateList: action.payload.priceStateList
            };
        },
        saveOrderList(state, action) {
            return {
                ...state,
                buyOrderList: action.payload.buyOrderList,
                sellOrderList: action.payload.sellOrderList
            };
        },
        saveMarketOrders(state, action) {
            return {
                ...state,
                marketOrders: action.payload.marketOrders
            };
        },
        saveTradingPairPrice(state, action) {
            return {
                ...state,
                tradingPairPrice: action.payload.tradingPairPrice
            };
        },
        saveCoinPrice(state, action) {
            return {
                ...state,
                coinPrice: action.payload.coinPrice
            };
        },
        updatePrice(state, action) {
            return {
                ...state,
                buyPrice: action.payload.buyPrice ? action.payload.buyPrice : state.buyPrice,
                sellPrice: action.payload.sellPrice ? action.payload.sellPrice : state.sellPrice
            };
        },
        saveUserOrders(state, action) {
            return {
                ...state,
                userCurrentOrders: action.payload.currentOrders.reverse()
            };
        },
        saveHistoryOrders(state, action) {
            return {
                ...state,
                userHistoryOrders: action.payload.historyOrders
            };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {

        },
    },


};
