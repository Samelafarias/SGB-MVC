document.addEventListener('DOMContentLoaded', () => {

    const loanForm = document.getElementById('loan-form');
    const returnForm = document.getElementById('return-form');
    const loanMessage = document.getElementById('loan-message');
    const returnMessage = document.getElementById('return-message');
    const showBorrowedBooksBtn = document.getElementById('show-borrowed-books');
    const borrowedBooksList = document.getElementById('borrowed-books-list');
    const showOverdueLoansBtn = document.getElementById('show-overdue-loans');
    const overdueLoansList = document.getElementById('overdue-loans-list');

    function showMessage(element, message, isError = false) {
        element.textContent = message;
        element.style.color = isError ? 'red' : 'green';
    }
    
    loanForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const matricula = document.getElementById('loan-matricula').value;
        const isbn = document.getElementById('loan-isbn').value;

        try {
          
            const response = await fetch(`http://localhost:3306/models/loans`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ matricula, isbn }) 
            });

            const data = await response.json(); 
            if (response.ok) { 
                showMessage(loanMessage, data.message); 
                loanForm.reset(); 
            } else {
                showMessage(loanMessage, `Erro: ${data.error}`, true); 
            }
        } catch (error) {
            console.error('Erro ao enviar empréstimo:', error);
            showMessage(loanMessage, 'Erro na comunicação com o servidor. Verifique o console para detalhes.', true);
        }
    });

    returnForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loanId = document.getElementById('return-loan-id').value;

        try {
            const response = await fetch(`http://localhost:3306/models/returns`, {
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

    showBorrowedBooksBtn.addEventListener('click', async () => {
        try {

            const response = await fetch(`http://localhost:3306/models/loans/borrowed`);
            const data = await response.json(); 

            borrowedBooksList.innerHTML = ''; 
            if (data.length === 0) {
                borrowedBooksList.innerHTML = '<p>Nenhum livro emprestado no momento.</p>';
                return;
            }

            const ul = document.createElement('ul');
            data.forEach(loan => {
                const li = document.createElement('li');

                li.textContent = `Empréstimo ID: ${loan.id} | Usuário: ${loan.usuario_nome} (${loan.usuario_matricula}) | Livro: ${loan.livro_titulo} (${loan.livro_isbn}) | Data Empréstimo: ${loan.data_emprestimo} | Data Prevista Devolução: ${loan.data_prevista_devolucao}`;
                ul.appendChild(li);
            });
            borrowedBooksList.appendChild(ul);

        } catch (error) {
            console.error('Erro ao buscar livros emprestados:', error);
            showMessage(borrowedBooksList, 'Erro ao carregar livros emprestados. Verifique o console.', true);
        }
    });

    showOverdueLoansBtn.addEventListener('click', async () => {
        try {

            const response = await fetch(`http://localhost:3306/models/loans/overdue`);
            const data = await response.json(); 

            overdueLoansList.innerHTML = ''; 
            if (data.length === 0) {
                overdueLoansList.innerHTML = '<p>Nenhum empréstimo atrasado no momento.</p>';
                return;
            }

            const ul = document.createElement('ul');
            data.forEach(loan => {
                const li = document.createElement('li');
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
