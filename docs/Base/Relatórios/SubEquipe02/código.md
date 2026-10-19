# 3. Código

Esta seção apresenta a implementação do padrão de projeto GoF Facade (*Fachada*), utilizado para simplificar o acesso a diferentes subsistemas por meio de uma interface unificada. O exemplo foi desenvolvido em Python, sem dependências externas, com o objetivo de demonstrar a aplicação do padrão no contexto da tela inicial de um fórum inspirado no TabNews.

A implementação é didática e independente do sistema real do Projeto Fórum. Os serviços simulam a obtenção de publicações relevantes, publicações recentes e estatísticas do sistema. Não há integração real com o TabNews, persistência em banco de dados ou comunicação com serviços externos.

## 1. Organização dos arquivos

A estrutura do projeto está organizada da seguinte forma:

```text
src/
├── main.py
├── subsistemas.py
└── tela_inicial_facade.py
```

- **`main.py`:** contém o programa de demonstração, responsável por instanciar a fachada, solicitar os dados e exibir as informações no terminal.
- **`subsistemas.py`:** define os serviços independentes utilizados pela aplicação: `ServicoPostagensRelevantes`, `ServicoPostagensRecentes` e `ServicoEstatisticas`.
- **`tela_inicial_facade.py`:** implementa a classe `TelaInicialFacade`, responsável por coordenar os serviços, consolidar os resultados e tratar exceções durante o carregamento dos dados.

Os três arquivos devem permanecer no mesmo diretório para que os imports relativos aos módulos locais funcionem conforme apresentados.

## 2. Arquivo `subsistemas.py`

O arquivo [subsistemas.py](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe02/src/subsistemas.py) contém os subsistemas utilizados pela fachada. Cada classe representa um serviço com responsabilidade específica, permitindo que suas operações sejam executadas independentemente.

### Classe `ServicoPostagensRelevantes`

A classe disponibiliza o método `buscar_relevantes()`, responsável por retornar uma lista simulada de publicações consideradas relevantes com base na quantidade de tabcoins.

Cada publicação é representada por um dicionário contendo identificador, título, quantidade de tabcoins e autor.

```python
class ServicoPostagensRelevantes:
    def buscar_relevantes(self):
        return [
            {"id": 1, "titulo": "O que são Padrões de Projeto?", "tabcoins": 45, "autor": "usuario_a"},
            {"id": 2, "titulo": "Dicas de Python para iniciantes", "tabcoins": 32, "autor": "usuario_b"}
        ]
```

### Classe `ServicoPostagensRecentes`

A classe disponibiliza o método `buscar_recentes()`, responsável por retornar uma lista simulada de publicações recentes. No exemplo, os dados são definidos diretamente no código, sem consulta a um banco de dados ou ordenação efetiva por data.

```python
class ServicoPostagensRecentes:
    def buscar_recentes(self):
        return [
            {"id": 3, "titulo": "Nova atualização do framework", "tabcoins": 1, "autor": "usuario_c"},
            {"id": 4, "titulo": "imagina algo muito improprio aqui", "tabcoins": 100, "autor": "usuario_d"}
        ]
```

### Classe `ServicoEstatisticas`

A classe disponibiliza o método `obter_status_sistema()`, responsável por retornar um dicionário com informações estatísticas, incluindo a quantidade de usuários online e o número de publicações realizadas no dia.

```python
class ServicoEstatisticas:
    def obter_status_sistema(self):
        return {
            "usuarios_online": 142,
            "publicacoes_hoje": 87
        }
```

### Classe `ServicoPublicidade`

A classe `ServicoPublicidade` representa o serviço responsável por entregar uma mensagem promocional para a tela inicial. O método `obter_publicidade_aleatoria()` simula a escolha de um anúncio ou campanha que será exibida junto ao conteúdo principal do fórum. A estrutura retornada é simples: um dicionário contendo identificador, título, empresa e conteúdo promocional.

```python
class ServicoPublicidade:
    def obter_publicidade_aleatoria(self):
        return {
            "id": 1, "titulo": "Promoção", "empresa": "Amazono", "conteudo": "promoção do dia 10/10"
        }
```

Essa classe é importante no contexto da fachada porque a tela inicial não precisa saber como uma campanha é selecionada ou como o anúncio é montado; basta solicitar a publicidade e receber o retorno já formatado.

### Classe `ServicoAutorizacao`

