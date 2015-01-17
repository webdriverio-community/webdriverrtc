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
                if (!globalObject.audio.prevBytesSent)
                    globalObject.audio.prevBytesSent = res.bytesSent;

                var bytes = res.bytesSent - globalObject.audio.prevBytesSent;
                globalObject.audio.prevBytesSent = res.bytesSent;

                var kilobytes = bytes / 1024;

                result.audio = merge(result.audio, {
                    availableBandwidth: kilobytes.toFixed(1),
                    inputLevel: res.audioInputLevel,
                    packetsLost: res.packetsLost,
                    rtt: res.googRtt,
                    packetsSent: res.packetsSent,
                    bytesSent: res.bytesSent
                });
            }

            if (res.googCodecName == 'VP8') {
                if (!globalObject.video.prevBytesSent)
                    globalObject.video.prevBytesSent = res.bytesSent;

                var bytes = res.bytesSent - globalObject.video.prevBytesSent;
                globalObject.video.prevBytesSent = res.bytesSent;

                var kilobytes = bytes / 1024;

                result.video = merge(result.video, {
                    availableBandwidth: kilobytes.toFixed(1),
                    googFrameHeightInput: res.googFrameHeightInput,
                    googFrameWidthInput: res.googFrameWidthInput,
                    googCaptureQueueDelayMsPerS: res.googCaptureQueueDelayMsPerS,
                    rtt: res.googRtt,
                    packetsLost: res.packetsLost,
                    packetsSent: res.packetsSent,
                    googEncodeUsagePercent: res.googEncodeUsagePercent,
                    googCpuLimitedResolution: res.googCpuLimitedResolution,
                    googNacksReceived: res.googNacksReceived,
                    googFrameRateInput: res.googFrameRateInput,
                    googPlisReceived: res.googPlisReceived,
                    googViewLimitedResolution: res.googViewLimitedResolution,
                    googCaptureJitterMs: res.googCaptureJitterMs,
                    googAvgEncodeMs: res.googAvgEncodeMs,
                    googFrameHeightSent: res.googFrameHeightSent,
                    googFrameRateSent: res.googFrameRateSent,
                    googBandwidthLimitedResolution: res.googBandwidthLimitedResolution,
                    googFrameWidthSent: res.googFrameWidthSent,
                    googFirsReceived: res.googFirsReceived,
                    bytesSent: res.bytesSent
                });
            }

            if (res.type == 'VideoBwe') {
                result.video.bandwidth = {
                    googActualEncBitrate: res.googActualEncBitrate,
                    googAvailableSendBandwidth: res.googAvailableSendBandwidth,
                    googAvailableReceiveBandwidth: res.googAvailableReceiveBandwidth,
                    googRetransmitBitrate: res.googRetransmitBitrate,
                    googTargetEncBitrate: res.googTargetEncBitrate,
                    googBucketDelay: res.googBucketDelay,
                    googTransmitBitrate: res.googTransmitBitrate
                };
            }

            // res.googActiveConnection means either STUN or TURN is used.

            if (res.type == 'googCandidatePair' && res.googActiveConnection == 'true') {
                result.connectionType = {
                    local: {
                        candidateType: res.googLocalCandidateType,
                        ipAddress: res.googLocalAddress
                    },
                    remote: {
                        candidateType: res.googRemoteCandidateType,
                        ipAddress: res.googRemoteAddress
                    },
                    transport: res.googTransportType
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
            var items = [];
            res.result().forEach(function (result) {
                var item = {};
                result.names().forEach(function (name) {
                    item[name] = result.stat(name);
                });
                item.id = result.id;
                item.type = result.type;
                item.timestamp = result.timestamp;
                items.push(item);
            });

            /**
             * trace stats for the first time to check if everything works
             */
            if(Object.keys(window._webdriverrtc).length === 0) {
                traceStats(items);
                cb();
            }

            window._webdriverrtcTimeout = setTimeout(traceStats.bind(window, items), interval);
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
