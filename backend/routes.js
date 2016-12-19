var express = require('express');
var router = module.exports = express.Router();

router.get('/kk', function(req, res) {
   res.send("Gamification KK test!");
});

router.get('/*', function(req, res, next) {

  if (req.url.startsWith('/themeassets')) {
    // Si el usuario no está logado ... retornar un error!!
    // if (usuarioNoIdentificado) res.send(500, 'Usuario no identificado');
    return next();
  }

  if (req.url.startsWith('/api')) {
    // Si el usuario no está logado ... retornar un error!!
    // if (usuarioNoIdentificado) res.send(500, 'Usuario no identificado');
    return next();
  }

  return res.sendFile('index.html', {
    root: __dirname + '/../.tmp/serve'
  });

});
