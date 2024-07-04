
# Elixir Backend

## Descrição

Elixir Backend é uma API desenvolvida em Node.js que consome dados de um banco de dados para fornecer receitas de sucos, chás, shakes, etc., de acordo com o perfil do usuário. Por exemplo, se o usuário está com gripe e tem alergia ou não gosta de hortelã, o aplicativo recomendará chás para gripe que se adequam a essas características.

## Tecnologias Utilizadas

- Node.js
- Express.js
- Sequelize (ORM)
- Docker

## Estrutura do Projeto

- `models/`: Contém os modelos Sequelize para as tabelas do banco de dados.
- `routes/`: Contém as definições de rotas da API.
- `uploads/`: Diretório para armazenar as imagens dos sucos.

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/AlexsanderFrr/elixir-backend.git
   ```
2. Navegue até o diretório do projeto:
   ```sh
   cd elixir-backend
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```
4. Configure o banco de dados e as variáveis de ambiente no arquivo `.env`.
5. Execute as migrações do banco de dados:
   ```sh
   npx sequelize db:migrate
   ```
6. Inicie a aplicação:
   ```sh
   npm start
   ```

## Docker

1. Construa a imagem Docker:
   ```sh
   docker build -t elixir-backend .
   ```
2. Execute o container:
   ```sh
   docker run -p 3000:3000 elixir-backend
   ```

## Endpoints

### Usuários

- **Cadastrar Usuário:**
  - **POST** `/usuarios/add`
  - Corpo da Requisição:
    ```json
    {
      "nome": "Seu Nome",
      "email": "seuemail@example.com",
      "senha": "suasenha"
    }
    ```

- **Listar Todos os Usuários:**
  - **GET** `/usuarios/all`

- **Buscar Usuário por ID:**
  - **GET** `/usuarios/:id`

- **Atualizar Usuário por ID:**
  - **PUT** `/usuarios/:id`
  - Corpo da Requisição:
    ```json
    {
      "nome": "Novo Nome",
      "email": "novoemail@example.com",
      "senha": "novasenha"
    }
    ```

- **Deletar Usuário por ID:**
  - **DELETE** `/usuarios/:id`

### Ingredientes

- **Cadastrar Ingrediente:**
  - **POST** `/ingredientes/add`
  - Corpo da Requisição:
    ```json
    {
      "nome": "Nome do Ingrediente",
      "beneficios": "Benefícios do Ingrediente",
      "img": "caminho/para/imagem.png"
    }
    ```

- **Listar Todos os Ingredientes:**
  - **GET** `/ingredientes/all`

- **Buscar Ingrediente por ID:**
  - **GET** `/ingredientes/:id`

- **Atualizar Ingrediente por ID:**
  - **PUT** `/ingredientes/:id`
  - Corpo da Requisição:
    ```json
    {
      "nome": "Novo Nome do Ingrediente",
      "beneficios": "Novos Benefícios do Ingrediente",
      "img": "novo/caminho/para/imagem.png"
    }
    ```

- **Deletar Ingrediente por ID:**
  - **DELETE** `/ingredientes/:id`

### Sucos

- **Cadastrar Suco:**
  - **POST** `/sucos/add`
  - Corpo da Requisição:
    ```json
    {
      "nome": "Nome do Suco",
      "ingredientes": [1, 2], // IDs dos ingredientes
      "modo_de_preparo": "Modo de preparo do suco",
      "beneficios": "Benefícios do suco",
      "img1": "caminho/para/imagem.png"
    }
    ```

- **Listar Todos os Sucos:**
  - **GET** `/sucos/all`

- **Buscar Suco por ID:**
  - **GET** `/sucos/:id`

- **Buscar Suco por Título:**
  - **GET** `/sucos/title/:title`

- **Atualizar Suco por ID:**
  - **PUT** `/sucos/:id`
  - Corpo da Requisição:
    ```json
    {
      "nome": "Novo Nome do Suco",
      "ingredientes": [3, 4],
      "modo_de_preparo": "Novo modo de preparo",
      "beneficios": "Novos benefícios",
      "img1": "novo/caminho/para/imagem.png"
    }
    ```

- **Deletar Suco por ID:**
  - **DELETE** `/sucos/:id`

### AllInformations

- **Cadastrar Informação Completa:**
  - **POST** `/allinformations/add`
  - Corpo da Requisição:
    ```json
    {
      "nome": "Nome do Suco",
      "ingredientes": [1, 2], // IDs dos ingredientes
      "modo_de_preparo": "Modo de preparo do suco",
      "beneficios": "Benefícios do suco",
      "img1": "caminho/para/imagem.png"
    }
    ```

- **Listar Todas as Informações:**
  - **GET** `/allinformations/all`

- **Buscar Informação por ID:**
  - **GET** `/allinformations/:id`

- **Buscar Informação por Título:**
  - **GET** `/allinformations/search/:title`

- **Atualizar Informação por ID:**
  - **PUT** `/allinformations/update/:id`
  - Corpo da Requisição:
    ```json
    {
      "fk_suco": 1,
      "fk_diagnostico": 2,
      "ingredientes": [1, 2],
      "diagnosticos": [1, 2]
    }
    ```

- **Deletar Informação por ID:**
  - **DELETE** `/allinformations/delete/:id`

## Como Contribuir

1. Faça um fork do projeto.
2. Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`).
4. Faça um push para a branch (`git push origin feature/nova-funcionalidade`).
5. Crie um novo Pull Request.