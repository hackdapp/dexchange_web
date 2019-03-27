import * as React from 'react';
import styles from './index.css';
import * as TradingView from 'TradingView';
import Datafeed from './api/'

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export class TVChartContainer extends React.PureComponent {

	constructor(props) {
		super(props)
		this.state = {
			interval: 15,
			active: '15'
		}
	}

	static defaultProps = {
		symbol: 'Coinbase:JXB/EOS',
		interval: '15',
		containerId: 'tv_chart_container',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		theme: 'Dark',
		autosize: true,
		studiesOverrides: {},
	};
	tvWidget = null;
	componentDidMount() {
		const widgetOptions = {
			symbol: this.props.symbol,
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: Datafeed,
			interval: this.props.interval,
			container_id: this.props.containerId,
			library_path: this.props.libraryPath,
			locale: getLanguageFromURL() || 'en',
			disabled_features: [
				'header_widget',
				'context_menus',
				'display_market_status',
				'use_localstorage_for_settings',
				'compare_symbol',
				'timeframes_toolbar',
				'edit_buttons_in_legend',
				'control_bar',
				'main_series_scale_menu'
			],
			enabled_features: [
				'study_templates',
				'dont_show_boolean_study_arguments',
				'caption_buttons_text_if_possible',
				'hide_last_na_study_output'
			],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			theme: this.props.theme,
			studies_overrides: this.props.studiesOverrides,
		};
		const tvWidget = new TradingView.widget(widgetOptions);
		this.tvWidget = tvWidget;
		tvWidget.onChartReady(() => {

		});
	}

	componentWillUnmount() {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	btnClick = (min) => {
		this.tvWidget.chart().setResolution(min);
		this.setState({
			active: min
		})
	}

	render() {
		const { active } = this.state;
		return (
			<div>
				<p>图表</p>
				<div className={styles.charTime}>
					<span onClick={this.btnClick.bind(this, '1')} style={{ color: active === "1" ? "#58c3e5" : '' }}>1分钟</span>
					<span onClick={this.btnClick.bind(this, '5')} style={{ color: active === "5" ? "#58c3e5" : '' }}>5分钟</span>
					<span onClick={this.btnClick.bind(this, '15')} style={{ color: active === "15" ? "#58c3e5" : '' }}>15分钟</span>
					<span onClick={this.btnClick.bind(this, '30')} style={{ color: active === "30" ? "#58c3e5" : '' }}>30分钟</span>
					<span onClick={this.btnClick.bind(this, '60')} style={{ color: active === "60" ? "#58c3e5" : '' }}>1小时</span>
					<span onClick={this.btnClick.bind(this, 'D')} style={{ color: active === "D" ? "#58c3e5" : '' }}>1天</span>
				</div>
				<div
					id={this.props.containerId}
					className={styles.TVChartContainer}
				/>
			</div>
		);
	}
}
