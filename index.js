const express = require('express');
const mongoose = require('mongoose');
const basicAuth = require('./middlewares/basicAuth');
const app = express();
const port = 4000;

app.use(express.json());

// middleware de log
app.use((req, res, next) => {
  const agora = new Date().toISOString();
  console.log(`[${agora}] ${req.method} ${req.originalUrl}`);
  next();
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://pv33623_db_user:RIwOzPzRyTgnn0S7@cluster0.29zhafd.mongodb.net/test?appName=Cluster0')
  .then(() => console.log('Ligado ao MongoDB via Mongoose'))
  .catch(err => console.error('Erro a ligar ao MongoDB:', err));

const menuRouter = require('./Controllers/menu_do_dia');

// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Restaurante da Manuela API', endpoints: ['/menu'] });
});

// proteger apenas as rotas /menu
app.use('/menu', basicAuth, menuRouter);


// Only listen locally, not on serverless
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log('Restaurante da Manuela rodando na porta ' + port);
  });
}



module.exports = app;