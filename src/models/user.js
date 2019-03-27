import * as headerService from '../services/pool';
import scatterEos from '../utils/scatterEos'
import { nowTab } from '../utils/commUtils.js'

import { message } from "antd";

export default {

  namespace: 'user',

  state: {
    list: '',
    records: [],
    bonus: {
      "EOS": '0.0000000000',
      "CLUB": '0.0000000000'
    },
    balance: {},
    cpuInfo: {},
    account: '',
    scatterAccount: {},
    address: '',
    ref: window.location.search.substring(5),
    nowTab: nowTab()
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *getAccountInfo({ payload }, { call, put }) {
      try {
        const account = yield scatterEos.getEosAccount();
        yield put({ type: "saveScatterAccount", payload: { account: account } })
        return account;
      } catch (error) {
        message.error(error.message, 5);
      }

      // yield put({ type: "saveuser", payload: { account, address } })
    },
    *fetch({ payload: { timevalue } }, { call, put, select }) {  // eslint-disable-line
    //   try {
    //     const exam = yield select(state => state.user);
    //     // 可质押部分 我的余额
    //     const balanceRes = yield call(headerService.balance, exam.account);
    //     const balanceResult = balanceRes.data;
    //     if (exam.account && balanceRes && balanceResult.code === 0) {
    //       yield put({ type: 'save1', payload: { balance: balanceResult.data } });
    //     }
    //     // 分红池 我的质押数量
    //     const mystakeRes = yield call(headerService.queryMystake, exam.account);
    //     const mystakeResult = mystakeRes.data;
    //     if (exam.account && mystakeRes && mystakeResult.code === 0) {
    //       yield put({ type: 'save2', payload: { list: mystakeResult.data ? mystakeResult.data : 0 } });
    //     }
    //     // 分红记录
    //     const recordsRes = yield call(headerService.records, timevalue);
    //     const recordsResult = recordsRes.data;
    //     if (recordsRes && (recordsResult.code === 0) && (recordsResult.data.length > 0)) {
    //       yield put({ type: 'save3', payload: { records: recordsResult.data.length > 0 ? recordsResult.data.reverse() : [] } });
    //     }

    //     // 我的余额
    //     yield put({ type: 'fetchBonusBalance', payload: {} });
    //   } catch (error) {
    //     message.error(error.message, 5);
    //   }
    },

    *fetchBonusBalance({ payload }, { call, put, select }) {
      // 我的余额(分红第四个tab按钮)
      const exam = yield select(state => state.user);
      const bonusRes = yield call(headerService.bonus, exam.account);
      const bonusResult = bonusRes.data;
    //   if (exam.account && bonusRes && bonusResult.code === 0) {
    //     if (bonusResult.data.EOS && bonusResult.data.CLUB) {
    //       yield put({ type: 'save4', payload: { bonus: bonusResult.data } });
    //     } else {
    //       yield put({ type: 'save4', payload: { bonus: { "EOS": '0.0000000000', "CLUB": '0.0000000000' } } });
    //     }
    //   }

    
    },
    *saveAccount({ payload: { account, address } }, { call, put }) {
      yield put({ type: "saveuser", payload: { account, address } })
    },

    *fetchAccountCPU({ payload }, { call, put }) {
    //   try {

    //     const account = payload.account
    //     if (account == "") {
    //       return false;
    //     }
    //     const res = yield call(headerService.fetchCPU, account);
    //     const cpuResult = res.data;
    //     if (cpuResult.code === 0) {
    //       yield put({ type: 'saveAccountCpu', payload: { cpuInfo: cpuResult.data } });
    //     }
    //     return cpuResult.data
    //   } catch (error) {
    //     message.error(error.message);
    //   }

    },

    *fetchBalance({ payload }, { call, put, select, take }) {  // eslint-disable-line
      try {
        let exam = yield select(state => state.user);
        if (exam.account == "") {
          yield put({ type: 'user/getAccountInfo' })
          yield take('user/getAccountInfo/@@end')
        }
        exam = yield select(state => state.user);
        const account = exam.account
        const balanceRes = yield call(headerService.balance, account);
        const balanceResult = balanceRes.data;
        if (balanceResult.code === 0) {
          yield put({ type: 'save1', payload: { balance: balanceResult.data } });
        }
      } catch (error) {
        message.error(error.message);
      }

    },

    *saveBalance({ payload: { balance, list } }, { call, put }) {
      yield put({ type: "savebalance", payload: { balance, list } })
    },
    *fetchNowTab({ payload: { nowTab } }, { call, put }) {
      yield put({ type: "saveNowTab", payload: { nowTab } })
    },
  },

  reducers: {
    saveNowTab(state, action) {
      return {
        ...state,
        nowTab: action.payload.nowTab
      };
    },
    saveScatterAccount(state, action) {
      return {
        ...state,
        account: action.payload.account.name,
        scatterAccount: action.payload.account
      };
    },
    save(state, action) {
      return { ...state, list: action.payload.list, records: action.payload.records, bonus: action.payload.bonus, balance: action.payload.balance };
    },
    save1(state, action) {
      return { ...state, balance: action.payload.balance };
    },
    save2(state, action) {
      return { ...state, list: action.payload.list };
    },
    save3(state, action) {
      return { ...state, records: action.payload.records };
    },
    save4(state, action) {
      return { ...state, bonus: action.payload.bonus };
    },
    saveuser(state, action) {
      return { ...state, account: action.payload.account, address: action.payload.address };
    },

    saveAccountCpu(state, action) {
      return { ...state, cpuInfo: action.payload.cpuInfo };
    },

    clearUserInfo(state, action) {
      return {
        ...state,
        list: '',
        records: [],
        bonus: {},
        balance: {},
        account: '',
        scatterAccount: {},
        address: ''
      };
    },
    savebalance(state, action) {
      return { ...state, balance: action.payload.balance, list: action.payload.list };
    },
  },

};
