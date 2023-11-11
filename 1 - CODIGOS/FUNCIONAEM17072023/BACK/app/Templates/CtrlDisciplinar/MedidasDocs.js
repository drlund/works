'use strict'

const moment = require('moment');

const _ = require('lodash');

module.exports = {
  Advertencia: ({ gedip }) => {

    let document = {};

    document.headers = {
      header1: `${gedip.funcionario_gedip_prefixo_nome.trim()} - ${moment(Date.now()).format("YYYY")}/${gedip.nm_gedip}`,
      header2: `${gedip.funcionario_gedip_municipio} (${gedip.funcionario_gedip_uf}), ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      header3: `#confidencial`
    }

    const observacoes_gedip = JSON.parse(gedip.observacoes_gedip) || false;

    const par7 = observacoes_gedip ?
      (
        `O ${gedip.nm_comite} identificou a sua participação na seguinte irregularidade: ${observacoes_gedip.descricao_ocorrencia || ''},` +
        ` em descumprimento à(s) IN(s) ${observacoes_gedip.normativos_descumpridos.toString().replace(/\,/, ', ') || ''}, ocorrida na dependência ${observacoes_gedip.dependencia_funci[1]}, ` +
        `prefixo ${observacoes_gedip.dependencia_funci[0]}, motivo que justifica a aplicação da referida solução disciplinar.`
      )
      :
      (
        `A(s) irregularidade(s) que ensejou(ram) a referida sanção disciplinar é(são) aquela(s) relacionada(s) no documento ` +
        ` de Interpelação recebido por V.Sª. no curso da Ação Disciplinar.`
      );

    document.paragraphs = {
      paragraph01: `Funcionário(a) ${gedip.funcionario_gedip} - ${gedip.funcionario_gedip_nome.trim()}`,
      paragraph02: 'Senhor(a) Funcionário(a),',
      paragraph03: `AÇÃO DISCIPLINAR – GEDIP Nº ${gedip.nm_gedip} – `,
      paragraph04: ` O ${gedip.nm_comite} decidiu, em ${moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY")}` +
        ', aplicar-lhe a sanção disciplinar de',
      paragraph05: ' advertência',
      paragraph06: ', conforme IN 383-1.',
      paragraph07: par7,
      paragraph08: 'Para orientar-lhe sobre a adoção de comportamento regular e oportunizar seu reposicionamento, indicamos-lhe que observe as ' +
        'Instruções Normativas relativas à irregularidade praticada, bem como o Código de Ética(IN 382).',
      paragraph09: 'Alertamos-lhe para o fato de que a reincidência poderá acarretar prejuízos à sua carreira, a exemplo de suspensão do trabalho, perda da função e, até mesmo, o rompimento do contrato de trabalho.',
      paragraph10: 'Ressaltamos que indisciplina, insubordinação, desídia, mau procedimento, dentre outros, constituem-se justos motivos para desligamento, na forma do artigo 482 da CLT.',
      paragraph11: 'As informações constantes deste comunicado estão protegidas pelo sigilo profissional (ou outro, como bancário), cuja integridade e preservação ora transferimos para V.Sª. ' +
        'Assim, aquele que tem acesso às informações no âmbito do procedimento disciplinar obriga-se a resguardar o sigilo de modo a preservar a honra das pessoas e a reputação do Banco.',
      paragraph12: 'O prazo para solicitar revisão da sanção é de ',
      paragraph1201: '10 dias úteis',
      paragraph1202: ', contados a partir da ciência neste comunicado e disponibilização das cópias do processo. Para tanto, utilize o modelo “Requerimento de Revisão”, e envie a solicitação para o e-mail: ',
      paragraph1203: 'gepes.gedip.pr@bb.com.br.'
    }

    document.footers = {
      footer1: `${gedip.nome_funci_resp.trim()}`,
      footer2: `${gedip.comissao_funci_resp.trim()}`,
      footer3: `Ciente em  __/__/____`,
      footer4: `${gedip.funcionario_gedip_nome.trim()}`,
    }

    return document;
  },

  Destituicao: ({ gedip }) => {

    let document = {};

    document.headers = {
      header1: `${gedip.funcionario_gedip_prefixo_nome.trim()} - ${moment(Date.now()).format("YYYY")}/${gedip.nm_gedip}`,
      header2: `${gedip.funcionario_gedip_municipio} (${gedip.funcionario_gedip_uf}), ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      header3: `#confidencial`
    }

    const observacoes_gedip = JSON.parse(gedip.observacoes_gedip) || false;;

    const par4 = observacoes_gedip ?
      (
        `O ${gedip.nm_comite} identificou a sua participação na seguinte irregularidade: ${observacoes_gedip.descricao_ocorrencia || ''},` +
        ` em descumprimento à(s) IN(s) ${observacoes_gedip.normativos_descumpridos.toString().replace(/\,/, ', ') || ''}, ocorrida na dependência ${observacoes_gedip.dependencia_funci[1]}, ` +
        `prefixo ${observacoes_gedip.dependencia_funci[0]}, motivo que justifica a aplicação da referida solução disciplinar.`
      )
      :
      (
        `A(s) irregularidade(s) que ensejou(ram) a referida sanção é(são) aquela(s) relacionada(s) no documento ` +
        `de Interpelação recebido por V.Sª no curso da Ação Disciplinar.`
      );

    document.paragraphs = {
      paragraph01: `Funcionário(a) ${gedip.funcionario_gedip} - ${gedip.funcionario_gedip_nome.trim()}`,
      paragraph02: `Senhor(a) Funcionário(a),`,
      paragraph03: `AÇÃO DISCIPLINAR – GEDIP Nº ${gedip.nm_gedip} `,
      paragraph0301: ` – O ${gedip.nm_comite} decidiu, em ${moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY")},` +
        ' aplicar-lhe a sanção disciplinar de ',
      paragraph0302: 'destituição',
      paragraph0303: ', conforme IN 383.',
      paragraph04: par4,
      paragraph05: `Dessa forma, entendeu-se que V.Sª. está motivadamente inapto(a) para o exercício de qualquer função de confiança ou gratificada, e será impedido, por 12 meses, de participar de processo seletivo.`,
      paragraph06: `Para orientar-lhe sobre a adoção de comportamento regular e oportunizar seu reposicionamento, indicamos-lhe que observe as ` +
        `Instruções Normativas relativas à irregularidade praticada, bem como o Código de Ética (IN 382).`,
      paragraph07: `Alertamos-lhe para o fato de que a reincidência poderá acarretar prejuízos ainda maiores à sua carreira, como o rompimento do contrato de trabalho.`,
      paragraph08: `Ressaltamos que indisciplina, insubordinação, desídia, mau procedimento, dentre outros, constituem-se justos motivos para desligamento, na forma do artigo 482 da CLT.`,
      paragraph09: 'As informações constantes deste comunicado estão protegidas pelo sigilo profissional (ou outro, como bancário), cuja integridade e preservação ora transferimos para V.Sª. ' +
        'Assim, aquele que tem acesso às informações no âmbito do procedimento disciplinar obriga-se a resguardar o sigilo de modo a preservar a honra das pessoas e a reputação do Banco.',
      paragraph10: 'O prazo para solicitar revisão da sanção é de ',
      paragraph1001: '10 dias úteis',
      paragraph1002: ', contados a partir da ciência neste comunicado e disponibilização das cópias do processo. Para tanto, utilize o modelo “Requerimento de Revisão”, e envie a solicitação para o e-mail: ',
      paragraph1003: 'gepes.gedip.pr@bb.com.br.'
    }

    // paragraph3 = `<strong>AÇÃO DISCIPLINAR – GEDIP Nº ${gedip.noGedip} </strong>` +
    //     `– O Comitê ${gedip.comite} decidiu, em ${gedip.dataJulgamento},` +
    //     `aplicar-lhe a sanção disciplinar de <strong>suspensão</strong>, por <strong>${gedip.qtdeDiasSuspensao}</strong>` +
    //     `dias consecutivos, conforme IN 383-1.`;

    document.footers = {
      footer1: `${gedip.nome_funci_resp.trim()}`,
      footer2: `${gedip.comissao_funci_resp.trim()}`,
      footer3: `Ciente em  __/__/____`,
      footer4: `${gedip.funcionario_gedip_nome.trim()}`,
    }

    return document;
  },

  Suspensao: ({ gedip }) => {

    let document = {};

    document.headers = {
      header1: `${gedip.funcionario_gedip_prefixo_nome.trim()} - ${moment(Date.now()).format("YYYY")}/${gedip.nm_gedip}`,
      header2: `${gedip.funcionario_gedip_municipio} (${gedip.funcionario_gedip_uf}), ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      header3: `#confidencial`
    }

    const observacoes_gedip = JSON.parse(gedip.observacoes_gedip) || false;;

    const par4 = observacoes_gedip ?
      (
        `O ${gedip.nm_comite} identificou a sua participação na seguinte irregularidade: ${observacoes_gedip.descricao_ocorrencia || ''},` +
        ` em descumprimento à(s) IN(s) ${observacoes_gedip.normativos_descumpridos.toString().replace(/\,/, ', ') || ''}, ocorrida na dependência ${observacoes_gedip.dependencia_funci[1]}, ` +
        `prefixo ${observacoes_gedip.dependencia_funci[0]}, motivo que justifica a aplicação da referida solução disciplinar.`
      )
      :
      (
        `A(s) irregularidade(s) que ensejou(ram) a referida sanção é(são) aquela(s) relacionada(s) no documento ` +
        `de Interpelação recebido por V.Sª no curso da Ação Disciplinar.`
      );

    document.paragraphs = {
      paragraph01: `Funcionário(a) ${gedip.funcionario_gedip} - ${gedip.funcionario_gedip_nome.trim()}`,
      paragraph02: `Senhor(a) Funcionário(a),`,
      paragraph03: `AÇÃO DISCIPLINAR – GEDIP Nº ${gedip.nm_gedip} `,
      paragraph0301: `– O Comitê ${gedip.nm_comite} decidiu, em ${moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY")}, aplicar-lhe a sanção disciplinar de `,
      paragraph0302: 'suspensão',
      paragraph0303: `, por ${gedip.qtde_dias_suspensao} dias consecutivos, conforme IN 383-1.`,
      paragraph04: par4,
      paragraph05: `Para orientar-lhe sobre a adoção de comportamento regular e oportunizar seu reposicionamento, indicamos-lhe que observe as ` +
        `Instruções Normativas relativas à irregularidade praticada, bem como o Código de Ética (IN 382).`,
      paragraph06: `Alertamos-lhe para o fato de que a reincidência poderá acarretar prejuízos à sua carreira, a exemplo de perda da função e, até mesmo, o rompimento do contrato de trabalho.`,
      paragraph07: `Durante a vigência da suspensão, V. Sª. não poderá ingressar no ambiente de trabalho, utilizar celular corporativo, assim ` +
        `como acessar os sistemas informatizados, inclusive por meio remoto. O descumprimento dessa condição será considerado falta grave.`,
      paragraph08: `Ressaltamos que indisciplina, insubordinação, desídia, mau procedimento, dentre outros, constituem-se justos motivos para desligamento, na forma do artigo 482 da CLT.`,
      paragraph09: 'As informações constantes deste comunicado estão protegidas pelo sigilo profissional (ou outro, como bancário), cuja integridade e preservação ora transferimos para V.Sª. ' +
        'Assim, aquele que tem acesso às informações no âmbito do procedimento disciplinar obriga-se a resguardar o sigilo de modo a preservar a honra das pessoas e a reputação do Banco.',
      paragraph10: 'O prazo para solicitar revisão da sanção é de ',
      paragraph1001: '10 dias úteis',
      paragraph1002: ', contados a partir da ciência neste comunicado e disponibilização das cópias do processo. Para tanto, utilize o modelo “Requerimento de Revisão”, e envie a solicitação para o e-mail: ',
      paragraph1003: 'gepes.gedip.pr@bb.com.br.'
    }

    // paragraph3 = `<strong>AÇÃO DISCIPLINAR – GEDIP Nº ${gedip.noGedip} </strong>` +
    //     `– O Comitê ${gedip.comite} decidiu, em ${gedip.dataJulgamento},` +
    //     `aplicar-lhe a sanção disciplinar de <strong>suspensão</strong>, por <strong>${gedip.qtdeDiasSuspensao}</strong>` +
    //     `dias consecutivos, conforme IN 383-1.`;

    document.footers = {
      footer1: `${gedip.nome_funci_resp.trim()}`,
      footer2: `${gedip.comissao_funci_resp.trim()}`,
      footer3: `Ciente em  __/__/____`,
      footer4: `${gedip.funcionario_gedip_nome.trim()}`,
    }

    return document;
  },

  TermoDeCiencia: ({ gedip }) => {

    let document = {};

    document.headers = {
      header1: `${gedip.funcionario_gedip_prefixo_nome.trim()} - ${moment(Date.now()).format("YYYY")}/${gedip.nm_gedip}`,
      header2: `${gedip.funcionario_gedip_municipio} (${gedip.funcionario_gedip_uf}), ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      header3: '#confidencial'
    }

    const observacoes_gedip = JSON.parse(gedip.observacoes_gedip) || false;

    const par4 = gedip.observacoes_gedip && !(_.isNil(observacoes_gedip.normativos_descumpridos)) ?
      (
        `O ${gedip.nm_comite} identificou a sua participação na seguinte irregularidade: ${observacoes_gedip.descricao_ocorrencia || ''},` +
        `em descumprimento à(s) IN(s) ${observacoes_gedip.normativos_descumpridos.toString().replace(/\,/, ', ') || ''}, ocorrida na dependência ${observacoes_gedip.dependencia_funci[1] || ''},` +
        `prefixo ${observacoes_gedip.dependencia_funci[0] || ''}, motivo que justifica a aplicação da referida solução disciplinar.`
      )
      :
      (
        `A(s) irregularidade(s) que ensejou(ram) a referida medida administrativa é(são) aquela(s) relacionada(s) no documento ` +
        `de Interpelação recebido por V.Sª no curso da Ação Disciplinar.`
      );


    document.paragraphs = {
      paragraph01: `Funcionário(a) ${gedip.funcionario_gedip} - ${gedip.funcionario_gedip_nome.trim()}`,
      paragraph02: 'Senhor(a) Funcionário(a),',
      paragraph03: `CONTROLE DISCIPLINAR – GEDIP Nº ${gedip.nm_gedip} – TERMO DE CIÊNCIA EM VIRTUDE DE AÇÃO DISCIPLINAR - `,
      paragraph0301: ` Levamos ao conhecimento de V.Sª, que por decisão do ${gedip.nm_comite} de ${moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY")}, ` +
        'decidiu-se alertá-lo sobre a necessidade de reposicionamento.',
      paragraph04: par4,
      paragraph05: 'Para orientar-lhe sobre a adoção de comportamento regular e oportunizar seu reposicionamento, indicamos-lhe que observe as Instruções ' +
        'Normativas relativas à irregularidade praticada, bem como o Código de Ética (IN 382).',
      paragraph06: 'Alertamos-lhe ainda que o cometimento de qualquer nova irregularidade poderá acarretar prejuízos a sua carreira.',
      paragraph07: 'Declaramos que as informações constantes deste comunicado e seus anexos estão protegidas pelo sigilo profissional (ou outro, como bancário), cuja integridade e preservação ora transferimos para V.Sª.' +
        ' Assim, aquele que tem acesso às informações no âmbito do procedimento disciplinar obriga-se a resguardar o sigilo de modo a preservar a honra das pessoas e a reputação do Banco.',
      paragraph10: 'O prazo para solicitar revisão da sanção é de ',
      paragraph1001: '10 dias úteis',
      paragraph1002: ', contados a partir da ciência neste comunicado e disponibilização das cópias do processo. Para tanto, utilize o modelo “Requerimento de Revisão”, e envie a solicitação para o e-mail: ',
      paragraph1003: 'gepes.gedip.pr@bb.com.br.'
    }

    document.footers = {
      footer1: `${gedip.nome_funci_resp.trim()}`,
      footer2: `${gedip.comissao_funci_resp.trim()}`,
      footer3: `Ciente em  __/__/____`,
      footer4: `${gedip.funcionario_gedip_nome.trim()}`,
    }

    return document;
  },

  RespPecuniariaCiencia: ({ gedip }) => {

    let document = {};

    let observacoes_gedip = JSON.parse(gedip.observacoes_gedip);

    const par8 = [3, 4, 7, 8, 9].includes(parseInt(gedip.comite_gedip)) ?
      (
        `A(s) irregularidade(s) que ensejou(ram) a referida medida administrativa é(são) aquela(s) relacionada(s) no documento ` +
        `de Interpelação recebido por V.Sª no curso da Ação Disciplinar.`
      )
      :
      (
        `O ${gedip.nm_comite} identificou a sua participação na seguinte irregularidade: ${observacoes_gedip.descricao_ocorrencia}, em descumprimento à ` +
        ` IN ${observacoes_gedip.normativos_descumpridos.toString().replace(/\,/, ', ')},` +
        `, ocorrida no prefixo ${observacoes_gedip.dependencia_funci.join(' ')}, motivo que justifica a aplicação da referida solução disciplinar.`
      );

    document.headers = {
      header1: `${gedip.funcionario_gedip_prefixo_nome.trim()} - ${moment(Date.now()).format("YYYY")}/${gedip.nm_gedip}`,
      header2: `${gedip.funcionario_gedip_municipio} (${gedip.funcionario_gedip_uf}), ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      header3: `#confidencial`
    }

    document.paragraphs = {
      paragraph01: `Funcionário(a) ${gedip.funcionario_gedip} - ${gedip.funcionario_gedip_nome.trim()}`,
      paragraph02: `Senhor(a) Funcionário(a),`,
      paragraph03: `CONTROLE DISCIPLINAR – GEDIP Nº ${gedip.nm_gedip + ' '} - TERMO DE CIÊNCIA E RESPONSABILIZAÇÃO PECUNIÁRIA EM VIRTUDE DE AÇÃO DISCIPLINAR.`,
      paragraph04: `Levamos ao conhecimento de V.Sª que após ponderada a relevância de sua participação na(s) irregularidade(s) e o valor do prejuízo financeiro, o ` +
        `- O ${gedip.nm_comite} decidiu em ${moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY")} emitir este `,
      paragraph05: ' Termo de Ciência e Responsabilização Pecuniária.',
      paragraph08: par8,
      paragraph09: 'O Termo de Ciência é uma orientação formal, de caráter educativo, sobre a forma correta de proceder em relação à irregularidade praticada por V.Sª.',
      paragraph10: 'Já a Responsabilização Pecuniária corresponde ao desconto pecuniário proporcional ao valor da perda registrada no sistema Gedip' +
        ` e à remuneração fixa recebida no mês de cometimento da irregularidade. Assim, o valor será de ${(observacoes_gedip.valor_gedip).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })}, ` +
        ` o qual será debitado em sua conta corrente nº ${observacoes_gedip.cC.trim()} junto à agência ${observacoes_gedip.agPref.join(' ')}.`,
      paragraph11: 'Para orientar-lhe sobre a adoção de comportamento regular e oportunizar seu reposicionamento, indicamos-lhe que observe as ' +
        'Instruções Normativas relativas à irregularidade praticada, bem como o Código de Ética (IN 382).',
      paragraph12: 'Alertamos-lhe ainda que o cometimento de qualquer nova irregularidade poderá acarretar prejuízos a sua carreira.',
      paragraph13: 'Declaramos que as informações constantes deste comunicado estão protegidas pelo sigilo profissional (ou outro, como bancário), cuja integridade e preservação ora transferimos para V.Sª.' +
        ' Assim, aquele que tem acesso às informações no âmbito do procedimento disciplinar obriga-se a resguardar o sigilo de modo a preservar a honra das pessoas e a reputação do Banco.',
      paragraph14: 'Faculta-se adiantamento no valor da Responsabilização Pecuniária, com reposição em até 25 parcelas mensais e consecutivas, mediante' +
        ' requerimento formal endereçado à administração de sua dependência. A cobrança do adiantamento tem início na folha de pagamento do mês' +
        ' subsequente e o valor da parcela não pode ser inferior a 10% do respectivo VP.',
      paragraph15: 'O prazo para solicitar recálculo da Responsabilização Pecuniária, quando houver erro no estabelecimento do valor da pecúnia, é de ',
      paragraph1501: '10 dias úteis',
      paragraph1502: ', contados a partir da ciência neste comunicado e disponibilização das cópias do processo. Para tanto, utilize o modelo “Requerimento de Revisão”, e envie a solicitação para o e-mail: ',
      paragraph1503: 'gepes.gedip.pr@bb.com.br.'

    }

    document.footers = {
      footer1: `${gedip.nome_funci_resp.trim()}`,
      footer2: `${gedip.comissao_funci_resp.trim()}`,
      footer3: `Ciente em  __/__/____`,
      footer4: `${gedip.funcionario_gedip_nome.trim()}`,
    }

    return document;
  },

  RespPecuniariaAdvertencia: ({ gedip }) => {

    let document = {};

    let observacoes_gedip = JSON.parse(gedip.observacoes_gedip);

    const par4 = [3, 4, 7, 8, 9].includes(parseInt(gedip.comite_gedip)) ?
      (
        `A(s) irregularidade(s) que ensejou(ram) a referida medida administrativa é(são) aquela(s) relacionada(s) no documento ` +
        `de Interpelação recebido por V.Sª no curso da Ação Disciplinar.`
      )
      :
      (
        `O ${gedip.nm_comite} identificou a sua participação na seguinte irregularidade: ${observacoes_gedip.descricao_ocorrencia}, em descumprimento à ` +
        ` IN ${observacoes_gedip.normativos_descumpridos.toString().replace(/\,/, ', ')},` +
        `, ocorrida no prefixo ${observacoes_gedip.dependencia_funci.join(' ')}, motivo que justifica a aplicação da referida solução disciplinar.`
      );

    document.headers = {
      header1: `${gedip.funcionario_gedip_prefixo_nome.trim()} - ${moment(Date.now()).format("YYYY")}/${gedip.nm_gedip}`,
      header2: `${gedip.funcionario_gedip_municipio} (${gedip.funcionario_gedip_uf}), ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      header3: `#confidencial`
    }

    document.paragraphs = {
      paragraph01: `Senhor(a) `,
      paragraph0102: `${gedip.funcionario_gedip} - ${gedip.funcionario_gedip_nome.trim()},`,
      paragraph02: `AÇÃO DISCIPLINAR – GEDIP Nº ${gedip.nm_gedip + ' '} - ADVERTÊNCIA E RESPONSABILIZAÇÃO PECUNIÁRIA.`,
      paragraph03: `O ${gedip.nm_comite} decidiu em ${moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY")} aplicar-lhe a solução disciplinar de `,
      paragraph0302: 'Advertência e Responsabilização Pecuniária',
      paragraph0303: `, conforme previsto na IN 383.`,
      paragraph04: par4,
      paragraph05: 'A Responsabilização Pecuniária corresponde ao desconto pecuniário proporcional ao valor da perda registrada no sistema Gedip' +
        ` e à remuneração fixa recebida no mês de cometimento da irregularidade. Assim, o valor será de ${(observacoes_gedip.valor_gedip).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })}, ` +
        ` o qual será debitado em sua conta corrente nº ${observacoes_gedip.cC.trim()} junto à agência ${observacoes_gedip.agPref.join(' ')}.`,
      paragraph06: 'Para orientar-lhe sobre a adoção de comportamento regular e oportunizar seu reposicionamento,' +
        ' indicamos que observe as Instruções Normativas relativas à irregularidade praticada, bem como o Código de Ética (IN 382).',
      paragraph07: 'Alertamos que a reincidência poderá acarretar prejuízos à sua carreira, a exemplo de suspensão do trabalho, perda da função e, até mesmo, o rompimento do contrato de trabalho.',
      paragraph08: 'Ressaltamos que indisciplina, insubordinação, desídia, mau procedimento, dentre outros, constituem-se justos motivos para desligamento, na forma do artigo 482 da CLT.',
      paragraph09: 'As informações constantes deste comunicado estão protegidas pelo sigilo profissional (ou outro, como bancário), cuja integridade e preservação ora transferimos para V.Sª.' +
        ' Assim, aquele que tem acesso às informações no âmbito do procedimento disciplinar obriga-se a resguardar o sigilo de modo a preservar a honra das pessoas e a reputação do Banco.',
      paragraph10: 'Faculta-se adiantamento no valor da Responsabilização Pecuniária, com reposição em até 25 parcelas mensais e consecutivas, mediante' +
        ' requerimento formal endereçado à administração de sua dependência. A cobrança do adiantamento tem início na folha de pagamento do mês' +
        ' subsequente e o valor da parcela não pode ser inferior a 10% do respectivo VP.',
      paragraph11: 'O prazo para solicitar recálculo da Responsabilização Pecuniária, quando houver erro no estabelecimento do valor da pecúnia, é de ',
      paragraph1101: '10 dias úteis',
      paragraph1102: ', contados a partir da ciência neste comunicado e disponibilização das cópias do processo. Para tanto, utilize o modelo “Requerimento de Revisão”, e envie a solicitação para o e-mail: ',
      paragraph1103: 'gepes.gedip.pr@bb.com.br.'

    }

    document.footers = {
      footer1: `${gedip.nome_funci_resp.trim()}`,
      footer2: `${gedip.comissao_funci_resp.trim()}`,
      footer3: `Ciente em  __/__/____`,
      footer4: `${gedip.funcionario_gedip_nome.trim()}`,
    }

    return document;
  },

  Demissao: ({ gedip }) => {

    let document = {};

    const observacoes_gedip = JSON.parse(gedip.observacoes_gedip);

    document.headers = {
      header1: `${gedip.funcionario_gedip_prefixo_nome.trim()} - ${moment(Date.now()).format("YYYY")}/${gedip.nm_gedip}`,
      header2: `${gedip.funcionario_gedip_municipio} (${gedip.funcionario_gedip_uf}), ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      header3: `#confidencial`
    }

    document.footers = {
      footer1: `${gedip.nome_funci_resp.trim()}`,
      footer2: `${gedip.comissao_funci_resp.trim()}`,
      footer3: `Ciente em  __/__/____`,
      footer4: `${gedip.funcionario_gedip_nome.trim()}`,
    }


    document.docAutDebt = {
      paragraph01: `${observacoes_gedip.prefixoCompar.municipio} - ${observacoes_gedip.prefixoCompar.nm_uf}, ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      paragraph02: `${observacoes_gedip.agenciaCC.nome}`,
      paragraph03: `${observacoes_gedip.agenciaCC.logradouro}`,
      paragraph04: `${observacoes_gedip.agenciaCC.cep.slice(0, 5) + '-' + observacoes_gedip.agenciaCC.cep.slice(5)} - ${observacoes_gedip.agenciaCC.municipio} - ${observacoes_gedip.agenciaCC.nm_uf}`,
      paragraph05: 'AUTORIZO o débito em minha conta corrente ' +
        `n° ${observacoes_gedip.agenciaCC.cC}, agência ${observacoes_gedip.agenciaCC.prefixo}-${observacoes_gedip.agenciaCC.dv_prefixo},` +
        ' do saldo devedor dos adiantamentos que me foram concedidos na condição de funcionário ' +
        '(Programa de Assistência Social – PAS, férias, 13º salário, por exemplo)' +
        ', consignações fixas da folha de pagamento (seguros, sindicato dos bancários,' +
        ' pensão alimentícia, etc.), dias não trabalhados, empréstimos contraídos com a Previ' +
        ' (simples e imobiliário, a ser negociado diretamente com a Caixa de Previdência).',
      paragraph06: 'AUTORIZO, também, o débito de eventuais valores recebidos por remoção ou comissionamento' +
        ' no interesse do serviço, ou programas da Unibb – Universidade Corporativa Banco do Brasil,' +
        ' se não tiver cumprido os prazos e requisitos estabelecidos nos respectivos regulamentos.',
      paragraph07: 'COMPROMETO-ME a comparecer à agência onde mantenho minha conta de depósitos,' +
        ' para renegociar as dívidas por mim contraídas junto ao Banco do Brasil S.A.',
      paragraph08: 'ESTOU CIENTE que, caso meu afastamento ocorra após o processamento da Fopag e antes do crédito dos proventos,' +
        ' estes serão retidos, pelo valor líquido, e o seu pagamento efetuado no acerto de contas.',
    };

    document.docDataQuitacao = {
      paragraph01: 'COMUNICADO',
      paragraph02: 'DATA QUITAÇÃO RESCISÃO CONTRATUAL',
      paragraph03: `${observacoes_gedip.prefixoCompar.prefixo} ${observacoes_gedip.prefixoCompar.nome}`,
      paragraph04: `${observacoes_gedip.prefixoCompar.municipio} - ${observacoes_gedip.prefixoCompar.nm_uf}, ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      paragraph05: `${gedip.func_gedip.matricula} - ${gedip.func_gedip.nome.trim()}`,
      paragraph06: 'Prezado(a) Senhor(a),',
      paragraph07: '               Comunicamos que a rescisão de seu contrato de trabalho será processada nesta unidade,' +
        ` onde V. Sa. deverá comparecer em ${moment(observacoes_gedip.prefixoCompar.dt_hr_apres_ag.date).format("DD/MM/YYYY")}, às ${moment(observacoes_gedip.prefixoCompar.dt_hr_apres_ag.time).format("HH[h]mm")}.`
    };

    document.docComunicDemissao = {
      paragraph01: 'Comunicado de Demissão por Justa Causa',
      paragraph02: `${observacoes_gedip.prefixoCompar.prefixo} ${observacoes_gedip.prefixoCompar.nome}`,
      paragraph03: `${observacoes_gedip.prefixoCompar.municipio} - ${observacoes_gedip.prefixoCompar.nm_uf}, ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      paragraph04: `${gedip.func_gedip.matricula} - ${gedip.func_gedip.nome.trim()}`,
      paragraph05: 'Prezado(a) Senhor(a),',
      paragraph06: '               Comunicamos que, por despacho superior, V.Sa. foi demitido(a) dos serviços deste Banco,' +
        ` por justa causa, com base no artigo 482 da CLT, alínea(s) ${observacoes_gedip.alineas_clt}.`,
      paragraph07: `               Deverá V.Sa. comparecer à ${observacoes_gedip.clinica.nome_clinica}, em ${moment(observacoes_gedip.clinica.dt_hr_agend_cassi.date).format("DD/MM/YYYY")}, às ${moment(observacoes_gedip.clinica.dt_hr_agend_cassi.time).format("HH[h]mm")}, no endereço ${observacoes_gedip.clinica.endereco_clinica},` +
        ' para realização do exame médico demissional. A realização do exame poderá ser dispensada se atendido' +
        ' o prazo de 135 dias entre a realização do último exame e a data da homologação.',
      paragraph08: '               Lembramos que o descumprimento da orientação acima pressupõe desinteresse de sua parte em submeter-se ao exame recomendado.',
      paragraph09: `               Informamos que a quitação da rescisão do contrato de trabalho ocorrerá, nesta Unidade, em ${moment(observacoes_gedip.prefixoCompar.dt_hr_apres_ag.date).format("DD/MM/YYYY")}, às ${moment(observacoes_gedip.prefixoCompar.dt_hr_apres_ag.time).format("HH[h]mm")}.`,
      paragraph10: '               Solicitamos a entrega dos documentos a seguir relacionados, para as providências alusivas à rescisão do referido contrato de trabalho:',
      paragraph11: 'Carteira de Trabalho e Previdência Social – CTPS (todas);',
      paragraph12: 'Identidade funcional;',
      paragraph13: 'Carteira de beneficiário da Cassi – titular e dependentes;',
      paragraph14: 'Cartão operacional;',
      paragraph15: 'Cartão de crédito empresarial.'
    }

    document.docEncExames = {
      paragraph01: 'Encaminhamento para Exame Médico Demissional',
      paragraph02: `${observacoes_gedip.prefixoCompar.prefixo} ${observacoes_gedip.prefixoCompar.nome}`,
      paragraph03: `${observacoes_gedip.prefixoCompar.municipio} - ${observacoes_gedip.prefixoCompar.nm_uf}, ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      paragraph04: 'À',
      paragraph05: 'Caixa de Assistência dos Funcionários do BB – Cassi',
      paragraph06: 'Em mão',
      paragraph07: `               Encaminhamos o funcionário ${gedip.func_gedip.nome.trim()}, matrícula ${gedip.func_gedip.matricula}, para realização do exame médico demissional, em ${moment(observacoes_gedip.clinica.dt_hr_agend_cassi.date).format("DD/MM/YYYY")}, às ${moment(observacoes_gedip.clinica.dt_hr_agend_cassi.time).format("HH[h]mm")}.`
    }

    return document;
  },
  Encerrado: ({ gedip }) => {

    let document = {};

    document.headers = {
      header1: `${gedip.funcionario_gedip_prefixo_nome.trim()} - ${moment(Date.now()).format("YYYY")}/${gedip.nm_gedip}`,
      header2: `${gedip.funcionario_gedip_municipio} (${gedip.funcionario_gedip_uf}), ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      header3: `#confidencial`
    }

    document.paragraphs = {
      paragraph01: 'Senhor(a) ',
      paragraph0102: `${gedip.funcionario_gedip} - ${gedip.funcionario_gedip_nome.trim()}.`,
      paragraph02: `AÇÃO DISCIPLINAR – GEDIP Nº ${gedip.nm_gedip}`,
      paragraph0202: ' – A  Ação Disciplinar foi solucionada como ',
      paragraph0203: 'caso encerrado',
      paragraph0204: `, conforme a IN 383-1, por despacho do ${gedip.nm_comite}, de ${moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY")}.`,
      paragraph03: 'Declaramos que a(s) informação(ões) constante(s) deste documento e de seu(s) eventual(is) anexo(s) está(ão) protegida(s) ' +
        'pelo sigilo profissional (ou outro, como bancário), cuja integridade e preservação ora transferimos para V.Sª.'
    }

    document.footers = {
      footer1: `${gedip.nome_funci_resp.trim()}`,
      footer2: `${gedip.comissao_funci_resp.trim()}`,
      footer3: `Ciente em  __/__/____`,
      footer4: `${gedip.funcionario_gedip_nome.trim()}`,
    }

    return document;
  },
  CasoAbrangido: ({ gedip }) => {

    let document = {};

    document.headers = {
      header1: `${gedip.funcionario_gedip_prefixo_nome.trim()} - ${moment(Date.now()).format("YYYY")}/${gedip.nm_gedip}`,
      header2: `${gedip.funcionario_gedip_municipio} (${gedip.funcionario_gedip_uf}), ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      header3: `#confidencial`
    }

    document.paragraphs = {
      paragraph01: `Senhor(a) Funcionário(a) ${gedip.funcionario_gedip} - ${gedip.funcionario_gedip_nome.trim()}`,
      paragraph02: `AÇÃO DISCIPLINAR – GEDIP Nº ${gedip.nm_gedip}`,
      paragraph0202: ' – A  Ação Disciplinar foi solucionada como ',
      paragraph0203: 'caso abrangido',
      paragraph0204: `, conforme a IN 383-1, por despacho do ${gedip.nm_comite}, de ${moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY")}.`,
      paragraph03: 'A(s) irregularidade(s) sob julgamento nesta Ação Disciplinar, as quais culminaram na presente solução' +
        ', são de natureza idêntica àquela(s) já apreciada(s) no protocolo ',
      paragraph0302: `GEDIP Nº ${gedip.abrangido_de}`,
      paragraph0303: ', e relativa(s) ao mesmo período.',
      paragraph04: 'Declaramos que a(s) informação(ões) constante(s) deste documento e de seu(s) eventual(is) anexo(s) está(ão) protegida(s) ' +
        'pelo sigilo profissional (ou outro, como bancário), cuja integridade e preservação ora transferimos para V.Sª.'
    }

    document.footers = {
      footer1: `${gedip.nome_funci_resp.trim()}`,
      footer2: `${gedip.comissao_funci_resp.trim()}`,
      footer3: `Ciente em  __/__/____`,
      footer4: `${gedip.funcionario_gedip_nome.trim()}`,
    }

    return document;
  },
  Cancelamento: ({ gedip }) => {

    let document = {};

    document.headers = {
      header1: `${gedip.funcionario_gedip_prefixo_nome.trim()} - ${moment(Date.now()).format("YYYY")}/${gedip.nm_gedip}`,
      header2: `${gedip.funcionario_gedip_municipio} (${gedip.funcionario_gedip_uf}), ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      header3: `#confidencial`
    }

    document.paragraphs = {
      paragraph01: `Senhor(a) ${gedip.funcionario_gedip} - ${gedip.funcionario_gedip_nome.trim()}`,
      paragraph02: `AÇÃO DISCIPLINAR – GEDIP Nº ${gedip.nm_gedip}`,
      paragraph0202: ' - Decidiu-se ',
      paragraph0203: ` cancelar `,
      paragraph0204: `  a Ação Disciplinar, conforme a IN 383-1, por despacho do ${gedip.nm_comite}, de ${moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY")}.`,
      paragraph03: 'Declaramos que a(s) informação(ões) constante(s) deste documento e de seu(s) eventual(is) anexo(s) está(ão) protegida(s) ' +
        'pelo sigilo profissional (ou outro, como bancário), cuja integridade e preservação ora transferimos para V.Sª.'
    }

    document.footers = {
      footer1: `${gedip.nome_funci_resp.trim()}`,
      footer2: `${gedip.comissao_funci_resp.trim()}`,
      footer3: `Ciente em  __/__/____`,
      footer4: `${gedip.funcionario_gedip_nome.trim()}`,
    }

    return document;
  },

  AlertaEticoNegocial: ({ gedip }) => {

    let document = {};

    document.headers = {
      header1: `${gedip.funcionario_gedip_prefixo_nome.trim()} - ${moment(Date.now()).format("YYYY")}/${gedip.nm_gedip}`,
      header2: `${gedip.funcionario_gedip_municipio} (${gedip.funcionario_gedip_uf}), ${moment(Date.now()).locale('pt-BR').format("LL")}`,
      header3: `#confidencial`
    }

    const observacoes_gedip = JSON.parse(gedip.observacoes_gedip) || false;;

    const par4 = observacoes_gedip ?
      (
        `O ${gedip.nm_comite} identificou a sua participação na seguinte irregularidade: ${observacoes_gedip.descricao_ocorrencia || ''},` +
        ` em descumprimento à(s) IN(s) ${observacoes_gedip.normativos_descumpridos.toString().replace(/\,/, ', ') || ''}, ocorrida na dependência ${observacoes_gedip.dependencia_funci[1]}, ` +
        `prefixo ${observacoes_gedip.dependencia_funci[0]}, motivo que justifica a aplicação da referida solução disciplinar.`
      )
      :
      (
        `A(s) irregularidade(s) que ensejou(ram) a referida medida administrativa é(são) aquela(s) relacionada(s) no documento ` +
        `de Interpelação recebido por V.Sª no curso da Ação Disciplinar.`
      );

    document.paragraphs = {
      paragraph01: `Funcionário(a) ${gedip.funcionario_gedip} - ${gedip.funcionario_gedip_nome.trim()}`,
      paragraph02: `Senhor(a) Funcionário(a),`,
      paragraph03: `CONTROLE DISCIPLINAR – GEDIP Nº ${gedip.nm_gedip} – ALERTA ÉTICO-NEGOCIAL EM VIRTUDE DE AÇÃO DISCIPLINAR - `,
      paragraph0301: ` Levamos ao conhecimento de V.Sª, que por decisão do ${gedip.nm_comite} de ${moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY")}, ` +
        'decidiu-se alertá-lo sobre a necessidade de reposicionamento.',
      paragraph04: par4,
      paragraph05: 'Ressaltamos que tal comportamento não é admitido pela Empresa, pois caracteriza irregularidade tipificada como desvio ético-negocial.',
      paragraph06: 'Para orientar-lhe sobre a adoção de comportamento regular e oportunizar seu reposicionamento, indicamos que observe as ' +
        'Instruções Normativas relativas à irregularidade praticada, o Código de Ética (IN 382), e a Política Específica de Relacionamento com Clientes e Usuários de Produtos e Serviços (IN 606).',
      paragraph08: 'Alertamos-lhe ainda que o cometimento de qualquer nova irregularidade poderá acarretar prejuízos a sua carreira.',
      paragraph09: 'Declaramos que as informações constantes deste comunicado e seus anexos estão protegidas pelo sigilo profissional (ou outro, como bancário), cuja integridade e preservação ora transferimos para V.Sª. ' +
        'Assim, aquele que tem acesso às informações no âmbito do procedimento disciplinar obriga-se a resguardar o sigilo de modo a preservar a honra das pessoas e a reputação do Banco.',
      paragraph10: 'O prazo para solicitar revisão da medida administrativa é de ',
      paragraph1001: '10 dias úteis',
      paragraph1002: ', contados a partir da ciência neste comunicado e disponibilização das cópias do processo. Para tanto, utilize o modelo “Requerimento de Revisão”, e envie a solicitação para o e-mail: ',
      paragraph1003: 'gepes.gedip.pr@bb.com.br.'
    }

    // paragraph3 = `<strong>AÇÃO DISCIPLINAR – GEDIP Nº ${gedip.noGedip} </strong>` +
    //     `– O Comitê ${gedip.comite} decidiu, em ${gedip.dataJulgamento},` +
    //     `aplicar-lhe a sanção disciplinar de <strong>suspensão</strong>, por <strong>${gedip.qtdeDiasSuspensao}</strong>` +
    //     `dias consecutivos, conforme IN 383-1.`;

    document.footers = {
      footer1: `${gedip.nome_funci_resp.trim()}`,
      footer2: `${gedip.comissao_funci_resp.trim()}`,
      footer3: `Ciente em  __/__/____`,
      footer4: `${gedip.funcionario_gedip_nome.trim()}`,
    }

    return document;
  },
}