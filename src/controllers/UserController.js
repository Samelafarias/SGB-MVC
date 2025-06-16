const User = require('../models/User');

class UserController {
    static async getAllUsers(req, res) {
        try {
            const [users] = await User.pool.query('SELECT * FROM usuarios');
            res.status(200).json(users);
        } catch (error) {
            console.error('Erro ao buscar todos os usuários:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }

    static async getUserByMatricula(req, res) {
        const { matricula } = req.params;
        try {
            const user = await User.findByMatricula(matricula);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'Usuário não encontrado.' });
            }
        } catch (error) {
            console.error('Erro ao buscar usuário por matrícula:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }

}

module.exports = UserController;