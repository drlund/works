import CryptoJS from 'crypto-js';

//Espacamento das Cols para varios tamanhos de Telas.
//Usado no atributo gutter={defaultGutter} do componente Row.
const DefaultGutter = /** @type {const} */ ({ xs: 8, sm: 16, md: 24, lg: 32 });

/**
 * Funcao utilitaria para trocar (swap) a posicao de 02 items em um array.
 * Utilizada pelo componente react-beaultiful-dnd, mas pode ser
 * reaproveitada por qualquer componente que deseje esta funcionalidade.
 * @param {any[]} list - array com o elementos
 * @param {number} startIndex indice inicial do elemento
 * @param {number} endIndex indice final do elemento final
 */
const ReorderDnD = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Funcao utilitaria que indica se existe algum erro de validacao nos campos de
 * um formulario do ant-design.
 * @param {{[key: string]: any}} fieldsError
 */
function hasFormErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

/** verifica se o tipo da resposta possui validacao de opcoes.
 * se tiver, a pergunta precisar ser atualizada.
 * @see OptionValidate.js
 * */
const isOptionValidateType = (tipoResposta) => {
  switch (tipoResposta) {
    case 'multiplaEscolha':
    case 'listaSuspensa':
      return true;

    default:
      return false;
  }
};

/**
 * Funcao que retorna uma string da URL correspondente a foto do perfil
 * do usuário no Humanograma.
 * Obs.: Não usar link de foto do connections. Domínio não permite busca de fotos sem login.
 * @param {string} matricula - matricula do sujeito meliante.
 */
const getProfileURL = (matricula) =>
  `https://humanograma.intranet.bb.com.br/avatar/${matricula}`;

/**
 * Funcao que retorna uma string da URL correspondente à pagina
 * do usuário no Humanograma.
 *
 * @param {string} matricula - matricula do sujeito meliante.
 * @param {string} identificador - quando o identificador for a uor, o identificador será 'uor/'
 */
const getHumanGramURL = (matricula, identificador = '') =>
  `https://humanograma.intranet.bb.com.br/${identificador}${matricula}`;

/**
 * Funcao que retorna uma string da URL correspondente à pagina
 * da uor no Humanograma.
 *
 * @param {string} uor - uor a ser consultado.
 */
const getHumanGramUorURL = (uor) =>
  `https://humanograma.intranet.bb.com.br/uor/${parseInt(uor, 10)}`;

/**
 * Funcao utilitaria que verifica o acesso do usuario a um determinado recurso de
 * uma aplicacao. Esta funcao tem o objetivo de permitir uma logica de apresentacao
 * no frontend a fim de melhorar a usabilidade da aplicacao, não obstante,
 * as regras de acesso finais estão implementadas também no backend e estas serão
 * aplicadas em ultima instancia.
 *
 * @param {Object} props
 * @param {String} props.ferramenta - nome da ferramenta a ser verificada a permissao de acesso.
 * @param {Array} props.permissoesRequeridas - array com a lista das permissoes requeridas.
 * @param {Object} props.authState - objeto com os dados de autenticacao do usuario contido no store da aplicacao.
 * @param {Boolean} [props.verificarTodas] - se for passado e for true, somente retorna true somente se
 *                  o usuario possuir todas as permissoes da lista.
 *
 * @returns {Boolean} - true se usuario possui as permissoes, false caso contrario.
 */
const verifyPermission = ({
  ferramenta,
  permissoesRequeridas,
  authState,
  verificarTodas,
}) => {
  if (!ferramenta || !permissoesRequeridas || !authState) {
    return false;
  }

  if (
    !authState.perms ||
    !authState.perms.trim().length ||
    !permissoesRequeridas.length
  ) {
    return false;
  }

  let listaGeralPermissoes;

  try {
    const bytes = CryptoJS.AES.decrypt(authState.perms, authState.token);
    listaGeralPermissoes = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    if (!listaGeralPermissoes.length) {
      return false;
    }
  } catch (err) {
    // JSON invalido!
    return false;
  }

  let permissoesFerramentaAtual = [];

  // busca as permissos da ferramenta especificada
  [permissoesFerramentaAtual] = listaGeralPermissoes
    .filter((reg) => reg.ferramenta === ferramenta)
    .map((item) => item.permissoes);

  if (!permissoesFerramentaAtual?.length) {
    // nao achou a ferramenta indicada, ou a lista esta vazia
    // (dificil isso, so se for um erro do backend.. mas).
    return false;
  }

  const intersection = permissoesRequeridas.filter((x) =>
    permissoesFerramentaAtual.includes(x),
  );
  let result = intersection.length > 0;

  if (verificarTodas) {
    // precisa ter todas as obrigatorias para indicar permissao
    result = intersection.length === permissoesRequeridas.length;
  }

  return result;
};

