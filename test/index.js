import http from 'http';
import assert from 'assert';

import '../server.js';

//비동기로 요청
describe('Example Node Server', () => {
  it('should return 200', done => {
    http.get('http://192.168.0.20:7209/', res => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});
