const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

// Inicializa o Firebase Admin SDK
const fs = require('fs'); // adicione isso
const serviceAccount = JSON.parse(
  fs.readFileSync('/etc/secrets/FIREBASE_KEY', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const sugestoesRef = db.collection('sugestoes');

const app = express();
const PORT = process.env.PORT || 3000;

// Permitir acesso somente do seu front-end
app.use(cors({
  origin: 'https://murilosenaga.github.io',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Teste básico
app.get('/', (req, res) => {
  res.send('Servidor EcoTintas com Firebase Firestore está rodando!');
});

// 📩 POST - Recebe e salva sugestão no Firestore
app.post('/sugestao', async (req, res) => {
  try {
    const sugestao = req.body;
    console.log('Recebido:', sugestao); // Adicione isso

    sugestao.dataEnvio = sugestao.dataEnvio || new Date().toLocaleString('pt-BR');
    await sugestoesRef.add(sugestao);
    res.status(201).json({ mensagem: 'Sugestão salva com sucesso!' });
  } catch (error) {
    console.error("Erro ao salvar sugestão:", error);
    res.status(500).json({ mensagem: 'Erro ao salvar sugestão' });
  }
});

// 📄 GET - Lista todas as sugestões do Firestore
app.get('/listar', async (req, res) => {
  try {
    const snapshot = await sugestoesRef.orderBy('dataEnvio', 'desc').get();
    const sugestoes = snapshot.docs.map(doc => doc.data());
    res.json(sugestoes);
  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
    res.status(500).json({ mensagem: 'Erro ao buscar sugestões' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
