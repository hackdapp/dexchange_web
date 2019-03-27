import * as poolService from '../services/pool';
import * as betService from '../services/bet';
import { message } from "antd";
export default {

  namespace: 'billboard',

  state: {
    rewardamount: 0,      //首页—代币奖励数量
    herolistHistory: {},  //英雄榜历史数据
    bonusList:[],         //分红所有代币总额
    staketotalAmount: '', //代币质押总数
    countTimes: '',       //倒计时
    seed: '',             //转账时memo用
    randomNum: '', //掷骰子处的随机数
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetchSeed({ payload: {  seed } }, { call, put }) {
      try{
        // 转账前获取seed
        const seedRes = yield call(betService.seed);
        const seedResult = seedRes.data;
        if (seedRes && seedResult.code === 0) {
          yield put({ type: 'saveSeed', payload: { seed : seedResult.data } });
        }
      }catch(error){
        message.error(error.message,5);
      }
    },
    *fetchRandom({ payload: { randomNum } }, { call, put }) {
      yield put({ type: "saveRandom", payload: { randomNum } })
    },
    *fetch({ payload : { timevalue } }, { call, put }) { // eslint-disable-line
      try{
        const billRes = yield call(poolService.query);
        const billResult = billRes.data;
        const herolistHistoryRes = yield call(poolService.herolist,timevalue);
        const herolistHistoryResult = herolistHistoryRes.data;

        if(billRes && billResult.code === 0){
          yield put({ type: 'save1', payload: { rewardamount : billResult.data } });
        }
        if(herolistHistoryRes && herolistHistoryResult.code === 0){
          yield put({ type: 'save2', payload: { herolistHistory : herolistHistoryResult.data } });
        }
      }catch(error){
        message.error(error.message,5);
      }

    },
    *saveSum({ payload: { bonusList, staketotalAmount } }, { call, put }) {
      yield put({ type: "savesums", payload: { bonusList, staketotalAmount} })
    },
    *countTime({ payload: {  countTimes } }, { call, put }) {
      yield put({ type: "counttimes", payload: { countTimes} })
    }
  },

  reducers: {
    saveSeed(state, action) {
      return { ...state, seed: action.payload.seed};
    },
    saveRandom(state, action) {
      return { ...state, randomNum: action.payload.randomNum};
    },
    save(state, action) {
      return { ...state, rewardamount: action.payload.rewardamount, herolistHistory : action.payload.herolistHistory};
    },
    save1(state, action) {
      return { ...state, rewardamount: action.payload.rewardamount };
    },
    save2(state, action) {
      return { ...state, herolistHistory : action.payload.herolistHistory};
    },
    savesums(state, action) {
      return { ...state, bonusList: action.payload.bonusList, staketotalAmount: action.payload.staketotalAmount};
    },
    counttimes(state, action) {
      return { ...state, countTimes: action.payload.countTimes};
    },
  },

};
