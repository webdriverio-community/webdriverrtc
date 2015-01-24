var calcResult = require('../../lib/helpers/calcResult');

describe('calcResult', function() {

    var exampleResults = [{
        attr1: 13,
        attr2: 2,
        attr3: {
            attr1: 43,
            attr2: 46,
            attr3: {
                attr1: {
                    attr1: 15
                }
            }
        }
    },{
        attr1: 22,
        attr2: 10,
        attr3: {
            attr1: 3,
            attr2: 7,
            attr3: {
                attr1: {
                    attr1: 1
                }
            }
        }
    },{
        attr1: 29,
        attr2: 34,
        attr3: {
            attr1: 17,
            attr2: 25,
            attr3: {
                attr1: {
                    attr1: 4
                }
            }
        }
    },{
        attr1: 14,
        attr2: 42,
        attr3: {
            attr1: 9,
            attr2: 2,
            attr3: {
                attr1: {
                    attr1: 49
                }
            }
        }
    }];

    describe('should be able to calculate the mean', function() {
        var addedResults;

        it('should add to result', function() {
            addedResults = calcResult['+'](exampleResults);

            addedResults.attr1.should.be.equal(78);
            addedResults.attr2.should.be.equal(88);
            addedResults.attr3.attr1.should.be.equal(72);
            addedResults.attr3.attr2.should.be.equal(80);
            addedResults.attr3.attr3.attr1.attr1.should.be.equal(69);
        });

        it('should divide the result', function() {
            dividedResults = calcResult['/'](addedResults, exampleResults.length);

            dividedResults.attr1.should.be.equal(19.5);
            dividedResults.attr2.should.be.equal(22);
            dividedResults.attr3.attr1.should.be.equal(18);
            dividedResults.attr3.attr2.should.be.equal(20);
            dividedResults.attr3.attr3.attr1.attr1.should.be.equal(17.25);
        });

    });

    describe('should be able to calculate the median', function() {
        var resultArray;

        it('list results into an array', function() {
            resultArray = calcResult['[]'](exampleResults);

            resultArray.attr1.should.be.deep.equal([13,22,29,14]);
            resultArray.attr2.should.be.deep.equal([2 ,10,34,42]);
            resultArray.attr3.attr1.should.be.deep.equal([43,3 ,17,9]);
            resultArray.attr3.attr2.should.be.deep.equal([46,7 ,25,2]);
            resultArray.attr3.attr3.attr1.attr1.should.be.deep.equal([15,1,4,49]);
        });

        it('get the middle value of that array if length is even', function() {
            var mean = calcResult['-|-'](resultArray);

            mean.attr1.should.be.equal(18.00);
            mean.attr2.should.be.equal(22.00);
            mean.attr3.attr1.should.be.equal(13.00);
            mean.attr3.attr2.should.be.equal(16.00);
            mean.attr3.attr3.attr1.attr1.should.be.equal(9.50);
        });

        it('get the middle value of that array if length is uneven', function() {
            /**
             * add another value to have uneven length
             */
            resultArray.attr1.push(18);
            resultArray.attr2.push(22);
            resultArray.attr3.attr1.push(13);
            resultArray.attr3.attr2.push(16);
            resultArray.attr3.attr3.attr1.attr1.push(9);

            var median = calcResult['-|-'](resultArray);

            median.attr1.should.be.equal(18.00);
            median.attr2.should.be.equal(22.00);
            median.attr3.attr1.should.be.equal(13.00);
            median.attr3.attr2.should.be.equal(16.00);
            median.attr3.attr3.attr1.attr1.should.be.equal(9.00);
        });

    });

    it('should find the min value', function() {
        minResult = calcResult['min'](exampleResults);

        minResult.attr1.should.be.equal(13);
        minResult.attr2.should.be.equal(2);
        minResult.attr3.attr1.should.be.equal(3);
        minResult.attr3.attr2.should.be.equal(2);
        minResult.attr3.attr3.attr1.attr1.should.be.equal(1);
    });

    it('should find the max value', function() {
        maxResult = calcResult['max'](exampleResults);

        maxResult.attr1.should.be.equal(29);
        maxResult.attr2.should.be.equal(42);
        maxResult.attr3.attr1.should.be.equal(43);
        maxResult.attr3.attr2.should.be.equal(46);
        maxResult.attr3.attr3.attr1.attr1.should.be.equal(49);
    });

})
