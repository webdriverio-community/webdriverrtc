import startAnalyzing from './startAnalyzing'
import stopAnalyzing from './stopAnalyzing'
import getStats from './getStats'
import url from 'webdriverio/build/lib/protocol/url'
import getConnectionInformation from './getConnectionInformation'
import urlScript from './browser/url'

/**
 * WebdriverRTC
 */
class WebdriverRTC {
    constructor (webdriverInstance, options = {}) {
        /**
         * browser that measures connection required
         */
        if (typeof options.browser !== 'string') {
            throw new Error('Please specify the browser to measure connection data with!')
        }

        /**
         * check if browser name exists in matrix
         */
        if (webdriverInstance.getInstances().indexOf(options.browser) === -1) {
            throw new Error('Specified browser was not found in browser matrix!')
        }

        this.interval = 1000
        this.browser = webdriverInstance.select(options.browser)
        this.analyzingScriptIsInjected = false

        /**
         * add WebdriverRTC commands to choosen matrix browser
         */
        this.browser.addCommand('startAnalyzing', startAnalyzing.bind(this))
        this.browser.addCommand('stopAnalyzing', stopAnalyzing.bind(this))
        this.browser.addCommand('getStats', getStats.bind(this))
        this.browser.addCommand('getConnectionInformation', getConnectionInformation.bind(this))

        /**
         * overwrite url command in order to masquarade RTCPeerConnection objects
         */
        this.browser.addCommand('_url', url)
        this.browser.addCommand('url', async function (...args) {
            const res = await this._url.apply(this, args)
            await this.execute(urlScript)
            return res
        }, true)
    }
}

/**
 * expose WebdriverRTC
 */
export function init (webdriverInstance, options) {
    return new WebdriverRTC(webdriverInstance, options)
}
