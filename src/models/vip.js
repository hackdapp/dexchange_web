import * as vipService from '../services/vip';
import { message } from "antd";
export default {

  namespace: 'vip',

  state: {
    grade: [],
    totalamount: [0,'EOS'],
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *grade({ payload }, { call, put }) {
      try {
        //  VIP－等级
        const gradeRes = yield call(vipService.grade);
        const gradeResult = gradeRes.data;
        yield put({ type: "gradeSave", payload: { grade: gradeResult.data } })
      } catch (error) {
        message.error(error.message,5);
      }
    },
    *totalamount({ payload }, { call, put, select }) {  // eslint-disable-line
      try {
        const exam = yield select(state => state.user);
        // VIP－我的累计赌注额
        const totalamountRes = yield call(vipService.totalamount, exam.account);
        const totalamountResult = totalamountRes.data;

        yield put({ type: 'totalamountSave', payload: { totalamount: totalamountResult.data } });
      } catch (error) {
        message.error(error.message,5);
      }
    },

  },

  reducers: {
    gradeSave(state, action) {
      return { ...state, grade: action.payload.grade };
    },
    totalamountSave(state, action) {
      return { ...state, totalamount: action.payload.totalamount };
    },
  },

};
