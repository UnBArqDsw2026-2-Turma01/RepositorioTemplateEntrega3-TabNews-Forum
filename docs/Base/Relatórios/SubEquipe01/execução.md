# 4. Execução

Esta seção registra como executar e verificar a demonstração do padrão criacional GoF **Builder**, aplicado à construção de uma publicação. O procedimento cobre o cliente `src/index.js` e a suíte `test/PublicacaoBuilder.test.js`, usando os scripts definidos em `package.json`.

A execução é local e didática: constrói um objeto JavaScript em memória e o imprime em JSON. Ela não publica conteúdo no TabNews, não usa autenticação e não acessa banco de dados ou serviços externos.

## 1. Pré-requisitos

São necessários Node.js versão 18 ou superior e npm. A implementação não possui dependências externas; `node:test` e `node:assert/strict` fazem parte do Node.js.

O pacote da SubEquipe 01 fica em `docs/Base/Relatórios/SubEquipe01/`, com esta estrutura:

```text
SubEquipe01/
├── src/
│   ├── Publicacao.js
│   ├── PublicacaoBuilder.js
│   └── index.js
├── test/
│   └── PublicacaoBuilder.test.js
└── package.json
```

Para conferir as ferramentas instaladas:

```bash
node --version
npm --version
```

Na execução registrada nesta página, o ambiente foi Node.js `v22.23.2` e npm `10.9.8`, compatível com o requisito declarado no pacote.

## 2. Executar a demonstração

Abra o terminal na pasta `docs/Base/Relatórios/SubEquipe01/` e execute:

```bash
npm start
```

O script `start` do `package.json` executa `node src/index.js`. O cliente configura título, conteúdo, autor e tags com chamadas encadeadas a `PublicacaoBuilder`, chama `build()` e imprime o produto serializado.

### 2.1. Resultado obtido

A saída abaixo foi observada na execução real de `npm start` em 19/10/2026, com Node.js `v22.23.2` e npm `10.9.8`:

```text
> subequipe01-gof-criacionais-builder@1.0.0 start
> node src/index.js

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

A entrada de tags no programa contém `GoF` duas vezes. A saída apresenta essa tag uma única vez porque o construtor de `Publicacao` remove duplicatas. Os campos de texto aparecem sem espaços externos, e `JSON.stringify()` usa o método `toJSON()` do produto para definir as propriedades apresentadas.

## 3. Executar os testes automatizados

Na mesma pasta, execute:

```bash
npm test
```

O script `test` executa `node --test`, que descobre e executa os testes escritos com as APIs nativas `node:test` e `node:assert/strict`.

### 3.1. Cenários cobertos

O arquivo `test/PublicacaoBuilder.test.js` contém cinco testes:

| Identificador | Cenário | Resultado esperado |
|:---|:---|:---|
| CT01 | Construção com título, conteúdo, autor e tags válidos. | O produto contém os valores informados. |
| CT02 | Textos com espaços externos e tags duplicadas, com espaços ou vazias. | Os valores são normalizados e as tags vazias e repetidas são removidas. |
| CT03 | Construção sem título. | O construtor lança erro informando que o título é obrigatório. |
| CT04 | Construção sem conteúdo. | O construtor lança erro informando que o conteúdo é obrigatório. |
| CT05 | Configuração de tags com valor que não é array. | `comTags()` lança `TypeError`. |

O código também rejeita autor ausente ou em branco, mas não há teste específico para esse cenário na suíte atual. A suíte tampouco testa isoladamente `toJSON()` ou a reutilização do Builder. Esses comportamentos não são contabilizados como cobertos.

### 3.2. Resultado obtido

A execução real de `npm test` em 19/10/2026, no mesmo ambiente Node.js `v22.23.2` e npm `10.9.8`, terminou com o seguinte resumo:

```text
✔ constrói uma publicação com dados válidos
✔ remove espaços externos e tags repetidas ou vazias
✔ rejeita publicação sem título
✔ rejeita publicação sem conteúdo
✔ rejeita tags que não sejam array
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

Os cinco testes passaram e não houve falhas, cancelamentos ou testes ignorados. Esse resultado confirma os cenários CT01 a CT05, não a integração com a aplicação real do Fórum TabNews.

## 4. Critérios de validação

