import React, { PureComponent } from 'react';
import {
  Table,
} from 'antd';
import '../../assets/css/Order.css';
import { formatMessage } from 'umi/locale'

class Order extends PureComponent {

  updateBuyPrice = (price) => {
    this.props.updatePrice({ buyPrice: price})
  }

  updateSellPrice = (price) => {
    this.props.updatePrice({ sellPrice: price})
  }

  componentWillReceiveProps(nextProps){

    if(nextProps.buyOrderList.length > 0 && this.props.buyOrderList !== nextProps.buyOrderList){
      this.updateBuyPrice(nextProps.buyOrderList[0].price)
    }

    if( nextProps.sellOrderList.length > 0 && this.props.sellOrderList !== nextProps.sellOrderList){

      this.updateSellPrice(nextProps.sellOrderList[nextProps.sellOrderList.length-1].price)
    }

  }

  render() {
    const buyOrderList = this.props.buyOrderList;
    const sellOrderList = this.props.sellOrderList;
    const defaultTradingPair = this.props.defaultTradingPair;
    const baseToken = defaultTradingPair.baseToken ? defaultTradingPair.baseToken : ' '
    const exToken = defaultTradingPair.exToken ? defaultTradingPair.exToken : ' '
    const currTradePrice = this.props.currTradePrice

    const sellLastTotal = sellOrderList[0] ? sellOrderList[0].total : ''
    const buyLastTotal = buyOrderList[buyOrderList.length-1] ? buyOrderList[buyOrderList.length-1].total : ''
    const sellColumns = [
      {
        title: formatMessage({id: 'EXCHANGE_PRICE'})+' [' + baseToken + ']',
        dataIndex: 'price',
        key: 'price',
        render(record){
          return parseFloat(record).toFixed(4)
        }
      }, {
        title: formatMessage({id: 'EXCHANGE_AMOUNT'})+' [' + exToken + ']',
        dataIndex: 'amount',
        key: 'amount',
      }, {
        title: formatMessage({id: 'EXCHANGE_TOTAL'})+' [' + exToken + ']',
        dataIndex: 'total',
        key: 'total',
      }, {
        title: '',
        dataIndex: '',
        key: '',
        render: (text, row) => {
          return sellLastTotal ? <span style={{ width: ((row.total / sellLastTotal) * 100) + "%" }}></span>: ''
        }
      }
    ];

    const buyColumns = [
      {
        title: formatMessage({id: 'EXCHANGE_PRICE'})+' [' + baseToken + ']',
        dataIndex: 'price',
        key: 'price',
        render(record){
          return parseFloat(record).toFixed(4)
        }
      }, {
        title: formatMessage({id: 'EXCHANGE_AMOUNT'})+' [' + exToken + ']',
        dataIndex: 'amount',
        key: 'amount',
      }, {
        title: formatMessage({id: 'EXCHANGE_TOTAL'})+' [' + exToken + ']',
        dataIndex: 'total',
        key: 'total',
      }, {
        title: '',
        dataIndex: '',
        key: '',
        render: (text, row) => {
          return buyLastTotal ? <span style={{ width: ((row.total / buyLastTotal) * 100) + "%" }}></span>: ''
        }
      }
    ];

    return (
      <div className="order">
        <p>{formatMessage({id: 'EXCHANGE_ORDER_LIST'})}</p>
        <Table onRow={(record) => {
          return {
            onClick: (event) => {
              this.updateBuyPrice(record.price)
              this.updateSellPrice(record.price)
            }
          };
        }} 
        locale={{ emptyText: '' }} 
        rowKey= {(record,index) => 'sell_order_'+index}
        dataSource={sellOrderList} columns={sellColumns} pagination={{ pageSize: 9 }} />
        <div style={{ fontSize: 16, textAlign: "center", color: '#b9b9b0 !important' }}>{currTradePrice}</div>
        <Table onRow={(record) => {
          return {
            onClick: (event) => {
              this.updateBuyPrice(record.price)
              this.updateSellPrice(record.price)
            }
          };
        }} 
        showHeader={false}
        locale={{ emptyText: '' }}
        rowKey= {(record,index) => 'buy_order_'+index}
        dataSource={buyOrderList} columns={buyColumns} pagination={{ pageSize: 9 }} />
      </div>
    )
  }
}
export default Order;
