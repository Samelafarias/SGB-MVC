const { pool } = require('../config/db');

class Loan {
    static async create(loanData) {
        const { usuario_matricula, livro_isbn, data_emprestimo, data_prevista_devolucao } = loanData;
        const [result] = await pool.query(
            'INSERT INTO emprestimos (usuario_matricula, livro_isbn, data_emprestimo, data_prevista_devolucao, status) VALUES (?, ?, ?, ?, "emprestado")',
            [usuario_matricula, livro_isbn, data_emprestimo, data_prevista_devolucao]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM emprestimos WHERE id = ?', [id]);
        return rows[0];
    }

    static async findActiveLoan(usuario_matricula, livro_isbn) {
        const [rows] = await pool.query(
            'SELECT * FROM emprestimos WHERE usuario_matricula = ? AND livro_isbn = ? AND status = "emprestado"',
            [usuario_matricula, livro_isbn]
        );
        return rows[0];
    }

    static async updateReturn(loanId, dataDevolucao, status) {
        await pool.query(
            'UPDATE emprestimos SET data_devolucao = ?, status = ? WHERE id = ?',
            [dataDevolucao, status, loanId]
        );
    }

    static async getBorrowedBooks() {
        const [rows] = await pool.query(`
            SELECT
                e.id,
                u.nome AS usuario_nome,
                u.matricula AS usuario_matricula,
                l.titulo AS livro_titulo,
                l.isbn AS livro_isbn,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.status
            FROM emprestimos e
            JOIN usuarios u ON e.usuario_matricula = u.matricula
            JOIN livros l ON e.livro_isbn = l.isbn
            WHERE e.status = 'emprestado'
        `);
        return rows;
    }

    static async getOverdueLoans() {
        const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
        const [rows] = await pool.query(`
            SELECT
                e.id,
                u.nome AS usuario_nome,
                u.matricula AS usuario_matricula,
                l.titulo AS livro_titulo,
                l.isbn AS livro_isbn,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.status
            FROM emprestimos e
            JOIN usuarios u ON e.usuario_matricula = u.matricula
            JOIN livros l ON e.livro_isbn = l.isbn
            WHERE e.status = 'emprestado' AND e.data_prevista_devolucao < ?
        `, [today]);
        return rows;
    }
}

module.exports = Loan;