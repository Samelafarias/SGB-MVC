// src/config/db.js

const mysql = require('mysql2/promise');

const dbConfig = {
     host: 'localhost',      
    user: 'root',          
    password: '',           
    database: 'biblioteca_db' 
};

let connection; // Variável para armazenar a conexão única

async function connectDB() {
    try {
        // Se a conexão não existe ou foi desconectada, cria uma nova
        // 'undefined' é um estado válido para 'connection' se nunca foi atribuída.
        // O estado 'disconnected' não é exposto diretamente pelo mysql2/promise como um atributo 'state',
        // mas a verificação `!connection` cobre o caso inicial.
        // Para reconexões robustas, pode-se adicionar lógica de retry ou verificar o status do pool.
        if (!connection) {
            connection = await mysql.createConnection(dbConfig);
            console.log('Conectado ao banco de dados MySQL/MariaDB!');
            await createTables(connection); // Passa a conexão para createTables
        }
        return connection;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message);
        process.exit(1); // Sai do processo se a conexão inicial falhar
    }
}

async function createTables(conn) {
    // Tabela: livros
    await conn.execute(`
        CREATE TABLE IF NOT EXISTS livros (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            autor VARCHAR(255) NOT NULL,
            isbn VARCHAR(20) UNIQUE NOT NULL,
            ano_publicacao INT NOT NULL,
            quantidade_total INT NOT NULL DEFAULT 0,    -- Adicionado para consistência
            quantidade_disponivel INT NOT NULL DEFAULT 0
        );
    `);
    // Tabela: usuarios
    await conn.execute(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            matricula VARCHAR(50) UNIQUE NOT NULL,
            curso VARCHAR(255) NOT NULL
        );
    `);
    // Tabela: emprestimos
    await conn.execute(`
        CREATE TABLE IF NOT EXISTS emprestimos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            livro_id INT NOT NULL,
            usuario_id INT NOT NULL,
            data_emprestimo DATE NOT NULL,
            data_prevista_devolucao DATE NOT NULL,
            data_devolucao DATE NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'emprestado',
            FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        );
    `);
    console.log('Tabelas verificadas/criadas no banco de dados.');
}

module.exports = { connectDB };