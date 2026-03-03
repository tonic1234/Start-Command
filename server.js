const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const URI = 'mongodb://n8n2_mongo_db:27017/?replicaSet=rs0&directConnection=true';

async function iniciar() {
    const client = await MongoClient.connect(URI);
    console.log('MongoDB conectado ✅');

    const stream = client.db('crm').collection('mensajes').watch();
    stream.on('change', (cambio) => {
        console.log('Cambio:', cambio.operationType);
        io.emit('db_update', cambio);
    });
}

io.on('connection', (s) => console.log('Cliente web conectado:', s.id));
server.listen(3000, () => iniciar());