A classe `ServicoAutorizacao` encapsula a regra de moderação do conteúdo. O método `filtragem(data)` percorre as postagens recebidas e verifica se algum título contém termos inadequados, como `"improprio"`. Quando isso acontece, o título é substituído por uma mensagem segura e os tabcoins da publicação são zerados. Esse mecanismo serve como exemplo de controle de qualidade e segurança do conteúdo exibido ao usuário.

```python
class ServicoAutorizacao:
    def filtragem(self, data):
        for postagem in data:
            if "improprio" in postagem['titulo']:
                postagem['titulo'] = "AVISO: Conteudo Filtrado"
                postagem["tabcoins"] = 0
```

Na prática, esse serviço demonstra como uma regra de negócio específica pode ser isolada em uma classe independente, mantendo a fachada responsável apenas pelo fluxo de carregamento dos dados.

### Classe `ServicoUsuarios`

A classe `ServicoUsuarios` simula a criação de um usuário anônimo quando o visitante acessa a página sem estar autenticado. O método `criar_anonimo()` retorna uma string simples, como `"Anonimo"`, representando um perfil genérico do visitante. Essa funcionalidade complementa a interface da tela inicial, pois o sistema pode exibir um identificador genérico antes de qualquer login do usuário.

```python
class ServicoUsuarios:
    def criar_anonimo(self):
        return "Anonimo"
```

Em um sistema real, essas operações poderiam consultar cache, validar conteúdo, montar campanhas promocionais, autenticar usuários ou criar perfis temporários de visitante. Assim, cada classe atua como um subsistema independente, e a fachada centraliza o acesso a todos esses serviços em uma única interface.

## 3. Classe `TelaInicialFacade`

A classe [TelaInicialFacade](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe02/src/tela_inicial_facade.py), definida em `tela_inicial_facade.py`, constitui o elemento central da implementação do padrão Facade.

Seu construtor instancia os seis serviços necessários para carregar as informações da tela inicial:

- `ServicoPostagensRelevantes`;
- `ServicoPostagensRecentes`;
- `ServicoEstatisticas`;
- `ServicoAutorizacao`;
- `ServicoPublicidade`;
- `ServicoUsuario`.

```python
from subsistemas import ServicoPostagensRelevantes, ServicoUsuarios, ServicoPublicidade, ServicoPostagensRecentes, ServicoEstatisticas, ServicoAutorizacao

class TelaInicialFacade:
    def __init__(self):
        self._servico_relevantes = ServicoPostagensRelevantes()
        self._servico_recentes = ServicoPostagensRecentes()
        self._servico_estatisticas = ServicoEstatisticas()
        self._servico_Autorizacao = ServicoAutorizacao()
        self._servico_Publicidade = ServicoPublicidade()
        self._servico_Usuario = ServicoUsuarios()
```

O método `carregar_dados()` coordena a execução dos serviços, obtendo as publicações relevantes, as publicações recentes, as estatísticas do sistema e publicidade. Em seguida, filtra as postagens relevantes e recentes em busca de conteúdo impróprio com a função `filtragem(data)` do serviço de autorização. E então consolida os resultados em um único dicionário, organizado em três categorias: `feed_relevante`, `feed_recente`, `informacoes_rodape` e `publicidade`.

Quando a operação é concluída com sucesso, o método retorna uma estrutura contendo a chave `sucesso`, com valor `True`, e a chave `dados`, com os resultados consolidados.

Caso uma exceção ocorra durante a execução das operações, o método captura o erro e retorna uma estrutura com `sucesso` igual a `False` e uma mensagem descritiva na chave `erro`.

Dessa forma, a fachada oferece uma interface simplificada para o cliente, que não precisa conhecer os detalhes de instanciação e utilização de cada subsistema.

A implementação concreta da fachada pode ser observada no trecho abaixo:

```python
    def carregar_dados(self):
        try:
            relevantes = self._servico_relevantes.buscar_relevantes()
            recentes = self._servico_recentes.buscar_recentes()
            estatisticas = self._servico_estatisticas.obter_status_sistema()
            publicidade = self._servico_Publicidade.obter_publicidade_aleatoria()

            self._servico_Autorizacao.filtragem(relevantes)
            self._servico_Autorizacao.filtragem(recentes)

            return {
                "sucesso": True,
                "dados": {
                    "feed_relevante": relevantes,
                    "feed_recente": recentes,
                    "informacoes_rodape": estatisticas,
                    "publicidade": publicidade
                }
            }
        except Exception as erro:
            return {
                "sucesso": False,
                "erro": f"Falha ao carregar a tela inicial: {str(erro)}"
            }
```

