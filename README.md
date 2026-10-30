Gerenciamento de Cursos Online
API inicial para o projeto acadêmico de Gerenciamento de Cursos Online. A API utiliza Node.js, TypeScript, Express e PostgreSQL no Supabase.
Requisitos
- Node.js 20 ou superior e npm.
- Um projeto no Supabase com a string de conexão do PostgreSQL.
Configuração
1. Instale as dependências com npm install.
2. Copie o arquivo .env.example para .env.
3. Configure DATABASE_URL com a string de conexão do Supabase. Mantenha a senha em sigilo. Configure DB_SSL=true ao utilizar o banco de dados hospedado no Supabase.
4. No Editor SQL do Supabase, execute o arquivo database/migrations/001_create_initial_schema.sql.
Execução
- Desenvolvimento com reinicialização automática: npm run dev
- Compilar TypeScript: npm run build
- Executar o servidor compilado: npm start
A API utiliza a porta 3000 por padrão. Para alterá-la, configure PORT no arquivo .env.
Verificação de funcionamento
Inicie o servidor e faça uma requisição GET para:

http://localhost:3000/api/health

A API retornará HTTP 200 e a seguinte resposta:
{
  "status": "ok"
}


Exemplo utilizando o terminal:
curl http://localhost:3000/api/health


Esse endpoint verifica se o processo da API está respondendo, mas não realiza consultas ao banco de dados.
Estrutura do projeto
src/
  config/          Configurações do ambiente
  controllers/     Manipuladores de requisições HTTP
  database/        Pool de conexões PostgreSQL
  middlewares/     Middlewares do Express
  repositories/    Acesso ao banco de dados
  routes/          Definições das rotas da API
  services/        Lógica da aplicação
  app.ts           Aplicação Express
  server.ts        Ponto de entrada do servidor HTTP

database/
  migrations/      Migrações do esquema SQL

docs/              Documentação do projeto e diagrama ER


Os endpoints CRUD foram intencionalmente deixados para os responsáveis por cada funcionalidade.
Divisão inicial das tarefas da equipe
- João: configuração do projeto, arquitetura, esquema do banco de dados e endpoint de verificação.
- Augusto: operações CRUD relacionadas aos usuários.
- Thiago: operações CRUD de cursos e módulos.
- Daniel: operações CRUD de conteúdos e progresso dos usuários.
A equipe deve definir as responsabilidades e os contratos da API no repositório compartilhado antes de implementar funcionalidades que possam gerar conflitos.
Primeiro commit e envio para o GitHub
Crie um repositório vazio no GitHub e execute os comandos abaixo no diretório do projeto (substitua a URL pela URL do seu repositório):
git add .
git commit -m "chore: inicializa API de gerenciamento de cursos online"
git branch -M main
git remote add origin https://github.com/<sua-conta>/<seu-repositorio>.git
git push -u origin main


Importante: Nunca envie o arquivo .env para o GitHub. As credenciais devem permanecer em variáveis de ambiente locais ou em um gerenciador de segredos aprovado.
