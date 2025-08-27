// pokemon-backend/server.js (VERSÃO FINAL COMPLETA)
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ====== DB: Conexão com o PostgreSQL ======
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// ====== Helpers de conversão (COM A CORREÇÃO) ======
function mapRow(row) {
  // Esta função agora converte as strings JSON do banco de dados de volta para objetos,
  // corrigindo os bugs de exibição no aplicativo.
  return {
    id: row.id,
    name: row.name,
    types: JSON.parse(row.types || '[]'),
    stats: JSON.parse(row.stats || '{}'),
    height: row.height,
    weight: row.weight,
    abilities: JSON.parse(row.abilities || '[]'),
    sprites: JSON.parse(row.sprites || '{}'),
  };
}

// ====== CRUD com PostgreSQL ======

// LISTAR TODOS
app.get('/api/pokemons', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pokemons ORDER BY id ASC');
    // Usamos o mapRow para garantir que cada item da lista seja formatado corretamente
    res.json(result.rows.map(mapRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pokémons.' });
  }
});

// OBTER POR ID
app.get('/api/pokemons/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pokemons WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pokémon não encontrado' });
    }
    res.json(mapRow(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar o pokémon.' });
  }
});

// CRIAR
app.post('/api/pokemons', async (req, res) => {
  const { name, types, stats, height, weight, abilities, sprites } = req.body;
  try {
    const sql = `
      INSERT INTO pokemons (name, types, stats, height, weight, abilities, sprites)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const params = [
      name,
      JSON.stringify(types),
      JSON.stringify(stats),
      height,
      weight,
      JSON.stringify(abilities),
      JSON.stringify(sprites),
    ];
    
    const result = await pool.query(sql, params);
    res.status(201).json(mapRow(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar o pokémon.' });
  }
});

// ATUALIZAR
app.put('/api/pokemons/:id', async (req, res) => {
  const { name, types, stats, height, weight, abilities, sprites } = req.body;
  try {
    const sql = `
      UPDATE pokemons
      SET name = $1, types = $2, stats = $3, height = $4, weight = $5, abilities = $6, sprites = $7
      WHERE id = $8
      RETURNING *
    `;
    const params = [
      name,
      JSON.stringify(types),
      JSON.stringify(stats),
      height,
      weight,
      JSON.stringify(abilities),
      JSON.stringify(sprites),
      req.params.id,
    ];

    const result = await pool.query(sql, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pokémon não encontrado' });
    }
    res.json(mapRow(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar o pokémon.' });
  }
});

// EXCLUIR
app.delete('/api/pokemons/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM pokemons WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Pokémon não encontrado' });
    }
    res.json({ ok: true, deleted: result.rowCount, id: Number(req.params.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir o pokémon.' });
  }
});


// ====== Start ======
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando em http://localhost:${PORT} (ou http://SEU_IP:${PORT} na rede)`);
});