var merge  = require('deepmerge'),
    calcResult = require('./helpers/calcResult'),
    getStats = require('./browser/getStats');

/**
 * get latest stat
 */
module.exports = function(duration) {

    var callback = arguments[arguments.length - 1],
        instance = this.instance.instances[Object.keys(this.instance.instances)[0]],
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

    instance.execute(getStats.toString(), from, to, this.interval, function(err, res) {
        var results = res && res.value ? res.value : undefined,
            mean, median, max, min;

        if(!results) {
            return callback(new ErrorHandler.CommandError('There was a problem receiving the results'));
        }

        if(results.length === 1) {
            return callback(err, results[0], results[0], results[0], results[0]);
        }

        var mean = calcResult['+'](results);
        mean = calcResult['/'](mean, results.length);

        var median = calcResult['[]'](results);
        median = calcResult['-|-'](median);

        var max = calcResult['max'](results)
        var min = calcResult['min'](results)

        return callback(err, mean, median, max, min);
    });

};
