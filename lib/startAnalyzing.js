import { ErrorHandler } from 'webdriverio'
import startAnalyzingScript from './browser/startAnalyzing'

/**
 * initiate WebRTC analyzing
 */
export default async function startAnalyzing (selectorMethod = () => false) {
    if (this.analyzingScriptIsInjected) {
        throw new ErrorHandler('CommandError', 'analyzing already started')
    }

    await this.browser.timeouts('script', 1000)
    let res = await this.browser.selectorExecuteAsync(
        'body',
        startAnalyzingScript,
        selectorMethod,
        this.interval
    )

    if (!res || Object.keys(res).length === 0) {
        throw new ErrorHandler('CommandError', 'WebRTC connection didn\'t get established')
    }

    const ipAddressLocal = res.local.ipAddress.split(/:/)
    const ipAddressRemote = res.remote.ipAddress.split(/:/)

    res.local.ipAddress = ipAddressLocal[0]
    res.local.port = ipAddressLocal[1]
    res.remote.ipAddress = ipAddressRemote[0]
    res.remote.port = ipAddressRemote[1]

    this.connection = res
    this.analyzingScriptIsInjected = true
    return this.connection
}
