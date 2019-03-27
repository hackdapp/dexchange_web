export default {

  namespace: 'rooter',

  state: {
    locale:{
      language:"zh",
      message:"中文",
      key: "zh"
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *languageFetch({ payload : { locale } }, { call, put }) {
      yield put({ type: "languageSave", payload: { locale } })
    },
  },

  reducers: {
    languageSave(state, action) {
      return { ...state, locale: action.payload.locale };
    },
  },

};
