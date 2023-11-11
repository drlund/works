/**
 * Se os dados que você deseja acessar estão disponíveis em `getSuspensoesView()`, você precisa garantir que esteja extraindo os valores corretamente e 
 * armazenando-os em uma variável antes de usá-los. Vou ajustar seu código para refletir isso:
 */

/**
 * Neste código, a variável "tipo" é definida com base na iteração no loop `for` e é usada posteriormente para criar o objeto no `history.push()`. 
 * Certifique-se de que a estrutura de dados retornada por `getSuspensoesView()` esteja correta e que os valores esperados estejam presentes para evitar 
 * erros adicionais.
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
    let tipo = null; // Adicionando a variável tipo aqui

    for (const tipo of tipos) {
      if (dadosSuspensoes[tipo]) {
        registroEncontrado = dadosSuspensoes[tipo].find(
          (/** @type {{ id: any; }} */ item) => item.id === id,
        );
        if (registroEncontrado) {
          tipo = tipoToColumnMap[tipo]; // Definindo o valor de tipo aqui
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
          tipo: tipo, // Usando a variável "tipo" aqui
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
