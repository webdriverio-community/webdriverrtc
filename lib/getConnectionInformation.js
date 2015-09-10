var ErrorHandler = require('webdriverio').ErrorHandler;

/**
 * get connection information
 * simple command that returns the connection information we saved when running startAnalyzing
 */
module.exports = function() {
    if(!this.connection) {
        throw new ErrorHandler.CommandError('No information got recoreded yet. Please run the startAnalyzing command first'));
    }

    return this.connection;
};
