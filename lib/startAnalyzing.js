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
        interval: this.interval,
        selectorMethod: function() { return false; }
    }, typeof options === 'object' ? options : {});

    this.interval = params.interval;
    this.client = params.instance ? this.instance.instances[params.instance] : this.instance;

    this.client
        .timeouts('script', 1000)
        .selectorExecuteAsync('body', startAnalyzing.toString(), params.selectorMethod.toString(), params.interval, function(err, res) {

            if(err || !res) {
                var errorMessage = '';

                if(err.message.match(/asynchronous script timeout/)) {
                    errorMessage = 'An error occured while starting analysis. Please file a bug report at https://github.com/webdriverio/webdriverrtc/issues/new';
                } else {
                    errorMessage = err.message.slice(err.message.indexOf('Problem:'), err.message.indexOf('JavaScript stack:'));
                }

                return callback(new ErrorHandler.CommandError(errorMessage));
            }

            if(Object.keys(res).length === 0) {
                return callback(new ErrorHandler.CommandError('WebRTC connection didn\'t get established'));
            }

            var ipAddressLocal = res.local.ipAddress.split(/:/),
                ipAddressRemote = res.remote.ipAddress.split(/:/);

            res.local.ipAddress = ipAddressLocal[0];
            res.local.port = ipAddressLocal[1];
            res.remote.ipAddress = ipAddressRemote[0];
            res.remote.port = ipAddressRemote[1];

            self.connection = res;
            self.analyzingScriptIsInjected = true;
            callback(err, self.connection);
        });
};
