module.exports = {
  "port": 3000,
  "session": {
    "secret": 'PinkieSwear'
  },
  "template": {
    "path": 'views',
    "options": {
      "map": {html: 'swig'}
    }
  },
  "mongoose": {
    "uri": "mongodb://localhost/Equestria",
    "options": {
      "server": {
        "socketOptions": {
          "keepAlive": 1
        }
      }
    }
  },
};