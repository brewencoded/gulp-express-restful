const config = require('../config'),
    expect = require('chai').expect,
    baseUrl = 'http://localhost:' + config.PORT;

var request = require('supertest');
describe('loading express', function() {
    var server;
    beforeEach(function() {
        server = require('../index.js');
    });
    afterEach(function() {
        server.close();
    });
    it('responds to /', function testSlash(done) {
        request(server)
            .get('/')
            .expect(200, done);
    });
});
