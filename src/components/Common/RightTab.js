import React, { PureComponent } from 'react';
import {
  Radio,Icon
} from 'antd';
import { Link } from "react-router-dom";
import '../../assets/css/RightTab.css';
import { formatMessage } from 'umi/locale'
import { connect } from 'dva';
import { flow } from 'lodash';


class RightTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      size: 'RightTab1',
      tabShow: true
    };
  }

  handleSizeChange = (e) => {

    this.setState({ size: e.target.value });
  }
  showOrHide = () => {
    this.setState({
      tabShow: !this.state.tabShow
    })
  }
  render() {
    const { size , tabShow } = this.state;
    const { user: { nowTab } } = this.props;
    return (
      <div id="RightTab" style={{right : tabShow ? "0" : '-100px'}}>
        <div className="rightShowOrHide" onClick={this.showOrHide} style={{right : tabShow ? "90px" : '10px'}}><Icon type="left-square" /></div>
        <Radio.Group value={size} onChange={this.handleSizeChange}>
          <Radio.Button value="RightTab1" style={{background:nowTab === ""? "#ff5400" : "rgba(0,0,0,.4)"}}>
            <Link to='/'>
              <img src={require('../../assets/images/pc/CLUB.png')} alt="betclub" />
              <span>{formatMessage({id: 'RIGHT_GAME_BETCLUB'})}</span>
            </Link>
          </Radio.Button>
          <Radio.Button value="RightTab2" style={{background:nowTab === "lotto"? "#ff5400" : "rgba(0,0,0,.4)"}}>
            <Link to='/lotto'>
              <img src={require('../../assets/images/pc/lotto.png')} alt="betclub" />
              <span>{formatMessage({id: 'RIGHT_GAME_LOTTO'})}</span>
            </Link>
          </Radio.Button>
          <Radio.Button value="RightTab3" style={{background:nowTab === "funnydots"? "#ff5400" : "rgba(0,0,0,.4)"}}>
            <Link to='/funnydots'>
              <img src={require('../../assets/images/funnydots/tab_bg.png')} alt="betclub" />
              <span>推筒子</span>
            </Link>
          </Radio.Button>
          <Radio.Button value="RightTab4" style={{background:nowTab === "redpacket"? "#ff5400" : "rgba(0,0,0,.4)"}}>
            <Link to='/redpacket'>
              <img src={require('../../assets/images/red/red1.png')} alt="betclub" />
              <span>{formatMessage({id: 'RIGHT_GAME_REDPACKET'})}</span>
            </Link>
          </Radio.Button>
          <Radio.Button value="RightTab5" style={{background:nowTab === "baccarat"? "#ff5400" : "rgba(0,0,0,.4)"}}>
            <Link to='/baccarat'>
              <img src={require('../../assets/images/Baccarat/logo.png')} alt="betclub" />
              <span>{formatMessage({id: 'RIGHT_GAME_BACCARAT'})}</span>
            </Link>
          </Radio.Button>
          <Radio.Button value="RightTab6" style={{background:nowTab === "exchange"? "#ff5400" : "rgba(0,0,0,.4)"}}>
            <Link to='/exchange'>
              <img src={require('../../assets/images/pc/ex.png')} alt="betclub" />
              <span>{formatMessage({id: 'RIGHT_GAME_EXCHANGE'})}</span>
            </Link>
          </Radio.Button>
        </Radio.Group>
      </div>
    )
  }
}
const mapStateToProps = ({ user }) => {
  return {
    user,
  };
};

const mapDispatchToProps = dispatch => ({ });
const decorator = flow(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

export default decorator(RightTab);
