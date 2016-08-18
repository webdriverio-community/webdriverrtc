/*global browser, appController */
var assert = require('assert')

describe('does webrtc test', function () {
    var channel = Math.round(Math.random() * 100000000000)
    var stats

    it('records connection data and prints them out', function () {
        /**
         * open webrtc connection by going to a random channel on apprtc.appspot.com
         */
        browser.url('/r/' + channel)
        browser.click('#confirm-join-button').pause(5000)

        /**
         * start analyzing
         */
        var browserA = browser.select('browserA')
        browserA.startAnalyzing(function () {
            return appController.call_.pcClient_.pc_
        })

        var connectionType = browserA.getConnectionInformation()
        console.log(connectionType)

        /**
         * record data for 5s
         */
        browser.pause(5000)

        /**
         * print data
         */
        stats = browserA.getStats(5000)
        console.log('mean:', stats.mean)
        console.log('median:', stats.median)
        console.log('max:', stats.max)
        console.log('min:', stats.min)
    })

    it('check audio input level being lower than 5db', function () {
        var inputLevel = stats.max.audio.outbound.inputLevel
        assert.ok(inputLevel < 5000, 'This was too loud! Your audio input level was ' + inputLevel + '.')
    })
})
