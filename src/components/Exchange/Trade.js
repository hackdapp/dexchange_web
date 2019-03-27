import React, { PureComponent } from 'react';
import {
  Collapse
} from 'antd';
import styles from '../../assets/css/Trade.css';
import moment from 'moment';
import { transactionUrl } from '../../utils/commUtils';
import { formatMessage } from 'umi/locale'

const Panel = Collapse.Panel;

class Trade extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  callback(key) {
    // console.log(key);
  }

  render() {
    const marketOrders = this.props.marketOrders
    return (
      <div className={styles.trade}>
        <p>{formatMessage({id: 'EXCHANGE_MARKET_TRADES'})}</p>
        <div className={styles.titles}>
          <span>{formatMessage({id: 'EXCHANGE_PRICE'})} (EOS)</span>
          <span>{formatMessage({id: 'EXCHANGE_AMOUNT'})}</span>
          <span>{formatMessage({id: 'EXCHANGE_TIME'})}</span>
          <span>{formatMessage({id: 'EXCHANGE_DETAIL'})}</span>
        </div>

        <Collapse onChange={this.callback} className="add-del">
          {marketOrders.map((item, index) =>
            <Panel header={<p>
              <span>{parseFloat(item.info.deal_price / item.info.price_precision).toFixed(4)}</span>
              <span>{parseFloat(item.info.deal_amount / item.info.amount_precision).toFixed(4)}</span>
              <span>{moment(item.block_time + 'Z').utcOffset(8).format("HH:mm:ss")}</span>
              <span>{formatMessage({id: 'EXCHANGE_MORE'})}</span>
            </p>}
              key={'market_'+index}>
              <div className={styles.tradeinfo}>
                <p>{formatMessage({id: 'EXCHANGE_BLOCK_NUMBER'})}：<span>{item.block_num}</span></p>
                <p>{formatMessage({id: 'EXCHANGE_BLOCK_TIME'})}：<span>{moment(item.block_time + 'Z').utcOffset(8).format("YYYY-MM-DD HH:mm:ss")}</span></p>
                <p>{formatMessage({id: 'EXCHANGE_BLOCK_BUYER'})}：<span>{item.info.buyer}</span></p>
                <p>{formatMessage({id: 'EXCHANGE_BLOCK_SELLER'})}：<span>{item.info.seller}</span></p>
                <a href={transactionUrl + '/transaction/' + item.trx_id} target="_blank">{formatMessage({id: 'EXCHANGE_DETAIL'})}</a>
              </div>
            </Panel>
          )}
        </Collapse>
      </div>
    )
  }
}
export default Trade;