/**
 * Funcao utilitaria que adiciona a string [str] [n] vezes a esquerda
 * do valor [nr]
 * @param {string|number} nr - numero ou texto
 * @param {number} n - qtd de vezes a repetir
 * @param {string} [str] - string/caractere a repetir - '0' default.
 */
const padLeft = (nr, n, str = '0') => String(nr).padStart(n, str);

/**
 * Funcao utilitaria que adiciona a string [str] [n] vezes a direita
 * do valor [nr]
 * @param {string|number} nr - numero ou texto
 * @param {number} n - qtd de vezes a repetir
 * @param {string} [str] - string/caractere a repetir - '0' default.
 */
const padRight = (nr, n, str = '0') => String(nr).padEnd(n, str);

/**
 * Função utilitária que converte a primeira letra de cada palavra do
 * texto para maiúscula. O texto é convertido para minusculas no inicio.
 *
 * @param {String} texto
 */
const capitalizeName = (texto) => {
  try {
    const textParts = texto.toLowerCase().split(' ');
    const result = [];
    const preposicoes = ['dos', 'das'];

    textParts.map((word) => {
      if (word.length > 3) {
        result.push(word.replace(/^\w/, (c) => c.toUpperCase()));
      }
      if (word.length === 3 && !preposicoes.includes(word)) {
        result.push(word.replace(/^\w/, (c) => c.toUpperCase()));
      } else {
        result.push(word);
      }
      return word;
    });

    return result.join(' ');
  } catch (err) {
    return texto;
  }
};

/**
 * Metodo utilitario que abre a janela de salvar arquivo como no navegador
 * para receber o conteudo de um arquivo binario do backend.
 * @param {String} fileName
 * @param {BlobPart|BlobPart[]} content
 */
const DownloadFileUtil = (fileName, content) => {
  const elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';
  const blob = new Blob([content]);
  elink.href = URL.createObjectURL(blob);

  document.body.appendChild(elink);
  elink.click();
  elink.parentNode.removeChild(elink);
};

/**
 * Metodo utilitario que cria um link para armazenar um arquivo PDF, a ser
 * usado pela biblioteca pdf-viewer-reactjs.
 * @param {String} fileName
 * @param {BlobPart|BlobPart[]} content
 */
const BlobToURL = (fileName, content) => {
  const elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';
  const blob = new Blob([content], { type: 'application/pdf' });
  elink.href = URL.createObjectURL(blob);

  document.body.appendChild(elink);
  elink.click();
  elink.parentNode.removeChild(elink);
};

/**
 * @param {String} fileName
 * @param {String} link
 */
const DownloadPDFFromlink = (fileName, link) => {
  const elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';
  elink.href = link;

  document.body.appendChild(elink);
  elink.click();
  elink.parentNode.removeChild(elink);
};

/**
 *
 * @param {string[]} titles => array de string, representando o cabeçalho
 * @param {any[][]} rows => array de array, representando o conteúdo da tabela.
 */
const jsonToCsv = (titles, rows) => {
  const csvContent = `data:text/csv;charset=utf-8,${titles
    .join(',')
    .concat('\n')}${rows.map((row) => row.join(',')).join('\n')}`;

  const encodedUri = encodeURI(csvContent);
  const elink = document.createElement('a');
  elink.href = encodedUri;
  elink.download = 'Consulta Movimentação Transitória.csv';
  elink.style.display = 'none';

  document.body.appendChild(elink);
  elink.click();
  elink.parentNode.removeChild(elink);
};

