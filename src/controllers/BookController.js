const Book = require('../models/Book');

class BookController {
    static async getAllBooks(req, res) {
        try {
            const [books] = await Book.pool.query('SELECT * FROM livros');
            res.status(200).json(books);
        } catch (error) {
            console.error('Erro ao buscar todos os livros:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }

    static async getBookByISBN(req, res) {
        const { isbn } = req.params;
        try {
            const book = await Book.findByISBN(isbn);
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ error: 'Livro não encontrado.' });
            }
        } catch (error) {
            console.error('Erro ao buscar livro por ISBN:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }

    // Adicione outros métodos CRUD para livros aqui (create, update, delete)
}

module.exports = BookController;