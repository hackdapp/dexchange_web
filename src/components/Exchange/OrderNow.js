import React, { PureComponent } from 'react';
import {
  Table, Progress
} from 'antd';
import moment from 'moment';
import { IsPC, strSplitSpace } from '../../utils/commUtils'
import styles from '../../assets/css/OrderNow.css';
import { formatMessage } from 'umi/locale'

class OrderNow extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {}
  }

  cancleOrder = (record) => {
    this.props.cancleOrder({ order: { id: record.id, type: record.type } })
  }

  render() {

    const dataSource = this.props.userCurrentOrders
    const defaultTrade = this.props.defaultTrade
    const columns = [
      {
        title: formatMessage({id: 'EXCHANGE_TIME'}),
        dataIndex: 'place_time',
        render(text) {
          return IsPC() ? moment(text + 'Z').utcOffset(8).format("YYYY-MM-DD HH:mm:ss") : moment(text + 'Z').utcOffset(8).format("MM-DD HH:mm")
        }
      }, {
        title: formatMessage({id: 'EXCHANGE_ORDER_TYPE'}),
        dataIndex: 'type',
        render(text) {
          return text == 101 ? <span style={{ color: "#74ee9c" }}>买</span> : <span style={{ color: "#da3062" }}>卖</span>
        }
      }, {
        title: formatMessage({id: 'EXCHANGE_PRICE'})+' (EOS)',
        dataIndex: 'price',
        render(text) {
          return parseFloat(text / defaultTrade.pricePrecision).toFixed(4)
        }
      }, {
        title: formatMessage({id: 'EXCHANGE_QUANTITY'})+' (JXB)',
        dataIndex: 'total_quantity',
        render(text) {
          return <span>{parseFloat(strSplitSpace(text)[0]).toFixed(4)}</span>
        }
      }, {
        title: formatMessage({id: 'EXCHANGE_ORDER_PROGRESS'}),
        dataIndex: 'progress',
        key: 'progress',
        render(text, record) {
          return (1 - (strSplitSpace(record.remaining_quantity)[0] / strSplitSpace(record.total_quantity)[0])).toFixed(4)* 100 + '%'
        }
      }, {
        title: formatMessage({id: 'EXCHANGE_ORDER_OPERATION'}),
        dataIndex: 'set',
        render: (text, record) => (
          <span><a onClick={this.cancleOrder.bind(this, record)}>{formatMessage({id: 'EXCHANGE_ORDER_CANCEL'})}</a></span>
        )
      }
    ];

    // <p>当前订单</p>
    return (
      <div id="orderNow">
        <div className="orderNow">
          <Table
            rowKey={(record, index) => 'order_now_' + index}
            dataSource={dataSource} columns={columns} pagination={{ pageSize: 9 }} />
        </div>
        <div className={styles.orderNowList}>
          {
            dataSource.map((item, i) => {
              return <div className={styles.orderItem} key={i}>
                <div className={styles.orderItemTop}>
                  <span className={item.type === 101 ? styles.buy : styles.sell}>{item.type === 101 ? "buy" : "sell"}</span>
                  <span>JXB / EOS</span>
                  <span>{moment(item.place_time + 'Z').utcOffset(8).format("YYYY-MM-DD HH:mm:ss")}</span>
                </div>
                <div className={styles.orderItemBot}>
                  <div>
                    <div>{formatMessage({id: 'EXCHANGE_PRICE'})}(EOS)</div>
                    <div>{item.price && defaultTrade.pricePrecision ? parseFloat(item.price / defaultTrade.pricePrecision).toFixed(4): ''}</div>
                  </div>
                  <div>
                    <div>{formatMessage({id: 'EXCHANGE_AMOUNT'})}(JXB)</div>
                    <div>{parseFloat(strSplitSpace(item.total_quantity)[0]).toFixed(4)}</div>
                  </div>
                  <div>
                    <Progress strokeLinecap="square" type="circle" percent={(1 - (strSplitSpace(item.remaining_quantity)[0] / strSplitSpace(item.total_quantity)[0])) * 100} width={20} /> {(1 - (strSplitSpace(item.remaining_quantity)[0] / strSplitSpace(item.total_quantity)[0])).toFixed(4) * 100 + '%'}
                  </div>
                  <div onClick={this.cancleOrder.bind(this, item)}>{formatMessage({id: 'EXCHANGE_ORDER_CANCEL'})}</div>
                </div>
              </div>
            })
          }
        </div>
      </div>
    )
  }
}
export default OrderNow;