O método `criar_usuario_anonimo()` representa a criação de um visitante temporário quando o usuário ainda não está autenticado. A fachada encapsula essa responsabilidade e delega a criação do perfil anônimo para o subsistema `ServicoUsuarios`, evitando que o cliente tenha que conhecer a implementação interna do mecanismo de identificação.

```python
    def criar_usuario_anonimo(self):
        # assumindo que o usuario não está logado
        try:
            usuario = self._servico_Usuario.criar_anonimo()
            return {
                "sucesso": True,
                "usuario": usuario
            }
        except Exception as erro:
            return {
                "sucesso": False,
                "erro": f"Falha ao criar usuario anonimo: {str(erro)}"
            }
```

Esse método procura manter um padrão de retorno consistente: ao sucesso, retorna `sucesso: True` e o nome do usuário; em caso de falha, retorna `sucesso: False` com a mensagem de erro. Dessa forma, o cliente pode solicitar esse comportamento sem precisar lidar diretamente com a criação da instância do serviço ou com detalhes específicos de autenticação e sessão.

Nesse exemplo, a fachada centraliza a criação dos serviços, a execução das consultas e a normalização dos dados em um único retorno. A lógica de filtragem, de montagem do payload e da criação do usuário anônimo são ocultadas do cliente, que apenas solicita `carregar_dados()` e `criar_usuario_anonimo()` e recebe uma resposta em formato padronizado. Essa estrutura reduz a complexidade do código consumidor e garante que futuras mudanças em um subsistema não exijam ajustes em toda a interface do usuário.

## 4. Programa de demonstração

O arquivo [main.py](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/blob/main/docs/Base/Relat%C3%B3rios/SubEquipe02/src/main.py) apresenta uma execução didática da fachada para a tela inicial de um fórum. Ele simula o consumo do serviço de dados e a apresentação visual das informações em terminal.

### 4.1 Função `renderizar_tela_inicial()`

A função principal do programa é responsável por:

1. instanciar `TelaInicialFacade`;
2. executar `carregar_dados()`;
3. criar o usuário anônimo por meio de `criar_usuario_anonimo()`;
4. verificar o sucesso da operação;
5. exibir os dados formatados para o usuário final.

```python
from tela_inicial_facade import TelaInicialFacade

def renderizar_tela_inicial():
    facade = TelaInicialFacade()
    
    print("Iniciando o carregamento da Tela Inicial (TabNews)...\n")
    
    resposta = facade.carregar_dados()
    usuario = facade.criar_usuario_anonimo()

    if usuario.get("sucesso") == False:
        print(usuario.get("erro"))
        return

    if resposta.get("sucesso"):
        print(f"-Logado como usuário {usuario.get("usuario")}-\n")

        dados = resposta["dados"]
        print("=== PUBLICIDADE ===")
        publicidade = dados["publicidade"]
        print(f"- {publicidade["empresa"]}:\n    {publicidade["conteudo"]}")
        
        print("\n=== CONTEÚDO RELEVANTE ===")
        for post in dados["feed_relevante"]:
            print(f"- {post['titulo']} ({post['tabcoins']} tabcoins)")
            
        print("\n=== CONTEÚDO RECENTE ===")
        for post in dados["feed_recente"]:
            print(f"- {post['titulo']} (por {post['autor']})")
            
        print(f"\n[Status: {dados['informacoes_rodape']['usuarios_online']} usuários online agora]")
    else:
        print(resposta.get("erro"))
```

### 4.2 Fluxo de execução

Quando a execução do programa começa, o código cria uma instância de `TelaInicialFacade` e solicita os dados da tela inicial. A fachada retorna um dicionário estruturado contendo:

- `feed_relevante`;
- `feed_recente`;
- `informacoes_rodape`;
- `publicidade`.

Em seguida, o programa também chama `criar_usuario_anonimo()`, que simula a navegação do visitante sem login. Caso essa operação falhe, a execução é interrompida e a mensagem de erro é exibida. Se tudo ocorrer corretamente, os dados são impressos no terminal em um formato simples e legível.

### 4.3 Saída esperada

Para facilitar a compreensão, a execução produz uma saída no seguinte formato:

```text
Iniciando o carregamento da Tela Inicial (TabNews)...

=== PUBLICIDADE ===
- Amazono:
    promoção do dia 10/10

=== CONTEÚDO RELEVANTE ===
- O que são Padrões de Projeto? (45 tabcoins)
- Dicas de Python para iniciantes (32 tabcoins)

=== CONTEÚDO RECENTE ===
- AVISO: Conteudo Filtrado (por usuario_d)
- Nova atualização do framework (por usuario_c)

[Status: 142 usuários online agora]
```

