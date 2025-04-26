const express = require('express');
const mysql   = require('mysql');

const app = express();
const port = 3000;

// Conexão com o MySQL local
const conn = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'ecommerce'
});

conn.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    process.exit(1);
  }
  console.log('MySQL conectado!');
});

// Rota vulnerável a SQL-Injection
app.get('/products', (req, res) => {
  // pega o parâmetro da query string
  const category = req.query.category || '';

  // monta a query de forma insegura
  const sql = `
    SELECT id, name, category, released 
    FROM products
    WHERE category = '${category}'
  `;

  conn.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
