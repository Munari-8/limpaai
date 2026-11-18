const express = require('express');
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const connection = require('./dbconfig');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Map 2 keep track of which sockets belong 2 each connected user
const connectedUsers = new Map();

wss.on('connection', (socket) => {
    socket.on('message', (raw) => {
        let data;

        try {
            data = JSON.parse(raw.toString());
        } catch {
            return;
        }

        // Registers the connected user to the WebSocket
        if (data.type === 'register' && data.userId) {
            const uid = String(data.userId);
            socket.userId = uid;

            if (!connectedUsers.has(uid)) {
                connectedUsers.set(uid, new Set());
            }
            connectedUsers.get(uid).add(socket);
        }
    });

    socket.on('close', () => {
        if (socket.userId && connectedUsers.has(socket.userId)) {
            connectedUsers.get(socket.userId).delete(socket);
            if (connectedUsers.get(socket.userId).size === 0) {
                connectedUsers.delete(socket.userId);
            }
        }
    });
});

// Helper to send a real-time event only 2 the chat participants
const notifyUsersWS = (userIds, payload) => {
    const json = JSON.stringify(payload);

    userIds.forEach((id) => {
        const sockets = connectedUsers.get(String(id));

        if (sockets) {
            sockets.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(json);
                }
            });
        }
    });
};

