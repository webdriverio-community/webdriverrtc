var ErrorHandler = require('webdriverio').ErrorHandler,
    startAnalyzing = require('./browser/startAnalyzing');

/**
 * initiate WebRTC analyzing
 */
module.exports = function(pcSelectorMethod, interval) {

    var self = this,
        callback = arguments[arguments.length - 1],
        instance = this.instance.instances[Object.keys(this.instance.instances)[0]];

    if(this.analyzingScriptIsInjected) {
        return callback(new ErrorHandler.CommandError('analyzing already started'));
    }
    if(typeof pcSelectorMethod !== 'function') {
        return callback(new ErrorHandler.CommandError('First argument of startAnalyzing has to be a function returning a RTCPeerConnection object'));
    }

    if(typeof interval !== 'number') {
        interval = 1000;
    }

    this.interval = interval;

    instance
        .timeouts('script', 1000)
        .selectorExecuteAsync('body', startAnalyzing.toString(), pcSelectorMethod.toString(), function(err, res) {

            if(err) {
                var errorMessage = '';

                if(err.message.match(/asynchronous script timeout/)) {
                    errorMessage = 'An error occured while starting analysis. Please file a bug report at https://github.com/webdriverio/webdriverrtc/issues/new';
                } else {
                    errorMessage = err.message.slice(err.message.indexOf('Problem:'), err.message.indexOf('JavaScript stack:'));
                }

                return callback(new ErrorHandler.CommandError(errorMessage));
            }

            self.connection = res;
            self.analyzingScriptIsInjected = true;
            callback(err, self.connection);
        });
};
