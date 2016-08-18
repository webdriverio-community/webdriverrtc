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
var fs = require('fs')
var args = [
    'use-fake-device-for-media-stream',
    'use-fake-ui-for-media-stream'
]

/**
 * check if fake videos exist
 */
var argsBrowserA = args.slice(0, args.length)
if (fs.existsSync(path.join(__dirname, '..', 'sign_irene_qcif.y4m'))) {
    argsBrowserA.push('use-file-for-fake-video-capture=' + path.join(__dirname, '..', 'sign_irene_qcif.y4m'))
}
var argsBrowserB = args.slice(0, args.length)
if (fs.existsSync(path.join(__dirname, '..', 'silent_qcif.y4m'))) {
    argsBrowserB.push('use-file-for-fake-video-capture=' + path.join(__dirname, '..', 'silent_qcif.y4m'))
}

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

WebdriverRTC.init(matrix)

var channel = Math.round(Math.random() * 100000000000)

matrix
    .init()
    .url('https://apprtc.appspot.com/r/' + channel)
    .click('#confirm-join-button')
    .pause(5000)
    .startAnalyzing({
        selectorMethod: function () {
            return appController.call_.pcClient_.pc_
        }
    })
    .getConnectionInformation().then(function (connectionType) {
        console.log(connectionType)
    })
    .pause(10000)
    .getStats(10000).then(function (mean, median, max, min) {
        console.log('mean:', mean)
        console.log('median:', median)
        console.log('max:', max)
        console.log('min:', min)
    })
    .end()
