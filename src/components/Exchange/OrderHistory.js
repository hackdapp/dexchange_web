import React, { PureComponent } from 'react';
import {
  Table,
} from 'antd';
import moment from 'moment';
import { IsPC,strSplitSpace } from '../../utils/commUtils'
import '../../assets/css/OrderNow.css';
import { formatMessage } from 'umi/locale'

class OrderHistory extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {

    const dataSource = this.props.userHistoryOrders
    const defaultTrade = this.props.defaultTrade
    const columns = [
      {
        title: formatMessage({id: 'EXCHANGE_TIME'}),
        dataIndex: 'place_time',
        render(text){
          return IsPC() ? moment(text).format("YYYY-MM-DD HH:mm:ss") : moment(text).format("MM-DD HH:mm")
        }
      }, {
        title: formatMessage({id: 'EXCHANGE_ORDER_TYPE'}),
        dataIndex: 'type',
        render (text){
          return  text == 101 ? <span style={{color: "#74ee9c"}}>买</span> : <span style={{color: "#da3062"}}>卖</span>
        }
      }, {
        title: formatMessage({id: 'EXCHANGE_PRICE'})+' (EOS)',
        dataIndex: 'price',
        render(text){
          return parseFloat(text).toFixed(4)
        }
      }, {
        title: formatMessage({id: 'EXCHANGE_QUANTITY'})+' (CLUB)',
        dataIndex: 'total_quantity',
        render (text,record){
          return <span>{text}</span>
        }
      }
    ];

    // <p>历史订单</p>
    return (
      <div className="orderNow">
        <Table 
        dataSource={dataSource}
        rowKey= {(record,index) => 'order_history_'+index}
        columns={columns}  pagination={{ pageSize: 9 }}/>
      </div>
    )
  }
}
export default OrderHistory;
