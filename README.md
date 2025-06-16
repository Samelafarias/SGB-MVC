# SGB-MVC: Módulo de Empréstimos e Devoluções de Biblioteca 📚

## Visão Geral do Projeto ✨
Este projeto implementa o módulo essencial de empréstimos e devoluções para um Sistema de Gestão de Biblioteca (SGB). Construído com uma arquitetura Model-View-Controller (MVC) robusta, o sistema utiliza JavaScript (Node.js) no backend para lógica de negócios e API, e HTML/CSS/JavaScript no frontend para uma interface de usuário intuitiva. A persistência de dados é garantida por um banco de dados MySQL. Nosso objetivo é otimizar o gerenciamento do fluxo de livros, desde o empréstimo até a devolução, com validações inteligentes e relatórios claros.

## Funcionalidades Implementadas 🚀
O SGB-MVC atende a requisitos fundamentais e oferece extensões importantes:

- [RF03 – Empréstimos:]

Limitado a 3 livros por usuário simultaneamente.

Validação de disponibilidade de estoque antes do empréstimo.

Registro Detalhado: Matrícula do usuário, ISBN do livro, Data do empréstimo (automática para data atual) e Data prevista para devolução (7 dias após o empréstimo).

- [RF04 – Devoluções:]

Processo simplificado para registro da devolução de livros.

Registro Detalhado: Data real da devolução.

Status de Atraso: Marca automaticamente o empréstimo como “atrasado” se a devolução ocorrer após a data prevista.

- [Relatórios (Extensão Obrigatória):]

📊 Visualização em tempo real de todos os livros atualmente emprestados.

⚠️ Listagem rápida de usuários com devoluções atrasadas.

- [Interface Gráfica (Web):]

Desenvolvida com HTML, CSS e JavaScript, proporcionando uma experiência de usuário limpa e funcional.

## Estrutura do Projeto e Arquitetura MVC 🏗️
A aplicação é rigorosamente organizada seguindo o padrão MVC para clareza e manutenibilidade:
```
SGB-MVC/
├── node_modules/         # 📦 Dependências do projeto (gerenciadas pelo npm)
├── public/               # 🌐 Camada View (Frontend): Tudo que o navegador acessa diretamente
│   ├── css/              #    🎨 Estilos CSS para a interface
│   │   └── style.css
│   ├── js/               #    ⚙️ Lógica JavaScript do frontend, interações e chamadas à API
│   │   └── main.js
│   └── index.html        #    📄 Página HTML principal da aplicação
├── src/                  # 💻 Código-fonte do Backend
│   ├── config/           #    🛠️ Configurações gerais
│   │   └── db.js         #       Conexão e configuração do banco de dados
│   ├── controllers/      #    🧠 Camada Controller: Processa requisições e coordena lógica
│   │   ├── BookController.js    #       Lógica específica para manipulação de livros
│   │   ├── LoanController.js    #       Lógica central para empréstimos e devoluções
│   │   └── UserController.js    #       Lógica para manipulação de usuários
│   ├── models/           #    🗄️ Camada Model: Representação de dados e interação com o DB
│   │   ├── Book.js              #       Interage com a tabela 'livros'
│   │   ├── Loan.js              #       Interage com a tabela 'emprestimos'
│   │   └── User.js              #       Interage com a tabela 'usuarios'
│   └── app.js            #    🚀 Ponto de entrada do servidor Express.js (o "cérebro")
├── .env                  #    🔐 Variáveis de ambiente (ex: credenciais do DB - NÃO comite!)
├── package-lock.json     #    🔒 Garante versões fixas das dependências
├── package.json          #    📄 Metadados do projeto e lista de dependências
└── README.md             #    📖 Este arquivo!
```

- **Model** `(src/models/)`: Os Modelos são a espinha dorsal de dados. Eles se comunicam diretamente com o banco de dados (MySQL), manipulando as informações das entidades (Usuário, Livro, Empréstimo) e aplicando validações a nível de dado.

- **View** `(public/)`: A View é o que o usuário vê e com o que interage. Esta é uma Single Page Application (SPA) responsiva em HTML, CSS e JavaScript, que consome os dados da API do backend.

- **Controller** `(src/controllers/)`: Os Controladores são os mediadores. Eles recebem as requisições HTTP do frontend (via app.js), validam a entrada, implementam as regras de negócio complexas (ex: limite de livros), e coordenam as operações de leitura/escrita de dados através dos Modelos.

- **app.js** `(src/app.js)`: O app.js é o coração do backend. Ele inicializa o servidor Express, configura os middlewares essenciais (para JSON e arquivos estáticos), e define todas as rotas da API (os "endpoints" que o frontend chama). Ele atua como o orquestrador que conecta o frontend aos controladores e, por extensão, aos modelos e ao banco de dados.


##Tecnologias Utilizadas 🛠️
Este projeto foi construído utilizando um conjunto robusto de tecnologias:

