/**
 * this script gets executed in the browser
 */
module.exports = function(pcSelector, interval) {

    var cb = arguments[arguments.length - 1];

    var globalObject = {
        audio: {},
        video: {}
    };

    /**
     * transform string into peer controller object
     */
    function getPeerControllerByString(pcSelector, object) {
        var childElements = pcSelector.split(/\./g),
            nextChild = childElements.shift();

        /**
         * no more childs
         */
        if(nextChild.length === 0) {
            return object;
        }

        return getPeerControllerByString(childElements.join('.'), (object || window)[nextChild]);
    }

    /**
     * merge objects
     */
    function merge(target, src) {
        var dst = {};

        if (target && typeof target === 'object') {
            Object.keys(target).forEach(function (key) {
                dst[key] = target[key];
            })
        }
        Object.keys(src).forEach(function (key) {
            if (typeof src[key] !== 'object' || !src[key]) {
                dst[key] = src[key];
            }
            else {
                if (!target[key]) {
                    dst[key] = src[key];
                } else {
                    dst[key] = deepmerge(target[key], src[key]);
                }
            }
        });

        return dst;
    }

    /**
     * record stats
     */
    function traceStats(results) {
        var result = {
            audio: {},
            video: {},
            results: results
        };

        for (var i = 0; i < results.length; ++i) {
            var res = results[i];

            if (res.googCodecName == 'opus') {
                result.audio = merge(result.audio, {
                    inputLevel: parseInt(res.audioInputLevel, 10),
                    bytesSent: parseInt(res.bytesSent, 10),
                    packetsSent: parseInt(res.packetsSent, 10),
                    packetsLost: parseInt(res.packetsLost, 10),
                    jitterReceived: parseInt(res.googJitterReceived, 10),
                    rtt: parseInt(res.googRtt, 10)
                });
            }

            if (res.googCodecName == 'VP8') {
                result.video = merge(result.video, {
                    bytesSent: parseInt(res.bytesSent, 10),
                    packetsSent: parseInt(res.packetsSent, 10),
                    packetsLost: parseInt(res.packetsLost, 10),
                    frameWidthInput: parseInt(res.googFrameWidthInput, 10),
                    frameHeightInput: parseInt(res.googFrameHeightInput, 10),
                    frameWidthSent: parseInt(res.googFrameWidthSent, 10),
                    frameHeightSent: parseInt(res.googFrameHeightSent, 10),
                    frameRateInput: parseInt(res.googFrameRateInput, 10),
                    frameRateSent: parseInt(res.googFrameRateSent, 10),
                    rtt: parseInt(res.googRtt, 10),
                    avgEncodeMs: parseInt(res.googAvgEncodeMs, 10),
                    captureJitterMs: parseInt(res.googCaptureJitterMs, 10),
                    captureQueueDelayMsPerS: parseInt(res.googCaptureQueueDelayMsPerS, 10),
                    encodeUsagePercent: parseInt(res.googEncodeUsagePercent, 10)
                });
            }

            if (res.type == 'VideoBwe') {
                result.video.bandwidth = {
                    actualEncBitrate: parseInt(res.googActualEncBitrate, 10),
                    availableSendBandwidth: parseInt(res.googAvailableSendBandwidth, 10),
                    availableReceiveBandwidth: parseInt(res.googAvailableReceiveBandwidth, 10),
                    retransmitBitrate: parseInt(res.googRetransmitBitrate, 10),
                    targetEncBitrate: parseInt(res.googTargetEncBitrate, 10),
                    bucketDelay: parseInt(res.googBucketDelay, 10),
                    transmitBitrate: parseInt(res.googTransmitBitrate, 10)
                };
            }
        }

        var timestamp = new Date().getTime();
        window._webdriverrtc[timestamp]= result;
    }

    /**
     * get RTCStatsReports
     */
    function getStats() {
        pc.getStats(function (res) {
            var items = [],
                connectionType = {};

            res.result().forEach(function (result) {
                var item = {};
                result.names().forEach(function (name) {
                    item[name] = result.stat(name);
                });
                item.id = result.id;
                item.type = result.type;
                item.timestamp = result.timestamp;

                if (item.type == 'googCandidatePair' && item.googActiveConnection == 'true') {
                    connectionType = {
                        local: {
                            candidateType: item.googLocalCandidateType,
                            ipAddress: item.googLocalAddress
                        },
                        remote: {
                            candidateType: item.googRemoteCandidateType,
                            ipAddress: item.googRemoteAddress
                        },
                        transport: item.googTransportType
                    };

                    return;
                }

                items.push(item);
            });

            traceStats(items);
            window._webdriverrtcTimeout = setTimeout(getStats.bind(window, items), interval);

            if(typeof cb === 'function') {
                cb(connectionType);
                cb = undefined;
            }
        });
    };

    var pc = getPeerControllerByString(pcSelector);

    if(!pc) {
        throw new Error('RTCPeerConnection not found');
    }

    window._webdriverrtc = {};
    window._webdriverrtcTimeout = null;
    getStats();

};
