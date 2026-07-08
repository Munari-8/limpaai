const express = require('express');
const cors = require('cors');

const connection = require('./dbconfig');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/usuarios', (req, res) => {
    const { nome, email, senha, data_nascimento, tipo_usuario, cidade, foto_perfil, genero } = req.body;

    const sql = `
        INSERT INTO USUARIO
        ( id_categoria, nome, email, senha, data_nascimento, tipo_usuario, cidade, foto_perfil, genero )
        VALUES ( 1, ?, ?, ?, ?, ?, ?, ?, ? )
    `;

    connection.query(
        sql,
        [nome, email, senha, data_nascimento, tipo_usuario, cidade, foto_perfil, genero],
        (erro, resultado) => {
            if (erro) {
                console.log('Erro: ', erro.message);
                return res.status(500).json({
                    mensagem: 'Erro ao cadastrar usuário'
                });
            }

            res.json({
                mensagem: 'Usuário cadastrado com sucesso'
            });
        }
    );
});

app.get('/usuarios', (req, res) => {
    const sql = `
        SELECT
            *
        FROM USUARIO
    `;

    connection.query(sql, (erro, resultado) => {
        if (erro) {
            console.log('Erro: ', erro.message)
            return res.status(500).json({
                mensagem: 'Erro ao buscar usuários'
            });
        }

        res.json(resultado)
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});