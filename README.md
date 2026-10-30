# Guia de Instalação

#### 1. Clone o repositório na sua máquina com:
`git clone https://github.com/Munari-8/limpaai.git`

#### 2. Crie e prepare o banco de dados via MySQL Workbench colando o seguinte código e executando-o:

```
CREATE DATABASE limpaai;
USE limpaai;

-- 1. Criação da tabela CATEGORIA_USUARIO (Independente)
CREATE TABLE CATEGORIA_USUARIO (
    id_categoria_usuario INT(11) NOT NULL AUTO_INCREMENT,
    nome_categoria VARCHAR(32) NOT NULL,
    PRIMARY KEY (id_categoria_usuario)
) ENGINE=InnoDB;

-- 2. Criação da tabela RESIDUO (Independente)
CREATE TABLE RESIDUO (
    id_residuo INT(11) NOT NULL AUTO_INCREMENT,
    nome VARCHAR(88) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao VARCHAR(88),
    foto_residuo VARCHAR(255),
    PRIMARY KEY (id_residuo)
) ENGINE=InnoDB;

-- 3. Criação da tabela USUARIO (Depende de CATEGORIA_USUARIO)
CREATE TABLE USUARIO (
    id_usuario INT(11) NOT NULL AUTO_INCREMENT,
    id_categoria INT(11) NOT NULL,
    nome VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    tipo_usuario VARCHAR(48),
    cidade VARCHAR(100),
    bairro VARCHAR(100),
    foto_perfil VARCHAR(255),
    PRIMARY KEY (id_usuario),
    CONSTRAINT fk_usuario_categoria FOREIGN KEY (id_categoria) 
        REFERENCES CATEGORIA_USUARIO (id_categoria_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Criação da tabela SERVICO (Depende de USUARIO via id_ofertante)
CREATE TABLE SERVICO (
    id_servico INT(11) NOT NULL AUTO_INCREMENT,
    id_ofertante INT(11) NOT NULL,
    titulo VARCHAR(21) NOT NULL,
    descricao VARCHAR(88),
    endereco VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    data DATE,
    horario TIME,
    status VARCHAR(50),
    vagas_max INT(11),
    PRIMARY KEY (id_servico),
    CONSTRAINT fk_servico_ofertante FOREIGN KEY (id_ofertante) 
        REFERENCES USUARIO (id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. Criação da tabela NOTIFICACAO (Depende de USUARIO)
CREATE TABLE NOTIFICACAO (
    id_notificacao INT(11) NOT NULL AUTO_INCREMENT,
    id_usuario INT(11) NOT NULL,
    mensagem TEXT,
    enviada_em DATETIME,
    lida TINYINT(1) DEFAULT 0,
    PRIMARY KEY (id_notificacao),
    CONSTRAINT fk_notificacao_usuario FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. Criação da tabela PARTICIPACAO (Tabela pivô - Depende de USUARIO e SERVICO)
CREATE TABLE PARTICIPACAO (
    id_participacao INT(11) NOT NULL AUTO_INCREMENT,
    id_usuario INT(11) NOT NULL,
    id_servico INT(11) NOT NULL,
    situacao VARCHAR(100),
    inscrito_em DATETIME,
    PRIMARY KEY (id_participacao),
    CONSTRAINT fk_participacao_usuario FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_participacao_servico FOREIGN KEY (id_servico) 
        REFERENCES SERVICO (id_servico)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
 
INSERT INTO CATEGORIA_USUARIO (nome_categoria) VALUES ('Comum');
```

#### 3. Dentro da pasta ./frontend, crie um arquivo chamado ".env" e insira nele o seguinte código, substituindo `SEU_IP` pelo atual IP da máquina (garanta que tanto seu dispositivo móvel quanto sua máquina estejam conectadas na mesma rede wifi):

```
EXPO_PUBLIC_API_URL=SEU_IP:3000
```

Como descobrir seu IP via CLI (terminal):  
Windows: `ipconfig`  
macOS: `ipconfig getifaddr en0`  
Linux: `ip a`


#### 4. Dentro da pasta ./backend, acesse o arquivo "dbconfig.js" e configure a variável `connection`:
3.1. Caso esteja em um notebook ou desktop da escola, apenas comente as linhas de 3 à 8 e retire as barras da frente das linhas de 10 à 15. Caso ocorra algum erro, apague `root` de `password` e deixe-o vazio.  

3.2 Caso esteja em uma máquina própria, comente as linhas de 3 à 8, retire as barras da frente das linhas de 10 à 15 e troque os valores de `user` e `password` pelos configurados na máquina atual.


#### 5. Abra o terminal (bash) na pasta ./frontend e rode o comando `npm install expo@57`


# Tudo Pronto

#### Para inicializar o projeto, no terminal, rode:
1. `node server.js` em ./backend
2. `npx expo start` em ./frontend
3. Escaneie o QR code e aproveite!