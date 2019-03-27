
// ref: https://umijs.org/config/
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: true,
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      title: 'betclub-umi-antd',
      dll: false,
      hardSource: false,
      routes: {
        exclude: [
          /components/,
        ],
      },
    }],
  ],
  externals: {
    "TradingView": "TradingView"
  }
}