// Helper to set rank n update points in server
const updateUserPoints = (id_usuario, deltaPontos, callback) => {
    connection.query(
        `SELECT pontos FROM USUARIO WHERE id_usuario = ?`,
        [id_usuario],
        (err, rows) => {
            if (err || !rows || rows.length === 0) {
                if (callback) callback(err);
                return;
            }

            const newPoints = Math.max(0, Number(rows[0].pontos || 0) + deltaPontos);

            let newRank = 'Bronze';
            if (newPoints >= 450) {
                newRank = 'Diamante';
            } else if (newPoints >= 240) {
                newRank = 'Ouro';
            } else if (newPoints >= 90) {
                newRank = 'Prata';
            }

            connection.query(
                `UPDATE USUARIO SET pontos = ?, ranque = ? WHERE id_usuario = ?`,
                [newPoints, newRank, id_usuario],
                (errUpd) => {
                    if (callback) callback(errUpd, { pontos: newPoints, ranque: newRank });
                }
            );
        }
    );
};

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
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
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
        WHERE s.status = 'aberto'
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

    connect.query(`SELECT suspenso_ate FROM USUARIO WHERE id_usuario = ?`, [id_usuario], (errSusp, userRows) => {
        if (userRows && userRows[0]?.suspenso_ate && new Date(userRows[0].suspenso_ate) > new Date()) {
            const dataFim = new Date(userRows[0].suspenso_ate).toLocaleDateString('pt-BR');
            return res.status(403).json({
                mensagem: `Sua conta está suspensa de participar de serviços até ${dataFim} devido a cancelamentos recorrentes.`
            });
        }

        const checkVagasSql = `
            SELECT 
                s.vagas_max,
                s.status,
                COUNT(CASE WHEN p.situacao = 'aprovado' THEN 1 END) AS inscritos_confirmados
            FROM SERVICO s
            LEFT JOIN PARTICIPACAO p ON s.id_servico = p.id_servico
            WHERE s.id_servico = ?
            GROUP BY s.id_servico
        `;
        connection.query(checkVagasSql, [id_servico], (errVagas, taskRows) => {
            if (errVagas || !taskRows || taskRows.length === 0) {
                return res.status(400).json({ mensagem: 'Serviço não encontrado.' })
            }

            const srv = taskRows[0]
            if (srv.status !== 'aberto') {
                return res.status(400).json({ mensagem: 'Este serviço não está mais aberto.' });
            }

            if (Number(srv.inscritos_confirmados) >= Number(srv.vagas_max)) {
                return res.status(400).json({ mensagem: 'Este serviço já atingiu o limite máximo de participantes.' });
            }

            const checkSql = `SELECT * FROM PARTICIPACAO WHERE id_usuario = ? AND id_servico = ?`;
            connection.query(checkSql, [id_usuario, id_servico], (err, rows) => {
                if (rows && rows.length > 0) {
                    return res.status(400).json({ mensagem: 'Você já solicitou participação neste serviço' });
                }

                const sql = `
                    INSERT INTO PARTICIPACAO (id_usuario, id_servico, situacao, inscrito_em)
                    VALUES (?, ?, 'pendente', NOW())
                `;

                connection.query(sql, [id_usuario, id_servico], (erro) => {
                    if (erro) {
                        console.log(erro);
                        return res.status(500).json({ mensagem: 'Erro ao solicitar participação' });
                    }

                    const sqlNotif = `
                        INSERT INTO NOTIFICACAO (id_usuario, mensagem, tipo, id_referencia, enviada_em)
                        SELECT id_ofertante, CONCAT('Novo pedido de participação no serviço "', titulo, '".'), 'servico', ?, NOW()
                        FROM SERVICO WHERE id_servico = ?
                    `;
                    connection.query(sqlNotif, [id_servico, id_servico], () => {
                        connection.query(`SELECT id_ofertante FROM SERVICO WHERE id_servico = ?`, [id_servico], (e, r) => {
                            if (r && r[0]) notifyUsersWS([r[0].id_ofertante], { type: 'notification_update' });
                        });
                    });

                    res.json({ mensagem: 'Solicitação enviada com sucesso!' });
                });
            });
        });
    })
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
                    INSERT INTO NOTIFICACAO (id_usuario, mensagem, tipo, id_referencia, enviada_em)
                    SELECT id_usuario, CONCAT('O serviço "', ?, '" foi atualizado pelo organizador.'), 'servico', ?, NOW()
                    FROM PARTICIPACAO
                    WHERE id_servico = ? AND situacao = 'aprovado'
                `;
                connection.query(sqlNotif, [titulo, id, id], () => {
                    connection.query(`SELECT id_usuario FROM PARTICIPACAO WHERE id_servico = ? AND situacao = 'aprovado'`, [id], (e, r) => {
                        if (r && r.length > 0) notifyUsersWS(r.map(u => u.id_usuario), { type: 'notification_update' });
                    });
                });
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

    const sql = `
        UPDATE PARTICIPACAO 
        SET situacao = 'cancelado', cancelado_em = NOW() 
        WHERE id_usuario = ? AND id_servico = ?
    `;

    connection.query(sql, [id_usuario, id_servico], (erro) => {
        if (erro) {
            return res.status(500).json({ mensagem: 'Erro ao cancelar participação' });
        }

        atualizarPontosUsuario(id_usuario, -3);

        const checkCancelsSql = `
            SELECT COUNT(*) AS total_cancelamentos
            FROM PARTICIPACAO
            WHERE id_usuario = ?
              AND situacao = 'cancelado'
              AND cancelado_em >= DATE_SUB(NOW(), INTERVAL 14 DAY)
        `;

        connection.query(checkCancelsSql, [id_usuario], (errCheck, rows) => {
            if (!errCheck && rows && rows[0].total_cancelamentos >= 3) {
                connection.query(
                    `UPDATE USUARIO SET suspenso_ate = DATE_ADD(NOW(), INTERVAL 15 DAY) WHERE id_usuario = ?`,
                    [id_usuario]
                );
                return res.json({
                    mensagem: 'Participação cancelada (-3 pts). Você atingiu 3 cancelamentos em 2 semanas e foi suspenso por 15 dias.'
                });
            }

            res.json({ mensagem: 'Participação cancelada (-3 pontos).' });
        });
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
            INSERT INTO NOTIFICACAO (id_usuario, mensagem, tipo, enviada_em)
            SELECT p.id_usuario, CONCAT('Você foi removido do serviço "', s.titulo, '". Motivo: ', ?), 'cancelamento', NOW()
            FROM PARTICIPACAO p
            JOIN SERVICO s ON p.id_servico = s.id_servico
            WHERE p.id_participacao = ?
        `;
        connection.query(sqlNotif, [justificativa.trim(), id_participacao], () => {
            connection.query(`SELECT id_usuario FROM PARTICIPACAO WHERE id_participacao = ?`, [id_participacao], (e, r) => {
                if (r && r[0]) notifyUsersWS([r[0].id_usuario], { type: 'notification_update' });
            });
        });

        res.json({ mensagem: 'Participante removido com sucesso.' });
    });
});

