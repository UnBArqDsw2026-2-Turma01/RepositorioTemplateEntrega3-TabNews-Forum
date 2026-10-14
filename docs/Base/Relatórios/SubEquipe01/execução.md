# 4. Execução

Esta seção apresenta os procedimentos necessários para executar a demonstração do padrão de projeto GoF Builder aplicado à construção de publicações. São descritos os pré-requisitos, os comandos de execução, os resultados esperados, os testes automatizados e os critérios utilizados para verificar o comportamento da implementação.

A demonstração foi desenvolvida em JavaScript com Node.js e não depende de bibliotecas externas. Seu objetivo é verificar a construção de um objeto `Publicacao`, a validação dos campos obrigatórios e o tratamento das tags.

A implementação possui caráter didático e independente do sistema real do Projeto Fórum, não realizando persistência em banco de dados nem integração com usuários reais.

## 1. Pré-requisitos

Para executar a demonstração, são necessários:

- Node.js versão 18 ou superior;
- terminal aberto na raiz do projeto;
- arquivos da implementação organizados conforme a estrutura definida;
- nenhuma dependência externa para a execução do programa e dos testes.

A estrutura esperada do projeto é:

```text
projeto/
├── src/
│   ├── Publicacao.js
│   ├── PublicacaoBuilder.js
│   └── index.js
├── test/
│   └── PublicacaoBuilder.test.js
└── package.json
```

Para verificar se o Node.js e o npm estão instalados, execute:

```bash
node --version
npm --version
```

O comando `node --version` apresenta a versão instalada do Node.js. O comando `npm --version` verifica a disponibilidade do gerenciador de pacotes npm.

Caso os comandos não sejam reconhecidos, será necessário instalar ou configurar o Node.js antes de continuar.

## 2. Executar a demonstração

Com o terminal aberto na raiz do projeto, execute:

```bash
node src/index.js
```

O programa instancia a classe `PublicacaoBuilder`, configura os atributos da publicação por meio de chamadas encadeadas e executa o método `build()` para criar o objeto final.

Após a construção, o resultado é convertido para JSON e apresentado no terminal.

### 2.1. Resultado esperado

Considerando a implementação apresentada na seção de código, a saída esperada é:

