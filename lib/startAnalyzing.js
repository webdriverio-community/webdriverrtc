var ErrorHandler = require('webdriverio').ErrorHandler,
    initiateStatTracing = require('./initiateStatTracing');

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

    instance
        .timeouts('script', 1000)
        .executeAsync(initiateStatTracing.toString(), pcSelector, interval, function(err) {

            if(err && err.message.match(/asynchronous script timeout/)) {
                return callback(new ErrorHandler.CommandError('An error occured while starting analysis. Please file a bug report at https://github.com/webdriverio/webdriverrtc/issues/new'));
            }

            self.analyzingScriptIsInjected = true;
            callback(err);
        });
};
