import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import {
  Layout, Menu, Dropdown, Input, Tabs, Icon, Modal, Button, message, Popover, Progress
} from 'antd';
import styles from '../../assets/css/Header.css';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import { flow } from 'lodash';
import { getNowFormatDate, getNowFormatDateStr, numsCur, numsUnit, toNonExponentials, arrIsNull, nowUrl, numMathFloor, } from '../../utils/commUtils';
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale'
import moment from 'moment'

const TabPane = Tabs.TabPane;
const {
  Header,
} = Layout;

// 参数
var dateCount = 0;

class headers extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      intrflag: false,
      profitflag: false,
      pledgeflag: false,
      avatarFlag: false,
      timer: 60,
      timevalue: getNowFormatDateStr(0),
      nowDateTab: getNowFormatDate(0),
      inputPledge: 0.0000, //质押
      inputRansom: 0.0000,  //赎回
      list: 0, // 我的质押数量
      bonus: 0, // 我的余额
      balance: {},//真正的余额
      emailFlag: false,//联系我们部分
      wechatFlag: false,
      telFlag: false,
    }
  }

  // 联系我们
  email = () => {
    this.setState({
      emailFlag: true
    })
  }
  emailCancel = () => {
    this.setState({
      emailFlag: false
    })
  }
  wechat = () => {
    this.setState({
      wechatFlag: true
    })
  }
  wechatCancel = () => {
    this.setState({
      wechatFlag: false
    })
  }
  tel = () => {
    this.setState({
      telFlag: true
    })
  }
  telCancel = () => {
    this.setState({
      telFlag: false
    })
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
      intrflag: false
    });
  }
  // 玩法介绍
  intr = () => {
    this.setState({
      intrflag: true
    });
  }
  intrCancel = (e) => {
    this.setState({
      intrflag: false
    });
  }
  // 分红池
  profit = () => {
    this.setState({
      profitflag: true
    });
  }
  profitCancel = (e) => {
    this.setState({
      profitflag: false
    });
  }
  red = () => {
    this.setState({
      redflag: true
    });
  }
  redCancel = (e) => {
    this.setState({
      redflag: false
    });
  }
  // 质押
  pledge = () => {
    this.setState({
      pledgeflag: true
    });
  }
  pledgeCancel = (e) => {
    this.setState({
      pledgeflag: false
    });
  }
  // 分红记录
  recordsLeft = (e) => {
    dateCount -= 1;
    this.setState({
      nowDateTab: getNowFormatDate(dateCount)
    })
    this.props.fetchList({ timevalue: getNowFormatDateStr(dateCount) });
  }
  recordsRight = (e) => {
    if (dateCount < 0) {
      dateCount += 1;
      this.setState({
        nowDateTab: getNowFormatDate(dateCount)
      })
      this.props.fetchList({ timevalue: getNowFormatDateStr(dateCount) });
    }
  }
  // 登录
  login = () => {
    this.props.getAccountInfo({}).then((res) => {
      if (res) {
        message.success(formatMessage({ id: 'HEADER_USER_LOGIN_0' }), 2);
        this.props.fetchList({ timevalue: this.state.timevalue });
        this.props.totalamountSave({});  //vip累计投注额
        // this.props.fetchBet({ account: testAccount });
        this.props.fetchBet({ account: this.props.user.account });
        this.props.fetchUserhistory({});//Lotto 我的投注
      }
    })
  }
  // 退出
  exit = (e) => {
    this.props.clearUserInfo({});
    this.setState({
      avatarFlag: false
    })
  }
  // 头像
  avatarFun = (e) => {
    this.setState({
      avatarFlag: !this.state.avatarFlag
    })
  }
  avatrCancel = () => {
    this.setState({
      avatarFlag: false
    })
  }
  // 质押输入框
  onChangePledge = (e) => {
    this.setState({
      inputPledge: e.target.value
    });
  }
  onChangePledgeBlur = (e) => {
    this.setState({
      inputPledge: parseFloat(e.target.value).toFixed(4)
    });
  }
  // 赎回输入框
  onChangeRansom = (e) => {
    this.setState({
      inputRansom: e.target.value
    });
  }
  onChangeRansomBlur = (e) => {
    this.setState({
      inputRansom: parseFloat(e.target.value).toFixed(4)
    });
  }
  // 质押代币
  pledgeClick = (e) => {
    const nums = this.state.inputPledge;
    const account = this.props.user.account;
    if (!nums) {
      message.error("请输入质押数量");
      return;
    }
    this.props.pledgeToken({ nums, account }).then((data) => {
      if (data) {
        this.props.fetchList({ timevalue: getNowFormatDateStr(dateCount) });
      }
    })
  }
  // 赎回
  ransomClick = (e) => {
    const nums = this.state.inputRansom;
    const account = this.props.user.account;
    if (!nums) {
      message.error("请输入赎回数量");
      return;
    }
    this.props.redeemToken({ nums, account }).then((data) => {
      if (data) {
        this.props.fetchList({ timevalue: getNowFormatDateStr(dateCount) });
      }
    })
  }
  // 提现
  funds = (e) => {
    var account = this.props.user.account;
    this.props.drawdividend({ account }).then((res)=>{
      if (res.code == 0){
        message.success(formatMessage({id:'HEADER_BONUS_MESSAGE'}))
      }
    })
  }

  chooseLanguage = (lan) => {
    setLocale(lan)
  }
  //倒计时
  timers = () => {
    const _this = this;

    var interval = 1000;

    setInterval(function () {
      var eventTime = moment().add(1, 'hours').unix() - (moment().minutes() * 60 + moment().seconds());
      var currentTime = moment().unix();
      var time = eventTime - currentTime;
      var duration = moment.duration(time * 1000, 'milliseconds');
      _this.props.counttimes({ countTimes: moment(duration.asMilliseconds()).format('00:mm:ss') });
      if (moment(duration.asMilliseconds()).valueOf() == 0) {
        duration = moment.duration(3600 * 1000, 'milliseconds');
      }
    }, interval);
  }

  queryCpu = () => {
    const _this = this
    setInterval(function () {
      const account = _this.props.user.account
      if (account == "") {
        return false;
      }
      _this.props.fetchAccountCPU({ account }).then((res) => {
        /*
        if (res) {
          if(res.cpu_used === res.cpu_total){
            message.error('您的CPU不足！')
          }
          if(res.net_used === res.net_total){
            message.error('您的NET不足！')
          }
        }
        */
      })

    }, 20000);
  }
  cpuurl = () => {
    window.location.href="https://cpuemergency.com/embed_lynx.html";
  }
  componentDidMount() {
    this.timers();//倒计时
    if (!this.props.user.account) {
      this.login();//自动登录
    }

    // 设置轮询 cpu 数据
    this.queryCpu();

    //console.log("componentDidMount....."+this.props.user.account)
    this.props.fetchList({ timevalue: this.state.timevalue });
    this.updateSize();
    window.addEventListener('resize', () => this.updateSize());
  }
  componentWillUnmount() {
    window.removeEventListener('resize', () => this.updateSize());
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user.account == '' && nextProps.user.account) {
      this.props.fetchAccountCPU({ account: nextProps.user.account })
    }
  }


  updateSize() {
    try {
      const parentDom = ReactDOM.findDOMNode(this).parentNode;
      let { width } = this.props;
      //如果props没有指定height和width就自适应
      if (!width) {
        width = parentDom.offsetWidth;
      }
      this.props.screenwidthFetch({
        screenwidth: width,
        screenbig: width > 776 ? true : false
      })
    } catch (ignore) {
    }
  }
  render() {
    const {
      user: {
        list, // 我的质押数量
        records, // 分红记录
        bonus, // 分红池 我的余额
        balance, //首页-余额
        account, //用户名
        cpuInfo
      },
      billboard: {
        bonusList,
        staketotalAmount,
        countTimes
      }
    } = this.props;

    const cpuPercent = cpuInfo.cpu_used ? parseInt(cpuInfo.cpu_used * 100 / cpuInfo.cpu_total) : 0
    const netPercent = cpuInfo.net_used ? parseInt(cpuInfo.net_used * 100 / cpuInfo.net_total) : 0

    function callback(key) {
      //console.log(key);
    }

    return (
      <Layout>
        <Header className="header">
          <Link to='/'>
            
            {/* <img src={require('../../assets/images/pc/logo.png')} alt="betclub" className="logo" /> */}
          </Link>
          
          {/* <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['tab1']}
            style={{ lineHeight: '64px', display: 'inline-block', background: '#0b0f3a' }}>
            <Menu.Item key="tab1" onClick={this.showModal}><FormattedMessage id="HEADER_MENU_TAB1" /></Menu.Item>
            <Menu.Item key="tab2" onClick={this.intr}><FormattedMessage id="HEADER_MENU_TAB2" /></Menu.Item>
            <Menu.Item key="tab3" onClick={this.profit}><FormattedMessage id="HEADER_MENU_TAB3" /></Menu.Item>
            <Menu.Item key="tab4">
              <Link to='/vip' style={{ color: '#fff' }}><FormattedMessage id="HEADER_MENU_TAB4" /></Link>
            </Menu.Item>
          </Menu> */}
          <span id={styles.callusPC} className={styles.callus}>
            {/* <Popover content={<a href="mailto:betclub@betclub.one">betclub@betclub.one</a>} title="官方邮箱">
              <i className="icon ion-ios-email"></i>
            </Popover>
            <Popover content={<div><img src={require('../../assets/images/pc/wx.jpg')} alt='betclub' style={{ width: "150px" }} /></div>} title="官方微信：betclub01" style={{ top: "20px" }}>
              <Icon type="wechat" />
            </Popover>
            <Popover content={<div>
              <div>中文：
              <a href="https://t.me/betclub_zh" target="_blank" rel="noopener noreferrer">
                  https://t.me/betclub_zh
              </a></div>
              <div>英文：
              <a href="https://t.me/betclub_en" target="_blank" rel="noopener noreferrer">
                  https://t.me/betclub_en
              </a></div>
              <div> 韩文：
              <a href="https://t.me/betclub_ko" target="_blank" rel="noopener noreferrer">
                  https://t.me/betclub_ko
              </a>
              </div>
            </div>} title="官方电报群" style={{ top: "20px" }}>
              <i className="fa fa-send"></i>
            </Popover> */}
          </span>
          <div className="cpunet cpunetPC" style={{ display: account ? 'block' : 'none' }} onClick={this.cpuurl}>
            <Progress type="circle" percent={cpuPercent} format={percent => `${percent}% CPU`} width={40} />
            <Progress type="circle" percent={netPercent} format={percent => `${percent}% NET`} width={40} />
          </div>
          <div className="navRight">
            <span onClick={this.chooseLanguage.bind(this, 'zh-CN')}>
              <img src={require('../../assets/images/pc/zh.png')} alt="betclub" />
            </span>
            <span onClick={this.chooseLanguage.bind(this, 'en-US')}>
              <img src={require('../../assets/images/pc/en.png')} alt="betclub" />
            </span>
            <span className="login">
              <span className="loginpc" onClick={this.login} style={{ display: account ? 'none' : 'block' }}>
                <FormattedMessage id="HEADER_USER_LOGIN" />
              </span>
              <span className="exit">
                <span className="pcexit" onClick={this.avatarFun} style={{ display: account ? 'inline-block' : 'none' }} trigger={['click']}>{account}</span>
                <em className="pcexit" onClick={this.exit} style={{ display: this.state.avatarFlag ? 'block' : 'none' }}>
                  <FormattedMessage id="HEADER_USER_LOGOUT" />
                </em>
              </span>
            </span>
          </div>
          <div className="mob">
            <div className="loginAll">
              <span className="loginMob" onClick={this.login} style={{ display: account ? 'none' : 'inline-block' }}><FormattedMessage id="HEADER_USER_LOGIN" /></span>
              <span className="exit">
                <span className="pcexit" onClick={this.avatarFun} style={{ display: account ? 'inline-block' : 'none' }} trigger={['click']}>{account}</span>
                <em onClick={this.exit} style={{ display: (this.state.avatarFlag ? 'block' : 'none') }}><FormattedMessage id="HEADER_USER_LOGOUT" /></em>
              </span>
            </div>
            <Dropdown trigger={['click']} overlay={<Menu>
              <Menu.Item key="mob0" className="changeLag">
                <p onClick={this.chooseLanguage.bind(this, 'zh-CN')}>
                  <em>
                    <img src={require('../../assets/images/pc/zh.png')} alt="betclub" />
                  </em>
                  <FormattedMessage id="HEADER_LAN_ZH" />
                </p>
                <p onClick={this.chooseLanguage.bind(this, 'en-US')} style={{display:"inline-block",width:"100px",marginLeft: "20px"}}>
                  <em>
                    <img src={require('../../assets/images/pc/en.png')} alt="betclub" />
                  </em>
                  <FormattedMessage id="HEADER_LAN_EN" />
                </p>
                <div className={styles.callus} id={styles.callusMob}>
                  <i className="icon ion-ios-email" onClick={this.email}></i>
                  <Icon type="wechat" onClick={this.wechat} />
                  <i className="fa fa-send" onClick={this.tel}></i>
                </div>
              </Menu.Item>
              <Menu.Item>
                <div className="cpunet cpunetM" style={{ display: account ? 'block' : 'none' }} onClick={this.cpuurl}>
                  <Progress type="circle" percent={cpuPercent} format={percent => `${percent}% CPU`} width={40} />
                  <Progress type="circle" percent={netPercent} format={percent => `${percent}% NET`} width={40} />
                </div>
              </Menu.Item>
              <Menu.Item key="mob1" onClick={this.showModal}>
                <FormattedMessage id="HEADER_MENU_TAB1" />
              </Menu.Item>
              <Menu.Item key="mob2" onClick={this.intr}>
                <FormattedMessage id="HEADER_MENU_TAB2" />
              </Menu.Item>
              <Menu.Item key="mob3" onClick={this.profit}><FormattedMessage id="HEADER_MENU_TAB3" /></Menu.Item>
              <Menu.Item key="tab4">
                <Link to='/vip'><FormattedMessage id="HEADER_MENU_TAB4" /></Link>
              </Menu.Item>
            </Menu>}>
              <span className="ant-dropdown-link" href="#" onClick={this.avatrCancel}>
                <i className="icon ion-navicon-round"></i>
              </span>
            </Dropdown>
          </div>
        </Header>
        <Modal
          title={formatMessage({ id: 'HEADER_REFERRAL_TITLE' })}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          style={{ 'background': '#444d54', 'borderRadius': '20px', 'boxShadow': '0 4px 12px rgba(0, 0, 0, 0.15)' }}
          footer={[]}
        >
          <div>
            <p>
              <Input defaultValue={account ? nowUrl(window.location.href) + ('?ref=' + account) : nowUrl(window.location.href)} value={account ? nowUrl(window.location.href) + ('?ref=' + account) : nowUrl(window.location.href)} type="text" spellCheck="false" id="foo" />
              <Button type="primary" id="btn" data-clipboard-target="#foo"><FormattedMessage id="HEADER_REFERRAL_COPY" /></Button>
            </p>
            <p><FormattedMessage id="HEADER_REFERRAL_INFO" /></p>
            <p><FormattedMessage id="HEADER_REFERRAL_INFO_TIP" /></p>
          </div>
        </Modal>
        <Modal
          title={formatMessage({ id: 'HEADER_GUIDE_TITLE' })}
          visible={this.state.intrflag}
          onCancel={this.intrCancel}
          style={{ 'background': '#444d54', 'borderRadius': '20px', 'boxShadow': '0 4px 12px rgba(0, 0, 0, 0.15)' }}
          footer={[]}
        >
          <div className={styles.gameIntr}>
            <ul>
              <li><FormattedMessage id="HEADER_GUIDE_INFO_0" values={{ name: <a href="https://medium.com/coinmonks/create-your-own-eos-account-easily-using-the-non-service-fee-dapp-signupeoseos-b15c5347f2fc" target="_blank" rel="noopener noreferrer">{formatMessage({ id: 'HEADER_GUIDE_INFO_0_name' })}</a> }} /></li>
              <li><FormattedMessage id="HEADER_GUIDE_INFO_1" values={{ name: <a href="https://get-scatter.com/" target="_blank" rel="noopener noreferrer">{formatMessage({ id: 'HEADER_GUIDE_INFO_1_name' })}</a> }} /></li>
              <li><FormattedMessage id="HEADER_GUIDE_INFO_2" /></li>
              <li><FormattedMessage id="HEADER_GUIDE_INFO_3" /></li>
              <li><FormattedMessage id="HEADER_GUIDE_INFO_4" /></li>
              <li><FormattedMessage id="HEADER_GUIDE_INFO_5" /></li>
              <li><FormattedMessage id="HEADER_GUIDE_INFO_6" /></li>
            </ul>
            <p><FormattedMessage id="HEADER_GUIDE_INFO_TIP" /></p>
          </div>
        </Modal>
        <div id="fenhongchi">
          <Modal
            id="red"
            title=""
            closable={false}
            visible={this.state.profitflag}
            onCancel={this.profitCancel}
            footer={[]}
          >
            <div className="red">
              <div className={styles.close} onClick={this.profitCancel}><Icon type="close" /></div>
              <div className="redBg">
                <Tabs defaultActiveKey="red1" onChange={callback}>
                  <TabPane tab={<span><i class="fa fa-line-chart"></i>{formatMessage({ id: 'HEADER_BONUS_PAYOUT_POOL' })}</span>} key="red1">
                    <div className={styles.redTime}>
                      <div>
                        <FormattedMessage id="HEADER_BONUS_CURRENT_PAYOUT" />
                        <em className={styles.redwhat} onClick={this.red}>?</em>
                      </div>
                      <div className={styles.rednext}>
                        <p><FormattedMessage id="HEADER_BONUS_NEXT_PAYOUT" /></p>
                        <p><span>{countTimes}</span></p>
                      </div>
                      <div className={styles.redlist}>
                        {
                          arrIsNull(bonusList).map((item, i) => {
                            return <div className={styles.listitem} key={'li' + i}>
                              <div>
                                <i><img src={numsUnit(item.balance) === 'CLUB' ? require('../../assets/images/pc/CLUB.png') : require('../../assets/images/pc/EOS.png')} alt="betclub" /></i>
                                <span>{item ? item.balance : '0.0000'}</span>
                              </div>
                              <div>
                                <div>
                                  <p><FormattedMessage id="HEADER_BONUS_PAYOUT_ESTIMATED" /></p>
                                  <p>{list ? parseFloat((((parseInt(list) !== 0) ? numsCur(list) : 0) / numsCur(staketotalAmount)) * numsCur(item.balance)).toFixed(10) : 0} {numsUnit(item.balance)}</p>
                                </div>
                                <div>
                                  <p><FormattedMessage id="HEADER_BONUS_PAYOUT_EXPECTED" /></p>
                                  <p>{(numsCur(staketotalAmount) !== 0) ? parseFloat((10000 / numsCur(staketotalAmount)) * numsCur(item.balance)).toFixed(10) : 0} {numsUnit(item.balance)}</p>
                                </div>
                              </div>
                            </div>
                          })
                        }

                      </div>
                      <p className={styles.redtips}><FormattedMessage id="HEADER_BONUS_PAYOUT_TIP" /></p>
                    </div>
                  </TabPane>
                  <TabPane tab={<span><i class="fa fa-money"></i>{formatMessage({ id: 'HEADER_BONUS_STAKE' })}</span>} key="red2">
                    <div className={styles.pledge}>
                      <p>
                        <FormattedMessage id="HEADER_BONUS_STAKE_TOKEN" />
                        <em className={styles.redwhat} onClick={this.pledge}>?</em>
                      </p>
                      <div className={styles.pledgelist}>
                        <div>
                          <p>CLUB <FormattedMessage id="HEADER_BONUS_STAKE_TOTAL" /></p>
                          <i><img src={require('../../assets/images/pc/betclub.png')} alt="betclub" /></i>
                          <p>{staketotalAmount ? staketotalAmount : '0.0000'} CLUB</p>
                        </div>
                        <div className="sure surebefore" style={{ display: account ? 'block' : 'none' }}>
                          <p><FormattedMessage id="HEADER_BONUS_STAKE_CAN_TITLE" /></p>
                          <div>{balance.CLUB ? parseFloat(balance.CLUB - (list ? ((parseInt(list) !== 0) ? numsCur(list) : 0) : 0)).toFixed(4) : "0"} CLUB</div>
                          <div>
                            <img src={require('../../assets/images/pc/CLUB.png')} alt="betclub" />
                            <Input defaultValue="0.0000" onChange={this.onChangePledge} onBlur={this.onChangePledgeBlur} />
                            <span>CLUB</span>
                            <span onClick={this.pledgeClick} className={styles.zhiya + ' ' + styles.stakeBtn}>{formatMessage({ id: 'HEADER_BONUS_STAKE_BTN' })}</span>
                          </div>
                        </div>
                        <div className="sure surePassed" style={{ display: account ? 'block' : 'none' }}>
                          <p><FormattedMessage id="HEADER_BONUS_STAKEED_TITLE" /></p>
                          <div>{list ? list : "0"}<span> ( {staketotalAmount && list && staketotalAmount !== 0 ? numMathFloor(parseFloat(list) * 100 / parseFloat(staketotalAmount),10000) : "0"} % <FormattedMessage id="HEADER_BONUS_STAKE_PERCENT" /> )</span></div>
                          <div>
                            <img src={require('../../assets/images/pc/CLUB.png')} alt="betclub" />
                            <Input defaultValue="0.0000" onChange={this.onChangeRansom} onBlur={this.onChangeRansomBlur} />
                            <span>CLUB</span>
                            <span onClick={this.ransomClick} className={styles.zhiya + ' ' + styles.unstakeBtn}>{formatMessage({ id: 'HEADER_BONUS_STAKE_REDEEM' })}</span>
                          </div>
                        </div>
                      </div>
                      <p className={styles.redtips} style={{ display: "none" }}><FormattedMessage id="HEADER_BONUS_STAKE_TIP" /></p>
                    </div>
                  </TabPane>
                  <TabPane tab={<span><i class="fa fa-clock-o"></i>{formatMessage({ id: 'HEADER_BONUS_PAYOUT_LOGS' })}</span>} key="red3">
                    <div className={styles.bonus}>
                      <p>{formatMessage({ id: 'HEADER_BONUS_PAYOUT_LOGS' })}</p>
                      <p>
                        <Icon type="left-circle" onClick={this.recordsLeft} style={{}} />
                        <span>{this.state.nowDateTab}</span>
                        <Icon type="right-circle" onClick={this.recordsRight} style={{ color: dateCount >= 0 ? 'grey' : '' }} />
                      </p>
                      <ul className={styles.tableHeader}>
                        <li className={styles.tHeader}>
                          <span>{formatMessage({ id: 'HEADER_BONUS_PAYOUT_LOGS_TIME' })}</span>
                          <span>{formatMessage({ id: 'HEADER_BONUS_PAYOUT_LOGS_NUM' })}</span>
                        </li>
                      </ul>
                      <ul className={styles.tableList}>
                        {
                          records.map((item, i) => {
                            return <li key={"list" + i} className={styles.tItems} style={{ dispaly: (Object.keys(item.value).length === 0) ? 'none' : 'block' }}>
                              <span>{item.time}</span>
                              <span>
                                <ul className={styles.pItems}>
                                  <li>{item.value.CLUB ? parseFloat(item.value.CLUB).toFixed(10) : '0.0000000000'} <span>CLUB</span></li>
                                </ul>
                                <ul className={styles.pItems}>
                                  <li>{item.value.EOS ? parseFloat(item.value.EOS).toFixed(10) : '0.0000000000'} <span>EOS</span></li>
                                </ul>
                              </span>
                            </li>
                          })
                        }
                      </ul>
                    </div>
                  </TabPane>
                  <TabPane tab={(account ? <span><i class="fa fa-pie-chart"></i>{formatMessage({ id: 'HEADER_BONUS_MY_BALANCE' })}</span> : '')} key="red4" style={{ display: account ? 'block' : 'none' }}>
                    <div className={styles.balance} style={{ display: account ? 'block' : 'none', }}>
                      <div>
                        <div>
                          <img src={require('../../assets/images/pc/CLUB.png')} alt="betclub" />
                        </div>
                        <div>
                          <p>{bonus.CLUB ? toNonExponentials(bonus.CLUB, 10) : (parseInt(bonus.CLUB) === 0 ? 0 : '-')}</p>
                          <p>CLUB</p>
                        </div>
                      </div>
                      <div>
                        <div>
                          <img src={require('../../assets/images/pc/EOS.png')} alt="betclub" style={{ margin: "0 14px" }} />
                        </div>
                        <div>
                          <p>{bonus.EOS ? toNonExponentials(bonus.EOS, 10) : (parseInt(bonus.EOS) === 0 ? 0 : '-')}</p>
                          <p>EOS</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button style={{ dispaly: "block", float: "none", background: "rgba(0,0,0,0.15)", marginBottom: '20px' }} onClick={this.funds}>{formatMessage({ id: 'HEADER_BONUS_MY_BALANCE_CLAIM' })}</Button>
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </Modal>
        </div>
        <Modal
          title=""
          visible={this.state.redflag}
          onCancel={this.redCancel}
          style={{ 'background': '#444d54', 'borderRadius': '20px', 'boxShadow': '0 4px 12px rgba(0, 0, 0, 0.15)' }}
          footer={[]}
        >
          <div className={styles.part}>
            <p> {formatMessage({ id: 'HEADER_BONUS_PAYOUT_POOL' })}</p>
            <div><FormattedMessage id="HEADER_BONUS_PAYOUT_HELP" values={{ name: <br /> }} /> </div>
          </div>
        </Modal>
        <Modal
          title=""
          visible={this.state.pledgeflag}
          onCancel={this.pledgeCancel}
          style={{ 'background': '#444d54', 'borderRadius': '20px', 'boxShadow': '0 4px 12px rgba(0, 0, 0, 0.15)' }}
          footer={[]}
        >
          <div className={styles.part}>
            <p>{formatMessage({ id: 'HEADER_BONUS_STAKE' })} CLUB</p>
            <div>{formatMessage({ id: 'EADER_BONUS_STAKE_HELP' })}</div>
          </div>
        </Modal>
        <Modal
          title="官方邮箱"
          visible={this.state.emailFlag}
          onCancel={this.emailCancel}
          style={{ 'background': '#444d54', 'borderRadius': '20px', 'boxShadow': '0 4px 12px rgba(0, 0, 0, 0.15)' }}
          footer={[]}
        >
          <div className={styles.callusMob}>
            <a href="mailto:betclub@betclub.one">betclub@betclub.one</a>
          </div>
        </Modal>
        <Modal
          title="官方微信：betclub01"
          visible={this.state.wechatFlag}
          onCancel={this.wechatCancel}
          style={{ 'background': '#444d54', 'borderRadius': '20px', 'boxShadow': '0 4px 12px rgba(0, 0, 0, 0.15)' }}
          footer={[]}
        >
          <div className={styles.callusMob}>
            <div>
              <img src={require('../../assets/images/pc/wx.jpg')} alt='betclub' style={{ width: "150px" }} />
            </div>
          </div>
        </Modal>
        <Modal
          title="官方电报群"
          visible={this.state.telFlag}
          onCancel={this.telCancel}
          style={{ 'background': '#444d54', 'borderRadius': '20px', 'boxShadow': '0 4px 12px rgba(0, 0, 0, 0.15)' }}
          footer={[]}
        >
          <div className={styles.callusMob}>
            <div>中文：
              <a href="https://t.me/betclub_zh" target="_blank" rel="noopener noreferrer">
                https://t.me/betclub_zh
              </a></div>
            <div>英文：
              <a href="https://t.me/betclub_en" target="_blank" rel="noopener noreferrer">
                https://t.me/betclub_en
              </a></div>
            <div> 韩文：
              <a href="https://t.me/betclub_ko" target="_blank" rel="noopener noreferrer">
                https://t.me/betclub_ko
              </a>
            </div>
          </div>
        </Modal>
      </Layout>
    )
  }
}
// export default headers;
const mapStateToProps = ({ user, token, bet, billboard, vip, lotto, screenwidth }) => {
  return {
    user,
    token,
    bet,
    billboard,
    vip,
    lotto,
    screenwidth
  };
};

const mapDispatchToProps = dispatch => ({
  pledgeToken: payload => dispatch({ type: 'token/pledgeToken', payload }),
  redeemToken: payload => dispatch({ type: 'token/redeemToken', payload }),
  drawdividend: payload => dispatch({ type: 'token/drawdividend', payload }),
  getAccountInfo: payload => dispatch({ type: 'user/getAccountInfo', payload }),
  fetchList: payload => dispatch({ type: 'user/fetch', payload }),
  fetchAccountCPU: payload => dispatch({ type: 'user/fetchAccountCPU', payload }),
  fetchBet: payload => dispatch({ type: 'bet/fetch', payload }),
  clearUserInfo: payload => dispatch({ type: 'user/clearUserInfo', payload }),
  totalamountSave: payload => dispatch({ type: 'vip/totalamount', payload }),//VIP－我的累计赌注额
  fetchUserhistory: payload => dispatch({ type: 'lotto/fetchUserhistory', payload }),//lotto 我的投注
  counttimes: payload => dispatch({ type: 'billboard/countTime', payload }),//倒计时时间
  screenwidthFetch: payload => dispatch({ type: 'screenwidth/screenwidthFetch', payload }),
});
const decorator = flow(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

export default decorator(headers);
