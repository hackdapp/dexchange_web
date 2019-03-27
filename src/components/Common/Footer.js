import React, { PureComponent } from 'react';
import {
  Layout, Icon, Popover
} from 'antd';
import styles from '../../assets/css/Footer.css';
import { formatMessage } from 'umi/locale'

const {
  Footer,
} = Layout;

class footer extends PureComponent {
  render() {
    return (
      <Layout>
        <Footer>
          <div className={styles.bx}>
            {/* <img src={require('../../assets/images/pc/logo.png')} alt="betclub" />
            <span className={styles.callus}>
              <Popover trigger="click" placement="top" content={<div><img src={require('../../assets/images/pc/wx.jpg')} alt='betclub'  style={{width:"150px"}}/></div>} title="官方微信：betclub01">
                <Icon type="wechat" />
              </Popover>
              <Popover trigger="click" placement="top" content={<div>
                <div>中文:
                <a href="https://t.me/betclub_zh" target="_blank" rel="noopener noreferrer">
                    https://t.me/betclub_zh
                </a></div>
                <div>English:
                <a href="https://t.me/betclub_en" target="_blank" rel="noopener noreferrer">
                    https://t.me/betclub_en
                </a></div>
                <div> Korean:
                <a href="https://t.me/betclub_ko" target="_blank" rel="noopener noreferrer">
                    https://t.me/betclub_ko
                </a>
                </div>
              </div>} title="Telegram">
                <i className="fa fa-send"></i>
              </Popover>
            </span>
            <span>
              <Popover placement="top" content={<a href="mailto:betclub@betclub.one">betclub@betclub.one</a>} title="email">
                <em className={styles.business}>{formatMessage({id: 'FOOTER_COOPERATION'})}</em>
              </Popover>
            </span> */}
          </div>
          <div id="bx" className={styles.bx + " " + styles.boxtips}>
            <div>
              Please arrange your time reasonably, and do not over-indulge.
            </div>
            <div>
              If you reside in a location where lottery, gambling, sports betting or betting over the internet is illegal, please do not click on anything related to these activities on this site. You must be 21 years of age to click on any betting or gambling related items even if it is legal to do so in your location. Recognising that the laws and regulations involving online gaming are different everywhere, readers are advised to check with the laws that exist within their own jurisdiction to ascertain the legality of the activities which are covered.
            </div>
            <div>
              The games provided by BetClub are based on blockchain, fair and transparent. When you start playing these games, please note that online gambling and lottery is an entertainment vehicle and that it carries with it a certain degree of financial risk. Players should be aware of this risk, and govern themselves accordingly.
            </div>
            <div style={{float:"right"}}></div>
          </div>
        </Footer>
      </Layout>
    )
  }
}
export default footer;
// React.render(<App />, document.getElementById('components-menu-demo-horizontal'));
