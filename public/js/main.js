// public/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos HTML no seu index.html
    const loanForm = document.getElementById('loan-form');
    const returnForm = document.getElementById('return-form');
    const loanMessage = document.getElementById('loan-message');
    const returnMessage = document.getElementById('return-message');
    const showBorrowedBooksBtn = document.getElementById('show-borrowed-books');
    const borrowedBooksList = document.getElementById('borrowed-books-list');
    const showOverdueLoansBtn = document.getElementById('show-overdue-loans');
    const overdueLoansList = document.getElementById('overdue-loans-list');

    // Função auxiliar para exibir mensagens para o usuário
    function showMessage(element, message, isError = false) {
        element.textContent = message;
        element.style.color = isError ? 'red' : 'green';
    }

    // Listener para o formulário de Empréstimo
    loanForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário (recarregar a página)
        const matricula = document.getElementById('loan-matricula').value;
        const isbn = document.getElementById('loan-isbn').value;

        try {
            // Requisição HTTP POST para o endpoint da API de empréstimos
            // '/api/loans' é o 'caminho virtual' que o Express no backend irá processar.
            const response = await fetch('/models/loans', {
                method: 'POST', // Usa o método POST para enviar dados
                headers: {
                    'Content-Type': 'application/json' // Informa ao servidor que o corpo da requisição é JSON
                },
                body: JSON.stringify({ matricula, isbn }) // Converte os dados para string JSON
            });

            const data = await response.json(); // Tenta parsear a resposta como JSON
            if (response.ok) { // Verifica se a resposta HTTP foi bem-sucedida (status 2xx)
                showMessage(loanMessage, data.message); // Exibe mensagem de sucesso do backend
                loanForm.reset(); // Limpa o formulário
            } else {
                showMessage(loanMessage, `Erro: ${data.error}`, true); // Exibe mensagem de erro do backend
            }
        } catch (error) {
            console.error('Erro ao enviar empréstimo:', error);
            // Captura erros de rede ou de parsing JSON (como o "Unexpected token <")
            showMessage(loanMessage, 'Erro na comunicação com o servidor. Verifique o console para detalhes.', true);
        }
    });

    // Listener para o formulário de Devolução
    returnForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loanId = document.getElementById('return-loan-id').value;

        try {
            // Requisição HTTP POST para o endpoint da API de devoluções
            const response = await fetch('/models/returns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ loanId })
            });

            const data = await response.json();
            if (response.ok) {
                showMessage(returnMessage, data.message);
                returnForm.reset();
            } else {
                showMessage(returnMessage, `Erro: ${data.error}`, true);
            }
        } catch (error) {
            console.error('Erro ao enviar devolução:', error);
            showMessage(returnMessage, 'Erro na comunicação com o servidor. Verifique o console para detalhes.', true);
        }
    });

    // Listener para o botão "Livros Emprestados Atualmente"
    showBorrowedBooksBtn.addEventListener('click', async () => {
        try {
            // Requisição HTTP GET para o endpoint da API de livros emprestados
            const response = await fetch('/models/loans/borrowed');
            const data = await response.json(); // Espera uma array de objetos JSON

            borrowedBooksList.innerHTML = ''; // Limpa a lista anterior
            if (data.length === 0) {
                borrowedBooksList.innerHTML = '<p>Nenhum livro emprestado no momento.</p>';
                return;
            }

            const ul = document.createElement('ul');
            data.forEach(loan => {
                const li = document.createElement('li');
                // Formata e exibe os dados recebidos do backend
                li.textContent = `Empréstimo ID: ${loan.id} | Usuário: ${loan.usuario_nome} (${loan.usuario_matricula}) | Livro: ${loan.livro_titulo} (${loan.livro_isbn}) | Data Empréstimo: ${loan.data_emprestimo} | Data Prevista Devolução: ${loan.data_prevista_devolucao}`;
                ul.appendChild(li);
            });
            borrowedBooksList.appendChild(ul);

        } catch (error) {
            console.error('Erro ao buscar livros emprestados:', error);
            showMessage(borrowedBooksList, 'Erro ao carregar livros emprestados. Verifique o console.', true);
        }
    });

    // Listener para o botão "Usuários com Devoluções Atrasadas"
    showOverdueLoansBtn.addEventListener('click', async () => {
        try {
            // Requisição HTTP GET para o endpoint da API de empréstimos atrasados
            const response = await fetch('/models/loans/overdue');
            const data = await response.json(); // Espera uma array de objetos JSON

            overdueLoansList.innerHTML = ''; // Limpa a lista anterior
            if (data.length === 0) {
                overdueLoansList.innerHTML = '<p>Nenhum empréstimo atrasado no momento.</p>';
                return;
            }

            const ul = document.createElement('ul');
            data.forEach(loan => {
                const li = document.createElement('li');
                // Formata e exibe os dados recebidos do backend, indicando atraso
                li.textContent = `Empréstimo ID: ${loan.id} | Usuário: ${loan.usuario_nome} (${loan.usuario_matricula}) | Livro: ${loan.livro_titulo} (${loan.livro_isbn}) | Data Empréstimo: ${loan.data_emprestimo} | Data Prevista Devolução: ${loan.data_prevista_devolucao} (ATRASADO)`;
                ul.appendChild(li);
            });
            overdueLoansList.appendChild(ul);

        } catch (error) {
            console.error('Erro ao buscar empréstimos atrasados:', error);
            showMessage(overdueLoansList, 'Erro ao carregar empréstimos atrasados. Verifique o console.', true);
        }
    });
});
