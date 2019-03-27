import React, { PureComponent } from "react";
import { Progress } from 'antd';
import { connect } from 'dva';
import { flow } from 'lodash';
import styles from "../../assets/css/Vip/Vip.css";
import { formatMessage, FormattedMessage } from 'umi/locale'

var tIndex = 0;

class Vip extends PureComponent {
    componentDidMount() {
        this.props.fetchNowTab({ nowTab: "vip" })
        this.props.gradeSave({});
        if (this.props.user.account) {
            this.props.totalamountSave({});
        }
    }
    nums = (num) => {
        this.props.vip.grade.forEach((items, index) => {
            if (num >= items[1]) {
                tIndex = index;
                return;
            }
        })
    }
    render() {
        const {
            user: { account },
            vip: { grade, totalamount }
        } = this.props;
        this.nums(totalamount[0]);
        //console.log('vip', grade)
        //console.log('totalamount', totalamount)
        return (
            <div style={{ background: "#0b0f3a" }} className={styles.vipWidth}>
                <div className={styles.vipContainer}>
                    <div className={styles.vip}>
                        <div className={styles.mygrade}>
                            <p>{formatMessage({ id: 'HEADER_VIP'})}</p>
                            <div>
                                <div className={styles.myprogress} style={{ display: account ? 'flex' : 'none' }}>
                                    <div>
                                        <img style={{height:'60px'}} src={require(`../../assets/images/vip/grade_big${grade.length > 0 ? tIndex : '0'}.png`)} alt="betclub" />
                                    </div>
                                    <div className={styles.mynums}>
                                        <p> <FormattedMessage id="HEADER_VIP_LEVEL_INFO" values={{ num: <span>{((grade.length > 0) && (totalamount[0] >= 1000)) ?
                                                    (grade[tIndex + 1][1] - totalamount[0]) :
                                                    ((totalamount[0] > 0) ? (1000 - totalamount[0]) : '1000')}</span> , level: (totalamount[0] && totalamount[0] >= 1000) ? tIndex + 2 : 1 }} />
                                        </p>
                                        <Progress percent={
                                            ((grade.length > 0) && (totalamount[0] >= 1000)) ?
                                                parseFloat((totalamount[0] - grade[tIndex][1]) * 100 / (grade[tIndex + 1][1] - grade[tIndex][1])).toFixed(6)
                                                : (
                                                    (totalamount[0] > 0) ?
                                                        parseFloat(totalamount[0]* 100 / 1000).toFixed(6)  : 0
                                                )
                                        } className="mypro" />
                                    </div>
                                </div>
                                <div className={styles.protips}>
                                    <p>{formatMessage({ id: 'HEADER_VIP_LEVEL_INTRO'})}</p>
                                    <p>{formatMessage({ id: 'HEADER_VIP_TIP'})}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.grade}>
                            <p>{formatMessage({id:'HEADER_VIP_LEVEL'})}</p>
                            <div>
                                <ul className={styles.gradetitle}>
                                    <li>
                                        <span>{formatMessage({id:'HEADER_VIP_WAGERED'})}</span>
                                        <span>{formatMessage({id:'HEADER_VIP_BONUS'})}</span>
                                    </li>
                                </ul>
                                <ul className={styles.gradecontent}>
                                    {
                                        grade.map((item, i) => {
                                            return <li key={'g' + i}>
                                                <span className={styles.progressNum}>{item[1].toLocaleString()}</span>
                                                <span className={styles.progressLength}></span>
                                                <span className={styles.progressBonus}>
                                                    <img src={require(`../../assets/images/vip/grade_small${i}.png`)} alt="beeclub" />
                                                    <em>{item[2]}</em>
                                                </span>
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = ({ user, vip }) => {
    return {
        user,
        vip
    };
};
const mapDispatchToProps = dispatch => ({
    fetchNowTab:payload => dispatch({ type: 'user/fetchNowTab', payload }),
    gradeSave: payload => dispatch({ type: 'vip/grade', payload }),
    totalamountSave: payload => dispatch({ type: 'vip/totalamount', payload }),
    saveuser: payload => dispatch({ type: 'user/saveAccount', payload })
});
const decorator = flow(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
);

export default decorator(Vip);
