import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import '../../assets/css/PriceM.css';

class chattable extends PureComponent{
  render() {
    return (
      <div className="pricem">
        <div className="ant-row">
          <div className="ant-col-24">
            <div>
              <span className="ant-input-group-wrapper">
                <span className="ant-input-wrapper ant-input-group">
                  <span className="ant-input-group-addon">
                    <Icon type="minus" />
                  </span>
                  <input type="text" placeholder="价格 / EOS" className="ant-input number input-content-right" value=""/>
                  <span className="ant-input-group-addon">
                    <Icon type="plus" />
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="ant-row">
          <div className="ant-col-24">
            <div>
              <span className="ant-input-group-wrapper">
                <span className="ant-input-wrapper ant-input-group">
                  <span className="ant-input-group-addon">
                    <Icon type="minus" />
                  </span>
                  <input type="text" placeholder="价格 / EOS" className="ant-input number input-content-right" value=""/>
                  <span className="ant-input-group-addon">
                    <Icon type="plus" />
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default chattable;
