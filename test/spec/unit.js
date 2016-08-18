import calcResult from '../../lib/helpers/calcResult'
import exampleResults from '../fixtures/example.json'
import testResult from '../fixtures/test.json'

describe('calcResult', () => {
    it('should find the min value', () => {
        let minResult = calcResult['min'](exampleResults)

        minResult.attr1.should.be.equal(13)
        minResult.attr2.should.be.equal(2)
        minResult.attr3.attr1.should.be.equal(3)
        minResult.attr3.attr2.should.be.equal(2)
        minResult.attr3.attr3.attr1.attr1.should.be.equal(1)
    })

    it('should find the max value', () => {
        let maxResult = calcResult['max'](exampleResults)

        maxResult.attr1.should.be.equal(29)
        maxResult.attr2.should.be.equal(42)
        maxResult.attr3.attr1.should.be.equal(43)
        maxResult.attr3.attr2.should.be.equal(46)
        maxResult.attr3.attr3.attr1.attr1.should.be.equal(49)
    })

    it('can calculate results from real world example', function () {
        let mean = calcResult['+'](testResult)
        mean = calcResult['/'](mean, testResult.length)

        let median = calcResult['[]'](testResult)
        median = calcResult['-|-'](median)

        let max = calcResult['max'](testResult)
        let min = calcResult['min'](testResult)

        min.video.bandwidth.actualEncBitrate.should.be.equal(336368)
        max.video.bandwidth.actualEncBitrate.should.be.equal(627198)
        mean.video.bandwidth.actualEncBitrate.should.be.equal(486119.33)
        median.video.bandwidth.actualEncBitrate.should.be.equal(484608)
    })

    describe('should be able to calculate the mean', () => {
        let addedResults

        it('should add to result', () => {
            addedResults = calcResult['+'](exampleResults)

            addedResults.attr1.should.be.equal(78)
            addedResults.attr2.should.be.equal(88)
            addedResults.attr3.attr1.should.be.equal(72)
            addedResults.attr3.attr2.should.be.equal(80)
            addedResults.attr3.attr3.attr1.attr1.should.be.equal(69)
        })

        it('should divide the result', () => {
            let dividedResults = calcResult['/'](addedResults, exampleResults.length)

            dividedResults.attr1.should.be.equal(19.5)
            dividedResults.attr2.should.be.equal(22)
            dividedResults.attr3.attr1.should.be.equal(18)
            dividedResults.attr3.attr2.should.be.equal(20)
            dividedResults.attr3.attr3.attr1.attr1.should.be.equal(17.25)
        })
    })

    describe('should be able to calculate the median', () => {
        let resultArray

        it('list results into an array', () => {
            resultArray = calcResult['[]'](exampleResults)

            resultArray.attr1.should.be.deep.equal([13, 22, 29, 14])
            resultArray.attr2.should.be.deep.equal([2, 10, 34, 42])
            resultArray.attr3.attr1.should.be.deep.equal([43, 3, 17, 9])
            resultArray.attr3.attr2.should.be.deep.equal([46, 7, 25, 2])
            resultArray.attr3.attr3.attr1.attr1.should.be.deep.equal([15, 1, 4, 49])
        })

        it('get the middle value of that array if length is even', () => {
            let mean = calcResult['-|-'](resultArray)

            mean.attr1.should.be.equal(18.00)
            mean.attr2.should.be.equal(22.00)
            mean.attr3.attr1.should.be.equal(13.00)
            mean.attr3.attr2.should.be.equal(16.00)
            mean.attr3.attr3.attr1.attr1.should.be.equal(9.50)
        })

        it('get the middle value of that array if length is uneven', () => {
            /**
             * add another value to have uneven length
             */
            resultArray.attr1.push(18)
            resultArray.attr2.push(22)
            resultArray.attr3.attr1.push(13)
            resultArray.attr3.attr2.push(16)
            resultArray.attr3.attr3.attr1.attr1.push(9)

            let median = calcResult['-|-'](resultArray)

            median.attr1.should.be.equal(18.00)
            median.attr2.should.be.equal(22.00)
            median.attr3.attr1.should.be.equal(13.00)
            median.attr3.attr2.should.be.equal(16.00)
            median.attr3.attr3.attr1.attr1.should.be.equal(9.00)
        })
    })
})
