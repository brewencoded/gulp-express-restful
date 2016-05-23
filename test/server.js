const config = require('../config'),
    expect = require('chai').expect,
    request = require('supertest');

describe('loading express', function() {
    let server;
	beforeEach(function () {
		delete require.cache[require.resolve('../index')];
		server = require('../index');
	});
    afterEach(function (done) {
        server.close(done);
    });
    it('responds to /', function testSlash(done) {
        request(server)
            .get('/')
            .expect(200)
            .end(done);
    });
    it('responds to non-existant routes', function testSlash(done) {
        request(server)
            .get('/foo/bar')
            .expect(200) // /foo/bar will be redirected to index.html for an SPA to handle the 404
            .end(done); 
    });
});
