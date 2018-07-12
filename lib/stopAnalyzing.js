/**
 * stop tracing webrtc stats
 */
export default async function (clearStats = false) {
    this.connection = undefined
    this.analyzingScriptIsInjected = false

    return await this.browser.execute((clearStats) => {
        if (clearStats) {
            window._webdriverrtc = undefined
        }

        return window.clearTimeout(window._webdriverrtcTimeout)
    }, clearStats)
}
