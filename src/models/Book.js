const { pool } = require('../config/db');

class Book {
    static async findByISBN(isbn) {
        const [rows] = await pool.query('SELECT * FROM livros WHERE isbn = ?', [isbn]);
        return rows[0];
    }

    static async updateAvailableQuantity(isbn, change) {
        await pool.query(
            'UPDATE livros SET quantidade_disponivel = quantidade_disponivel + ? WHERE isbn = ?',
            [change, isbn]
        );
    }

    // Métodos CRUD básicos para livro
    // Ex: static async getAll() { ... }
}

module.exports = Book;