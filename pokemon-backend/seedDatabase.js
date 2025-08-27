// seedDatabase.js (VERSÃO FINAL COM POSTGRESQL E SSL)
const { Pool } = require('pg');
const { POKEMONS_DATA } = require('./pokemons.js');

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { // <<< ALTERAÇÃO AQUI
    rejectUnauthorized: false
  }
});

async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log('Iniciando a criação da tabela pokemons (se não existir)...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS pokemons (
        id INTEGER PRIMARY KEY,
        name TEXT,
        types TEXT,
        stats TEXT,
        height REAL,
        weight REAL,
        abilities TEXT,
        sprites TEXT
      )
    `);
    console.log('Tabela "pokemons" verificada/criada com sucesso.');

    console.log('Iniciando a inserção dos Pokémon no banco de dados online...');
    
    for (const p of POKEMONS_DATA) {
      const sql = `
        INSERT INTO pokemons (id, name, types, stats, height, weight, abilities, sprites) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING; 
      `;

      const params = [
        p.id,
        p.name,
        JSON.stringify(p.types),
        JSON.stringify(p.stats),
        p.height,
        p.weight,
        JSON.stringify(p.abilities),
        JSON.stringify(p.sprites)
      ];
      
      await client.query(sql, params);
    }

    console.log('✅ Missão Cumprida! Todos os Pokémon foram inseridos no banco de dados online.');

  } catch (err) {
    console.error('Erro ao popular o banco de dados:', err);
  } finally {
    client.release();
    await pool.end();
    console.log('Conexão com o banco de dados fechada.');
  }
}

seedDatabase();