// Forgive refused/removed participant
app.delete('/participacoes/perdoar', (req, res) => {
    const { id_participacao } = req.body;

    const sqlGet = `
        SELECT p.id_usuario, p.id_servico, s.titulo
        FROM PARTICIPACAO p
        JOIN SERVICO s ON p.id_servico = s.id_servico
        WHERE p.id_participacao = ?
    `;

    connection.query(sqlGet, [id_participacao], (err, rows) => {
        if (err || !rows || rows.length === 0) {
            return res.status(404).json({ mensagem: 'Participação não encontrada.' });
        }

        const { id_usuario, id_servico, titulo } = rows[0];

        const sqlDelete = `DELETE FROM PARTICIPACAO WHERE id_participacao = ?`;
        connection.query(sqlDelete, [id_participacao], (erro) => {
            if (erro) {
                return res.status(500).json({ mensagem: 'Erro ao perdoar participante.' });
            }

            const sqlNotif = `
                INSERT INTO NOTIFICACAO (id_usuario, mensagem, tipo, id_referencia, enviada_em)
                VALUES (?, CONCAT('O organizador permitiu que você solicite participação novamente no serviço "', ?, '".'), 'servico', ?, NOW())
            `;
            connection.query(sqlNotif, [id_usuario, titulo, id_servico], () => {
                notifyUsersWS([id_usuario], { type: 'notification_update' });
            });

            res.json({ mensagem: 'Usuário perdoado com sucesso.' });
        });
    });
});

// Cancel task w reason (Owner)
app.put('/servicos/:id/cancelar', (req, res) => {
    const { id } = req.params;
    const { id_ofertante, reason } = req.body;

    if (!reason || reason.trim() === '') {
        return res.status(400).json({ mensagem: 'A justificativa é obrigatória.' });
    }

    const checkSql = `SELECT titulo FROM SERVICO WHERE id_servico = ? AND id_ofertante = ?`;
    connection.query(checkSql, [id, id_ofertante], (err, rows) => {
        if (err || !rows || rows.length === 0) {
            return res.status(403).json({ mensagem: 'Serviço não encontrado ou sem permissão.' });
        }

        const title = rows[0].titulo;
        const updateSql = `UPDATE SERVICO SET status = 'cancelado' WHERE id_servico = ?`;

        connection.query(updateSql, [id], (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ mensagem: 'Erro ao cancelar serviço.' });
            }

            const sqlNotif = `
                INSERT INTO NOTIFICACAO (id_usuario, mensagem, tipo, enviada_em)
                SELECT id_usuario, CONCAT('O serviço "', ?, '" foi cancelado pelo organizador. Motivo: ', ?), 'cancelamento', NOW()
                FROM PARTICIPACAO
                WHERE id_servico = ? AND situacao IN ('aprovado', 'pendente')
            `;
            connection.query(sqlNotif, [title, reason.trim(), id], () => {
                connection.query(`SELECT id_usuario FROM PARTICIPACAO WHERE id_servico = ? AND situacao IN ('aprovado', 'pendente')`, [id], (e, r) => {
                    if (r && r.length > 0) notifyUsersWS(r.map(u => u.id_usuario), { type: 'notification_update' });
                });
            });

            updateUserPoints(id_ofertante, -9);
            res.json({ mensagem: 'Serviço cancelado com sucesso.' });
        });
    });
});

