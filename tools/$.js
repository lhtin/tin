
let _string2number = (str) => {
    return Number(str.replace(/,/g, ''))
}
let _number2string = (num) => {
    let temp = num.toFixed(2).split('.')
    let int1 = temp[0]
    let int2 = ''
    let len = int1.length
    for (let i = 0; i < len; i += 1) {
        if (i > 0 && i % 3 === 0) {
            int2 = `,${int2}`
        }
        int2 = int1[len - 1 - i] + int2
    }
    return `${int2}.${temp[1]}`
}
let _encode = (data) => {
    let encode_data = {}
    Object.getOwnPropertyNames(data)
        .forEach((key) => {
            if (key.indexOf('_') === 0) {
                encode_data[key] = data[key]
            } else {
                encode_data[key] = _number2string(data[key])
            }
        })
    return encode_data
}
let _decode = (data) => {
    let decode_data = {}
    Object.getOwnPropertyNames(data)
        .forEach((key) => {
            if (key.indexOf('_') === 0) {
                decode_data[key] = data[key]
            } else {
                decode_data[key] = _string2number(data[key])
            }
        })
    return decode_data
}

/**
 * @param {Object} data
 * @param {number} data.营业总收入
 * @param {number} data.主营业务收入
 * @param {number} data.营业成本
 * @param {number} data.公允价值变动收益
 * @param {number} data.投资收益
 * @param {number} data.资产减值损失
 * @param {number} data.营业利润
 * @param {number} data.净利润
 */
let calc = (data) => {
    let 营业利润率 = data.营业利润 / data.营业总收入
    let 毛利润 = data.主营业务收入 - data.营业成本
    let 毛利润率 = 毛利润 / data.主营业务收入
    let 公允价值变动收益_投资收益_资产减值损失_比_营业利润 = (data.公允价值变动收益 + data.投资收益 + data.资产减值损失) / data.营业利润
    let 净利润_比_营业利润 = data.净利润 / data.营业利润

    return {
        ...data,
        营业利润率,
        毛利润,
        毛利润率,
        公允价值变动收益_投资收益_资产减值损失_比_营业利润,
        净利润_比_营业利润
    }
}

let $ = (data) => {
    return _encode(calc(_decode(data)))
}

let format_input = (raw_data) => {
    return raw_data
        .split('------')
        .filter((item) => !!item)
        .map((item) => {
            let data = {}
            item.split(/\n+/)
                .filter((line) => !!line)
                .forEach((line) => {
                let temp = line.split('：')
                data[temp[0]] = temp[1]
            })
            return data
        })
}

let format_output = (data) => {
    let output = JSON.stringify(data)
    return output
        .replace(/","/g, '"\n"')
        .replace(/[{}"]/g, '')
        .replace(/:/g, '：')
}

let placeholder = `\
_年份：
营业总收入：
主营业务收入：
营业成本：
公允价值变动收益：
投资收益：
资产减值损失：
营业利润：
净利润：`
