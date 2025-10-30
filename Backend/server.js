require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static frontend when deployed together (optional)
app.use(express.static('public')); // put frontend build here

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Helpers
async function query(sql, params){ 
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Routes
app.get('/api/types', async (req,res)=>{
  try{
    const types = await query('SELECT * FROM types');
    // attach subtypes
    for(const t of types){
      const subs = await query('SELECT name FROM subtypes WHERE type_id=?', [t.id]);
      t.subtypes = subs.map(s=>s.name);
    }
    res.json(types);
  }catch(e){ res.status(500).json({error:e.message}); }
});

app.get('/api/cars', async (req,res)=>{
  const { type, subtype } = req.query;
  try{
    let sql = 'SELECT * FROM cars';
    const params = [];
    if(type && subtype){
      sql += ' WHERE type = ? AND subtype = ?';
      params.push(type, subtype);
    } else if(type){
      sql += ' WHERE type = ?';
      params.push(type);
    }
    const rows = await query(sql, params);
    res.json(rows);
  }catch(e){ res.status(500).json({error:e.message}); }
});

app.get('/api/cars/:id', async (req,res)=>{
  const id = req.params.id;
  try{
    const rows = await query('SELECT * FROM cars WHERE id=?', [id]);
    if(rows.length===0) return res.status(404).json({error:'not found'});
    const car = rows[0];
    // parse features stored as JSON text
    try{ car.features = JSON.parse(car.features || '[]'); }catch(e){ car.features = []; }
    res.json(car);
  }catch(e){ res.status(500).json({error:e.message}); }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
