# 4. Execução

Esta seção registra como executar e verificar a demonstração do padrão criacional GoF **Builder**, aplicado à construção de uma publicação. A execução dos padrões **Factory Method**, **Prototype** e **Singleton** está na [seção 6](/Base/Relatórios/SubEquipe01/execução.md?id=_6-execução-de-factory-method-prototype-e-singleton). O procedimento cobre o cliente `src/index.js` e a suíte `test/PublicacaoBuilder.test.js`, usando os scripts definidos em `package.json`.

A execução é local e didática: constrói um objeto JavaScript em memória e o imprime em JSON. Ela não publica conteúdo no TabNews, não usa autenticação e não acessa banco de dados ou serviços externos.

## 1. Pré-requisitos

São necessários Node.js versão 18 ou superior e npm. A implementação não possui dependências externas; `node:test` e `node:assert/strict` fazem parte do Node.js.

O pacote da SubEquipe 01 fica em `docs/Base/Relatórios/SubEquipe01/`, com esta estrutura:

```text
SubEquipe01/
├── src/
│   ├── Publicacao.js
│   ├── PublicacaoBuilder.js
│   ├── index.js
│   ├── factory-method/
│   ├── prototype/
│   └── singleton/
├── test/
│   ├── PublicacaoBuilder.test.js
│   ├── FactoryMethod.test.js
│   ├── Prototype.test.js
│   └── Singleton.test.js
├── assets/
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

## 6. Execução de Factory Method, Prototype e Singleton

> **Responsável:** [João Pedro S. Maciel](https://github.com/jopesmp)

Esta seção registra a execução dos três padrões que complementam o Builder. Os comandos são executados na mesma pasta (`docs/Base/Relatórios/SubEquipe01/`), com os mesmos pré-requisitos da seção 1 e sem instalar dependências. As saídas abaixo foram obtidas em 19/10/2026, com Node.js `v22.22.0` e npm `10.9.4`.

| Padrão | Comando | Arquivo executado |
|:---|:---|:---|
| Singleton | `npm run start:singleton` | `src/singleton/index.js` |
| Factory Method | `npm run start:factory-method` | `src/factory-method/index.js` |
| Prototype | `npm run start:prototype` | `src/prototype/index.js` |
| Testes dos quatro padrões | `npm test` | `test/*.test.js` |

### 6.1 Singleton

```text
> subequipe01-gof-criacionais-builder@1.0.0 start:singleton
> node src/singleton/index.js

=== Singleton: ConfiguracaoDoForum ===

Instâncias criadas antes do primeiro acesso: 0
Instâncias criadas após dois acessos: 1
As duas referências apontam para o mesmo objeto? true

Parâmetros disponíveis:
- Plataforma: Fórum TabNews (demonstração acadêmica)
- Limite do título: 255 caracteres
- Limite do corpo: 20000 caracteres

Tentativa de criar outra instância com new:
- Erro: ConfiguracaoDoForum é um Singleton: use ConfiguracaoDoForum.obterInstancia().

Tentativa de alterar um parâmetro em tempo de execução:
- Erro: Cannot assign to read only property 'limiteDeCaracteresDoTitulo' of object '#<ConfiguracaoDoForum>'
- Limite do título continua: 255
```

![Saída do comando npm run start:singleton no terminal](assets/execucao-singleton.png ':size=800')

<p align="center">Figura 1: Execução da demonstração do Singleton. Fonte: SubEquipe 01 (2026).</p>

**O que a execução comprova:**

- Antes do primeiro acesso, nenhuma instância existe (`0`). Depois de dois acessos, existe apenas uma (`1`): a criação é preguiçosa e única.
- As duas referências obtidas por `obterInstancia()` são o mesmo objeto (`true`).
- `new ConfiguracaoDoForum()` é recusado com a mensagem que orienta o uso de `obterInstancia()`.
- A tentativa de alterar o limite do título lança `TypeError`, e o valor continua `255`: a instância compartilhada não pode ser modificada por um cliente.

### 6.2 Factory Method

```text
> subequipe01-gof-criacionais-builder@1.0.0 start:factory-method
> node src/factory-method/index.js

=== Factory Method: criação de conteúdos do fórum ===

1. Mesma operação, criadores diferentes:
- Criado por CriadorDeConteudoRaiz: [conteudo-raiz] "Como o Factory Method organiza a criação de conteúdos" por joaopedro (/joaopedro/como-o-factory-method-organiza-a-criacao-de-conteudos)
- Criado por CriadorDeComentario: [comentario] resposta de giovana ao conteúdo como-o-factory-method-organiza-a-criacao-de-conteudos

2. Produtos resultantes:
- ConteudoRaiz: tipo="conteudo-raiz", slug="como-o-factory-method-organiza-a-criacao-de-conteudos"
- Comentario: tipo="comentario", responde a "como-o-factory-method-organiza-a-criacao-de-conteudos"

3. Regras específicas de cada produto:
- CriadorDeConteudoRaiz recusou: O título é obrigatório em um conteúdo raiz.
- CriadorDeComentario recusou: Um comentário precisa indicar o conteúdo que está respondendo.

4. Contagem por criador:
- CriadorDeConteudoRaiz: 1 conteúdo(s)
- CriadorDeComentario: 1 conteúdo(s)
```

![Saída do comando npm run start:factory-method no terminal](assets/execucao-factory-method.png ':size=900')

<p align="center">Figura 2: Execução da demonstração do Factory Method. Fonte: SubEquipe 01 (2026).</p>

**O que a execução comprova:**

- A mesma função cliente, `enviarConteudo()`, produziu um `ConteudoRaiz` e um `Comentario`: o tipo do produto foi decidido pelo criador recebido, não pelo cliente.
- O conteúdo raiz recebeu um slug gerado do título, sem acentos. O comentário referencia esse slug como conteúdo pai.
- Cada produto aplicou sua própria regra: o conteúdo raiz exige título, e o comentário exige conteúdo pai.
- As tentativas recusadas não foram contabilizadas: cada criador registra apenas 1 conteúdo preparado.

### 6.3 Prototype

```text
> subequipe01-gof-criacionais-builder@1.0.0 start:prototype
> node src/prototype/index.js

=== Prototype: modelos de rascunho de publicação ===

1. Modelos registrados: duvida, tutorial

2. Rascunho clonado e preenchido:
- Título: Tutorial: aplicando o padrão Prototype em JavaScript
- Seções: Introdução | Passo a passo | Conclusão | Referências

3. Nova cópia do mesmo modelo (o original não foi alterado):
- Título: Tutorial:
- Seções: Introdução | Passo a passo | Conclusão
- Texto da Introdução: (vazio)
- Rascunho e nova cópia são objetos distintos? true
- Compartilham o array de seções? false

4. Rascunho enviado ao Factory Method como conteúdo raiz:
- [conteudo-raiz] "Tutorial: aplicando o padrão Prototype em JavaScript" por joaopedro (/joaopedro/tutorial-aplicando-o-padrao-prototype-em-javascript)
- Corpo com 260 caracteres e 4 seções

5. Modelo inexistente:
- Erro: Modelo não registrado: pitch.
```

![Saída do comando npm run start:prototype no terminal](assets/execucao-prototype.png ':size=900')

<p align="center">Figura 3: Execução da demonstração do Prototype. Fonte: SubEquipe 01 (2026).</p>

**O que a execução comprova:**

- O rascunho clonado recebeu título, textos e uma seção extra ("Referências").
- Uma nova cópia do mesmo modelo continua com o título sugerido original, três seções e a Introdução vazia: o protótipo não foi alterado.
- As cópias são objetos distintos e não compartilham o array de seções (`false`), o que confirma a cópia profunda.
- O rascunho foi transformado em `ConteudoRaiz` pelo Factory Method, com os limites do Singleton aplicados, o que demonstra a colaboração entre os três padrões.
- Uma chave não registrada (`pitch`) é recusada.

### 6.4 Testes automatizados

O comando `npm test` executa todos os arquivos de `test/`, incluindo os cinco testes do Builder da seção 3. Com os três novos arquivos, a suíte passa a ter **26 testes**. Para exibir o relatório no formato da figura, use `npm test -- --test-reporter=spec`.

```text
> subequipe01-gof-criacionais-builder@1.0.0 test
> node --test --test-reporter=spec

✔ Factory Method: CriadorDeConteudoRaiz produz um ConteudoRaiz (1.286973ms)
✔ Factory Method: CriadorDeComentario produz um Comentario (0.239525ms)
✔ Factory Method: o cliente usa a mesma operação para qualquer criador (1.394126ms)
✔ Factory Method: classes abstratas não podem ser instanciadas (0.41065ms)
✔ Factory Method: prepararConteudo() rejeita método-fábrica que não devolve Conteudo (1.015723ms)
✔ Factory Method: aplica as regras específicas de cada produto (0.157236ms)
✔ Factory Method: usa os limites do Singleton de configuração (0.119382ms)
✔ Factory Method: gera slug sem acentos a partir do título (0.10976ms)
✔ Factory Method: cada criador conta apenas os conteúdos que preparou (0.355975ms)
✔ Prototype: clonar() cria um objeto novo com os mesmos dados (1.835863ms)
✔ Prototype: a cópia é profunda e não compartilha as seções (0.297638ms)
✔ Prototype: o registro devolve cópias, nunca o protótipo registrado (0.258623ms)
✔ Prototype: alterar uma cópia não afeta as cópias seguintes (0.20569ms)
✔ Prototype: o registro rejeita chave desconhecida e objeto que não é Prototipo (0.429251ms)
✔ Prototype: Prototipo é abstrato e o modelo valida seus dados (1.365941ms)
✔ Prototype: montarCorpo() gera o corpo em Markdown a partir das seções (0.196883ms)
✔ constrói uma publicação com dados válidos (2.878948ms)
✔ remove espaços externos e tags repetidas ou vazias (0.233142ms)
✔ rejeita publicação sem título (0.645951ms)
✔ rejeita publicação sem conteúdo (0.267155ms)
✔ rejeita tags que não sejam array (0.228605ms)
✔ Singleton: não cria a instância antes do primeiro acesso (criação preguiçosa) (1.128751ms)
✔ Singleton: acessos sucessivos devolvem a mesma instância (0.175795ms)
✔ Singleton: impede a criação direta com new (0.490095ms)
✔ Singleton: os parâmetros são somente leitura (0.278395ms)
✔ Singleton: obter() devolve parâmetros existentes e rejeita chaves desconhecidas (0.207647ms)
ℹ tests 26
ℹ suites 0
ℹ pass 26
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 362.526783
```

![Resultado do comando npm test no terminal](assets/execucao-testes-criacionais.png ':size=750')

<p align="center">Figura 4: Execução da suíte completa de testes da SubEquipe 01. Fonte: SubEquipe 01 (2026).</p>

Os 26 testes passaram, sem falhas, cancelamentos ou testes ignorados: 9 do Factory Method, 7 do Prototype, 5 do Singleton e os 5 do Builder, que continuam passando após a inclusão dos novos padrões.

### 6.5 Critérios de validação

| Critério | Descrição | Evidência |
|:---|:---|:---|
| CV07 | O Singleton cria uma única instância, de forma preguiçosa, e impede `new` direto. | Figura 1 e testes SG01 a SG03. |
| CV08 | A configuração compartilhada não pode ser alterada pelos clientes. | Figura 1 e teste SG04. |
| CV09 | O cliente do Factory Method cria tipos diferentes de conteúdo sem condicionais de tipo. | Figura 2 e testes FM01 e FM02. |
| CV10 | Cada produto aplica suas regras e respeita os limites da configuração única. | Figura 2 e testes FM05 e FM06. |
| CV11 | O Prototype entrega cópias profundas, sem alterar o modelo registrado. | Figura 3 e testes PT01 a PT03. |
| CV12 | Os três padrões colaboram em um mesmo fluxo. | Etapa 4 da Figura 3. |
| CV13 | A inclusão dos novos padrões não quebrou o Builder. | Figura 4: os 5 testes do Builder continuam aprovados. |

Os identificadores dos testes (SG, FM e PT) correspondem às regras da [Tabela 9.2 da Modelagem](/Base/Relatórios/SubEquipe01/modelagem.md?id=_96-regras-modeladas).

### 6.6 Limitações

As demonstrações seguem o mesmo escopo do Builder: os objetos existem apenas em memória, sem persistência, autenticação ou integração com o TabNews. Os limites de 255 e 20.000 caracteres foram reproduzidos do validador do TabNews, mas não são lidos dele. Os modelos de rascunho do Prototype são uma funcionalidade hipotética, que não existe na plataforma real.

## 7. Limitações da demonstração

A execução apresenta somente o comportamento do Builder e do produto em memória. Não contempla:

- integração com backend, banco de dados ou API do TabNews;
- autenticação, autorização ou identidade real do autor;
- publicação efetiva, moderação, comentários ou cálculo de TabCoins;
- interface gráfica, comunicação de rede ou implantação;
- cobertura automatizada para todas as regras de validação, em especial a ausência de autor.

As limitações definem o escopo acadêmico do exemplo. A saída bem-sucedida não deve ser interpretada como comprovação de uma funcionalidade integrada ao Fórum TabNews.

## 8. Ponto de vista

### Arthur Fernandes

A execução permite observar a construção em etapas que o Builder oferece: os métodos nomeados configuram os dados e `build()` solicita a criação do produto. A saída também torna visíveis duas responsabilidades de `Publicacao`: remover espaços externos e eliminar tags vazias ou duplicadas. Os testes complementam a demonstração ao repetir de forma automatizada os casos válidos e inválidos cobertos pela suíte.

A verificação também evidencia o limite da entrega: construir e serializar a publicação em memória não equivale a publicá-la no sistema real do TabNews. Outra conclusão é que a documentação deve distinguir regras implementadas de regras efetivamente cobertas por testes, como ocorre com a validação do autor.

### João Pedro S. Maciel

A execução deixou visível a diferença entre os três padrões, que no papel parecem próximos. No Factory Method, a mesma chamada produziu objetos de classes diferentes sem nenhum `if` no cliente; a decisão ficou com o criador. No Prototype, o ponto mais importante foi a cópia profunda: uma cópia rasa teria feito o primeiro autor alterar o modelo de todos, e o teste que compara o array de seções evidencia essa diferença. No Singleton, a contagem de instâncias e a tentativa de alteração mostraram que um objeto global só é seguro quando é imutável. Também ficou claro que o cache de módulos do Node.js já resolveria esse caso com menos código.

Por fim, rodar a suíte completa depois de adicionar os padrões confirmou que o Builder continuou funcionando, o que mostra que os padrões puderam ser acrescentados sem modificar o código já existente.

### Giovana Fontes

A análise da execução mostrou como o padrão Builder facilita a criação de uma publicação ao separar a configuração dos dados da construção do objeto final. Os testes também permitem verificar se os campos obrigatórios são respeitados e se as tags são tratadas corretamente, tornando o comportamento mais previsível. Além disso, observar os outros padrões ajudou a compreender como cada um resolve diferentes necessidades relacionadas à criação de objetos.

Porém, como a demonstração funciona apenas em memória, ela não comprova uma publicação real no TabNews. Por isso, é importante apresentar os resultados junto com suas limitações e deixar claro quais comportamentos foram efetivamente testados.

## 9. Participação e comprobatórios

Esta página registra o procedimento de execução e a verificação da implementação Builder da SubEquipe 01. A implementação é rastreável aos arquivos `src/Publicacao.js`, `src/PublicacaoBuilder.js` e `src/index.js`; os testes estão em `test/PublicacaoBuilder.test.js`. As contribuições individuais e seus comprovantes são consolidados em [Participações (Padrões de Projeto)](/Base/1.2.ParticipacoesPadroesDeProjeto.md), evitando duplicar aqui os registros da equipe.

## 10. Referências

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley, 1994.

NODE.JS. *Test runner*. Disponível em: <https://nodejs.org/api/test.html>. Acesso em: 19 out. 2026.

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. *Padrões de Projeto: soluções reutilizáveis de software orientado a objetos*. Porto Alegre: Bookman, 2000.

## 11. Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---:|:---|
| 1.0 | 08/10/2026 | Elaboração da documentação de execução do padrão Builder. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Organização dos pré-requisitos, procedimentos de execução, cenários de teste, critérios de validação, evidências, participação e referências. |
| 1.1 | 19/10/2026 | Complementação da execução do Builder com resultados observados, cenários de teste e critérios rastreáveis ao código atual. | [Arthur Fernandes](https://github.com/arthurfernandesj) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Registro das versões de Node.js e npm, das saídas reais de `npm start` e `npm test`, da cobertura existente, das limitações e da situação das capturas de tela. |
| 1.2 | 19/10/2026 | Execução de Factory Method, Prototype e Singleton. | [João Pedro S. Maciel](https://github.com/jopesmp) | [Giovana Fontes](https://github.com/GiovanaFontesS) | Inclusão da seção 6, com comandos, saídas reais, capturas do terminal, análise dos resultados e critérios de validação dos três padrões; atualização da estrutura do pacote; inclusão do ponto de vista de João Pedro. |
| 1.2 | 19/10/2026 | Inclusão de Limitações da execusão e ponto de vista. | [Giovana Fontes](https://github.com/GiovanaFontesS) | [João Pedro S. Maciel](https://github.com/jopesmp) | Inclusão das Limitacoes 6.1 da execusão e a inclusão de ponto de vista  |
