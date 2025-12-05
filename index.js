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

async function start() {
  try {
    //await mongoose.connect('mongodb://localhost:27017/fichatdw');
await mongoose.connect('mongodb+srv://pv33623_db_user:1234@cluster0.29zhafd.mongodb.net/?appName=Cluster0');
    console.log('Ligado ao MongoDB via Mongoose');

    const menuRouter = require('./Controllers/menu_do_dia');

    // proteger apenas as rotas /menu
    app.use('/menu', basicAuth, menuRouter);

    app.listen(port, () => {
      console.log('Restaurante da Manuela rodando na porta ' + port);
    });
  } catch (err) {
    console.error('Erro a ligar ao MongoDB:', err);
    process.exit(1);
  }
}

start();

//module.exports = app;
