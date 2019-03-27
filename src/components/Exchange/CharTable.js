import React, { PureComponent } from 'react';
import {  Tabs, Table } from 'antd';
import '../../assets/css/CharTable.css';

const TabPane = Tabs.TabPane;

class charTable extends PureComponent{
  render() {

    const columns = [{
      title: '币种',
      dataIndex: 'name',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.name.length - b.name.length,
    }, {
      title: '价格',
      dataIndex: 'price',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.price - b.price,
    }, {
      title: '涨幅',
      dataIndex: 'trend',
      defaultSortOrder: 'descend',
      sorter: (a, b) => parseFloat(a.trend) - parseFloat(b.trend),
    }];

    const data = [
      {
        key: '1',
        name: 'CLUB/EOS',
        price: 32,
        trend: '-3.98%',
      }, {
        key: '2',
        name: 'TEA/EOS',
        price: 42,
        trend: '3.98%',
      }, {
        key: '3',
        name: 'MEETONE/EOS',
        price: 32,
        trend: '9.98%',
      }, {
        key: '4',
        name: 'KARMA/EOS',
        price: 32,
        trend: '0.00%',
      }
    ];

    return (
      <div className="CharTable">
        <Tabs defaultActiveKey="char1">
          <TabPane tab="EOS" key="char1">
            <Table columns={columns} dataSource={data}/>
          </TabPane>
          <TabPane tab="CLUB" key="char2">
            <Table columns={columns} dataSource={data}/>
          </TabPane>
          <TabPane tab="EUSD" key="char3">
            <Table columns={columns} dataSource={data}/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default charTable;
