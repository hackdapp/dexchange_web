const drinkFinalData = (data, pricePrecision) => {
    let dataBuy = [];
    let dataSell = [];

    let orderBookSingleSideLength = 10;
    let buyData = data.buy.reverse()
    while (dataBuy.length < orderBookSingleSideLength && buyData.length > 0) {
        let tmp = buyData.shift();
        tmp.amount = Number(tmp.quantity.split(' ')[0]);
        tmp.price = Number(tmp.price) / pricePrecision;
        let alreadyStoredLast = dataBuy[dataBuy.length - 1];
        if (!alreadyStoredLast) {
            dataBuy.push({
                price: tmp.price,
                amount: tmp.amount,
                total: tmp.amount
            })
        } else if (alreadyStoredLast.price == tmp.price) {
            dataBuy[dataBuy.length - 1].amount += tmp.amount;
            dataBuy[dataBuy.length - 1].total += tmp.amount;
        } else {
            dataBuy.push({
                price: tmp.price,
                amount: tmp.amount,
                total: alreadyStoredLast.total + tmp.amount
            })
        }
    }
    while (dataSell.length < orderBookSingleSideLength && data.sell.length > 0) {
        let tmp = data.sell.shift();
        tmp.amount = Number(tmp.quantity.split(' ')[0]);
        tmp.price = Number(tmp.price) / pricePrecision;
        let alreadyStoredLast = dataSell[dataSell.length - 1];
        if (!alreadyStoredLast) {
            dataSell.push({
                price: tmp.price,
                amount: tmp.amount,
                total: tmp.amount
            })
        } else if (alreadyStoredLast.price == tmp.price) {
            dataSell[dataSell.length - 1].amount += tmp.amount;
            dataSell[dataSell.length - 1].total += tmp.amount;
        } else {
            dataSell.push({
                price: tmp.price,
                amount: tmp.amount,
                total: alreadyStoredLast.total + tmp.amount
            })
        }
    }
    return [dataBuy, dataSell.reverse()]
}

const getTradingPairTable = (pairs, tokenTable) => {
    let table = {};
    let tradingPairList = [];
    pairs.map((pair) => {
        try {
            const baseInfo = tokenTable[pair.base_id];
            const baseName = baseInfo.symbol;
            const quoteInfo = tokenTable[pair.quote_id];
            const quoteName = tokenTable[pair.quote_id].symbol;

            if (!table[baseName]) {
                table[baseName] = []
            }

            const pricePrecisionNum = Math.log10(pair.price_precision);
            let pairDic = {
                exToken: quoteName,
                baseToken: baseName,
                exID: pair.quote_id,
                baseID: pair.base_id,
                exContract: quoteInfo.contract,
                baseContract: baseInfo.contract,
                pairDisplayName: quoteName + '/' + baseName,
                pairShowName: quoteName + ' / ' + baseName,
                exPrecision: Math.log10(quoteInfo.precision),
                basePrecision: Math.log10(baseInfo.precision),
                pricePrecision: pair.price_precision,
                exSymbolValue: quoteInfo.value,
                baseSymbolValue: baseInfo.value,
                minimumVolume: pair.minimum_volume,
                pricePrecisionNum,
                pairID: pair.id
            };
            table[baseName].push(pairDic);
            tradingPairList.push(pairDic);
        } catch (err) {
            console.log(err);
        }
    })

    return {
        tradingPairTable: table,
        tradingPairList
    };
}

const recentMarketOrder =  (limitnum)=>{
    return [
        [0.005440, 123123123, '04:54:12 PM'],
        [0.005440, 123123123, '04:54:12 PM'],
        [0.005440, 123123123, '04:54:12 PM']
    ];
}

const getLatestActions = (result, actionname) => {
    return result.actions.filter(item => {
        return item.action_trace.act.name === actionname;
    }).map(item => {
        return item.action_trace.act;
    }).sort((a, b) => {
        if (a.account_action_seq > b.account_action_seq) return -1;
        if (a.account_action_seq < b.account_action_seq) return 1;
        return 0;
    })
};

export {
    drinkFinalData,
    getTradingPairTable,
    getLatestActions
}
