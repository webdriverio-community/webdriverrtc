module.exports = function() {
    var origFunction;

    /**
     * method to masquerade RTCPeerConnection
     */
    var masqueradeFunction = function(param1, param2, param3) {
        var pc = new origFunction(param1, param2, param3);
        window.webdriverRTCPeerConnectionBucket = pc;
        return pc;
    };

    if(window.RTCPeerConnection) {
        origFunction = window.RTCPeerConnection;
        window.RTCPeerConnection = masqueradeFunction;
    } else if(window.webkitRTCPeerConnection) {
        origFunction = window.webkitRTCPeerConnection;
        window.webkitRTCPeerConnection = masqueradeFunction;
    } else if(window.mozRTCPeerConnection) {
        origFunction = window.mozRTCPeerConnection;
        window.mozRTCPeerConnection = masqueradeFunction;
    }

}
