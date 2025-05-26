# Plano de Testes

Este documento detalha a estratégia de testes para o projeto E-commerce.

## Objetivos de Qualidade

- Garantir que o sistema funcione conforme especificado nos requisitos
- Identificar e corrigir defeitos precocemente no ciclo de desenvolvimento
- Assegurar que alterações não quebrem funcionalidades existentes
- Validar a performance, segurança e usabilidade do sistema

## Tipos de Testes

### Testes Unitários

**Objetivo**: Testar unidades individuais de código isoladamente.

**Ferramentas**:

- Backend: pytest
- Frontend: Jest e React Testing Library

**Exemplos de testes unitários**:

```python
# Backend - Teste de serviço de usuário
def test_create_user():
    user_data = {"email": "test@example.com", "password": "securepass", "name": "Test User"}
    user = user_service.create_user(user_data)
    assert user.email == "test@example.com"
    assert user.name == "Test User"
    assert user_service.verify_password("securepass", user.password_hash)
```

```typescript
// Frontend - Teste de componente de produto
test('renders product card with correct information', () => {
  const product = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    image_url: '/test.jpg'
  };
  
  render(<ProductCard product={product} />);
  
  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('$99.99')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', '/test.jpg');
});
```

### Testes de Integração

**Objetivo**: Verificar se diferentes partes do sistema funcionam juntas corretamente.

**Ferramentas**:

- Backend: pytest com TestClient do FastAPI
- Frontend: Cypress para integração com backend

**Exemplos de testes de integração**:

```python
# Backend - Teste de API de produtos
def test_create_product_api():
    login_data = {"username": "admin@example.com", "password": "admin"}
    response = client.post("/api/v1/login", json=login_data)
    token = response.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    product_data = {
        "name": "Test Product",
        "description": "This is a test",
        "price": 99.99,
        "stock": 10
    }
    
    response = client.post("/api/v1/products", json=product_data, headers=headers)
    assert response.status_code == 201
    assert response.json()["name"] == "Test Product"
```

```typescript
// Frontend - Teste de integração do carrinho
describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login('user@example.com', 'password');
  });
  
  it('should add product to cart', () => {
    cy.visit('/products/1');
    cy.findByRole('button', { name: /add to cart/i }).click();
    cy.visit('/cart');
    cy.findByText('Test Product').should('exist');
    cy.findByText('$99.99').should('exist');
  });
});
```

### Testes E2E (End-to-End)

**Objetivo**: Testar fluxos completos de usuário em um ambiente similar ao de produção.

**Ferramentas**:

- Cypress para testes E2E

**Cenários chave**:

1. Registro e login de usuário
2. Navegação pelo catálogo de produtos
3. Adição de produtos ao carrinho
4. Processo de checkout completo
5. Visualização de histórico de pedidos

**Exemplo de teste E2E**:

```typescript
describe('Complete Purchase Flow', () => {
  it('should allow user to make a purchase', () => {
    // Registro/Login
    cy.visit('/register');
    cy.fillRegistrationForm('newuser@example.com', 'password123', 'New User');
    
    // Navegação e adição ao carrinho
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.findByRole('button', { name: /add to cart/i }).click();
    
    // Checkout
    cy.visit('/cart');
    cy.findByRole('button', { name: /checkout/i }).click();
    cy.fillShippingForm('123 Test St', 'Test City', '12345');
    cy.selectPaymentMethod('credit_card');
    cy.fillCreditCardForm('4242424242424242', '12/25', '123');
    cy.findByRole('button', { name: /place order/i }).click();
    
    // Confirmação
    cy.url().should('include', '/orders/confirmation');
    cy.findByText(/thank you for your order/i).should('exist');
    
    // Histórico de pedidos
    cy.visit('/account/orders');
    cy.findByText(/pending/i).should('exist');
  });
});
```

### Testes de Performance

**Objetivo**: Verificar se o sistema atende aos requisitos de performance sob diferentes cargas.

**Ferramentas**:

- k6 para testes de carga
- Lighthouse para performance do frontend

**Métricas chave**:

- Tempo de resposta
- Throughput (requisições por segundo)
- Uso de recursos (CPU, memória)
- Tempo de carregamento de página

**Exemplo de teste de carga com k6**:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests must complete within 500ms
  },
};

export default function() {
  const res = http.get('https://api.example.com/products');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

### Testes de Segurança

**Objetivo**: Identificar vulnerabilidades no sistema.

**Ferramentas**:

- OWASP ZAP para análise automatizada
- SonarQube para análise estática

**Áreas de foco**:

- Injeção SQL
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Autenticação e autorização
- Exposição de dados sensíveis

## Automação e CI/CD

Os testes são automatizados no pipeline CI/CD:

1. **Pull Request**:
   - Execução de testes unitários
   - Análise estática de código
   - Verificação de cobertura

2. **Merge para main**:
   - Testes unitários
   - Testes de integração
   - Build e deploy para ambiente de staging

3. **Deploy para Staging**:
   - Testes E2E
   - Testes de performance básicos

4. **Deploy para Produção**:
   - Smoke tests

## Critérios de Aceitação

- Cobertura de testes unitários: mínimo de 80%
- Todos os testes E2E passando
- Performance: 95% das requisições em menos de 500ms
- Sem vulnerabilidades críticas ou altas

## Ambientes de Teste

1. **Local**: Desenvolvimento e testes unitários
2. **CI**: Executado no GitHub Actions
3. **Staging**: Ambiente similar à produção para testes E2E
4. **Produção**: Smoke tests após deploy

## Ferramentas de Relatório

- GitHub Actions para resultados de CI
- Codecov para relatórios de cobertura
- Cypress Dashboard para testes E2E
- Grafana para visualização de métricas de performance