// Complete task and register participant attendance (Owner)
app.put('/servicos/:id/concluir', (req, res) => {
    const { id } = req.params;
    const { id_ofertante, presences} = req.body;

    const checkSql = `SELECT titulo FROM SERVICO WHERE id_servico = ? AND id_ofertante = ?`;
    connection.query(checkSql, [id, id_ofertante], (err, rows) => {
        if (err || rows.length === 0) {
            return res.status(403).json({ mensagem: 'Serviço não encontrado ou sem permissão.' });
        }

        const title = rows[0].titulo;
        const updateSrvSql = `UPDATE SERVICO SET status = 'concluido' WHERE id_servico = ?`;

        connection.query(updateSrvSql, [id], (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ mensagem: 'Erro ao concluir serviço.' });
            }

            if (Array.isArray(presences)) {
                presences.forEach((p) => {
                    const presenceStatus = p.presenca === 'presente' ? 'presente' : 'ausente';
                    connection.query(
                        `UPDATE PARTICIPACAO SET presenca = ? WHERE id_participacao = ? AND id_servico = ?`,
                        [presenceStatus, p.id_participacao, id],
                        (errUpdatePart) => {
                            if (!errUpdatePart && presenceStatus === 'presente') {
                                connection.query(
                                    `UPDATE USUARIO SET servicos_realizados = servicos_realizados + 1 WHERE id_usuario = ?`,
                                    [p.id_usuario]
                                );
                                updateUserPoints(p.id_usuario, 30);
                            }
                        }
                    );
                });
            }
            
            const sqlNotif = `
                INSERT INTO NOTIFICACAO (id_usuario, mensagem, tipo, id_referencia, enviada_em)
                SELECT id_usuario, CONCAT('O serviço "', ?, '" foi marcado como concluído pelo organizador!'), 'servico', ?, NOW()
                FROM PARTICIPACAO
                WHERE id_servico = ? AND situacao = 'aprovado'
            `;
            connection.query(sqlNotif, [title, id, id], () => {
                connection.query(`SELECT id_usuario FROM PARTICIPACAO WHERE id_servico = ? AND situacao = 'aprovado'`, [id], (e, r) => {
                    if (r && r.length > 0) notifyUsersWS(r.map(u => u.id_usuario), { type: 'notification_update' });
                });
            });

            updateUserPoints(id_ofertante, 30);
            res.json({ mensagem: 'Serviço concluído com sucesso!' });
        });
    });
});

//////////////
// MESSAGES //
//////////////

// Request to chat w/ task owner
app.post('/conversas/solicitar', (req, res) => {
    const { id_servico, id_solicitante, id_organizador, mensagem_inicial } = req.body;

    if (!mensagem_inicial || !mensagem_inicial.trim()) {
        return res.status(400).json({ mensagem: 'Escreva uma mensagem inicial para solicitar o chat.' });
    }

    const checkSql = `
        SELECT * FROM CONVERSA
        WHERE id_servico = ? AND id_solicitante = ? AND id_organizador = ?
    `;

    connection.query(checkSql, [id_servico, id_solicitante, id_organizador], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ mensagem: 'Erro ao verificar conversa.' });
        }

        if (rows && rows.length > 0) {
            const chat = rows[0];
            if (chat.status === 'recusado') {
                return res.status(403).json({ mensagem: 'Sua solicitação de conversa foi recusada pelo organizador.' });
            }

            return res.json({
                mensagem: 'Conversa já existente.',
                id_conversa: chat.id_conversa,
                status: chat.status
            });
        }

        const insertChat = `
            INSERT INTO CONVERSA (id_servico, id_solicitante, id_organizador, status, criada_em, atualizada_em)
            VALUES (?, ?, ?, 'pendente', NOW(), NOW())
        `;

        connection.query(insertChat, [id_servico, id_solicitante, id_organizador], (errInsert, result) => {
            if (errInsert) {
                console.log(errInsert);
                return res.status(500).json({ mensagem: 'Erro ao solicitar conversa.' });
            }

            const id_conversa = result.insertId;

            const insertMsg = `
                INSERT INTO MENSAGEM (id_conversa, id_remetente, conteudo, lida, enviada_em)
                VALUES (?, ?, ?, 0, NOW())
            `;
            connection.query(insertMsg, [id_conversa, id_solicitante, mensagem_inicial.trim()]);

            const sqlNotif = `
                INSERT INTO NOTIFICACAO (id_usuario, mensagem, tipo, id_referencia, enviada_em)
                SELECT
                    ?,
                    CONCAT(COALESCE(u.nome_exibicao, u.nome), ' enviou uma solicitação de mensagem sobre o serviço "', s.titulo, '".'),
                    'mensagem',
                    ?,
                    NOW()
                FROM USUARIO u, SERVICO s
                WHERE u.id_usuario = ? AND s.id_servico = ?
            `;
            connection.query(sqlNotif, [id_organizador, id_conversa, id_solicitante, id_servico], () => {
                notifyUsersWS([id_organizador], { type: 'notification_update' });
            });

            // Alerts the owner via WebSocket in real-time
            notifyUsersWS([id_organizador], {
                type: 'inbox_update',
                id_conversa
            });

            res.json({
                mensagem: 'Solicitação de mensagem enviada!',
                id_conversa,
                status: 'pendente'
            });
        });
    });
});

