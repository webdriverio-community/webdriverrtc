/**
 * get latest stat
 */
module.exports = function() {

    var callback = arguments[arguments.length - 1],
        instance = this.instance.instances[Object.keys(this.instance.instances)[0]]

    var clientScript = function() {
        var recordedStats = Object.keys(window._webdriverrtc);
        return window._webdriverrtc[recordedStats[recordedStats.length - 1]];
    };

    instance.execute(clientScript.toString(), function(err, res) {
        var result = res ? res.value : undefined;
        callback(err, res.value, res);
    });

};
