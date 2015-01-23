module.exports = function() {
    window.PeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.RTCPeerConnection;
    window.masquaradedPeerConnection = window.PeerConnection;
    window.PeerConnection = function(config) {
        var pc = new window.masquaradedPeerConnection(config);
        window.webdriverRTCPeerConnectionBucket = pc;
        return pc;
    };
}
