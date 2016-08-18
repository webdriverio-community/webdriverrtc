/**
 * this script gets executed in the browser
 */
module.exports = function startAnalyzing (_, pcSelectorMethod, interval) {
    var cb = arguments[arguments.length - 1];

    /**
     * merge objects (copied from deepmerge)
     */
    function merge (target, src) {
        var dst = {};

        if (target && typeof target === 'object') {
            Object.keys(target).forEach(function (key) {
                dst[key] = target[key];
            });
        }
        Object.keys(src).forEach(function (key) {
            if (typeof src[key] !== 'object' || !src[key]) {
                dst[key] = src[key];
            } else {
                if (!target[key]) {
                    dst[key] = src[key];
                } else {
                    dst[key] = merge(target[key], src[key]);
                }
            }
        });

        return dst;
    }

    /**
     * sanitize stat values
     */
    function sanitize (val) {
        if (typeof val !== 'string' && typeof val !== 'number') {
            return undefined;
        }

        return parseInt(val, 10);
    }

    /**
     * record stats
     */
    function traceStats (results) {
        var result = {
            audio: {},
            video: {},
            results: results
        };

        for (var i = 0; i < results.length; ++i) {
            var res = results[i];

            /**
             * RTCOutboundRTPStreamStats
             */
            if (res.googCodecName === 'opus' && res.bytesSent && res.packetsSent) {
                result.audio.outbound = {
                    bytesSent: sanitize(res.bytesSent),
                    packetsSent: sanitize(res.packetsSent),
                    rtt: sanitize(res.googRtt),
                    inputLevel: sanitize(res.audioInputLevel),
                    packetsLost: sanitize(res.packetsLost),
                    jitter: sanitize(res.googJitterReceived)
                };

            /**
             * RTCInboundRTPStreamStats
             */
            } else if (res.googCodecName === 'opus' && res.bytesReceived && res.packetsReceived) {
                result.audio.inbound = {
                    bytesReceived: sanitize(res.bytesReceived),
                    packetsReceived: sanitize(res.packetsReceived),
                    outputLevel: sanitize(res.audioOutputLevel),
                    packetsLost: sanitize(res.packetsLost),
                    jitter: sanitize(res.googJitterReceived)
                };
            }

            if (res.googCodecName === 'VP8') {
                result.video = merge(result.video, {
                    bytesSent: sanitize(res.bytesSent),
                    packetsSent: sanitize(res.packetsSent),
                    packetsLost: sanitize(res.packetsLost),
                    frameWidthInput: sanitize(res.googFrameWidthInput),
                    frameHeightInput: sanitize(res.googFrameHeightInput),
                    frameWidthSent: sanitize(res.googFrameWidthSent),
                    frameHeightSent: sanitize(res.googFrameHeightSent),
                    frameRateInput: sanitize(res.googFrameRateInput),
                    frameRateSent: sanitize(res.googFrameRateSent),
                    rtt: sanitize(res.googRtt),
                    avgEncodeMs: sanitize(res.googAvgEncodeMs),
                    captureJitterMs: sanitize(res.googCaptureJitterMs),
                    captureQueueDelayMsPerS: sanitize(res.googCaptureQueueDelayMsPerS),
                    encodeUsagePercent: sanitize(res.googEncodeUsagePercent)
                });
            }

            if (res.type === 'VideoBwe') {
                result.video.bandwidth = {
                    actualEncBitrate: sanitize(res.googActualEncBitrate),
                    availableSendBandwidth: sanitize(res.googAvailableSendBandwidth),
                    availableReceiveBandwidth: sanitize(res.googAvailableReceiveBandwidth),
                    retransmitBitrate: sanitize(res.googRetransmitBitrate),
                    targetEncBitrate: sanitize(res.googTargetEncBitrate),
                    bucketDelay: sanitize(res.googBucketDelay),
                    transmitBitrate: sanitize(res.googTransmitBitrate)
                };
            }
        }

        var timestamp = new Date().getTime();
        window._webdriverrtc[timestamp] = result;
    }

    /**
     * get RTCStatsReports
     */
    function getStats () {
        pc.getStats(function (res) {
            var items = [];
            var connectionType = {};

            res.result().forEach(function (result) {
                var item = {};
                result.names().forEach(function (name) {
                    item[name] = result.stat(name);
                });
                item.id = result.id;
                item.type = result.type;
                item.timestamp = result.timestamp;

                if (item.type === 'googCandidatePair' && item.googActiveConnection === 'true') {
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

            if (typeof cb === 'function') {
                cb(connectionType);
                cb = undefined;
            }
        });
    }

    var pc = pcSelectorMethod() || window.webdriverRTCPeerConnectionBucket;

    if (!pc || pc.constructor.name !== 'RTCPeerConnection') {
        throw new Error('RTCPeerConnection not found');
    }

    window._webdriverrtc = {};
    window._webdriverrtcTimeout = null;
    getStats();
};
