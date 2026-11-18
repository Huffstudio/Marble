# VEIO · Atelier de Mármores

Site de demonstração de uma marmoraria **fictícia**, feito para apresentar a empresas reais do setor. Textos, números, depoimento e contatos são ilustrativos.

- **Sem etapa de build:** é só abrir o `index.html`. Publicado pelo GitHub Pages (branch `main`, pasta raiz).
- **Texturas de mármore geradas por código** (WebGL, `assets/js/marble.js`): nenhuma foto, nenhum problema de direito de imagem. Cada pedra tem uma "receita" (cores de fundo, veio e acento, densidade e finura dos veios, modo veio / travertino / ônix / brecha).

## Seções
1. **Abertura** — a marca e um veio dourado que se desenha.
2. **Hero** — mármore vivo em tela cheia, com luz que segue o cursor e troca de pedra (Calacatta, Statuario, Nero, Travertino, Ônix).
3. **Manifesto** — título revelado palavra a palavra, veios dourados que se desenham com a rolagem e faixa com o nome das pedras.
4. **Coleção** — três famílias (brancos, beges, escuros/exóticos), cada uma filtra o catálogo.
5. **Bookmatch** — seção fixa: duas chapas se abrem como um livro e o veio se espelha na emenda.
6. **Catálogo** — 17 tipos de mármore com filtro; cada chapa abre uma **ficha técnica** com mármore vivo, troca de acabamento (polido, levigado, escovado, jateado, apicoado) e luz móvel.
7. **Tabela de cores** — espectro do mais claro ao mais escuro e tabela com cores de fundo, veio e acento (clique copia o código), tom e luminosidade, com filtro e ordenação.
8. **Acabamentos**, **Processo** (linha do tempo que se desenha), **números** (odômetro), **Ateliê** e **Orçamento**.

Efeitos de casa: cursor de ponto + anel, botões magnéticos com mola, revelação palavra a palavra, odômetro, linha do tempo na rolagem, barra de progresso e topo que some ao descer.

## Como adaptar para uma empresa real
Tudo fica em **`assets/js/data.js`**:
- `BRAND` — nome, endereço, horário, telefone, e-mail, Instagram.
- `STONES` — pedras do catálogo (nome, origem, família, descrição, dureza, absorção, usos, faixa de preço) e a receita da textura de cada uma.

O nome "VEIO" também aparece em `index.html` (logotipo, título e rodapé).

## Arquivos
- `index.html` — estrutura
- `assets/css/style.css` — visual
- `assets/js/data.js` — marca e catálogo
- `assets/js/marble.js` — gerador de mármore (WebGL)
- `assets/js/main.js` — interações
