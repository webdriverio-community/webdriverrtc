var merge  = require('deepmerge'),
    ErrorHandler = require('webdriverio').ErrorHandler,
    startAnalyzing = require('./browser/startAnalyzing');

/**
 * initiate WebRTC analyzing
 */
module.exports = function(options) {

    var self = this;

    if(this.analyzingScriptIsInjected) {
        throw new ErrorHandler.CommandError('analyzing already started');
    }

    var params = merge({
        instance: Object.keys(this.instance.instances || {})[0],
        interval: this.interval,
        selectorMethod: function() { return false; }
    }, typeof options === 'object' ? options : {});

    this.interval = params.interval;
    this.client = params.instance ? this.instance.instances[params.instance] : this.instance;

    return this.client
        .timeouts('script', 1000)
        .selectorExecuteAsync('body', startAnalyzing.toString(), params.selectorMethod.toString(), params.interval).then(function(res) {
            if(Object.keys(res).length === 0 || !res) {
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
        }, function(err) {
            if(err.message.match(/asynchronous script timeout/)) {
                throw new ErrorHandler.CommandError('An error occured while starting analysis.' +
                    'Please file a bug report at https://github.com/webdriverio/webdriverrtc/issues/new');
            }

            throw new ErrorHandler.CommandError(err.message.slice(err.message.indexOf('Problem:') + 8, err.message.indexOf('JavaScript stack:')));
        });
};
