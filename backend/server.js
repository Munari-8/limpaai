const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const connection = require('./dbconfig');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
const upload = multer({ storage: storage });

// Cadastro de usuários
app.post('/usuarios', async (req, res) => {
    const { nome, email, senha, data_nascimento, tipo_usuario, cidade, bairro, foto_perfil, genero, nome_exibicao } = req.body;

    // Geração do username
    let username = null;
    if (nome) {
        username = nome
        .trim()
        .normalize(`NFD`)                // Desmembra acentos
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos isolados
        .toLowerCase()                   // Minúsculo
        .split(/\s+/)                    // Divide por espaços em branco
        .slice(0, 2)                     // Duas primeiras palavras
        .join('');                       // Junta tudo sem espaços
    }

    const sql = `
        INSERT INTO USUARIO
        ( id_categoria, nome, email, senha, data_nascimento, tipo_usuario, cidade, bairro, foto_perfil, genero, username, nome_exibicao )
        VALUES ( 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
    `;

    try {
        const encryptedPassword = await bcrypt.hash(senha, 10);

        connection.query(
            sql,
            [
                nome,
                email,
                encryptedPassword,
                data_nascimento,
                tipo_usuario || 'comum',
                cidade || null,
                bairro || null,
                foto_perfil || null,
                genero || null,
                username,
                nome_exibicao || null
            ],
            (erro, resultado) => {
                if (erro) {
                    console.log(`Erro: ${erro.message}`);
                    return res.status(500).json({
                        mensagem: 'Erro ao cadastrar usuário'
                    });
                }

                res.json({
                    mensagem: 'Usuário cadastrado com sucesso'
                });
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            mensagem: `Erro interno no servidor`
        });
    }
});

app.get('/usuarios', (req, res) => {
    const sql = `
        SELECT
            *
        FROM USUARIO
    `;

    connection.query(sql, (erro, resultado) => {
        if (erro) {
            console.log(`Erro: ${erro.message}`)
            return res.status(500).json({
                mensagem: 'Erro ao buscar usuários'
            });
        }

        res.json(resultado);
    });
});

app.post(`/login`, (req, res) => {
    const { email, senha } = req.body;

    const sql = `
        SELECT * FROM USUARIO WHERE email = ?
    `

    connection.query(sql, [email], async (erro, resultado) => {
        if (erro) {
            console.log(`Erro: ${erro.message}`);
            return res.status(500).json({
                mensagem: `Erro ao buscar usuário`
            });
        }

        if (resultado.length === 0) {
            return res.status(401).json({
                mensagem: `E-mail ou senha incorretos`
            });
        }

        const usuario = resultado[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (senhaCorreta) {
            return res.json({
                sucesso: true,
                mensagem: `Login bem sucedido`,
                user: {
                    id: usuario.id_usuario,
                    nome: usuario.nome,
                    email: usuario.email,
                    tipo_usuario: usuario.tipo_usuario,
                    nome_exibicao: usuario.nome_exibicao,
                    genero: usuario.genero,
                    foto_perfil: usuario.foto_perfil
                }
            });
        } else {
            return res.status(401).json({
                mensagem: `E-mail ou senha incorretos`
            });
        }
    });
});

// Buscar dados do usuário (EditProfile)
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM USUARIO WHERE id_usuario = ?`;

    connection.query(sql, [id], (erro, resultado) => {
        if (erro) {
            console.log(`Erro: ${erro.message}`);
            return res.status(500).json({
                mensagem: 'Erro ao buscar usuário'
            });
        }

        if (resultado.length === 0) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            });
        }

        res.json(resultado[0]);
    });
});

// Atualizar dados do usuário (EditProfile)
app.put('/usuarios/:id', upload.single('foto_perfil'), (req, res) => {
    const { id } = req.params;
    const { nome, nome_exibicao, genero, cidade, bairro, foto_perfil_atual } = req.body;

    let picPath = foto_perfil_atual || null;

    if (req.file) {
        picPath = `/uploads/${req.file.filename}`;
    }

    const sql = `
        UPDATE USUARIO
        SET nome = ?, nome_exibicao = ?, genero = ?, cidade = ?, bairro = ?, foto_perfil = ?
        WHERE id_usuario = ?
    `;

    connection.query(
        sql,
        [nome, nome_exibicao, genero, cidade, bairro, picPath, id],
        (erro, resultado) => {
            if (erro) {
                console.log(`Erro ao atualizar usuário: ${erro.message}`);
                return res.status(500).json({
                    mensagem: 'Erro ao atualizar usuário'
                });
            }

            res.json({
                mensagem: 'Perfil atualizado com sucesso'
            });
        }
    )
})

//////////////////////////
// Exclusivo moderadores//
//////////////////////////

app.delete(`/usuarios/:id` , (req, res) => {
    const userType = req.headers['tipo_usuario'];

    if (userType !== `moderador`) {
        return res.status(403).json({
            mensagem: `Acesso negado. Você não possui permissões de moderador.`
        });
    }

    const { id } = req.params;
    const sql = `
        DELETE FROM USUARIO WHERE id_usuario = ?
    `;

    connection.query(sql, [id], (erro, resultado) => {
        if (erro) return res.status(500).json({
            mensagem: `Erro ao deletar`
        });

        res.json({
            mensagem: `Usuário deletado com sucesso pelo moderador`
        });
    });
});

app.delete(`/flush`, (req, res) => {
    const sql = `
        DELETE FROM USUARIO
    `;

    connection.query(sql, (erro, resultado) => {
        if (erro) {
            console.log(`Erro ao limpar o banco: ${erro.message}`);
            return res.status(500).json({
                erro: erro.message
            });
        }

        res.json({
            mensagem: `Todos os usuários foram deletados com successo`
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});