// Get user chats
app.get('/conversas/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    const sql = `
        SELECT
            c.*,
            s.titulo AS titulo_servico,
            s.tipo AS tipo_servico,
            u_sol.nome AS nome_solicitante,
            u_sol.nome_exibicao AS exibicao_solicitante,
            u_sol.foto_perfil AS foto_solicitante,
            u_org.nome AS nome_organizador,
            u_org.nome_exibicao AS exibicao_organizador,
            u_org.foto_perfil AS foto_organizador,
            (
                SELECT conteudo FROM MENSAGEM
                WHERE id_conversa = c.id_conversa
                ORDER BY enviada_em DESC, id_mensagem DESC LIMIT 1
            ) AS ultima_mensagem,
            (
                SELECT id_remetente FROM MENSAGEM
                WHERE id_conversa = c.id_conversa
                ORDER BY enviada_em DESC, id_mensagem DESC LIMIT 1
            ) AS ultimo_remetente,
            (
                SELECT enviada_em FROM MENSAGEM
                WHERE id_conversa = c.id_conversa
                ORDER BY enviada_em DESC, id_mensagem DESC LIMIT 1
            ) AS data_ultima_mensagem,
            (
                SELECT COUNT(*) FROM MENSAGEM
                WHERE id_conversa = c.id_conversa AND id_remetente != ? AND lida = 0
            ) AS nao_lidas
        FROM CONVERSA c
        JOIN SERVICO s ON c.id_servico = s.id_servico
        JOIN USUARIO u_sol ON c.id_solicitante = u_sol.id_usuario
        JOIN USUARIO u_org ON c.id_organizador = u_org.id_usuario
        WHERE (c.id_solicitante = ? OR c.id_organizador = ?)
          AND c.status != 'recusado'
        ORDER BY COALESCE(data_ultima_mensagem, c.criada_em) DESC
    `;

    connection.query(sql, [id_usuario, id_usuario, id_usuario], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ mensagem: 'Erro ao carregar conversas.' });
        }
        res.json(results);
    });
});

// Accept / refuse chat requests (Owner)
app.put('/conversas/:id_conversa/status', (req, res) => {
    const { id_conversa } = req.params;
    const { status } = req.body; // 'aceito' or 'recusado'

    const getSql = `SELECT id_solicitante, id_organizador FROM CONVERSA WHERE id_conversa = ?`;
    connection.query(getSql, [id_conversa], (errGet, rows) => {
        if (errGet || !rows || rows.length === 0) {
            return res.status(404).json({ mensagem: 'Conversa não encontrada.' });
        }

        const { id_solicitante, id_organizador } = rows[0];
        const sql = `UPDATE CONVERSA SET status = ?, atualizada_em = NOW() WHERE id_conversa = ?`;

        connection.query(sql, [status, id_conversa], (error) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ mensagem: 'Erro ao atualizar conversa.' });
            }

            if (status === 'aceito') {
                const sqlNotif = `
                    INSERT INTO NOTIFICACAO (id_usuario, mensagem, tipo, id_referencia, enviada_em)
                    SELECT ?, CONCAT('Sua solicitação de conversa sobre "', s.titulo, '" foi aceita pelo organizador!'), 'mensagem', ?, NOW()
                    FROM CONVERSA c
                    JOIN SERVICO s ON c.id_servico = s.id_servico
                    WHERE c.id_conversa = ?
                `;
                connection.query(sqlNotif, [id_solicitante, id_conversa, id_conversa], () => {
                    notifyUsersWS([id_solicitante], { type: 'notification_update' });
                });
            }

            // Alerts both via WebSocket about the status change
            notifyUsersWS([id_solicitante, id_organizador], {
                type: 'chat_status',
                id_conversa: Number(id_conversa),
                status
            });

            res.json({ mensagem: `Conversa ${status}.` });
        });
    });
});

// Get messages from a chat + set received as read
app.get('/mensagens/:id_conversa', (req, res) => {
    const { id_conversa } = req.params;
    const { id_usuario } = req.query;

    if (id_usuario) {
        const markRead = `UPDATE MENSAGEM SET lida = 1 WHERE id_conversa = ? AND id_remetente != ?`;
        connection.query(markRead, [id_conversa, id_usuario]);
    }

    const sql = `
        SELECT * FROM MENSAGEM
        WHERE id_conversa = ?
        ORDER BY enviada_em ASC, id_mensagem ASC
    `;

    connection.query(sql, [id_conversa], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ mensagem: 'Erro ao buscar mensagens.' });
        }
        res.json(results);
    });
});

// Send a new message in chat
app.post('/mensagens', (req, res) => {
    const { id_conversa, id_remetente, conteudo } = req.body;

    if (!conteudo || !conteudo.trim()) {
        return res.status(400).json({ mensagem: 'A mensagem não pode estar vazia.' });
    }

    const checkSql = `SELECT status, id_solicitante, id_organizador FROM CONVERSA WHERE id_conversa = ?`;

    connection.query(checkSql, [id_conversa], (err, rows) => {
        if (err || !rows || rows.length === 0) {
            return res.status(404).json({ mensagem: 'Conversa não encontrada' });
        }

        const conv = rows[0];
        if (conv.status !== 'aceito') {
            return res.status(403).json({ mensagem: 'Aguarde o organizador aceitar a solicitação para enviar mais mensagens.' });
        }

        const sql = `
            INSERT INTO MENSAGEM (id_conversa, id_remetente, conteudo, lida, enviada_em)
            VALUES (?, ?, ?, 0, NOW())
        `;

        connection.query(sql, [id_conversa, id_remetente, conteudo.trim()], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ mensagem: 'Erro ao enviar mensagem.' });
            }

            connection.query(`UPDATE CONVERSA SET atualizada_em = NOW() WHERE id_conversa = ?`, [id_conversa]);

            const newMsg = {
                id_mensagem: result.insertId,
                id_conversa: Number(id_conversa),
                id_remetente: Number(id_remetente),
                conteudo: conteudo.trim(),
                lida: 0,
                enviada_em: new Date().toISOString()
            };

            // Entrega em tempo real via WebSocket para os dois participantes
            notifyUsersWS([conv.id_solicitante, conv.id_organizador], {
                type: 'new_message',
                message: newMsg
            });

            res.json(newMsg);
        });
    });
});

///////////////////
// NOTIFICATIONS //
///////////////////

// Get user notifications
app.get('/notificacoes/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    const sql = `
        SELECT * FROM NOTIFICACAO
        WHERE id_usuario = ?
        ORDER BY enviada_em DESC, id_notificacao DESC
    `;

    connection.query(sql, [id_usuario], (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ mensagem: 'Erro ao buscar notificações.' });
        }
        res.json(resultados);
    });
});

// Mark single notification as read
app.put('/notificacoes/:id/lida', (req, res) => {
    const { id } = req.params;

    const sql = `UPDATE NOTIFICACAO SET lida = 1 WHERE id_notificacao = ?`;

    connection.query(sql, [id], (erro) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ mensagem: 'Erro ao marcar notificação como lida.' });
        }
        res.json({ mensagem: 'Notificação marcada como lida.' });
    });
});

// Clear all notifications for a user
app.delete('/notificacoes/usuario/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const sql = `DELETE FROM NOTIFICACAO WHERE id_usuario = ?`;

    connection.query(sql, [id_usuario], (erro) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ mensagem: 'Erro ao limpar notificações.' });
        }
        res.json({ mensagem: 'Todas as notificações foram limpas.' });
    });
});

////////////
// WASTES //
////////////

// Create Waste Suggestion
app.post('/sugestoes-residuos', upload.array('images', 3), (req, res) => {
    const { id_usuario, nome, tipo, observacoes } = req.body;
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const sql = `
        INSERT INTO SUGESTAO_RESIDUO (id_usuario, nome, tipo, observacoes, foto_residuos, status, criada_em)
        VALUES (?, ?, ?, ?, ?, 'pending', NOW())
    `;
    connection.query(sql, [id_usuario, nome, tipo, observacoes || null, JSON.stringify(imagePaths)], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ mensagem: 'Erro ao enviar sugestão de resíduo.' });
        }
        res.json({
            mensagem: 'Sugestão enviada com sucesso!',
            id_sugestao: result.insertId
        });
    });
});

// List suggestions from a specific user
app.get('/sugestoes-residuos/usuario/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    const sql = `SELECT * FROM SUGESTAO_RESIDUO WHERE id_usuario = ? ORDER BY criada_em DESC`;
    connection.query(sql, [id_usuario], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ mensagem: 'Erro ao buscar sugestões.' });
        }
        res.json(rows);
    });
});

// Approve or reject a suggestion (Adds +15 points if approved)
app.put('/sugestoes-residuos/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, motivo_reprovacao } = req.body;

    const getSql = `SELECT id_usuario, nome, status FROM SUGESTAO_RESIDUO WHERE id_sugestao = ?`;
    connection.query(getSql, [id], (err, rows) => {
        if (err || !rows || rows.length === 0) {
            return res.status(404).json({ mensagem: 'Sugestão não encontrada.' });
        }

        const sug = rows[0];
        const updateSql = `UPDATE SUGESTAO_RESIDUO SET status = ?, motivo_reprovacao = ? WHERE id_sugestao = ?`;
        connection.query(updateSql, [status, motivo_reprovacao || null, id], (errUpd) => {
            if (errUpd) {
                return res.status(500).json({ mensagem: 'Erro ao atualizar status da sugestão.' });
            }

            if (status === 'approved' && sug.status !== 'approved') {
                updateUserPoints(sug.id_usuario, 15);

                const notifSql = `
                    INSERT INTO NOTIFICACAO (id_usuario, mensagem, tipo, enviada_em)
                    VALUES (?, CONCAT('Sua sugestão de resíduo "', ?, '" foi aprovada! Você ganhou +15 pontos.'), 'servico', NOW())
                `;
                connection.query(notifSql, [sug.id_usuario, sug.nome], () => {
                    notifyUsersWS([sug.id_usuario], { type: 'notification_update' });
                });
            } else if (status === 'disapproved') {
                const notifSql = `
                    INSERT INTO NOTIFICACAO (id_usuario, mensagem, tipo, enviada_em)
                    VALUES (?, CONCAT('Sua sugestão de resíduo "', ?, '" foi reprovada. Motivo: ', ?), 'cancelamento', NOW())
                `;
                connection.query(notifSql, [sug.id_usuario, sug.nome, motivo_reprovacao || 'Não especificado'], () => {
                    notifyUsersWS([sug.id_usuario], { type: 'notification_update' });
                });
            }

            res.json({ mensagem: `Sugestão atualizada para ${status}.` });
        });
    });
});

////////////////////
// EXCLUSIVE MODS //
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

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

// Add/Remove points
app.post('/usuarios/:id/pontos', (req, res) => {
    const { id } = req.params;
    const { pontos } = req.body; // Ex: { "pontos": 50 } or { "pontos": -10 }

    if (pontos === undefined || isNaN(pontos)) {
        return res.status(400).json({ mensagem: 'Informe um valor válido para os pontos.' });
    }

    updateUserPoints(id, Number(pontos), (err, result) => {
        if (err) {
            return res.status(500).json({ mensagem: 'Erro ao atualizar pontos do usuário.' });
        }
        res.json({
            mensagem: 'Pontos atualizados com sucesso!',
            ...result
        });
    });
});