module.exports = function url () {
    var OriginalRTCPeerConnection;

    /**
     * method to masquerade RTCPeerConnection
     */
    var masqueradeFunction = function (param1, param2, param3) {
        var pc = new OriginalRTCPeerConnection(param1, param2, param3);
        window.webdriverRTCPeerConnectionBucket = pc;
        return pc;
    };

    if (window.RTCPeerConnection) {
        OriginalRTCPeerConnection = window.RTCPeerConnection;
        window.RTCPeerConnection = masqueradeFunction;
    } else if (window.webkitRTCPeerConnection) {
        OriginalRTCPeerConnection = window.webkitRTCPeerConnection;
        window.webkitRTCPeerConnection = masqueradeFunction;
    } else if (window.mozRTCPeerConnection) {
        OriginalRTCPeerConnection = window.mozRTCPeerConnection;
        window.mozRTCPeerConnection = masqueradeFunction;
    }
};