Essa saída confirma que a fachada conseguiu centralizar a busca e a consolidação dos dados, abstraindo as complexidades internas dos subsistemas. O programa cliente apenas chama a fachada e exibe o resultado em uma interface de terminal.

O bloco `if __name__ == "__main__":` garante que a função de demonstração seja chamada quando o arquivo `main.py` for executado diretamente.

## 5. Testes automatizados

A implementação foi complementada por uma suíte automatizada em `src/test_facade.py`, utilizando a biblioteca padrão `unittest` do Python. Essa estrutura permite verificar, de forma reproduzível, o comportamento esperado da fachada e dos serviços que ela orquestra.

Embora o projeto seja didático e não dependa de frameworks externos, os testes cobrem os principais cenários de uso da aplicação: carregamento bem-sucedido, tratamento de exceções, criação de usuário anônimo, desacoplamento do cliente e saída formatada no terminal.

### 5.1 Objetivo da suíte

A suíte de testes foi criada para validar que:

- `carregar_dados()` executa corretamente quando todos os subsistemas respondem normalmente;
- a fachada consolida os dados em um único payload, com as chaves esperadas;
- erros internos dos subsistemas são capturados e convertidos em resposta útil;
- `criar_usuario_anonimo()` retorna um usuário genérico com sucesso;
- o código do cliente não depende diretamente dos subsistemas;
- a renderização em terminal apresenta as informações em formato legível.

### 5.2 Casos cobertos

A classe `TestTelaInicial` contém testes automatizados para cada cenário relevante:

- `test_ct01_cv01_cv02_carregamento_com_sucesso`: valida que a fachada orquestra os serviços corretamente e retorna o dicionário consolidado.
- `test_ct02_cv03_falha_em_subsistema`: simula uma exceção em um subsistema e confirma que a fachada devolve `sucesso: False` e a mensagem de erro.
- `test_ct04_criacao_usuario_anonimo`: verifica a criação de um usuário visitante sem autenticação.
- `test_ct03_cv04_desacoplamento_e_independencia`: analisa o arquivo `main.py` para garantir que ele não importa diretamente `subsistemas.py`.
- `test_cv05_saida_formatada_terminal`: captura a saída do terminal e valida se os textos esperados foram impressos corretamente.

Esses testes ajudam a demonstrar que o padrão Facade não apenas simplifica a interface, mas também favorece a manutenção e a confiabilidade da aplicação.

### 5.3 Exemplo de teste de sucesso

```python
@patch('tela_inicial_facade.ServicoEstatisticas')
@patch('tela_inicial_facade.ServicoPostagensRecentes')
@patch('tela_inicial_facade.ServicoPostagensRelevantes')
@patch('tela_inicial_facade.ServicoPublicidade')
@patch('tela_inicial_facade.ServicoAutorizacao')
def test_ct01_cv01_cv02_carregamento_com_sucesso(
    self, mock_autorizacao, mock_publicidade, mock_relevantes, mock_recentes, mock_estatisticas
):
    mock_relevantes_instance = mock_relevantes.return_value
    mock_relevantes_instance.buscar_relevantes.return_value = [{
        "id": 1, "titulo": "Teste", "tabcoins": 10, "autor": "a"
    }]

    mock_recentes_instance = mock_recentes.return_value
    mock_recentes_instance.buscar_recentes.return_value = [{
        "id": 2, "titulo": "Teste Recente", "tabcoins": 1, "autor": "b"
    }]

    mock_estatisticas_instance = mock_estatisticas.return_value
    mock_estatisticas_instance.obter_status_sistema.return_value = {"usuarios_online": 10}

    facade = TelaInicialFacade()
    resultado = facade.carregar_dados()

    self.assertTrue(resultado.get("sucesso"))
    self.assertIn("feed_relevante", resultado["dados"])
    self.assertIn("feed_recente", resultado["dados"])
    self.assertIn("informacoes_rodape", resultado["dados"])
    self.assertIn("publicidade", resultado["dados"])
```

Esse trecho mostra a lógica principal da validação: os subsistemas são simulados com `mock`, e a fachada é testada como se fosse o cliente real. Esse procedimento é uma prática comum em testes unitários, pois permite verificar a integração sem depender de serviços reais ou de banco de dados.

