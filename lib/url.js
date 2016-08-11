import urlScript from './browser/url'

/**
 * masquerade
 */
export default async function url (...args) {
    const urlCommand = args.shift()
    await urlCommand.apply(this.browser, args)
    return await this.browser.execute(urlScript)
};
