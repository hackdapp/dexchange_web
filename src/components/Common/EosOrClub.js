import React, { PureComponent } from 'react';
import {
  Radio,
} from 'antd';
import { connect } from 'dva';
import { flow } from 'lodash';
import styles from '../../assets/css/EodOrClub.css';
import { actionAccountEOS, actionAccountDICE, } from '../../utils/commUtils';

class EosOrClub extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }
  handleSizeChange = (e) => {
    const value = e.target.value;
    if (value === "EOS") {
      this.props.saveEosOrClub({
        EosOrClub: {
          actionAccount: actionAccountEOS, //要转账的账户
          current: "EOS"       //货币的单位}
        }
      })
    }
    if (value === "CLUB") {
      this.props.saveEosOrClub({
        EosOrClub: {
          actionAccount: actionAccountDICE, //要转账的账户
          current: "CLUB"       //货币的单位}
        }
      })
    }
  }
  render() {
    const {
      EosOrClub:
      { EosOrClub }
    } = this.props;
    const { size, } = this.state;
    return (
      <div id="billTab" className={styles.billTab}>
        <Radio.Group value={EosOrClub.current} onChange={this.handleSizeChange}>
          <Radio.Button value="EOS" name={actionAccountEOS}>
            <span className={styles.eos}><img src={require('../../assets/images/pc/EOS.png')} alt="betclub" /></span>
            EOS
              </Radio.Button>
          <Radio.Button value="CLUB" name={actionAccountDICE}>
            <span className={styles.club}><img src={require('../../assets/images/pc/CLUB.png')} alt="betclub" /></span>
            CLUB
          </Radio.Button>
        </Radio.Group>
      </div>
    )
  }
}
const mapStateToProps = ({ EosOrClub }) => {
  return {
    EosOrClub
  };
};

const mapDispatchToProps = dispatch => ({
  saveEosOrClub: payload => dispatch({ type: 'EosOrClub/fetchEosOrClub', payload }),//eos或者代币
});
const decorator = flow(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

export default decorator(EosOrClub);
