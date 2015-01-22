var ErrorHandler = require('webdriverio').ErrorHandler;

/**
 * get connection information
 * simple command that returns the connection information we saved when running startAnalyzing
 */
module.exports = function() {

    var callback = arguments[arguments.length - 1];

    if(!this.connection) {
        return callback(new ErrorHandler.CommandError('No information got recoreded yet. Please run the startAnalyzing command first'));
    }

    return  callback(undefined, this.connection);
};
