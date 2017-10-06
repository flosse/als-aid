const User = require("../../models/User");
const Log = require("../../models/Log");
const Session = require("../../models/Session");

const moment = require("moment");

const { MESSAGES } = require("../../config/constants");

exports.index = (req, res) => {
    Session
    .where({
        user_id: req.user.get("id")
    })
    .where({
        is_valid: 1
    })
    .fetchAll({
        withRelated: ["meta", "logs"]
    })
    .then(sessions => {
        var handsOnTimeArray = [];
        var handsOnTimeArray2 = [];
        var handsOnTimeArray3 = [];
        var handsOnTimeArray4 = [];
        var sessionsLabels = [];
        var barColors = [];
        var barBorders = [];
        var barColorsDefault = ['rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'];
        var barBorderColors = ['rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'];
        let length = sessions.length;
        let countROSC = 0;
        let parity = true;
        var totalAppDurationArray = [];
        var totalCprDurationArray = [];
        var totalDelta = 0;

        for (var i = 0; i < length; i++) {
            var logsArray = sessions.models[i].related('logs').models;
            var startAppTime,
                endAppTime,
                totalCprTime,
                startCprTime,
                endCprTime = 0;
            for (var k = 0; k < logsArray.length; k++) {
                var delta = 0;
                var msg = logsArray[k].get('message');
                var date = logsArray[k].get('date');
                console.log('message = ' + msg);
                console.log('date = ' + date);

                if (msg.indexOf(MESSAGES.APP_START) !== -1) {
                    startAppTime = date;
                }

                if (msg.indexOf(MESSAGES.CPR_START) !== -1) {
                    startCprTime = date;
                    parity = false;
                }

                if (msg.indexOf(MESSAGES.CPR_STOP) !== -1) {
                    if(!parity) {
                        endCprTime = date;
                        delta = moment(endCprTime).diff(moment(startCprTime), 'seconds');
                        totalDelta += delta;
                        parity = true;
                    }
                }

                if (msg.indexOf(MESSAGES.ROSC) !== -1) {
                    countROSC++;
                    let appDuration = moment(date).diff(moment(startAppTime), 'seconds');
                    totalAppDurationArray.push(appDuration);
                    if (totalCprDurationArray.length !== 0) {
                        totalDelta -= totalCprDurationArray.slice(-1)[0];
                    }
                    totalCprDurationArray.push(totalDelta);
                }

            }
        }
        debugger;
        console.log(totalCprDurationArray);
        for (var i = 0; i < totalAppDurationArray.length; i++) {
            let calculatedItem = ((totalCprDurationArray[i] / totalAppDurationArray[i]) * 100).toFixed(2);
            handsOnTimeArray.push(calculatedItem);
            sessionsLabels.push("Session "+(i+1));
            barColors.push(barColorsDefault[i%6]);
            barBorders.push(barBorderColors[i%6]);
        }
        console.log(handsOnTimeArray);

        var timestamp = +Date.now();
        var chart_url = 'charts/chart'+req.user.get("id")+'.png?randomargs='+timestamp;
        var chart_url2 = 'charts/chart'+req.user.get("id")+'number2.png?randomargs='+timestamp;

        if (length !== 0) {
                    outcome = ((countROSC/length)*100).toFixed(2);
                } else {
                    outcome = 0;
                }
        res.render("user/dashboard", {
                    title: "Dashboard",
                    validLogs: length,
                    total: length,
                    rosc: countROSC,
                    chart_url: chart_url,
                    chart_url2: chart_url2,
                    outcome: outcome,
                    barchart_data: JSON.stringify(handsOnTimeArray),
                    label_barchart: JSON.stringify(sessionsLabels),
                    bar_colors: JSON.stringify(barColors),
                    bar_borders: JSON.stringify(barBorders)

                });
    })
    .catch(err => {
        console.log(err)
        Logger.logException(err);
        return res.status(500);
    });
};
