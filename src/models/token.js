import * as tokenService from '../services/token';
import { message } from "antd";
export default {

    namespace: 'token',

    state: {
    },

    effects: {
        // 质押代币
        *pledgeToken({ payload }, { call, put }) {  // eslint-disable-line
            try {
                const result = yield call(tokenService.pledgeToken, payload)
                return result
            } catch (error) {
                message.error(error.message, 5);
            }
        },
        // 赎回代币
        *redeemToken({ payload }, { call, put }) {  // eslint-disable-line
            try {
                const result = yield call(tokenService.redeemToken, payload)
                return result
            } catch (error) {
                message.error(error.message, 5);
            }
        },
        *drawdividend({ payload }, { call, put }) {  // eslint-disable-line
            try {
                const result = yield call(tokenService.drawdividend, payload)

                if (result) {
                    // 重新查询我的余额
                    yield put({ type: "user/fetchBonusBalance", payload: {} })
                    // 我的账户余额
                    yield put({ type: "user/fetchBalance", payload: {} })
                }
                return { code: 0, result }
            } catch (error) {
                message.error(error.message, 5);
                return { code: 1 }
            }
        }
    },

    reducers: {
        save(state, action) {
            return { ...state, allbetlist: action.payload.allbetlist, account: action.payload.account };
        },
        savemygames(state, action) {
            return { ...state, mybetlist: action.payload.mybetlist };
        },
        saveallbet(state, action) {
            return { ...state, allbetlist: action.payload.allbetlist };
        },
        saveIsWin(state, action) {
            return { ...state, isWin: action.payload.isWin };
        },
    },

};