### 5.4 Exemplo de teste de falha

```python
@patch('tela_inicial_facade.ServicoPostagensRelevantes')
def test_ct02_cv03_falha_em_subsistema(self, mock_relevantes):
    mock_relevantes_instance = mock_relevantes.return_value
    mock_relevantes_instance.buscar_relevantes.side_effect = Exception("Erro de conexão ao Banco de Dados")

    facade = TelaInicialFacade()
    resultado = facade.carregar_dados()

    self.assertFalse(resultado.get("sucesso"))
    self.assertIn("Falha ao carregar a tela inicial", resultado.get("erro"))
```

Esse teste confirma que a fachada não deixa a exceção escapar para o código cliente. Em vez disso, a aplicação trata o erro de forma controlada e devolve uma resposta padronizada, evitanto falhas inesperadas e aumentando a robustez do sistema.

### 5.5 Como executar os testes

Para executar a suíte, basta abrir um terminal no diretório que contém os arquivos da implementação e rodar:

```bash
python3 -m unittest test_facade.py
```

Se a execução estiver dentro da pasta `src`, o comando pode ser simplificado para:

```bash
python3 -m unittest test_facade.py
```

A presença desses testes reforça a ideia de que a fachada foi desenvolvida não apenas como exemplo conceitual, mas como solução com comportamento verificável e passível de validação automatizada.

Os arquivos fornecidos não incluem uma suíte de testes automatizados. Portanto, a implementação apresentada demonstra o funcionamento do padrão Facade, mas não comprova, por si só, a execução de testes automatizados.

Como verificação inicial, é possível executar o programa e conferir se as informações esperadas são exibidas no terminal.

Para ampliar a cobertura de testes, recomenda-se verificar:

- Se `carregar_dados()` retorna `sucesso` igual a `True` quando todos os serviços funcionam corretamente.
- Se os dados consolidados contêm as chaves `feed_relevante`, `feed_recente` e `informacoes_rodape`.
- Se a fachada trata adequadamente exceções lançadas pelos serviços.
- Se a função de demonstração exibe as informações retornadas pela fachada.

Esses testes podem ser implementados com a biblioteca padrão `unittest`, sem a necessidade de instalar dependências externas. Sua realização e seus resultados devem ser registrados antes de serem apresentados como evidências da entrega.

```python
    @patch('tela_inicial_facade.ServicoPostagensRelevantes')
    def test_ct02_cv03_falha_em_subsistema(self, mock_relevantes):
        """
        Testa CT02 (Falha num dos subsistemas) e CV03 (Tratamento de exceções).
        """
        # Simulando uma exceção durante a busca
        mock_relevantes_instance = mock_relevantes.return_value
        mock_relevantes_instance.buscar_relevantes.side_effect = Exception("Erro de conexão ao Banco de Dados")

        facade = TelaInicialFacade()
        resultado = facade.carregar_dados()

        # Verifica CT02 e CV03: A Fachada captura a exceção, retorna sucesso: False e a mensagem de erro
        self.assertFalse(resultado.get("sucesso"))
        self.assertIn("Falha ao carregar a tela inicial", resultado.get("erro"))
        self.assertIn("Erro de conexão ao Banco de Dados", resultado.get("erro"))

    @patch('tela_inicial_facade.ServicoUsuarios')
    def test_ct04_criacao_usuario_anonimo(self, mock_usuarios):
        """
        Testa a orquestração da criação de um usuário anônimo.
        """
        mock_usuarios_instance = mock_usuarios.return_value
        mock_usuarios_instance.criar_anonimo.return_value = "Anonimo"

        facade = TelaInicialFacade()
        resultado = facade.criar_usuario_anonimo()

        # Verifica se o retorno de sucesso e o valor estão corretos
        self.assertTrue(resultado.get("sucesso"))
        self.assertEqual(resultado.get("usuario"), "Anonimo")
        mock_usuarios_instance.criar_anonimo.assert_called_once()

    def test_ct03_cv04_desacoplamento_e_independencia(self):
        """
        Testa CT03 (Independência do cliente) e CV04 (Desacoplamento do arquivo main.py).
        Lê o arquivo main.py estaticamente para garantir que a classe de subsistemas não foi importada.
        """
        try:
            with open("main.py", "r", encoding="utf-8") as f:
                codigo_main = f.read()
        except FileNotFoundError:
            self.fail("Arquivo main.py não encontrado.")

        # Analisando a árvore de sintaxe abstrata (AST) do arquivo main.py
        arvore = ast.parse(codigo_main)
        importou_subsistemas = False
        
        for no in ast.walk(arvore):
            if isinstance(no, ast.Import):
                for alias in no.names:
                    if 'subsistemas' in alias.name:
                        importou_subsistemas = True
            elif isinstance(no, ast.ImportFrom):
                if no.module and 'subsistemas' in no.module:
                    importou_subsistemas = True

        # Verifica CV04: O cliente main.py não importa nada de subsistemas.py
        self.assertFalse(importou_subsistemas, "O arquivo main.py não deve importar diretamente de 'subsistemas.py'")

    @patch('sys.stdout', new_callable=io.StringIO)
    def test_cv05_saida_formatada_terminal(self, mock_stdout):
        """
        Testa CV05 (Saída do programa impressa e formatada corretamente).
        Captura o 'print' do terminal ao rodar renderizar_tela_inicial().
        """
        # Executa a função principal que imprime no terminal
        main.renderizar_tela_inicial()
        saida_terminal = mock_stdout.getvalue()

        # Verifica CV05: Checa se os cabeçalhos esperados e as formatações foram impressos no terminal
        self.assertIn("Iniciando o carregamento da Tela Inicial", saida_terminal)
        self.assertIn("-Logado como usuário Anonimo-", saida_terminal)
        self.assertIn("=== PUBLICIDADE ===", saida_terminal)
        self.assertIn("=== CONTEÚDO RELEVANTE ===", saida_terminal)
        self.assertIn("=== CONTEÚDO RECENTE ===", saida_terminal)
        self.assertIn("[Status:", saida_terminal)
        self.assertIn("usuários online agora]", saida_terminal)

if __name__ == '__main__':
    unittest.main()
```

