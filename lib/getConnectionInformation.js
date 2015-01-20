var ErrorHandler = require('webdriverio').ErrorHandler;

/**
 * get connection information
 * simple command that returns the connection information we saved when running startAnalyzing
 */
module.exports = function() {

    if(!this.connection) {
        return callback(new ErrorHandler.CommandError('No information got recoreded yet. Please run the startAnalyzing command first'));
    }

    return  arguments[arguments.length - 1](undefined, this.connection);
};
