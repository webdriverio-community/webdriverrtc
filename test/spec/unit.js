var calcResult = require('../../lib/helpers/calcResult');

describe('calcResult', function() {

    var result = {
        attr1: 0,
        attr2: 0,
        attr3: {
            attr1: 0,
            attr2: 0,
            attr3: {
                attr1: {
                    attr1: 0
                }
            }
        }
    }

    var exampleResults = [{
        attr1: 1,
        attr2: 2,
        attr3: {
            attr1: 3,
            attr2: 4,
            attr3: {
                attr1: {
                    attr1: 5
                }
            }
        }
    },{
        attr1: 1,
        attr2: 2,
        attr3: {
            attr1: 3,
            attr2: 4,
            attr3: {
                attr1: {
                    attr1: 5
                }
            }
        }
    },{
        attr1: 1,
        attr2: 2,
        attr3: {
            attr1: 3,
            attr2: 4,
            attr3: {
                attr1: {
                    attr1: 5
                }
            }
        }
    },{
        attr1: 1,
        attr2: 2,
        attr3: {
            attr1: 3,
            attr2: 4,
            attr3: {
                attr1: {
                    attr1: 5
                }
            }
        }
    }];

    it('should add to result', function() {
        calcResult['+'](exampleResults, result);

        result.attr1.should.be.equal(4);
        result.attr2.should.be.equal(8);
        result.attr3.attr1.should.be.equal(12);
        result.attr3.attr2.should.be.equal(16);
        result.attr3.attr3.attr1.attr1.should.be.equal(20);
    });

    it('should divide the result', function() {
        calcResult['/'](result, exampleResults.length);

        result.attr1.should.be.equal(1);
        result.attr2.should.be.equal(2);
        result.attr3.attr1.should.be.equal(3);
        result.attr3.attr2.should.be.equal(4);
        result.attr3.attr3.attr1.attr1.should.be.equal(5);
    });

})