Para ampliar a cobertura de testes, recomenda-se verificar:

- Se `carregar_dados()` retorna `sucesso` igual a `True` quando todos os serviços funcionam corretamente.
- Se os dados consolidados contêm as chaves `feed_relevante`, `feed_recente` e `informacoes_rodape`.
- Se a fachada trata adequadamente exceções lançadas pelos serviços.
- Se a função de demonstração exibe as informações retornadas pela fachada.

Esses testes podem ser implementados com a biblioteca padrão `unittest`, sem a necessidade de instalar dependências externas. Sua realização e seus resultados devem ser registrados antes de serem apresentados como evidências da entrega.

## 6. Configuração do projeto

A implementação utiliza Python 3 e recursos da biblioteca padrão da linguagem. Não são necessárias bibliotecas externas para executar o exemplo.

Para verificar a instalação do interpretador, execute:

```bash
python3 --version
```

## 7. Execução do programa

Para executar o exemplo, é necessário abrir um terminal no diretório que contém os arquivos `main.py`, `subsistemas.py` e `tela_inicial_facade.py`.

Execute o seguinte comando:

```bash
python3 src/main.py
```

Considerando os dados fixos definidos em `subsistemas.py`, a saída esperada é:

```text
Iniciando o carregamento da Tela Inicial (TabNews)...

=== CONTEÚDO RELEVANTE ===
- O que são Padrões de Projeto? (45 tabcoins)
- Dicas de Python para iniciantes (32 tabcoins)

=== CONTEÚDO RECENTE ===
- Nova atualização do framework (por usuario_c)

[Status: 142 usuários online agora]
```

A saída é determinística porque os serviços retornam dados definidos diretamente no código.

A execução deve ser registrada com evidências reais, como capturas de tela do terminal, mostrando o resultado do programa. 

## 8. Considerações sobre a implementação

A implementação evidencia a finalidade do padrão Facade ao disponibilizar uma interface única para acessar funcionalidades distribuídas entre diferentes subsistemas.

Sem a utilização da fachada, o código cliente teria que criar instâncias dos três serviços, executar seus métodos separadamente e reunir os dados retornados. Ao utilizar a classe TelaInicialFacade, essas responsabilidades são concentradas no método carregar_dados(), tornando o código cliente mais simples e diminuindo sua dependência dos detalhes de funcionamento dos serviços internos.

Dessa forma, a implementação destaca benefícios como a diminuição do acoplamento entre o cliente e os subsistemas, a centralização das operações de carregamento e a consolidação dos resultados em uma única estrutura de dados.

A implementação também apresenta limitações didáticas. Os serviços retornam dados fixos, não há integração com sistemas externos e o tratamento de exceções não registra os detalhes técnicos do erro. Além disso, a estatística `publicacoes_hoje` é retornada pela fachada, mas não é exibida pelo programa de demonstração.

