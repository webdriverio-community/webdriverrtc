var initiateStatTracing = require('./initiateStatTracing');

/**
 * initiate WebRTC analyzation
 */
module.exports = function(pcSelector, interval) {

    var callback = arguments[arguments.length - 1],
        instance = this.instance.instances[Object.keys(this.instance.instances)[0]];

    if(typeof interval !== 'number') {
        interval = 1000;
    }

    instance
        .timeouts('script', 1000)
        .executeAsync(initiateStatTracing.toString(), pcSelector, interval, function(err) {
            callback(err);
        });
};
