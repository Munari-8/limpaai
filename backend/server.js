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

// Multer config
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

//////////
// USER //
//////////

// User sign up
app.post('/usuarios', async (req, res) => {
    const { id_categoria, nome, email, senha, data_nascimento, tipo_usuario, cidade, bairro, foto_perfil, genero, nome_exibicao } = req.body;

    // Username gen
    let username = null;
    if (nome) {
        username = nome
        .trim()
        .normalize(`NFD`)                // Breaks down accents     
        .replace(/[\u0300-\u036f]/g, '') // Remove isolated accents 
        .toLowerCase()                   // Lowercase               
        .split(/\s+/)                    // Divide by whitespace    
        .slice(0, 2)                     // First 2 words           
        .join('');                       // Remove spaces           
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

// User login 
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

// Get user data (EditProfile)
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

// Update user data (EditProfile)
app.put('/usuarios/:id', upload.single('foto_perfil'), (req, res) => {
    const { id } = req.params;
    const { nome_exibicao, genero, cidade, bairro, foto_perfil_atual } = req.body;

    let picPath = foto_perfil_atual || null;

    if (req.file) {
        picPath = `/uploads/${req.file.filename}`;
    }

    const sql = `
        UPDATE USUARIO
        SET nome_exibicao = ?, genero = ?, cidade = ?, bairro = ?, foto_perfil = ?
        WHERE id_usuario = ?
    `;

    connection.query(
        sql,
        [ nome_exibicao, genero, cidade, bairro, picPath, id],
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

// Update user data (EditAccount)
app.put('/usuarios/:id/conta', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        if (password && password.trim() !== '') {
            const encryptedPassword = await bcrypt.hash(password, 10);
            const sql = `UPDATE USUARIO SET nome = ?, email = ?, senha = ? WHERE id_usuario = ?`;
            connection.query(sql, [name, email, encryptedPassword, id], (erro) => {
                if (erro) {
                    console.log(erro);
                    return res.status(500).json({ mensagem: 'Erro ao atualizar conta' });
                }
                res.json({ mensagem: 'Conta atualizada com sucesso' });
            });
        } else {
            const sql = `UPDATE USUARIO SET nome = ?, email = ? WHERE id_usuario = ?`;
            connection.query(sql, [name, email, id], (erro) => {
                if (erro) {
                    console.log(erro);
                    return res.status(500).json({ mensagem: 'Erro ao atualizar conta' });
                }
                res.json({ mensagem: 'Conta atualizada com sucesso' });
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});

///////////
// TASKS //
///////////

// Add task
app.post('/servicos', upload.array('images', 10), (req, res) => {
    const {
        id_ofertante, titulo, descricao, taskType, endereco, latitude,
        longitude, data, horario_inicio, horario_fim, vagas_max
    } = req.body

    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const sql = `
        INSERT INTO SERVICO
        (id_ofertante, titulo, descricao, tipo, endereco, latitude, longitude, data, horario_inicio, horario_fim, imagens, status, vagas_max)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'aberto', ?)
    `;

    connection.query(
        sql,
        [
            id_ofertante, titulo, descricao, taskType, endereco, latitude || null,
            longitude || null,  data, horario_inicio || null, horario_fim || null, JSON.stringify(imagePaths), vagas_max || 10
        ],
        (erro, resultado) => {
            if (erro) {
                console.log(erro);
                return res.status(500).json({ mensagem: 'Erro ao criar serviço' });
            }
            res.json({  mensagem: 'Serviço criado com sucesso!', id_servico: resultado.insertId });
        }
    );
});

// List all tasks
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
                FROM PARTICIPACAO
                WHERE id_servico = s.id_servico AND id_usuario = ?
            ) AS minha_situacao
        FROM SERVICO s
        JOIN USUARIO u ON s.id_ofertante = u.id_usuario
        LEFT JOIN PARTICIPACAO p ON s.id_servico = p.id_servico
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

// Request participation in a task
app.post('/participacoes', (req, res) => {
    const { id_usuario, id_servico } = req.body;

    const checkSql = `SELECT * FROM PARTICIPACAO WHERE id_usuario = ? AND id_servico = ?`;
    connection.query(checkSql, [id_usuario, id_servico], (err, rows) => {
        if (rows && rows.length > 0) {
            return res.status(400).json({ mensagem: 'Você já solicitou participação neste serviço' })
        }

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
                SELECT id_ofertante, 'Novo pedido de participação em seu serviço.', NOW()
                FROM SERVICO WHERE id_servico = ?
            `;
            connection.query(sqlNotif, [id_servico]);

            res.json({ mensagem: 'Solicitação enviada com sucesso!' });
        });
    });
});

// Edit task
app.put('/servicos/:id', upload.array('images', 10), (req, res) => {
    const { id } = req.params;
    const {
        id_ofertante, titulo, descricao, taskType, endereco, latitude,
        longitude, data, horario_inicio, horario_fim, vagas_max, existingImages
    } = req.body;

    let keptImages = [];
    try {
        if (existingImages) {
            keptImages = JSON.parse(existingImages);
        }
    } catch (e) {
        keptImages = [];
    }

    const newImagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const finalImages = [...keptImages, ...newImagePaths].slice(0, 10);

    // Fetches current data to validate the single-edit lock
    const checkSql = `SELECT * FROM SERVICO WHERE id_servico = ? AND id_ofertante = ?`;
    connection.query(checkSql, [id, id_ofertante], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ mensagem: 'Erro ao verificar serviço.' });
        }

        if (!rows || rows.length === 0) {
            return res.status(403).json({ mensagem: 'Serviço não encontrado ou sem permissão.' });
        }

        const current = rows[0];
        const currentDate = current.data ? new Date(current.data).toISOString().split('T')[0] : '';
        const currentStart = current.horario_inicio ? String(current.horario_inicio).slice(0, 5) : '';
        const currentEnd = current.horario_fim ? String(current.horario_fim).slice(0, 5) : '';

        const newStart = horario_inicio ? String(horario_inicio).slice(0, 5) : '';
        const newEnd = horario_fim ? String(horario_fim).slice(0, 5) : '';

        const sensitiveChanged =
            currentDate !== data ||
            currentStart !== newStart ||
            currentEnd !== newEnd ||
            current.endereco !== endereco ||
            Number(current.vagas_max) !== Number(vagas_max || 10);

        if (current.edicao_sensivel_usada && sensitiveChanged) {
            return res.status(400).json({
                mensagem: 'Os dados sensíveis (data, horário, local e vagas) já foram editados uma vez e não podem mais ser alterados.'
            });
        }

        const nextEdicaoUsada = current.edicao_sensivel_usada ? 1 : (sensitiveChanged ? 1 : 0);

        const sql = `
            UPDATE SERVICO
            SET titulo = ?, descricao = ?, tipo = ?, endereco = ?, latitude = ?, longitude = ?,
                data = ?, horario_inicio = ?, horario_fim = ?, imagens = ?, vagas_max = ?, edicao_sensivel_usada = ?
            WHERE id_servico = ? AND id_ofertante = ?
        `;

        connection.query(
            sql,
            [
                titulo,
                descricao,
                taskType,
                endereco,
                latitude || null,
                longitude || null,
                data,
                horario_inicio || null,
                horario_fim || null,
                JSON.stringify(finalImages),
                vagas_max || 10,
                nextEdicaoUsada,
                id,
                id_ofertante
            ],
            (erro) => {
                if (erro) {
                    console.log(erro);
                    return res.status(500).json({ mensagem: 'Erro ao atualizar serviço' });
                }

                const sqlNotif = `
                    INSERT INTO NOTIFICACAO (id_usuario, mensagem, enviada_em)
                    SELECT id_usuario, CONCAT('O serviço "', ?, '" foi atualizado pelo organizador.'), NOW()
                    FROM PARTICIPACAO
                    WHERE id_servico = ? AND situacao = 'aprovado'
                `;
                connection.query(sqlNotif, [titulo, id]);

                res.json({ mensagem: 'Serviço atualizado com sucesso!' });
            }
        );
    })
});

// Lists subscribed/pending
app.get('/servicos/:id/participacoes', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT
            p.id_participacao,
            p.situacao,
            p.inscrito_em,
            u.id_usuario,
            u.nome,
            u.nome_exibicao,
            u.foto_perfil
        FROM PARTICIPACAO p
        JOIN USUARIO u ON p.id_usuario = u.id_usuario
        WHERE p.id_servico = ?
        ORDER BY FIELD(p.situacao, 'pendente', 'aprovado', 'recusado', 'removido'), p.inscrito_em ASC
    `;

    connection.query(sql, [id], (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ mensagem: 'Erro ao buscar participantes' });
        }
        res.json(resultados);
    });
});

// Cancels participation/request
app.delete('/participacoes', (req, res) => {
    const { id_usuario, id_servico } = req.body;

    const sql = `UPDATE PARTICIPACAO SET situacao = 'cancelado' WHERE id_usuario = ? AND id_servico = ?`;

    connection.query(sql, [id_usuario, id_servico], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ mensagem: 'Erro ao cancelar participação' });
        }
        res.json({ mensagem: 'Participação cancelada.' });
    });
});

// Refuse/accept request
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

// Remove participant w/ reason
app.put('/participacoes/remover', (req, res) => {
    const { id_participacao, justificativa } = req.body;

    if (!justificativa || justificativa.trim() === '') {
        return res.status(400).json({ mensagem: 'A justificativa é obrigatória.' })
    }

    const sql = `UPDATE PARTICIPACAO SET situacao = 'removido' WHERE id_participacao = ?`;

    connection.query(sql, [id_participacao], (erro) => {
        if (erro) {
            return res.status(500).json({ mensagem: 'Erro ao remover participante.' });
        }
        
        const sqlNotif = `
            INSERT INTO NOTIFICACAO (id_usuario, mensagem, enviada_em)
            SELECT p.id_usuario, CONCAT('Você foi removido do serviço "', s.titulo, '". Motivo: ', ?), NOW()
            FROM PARTICIPACAO p
            JOIN SERVICO s ON p.id_servico = s.id_servico
            WHERE p.id_participacao = ?
        `;
        connection.query(sqlNotif, [justificativa.trim(), id_participacao]);

        res.json({ mensagem: 'Participante removido com sucesso.' });
    });
});

// Forgive refused/removed participant
app.delete('/participacoes/perdoar', (req, res) => {
    const { id_participacao } = req.body;

    const sqlGet = `
        SELECT p.id_usuario, s.titulo
        FROM PARTICIPACAO p
        JOIN SERVICO s ON p.id_servico = s.id_servico
        WHERE p.id_participacao = ?
    `;

    connection.query(sqlGet, [id_participacao], (err, rows) => {
        if (err || !rows || rows.length === 0) {
            return res.status(404).json({ mensagem: 'Participação não encontrada.' });
        }

        const { id_usuario, titulo } = rows[0];

        const sqlDelete = `DELETE FROM PARTICIPACAO WHERE id_participacao = ?`;
        connection.query(sqlDelete, [id_participacao], (erro) => {
            if (erro) {
                return res.status(500).json({ mensagem: 'Erro ao perdoar participante.' });
            }

            const sqlNotif = `
                INSERT INTO NOTIFICACAO (id_usuario, mensagem, enviada_em)
                VALUES (?, CONCAT('O organizador permitiu que você solicite participação novamente no serviço "', ?, '".'), NOW())
            `;
            connection.query(sqlNotif, [id_usuario, titulo]);

            res.json({ mensagem: 'Usuário perdoado com sucesso.' });
        });
    });
});

////////////////////
// Exclusive mods //
////////////////////

// Remove user
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

// Remove all users
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

// Remove all tasks
app.delete('/servicos/flush', (req, res) => {
    const sql = `DELETE FROM SERVICO`;

    connection.query(sql, (erro, resultado) => {
        if (erro) {
            console.log(`Erro ao limpar os serviços: ${erro.message}`);
            return res.status(500).json({ erro: erro.message });
        }

        res.json({ mensagem: 'Todos os serviços foram deletados com sucesso' });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});