### Backend:

- `Node.js` (Ambiente de execução JavaScript)

- `Express.js` (Framework web para construir APIs RESTful)

- `MySQL2` (com Promises) (Driver oficial para comunicação assíncrona e eficiente com MySQL)

- `Dotenv` (Gerenciamento seguro de variáveis de ambiente)

### Frontend:

- `HTML5` (Estrutura semântica da interface)

- `CSS3` (Estilização moderna e responsiva)

- `JavaScript (ES6+)` (Lógica de interação do lado do cliente e Fetch API para chamadas assíncronas)

### Banco de Dados:

- `MySQL / MariaDB` (Sistema de Gerenciamento de Banco de Dados Relacional)

### Estrutura do Banco de Dados 🗃️
O banco de dados biblioteca_db (nome configurável) é composto pelas seguintes tabelas essenciais para gerenciar a biblioteca:

**usuarios:**

- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)

- `matricula` (VARCHAR(50), UNIQUE, NOT NULL)

- `nome` (VARCHAR(255), NOT NULL)

- `curso` (VARCHAR(255), NOT NULL)

**livros:**

- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)

- `titulo` (VARCHAR(255), NOT NULL)

- `autor` (VARCHAR(255), NOT NULL)

- `isbn` (VARCHAR(20), UNIQUE, NOT NULL)

- `ano_publicacao` (INT, NOT NULL)

- `quantidade_total` (INT, NOT NULL, DEFAULT 0)

- `quantidade_disponivel` (INT, NOT NULL, DEFAULT 0)

**emprestimos:**

- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)

- `livro_id` (INT, NOT NULL, FOREIGN KEY referenciando livros.id ON DELETE CASCADE)

- `usuario_id` (INT, NOT NULL, FOREIGN KEY referenciando usuarios.id ON DELETE CASCADE)

- `data_emprestimo` (DATE, NOT NULL)

- `data_prevista_devolucao` (DATE, NOT NULL)

- `data_devolucao` (DATE, NULL)

- `status` (VARCHAR(50), NOT NULL, DEFAULT 'emprestado' - valores: 'emprestado', 'devolvido', 'atrasado')

### Como Configurar e Rodar o Projeto 🚀
Siga estes passos para colocar a aplicação em funcionamento em seu ambiente de desenvolvimento.

**1. Pré-requisitos 📋**
Certifique-se de ter instalado em sua máquina:

`Node.js e npm`: Baixe a versão LTS mais recente em nodejs.org.

`MySQL Server (ou MariaDB)`: Garanta que o serviço do seu banco de dados esteja ativo e acessível.

Um Cliente `MySQL`: Ferramentas como MySQL Workbench, phpMyAdmin ou o cliente de linha de comando (mysql) são altamente recomendadas para gerenciar o banco de dados.

**2. Clonar o Repositório 📥**
Abra seu terminal ou prompt de comando e execute:

```git clone https://github.com/Samelafarias/SGB-MVC.git
cd SGB-MVC
```

**3. Configuração do Banco de Dados MySQL ⚙️**
- Crie o Banco de Dados:
Acesse seu cliente MySQL e crie um novo banco de dados. O nome padrão do projeto é biblioteca_db.
```
CREATE DATABASE IF NOT EXISTS biblioteca_db;
USE biblioteca_db;

Crie as Tabelas:
Execute os comandos SQL a seguir no seu cliente MySQL. (A função createTables
 em src/config/db.js também tentará criá-las automaticamente na primeira conexão 
 do servidor Node.js).

-- =========== DDL (Data Definition Language) ===========

-- Tabela: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    curso VARCHAR(255) NOT NULL
);

-- Tabela: livros
CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    ano_publicacao INT NOT NULL,
    quantidade_total INT NOT NULL DEFAULT 0,
    quantidade_disponivel INT NOT NULL DEFAULT 0
);

-- Tabela: emprestimos
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
```

Configure as Credenciais no `db.js`:
Abra o arquivo `src/config/db.js` e preencha a senha do seu usuário MySQL (normalmente root) e o nome exato do banco de dados, se for diferente de biblioteca_db.
 
 ```
// src/config/db.js
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'SUA_SENHA_MYSQL_AQUI', // <--- COLOQUE SUA SENHA REAL AQUI
    database: 'biblioteca_db'
};
```

Popule com Dados de Exemplo (Opcional, mas Recomendado):
Execute os seguintes comandos SQL no seu cliente MySQL. Isso adicionará dados iniciais para testar as funcionalidades de empréstimo, devolução e relatórios.

