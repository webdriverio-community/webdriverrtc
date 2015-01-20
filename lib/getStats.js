var calcResult = require('./helpers/calcResult'),
    getStats = require('./browser/getStats');

/**
 * get latest stat
 */
module.exports = function(duration) {

    var callback = arguments[arguments.length - 1],
        instance = this.instance.instances[Object.keys(this.instance.instances)[0]],
        now = (new Date()).getTime(),
        result = {
            audio: {
                jitterReceived: 0,
                rtt: 0,
                packetsLost: 0,
                packetsSent: 0,
                bytesSent: 0,
                inputLevel: 0
            },
            video: {
                captureJitterMs: 0,
                encodeUsagePercent: 0,
                frameWidthInput: 0,
                captureQueueDelayMsPerS: 0,
                bandwidth: {
                    actualEncBitrate: 0,
                    availableReceiveBandwidth: 0,
                    targetEncBitrate: 0,
                    transmitBitrate: 0,
                    retransmitBitrate: 0,
                    bucketDelay: 0,
                    availableSendBandwidth: 0
                },
                frameRateSent: 0,
                avgEncodeMs: 0,
                bytesSent: 0,
                frameWidthSent: 0,
                frameHeightInput: 0,
                rtt: 0,
                frameHeightSent: 0,
                packetsLost: 0,
                packetsSent: 0,
                frameRateInput: 0
            },
        },
        from, to;

    if(typeof duration === 'number') {
        from = now - duration;
        to = now;
    } else if(typeof duration === 'object' && typeof duration.from === 'number' && duration.to === 'number') {
        from = duration.from;
        to = duration.to;
    } else {
        from = now;
        to = now;
    }

    instance.execute(getStats.toString(), from, to, this.interval, function(err, res) {
        var results = res && res.value ? res.value : undefined;

        if(!results) {
            return callback(new ErrorHandler.CommandError('There was a problem receiving the results'));
        }

        if(results.length === 1) {
            return callback(err, results[0], res);
        }

        calcResult['+'](results, result)
        calcResult['/'](result, results.length);

        return callback(err, result, res);
    });

};
