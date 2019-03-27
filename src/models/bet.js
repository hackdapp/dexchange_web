import * as betService from '../services/bet';
import { message } from "antd";
export default {

  namespace: 'bet',

  state: {
    allbetlist: [],
    mybetlist: [],
    isWin: {
      flag: false,
      bonus: 0,//奖金
      value: "",//投注金额
      result_num: 0,//开奖号码
      result: "", //输赢，0:输、1:赢
    }
  },

  effects: {
    *fetch({ payload: { } }, { call, put, select }) {  // eslint-disable-line
      try {
        const allbetRes = yield call(betService.allbetlist);
        const allbetResult = allbetRes.data;
        if (allbetRes && allbetResult.code === 0) {
          const allbetData = allbetResult.data.filter(item => item.finish == 1)
          yield put({ type: 'save', payload: { allbetlist: allbetData.reverse() } });
        }
      } catch (error) {
        message.error(error.message, 5);
      }

    },
    *fetchMygames({ payload }, { call, put, select }) {  // eslint-disable-line
      try {
        const exap = yield select(state => state.user);
        if(exap.account === ""){
          return false;
        }
        const myGameRes = yield call(betService.query,exap.account);
        const myGameResult = myGameRes.data;
        if (myGameResult && myGameResult.code === 0) {
          yield put({ type: 'savemygames', payload: { mybetlist: myGameResult.data.reverse() } });
        }
      } catch (error) {
        message.error(error.message, 5);
      }

    },
    *mygames({ payload: { mybetlist } }, { call, put }) {  // eslint-disable-line
      yield put({ type: "savemygames", payload: { mybetlist } })
    },
    *allbet({ payload: { allbetlist } }, { call, put }) {  // eslint-disable-line
      yield put({ type: "saveallbet", payload: { allbetlist } })
    },
    *fetchIsWin({ payload: { isWin } }, { call, put }) {  // eslint-disable-line
      yield put({ type: "saveIsWin", payload: { isWin } })
    },
    *betting({ payload }, { call, put }) {
      try {
        const result = yield call(betService.betting, payload)
        return result
      } catch (error) {
        // message.error(error.message);
        if (!error.message) {
          error = JSON.parse(error)
          if (error.error.code) {
            message.error(error.error.details[0].message);
          } else {
            message.error(error.message);
          }
        } else {
          message.error(error.message);
        }
        // message.error("交易未完成，请检查资源是否充足", 5);
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
