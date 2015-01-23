var merge  = require('deepmerge'),
    ErrorHandler = require('webdriverio').ErrorHandler,
    startAnalyzing = require('./browser/startAnalyzing');

/**
 * initiate WebRTC analyzing
 */
module.exports = function(options) {

    var self = this,
        callback = arguments[arguments.length - 1];

    if(this.analyzingScriptIsInjected) {
        return callback(new ErrorHandler.CommandError('analyzing already started'));
    }

    var params = merge({
        instance: Object.keys(this.instance.instances || {})[0],
        interval: 1000,
        selectorMethod: function() { return false; }
    }, options);

    if(typeof params.interval !== 'number') {
        interval = 1000;
    }

    this.client = params.instance ? this.instance.instances[params.instance] : this.instance;

    this.client
        .timeouts('script', 1000)
        .selectorExecuteAsync('body', startAnalyzing.toString(), params.selectorMethod.toString(), params.interval, function(err, res) {

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
