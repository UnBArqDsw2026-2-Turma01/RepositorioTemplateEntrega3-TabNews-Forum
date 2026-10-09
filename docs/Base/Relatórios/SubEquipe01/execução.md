# 4. Execução

## 1. Pré-requisitos

- Node.js 18 ou superior, recomendado;
- terminal aberto na raiz da pasta do projeto;
- nenhuma dependência externa.

Verifique a instalação:

```bash
node --version
npm --version
```

## 2. Executar a demonstração

```bash
node src/index.js
```

A saída esperada é semelhante a:

```json
Publicação construída com sucesso:
{
  "titulo": "Padrões de Projeto GoF",
  "conteudo": "Exemplo didático do padrão Builder aplicado ao Projeto Fórum.",
  "autor": "Autor demonstrativo",
  "tags": [
    "GoF",
    "Arquitetura",
    "JavaScript"
  ]
}
```

A tag duplicada `GoF` é removida pela classe `Publicacao`.

## 3. Executar os testes

```bash
node --test
```

Os testes verificam:
1. construção com dados válidos;
2. remoção de espaços externos e tags repetidas/vazias;
3. rejeição de publicação sem título;
4. rejeição de publicação sem conteúdo;
5. rejeição de tags que não sejam um array.

## 4. Critérios de validação

- o programa termina sem erro para dados válidos;
- os atributos são exibidos corretamente;
- tags repetidas ou vazias são removidas;
- campos obrigatórios ausentes provocam erros;
- todos os testes automatizados terminam com sucesso.

## 5. Evidências de execução

**Inserir aqui capturas reais do terminal**, uma mostrando `node src/index.js` e outra mostrando `node --test`. As saídas acima são exemplos esperados, não evidências de execução já realizada.

| Evidência | Arquivo/captura | Resultado observado |
|---|---|---|
| Execução do programa | A preencher | A preencher após executar |
| Testes automatizados | A preencher | A preencher após executar |
