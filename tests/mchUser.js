var app = require('app'),
  request = require('supertest').agent(app.listen()),
  assert = require('assert'),
  mongoose = require('lib/mongoose'),
  User = require('models/user').User;




describe('models/user', function(){
  before(function () {
    return User.remove('derpy');
  });

  describe('reg & auth', function(){
    var userReg, userAuth;

    it('register derpy', function(){
      return User.register('Derpy', '123', 'derpy@mail.equ', 'I love muffins')
      .then((user) => { userReg = user });
    });
    it('register derpy one more time', function () {
      return User.register('Derpy', '456', 'derpy@canterlot.equ', 'I don\'t know what went wrong')
        .then(
        () => {throw new Error('should return error')},
        (err) => {}
      );
    });
    it('log in', function() {
      return User.authorize('Derpy', '123')
        .then((user)=>{ userAuth =  user});
    });
    it('checking userReg == userAuth', function() {
      return assert.equal(userReg._id.toString(), userAuth._id.toString());
    });
  })
});