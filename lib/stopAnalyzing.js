/**
 * stop tracing webrtc stats
 */
module.exports = function(clearStats) {

    if(typeof clearStats !== 'boolean') {
        clearStats = false;
    }

    var self = this;

    return this.client.execute(function(clearStats) {

        if(clearStats) {
            window._webdriverrtc = undefined;
        }

        return window.clearTimeout(window._webdriverrtcTimeout);
    }, clearStats).then(function(res) {
        self.connection = undefined;
        return res;
    });

};
