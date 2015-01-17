var startAnalyzing = require('./startAnalyzing'),
    getLatestStats = require('./getLatestStats');

/**
 * WebdriverRTC
 */
var WebdriverRTC = function(webdriverInstance, options) {

    /**
     * instance need to have addCommand method
     */
    if(typeof webdriverInstance.addCommand !== 'function') {
        throw new Error('you can\'t use WebdriverRTC with this version of WebdriverIO');
    }

    this.instance = webdriverInstance;
    this.analyzingScriptIsInjected = false;

    /**
     * add WebdriverRTC commands to WebdriverIO instance
     */
    this.instance.addCommand('startAnalyzing', startAnalyzing.bind(this));
    this.instance.addCommand('getLatestStats', getLatestStats.bind(this));

    return this;

};

/**
 * expose WebdriverRTC
 */
module.exports.init = function(webdriverInstance, options) {
    return new WebdriverRTC(webdriverInstance, options);
};
