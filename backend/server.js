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

// User sign up / Cadastro de usuários
app.post('/usuarios', async (req, res) => {
    const { id_categoria, nome, email, senha, data_nascimento, tipo_usuario, cidade, bairro, foto_perfil, genero, nome_exibicao } = req.body;

    // Username gen / Geração do username
    let username = null;
    if (nome) {
        username = nome
        .trim()
        .normalize(`NFD`)                // Breaks down accents     / Desmembra acentos
        .replace(/[\u0300-\u036f]/g, '') // Remove isolated accents / Remove acentos isolados
        .toLowerCase()                   // Lowercase               / Minúsculo
        .split(/\s+/)                    // Divide by whitespace    / Divide por espaços em branco
        .slice(0, 2)                     // First 2 words           / Duas primeiras palavras
        .join('');                       // Remove spaces           / Tira os espaços
    }

    const sql = `
        INSERT INTO USUARIO
        ( id_categoria, nome, email, senha, data_nascimento, tipo_usuario, cidade, bairro, foto_perfil, genero, username, nome_exibicao )
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
    `;

    try {
        const encryptedPassword = await bcrypt.hash(senha, 10);

        connection.query(
            sql,
            [
                id_categoria || 1,
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

// User login / Login de usuários
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

// Get user data / Buscar dados do usuário (EditProfile)
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

// Update user data / Atualizar dados do usuário (EditProfile)
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

//////////////
// SERVIÇOS //
//////////////

// Add service / Criar Serviço
app.post('/servicos', (req, res) => {
    const { id_ofertante, titulo, descricao, endereco, latitude, longitude, data, horario, vagas_max } = req.body

    const sql = `
        INSERT INTO SERVICO
        (if_ofertante, titulo, descricao, endereco, latitude, longitude, data, horario, status, vagas_max)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'aberto', ?)
    `;

    connection.query(
        sql,
        [id_ofertante, titulo, descricao, endereco, latitude || null, longitude || null, data, horario, vagas_max || 10],
        (erro, resultado) => {
            if (erro) {
                console.log(erro);
                return res.status(500).json({ mensagem: 'Erro ao criar serviço' });
            }
            res.json({  mensagem: 'Serviço criado com sucesso!', id_servico: resultado.insertId });
        }
    );
});

// List all services / Listar todos os serviços
app.get('/servicos', (req, res) => {
    const id_usuario = req.query.id_usuario;

    const sql = `
        SELECT
            s.*,
            u.nome AS nome_ofertante,
            u.foto_perfil AS foto_ofertante,
            COUNT(CASE WHEN p.situacao = 'aprovado' THEN 1 END) AS inscritos_confirmados,
            (
                SELECT situacao
                FROM participacao
                WHERE id_servico = s.id_servico AND id_usuario = ?
            ) AS minha_situacao
        FROM SERVICO s
        JOIN USUARIO u ON s.id_ofertante = u.id_usuario
        GROUP BY s.id_servico
        ORDER BY s.data DESC
    `;

    connection.query(sql, [id_usuario || null], (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ mensagem: 'Erro ao buscar serviços' });
        }
        res.json(resultados);
    });
});

// Requet participation in a service / Solicitar participação em um serviço
app.post('/participantes', (req, res) => {
    const { id_usuario, id_servico } = req.body;

    const sql = `
        INSERT INTO PARTICIPACAO (id_usuario, id_servico, situacao, inscrito_em)
        VALUES (?, ?, 'pendente', NOW())
    `;

    connection.query(sql, [id_usuario, id_servico], (erro, resultado) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ mensagem: 'Erro ao solicitar participação' })
        }

        const sqlNotif = `
            INSERT INTO NOTIFICACAO (id_usuario, mensagem, enviada_em)
            SELECT id_ofertante, 'Novo pedido de participação no seu serviço!', NOW()
            FROM SERVICO WHERE id_servico = ?
        `;
        connection.query(sqlNotif, [id_servico]);

        res.json({ mensagem: 'Solicitação enviada com sucesso!' })
    });
});

// Cancel participation/request / Cancelar participação/solicitação
app.delete('/participacoes', (req, res) => {
    const { id_usuario, id_servico } = req.body;

    const sql = `DELETE FROM PARTICIPACAO WHERE id_usuario = ? AND id_servico = ?`;

    connection.query(sql, [id_usuario, id_servico], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ mensagem: 'Erro ao cancelar participação' });
        }
        res.json({ mensagem: 'Participação cancelada.' });
    });
});

// Refuse/accept request / Recusar/aceitar participação
app.put('/participacoes/status', (req, res) => {
    const { id_participacao, nova_situacao } = req.body;

    const sql = `UPDATE PARTICIPACAO SET situacao = ? WHERE id_participacao = ?`;

    connection.query(sql, [nova_situacao, id_participacao], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ mensagem: 'Erro ao atualizar situação' });
        }
        res.json({ mensagem: `Status atualizado para ${nova_situacao}` });
    });
});

///////////////////////////
//     Exclusive mods    //
// Exclusivo moderadores //
///////////////////////////

// Remove user / Remover usuário
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

// Remove all users / Remover todos os usuários
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