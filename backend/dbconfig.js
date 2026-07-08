const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'limpaai'
});

connection.connect((erro) => {
    if (erro) {
        console.log('Erro ao conectar ao banco: ', erro.message);
        return;
    }

    console.log('Banco conectado com sucesso');
});

module.exports = connection;