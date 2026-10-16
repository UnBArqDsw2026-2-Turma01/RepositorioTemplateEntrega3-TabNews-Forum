class ServicoPostagensRelevantes:
    def buscar_relevantes(self):
        # Simula uma busca complexa no banco de dados baseada em tabcoins
        return [
            {"id": 1, "titulo": "O que são Padrões de Projeto?", "tabcoins": 45, "autor": "usuario_a"},
            {"id": 2, "titulo": "Dicas de Python para iniciantes", "tabcoins": 32, "autor": "usuario_b"}
        ]

class ServicoPostagensRecentes:
    def buscar_recentes(self):
        # Simula uma busca ordenando estritamente pela data de criação
        return [
            {"id": 3, "titulo": "Nova atualização do framework", "tabcoins": 1, "autor": "usuario_c"},
           {"id": 3, "titulo": "imagina algo muito improprio aqui", "tabcoins": 100, "autor": "usuario_d"}
        ]
    
class ServicoEstatisticas:
    def obter_status_sistema(self):
        # Simula a leitura do cache ou monitoramento da aplicação
        return {
            "usuarios_online": 142,
            "publicacoes_hoje": 87
        }

class ServicoPublicidade:
    def obter_publicidade_aleatoria(self):
        # Simula a busca por uma quantia de propagandas
        return {"id" : 1, "titulo" : "Promoção", "empresa" : "Amazono", "conteudo" : "promocao do dia 10/10"}
            
        

class ServicoAutorizacao:
    # Filtra postagens e bloqueia conteudos improprios
    def filtragem(self, data):
        for postagem in data:
            print(postagem)
            if "improprio" in postagem['titulo']:
                postagem['titulo'] = "AVISO: Conteudo Filtrado"
                postagem["tabcoins"] = 0
            

class ServicoUsuarios:
    # Simula criação de usuario anonimo assim que o site é acessado
    def criar_anonimo(self):
        return "Anonimo"