// middlewares/basicAuth.js
const User = require('../Models/User');

async function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.set('WWW-Authenticate', 'Basic realm="Area Segura"');
    return res.status(401).send('Autenticação necessária');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Basic') {
    return res.status(400).send('Header Authorization inválido');
  }

  const base64 = parts[1];
  const decoded = Buffer.from(base64, 'base64').toString('utf8'); // "user:pass"
  const [username, password] = decoded.split(':');

  if (!username || !password) {
    return res.status(400).send('Credenciais mal formatadas');
  }

  try {
    //validar na base de dados
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      res.set('WWW-Authenticate', 'Basic realm="Area Segura"');
      return res.status(401).send('Credenciais inválidas');
    }

    // guardar o user no request se precisares
    req.user = user;
    next();
  } catch (err) {
    console.error('Erro na autenticação:', err);
    return res.status(500).send('Erro no servidor');
  }
}

module.exports = basicAuth;
