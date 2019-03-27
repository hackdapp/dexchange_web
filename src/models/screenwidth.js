export default {

  namespace: 'screenwidth',

  state: {
    screenwidth: window.innerWidth,
    screenbig: window.innerWidth > 776 ? true : false
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *screenwidthFetch({ payload : { screenwidth , screenbig } }, { call, put }) {
      yield put({ type: "screenwidthSave", payload: { screenwidth , screenbig } })
    },
  },

  reducers: {
    screenwidthSave(state, action) {
      return { ...state, screenwidth: action.payload.screenwidth , screenbig: action.payload.screenbig };
    },
  },

};