```
-- =========== DML (Data Manipulation Language) ===========

-- Inserir usuários de exemplo
INSERT INTO usuarios (matricula, nome, curso) VALUES
('2023001', 'João Silva', 'Engenharia de Software'),
('2023002', 'Maria Oliveira', 'Ciência da Computação'),
('2023003', 'Pedro Souza', 'Sistemas de Informação');

-- Inserir livros de exemplo
INSERT INTO livros (isbn, titulo, autor, ano_publicacao, quantidade_total, quantidade_disponivel) VALUES
('978-8575224362', 'Clean Code: Habilidades Essenciais do Programador Agile', 'Robert C. Martin', 2008, 5, 5),
('978-0134685994', 'The Pragmatic Programmer: Your Journey To Mastery', 'David Thomas, Andrew Hunt', 1999, 3, 3),
('978-8576051564', 'Padrões de Projeto: Soluções Reutilizáveis de Software Orientado a Objetos', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 1994, 2, 2),
('978-0321765723', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma et al.', 1994, 1, 1),
('978-1491953282', 'You Don\'t Know JS Yet: Get Started', 'Kyle Simpson', 2020, 4, 4);

-- Inserir empréstimos de exemplo (incluindo um atrasado para teste)
INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo, data_prevista_devolucao, status) VALUES
((SELECT id FROM usuarios WHERE matricula = '2023001'), (SELECT id FROM livros WHERE isbn = '978-8575224362'), '2025-06-10', '2025-06-17', 'emprestado'),
((SELECT id FROM usuarios WHERE matricula = '2023003'), (SELECT id FROM livros WHERE isbn = '978-8576051564'), '2025-06-05', '2025-06-12', 'emprestado'),
((SELECT id FROM usuarios WHERE matricula = '2023001'), (SELECT id FROM livros WHERE isbn = '978-0321765723'), '2025-06-08', '2025-06-15', 'emprestado'),
((SELECT id FROM usuarios WHERE matricula = '2023002'), (SELECT id FROM livros WHERE isbn = '978-0134685994'), '2025-05-20', '2025-05-27', 'emprestado');

-- Atualizar a quantidade disponível dos livros após os empréstimos iniciais
UPDATE livros SET quantidade_disponivel = quantidade_total - (SELECT COUNT(*) FROM emprestimos WHERE livro_id = livros.id AND status = 'emprestado');
```

**4. Instalar Dependências do Projeto 📦**
No terminal, na raiz do projeto (SGB-MVC/), execute:

`npm install`

**5. Iniciar o Servidor 🚀**
Após a instalação das dependências, inicie o servidor Node.js. Certifique-se de que o terminal esteja na raiz do seu projeto (SGB-MVC/):

`npm start`

Ou, alternativamente:

`node src/app.js`

Você deverá ver mensagens no terminal indicando que o servidor está conectado ao banco de dados e rodando na porta `http://localhost:3000.`

**6. Acessar a Aplicação 🌐**
Abra seu navegador web e acesse a URL da aplicação:

`http://localhost:3000`

Se tiver problemas, tente um "hard refresh" no navegador `(Ctrl+Shift+R ou Cmd+Shift+R)` ou abra a página em uma janela anônima para limpar o cache.

### Como Usar a Aplicação 🖥️
A interface web é projetada para ser simples e funcional, permitindo interações diretas com as funcionalidades do sistema:

**Registrar Empréstimo:**

Preencha os campos `"Matrícula do Usuário"` e `"ISBN do Livro"`.

Clique no botão `"Emprestar Livro"`. O sistema fará as validações necessárias (limite de empréstimos por usuário, disponibilidade do livro).

**Registrar Devolução:**

Insira o `"ID do Empréstimo"` no campo correspondente (este ID é gerado quando um livro é emprestado).

Clique no botão `"Devolver Livro"`. A data de devolução será registrada, e o status do empréstimo será ajustado (incluindo "atrasado" se a devolução exceder a data prevista).

**Gerar Relatórios:**

Clique no botão `"Livros Emprestados Atualmente"` para visualizar uma lista atualizada de todos os livros que estão com os usuários.

Clique no botão `"Usuários com Devoluções Atrasadas"` para identificar rapidamente quais usuários precisam ser notificados sobre seus livros.

### Como Contribuir 🤝
Adoraríamos suas contribuições para melhorar este projeto! Siga os passos abaixo para começar:

1. **Faça um Fork** do repositório para sua conta GitHub.

2. **Clone** o seu fork para sua máquina local.
```
git clone https://github.com/SEU_USUARIO/SGB-MVC.git
cd SGB-MVC
```

3.**Crie uma nova branch** para suas alterações:
```
git checkout -b feature/nome-da-sua-feature
```

4. **Faça suas alterações** no código.

5. **Comite suas alterações** com uma mensagem clara e descritiva:
```
git commit -m "feat: Adiciona nova funcionalidade X"
```

6. **Envie** suas alterações para sua branch no seu fork:
```
git push origin feature/nome-da-sua-feature
```

7. Abra um **Pull Request (PR)** do seu fork para a branch main (ou master) do repositório original, descrevendo suas mudanças.