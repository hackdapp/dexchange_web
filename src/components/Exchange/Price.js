import React, { PureComponent } from 'react';
import {
  Input, Slider, InputNumber, message
} from 'antd';
import styles from '../../assets/css/Price.css';
import stylesMob from '../../assets/css/PriceM.css';
import { formatMessage } from 'umi/locale'

class Price extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      buyPrice: 0.0001,
      buyNum: 0,
      buyTotal: '0.0000',
      sellPrice: 0.0001,
      sellNum: 0,
      sellTotal: '0.0000',
      buyOrSellFlag: true
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    let value = target.value.replace(/[^\-?\d.]/g,'');
    const name = target.name;

    this.setState({
      [name]: value
    });

  }

  buyClick = () => {
    this.setState({
      buyOrSellFlag: true
    })
  }

  sellClick = () => {
    this.setState({
      buyOrSellFlag: false
    })
  }

  buyOrder() {
    const buyPrice = this.state.buyPrice;
    const buyNum = this.state.buyNum;

    if(isNaN(buyPrice) || buyPrice <=0){
      message.error(formatMessage({id: 'EXCHANGE_ERROR_101'}))
      return false;
    }

    if(isNaN(buyNum) || buyNum <=0){
      message.error(formatMessage({id: 'EXCHANGE_ERROR_102'}))
      return false;
    }
    if(!isNaN(buyPrice) && !isNaN(buyNum) && buyNum > 0 && buyPrice > 0){
      this.props.onBuyOrder({ buyPrice, buyNum })
    }

  }

  sellOrder() {
    const sellPrice = this.state.sellPrice;
    const sellNum = this.state.sellNum;
    if(isNaN(sellPrice) || sellPrice <=0){
      message.error(formatMessage({id: 'EXCHANGE_ERROR_103'}))
      return false;
    }

    if(isNaN(sellNum) || sellNum <=0){
      message.error(formatMessage({id: 'EXCHANGE_ERROR_104'}))
      return false;
    }
    if(!isNaN(sellPrice) && !isNaN(sellNum) && sellNum > 0 && sellPrice > 0){
      this.props.onSellOrder({ sellPrice, sellNum })
    }
  }

  onBuySliderChange = (value) => {
    const balance = this.props.balance;
    const baseToken = this.props.defaultTrade.baseToken;

    if (balance[baseToken]){
      const buyNum =  parseInt(balance[baseToken]*value / (this.state.buyPrice*100))
      this.setState({
        buyNum
      })
    }

  }

  onSellSliderChange = (value) => {
    const balance = this.props.balance;
    const exToken = this.props.defaultTrade.exToken;
    if (balance[exToken]){
      const sellNum =  parseInt(balance[exToken]*value / 100)
      this.setState({
        sellNum
      })
    }
  }

  onClickPercent =(value)=>{
    this.state.buyOrSellFlag ? this.onBuySliderChange(value): this.onSellSliderChange(value)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.buyPrice !== "" && this.props.buyPrice !== nextProps.buyPrice){
      this.setState({
        buyPrice:parseFloat(nextProps.buyPrice).toFixed(4),
      })
    }

    if(nextProps.sellPrice !== "" && this.props.sellPrice !== nextProps.sellPrice){
      this.setState({
        sellPrice: parseFloat(nextProps.sellPrice).toFixed(4)
      })
    }
  }

  render() {
    const balance = this.props.balance;
    const defaultTrade = this.props.defaultTrade;
    const baseToken = defaultTrade.baseToken;
    const exToken = defaultTrade.exToken;

    //可买的最大数量
    const availableBuyNum = balance[baseToken] && this.state.buyPrice !=='' && this.state.buyPrice > 0? parseInt(balance[baseToken] / this.state.buyPrice) : 0
    const availableSellNum = balance[exToken] ? parseInt(balance[exToken]) : 0
    const buyTotal = (this.state.buyPrice * this.state.buyNum).toFixed(4)
    const sellTotal = (this.state.sellPrice * this.state.sellNum).toFixed(4)
    const buyMarks = {
      0: {
        style: {
          color: '#fff',
          marginLeft: '-10px'
        },
        label: <strong>0 {exToken}</strong>,
      },
      20: '',
      40: '',
      60: '',
      80: '',
      100: {
        style: {
          width: '70%',
          color: '#fff',
          textAlign: "right",
          marginLeft: '-70%'
        },
        label: <strong>{availableBuyNum} {exToken}</strong>,
      },
    };

    const sellMarks = {
      0: {
        style: {
          color: '#fff',
          marginLeft: '-10px'
        },
        label: <strong>0 {exToken}</strong>,
      },
      20: '',
      40: '',
      60: '',
      80: '',
      100: {
        style: {
          width: '70%',
          color: '#fff',
          textAlign: "right",
          marginLeft: '-70%'
        },
        label: <strong>{availableSellNum} {exToken}</strong>,
      },
    };
    return (
      <div className={styles.price}>
        <div className={styles.priceLeft}>
          <div className="inputs">
            <p>{formatMessage({id: 'EXCHANGE_PRICE'})}</p>
            <Input name="buyPrice" value={this.state.buyPrice}  addonAfter={baseToken} defaultValue={this.state.buyPrice} onChange={this.handleInputChange} />
          </div>
          <div className="inputs">
            <p>{formatMessage({id: 'EXCHANGE_AMOUNT'})}</p>
            <Input name="buyNum" value={this.state.buyNum} addonAfter={exToken} onChange={this.handleInputChange} />
          </div>
          <Slider marks={buyMarks} defaultValue={0} disabled={balance[baseToken] ? false : true} onChange={this.onBuySliderChange} />
          <p>{formatMessage({id: 'EXCHANGE_BUY_TOTAL'})}：<span>{buyTotal} {baseToken}</span></p>
          <p>{formatMessage({id: 'EXCHANGE_AVAILABLE'})}：<span>{balance[baseToken] ? balance[baseToken] : '0.000000'} {baseToken}</span></p>
          <button type="button" name="button" onClick={this.buyOrder.bind(this)} className={styles.buyBtn}>{formatMessage({id: 'EXCHANGE_BUY_BTN'})}</button>
        </div>
        <div className={styles.priceRight}>
          <div className="inputs">
            <p>{formatMessage({id: 'EXCHANGE_PRICE'})}</p>
            <Input name="sellPrice" value={this.state.sellPrice}  addonAfter={baseToken} defaultValue={this.state.sellPrice} onChange={this.handleInputChange} />
          </div>
          <div className="inputs">
            <p>{formatMessage({id: 'EXCHANGE_AMOUNT'})}</p>
            <Input name="sellNum" value={this.state.sellNum} addonAfter={exToken} onChange={this.handleInputChange} />
          </div>
          <Slider marks={sellMarks} defaultValue={0} disabled={balance[exToken] ? false : true} onChange={this.onSellSliderChange} />
          <p>{formatMessage({id: 'EXCHANGE_BUY_TOTAL'})}：<span>{sellTotal} {baseToken}</span></p>
          <p>{formatMessage({id: 'EXCHANGE_AVAILABLE'})}：<span>{balance[exToken] ? balance[exToken] : '0.000000'} {exToken}</span></p>
          <button type="button" name="button" onClick={this.sellOrder.bind(this)} className={styles.soldBtn}>{formatMessage({id: 'EXCHANGE_SELL_BTN'})}</button>
        </div>
        <div className="pricem">
          <p className={stylesMob.pTabs}>
            <span onClick={this.buyClick} className={this.state.buyOrSellFlag ? stylesMob.buyTab : ""}>{formatMessage({id: 'EXCHANGE_BUY_BTN'})}</span>
            <span onClick={this.sellClick} className={this.state.buyOrSellFlag ? "" : stylesMob.sellTab}>{formatMessage({id: 'EXCHANGE_SELL_BTN'})}</span>
          </p>
          <div className={stylesMob.pIpt}>
            <p>{formatMessage({id: 'EXCHANGE_PRICE'})}</p>
            <div>
              <Input value={this.state.buyOrSellFlag ? this.state.buyPrice : this.state.sellPrice} name={this.state.buyOrSellFlag ? "buyPrice" : "sellPrice"} addonAfter={baseToken} defaultValue={this.state.buyOrSellFlag ? this.state.buyPrice : this.state.sellPrice} onChange={this.handleInputChange} style={{ background: "none" }} />
            </div>
          </div>
          <div className={stylesMob.pIpt}>
            <p>{formatMessage({id: 'EXCHANGE_AMOUNT'})}</p>
            <div>
              <Input value={this.state.buyOrSellFlag ? this.state.buyNum : this.state.sellNum} name={this.state.buyOrSellFlag ? "buyNum" : "sellNum"} addonAfter={exToken} defaultValue={this.state.buyOrSellFlag ? this.state.buyNum : this.state.sellNum} onChange={this.handleInputChange} />
            </div>
          </div>
          <div className={stylesMob.per}>
            <span onClick={this.onClickPercent.bind(this,25)}>25%</span>
            <span onClick={this.onClickPercent.bind(this,50)}>50%</span>
            <span onClick={this.onClickPercent.bind(this,75)}>75%</span>
            <span onClick={this.onClickPercent.bind(this,100)}>All</span>
          </div>
          <div className={stylesMob.credit}>
            <p>
              <span>{formatMessage({id: 'EXCHANGE_BUY_TOTAL'})}</span>
              <span>{this.state.buyOrSellFlag ? buyTotal : sellTotal} {baseToken}</span>
            </p>
            <p>
              <span>{formatMessage({id: 'EXCHANGE_AVAILABLE'})}</span>
              <span>{this.state.buyOrSellFlag ? balance[baseToken] ? balance[baseToken] : '0.000000' : balance[exToken] ? balance[exToken] : '0.000000'}  {this.state.buyOrSellFlag ? baseToken :exToken}</span>
            </p>
          </div>
          <div className={stylesMob.deal}>
            <p className={stylesMob.in} onClick={this.buyOrder.bind(this)} style={{ display: this.state.buyOrSellFlag ? "block" : "none" }}>{formatMessage({id: 'EXCHANGE_BUY_BTN'})}</p>
            <p className={stylesMob.out} onClick={this.sellOrder.bind(this)} style={{ display: this.state.buyOrSellFlag ? "none" : "block" }}>{formatMessage({id: 'EXCHANGE_SELL_BTN'})}</p>
          </div>
        </div>
      </div>
    )
  }
}
export default Price;
