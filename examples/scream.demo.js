/* global appController */

/**
 * This tests fails if you clap or scream while the test is running
 *
 * @author Christian Bromann <christian@saucelabs.com>
 * @license MIT
 */

var WebdriverIO = require('webdriverio')
var WebdriverRTC = require('../')
var assert = require('assert')
var inputLevel

var matrix = WebdriverIO.multiremote({
    browserA: {
        desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: { args: ['use-fake-ui-for-media-stream'] }
        }
    },
    browserB: {
        desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: { args: ['use-fake-ui-for-media-stream'] }
        }
    }
})

WebdriverRTC.init(matrix, {
    browser: 'browserA'
})

var channel = Math.round(Math.random() * 100000000000)
var browserA = matrix.select('browserA')

matrix
    .init()
    .url('https://apprtc.appspot.com/r/' + channel)
    .click('#confirm-join-button')
    .pause(5000)
    .call(function () {
        return browserA.startAnalyzing(function () {
            return appController.call_.pcClient_.pc_
        })
        .pause(5000)
        .getStats(5000).then(function (result) {
            inputLevel = result.max.audio.outbound.inputLevel
        })
    })
    .end().then(function () {
        /**
         * assert in next event loop so that node actually throws the error
         */
        process.nextTick(function () {
            assert.ok(inputLevel < 5000, 'This was too loud! Your audio input level was ' + inputLevel + '.')
        })
    })