Em uma aplicação real, os serviços poderiam ser integrados a fontes de dados efetivas, enquanto a fachada permaneceria responsável por coordenar as operações necessárias à montagem da tela inicial.

## 9. Pontos de Vista dos Integrantes

### Isaac Menezes Pereira

O padrão Facade oferece uma ótima solução que visa aumentar a organização e diminuir a complexidade do sistema e seus subsistemas. Com o padrão, cada subfuncionalidade sabe onde encontrar suas funções de forma a padronizar suas fontes. Apesar de correr o risco de tornar o Fachada um God Object, é possível manter o sistema organizado com suas devidas funções usando o Fachada. Além disso, a manutenção do código fica simplificada porque as demais alterações afetam apenas o Fachada e não os usuários.

### Pablo Rodrigues Lima

O padrão Facade foi escolhido por considerarmos que ele se encaixa bem na estrutura de uma tela inicial, permitindo centralizar o acesso às funcionalidades dos subsistemas. Ao implementar, tentamos manter o código fiel ao original mas ao mesmo tempo simples e objetivo, evitando adicionar complexidade desnecessária para não desviar o foco do projeto. Durante o projeto percebos o quão prático e eficiente é utilizar este padrão. 

### Pedro Ramos Sousa Reis

Escolhemos o padrão Facade por ele simplificar a comunicação do cliente com os subsistemas, abstraindo a complexidade interna. No contexto da tela inicial do fórum, o Facade garante que o código principal solicite os dados e já receba o payload consolidado. Isso melhora a leitura do código e reduz o acoplamento da interface com os serviços da página. Além disso, a gente consegue padronizar o carregamento num lugar só. O único problema é deixar essa fachada acumulando responsabilidade demais e complicando a manutenção.

## 10. Participação e Evidências

Esta seção registra as atividades relacionadas à implementação e à documentação do padrão Facade. As evidências devem corresponder aos arquivos desenvolvidos e aos resultados efetivamente obtidos.

### Isaac Menezes Pereira

**Atividades desenvolvidas:**

- Organização da implementação do padrão Facade.
- Descrição das responsabilidades dos subsistemas.
- Documentação dos métodos da classe `TelaInicialFacade`.
- Apresentação do programa de demonstração em `main.py`.
- Descrição dos procedimentos para execução do programa.
- Organização das informações técnicas sobre a consolidação dos dados e o tratamento de exceções.

**Evidências relacionadas:**

| Evidência | Descrição |
|---|---|
| `src/subsistemas.py` | Implementação dos serviços de publicações relevantes, publicações recentes e estatísticas do sistema. |
| `src/tela_inicial_facade.py` | Implementação da fachada responsável por coordenar os subsistemas e consolidar os resultados. |
| `src/main.py` | Programa de demonstração do carregamento e da exibição das informações da tela inicial. |
| Capturas de tela do terminal | Evidências da execução do programa e, se aplicável, dos testes automatizados. |
| Histórico de commits | [Histórico de commits](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commits/main/?author=pratamz250). |

As evidências devem ser anexadas ou referenciadas no repositório conforme a organização definida pela equipe. A existência dos arquivos, a execução dos testes e os registros de contribuição devem ser verificados antes da entrega.

### Pablo Rodrigues Lima

**Atividades desenvolvidas:**

- Criação das classes ServicoPublicidade, ServicoUsuarios e ServicoAutorizacao em [subsistemas.py](src\subsistemas.py)
- Implementação das novas classes na classe de fachada [tela_inicial_facade.py](src\tela_inicial_facade.py)
- Adição de alguns detalhes em [main.py](src\main.py) para incorporar as novas classes

**Evidências relacionadas:**

| Evidência | Descrição |
|---|---|
| `src/subsistemas.py` | [Criação dos serviços de autorização, publicações e publicidades.](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/3eb6b9fa3a01a6b2206996c5c0550f84a34a819a) |
| `src/tela_inicial_facade.py` | [Implementação dos serviços de autorização e publicidade.](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/3eb6b9fa3a01a6b2206996c5c0550f84a34a819a) / [Implementação do serviço de usuario anonimo](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/2bf0654c86dbdcce88941a2b2661f6cff465991a) |
| `src/main.py` | [Inplementação de informações referente às classes de publicidade.](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/3eb6b9fa3a01a6b2206996c5c0550f84a34a819a) / [Implementação referente à classe de usuario](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commit/2bf0654c86dbdcce88941a2b2661f6cff465991a) |
| Histórico de commits geral | [Histórico de commits](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commits/main/?author=Pablo-R-L). |

