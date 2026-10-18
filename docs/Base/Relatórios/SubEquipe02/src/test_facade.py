import unittest
from unittest.mock import patch
import io
import ast
from tela_inicial_facade import TelaInicialFacade
import main

class TestTelaInicial(unittest.TestCase):

    @patch('tela_inicial_facade.ServicoEstatisticas')
    @patch('tela_inicial_facade.ServicoPostagensRecentes')
    @patch('tela_inicial_facade.ServicoPostagensRelevantes')
    @patch('tela_inicial_facade.ServicoPublicidade')
    @patch('tela_inicial_facade.ServicoAutorizacao')
    def test_ct01_cv01_cv02_carregamento_com_sucesso(self, mock_autorizacao, mock_publicidade, mock_relevantes, mock_recentes, mock_estatisticas):
        """
        Testa CT01 (Carregamento com sucesso), CV01 (Orquestração correta) e CV02 (Retorno consolidado).
        """
        # Configurando os mocks dos subsistemas
        mock_relevantes_instance = mock_relevantes.return_value
        mock_relevantes_instance.buscar_relevantes.return_value = [{"id": 1, "titulo": "Teste", "tabcoins": 10, "autor": "a"}]
        
        mock_recentes_instance = mock_recentes.return_value
        mock_recentes_instance.buscar_recentes.return_value = [{"id": 2, "titulo": "Teste Recente", "tabcoins": 1, "autor": "b"}]
        
        mock_estatisticas_instance = mock_estatisticas.return_value
        mock_estatisticas_instance.obter_status_sistema.return_value = {"usuarios_online": 10}

        mock_publicidade_instance = mock_publicidade.return_value
        mock_publicidade_instance.obter_publicidade_aleatoria.return_value = {"id": 1, "titulo": "Promoção", "empresa": "Amazono", "conteudo": "promocao"}

        # Instanciando a Fachada e chamando o método
        facade = TelaInicialFacade()
        resultado = facade.carregar_dados()

        # Verifica CT01: Dicionário com sucesso: True
        self.assertTrue(resultado.get("sucesso"))
        
        # Verifica CV01: Orquestração correta (todos os subsistemas foram chamados internamente)
        mock_relevantes_instance.buscar_relevantes.assert_called_once()
        mock_recentes_instance.buscar_recentes.assert_called_once()
        mock_estatisticas_instance.obter_status_sistema.assert_called_once()
        mock_publicidade_instance.obter_publicidade_aleatoria.assert_called_once()
        
        # O serviço de autorização (filtragem) deve ser chamado duas vezes (para relevantes e recentes)
        mock_autorizacao_instance = mock_autorizacao.return_value
        self.assertEqual(mock_autorizacao_instance.filtragem.call_count, 2)

        # Verifica CV02: Retorno consolidado com as chaves corretas
        dados = resultado.get("dados", {})
        self.assertIn("feed_relevante", dados)
        self.assertIn("feed_recente", dados)
        self.assertIn("informacoes_rodape", dados)
        self.assertIn("publicidade", dados)

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