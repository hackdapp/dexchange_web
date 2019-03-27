import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import { flow } from 'lodash';
import io from 'socket.io-client';
import Char from '../components/Exchange/Char.js';
import Order from '../components/Exchange/Order.js';
import Price from '../components/Exchange/Price.js';
import OrderNow from '../components/Exchange/OrderNow.js';
import OrderHistory from '../components/Exchange/OrderHistory.js';
import Trade from '../components/Exchange/Trade.js';
import styles from '../assets/css/Exchange.css';
import { exchangeBaseUrl, IsPC } from '../utils/commUtils'
import { formatMessage } from 'umi/locale'

const TabPane = Tabs.TabPane;


class Exchange extends PureComponent {

  constructor(props) {
    super(props);

    var socket = io(exchangeBaseUrl, { transports: ['websocket', 'xhr-polling', 'jsonp-polling'] });
    socket.on('connect', function () {
      //console.log('connect', "connect 成功！")
    });

    socket.on('price.update', function (res) {
      //console.log('price.update', res)
      props.setTradingPairPrice({ data: res.data })
      //获取最新的订单
      props.fetchOrderList({})
      // 查询最近的成交列表
      props.getMarketOrders({})
      // 刷新当前用户的当前订单和刷新当前用户的历史订单
      props.getCurrUserOrder({})
      props.getUserHistory({})
      // 刷新我的余额
      props.fetchBalance({})
    });

    this.socket = socket
    // socket.on('kline.update', function (data) {
      //console.log('Exchange', "kline.update")
    // });
  }
  componentDidMount() {
    this.props.fetchNowTab({ nowTab: "exchange" })
  }
  componentWillMount() {
    this.props.fetchTradingPair({})
    this.props.getCurrCoinPrice({})
    this.props.getCurrUserOrder({})

  }

  componentWillUnmount() {
    this.socket.close()
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.exchange.defaultTradingPair !== nextProps.exchange.defaultTradingPair) {
      // 查询当前的挂单列表
      this.props.fetchOrderList({})
      // 查询最近的成交列表
      this.props.getMarketOrders({})
      // 获取当前的价格状态
      this.props.fetchTradingPairPriceState({})
    }

    if (this.props.user.account == "" && nextProps.user.account !== this.props.user.account) {
      this.props.getCurrUserOrder({})
      this.props.getUserHistory({})
    }

    if (nextProps.user.account == "" && nextProps.user.account !== this.props.user.account) {
      //账户注销了，清理个人数据
      this.props.clearCurrUserOrder({})
    }
  }

  render() {
    const defaultTradingPair = this.props.exchange.defaultTradingPair;
    const coinPrice = this.props.exchange.coinPrice;
    const baseKeys = this.props.exchange.baseKeys;
    const buyOrderList = this.props.exchange.buyOrderList;
    const sellOrderList = this.props.exchange.sellOrderList;
    const marketOrders = this.props.exchange.marketOrders;
    const tradingPairPrice = this.props.exchange.tradingPairPrice;
    const userCurrentOrders = this.props.exchange.userCurrentOrders;
    const userHistoryOrders = this.props.exchange.userHistoryOrders;
    const accountBalance = this.props.user.balance;

    const currTradePrice = this.props.exchange.tradingPairPrice[1] ? parseFloat(this.props.exchange.tradingPairPrice[1]).toFixed(4) : '0.0000'

    return (
      <div className="exchanges">
        <div className={styles.exchange}>
          <div className={styles.exchangeTop}>
            <div>
              <Char coinPrice={coinPrice} defaultTrade={defaultTradingPair} baseKeys={baseKeys} tradingPairPrice={tradingPairPrice}></Char>
              <Price buyPrice={this.props.exchange.buyPrice} sellPrice={this.props.exchange.sellPrice} defaultTrade={defaultTradingPair} onBuyOrder={this.props.placeBuyOrder} onSellOrder={this.props.placeSellOrder} balance={accountBalance}></Price>
            </div>
            <Order currTradePrice={currTradePrice} defaultTradingPair={defaultTradingPair} updatePrice={this.props.updatePrice} buyOrderList={buyOrderList} sellOrderList={sellOrderList}></Order>
          </div>
          <div className={styles.orders}>
            <div className={IsPC() ? styles.orderPC : styles.orderM}>
              <Tabs defaultActiveKey={IsPC() ? "order2" : "order1"}>
                {
                  IsPC() ? "" : <TabPane tab={formatMessage({id: 'EXCHANGE_MARKET_TRADES'})} key="order1">
                    <Trade marketOrders={marketOrders}></Trade>
                  </TabPane>
                }
                <TabPane tab={formatMessage({id: 'EXCHANGE_OPEN_ORDERS'})} key="order2">
                  <OrderNow cancleOrder={this.props.cancleOrder} defaultTrade={defaultTradingPair} userCurrentOrders={userCurrentOrders}></OrderNow>
                </TabPane>
                <TabPane tab={formatMessage({id: 'EXCHANGE_HISTORY_ORDERS'})} key="order3">
                  <OrderHistory defaultTrade={defaultTradingPair} userHistoryOrders={userHistoryOrders}></OrderHistory>
                </TabPane>
              </Tabs>
              {
                IsPC() ? <Trade marketOrders={marketOrders}></Trade> : ""
              }
            </div>
          </div>
        </div>

      </div>
    )
  }
};
const mapStateToProps = ({ exchange, user }) => {
  return {
    exchange,
    user
  };
};
const mapDispatchToProps = dispatch => ({
  fetchNowTab:payload => dispatch({ type: 'user/fetchNowTab', payload }),
  fetchBalance: payload => dispatch({ type: 'user/fetchBalance', payload }),
  fetchTradingPair: payload => dispatch({ type: 'exchange/fetchTradingPair', payload }),
  getCurrCoinPrice: payload => dispatch({ type: 'exchange/getCurrCoinPrice', payload }),
  getCurrUserOrder: payload => dispatch({ type: 'exchange/getCurrUserOrder', payload }),
  getMarketOrders: payload => dispatch({ type: 'exchange/getMarketOrders', payload }),
  placeBuyOrder: payload => dispatch({ type: 'exchange/placeBuyOrder', payload }),
  fetchTradingPairPriceState: payload => dispatch({ type: 'exchange/fetchTradingPairPriceState', payload }),
  placeSellOrder: payload => dispatch({ type: 'exchange/placeSellOrder', payload }),
  cancleOrder: payload => dispatch({ type: 'exchange/cancleOrder', payload }),
  clearCurrUserOrder: payload => dispatch({ type: 'exchange/clearCurrUserOrder', payload }),
  fetchOrderList: payload => dispatch({ type: 'exchange/fetchOrderList', payload }),
  updatePrice: payload => dispatch({ type: 'exchange/updatePrice', payload }),
  setTradingPairPrice: payload => dispatch({ type: 'exchange/setTradingPairPrice', payload }),
  getUserHistory: payload => dispatch({ type: 'exchange/getUserHistory', payload }),
});
const decorator = flow(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

export default decorator(Exchange);
