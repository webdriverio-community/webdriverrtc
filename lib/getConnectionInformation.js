import { ErrorHandler } from 'webdriverio'

/**
 * get connection information
 * simple command that returns the connection information we saved when running startAnalyzing
 */
export default function getConnectionInformation () {
    if (!this.connection) {
        throw new ErrorHandler.CommandError(
            'No information got recoreded yet. Please run the startAnalyzing command first'
        )
    }

    return this.connection
};
