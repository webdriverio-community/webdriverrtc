var url = require('./browser/url');

/**
 * masquerade
 */
module.exports = function() {

    var self = this,
        args = Array.prototype.slice.call(arguments),
        urlCommand = args.shift();

    return urlCommand.apply(this.instance, args).then(function() {
        return self.instance.execute(url.toString());
    });
};
