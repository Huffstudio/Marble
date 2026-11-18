/* =========================================================================
   DADOS DO SITE — troque aqui para apresentar a uma empresa real.
   Tudo o que é texto da marca, contato e catálogo de pedras mora neste arquivo.
   ========================================================================= */

/* Quem assina o site (aparece na abertura e no rodapé). Preencha url para virar link. */
window.STUDIO = { name: "Huff Studio", url: "" };

window.BRAND = {
  name: "VEIO",
  tagline: "Atelier de Mármores",
  since: 1987,
  city: "São Paulo · SP",
  address: "Alameda das Pedreiras, 1987 — Jardim Europa",
  hours: "Seg a Sex, 8h às 18h · Sáb, 9h às 13h",
  phone: "(11) 0000-0000",
  whatsapp: "(11) 90000-0000",
  email: "contato@veio.exemplo",
  instagram: "@veio.marmores"
};

/*
  Cada pedra tem:
  - dados do catálogo (nome, origem, família, tom, dureza, absorção, usos...)
  - "r" = receita da textura procedural (gerada em WebGL, sem fotos):
      mode  0 veios · 1 travertino · 2 ônix (faixas) · 3 brecha (fragmentos)
      base/base2 = fundo, vein = veio principal, hair = veios finos, acc = acento
      scale = tamanho do desenho, freq = densidade dos veios, sharp = finura,
      warp = quanto o veio serpenteia, veinAmt/hairAmt/accAmt = intensidades,
      angle = direção (rad), seed = variação, spark = cristais que brilham
*/
window.STONES = [
  { id:"branco-carrara", name:"Branco Carrara", origin:"Toscana, Itália", family:"brancos", tone:"Frio",
    desc:"O mármore branco mais conhecido do mundo. Fundo cinza-perolado com veios suaves e esfumados, extraído nos Alpes Apuanos há mais de dois mil anos.",
    mohs:"3", abs:"0,15%", dens:"2.710 kg/m³", uses:["Bancadas","Banheiros","Pisos","Revestimentos"], price:2,
    r:{mode:0, base:"#e7e6e2", base2:"#d3d3d0", vein:"#8a8e94", hair:"#a6a9ad", acc:"#6d7178", scale:1.7, freq:1.25, sharp:9, warp:2.3, veinAmt:.6, hairAmt:.4, accAmt:.15, angle:.5, seed:1.3, spark:0}},
  { id:"carrara-gioia", name:"Carrara Gióia", origin:"Toscana, Itália", family:"brancos", tone:"Frio",
    desc:"Seleção mais branca de Carrara, com veios cinza mais definidos e desenhados. Uma leitura mais nítida e contemporânea do clássico.",
    mohs:"3", abs:"0,14%", dens:"2.700 kg/m³", uses:["Bancadas","Lavabos","Painéis","Mobiliário"], price:3,
    r:{mode:0, base:"#efefec", base2:"#e0e0dd", vein:"#5d626a", hair:"#9a9ea3", acc:"#4a4f56", scale:1.4, freq:.95, sharp:22, warp:2.5, veinAmt:.82, hairAmt:.42, accAmt:.25, angle:-.35, seed:2.7, spark:0}},
  { id:"statuario", name:"Statuario", origin:"Toscana, Itália", family:"brancos", tone:"Neutro",
    desc:"A pedra das esculturas. Branco luminoso atravessado por veios grafite largos e dramáticos. Cada chapa é praticamente uma obra única.",
    mohs:"3", abs:"0,12%", dens:"2.715 kg/m³", uses:["Painéis","Ilhas","Bookmatch","Lareiras"], price:4,
    r:{mode:0, base:"#f4f3ef", base2:"#e7e5e0", vein:"#3c3e43", hair:"#888a8e", acc:"#2a2c30", scale:1.1, freq:.55, sharp:13, warp:3.1, veinAmt:.95, hairAmt:.45, accAmt:.5, angle:.85, seed:4.1, spark:0}},
  { id:"calacatta-oro", name:"Calacatta Oro", origin:"Toscana, Itália", family:"brancos", tone:"Quente",
    desc:"Fundo marfim com veios largos em tons de ouro e cinza-quente. Raro e muito procurado, é a assinatura dos projetos mais sofisticados.",
    mohs:"3", abs:"0,13%", dens:"2.710 kg/m³", uses:["Ilhas","Painéis","Banheiros master","Bookmatch"], price:4,
    r:{mode:0, base:"#f5f1e9", base2:"#e9e1d2", vein:"#8e8273", hair:"#bdb19b", acc:"#b6873b", scale:1.2, freq:.6, sharp:17, warp:2.9, veinAmt:.78, hairAmt:.45, accAmt:.85, angle:.6, seed:6.2, spark:0, halo:.6}},
  { id:"calacatta-viola", name:"Calacatta Viola", origin:"Toscana, Itália", family:"exoticos", tone:"Quente",
    desc:"Branco com veios largos em vinho e ameixa. Ousado, artístico e perfeito para peças de destaque como lavabos e mesas.",
    mohs:"3", abs:"0,16%", dens:"2.700 kg/m³", uses:["Lavabos","Mesas","Painéis","Peças de destaque"], price:4,
    r:{mode:0, base:"#f2eeea", base2:"#e5ddd6", vein:"#6c3741", hair:"#a8848a", acc:"#562730", scale:1.1, freq:1.0, sharp:8, warp:2.5, veinAmt:1, hairAmt:.45, accAmt:.6, angle:-.9, seed:.8, spark:0}},
  { id:"pigues", name:"Piguês", origin:"Thassos, Grécia", family:"brancos", tone:"Neutro",
    desc:"Branco levemente rosado, com veios finos e delicados em cinza-pérola. Discreto, elegante e muito luminoso.",
    mohs:"3,5", abs:"0,10%", dens:"2.720 kg/m³", uses:["Pisos","Banheiros","Escadas","Bancadas"], price:3,
    r:{mode:0, base:"#f6f1ee", base2:"#ebe0dc", vein:"#b6a5a2", hair:"#cbbdba", acc:"#9e8d89", scale:1.8, freq:1.4, sharp:18, warp:2.0, veinAmt:.5, hairAmt:.38, accAmt:.1, angle:.2, seed:9.7, spark:.25}},
  { id:"thassos", name:"Thassos", origin:"Ilha de Thassos, Grécia", family:"brancos", tone:"Frio",
    desc:"O branco mais puro entre os mármores. Cristalino, quase sem veios, reflete a luz com pequenos pontos brilhantes.",
    mohs:"3,5", abs:"0,08%", dens:"2.730 kg/m³", uses:["Pisos","Banheiros","Piscinas","Revestimentos"], price:3,
    r:{mode:0, base:"#f8f8f6", base2:"#eeeeeb", vein:"#d2d2ce", hair:"#dededa", acc:"#cbcbc7", scale:2.0, freq:1.0, sharp:30, warp:1.6, veinAmt:.3, hairAmt:.22, accAmt:0, angle:0, seed:11.2, spark:1}},
  { id:"sivec", name:"Sivec", origin:"Prilep, Macedônia", family:"brancos", tone:"Frio",
    desc:"Branco sólido de granulação fina, com nuvens cinza muito sutis. Uniforme e resistente, ideal para grandes áreas.",
    mohs:"3,5", abs:"0,09%", dens:"2.720 kg/m³", uses:["Pisos","Fachadas internas","Escadas","Revestimentos"], price:3,
    r:{mode:0, base:"#f3f4f4", base2:"#e1e3e4", vein:"#c3c7c9", hair:"#cfd2d4", acc:"#b6babd", scale:1.5, freq:1.1, sharp:7, warp:2.0, veinAmt:.35, hairAmt:.25, accAmt:0, angle:.3, seed:12.9, spark:.5}},
  { id:"travertino-romano", name:"Travertino Romano", origin:"Tivoli, Itália", family:"beges", tone:"Quente",
    desc:"A pedra do Coliseu. Camadas horizontais em bege e areia com poros naturais, que podem ser mantidos abertos ou estucados.",
    mohs:"3", abs:"0,90%", dens:"2.450 kg/m³", uses:["Pisos","Fachadas","Paredes","Mobiliário"], price:2,
    r:{mode:1, base:"#dac8a9", base2:"#c6ae88", vein:"#b39770", hair:"#e8dcc4", acc:"#8c724f", scale:1.4, freq:1, sharp:1, warp:1.5, veinAmt:.8, hairAmt:.3, accAmt:.85, angle:0, seed:14.5, spark:0}},
  { id:"crema-marfil", name:"Crema Marfil", origin:"Alicante, Espanha", family:"beges", tone:"Quente",
    desc:"Bege-creme suave com uma teia de veios finos em caramelo. Acolhedor e atemporal, conversa bem com madeiras e metais.",
    mohs:"3", abs:"0,20%", dens:"2.700 kg/m³", uses:["Pisos","Banheiros","Escadas","Bancadas"], price:2,
    r:{mode:0, base:"#e4d4b9", base2:"#d6c3a2", vein:"#c0a57c", hair:"#c9b08b", acc:"#ad9068", scale:1.7, freq:1.6, sharp:16, warp:2.6, veinAmt:.55, hairAmt:.65, accAmt:.2, angle:-.2, seed:15.8, spark:0}},
  { id:"botticino", name:"Botticino", origin:"Brescia, Itália", family:"beges", tone:"Quente",
    desc:"Bege claro com pequenos fósseis e uma rede de veios finos. Clássico italiano de muita personalidade e grande durabilidade.",
    mohs:"3,5", abs:"0,18%", dens:"2.700 kg/m³", uses:["Pisos","Soleiras","Escadas","Revestimentos"], price:2,
    r:{mode:0, base:"#e6dbc2", base2:"#d7c7a6", vein:"#c6b08a", hair:"#cfba95", acc:"#b29a71", scale:2.0, freq:1.8, sharp:20, warp:2.2, veinAmt:.42, hairAmt:.75, accAmt:.15, angle:.4, seed:17.3, spark:0}},
  { id:"bege-bahia", name:"Bege Bahia", origin:"Bahia, Brasil", family:"beges", tone:"Quente",
    desc:"O mármore bege mais tradicional do Brasil. Fundo areia nebuloso com manchas claras, ótimo custo-benefício para grandes áreas.",
    mohs:"3", abs:"0,30%", dens:"2.680 kg/m³", uses:["Pisos","Áreas externas cobertas","Escadas","Soleiras"], price:1,
    r:{mode:0, base:"#dcc8a2", base2:"#ccb186", vein:"#bc9f71", hair:"#ebdfc8", acc:"#a68858", scale:1.6, freq:1.3, sharp:6, warp:2.8, veinAmt:.35, hairAmt:.55, accAmt:.1, angle:.1, seed:18.6, spark:0}},
  { id:"nero-marquina", name:"Nero Marquina", origin:"Biscaia, Espanha", family:"escuros", tone:"Frio",
    desc:"Preto profundo cortado por veios brancos nítidos. Dramático e gráfico, cria contraste absoluto em qualquer ambiente.",
    mohs:"3", abs:"0,20%", dens:"2.700 kg/m³", uses:["Lavabos","Bancadas","Pisos","Detalhes"], price:3,
    r:{mode:0, base:"#141414", base2:"#1e1e1e", vein:"#e8e5de", hair:"#838381", acc:"#ffffff", scale:1.3, freq:1.0, sharp:44, warp:2.7, veinAmt:1, hairAmt:.55, accAmt:.4, angle:-.7, seed:3.3, spark:0, halo:.12}},
  { id:"marrom-imperador", name:"Marrom Imperador", origin:"Múrcia, Espanha", family:"escuros", tone:"Quente",
    desc:"Marrom-chocolate com fragmentos e uma rede de veios em caramelo claro. Sofisticado e marcante, muito usado em pisos e lareiras.",
    mohs:"3,5", abs:"0,25%", dens:"2.700 kg/m³", uses:["Pisos","Lareiras","Lavabos","Mobiliário"], price:2,
    r:{mode:3, base:"#4a3326", base2:"#6a4a36", vein:"#d7c09d", hair:"#a8886a", acc:"#e9d8bb", scale:1.2, freq:3.0, sharp:1, warp:1.3, veinAmt:.9, hairAmt:.4, accAmt:.3, angle:.3, seed:21.4, spark:0}},
  { id:"verde-guatemala", name:"Verde Guatemala", origin:"Rajasthan, Índia", family:"escuros", tone:"Frio",
    desc:"Verde-floresta profundo com uma trama de veios claros. Exuberante e natural, traz a força da cor para o projeto.",
    mohs:"3,5", abs:"0,20%", dens:"2.800 kg/m³", uses:["Lavabos","Bancadas","Painéis","Mesas"], price:3,
    r:{mode:3, base:"#1c382d", base2:"#2a5142", vein:"#cfdcd3", hair:"#6e9283", acc:"#e6eee9", scale:1.1, freq:2.8, sharp:1, warp:1.5, veinAmt:.72, hairAmt:.6, accAmt:.3, angle:-.4, seed:22.8, spark:0}},
  { id:"onix-mel", name:"Ônix Mel", origin:"Irã", family:"exoticos", tone:"Quente",
    desc:"Pedra translúcida em faixas de mel e âmbar. Com iluminação por trás, a chapa brilha como uma lâmina de luz.",
    mohs:"3", abs:"0,05%", dens:"2.650 kg/m³", uses:["Painéis retroiluminados","Bares","Lavabos","Peças de arte"], price:4,
    r:{mode:2, base:"#efd6a4", base2:"#d5a159", vein:"#fff2d6", hair:"#f6e4bd", acc:"#ffc76b", scale:1.0, freq:2.4, sharp:1, warp:2.6, veinAmt:.5, hairAmt:.3, accAmt:.5, angle:.25, seed:24.2, spark:0}},
  { id:"rosso-levanto", name:"Rosso Levanto", origin:"Ligúria, Itália", family:"exoticos", tone:"Quente",
    desc:"Vermelho-vinho em fragmentos, costurado por veios brancos e verdes. Uma brecha intensa, de presença histórica.",
    mohs:"3,5", abs:"0,22%", dens:"2.750 kg/m³", uses:["Lavabos","Mesas","Lareiras","Detalhes"], price:3,
    r:{mode:3, base:"#6a2b26", base2:"#8c3d33", vein:"#e6d5c9", hair:"#4d7865", acc:"#f2e6dd", scale:1.2, freq:2.6, sharp:1, warp:1.4, veinAmt:.85, hairAmt:.45, accAmt:.3, angle:.1, seed:25.9, spark:0}}
];

window.FAMILIES = {
  brancos:  { name:"Brancos clássicos", short:"Brancos" },
  beges:    { name:"Travertinos & beges", short:"Beges" },
  escuros:  { name:"Escuros", short:"Escuros" },
  exoticos: { name:"Exóticos", short:"Exóticos" }
};
