from tela_inicial_facade import TelaInicialFacade

def renderizar_tela_inicial():
    facade = TelaInicialFacade()
    
    print("Iniciando o carregamento da Tela Inicial (TabNews)...\n")
    
    resposta = facade.carregar_dados()
    
    if resposta.get("sucesso"):
        dados = resposta["dados"]
        print("=== CONTEÚDO RELEVANTE ===")
        for post in dados["feed_relevante"]:
            print(f"- {post['titulo']} ({post['tabcoins']} tabcoins)")
            
        print("\n=== CONTEÚDO RECENTE ===")
        for post in dados["feed_recente"]:
            print(f"- {post['titulo']} (por {post['autor']})")
            
        print(f"\n[Status: {dados['informacoes_rodape']['usuarios_online']} usuários online agora]")
    else:
        print(resposta.get("erro"))

if __name__ == "__main__":
    renderizar_tela_inicial()