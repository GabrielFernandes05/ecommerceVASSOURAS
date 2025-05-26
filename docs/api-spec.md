# Especificação da API do E-commerce

## Convenções REST

- Base URL: `/api/v1`
- Formato de resposta: JSON
- Autenticação: Bearer Token JWT
- Códigos de status HTTP padrão (200, 201, 400, 401, 403, 404, 500)

## Endpoints de Usuários

### Registro de Usuário

- **POST** `/users/register`
- **Payload**:

  ```json
  {
    "email": "string",
    "password": "string",
    "name": "string",
    "address": "string"
  }
  ```

- **Resposta (201)**:

  ```json
  {
    "id": "integer",
    "email": "string",
    "name": "string",
    "created_at": "datetime"
  }
  ```

### Login de Usuário

- **POST** `/users/login`
- **Payload**:

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- **Resposta (200)**:

  ```json
  {
    "access_token": "string",
    "token_type": "Bearer",
    "expires_in": "integer"
  }
  ```

## Endpoints de Produtos

### Listar Produtos

- **GET** `/products`
- **Query Parameters**:
  - `page`: Número da página (default: 1)
  - `limit`: Itens por página (default: 20)
  - `category`: ID da categoria (opcional)
  - `search`: Termo de busca (opcional)
- **Resposta (200)**:

  ```json
  {
    "items": [
      {
        "id": "integer",
        "name": "string",
        "description": "string",
        "price": "float",
        "image_url": "string",
        "stock": "integer",
        "categories": [
          {
            "id": "integer",
            "name": "string"
          }
        ]
      }
    ],
    "total": "integer",
    "page": "integer",
    "limit": "integer",
    "pages": "integer"
  }
  ```

### Detalhes do Produto

- **GET** `/products/{product_id}`
- **Resposta (200)**:

  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "float",
    "image_url": "string",
    "stock": "integer",
    "categories": [
      {
        "id": "integer",
        "name": "string"
      }
    ],
    "created_at": "datetime",
    "updated_at": "datetime"
  }
  ```

## Endpoints de Carrinho

### Obter Carrinho

- **GET** `/cart`
- **Requer**: Autenticação
- **Resposta (200)**:

  ```json
  {
    "id": "integer",
    "items": [
      {
        "id": "integer",
        "product": {
          "id": "integer",
          "name": "string",
          "price": "float",
          "image_url": "string"
        },
        "quantity": "integer"
      }
    ],
    "total": "float"
  }
  ```

### Adicionar ao Carrinho

- **POST** `/cart/items`
- **Requer**: Autenticação
- **Payload**:

  ```json
  {
    "product_id": "integer",
    "quantity": "integer"
  }
  ```

- **Resposta (201)**:

  ```json
  {
    "id": "integer",
    "product": {
      "id": "integer",
      "name": "string",
      "price": "float"
    },
    "quantity": "integer"
  }
  ```

## Endpoints de Pedidos

### Criar Pedido

- **POST** `/orders`
- **Requer**: Autenticação
- **Payload**:

  ```json
  {
    "shipping_address": "string",
    "payment_method": "string"
  }
  ```

- **Resposta (201)**:

  ```json
  {
    "id": "integer",
    "total_amount": "float",
    "status": "string",
    "created_at": "datetime",
    "items": [
      {
        "product_name": "string",
        "quantity": "integer",
        "unit_price": "float"
      }
    ]
  }
  ```

### Listar Pedidos

- **GET** `/orders`
- **Requer**: Autenticação
- **Resposta (200)**:

  ```json
  {
    "items": [
      {
        "id": "integer",
        "total_amount": "float",
        "status": "string",
        "created_at": "datetime"
      }
    ],
    "total": "integer"
  }
  ```

### Detalhes do Pedido

- **GET** `/orders/{order_id}`
- **Requer**: Autenticação
- **Resposta (200)**:

  ```json
  {
    "id": "integer",
    "total_amount": "float",
    "status": "string",
    "shipping_address": "string",
    "payment_method": "string",
    "created_at": "datetime",
    "items": [
      {
        "product_name": "string",
        "quantity": "integer",
        "unit_price": "float"
      }
    ]
  }
  ```

## Throttling e Rate Limiting

- Limite de 100 requisições por minuto por IP
- Headers de resposta incluem:
  - `X-RateLimit-Limit`: Total de requisições permitidas
  - `X-RateLimit-Remaining`: Requisições restantes no período atual
  - `X-RateLimit-Reset`: Timestamp de reset do limite