| Critério | Descrição | Evidência/verificação |
|:---|:---|:---|
| CV01 | O cliente constrói uma publicação quando os dados obrigatórios são válidos. | CT01 aprovado e saída JSON produzida por `npm start`. |
| CV02 | Título e conteúdo ausentes são rejeitados. | CT03 e CT04 aprovados. |
| CV03 | Espaços externos e tags vazias ou repetidas são tratados. | Comportamento parcial demonstrado por CT02. |
| CV04 | Tags devem ser configuradas por meio de um array. | CT05 aprovado. |
| CV05 | Os scripts declarados executam a demonstração e a suíte. | `npm start` e `npm test` concluíram com código de saída zero. |
| CV06 | Os resultados registrados correspondem à versão demonstrativa, sem alegação de integração. | Escopo e limitações descritos nesta página. |

## 5. Evidências

As saídas textuais das seções 2.1 e 3.2 foram obtidas por execução dos comandos neste ambiente em 19/10/2026. Não há, entre os arquivos atuais da SubEquipe 01, capturas de tela próprias para esses dois comandos; portanto, elas não são apresentadas como anexos já existentes.

Para completar o registro visual da entrega, execute `npm start` e `npm test` no terminal e salve capturas reais em `assets/execucao-programa.png` e `assets/execucao-testes.png`. Depois de adicionar os arquivos, substitua as indicações abaixo por imagens Markdown ou HTML que apontem para os caminhos existentes.

| Evidência | Situação | Resultado registrado |
|:---|:---|:---|
| Execução do programa | Saída textual incluída na seção 2.1; captura ainda não adicionada. | Publicação impressa em JSON com as tags duplicadas reduzidas a uma ocorrência. |
| Testes automatizados | Saída textual incluída na seção 3.2; captura ainda não adicionada. | 5 testes aprovados, 0 falhas. |

## 6. Limitações da demonstração

A execução apresenta somente o comportamento do Builder e do produto em memória. Não contempla:

- integração com backend, banco de dados ou API do TabNews;
- autenticação, autorização ou identidade real do autor;
- publicação efetiva, moderação, comentários ou cálculo de TabCoins;
- interface gráfica, comunicação de rede ou implantação;
- cobertura automatizada para todas as regras de validação, em especial a ausência de autor.

As limitações definem o escopo acadêmico do exemplo. A saída bem-sucedida não deve ser interpretada como comprovação de uma funcionalidade integrada ao Fórum TabNews.

## 7. Ponto de vista

### Arthur Fernandes

A execução permite observar a construção em etapas que o Builder oferece: os métodos nomeados configuram os dados e `build()` solicita a criação do produto. A saída também torna visíveis duas responsabilidades de `Publicacao`: remover espaços externos e eliminar tags vazias ou duplicadas. Os testes complementam a demonstração ao repetir de forma automatizada os casos válidos e inválidos cobertos pela suíte.

A verificação também evidencia o limite da entrega: construir e serializar a publicação em memória não equivale a publicá-la no sistema real do TabNews. Outra conclusão é que a documentação deve distinguir regras implementadas de regras efetivamente cobertas por testes, como ocorre com a validação do autor.

## 8. Participação e comprobatórios

Esta página registra o procedimento de execução e a verificação da implementação Builder da SubEquipe 01. A implementação é rastreável aos arquivos `src/Publicacao.js`, `src/PublicacaoBuilder.js` e `src/index.js`; os testes estão em `test/PublicacaoBuilder.test.js`. As contribuições individuais e seus comprovantes são consolidados em [Participações (Padrões de Projeto)](/Base/1.2.ParticipacoesPadroesDeProjeto.md), evitando duplicar aqui os registros da equipe.

## 9. Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley, 1994.

NODE.JS. *Test runner*. Disponível em: <https://nodejs.org/api/test.html>. Acesso em: 19 out. 2026.

## 10. Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---:|:---|
| 1.0 | 08/10/2026 | Elaboração da documentação de execução do padrão Builder. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Organização dos pré-requisitos, procedimentos de execução, cenários de teste, critérios de validação, evidências, participação e referências. |
| 1.1 | 19/10/2026 | Complementação da execução do Builder com resultados observados, cenários de teste e critérios rastreáveis ao código atual. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Registro das versões de Node.js e npm, das saídas reais de `npm start` e `npm test`, da cobertura existente, das limitações e da situação das capturas de tela. |