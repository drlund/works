const StringRespValidate = (question, text) => {  
  const errorsList = [];

  //valida se o campo eh obrigatorio e nao foi preenchido
  if (question.obrigatoria && text.trim() === "") {
    errorsList.push('Este é um campo de preenchimento obrigatório!');
  }

  //verifica se possui validacao definida
  if (question.showValidacao) {
    if (question.obrigatoria || (!question.obrigatoria && text.trim() !== "")) {
      const infoValidacao = question.dadosResposta.validacao;

      if (infoValidacao) {
        //verifica o tipo de validacao
        switch (infoValidacao.tipoValidacao) {
          case 'comprimento':
            let qtdCaracteres = infoValidacao.expressao;

            if (infoValidacao.condicao === "minimo") {
              if (text.length < qtdCaracteres) {
                errorsList.push(infoValidacao.mensagemErro);
              }
            }

            if (infoValidacao.condicao === "maximo") {
              if (text.length > qtdCaracteres) {
                errorsList.push(infoValidacao.mensagemErro);
              }
            }

            break;

          case "texto":
            let searchText = infoValidacao.expressao;

            if (infoValidacao.condicao === "contem") {
              if ( ! (new RegExp(searchText, 'gmi')).test(text)) {
                errorsList.push(infoValidacao.mensagemErro);
              }
            }

            if (infoValidacao.condicao === "nao_contem") {
              if ((new RegExp(searchText, 'gmi')).test(text)) {
                  errorsList.push(infoValidacao.mensagemErro);
              }
            }

            break;

          case "regex":
            let expression = infoValidacao.expressao;

            if (infoValidacao.condicao === "corresponde") {
              if (! (new RegExp(expression, 'gmi')).test(text)) {
                errorsList.push(infoValidacao.mensagemErro);
              }
            }

            if (infoValidacao.condicao === "nao_corresponde") {
              if ((new RegExp(expression, 'gmi')).test(text)) {
                errorsList.push(infoValidacao.mensagemErro);
              }
            }

            break;

          default:
            break;
        }
      }      
    }
  }

  return errorsList;
}

const SingleOptionRespValidate = (question, text) => {  
  const errorsList = [];

  //valida se o campo eh obrigatorio e nao foi preenchido
  if (question.obrigatoria === true && String(text).trim() === "") {
    errorsList.push('Este é um campo de preenchimento obrigatório!');
  }

  return errorsList;
}

const MultipleOptionRespValidate = (question, value) => {  
  const errorsList = [];

  //valida se o campo eh obrigatorio e nao foi preenchido
  if (question.obrigatoria === true && value.length === 0) {
    errorsList.push('Este é um campo de preenchimento obrigatório!');
  }

  return errorsList;
}

export {
  StringRespValidate,
  SingleOptionRespValidate,
  MultipleOptionRespValidate
}