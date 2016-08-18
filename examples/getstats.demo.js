/* global appController */

/**
 * Example script that opens "https://apprtc.appspot.com" creates an WebRTC connection
 * and traces this connection for 10 seconds to print the available results
 *
 * @author Christian Bromann <christian@saucelabs.com>
 * @license MIT
 */

var WebdriverIO = require('webdriverio')
var WebdriverRTC = require('../')
var path = require('path')
var args = [
    'use-fake-device-for-media-stream',
    'use-fake-ui-for-media-stream'
]

var argsBrowserA = args.slice(0, args.length)
argsBrowserA.push('use-file-for-fake-video-capture=' + path.join(__dirname, 'fixtures', 'sign_irene_qcif.y4m'))

var argsBrowserB = args.slice(0, args.length)
argsBrowserB.push('use-file-for-fake-video-capture=' + path.join(__dirname, 'fixtures', 'silent_qcif.y4m'))

var matrix = WebdriverIO.multiremote({
    browserA: {
        desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: { args: argsBrowserA }
        }
    },
    browserB: {
        desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: { args: argsBrowserB }
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
        }).getConnectionInformation().then(function (connectionType) {
            console.log(connectionType)
        }).pause(2000).getStats(2000).then(function (result) {
            console.log(result)
        })
    })
    .end()
