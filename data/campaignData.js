// Dados estruturados da campanha JOGANDO SUJO — Evento Anual de Outubro • Porto Alegre / ODS 6

window.CampaignData = {
  initialScores: {
    gremio: 45210, // kg jogados por rivais na lixeira da Arena do Grêmio
    inter: 43850,  // kg jogados por rivais na lixeira do Beira-Rio
  },

  howItWorks: [
    {
      step: '01',
      title: 'TIRE DAS RUAS',
      description:
        'Pegue o plástico, a lata e o papel que estão emporcalhando a rua antes que entupam os bueiros e caiam no Guaíba.',
      tag: 'LIMPEZA NA MARRA',
      accent: 'neutral',
      icon: 'Trash2',
    },
    {
      step: '02',
      title: 'ACHE O ESTÁDIO RIVAL',
      description:
        'Encontre nossas lixeiras 3D da Arena e do Beira-Rio espalhadas na Orla, Zona Sul e entorno dos estádios.',
      tag: 'MAPA DE PORTO ALEGRE',
      accent: 'blue',
      icon: 'MapPin',
    },
    {
      step: '03',
      title: 'JOGUE SUJO (E PESE)',
      description:
        'Os sensores IoT pesam o resíduo na hora — cada quilo vira munição para afundar o estádio rival no placar da vergonha.',
      tag: 'BALANÇA IOT + SENSOR',
      accent: 'red',
      icon: 'Scale',
    },
    {
      step: '04',
      title: 'PEGUE O RECIBO E GANHE',
      description:
        'Retire seu comprovante de pesagem na fenda da lixeira e troque o peso despejado por prêmios oficiais aqui no site.',
      tag: 'RECOMPENSAS REAIS',
      accent: 'neutral',
      icon: 'Ticket',
    },
  ],

  calendarMilestones: [
    {
      date: '01 DE OUTUBRO',
      title: 'APITO INICIAL',
      description:
        'Instalação oficial das lixeiras inteligentes 3D (Arena e Beira-Rio) na Orla do Guaíba, Praia de Ipanema e entorno dos estádios. O placar da vergonha zera e a disputa começa.',
      badge: 'ABERTURA',
      accent: 'blue',
    },
    {
      date: '01 A 31 DE OUTUBRO',
      title: '31 DIAS DE JOGO SUJO',
      description:
        'Pesagem contínua via sensores IoT, atualização do placar em tempo real e emissão de recibos para troca imediata por prêmios.',
      badge: 'TEMPORADA ATIVA',
      accent: 'neutral',
    },
    {
      date: 'DIAS DE JOGO',
      title: 'RODADAS DE PESO',
      description:
        'Ações intensificadas nos arredores da Arena e do Beira-Rio antes e depois das partidas para limpar as ruas e lotar o estádio rival.',
      badge: 'EXTRA TIME',
      accent: 'red',
    },
    {
      date: '31 DE OUTUBRO',
      title: 'APITO FINAL E VEREDITO',
      description:
        'Encerramento oficial da coleta à meia-noite, anúncio do Time Mais Sujo do Ano, entrega do troféu produzido com o resíduo coletado e balanço transparente das toneladas encaminhadas à reciclagem.',
      badge: 'ENCERRAMENTO',
      accent: 'dual',
    },
  ],

  locationFilters: [
    { id: 'all', label: 'Todos' },
    { id: '3d', label: 'Lixeiras 3D Interativas' },
    { id: 'stadiums', label: 'Entorno dos Estádios' },
    { id: 'orla', label: 'Orla & Zona Sul' },
  ],

  locations: [
    {
      id: 'orla-trecho-1',
      name: 'Orla do Guaíba — Trecho 1 (Usina do Gasômetro)',
      neighborhood: 'Centro Histórico',
      typeLabel: 'Lixeira Arena & Beira-Rio 3D c/ sensor',
      categories: ['3d', 'orla'],
      distance: '1,4 km',
      status: 'Online / Sensores Ativos',
      todayKg: 1420,
      coords: { x: 34, y: 40 },
      highlight: 'Maior volume de descarte da Orla',
    },
    {
      id: 'ipanema',
      name: 'Praia de Ipanema — Calçadão Revitalizado (Zona Sul)',
      neighborhood: 'Ipanema • Zona Sul',
      typeLabel: 'Lixeira Arena & Beira-Rio 3D c/ sensor',
      categories: ['3d', 'orla'],
      distance: '11,8 km',
      status: 'Online / Sensores Ativos',
      todayKg: 985,
      coords: { x: 46, y: 82 },
      highlight: 'Barreira direta antes das águas da Zona Sul',
    },
    {
      id: 'entorno-arena',
      name: 'Entorno da Arena do Grêmio (Humaitá)',
      neighborhood: 'Humaitá • Zona Norte',
      typeLabel: 'Lixeiras de pesagem rápida',
      categories: ['stadiums'],
      distance: '6,2 km',
      status: 'Online / Sensores Ativos',
      todayKg: 2310,
      coords: { x: 42, y: 16 },
      highlight: 'Ponto quente em dias de jogo do Tricolor',
    },
    {
      id: 'entorno-beira-rio',
      name: 'Entorno do Beira-Rio (Praia de Belas)',
      neighborhood: 'Praia de Belas',
      typeLabel: 'Lixeiras de pesagem rápida',
      categories: ['stadiums'],
      distance: '3,9 km',
      status: 'Online / Sensores Ativos',
      todayKg: 2190,
      coords: { x: 36, y: 58 },
      highlight: 'Ponto quente em dias de jogo do Colorado',
    },
    {
      id: 'parque-marinha',
      name: 'Parque Marinha do Brasil',
      neighborhood: 'Praia de Belas / Orla',
      typeLabel: 'Lixeira Arena & Beira-Rio 3D c/ sensor',
      categories: ['3d', 'orla'],
      distance: '2,8 km',
      status: 'Online / Sensores Ativos',
      todayKg: 1150,
      coords: { x: 41, y: 51 },
      highlight: 'Alta circulação de ciclistas e corredores',
    },
  ],

  rewards: [
    {
      id: 'pin-2kg',
      weight: '2 kg',
      minKg: 2,
      title: 'Broche / Pin Exclusivo',
      description: 'Pin colecionável da campanha forjado com plástico prensado que saiu das ruas direto para o estádio rival.',
      badge: 'NÍVEL ROOKIE',
      icon: 'Sparkles',
      accent: 'blue',
    },
    {
      id: 'medal-5kg',
      weight: '5 kg',
      minKg: 5,
      title: 'Medalha Oficial "Jogando Sujo"',
      description: 'Medalha oficial da competição em polímero e alumínio recuperado para esfregar na cara do adversário.',
      badge: 'NÍVEL TITULAR',
      icon: 'Award',
      accent: 'red',
    },
    {
      id: 'kit-15kg',
      weight: '15 kg',
      minKg: 15,
      title: 'Kit Urbano da Campanha',
      description: 'Copo térmico, ecobag pesada e acessórios produzidos com o material industrial recolhido nos pontos de Porto Alegre.',
      badge: 'NÍVEL CRAQUE',
      icon: 'Gift',
      accent: 'blue',
    },
    {
      id: 'ranking-top',
      weight: 'Ranking Top Torcedores',
      minKg: 25,
      title: 'Sorteio de Camisa e Bola Autografadas',
      description: 'Quem despejar mais peso na lixeira do adversário entra no sorteio oficial de mantos e bolas autografadas.',
      badge: 'ELITE DA RIVALIDADE',
      icon: 'Star',
      accent: 'red',
    },
    {
      id: 'trofeu-clube',
      weight: 'Prêmio dos Clubes',
      minKg: null,
      title: 'Troféu "Time Mais Sujo do Ano"',
      description:
        'Esculpido 100% com o resíduo acumulado da temporada para coroar o clube cuja lixeira engoliu mais lixo.',
      badge: 'TÍTULO ZOEIRO OFICIAL',
      icon: 'Trophy',
      accent: 'dual',
    },
  ],

  sampleReceipts: {
    GUAIBA2026: {
      code: 'GUAIBA2026',
      kg: 6.4,
      targetTeam: 'gremio',
      targetLabel: 'Arena do Grêmio',
      location: 'Orla do Guaíba — Trecho 1 (Usina do Gasômetro)',
      materials: '3,8 kg Plástico PET • 1,9 kg Latas Alumínio • 0,7 kg Papelão',
      timestamp: 'Hoje • 18:24',
    },
    BEIRARIO15: {
      code: 'BEIRARIO15',
      kg: 16.2,
      targetTeam: 'inter',
      targetLabel: 'Estádio Beira-Rio',
      location: 'Praia de Ipanema — Calçadão Revitalizado',
      materials: '10,1 kg Plástico • 4,6 kg Alumínio • 1,5 kg Papel',
      timestamp: 'Hoje • 17:50',
    },
    ARENA03KG: {
      code: 'ARENA03KG',
      kg: 3.1,
      targetTeam: 'gremio',
      targetLabel: 'Arena do Grêmio',
      location: 'Parque Marinha do Brasil',
      materials: '2,0 kg Plástico • 1,1 kg Latas Alumínio',
      timestamp: 'Hoje • 16:12',
    },
  },

  founders: [
    { name: 'Gabriela de Moraes', role: 'Estratégia & Direção' },
    { name: 'Helena Catelli', role: 'Conceito & Narrativa' },
    { name: 'José Pedro Schury', role: 'Operação Urbana & Parcerias' },
    { name: 'Paulo Kreitchmann', role: 'Design & Tecnologia IoT' },
  ],

  partners: [
    { name: 'DMLU', subtitle: 'Limpeza Urbana' },
    { name: 'DMAE', subtitle: 'Água e Esgotos' },
    { name: 'Prefeitura de Porto Alegre', subtitle: 'Apoio Institucional' },
    { name: 'ODS 6', subtitle: 'Água Potável e Saneamento' },
    { name: 'RBS', subtitle: 'Mídia & Comunicação' },
    { name: 'Banrisul', subtitle: 'Parceiro Regional' },
    { name: 'Adidas', subtitle: 'Material Esportivo' },
    { name: 'Zé Delivery', subtitle: 'Logística Reversa' },
    { name: 'Unimed', subtitle: 'Saúde & Bem-Estar' },
    { name: 'Kia', subtitle: 'Mobilidade' },
  ],
};
