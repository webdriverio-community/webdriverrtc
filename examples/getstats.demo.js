var WebdriverIO = require('webdriverio'),
    WebdriverRTC = require('../'),
    path = require('path'),
    fs = require('fs'),
    args = [
        "use-fake-device-for-media-stream",
        "use-fake-ui-for-media-stream"
    ];

/**
 * check if fake videos exist
 */
var argsBrowserA = args.slice(0, args.length);
if(fs.existsSync(path.join(__dirname, '..', 'sign_irene_qcif.y4m'))) {
    argsBrowserA.push('use-file-for-fake-video-capture=' + path.join(__dirname, '..', 'sign_irene_qcif.y4m'))
}
var argsBrowserB = args.slice(0, args.length);
if(fs.existsSync(path.join(__dirname, '..', 'silent_qcif.y4m'))) {
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
    .getConnectionInformation(function(err, connectionType) {
        console.log(connectionType);
    })
    .pause(10000)
    .getStats(10000, function(err, mean, median, max, min) {
        console.log('mean:', mean);
        console.log('median:', median);
        console.log('max:', max);
        console.log('min:', min);
    })
    .end();
