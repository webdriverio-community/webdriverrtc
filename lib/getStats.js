import { ErrorHandler } from 'webdriverio'
import calcResult from './helpers/calcResult'
import getStatsScript from './browser/getStats'

/**
 * get latest stat
 */
export default async function getStats (duration) {
    const now = (new Date()).getTime()
    const rawData = []
    let from = now
    let to = now

    if (typeof duration === 'number') {
        from = now - duration
        to = now
    } else if (typeof duration === 'object' && typeof duration.from === 'number' && duration.to === 'number') {
        from = duration.from
        to = duration.to
    }

    const stats = (await this.browser.execute(getStatsScript, from, to, this.interval)).value

    if (!stats) {
        throw new ErrorHandler.CommandError('There was a problem receiving the results')
    }

    stats.forEach((result, i) => {
        rawData.push(result.results)
        delete stats[i].results
    })

    if (stats.length === 1) {
        return stats[0]
    }

    let mean = calcResult['+'](stats)
    mean = calcResult['/'](mean, stats.length)

    let median = calcResult['[]'](stats)
    median = calcResult['-|-'](median)

    let max = calcResult['max'](stats)
    let min = calcResult['min'](stats)

    return { mean, median, max, min, rawData }
}
