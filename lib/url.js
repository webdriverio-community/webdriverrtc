var url = require('./browser/url');

/**
 * masquarad
 */
module.exports = function() {

    var args = Array.prototype.slice.call(arguments),
        urlCommand = args.shift();

    urlCommand.apply(this.instance, args);
    this.instance.execute(url.toString());

};