/**
 * @typedef {(string | {
 *  response: {
 *    data: (string | {
 *      error: never,
 *      errorMessage: string,
 *    }| {
 *      error: string,
 *      errorMessage: never,
 *    }),
 *    statusText: string
 *  },
 *  message: string
 * })} ErrorObject
 */

/**
 * Metodo utilitario para extrair a mensagem de erro dentro dos retornos da APIModel no
 * actions.
 * @param {ErrorObject} errorObject
 */
export const ExtractErrorMessage = (
  errorObject,
  defaultMessage = 'Sem conexão com o servidor.',
) => {
  if (!errorObject) {
    return defaultMessage;
  }

  if (typeof errorObject === 'string') {
    return errorObject;
  }

  if (typeof errorObject.response.data === 'string') {
    return errorObject.response.data;
  }

  if (typeof errorObject.response.data.errorMessage === 'string') {
    return errorObject.response.data.errorMessage;
  }

  if (typeof errorObject.response.data.error === 'string') {
    return errorObject.response.data.error;
  }

  if (typeof errorObject.response === 'string') {
    return errorObject.response;
  }

  if (typeof errorObject.message === 'string') {
    return errorObject.message;
  }

  if (typeof errorObject.response.statusText === 'string') {
    return errorObject.response.statusText;
  }

  return defaultMessage;
};

/**
 * Metodo utilitario para extrair a mensagem de erro dentro dos retornos da APIModel no
 * actions e chamar a funcao de callback errorCallback automaticamente.
 * @param {ErrorObject} errorObject
 * @param {(ErrorObject) => void} errorCallback
 */
const HandleErrorResponse = (errorObject, errorCallback) => {
  const errorMessage = ExtractErrorMessage(errorObject);
  errorCallback(errorMessage);
};

/**
 * Metodo que ordena aleatoriamente os elementos de um array.
 * @param {any[]} baseArray
 */
const ArrayShuffle = (baseArray) => {
  const array = [...baseArray];

  for (let i = array.length - 1; i > 0; i - 1) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

/**
 * Converte um valor do tipo double em formato de moeda.
 *
 * @param {number} baseNumber - valor base do tipo float/double
 * @param {string} [cs] - currency simbol (padrão R$)
 * @param {string} [s] - separador de milhar (padrão: [.])
 * @param {string} [c] - separador de casas decimais ( padrão: [,])
 */
export function moneyFormat(baseNumber, cs = 'R$ ', s = '.', c = ',') {
  const bNumber = !baseNumber ? 0 : baseNumber;
  const n = 2;
  const re = '\\d(?=(\\d{3})+\\D)';
  const num = bNumber.toFixed(n);

  return cs + num.replace('.', c).replace(new RegExp(re, 'g'), `$&${s || '.'}`);
}

/**
 * Retonar Sim ou Não para um valor boolean ou int.
 * @param {boolean|int} value - boolean ou integer
 */
export function boolToText(value) {
  return value ? 'Sim' : 'Não';
}

/**
 * @param {string} str
 */
export function removerAcentos(str) {
  return str.normalize('NFD').replace(/[^a-zA-Zs]/g, '');
}

const env = process.env.NODE_ENV.toLowerCase() || 'development';
export function getEnvironment() {
  return env;
}

export function getBasePath() {
  const basePath = process.env.REACT_APP_ENDPOINT_API_URL;
  return basePath;
}

export function getCompletePath(endereco) {
  const basePath = process.env.REACT_APP_ENDPOINT_API_URL;
  return basePath + endereco;
}

/**
 * O que sera exportado por este modulo.
 */
export {
  DefaultGutter,
  ReorderDnD,
  hasFormErrors,
  isOptionValidateType,
  getProfileURL,
  getHumanGramURL,
  getHumanGramUorURL,
  verifyPermission,
  padLeft,
  padRight,
  capitalizeName,
  DownloadFileUtil,
  HandleErrorResponse,
  BlobToURL,
  DownloadPDFFromlink,
  ArrayShuffle,
  jsonToCsv,
};
