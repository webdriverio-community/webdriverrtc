/**
 * calculate result
 */
var calcResult = module.exports = {
    /**
     * adds all consecutive result values
     */
    '+': function(results, result) {

        if(results instanceof Array) {
            var ret = {};
            results.forEach(function(result) {
                calcResult['+'](result, ret);
            });
            return ret;
        }

        Object.keys(results).forEach(function(attr) {

            if(typeof results[attr] === 'object') {
                if(!result[attr]) {
                    result[attr] = {};
                }

                return calcResult['+'](results[attr], result[attr])
            }

            result[attr] = (result[attr] || 0) + results[attr];

        });
    },
    /**
     * devides each object value by divisor
     */
    '/': function(divident, divisor, toFixed) {
        var result = JSON.parse(JSON.stringify(divident));
        toFixed = toFixed || 2;

        Object.keys(result).forEach(function(attr) {

            if(typeof result[attr] === 'object') {
                return result[attr] = calcResult['/'](result[attr], divisor, toFixed);
            }

            result[attr] /= divisor;
            result[attr] = result[attr].toFixed(toFixed) / 1;

        });

        return result;
    },
    /**
     * keeps the max value
     */
    'max': function(results, result) {

        if(results instanceof Array) {
            var ret = {};
            results.forEach(function(result) {
                calcResult['max'](result, ret);
            });
            return ret;
        }

        Object.keys(results).forEach(function(attr) {

            if(typeof results[attr] === 'object') {
                if(!result[attr]) {
                    result[attr] = {};
                }

                return calcResult['max'](results[attr], result[attr] || {});
            }

            if(!result[attr]) {
                result[attr] = results[attr];
            } else if(results[attr] > result[attr]) {
                result[attr] = results[attr];
            }

        });
    },
    /**
     * keeps the min value
     */
    'min': function(results, result) {

        if(results instanceof Array) {
            var ret = {};
            results.forEach(function(result) {
                calcResult['min'](result, ret);
            });
            return ret;
        }

        Object.keys(results).forEach(function(attr) {

            if(typeof results[attr] === 'object') {
                if(!result[attr]) {
                    result[attr] = {};
                }

                return calcResult['min'](results[attr], result[attr] || {});
            }

            if(!result[attr]) {
                result[attr] = results[attr];
            } else if(results[attr] < result[attr]) {
                result[attr] = results[attr];
            }

        });
    },
    /**
     * puts all consecutive results in one array
     */
    '[]': function(results, result) {

        if(results instanceof Array) {
            var ret = {};
            results.forEach(function(result) {
                calcResult['[]'](result, ret);
            });
            return ret;
        }

        /**
         * first sum up each result
         */
        Object.keys(results).forEach(function(attr) {
            if(typeof results[attr] === 'object') {
                if(!result[attr]) {
                    result[attr] = {};
                }

                return calcResult['[]'](results[attr], result[attr]);
            }

            if(!result[attr]) {
                result[attr] = [];
            }

            result[attr].push(results[attr]);
        });
    },
    /**
     * if results are listed in an array this method takes
     * the middle value of that array
     */
    '-|-': function(result, toFixed) {
        var ret = {}
        toFixed = toFixed || 2;

        Object.keys(result).forEach(function(attr) {

            if(typeof result[attr] === 'object' && !(result[attr] instanceof Array)) {
                return ret[attr] = calcResult['-|-'](result[attr], toFixed);
            }

            /**
             * first sort list
             */
            result[attr].sort(function compareNumbers(a, b) {
              return a - b;
            });

            /**
             * if array length is even take the middle value
             */
            var resultLength = result[attr].length;
            if(resultLength % 2 === 0) {
                ret[attr] = (result[attr][resultLength / 2 - 1] + (result[attr][resultLength / 2])) / 2;
            } else {
                ret[attr] = result[attr][Math.floor(resultLength / 2)];
            }
        });

        return ret;
    }
};
