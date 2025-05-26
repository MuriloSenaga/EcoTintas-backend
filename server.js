const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://murilosenaga.github.io'
}));
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor EcoTintas funcionando!');
});

// Rota para receber sugestões
app.post('/sugestao', (req, res) => {
  const sugestao = req.body;

  const filePath = path.join(__dirname, 'sugestoes.json');
  let sugestoes = [];

  if (fs.existsSync(filePath)) {
    sugestoes = JSON.parse(fs.readFileSync(filePath));
  }

  sugestoes.push(sugestao);
  fs.writeFileSync(filePath, JSON.stringify(sugestoes, null, 2));

  res.status(201).json({ mensagem: 'Sugestão recebida com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.get('/listar', (req, res) => {
  const filePath = path.join(__dirname, 'sugestoes.json');
  if (fs.existsSync(filePath)) {
    const sugestoes = JSON.parse(fs.readFileSync(filePath));
    res.json(sugestoes);
  } else {
    res.json([]);
  }
});

