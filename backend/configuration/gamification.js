exports.configuration = {
  wwwPort: 8090,
  mongoDb:    'mongodb://office.kaldeera.com:38518/gamification',
  //mongoDb: 'mongodb://localhost:27017/gamification',
  apiUrl: '/api'
};

exports.accessLevels = {
  'public': '*',
  'anonymous': ['public'],
  'editor': ['editor', 'admin'],
  'admin': ['admin']
};

exports.paths = {
  dataDir: '../../../data'
}