### Pedro Ramos Sousa Reis

**Atividades desenvolvidas:**

- Organização do documento `código.md`.
- Criação do arquivo de testes automatizados.

**Evidências relacionadas:**

| Evidência | Descrição |
|---|---|
| `test_facade.py` | Implementação dos testes automatizados. |
| `código.md` | Organização da documentação. |
| Histórico de commits | [Histórico de commits](https://github.com/UnBArqDsw2026-2-Turma01/RepositorioTemplateEntrega3-TabNews-Forum/commits/main/?author=PedroRSR). |

## 11. Nível de Contribuição dos Integrantes

O nível de contribuição deve considerar as atividades efetivamente realizadas, a complexidade do trabalho desenvolvido e as evidências disponíveis. A classificação deve ser coerente com os critérios adotados pela equipe.

| Integrante | Atividades desenvolvidas | Nível de contribuição | Justificativa |
|---|---|---|---|
| [Isaac Menezes](https://github.com/pratamz250) | Organização e documentação técnica da implementação do padrão Facade. | 33,33% (proposto) | O percentual deve ser confirmado pela equipe com base na participação comprovada na implementação, na documentação e nas demais atividades relacionadas à entrega. |
| [Pedro Ramos](https://github.com/PedroRSR) | Revisão da implementação e documentação do padrão Facade, além da descrição do fluxo de carregamento da tela inicial. | 33,33% | Participação relevante na organização e na explicação da solução, com foco na clareza da implementação e na documentação técnica. |
| [Pablo Rodrigues](https://github.com/Pablo-R-L) | Adição de classes na implementação do padrão facade e ajustes no documento, além da incorporação das novas classes na fachada e no client. | 33,33% | Participação relevante na organização e na resolução do código, com foco na simplicidade e fidelidade da implementação. |

**Observação:** o nível de contribuição deve ser definido de acordo com os critérios acordados pela equipe e com as atividades efetivamente realizadas. A tabela não substitui o registro de evidências.

## 12. Referências

GAMMA, Erich et al. *Design Patterns: Elements of Reusable Object-Oriented Software*. Boston: Addison-Wesley, 1994.

## 13. Histórico de Versões

| Versão | Data | Descrição | Autor(es) | Revisor(es) | Detalhe da Revisão |
|:---:|:---:|:---|:---|:---|:---|
| 1.0 | 15/10/2026 | Documentação da implementação didática do padrão Facade para consolidação dos dados da tela inicial. | [Isaac Menezes](https://github.com/pratamz250) | [Pedro Ramos](https://github.com/PedroRSR) | Organização da documentação técnica, descrição dos subsistemas e da fachada, procedimentos de execução e registro de participação e contribuição. |
| 1.1 | 15/10/2026 | Adição do meu ponto de vista. | [Pedro Ramos](https://github.com/PedroRSR) | [Pablo Rodrigues](https://github.com/Pablo-R-L) | Adição de sua parte sobre a o codigo e pontos de vista referenete ao mesmo | 
| 1.2 | 16/10/2026 | Criação dos testes automatizados e adição de informações na documentação. | [Pedro Ramos](https://github.com/PedroRSR) | [Pablo Rodrigues](https://github.com/Pablo-R-L) | Organização do tópico de teste da implementação da fachada e criação do arquivo [test_facade.py](src/test_facade.py) |
| 1.3 | 17/10/2026 | Adição do meu ponto de vista e participação. | [Pablo Rodrigues](https://github.com/Pablo-R-L) | [Pedro Ramos](https://github.com/PedroRSR) | Adição do ponto de vista e participação de Pablo |
| 1.4 | 18/10/2026 | Atualização dos links dos meus commits. | [Pablo Rodrigues](https://github.com/Pablo-R-L) | [Pedro Ramos](https://github.com/PedroRSR) | Atualização dos links dos commits do Pablo |
| 1.5 | 18/10/2026 | Complementação do topico 8. | [Pablo Rodrigues](https://github.com/Pablo-R-L) | [Pedro Ramos](https://github.com/PedroRSR) | Conteúdo do tópico 8 foi atualizado |
| 1.6 | 19/10/2026 | Complemento de informação e adição do código dos tópicos 2 ao 5. | [Pablo Rodrigues](https://github.com/Pablo-R-L) |  | |