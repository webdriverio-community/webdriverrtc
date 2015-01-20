var WebdriverIO = require('webdriverio'),
    WebdriverRTC = require('./'),
    matrix = WebdriverIO.multiremote({
        browserA: {
            desiredCapabilities: {
                browserName: 'chrome',
                chromeOptions: {
                    binary: "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
                    args: [
                        "use-fake-device-for-media-stream",
                        "use-fake-ui-for-media-stream",
                        "enable-delay-agnostic-aec",
                        "enable-webrtc-hw-h264-encoding",
                        "use-file-for-fake-video-capture=/Users/christianbromann/Sites/Webprojekte/FraunhoferFokus/selenium-fokus/test/fixtures/sign_irene_qcif.y4m"
                    ]
                }
            }
        },
        browserB: {
            desiredCapabilities: {
                browserName: 'chrome',
                chromeOptions: {
                    binary: "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
                    args: [
                        "use-fake-device-for-media-stream",
                        "use-fake-ui-for-media-stream",
                        "enable-delay-agnostic-aec",
                        "enable-webrtc-hw-h264-encoding",
                        "use-file-for-fake-video-capture=/Users/christianbromann/Sites/Webprojekte/FraunhoferFokus/selenium-fokus/test/fixtures/silent_qcif.y4m"
                    ]
                }
            }
        }
    });

WebdriverRTC.init(matrix);

var channel = Math.round(Math.random() * 100000000000);

matrix
    .init()
    .url('https://apprtc.appspot.com/r/' + channel)
    .pause(5000)
    .startAnalyzing('appController.call_.pcClient_.pc_')
    .getConnectionInformation(function(err, connectionType) {
        console.log(connectionType);
    })
    .pause(10000)
    .getStats(10000,function(err, stats) {
        console.log(stats);
    })
    .end();
