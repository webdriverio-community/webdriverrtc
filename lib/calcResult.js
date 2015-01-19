/**
 * calculate result
 */
var calcResult = module.exports = {
    '+': function(obj, result) {

        if(obj instanceof Array) {
            return obj.forEach(function(item) {
                calcResult['+'](item, result);
            });
        }

        Object.keys(result).forEach(function(attr) {

            if(typeof result[attr] === 'object') {
                return calcResult['+'](obj[attr], result[attr])
            }

            result[attr] += obj[attr] || 0;

        });
    },
    '/': function(result, divisor, toFixed) {
        toFixed = toFixed || 2;

        Object.keys(result).forEach(function(attr) {

            if(typeof result[attr] === 'object') {
                return calcResult['/'](result[attr], divisor, toFixed);
            }

            result[attr] /= divisor;
            result[attr] = result[attr].toFixed(toFixed) / 1;

        });
    }
};
