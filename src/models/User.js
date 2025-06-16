const { pool } = require('../config/db');

class User {
    static async findByMatricula(matricula) {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE matricula = ?', [matricula]);
        return rows[0];
    }

    static async getBorrowedBooksCount(matricula) {
        const [rows] = await pool.query(
            'SELECT COUNT(*) AS count FROM emprestimos WHERE usuario_matricula = ? AND status = "emprestado"',
            [matricula]
        );
        return rows[0].count;
    }

    // Métodos CRUD básicos para usuário (ex: create, update, delete) podem ser adicionados aqui
    // Ex: static async create(user) { ... }
}

module.exports = User;