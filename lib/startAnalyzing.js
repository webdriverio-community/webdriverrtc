var ErrorHandler = require('webdriverio').ErrorHandler,
    startAnalyzing = require('./browser/startAnalyzing');

/**
 * initiate WebRTC analyzing
 */
module.exports = function(pcSelector, interval) {

    var self = this,
        callback = arguments[arguments.length - 1],
        instance = this.instance.instances[Object.keys(this.instance.instances)[0]];

    if(this.analyzingScriptIsInjected) {
        return callback(new ErrorHandler.CommandError('analyzing already started'));
    }

    if(typeof interval !== 'number') {
        interval = 1000;
    }

    this.interval = interval;

    instance
        .timeouts('script', 1000)
        .executeAsync(startAnalyzing.toString(), pcSelector, interval, function(err, res) {

            if(err && err.message.match(/asynchronous script timeout/)) {
                return callback(new ErrorHandler.CommandError('An error occured while starting analysis. Please file a bug report at https://github.com/webdriverio/webdriverrtc/issues/new'));
            }

            self.connectionType = res.value;
            self.analyzingScriptIsInjected = true;
            callback(err, self.connectionType);
        });
};
