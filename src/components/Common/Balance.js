import React, { PureComponent } from 'react';
import { Switch, Tooltip, Modal, Slider, Row, Col, message } from 'antd';
import { connect } from 'dva';
import { flow } from 'lodash';
import styles from '../../assets/css/Billboard.css';
import { } from '../../utils/commUtils';
import { } from 'umi/locale'

class Balance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const {
      user: {
        balance,
        account
      }
    } = this.props;

    return (
        <div className={styles.indexBalance} style={{ display: (account) ? 'block' : 'none' }}>
          <p><img src={require('../../assets/images/pc/EOS.png')} alt="betclub" /><span>{balance.EOS ? balance.EOS : '-'} EOS</span></p>
          <p><img src={require('../../assets/images/pc/CLUB.png')} alt="betclub" /><span>{balance.CLUB ? balance.CLUB : '-'} CLUB</span></p>
        </div>
    )
  }
}
const mapStateToProps = ({ user }) => {
  return {
    user
  };
};

const mapDispatchToProps = dispatch => ({
  fetchList: payload => dispatch({ type: 'user/fetch', payload }),
});
const decorator = flow(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

export default decorator(Balance);

