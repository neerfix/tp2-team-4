/*
 * Name : index.js
 *
 * Desc : The node server file
 */

// Module
const express = require('express')
const app = express()
const { Client } = require('pg')
const redis = require("redis") 

// Instanciate object pg which contains the connection information of postgres db
const pg = new Client({
  user: "root",
  password: "ynov69",
  host: "docker-postgres",
  database: "tpdocker",
  port: 5432,
})

// Instanciate object rd
const rd = redis.createClient({ host: 'docker-tp-redis' });

// Use express
app.use(express.json())

// Send a message 'hello world' when the user arrives at /
app.get('/', (req, res) => {
  res.json({ message: "Hello World" })
})

// Send a status message when the user arrives at /status
app.get('/status', async (req, res) => {

  const query = "SELECT date_trunc('second', current_timestamp - pg_postmaster_start_time()) as uptime;";
  const result = await pg.query(query)
  const result_uptime = result.rows[0].uptime
  const uptime = () => {
    let time = ""

    time += result_uptime.hours ? `${result_uptime.hours}h ` : ""
    time += result_uptime.minutes ? `${result_uptime.minutes}m ` : ""
    time += result_uptime.seconds ? `${result_uptime.seconds}s` : ""

    return time
  }
  
  res.json({
    status: 'ok',
    postgresUptime: uptime(),
    redisConnectedClients: Number(rd.server_info.connected_clients)
  })
})

// Wait 8 secondes that the postgres server initializes before connect to db 'tpdocker' and the node server listen on port 3000 
setTimeout(function () {
  
  try {
    pg.connect()
    console.log('Connected to database tpdocker !')
    
  } catch (error) {
    console.log(error);
    console.log('Cannot connect to database tpdocker !');
  }

  app.listen(3000, function () {
    console.log('Server listen on port 3000 !')
  })
  
}, 8000);