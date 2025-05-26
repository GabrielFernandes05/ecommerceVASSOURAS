# Guia de Contribuição

Este documento descreve as diretrizes para contribuir com o projeto E-commerce.

## Ambiente de Desenvolvimento

Siga as instruções no [Guia de Instalação](./installation-guide.md) para configurar seu ambiente local.

## Fluxo de Trabalho Git

Utilizamos o modelo de Feature Branch para desenvolvimento:

1. **Fork** (se for contribuidor externo) ou **Clone** (se for membro do time)
2. Crie uma **branch** para sua feature ou correção

   ```bash
   git checkout -b feature/nome-da-feature
   # ou
   git checkout -b fix/nome-do-bug
   ```

3. Faça seus **commits** seguindo as convenções
4. **Teste** suas alterações
5. Envie um **Pull Request** para a branch main

## Convenções de Código

### Geral

- Use inglês para nomes de variáveis, funções, classes e comentários
- Siga os princípios SOLID e DRY
- Escreva testes para suas alterações

### Frontend (Next.js)

- Siga o estilo de código React com TypeScript
- Use componentes funcionais e hooks
- Evite o uso de `any` no TypeScript
- Use as convenções de nomenclatura:
  - Componentes: PascalCase
  - Funções e variáveis: camelCase
  - Constantes: UPPER_SNAKE_CASE

### Backend (FastAPI)

- Siga o estilo PEP 8 para Python
- Use type hints
- Documente funções com docstrings
- Use nomes descritivos para funções e variáveis
- Organize imports: standard library, third-party, local

## Mensagens de Commit

Seguimos o padrão de [Conventional Commits](https://www.conventionalcommits.org/):

```html
<tipo>(<escopo opcional>): <descrição>

[corpo opcional]

[rodapé opcional]
```

Tipos:

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação, ponto-e-vírgula faltando, etc (sem alteração de código)
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Atualizações de tarefas de build, configurações, etc

Exemplo:

```bash
feat(product): add rating system for products

- Add star rating component
- Update product schema to include ratings
- Add API endpoints for submitting ratings
```

## Processo de Pull Request

1. Descreva claramente o propósito do PR
2. Referencie issues relacionadas usando `#numero-da-issue`
3. Inclua capturas de tela para alterações visuais
4. Certifique-se de que todos os testes estão passando
5. Solicite revisão de pelo menos um membro da equipe

## Testes

- Todos os PRs devem incluir testes relevantes
- Testes devem cobrir casos de sucesso e falha
- Execute toda a suite de testes antes de submeter um PR:
  
  Backend:

  ```bash
  cd backend
  poetry run pytest
  ```
  
  Frontend:

  ```bash
  cd frontend
  npm test
  ```

## Recursos Adicionais

- [Guia de Estilo JavaScript do Airbnb](https://github.com/airbnb/javascript)
- [Guia de Estilo Python (PEP 8)](https://www.python.org/dev/peps/pep-0008/)
- [Convenções de TypeScript](https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md)
