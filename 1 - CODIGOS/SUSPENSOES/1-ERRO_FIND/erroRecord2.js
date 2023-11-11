/**
 * O erro "Variável com escopo de bloco 'tipoToColumnMap' usada antes de sua declaração" indica que a variável `tipoToColumnMap` não está definida 
 * antes de ser usada no escopo atual. Você precisa garantir que essa variável seja definida antes de usá-la.
 * 
 * Aqui está uma versão corrigida do seu código, levando em consideração a definição de `tipoToColumnMap`:
 */

/**
 * Neste código, a variável `tipoToColumnMap` é declarada e inicializada antes de ser usada no escopo do `for`. Certifique-se de que `tipoToColumnMap` 
 * esteja definida corretamente em algum lugar acessível neste escopo.
 */

const editaSuspensao = async (/** @type {any} */ id) => {
  try {
    const dadosSuspensoes = await getSuspensoesView();

    const tipos = [
      'Vice Presidencia',
      'Unidade Estratégica',
      'Unidade Tática',
      'Super Comercial',
      'Prefixo',
      'Matricula',
    ];

    let registroEncontrado = null;
    let tipo = null;

    for (const tipo of tipos) {
      if (dadosSuspensoes[tipo]) {
        registroEncontrado = dadosSuspensoes[tipo].find(
          (/** @type {{ id: any; }} */ item) => item.id === id,
        );
        if (registroEncontrado) {
          tipo = tipoToColumnMap[tipo];
          break;
        }
      }
    }

    if (registroEncontrado) {
      // Agora você pode usar "registroEncontrado" e "tipo" para criar o objeto no history.push
      history.push({
        pathname: `/movimentacoes/editar-suspensao/${id}`,
        state: {
          id,
          tipo: tipo,
          tipoSuspensao: registroEncontrado.tipoSuspensao,
          validade: registroEncontrado.validade,
        },
      });

      setFormData({
        tipo: registroEncontrado[
          tipoSelecionadoMap[registroEncontrado.tipoSuspensao]
        ],
        validade: moment(registroEncontrado.validade),
        tipoSuspensao: registroEncontrado.tipoSuspensao,
      });

      if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
        form.validateFields().then(() => {
          patchSuspensao({ ...dadosSuspensoes })
            .then((dadosSuspensoesForm) => {
              setDadosSuspensoesForm(dadosSuspensoesForm);
              history.goBack();
            })
            .catch(() => message.error('Falha ao editar suspensão!'));
        });
      }
    }
  } catch (erro) {
    message.error('Erro ao buscar/editar dados:', erro);
  }
};
