# Guia de Instalação e Configuração

Este guia descreve como configurar o ambiente de desenvolvimento para o projeto E-commerce.

## Pré-requisitos

- Git
- Docker e Docker Compose
- Node.js 18 ou superior
- Python 3.9 ou superior
- Poetry (gerenciador de pacotes Python)
- Editor de código (recomendamos VS Code)

## Configuração do Backend

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/ecommerce-project.git
cd ecommerce-project
```

### 2. Configuração do ambiente Python

```bash
cd backend
poetry install
```

### 3. Variáveis de ambiente

Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:

```Dockerfile
DATABASE_URL=postgresql://postgres:postgres@db:5432/ecommerce
REDIS_URL=redis://redis:6379/0
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Iniciar os serviços com Docker

```bash
docker-compose up -d
```

### 5. Executar migrações

```bash
poetry run alembic upgrade head
```

### 6. Carregar dados iniciais (opcional)

```bash
poetry run python scripts/seed_data.py
```

### 7. Iniciar o servidor de desenvolvimento

```bash
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Configuração do Frontend

### 1. Instalar dependências

```bash
cd frontend
npm install
```

### 2. Variáveis de ambiente

Crie um arquivo `.env.local` na pasta `frontend` com:

```Envfile
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

## Verificação da Instalação

1. Backend API: Acesse <http://localhost:8000/docs> para visualizar a documentação Swagger
2. Frontend: Acesse <http://localhost:3000> para ver a aplicação web

## Solução de Problemas Comuns

### Erro de conexão com o banco de dados

Verifique se o contêiner do PostgreSQL está em execução:

```bash
docker ps | grep postgres
```

Se não estiver, verifique os logs:

```bash
docker-compose logs db
```

### Problemas com permissões no Docker

Em sistemas Linux, pode ser necessário ajustar permissões:

```bash
sudo chown -R $USER:$USER .
```

### Problemas de CORS

Se encontrar erros de CORS, verifique se a URL da API está correta no frontend e se o backend está configurado para aceitar requisições do domínio do frontend.
