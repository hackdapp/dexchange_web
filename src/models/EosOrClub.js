import { message } from "antd";
import { actionAccountEOS, } from '../utils/commUtils';
export default {

  namespace: 'EosOrClub',

  state: {
    EosOrClub:{
      actionAccount: actionAccountEOS, //要转账的账户
      current: "EOS",       //货币的单位
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetchEosOrClub({ payload : { EosOrClub } }, { call, put }) {
      try {
        //  EOS 或者 club
        yield put({ type: "saveEosOrClub", payload: { EosOrClub } })
      } catch (error) {
        message.error(error.message,5);
      }
    },
  },

  reducers: {
    saveEosOrClub(state, action) {
      return { ...state, EosOrClub: action.payload.EosOrClub };
    },
  },

};
