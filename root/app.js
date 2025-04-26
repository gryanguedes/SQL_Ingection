const express = require('express');
const mysql   = require('mysql2/promise');

const app = express();
const port = 3000;

// Configura um pool de conexões
const pool = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/products', async (req, res) => {
  try {
    // Recebe o parâmetro e opcionalmente valida contra uma lista branca
    const category = req.query.category || '';
    const allowed = ['roupas', 'eletronicos'];
    if (!allowed.includes(category)) {
      return res.status(400).json({ error: 'Categoria inválida.' });
    }

    // Query parametrizada: o driver cuida do escape automático
    const [rows] = await pool.execute(
      `SELECT id, name, category, released
         FROM products
        WHERE category = ?`,
      [category]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

app.listen(port, () => {
  console.log(`API segura rodando em http://localhost:${port}`);
});
