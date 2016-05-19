const request = require('request'),
      config = require('../config'),
      expect = require('chai').expect,
      baseUrl = 'http://localhost:' + config.PORT;

describe('server request to index', function () {
    it('should respond with 200', function(done) {
        request(baseUrl, function (error, response, body) {
            expect(error).to.be.not.ok;
            expect(response).to.be.not.a('undefined');
            expect(response.statusCode).to.be.equal(200);
            done();
        });
    });
});
