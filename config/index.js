module.exports = {
  port: 3000,
  session: {
    secret: 'PinkieSwear'
  },
  template: {
    path: 'views',
    options: {
      map: { html: 'swig'}
    }
  }
};