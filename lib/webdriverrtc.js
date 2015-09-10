var startAnalyzing = require('./startAnalyzing'),
    stopAnalyzing = require('./stopAnalyzing'),
    getStats = require('./getStats'),
    url = require('./url'),
    getConnectionInformation = require('./getConnectionInformation');

/**
 * WebdriverRTC
 */
var WebdriverRTC = function(webdriverInstance, options) {

    var self = this;

    /**
     * instance need to have addCommand method
     */
    if(typeof webdriverInstance.addCommand !== 'function') {
        throw new Error('you can\'t use WebdriverRTC with this version of WebdriverIO');
    }

    this.interval = 1000;
    this.instance = webdriverInstance;
    this.analyzingScriptIsInjected = false;

    /**
     * add WebdriverRTC commands to WebdriverIO instance
     */
    this.instance.addCommand('__startAnalyzing', startAnalyzing.bind(this));
    this.instance.addCommand('stopAnalyzing', stopAnalyzing.bind(this));
    this.instance.addCommand('getStats', getStats.bind(this));
    this.instance.addCommand('getConnectionInformation', getConnectionInformation.bind(this));

    /**
     * allow startAnalyzing command to get called with just one parameter
     * with typeof function (this is actually not possible with chainit)
     */
    this.instance.startAnalyzing = function() {
        var args = Array.prototype.slice.call(arguments);

        if(args.length === 1) {
            args.push(self.defaultInterval);
        }

        return self.instance.__startAnalyzing.apply(self, args);
    };

    /**
     * overwrite url command in order to masquarade RTCPeerConnection objects
     */
    var urlCommand = this.instance.url;
    this.instance.addCommand('url', url.bind(this, urlCommand), true);

    return this;
};

/**
 * expose WebdriverRTC
 */
module.exports.init = function(webdriverInstance, options) {
    return new WebdriverRTC(webdriverInstance, options);
};
