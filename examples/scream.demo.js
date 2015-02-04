/**
 * This tests fails if you clap or scream while the test is running
 *
 * @author Christian Bromann <christian@saucelabs.com>
 * @license MIT
 */

var WebdriverIO = require('webdriverio'),
    WebdriverRTC = require('../'),
    assert = require('assert'),
    inputLevel, res;

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
});

WebdriverRTC.init(matrix);

var channel = Math.round(Math.random() * 100000000000);

matrix
    .init()
    .url('https://apprtc.appspot.com/r/' + channel)
    .click('#confirm-join-button')
    .pause(5000)
    .startAnalyzing({
        selectorMethod: function() {
            return appController.call_.pcClient_.pc_;
        }
    })
    .pause(5000)
    .getStats(5000, function(err, mean, median, max, min, results) {
        inputLevel = max.audio.outbound.inputLevel;
    })
    .end(function() {
        assert.ok(inputLevel < 5000, 'This was too loud! Your audio input level was ' + inputLevel + '.');
    });
