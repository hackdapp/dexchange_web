import request from '../../../utils/request';
import { exchangeBaseUrl } from '../../../utils/commUtils';
import moment from 'moment'

const api_root = exchangeBaseUrl + '/kline/query'
const history = {}
export default {
	history: history,

	getBars: function (symbolInfo, resolution, from, to, first, limit) {
		const duration = resolution === 'D' ? 86400 : resolution === '60' ? 3600 : 60
		const body = {
			"pairname": "CLUB/EOS",
			"pairid": 1,
			"begintime": moment(from * 1000).format("YYYY-MM-DD HH:mm"),
			"endtime": moment(to * 1000).format("YYYY-MM-DD HH:mm"),
			"duration": duration
		}

		return request(api_root, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json"
			},
		}).then(res => {
			const resData = res.data
			if (resData.result !== 'ok') {
				return []
			}
			if (resData.data.length) {
				var bars = resData.data.map(el => {
					return {
						time: moment(el[0]).valueOf(), //TradingView requires bar time in ms
						low: el[4],
						high: el[3],
						open: el[2],
						close: el[1],
						volume: el[5]
					}
				})
				if (first) {
					var lastBar = bars[bars.length - 1]
					history[symbolInfo.name] = { lastBar: lastBar }
				}
				return bars
			} else {
				return []
			}
		})
	}
}
