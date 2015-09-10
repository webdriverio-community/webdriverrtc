var merge  = require('deepmerge'),
    ErrorHandler = require('webdriverio').ErrorHandler,
    calcResult = require('./helpers/calcResult'),
    getStats = require('./browser/getStats');

/**
 * get latest stat
 */
module.exports = function(duration) {

    var instance = this.instance.instances[Object.keys(this.instance.instances)[0]],
        now = (new Date()).getTime(),
        from, to;

    if(typeof duration === 'number') {
        from = now - duration;
        to = now;
    } else if(typeof duration === 'object' && typeof duration.from === 'number' && duration.to === 'number') {
        from = duration.from;
        to = duration.to;
    } else {
        from = now;
        to = now;
    }

    return instance.execute(getStats.toString(), from, to, this.interval).then(function(res) {
        var results = res && res.value ? res.value : undefined,
            rawData = [],
            mean, median, max, min;

        if(!results) {
            throw new ErrorHandler.CommandError('There was a problem receiving the results');
        }

        results.forEach(function(result, i) {
            rawData.push(result.results);
            delete results[i].results;
        });

        if(results.length === 1) {
            return callback(err, results[0], results[0], results[0], results[0]);
        }

        var mean = calcResult['+'](results);
        mean = calcResult['/'](mean, results.length);

        var median = calcResult['[]'](results);
        median = calcResult['-|-'](median);

        var max = calcResult['max'](results);
        var min = calcResult['min'](results);

        return {
            mean: mean,
            median: median,
            max: max,
            min: min,
            rawData: rawData
        };
    });

};
