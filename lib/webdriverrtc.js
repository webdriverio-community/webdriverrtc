import startAnalyzing from './startAnalyzing'
import stopAnalyzing from './stopAnalyzing'
import getStats from './getStats'
import url from './url'
import getConnectionInformation from './getConnectionInformation'

/**
 * WebdriverRTC
 */
class WebdriverRTC {
    constructor (webdriverInstance, options) {
        /**
         * instance need to have addCommand method
         */
        if (typeof webdriverInstance.addCommand !== 'function') {
            throw new Error('you can\'t use WebdriverRTC with this version of WebdriverIO')
        }

        this.interval = 1000
        this.instance = webdriverInstance
        this.analyzingScriptIsInjected = false

        /**
         * add WebdriverRTC commands to WebdriverIO instance
         */
        this.instance.addCommand('startAnalyzing', startAnalyzing.bind(this))
        this.instance.addCommand('stopAnalyzing', stopAnalyzing.bind(this))
        this.instance.addCommand('getStats', getStats.bind(this))
        this.instance.addCommand('getConnectionInformation', getConnectionInformation.bind(this))

        /**
         * overwrite url command in order to masquarade RTCPeerConnection objects
         */
        var urlCommand = this.instance.url
        this.instance.addCommand('url', url.bind(this, urlCommand), true)
    }
}

/**
 * expose WebdriverRTC
 */
export function init (webdriverInstance, options) {
    return new WebdriverRTC(webdriverInstance, options)
}
