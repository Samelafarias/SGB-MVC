const User = require('../models/User');
const Book = require('../models/Book');
const Loan = require('../models/Loan');

class LoanController {
    static async createLoan(req, res) {
        const { matricula, isbn } = req.body;

        if (!matricula || !isbn) {
            return res.status(400).json({ error: 'Matrícula do usuário e ISBN do livro são obrigatórios.' });
        }

        try {
            const user = await User.findByMatricula(matricula);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            const book = await Book.findByISBN(isbn);
            if (!book) {
                return res.status(404).json({ error: 'Livro não encontrado.' });
            }

            if (book.quantidade_disponivel <= 0) {
                return res.status(400).json({ error: 'Não há exemplares disponíveis deste livro.' });
            }

            const borrowedCount = await User.getBorrowedBooksCount(matricula);
            if (borrowedCount >= 3) {
                return res.status(400).json({ error: 'Usuário atingiu o limite de 3 livros emprestados.' });
            }

            const today = new Date();
            const dueDate = new Date();
            dueDate.setDate(today.getDate() + 7); 

            const loanData = {
                usuario_matricula: matricula,
                livro_isbn: isbn,
                data_emprestimo: today.toISOString().slice(0, 10), 
                data_prevista_devolucao: dueDate.toISOString().slice(0, 10)
            };

            const loanId = await Loan.create(loanData);
            await Book.updateAvailableQuantity(isbn, -1); 

            res.status(201).json({ message: 'Empréstimo registrado com sucesso!', loanId });

        } catch (error) {
            console.error('Erro ao registrar empréstimo:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao registrar empréstimo.' });
        }
    }

    static async registerReturn(req, res) {
        const { loanId } = req.body;

        if (!loanId) {
            return res.status(400).json({ error: 'ID do empréstimo é obrigatório.' });
        }

        try {
            const loan = await Loan.findById(loanId);
            if (!loan) {
                return res.status(404).json({ error: 'Empréstimo não encontrado.' });
            }

            if (loan.status !== 'emprestado') {
                return res.status(400).json({ error: 'Este empréstimo já foi devolvido ou está em outro status.' });
            }

            const today = new Date();
            const predictedDueDate = new Date(loan.data_prevista_devolucao);
            let status = 'devolvido';

            if (today > predictedDueDate) {
                status = 'atrasado';
            }

            await Loan.updateReturn(loanId, today.toISOString().slice(0, 10), status);
            await Book.updateAvailableQuantity(loan.livro_isbn, 1); 

            res.status(200).json({ message: 'Devolução registrada com sucesso!', status });

        } catch (error) {
            console.error('Erro ao registrar devolução:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao registrar devolução.' });
        }
    }

    static async getBorrowedBooks(req, res) {
        try {
            const borrowedBooks = await Loan.getBorrowedBooks();
            res.status(200).json(borrowedBooks);
        } catch (error) {
            console.error('Erro ao buscar livros emprestados:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao buscar livros emprestados.' });
        }
    }

    static async getOverdueLoans(req, res) {
        try {
            const overdueLoans = await Loan.getOverdueLoans();
            res.status(200).json(overdueLoans);
        } catch (error) {
            console.error('Erro ao buscar empréstimos atrasados:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao buscar empréstimos atrasados.' });
        }
    }
}

module.exports = LoanController;