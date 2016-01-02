var app = require('app'),
  request = require('supertest').agent(app.listen());

describe('models', function(){
  describe('when GET /', function(){
    it('should return the 200 page', function(done){
      request
        .get('/')
        .expect(200)
        .expect(/EquestriaJS/, done);
    })
  })
});