import _ from 'lodash';

/**
 * Funcao utilitaria para o componente ListPerguntas a fim de realizar uma validação em todas as perguntas
 * da lista.
 * 
 * @return Um objeto onde as chaves sao os Ids das perguntas que contem os erros identificados.
 */
const validateQuestionList = (questionList) => {
  let errorsList = {};

  if (questionList && questionList.length) {
    questionList.forEach(question => {
      let questionErrors  = [];

      //verifica se preencheu o titulo da pergunta
      if (!question.texto || question.texto.trim() === '') {
        questionErrors.push('Título da pergunta é obrigatório.');
      }

      switch (question.tipoResposta) {
        case 'respostaCurta':
        case 'paragrafo':
          //verifica esta com a opcao de validacao habilitada
          if (question.showValidacao) {
            let dadosResposta = question.dadosResposta;
            if (!dadosResposta) {
              questionErrors.push('Necessário os dados da validação!');
            } else {
              if (!dadosResposta.validacao.expressao || 
                  (_.isString(dadosResposta.validacao.expressao) && dadosResposta.validacao.expressao.trim() === '')) {
                if (dadosResposta.validacao.tipoValidacao === 'comprimento') {  
                  questionErrors.push('Necessária a quantidade de caracteres da validação!');
                } else {
                  questionErrors.push('Necessária a expressão da condição da validação!');
                }
              }

              if (!dadosResposta.validacao.mensagemErro || dadosResposta.validacao.mensagemErro.trim() === '') {
                questionErrors.push('Necessária a mensagem de erro da validação!');
              }              
            }
          }

          break;

        case 'caixasSelecao':
        case 'multiplaEscolha':
        case 'listaSuspensa':
          let dadosResposta = question.dadosResposta;

          if (!dadosResposta || !dadosResposta.optionsList || _.isEmpty(dadosResposta.optionsList)) {
            questionErrors.push('Adicione ao menos uma opção para esta pergunta!');
          } else {
            let hasEmptyOption = dadosResposta.optionsList.some(option => option.text.trim() === '');

            if (hasEmptyOption) {
              questionErrors.push('Todas as opções devem estar preenchidas!');
            }
          }

          break;

        default:
          //do nothing  
          break;
      }

      //se possuir erros, adiciona-os com a key do id da pergunta
      if (questionErrors.length) {
        errorsList[question.id] = [...questionErrors];
      }
    });
    
  }

  return errorsList;
}

const validatePublicoAlvo = (publicoAlvo) => {

  let errorList = [];

  if(!publicoAlvo || _.isEmpty(publicoAlvo) ){
    errorList.push("Favor preencher a aba Público Alvo");
    return errorList;
  }

  //Validação do tipo de público alvo "publicos"
  if(publicoAlvo.tipoPublico === "publicos"){
    if( publicoAlvo && 
        (!publicoAlvo.publicos ||  (_.isEmpty(publicoAlvo.publicos.prefixos) && _.isEmpty(publicoAlvo.publicos.matriculas ))) &&
        (!publicoAlvo.lista )
      ){
      errorList.push("Público alvo não informado");
    }


  //Validação do tipo de público alvo "lista"
  }else{

    if(  (publicoAlvo && !publicoAlvo.lista) || (_.isEmpty(publicoAlvo.lista.dados) && _.isEmpty(publicoAlvo.lista.headers )))
    {
          errorList.push("Público alvo não informado");
    }

  }
  

  return errorList;
}
/**
 * Funcao utilitaria para o componente Geral Form.
 * @return Um array com a lista de erros encontrados na validacao.
 */
const validateGeralForm = (formData) => {
  let errorsList = [];

  if (formData) {
    if (!formData.status || formData.status < 1) {
      errorsList.push('Por favor, informe o status da demanda!');
    }

    if (!formData.titulo || formData.titulo.trim() === '') {
      errorsList.push('Por favor, preencha o título!');
    }

    if (!formData.descricao || formData.descricao.trim() === '') {
      errorsList.push('Por favor, preencha a descrição!');
    }

    if (!formData.dataExpiracao || formData.dataExpiracao.trim() === '' || formData.dataExpiracao === "Invalid date") {
      errorsList.push('Por favor, preencha a data de expiração!');
    }

  }

  return errorsList;
}

const validateColaboradores = (listaColaboradores) => {

  let errorsList = [];
  if(listaColaboradores == null || !listaColaboradores.length >= 2){
    errorsList.push('Deve ser incluído ao menos um colaborador!');
  }
  return errorsList;
}

const validateNotificacoes = (notificacoes) => {
  let errorList = [];
  if(_.isEmpty(notificacoes)){
    errorList.push("Favor preencher a aba notificações")
  }

  return errorList;
}

export {
  validateQuestionList,
  validateGeralForm,
  validateColaboradores,
  validatePublicoAlvo,
  validateNotificacoes
  
}

