import React, { PureComponent } from 'react';
import { TVChartContainer } from '../TVChartContainer/index.js';
import styles from '../../assets/css/Char.css';
import { formatMessage } from 'umi/locale'

class Char extends PureComponent{
  render() {
    const defaultTrade=this.props.defaultTrade
    const tradingPairPrice = this.props.tradingPairPrice
    const coinPrice = this.props.coinPrice
    const price = tradingPairPrice[1]?parseFloat(tradingPairPrice[1]).toFixed(4):'0.000000'
    const usdPrice = coinPrice['EOS'] ? (coinPrice['EOS'].USD * price).toFixed(4) :'0.000000'
    return (
      <div className="char">
        <div className={styles.charTabs}>
          <div>
            {defaultTrade.pairShowName}
          </div>
          <div><p>{price}</p><p>≈ ${usdPrice }</p></div>
          <div><p>{formatMessage({id: 'EXCHANGE_HEADER_CHANGE'})}</p><p>{tradingPairPrice[2]?tradingPairPrice[2]:'0.00'}%</p></div>
          <div><p>{formatMessage({id: 'EXCHANGE_HEADER_High'})}（24h）</p><p>{tradingPairPrice[5]? tradingPairPrice[5] : '0.0000'}</p></div>
          <div><p>{formatMessage({id: 'EXCHANGE_HEADER_LOW'})}（24h）</p><p>{tradingPairPrice[6]? tradingPairPrice[6] : '0.0000'}</p></div>
          <div><p>24h {formatMessage({id: 'EXCHANGE_HEADER_Volume'})}</p><p>{tradingPairPrice[3]?tradingPairPrice[3]: 0} {defaultTrade.exToken?defaultTrade.exToken:''}</p></div>
        </div>
        <TVChartContainer/>
      </div>
    )
  }
}
export default Char;
