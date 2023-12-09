const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

const pool = new Pool({
    user: 'postgres',
    password: '12590288',
    host: 'localhost',
    port: 5432,
    database: 'aplicacion_pqr',
  });

app.use(cors());
app.use(express.json());

app.get('/api/pqr', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM pqr');
      res.json(result.rows.map((pqr) => ({ ...pqr, fecha: pqr.fecha.toISOString() })));
    } catch (error) {
      console.error('Error al obtener PQR:', error);
      res.status(500).send('Error interno del servidor');
    }
  });

app.post('/api/pqr', async (req, res) => {
    const { tipo, descripcion, nombre, apellido, ciudad, identificacion, correo, telefono } = req.body;
  
    if (!tipo || !descripcion || !nombre || !apellido || !ciudad || !identificacion || !correo || !telefono) {
      res.status(400).send('Todos los campos son requeridos');
      return;
    }
  
    try {
      const query =
        'INSERT INTO pqr(tipo, descripcion, nombre, apellido, ciudad, identificacion, correo, telefono) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
      const values = [tipo, descripcion, nombre, apellido, ciudad, identificacion, correo, telefono];
      const result = await pool.query(query, values);
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al registrar PQR:', error);
      res.status(500).send('Error interno del servidor');
    }
});
  

app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