```text
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

A tag `GoF` é informada duas vezes no programa de demonstração. Entretanto, a classe `Publicacao` utiliza `Set` para eliminar valores duplicados, de modo que a tag aparece apenas uma vez no resultado.

**Importante:** essa saída representa o resultado esperado com base no código apresentado. Ela não comprova que a execução já foi realizada. A comprovação deverá ser registrada por meio de uma captura real do terminal.

## 3. Executar os testes automatizados

Os testes automatizados verificam se a implementação apresenta os comportamentos definidos para a construção e a validação das publicações.

Na raiz do projeto, execute:

```bash
node --test
```

O comando utiliza o módulo nativo `node:test` do Node.js para localizar e executar os testes compatíveis com o padrão de descoberta do projeto.

### 3.1. Cenários de teste

Os testes devem verificar os seguintes comportamentos:

| Identificador | Cenário | Resultado esperado |
|---|---|---|
| CT01 | Construção de uma publicação com dados válidos. | O objeto é construído com os atributos informados. |
| CT02 | Informações com espaços externos e tags repetidas ou vazias. | Os espaços externos são removidos e as tags duplicadas ou vazias são eliminadas. |
| CT03 | Construção de uma publicação sem título. | A operação lança um erro de validação. |
| CT04 | Construção de uma publicação sem conteúdo. | A operação lança um erro de validação. |
| CT05 | Construção de uma publicação sem autor. | A operação lança um erro de validação. |
| CT06 | Fornecimento de tags em formato diferente de array. | O método `comTags()` lança um `TypeError`. |

A tabela descreve os comportamentos que devem ser verificados. Para confirmar que todos estão cobertos, é necessário comparar os cenários com o conteúdo real de `test/PublicacaoBuilder.test.js`.

### 3.2. Resultado esperado dos testes

Quando todos os testes estiverem implementados corretamente e forem executados com sucesso, o Node.js deverá indicar que os testes foram aprovados.

O número de testes aprovados e eventuais falhas deverá ser conferido na saída real do terminal.

Não se deve registrar uma quantidade de testes aprovados antes da execução do comando.

## 4. Critérios de validação

A implementação será considerada validada quando os seguintes critérios forem atendidos:

| Critério | Descrição | Verificação |
|---|---|---|
| CV01 | Construção do objeto. | O método `build()` retorna uma instância de `Publicacao` quando os dados são válidos. |
| CV02 | Validação do título. | Um título ausente ou vazio provoca um erro. |
| CV03 | Validação do conteúdo. | Um conteúdo ausente ou vazio provoca um erro. |
| CV04 | Validação do autor. | Um autor ausente ou vazio provoca um erro. |
| CV05 | Tratamento de espaços. | Os espaços externos dos textos são removidos. |
| CV06 | Tratamento das tags. | Tags repetidas ou vazias são eliminadas. |
| CV07 | Validação do formato das tags. | O método `comTags()` rejeita valores que não sejam arrays. |
| CV08 | Saída do programa. | Os atributos da publicação são apresentados em formato JSON. |
| CV09 | Testes automatizados. | Os testes implementados terminam sem falhas. |

Os critérios CV01 a CV09 devem ser verificados com base na implementação e nos resultados obtidos durante a execução.

## 5. Evidências de execução

Esta seção deve reunir evidências que permitam verificar o funcionamento da implementação e a execução dos testes automatizados.

As capturas devem ser produzidas durante a execução real dos comandos, sem substituir resultados obtidos por exemplos ilustrativos.

### 5.1. Execução do programa

Execute:

```bash
node src/index.js
```

Registre uma captura de tela que mostre o comando executado e a saída apresentada no terminal.

**Figura 1 — Execução da demonstração do padrão Builder.**

Inserir aqui a captura real do terminal.

*Fonte: elaboração própria.*

### 5.2. Execução dos testes automatizados

Execute:

```bash
node --test
```

Registre uma captura de tela que mostre o comando executado e o resultado dos testes.

**Figura 2 — Execução dos testes automatizados da implementação Builder.**

Inserir aqui a captura real do terminal.

*Fonte: elaboração própria.*

### 5.3. Registro das evidências

| Evidência | Arquivo ou captura | Resultado observado |
|---|---|---|
| Execução do programa | A preencher após a execução | A preencher conforme a saída real. |
| Testes automatizados | A preencher após a execução | A preencher conforme o resultado real. |
| Validação dos campos obrigatórios | A preencher, caso registrada separadamente | A preencher conforme a verificação realizada. |

As evidências devem ser atualizadas após a execução. Caso sejam armazenadas em uma pasta do repositório, recomenda-se utilizar uma organização semelhante a esta:

```text
evidencias/
├── execucao-programa.png
├── testes-automatizados.png
└── validacao-campos.png
```

Os arquivos são apenas uma sugestão de organização. As capturas devem ser criadas e incluídas efetivamente antes de serem referenciadas como evidências existentes.

## 6. Limitações da demonstração

A demonstração tem como finalidade apresentar o funcionamento do padrão de projeto Builder em um cenário simplificado de construção de publicações.

A implementação não contempla:

- integração com o sistema real do Projeto Fórum;
- autenticação ou gerenciamento de usuários;
- persistência em banco de dados;
- interface gráfica;
- comunicação com serviços externos;
- implantação em ambiente de produção.

Dessa forma, os resultados obtidos demonstram o comportamento da implementação didática, mas não comprovam a integração do padrão com a aplicação real do fórum.

## 7. Pontos de Vista dos Integrantes

Esta seção registra as percepções dos integrantes sobre a execução da demonstração, os procedimentos de verificação e os resultados observados.

### Arthur Fernandes

A etapa de execução permite relacionar a implementação do padrão Builder aos resultados produzidos pelo programa. A verificação dos dados apresentados no terminal ajuda a compreender como os atributos são configurados, como o objeto final é construído e como as regras de validação são aplicadas.

A execução dos testes automatizados também permite verificar se os comportamentos definidos para a publicação são respeitados, especialmente em situações que envolvem campos obrigatórios ausentes, espaços externos e duplicidade de tags.

As observações sobre erros encontrados, correções realizadas e resultados efetivamente obtidos deverão ser complementadas após a execução do programa e dos testes.

## 8. Participação e Evidências

Esta seção registra as atividades relacionadas à documentação dos procedimentos de execução e à organização das evidências de verificação da implementação.

### Arthur Fernandes

**Atividades relacionadas:**

- Organização dos procedimentos necessários para executar a demonstração.
- Documentação dos comandos utilizados para executar o programa e os testes automatizados.
- Definição dos critérios de validação da implementação.
- Organização dos cenários de teste e dos resultados esperados.
- Estruturação da seção destinada às evidências de execução.

**Evidências relacionadas:**

- Arquivo `src/index.js`, responsável pela demonstração.
- Arquivos `src/Publicacao.js` e `src/PublicacaoBuilder.js`, que implementam o produto e o Builder.
- Arquivo `test/PublicacaoBuilder.test.js`, destinado aos testes automatizados.
- Capturas de tela do terminal, após a execução dos comandos.
- Histórico de commits do repositório, quando disponível.

A documentação dos procedimentos não substitui a execução real. As capturas de tela e os resultados devem ser incluídos após a realização das verificações.

## 9. Nível de Contribuição dos Integrantes

O nível de contribuição deve refletir as atividades efetivamente realizadas na elaboração e na verificação da implementação.

| Integrante | Atividades relacionadas | Nível de contribuição | Justificativa |
|---|---|---|---|
| [Arthur Fernandes](https://github.com/arthurfernandesj) | Organização e documentação dos procedimentos de execução, critérios de validação e estrutura das evidências. | 33,33% | A classificação deve considerar as atividades efetivamente realizadas e as evidências disponíveis. |

A classificação deverá ser definida conforme os critérios adotados pela equipe e a participação comprovada nas atividades.

## 10. Referências

GAMMA, Erich et al. *Design Patterns: Elements of Reusable Object-Oriented Software*. Boston: Addison-Wesley, 1994.

NODE.JS. *Node.js Documentation*. Disponível em: <https://nodejs.org/docs/latest/api/>. Acesso em: 08 out. 2026.

## 11. Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---|:---|
| 1.0 | 08/10/2026 | Elaboração da documentação de execução do padrão Builder. | [Arthur Fernandes](https://github.com/arthurfernandesj) | — | Organização dos pré-requisitos, procedimentos de execução, cenários de teste, critérios de validação, evidências, participação e referências. |