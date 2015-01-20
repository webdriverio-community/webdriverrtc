module.exports = function(from, to, interval) {
    var recordedStats = Object.keys(window._webdriverrtc),
        snapshots = [];

    /**
     * if no appropiate parameter was given return the last stat
     */
    if(!from) {
        return window._webdriverrtc[recordedStats[recordedStats.length - 1]];
    }

    recordedStats.forEach(function(timestamp) {
        timestamp = parseInt(timestamp, 10);

        if(timestamp > (from - interval / 2) && (timestamp - interval / 2) < to) {
            snapshots.push(window._webdriverrtc[timestamp]);
        }
    });

    return snapshots;
};
