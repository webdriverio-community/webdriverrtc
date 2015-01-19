/**
 * require dependencies
 */
WebdriverIO  = require('webdriverio');
WebdriverRTC = require('../');
should = require('chai').should();
expect = require('chai').expect;
capabilities = {logLevel: 'silent',desiredCapabilities:{browserName: 'phantomjs'}};
testurl = 'http://localhost:8080/test/site/index.html';
