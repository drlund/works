/**
 * @typedef {Object} UsuarioLogado
 *
 * @property {string} chave ex: "F1234567"
 * @property {string} matricula ex: "F1234567"
 * @property {string} nome_usuario nome completo
 * @property {string} nome_guerra nome de guerra, UPPERCASE
 * @property {string} email email@bb.com.br
 * @property {string} prefixo ex: "0001"
 * @property {string} dependencia nome do prefixo
 * @property {string|number} pref_regional prefixo da regional
 * @property {string} nome_regional nome do prefixo da reginal
 * @property {string|number} pref_super prefixo da super
 * @property {string} nome_super nome do prefixo da super
 * @property {string|number} pref_diretoria prefixo da diretoria
 * @property {number} cod_funcao codigo da funcao
 * @property {string} nome_funcao nome da função, UPPERCASE
 * @property {string} telefone ex: "DDD 3123456789" (ddd sem 0)
 * @property {string} celular ex: "DDD 9123456789" (ddd sem 0)
 * @property {string} uf UF em UPPERCASE
 * @property {string} uor ex: "000123456" string com tamanho 9 e leading zeros quando necessario
 * @property {string} uor_trabalho ex: "000123456" string com tamanho 9 e leading zeros quando necessario
 * @property {string} bb_token token
 * @property {string[]} roles roles
 */

/**
 * @template {{[key: string]: any}} [Req={[key: string]: any, token: string}]
 * @typedef {Object} ControllerRouteProps
 * Tipagem para rotas do Adonis, é necessário chamar a cada rota:
 * Caso ache algum erro ou algo faltando, melhore as tipagens por aqui.
 * @property {import('@adonisjs/framework/src/Request') & {
 *  allParams: () => Req
 * }} request objeto de request
 * já com a tipagem para o `allParams()`
 * @property {import('@adonisjs/framework/src/Response') & AdonisDescriptiveMethods} response objeto de response
 * @property {UsuarioLogado} usuarioLogado acesso direto aos dados do usuário logado
 * @property {{
 *  get(currentUserAccount: 'currentUserAccount'): UsuarioLogado
 * }} session olhando o que foi usado antes, só achei que estava sendo usado para isso aqui
 *
 * @example sem tipagem do `allParams`
 * ```jsdoc
 * @param {ControllerRouteProps} props
 * ```
 * @example com tipagem do `allParams`
 * ```jsdoc
 * @param {ControllerRouteProps<{ token: string }>} props
 * ```
*/

/**
 * @typedef {Object} AdonisDescriptiveMethods
 * @property {(body: unknown) => void} continue status code 100
 * @property {(body: unknown) => void} switchingProtocols status code 101
 * @property {(body: unknown) => void} ok status code 200
 * @property {(body: unknown) => void} created status code 201
 * @property {(body: unknown) => void} accepted status code 202
 * @property {(body: unknown) => void} nonAuthoritativeInformation status code 203
 * @property {(body: unknown) => void} noContent status code 204
 * @property {(body: unknown) => void} resetContent status code 205
 * @property {(body: unknown) => void} partialContent status code 206
 * @property {(body: unknown) => void} multipleChoices status code 300
 * @property {(body: unknown) => void} movedPermanently status code 301
 * @property {(body: unknown) => void} found status code 302
 * @property {(body: unknown) => void} seeOther status code 303
 * @property {(body: unknown) => void} notModified status code 304
 * @property {(body: unknown) => void} useProxy status code 305
 * @property {(body: unknown) => void} temporaryRedirect status code 307
 * @property {(body: unknown) => void} badRequest status code 400
 * @property {(body: unknown) => void} unauthorized status code 401
 * @property {(body: unknown) => void} paymentRequired status code 402
 * @property {(body: unknown) => void} forbidden status code 403
 * @property {(body: unknown) => void} notFound status code 404
 * @property {(body: unknown) => void} methodNotAllowed status code 405
 * @property {(body: unknown) => void} notAcceptable status code 406
 * @property {(body: unknown) => void} proxyAuthenticationRequired status code 407
 * @property {(body: unknown) => void} requestTimeout status code 408
 * @property {(body: unknown) => void} conflict status code 409
 * @property {(body: unknown) => void} gone status code 410
 * @property {(body: unknown) => void} lengthRequired status code 411
 * @property {(body: unknown) => void} preconditionFailed status code 412
 * @property {(body: unknown) => void} requestEntityTooLarge status code 413
 * @property {(body: unknown) => void} requestUriTooLong status code 414
 * @property {(body: unknown) => void} unsupportedMediaType status code 415
 * @property {(body: unknown) => void} requestedRangeNotSatisfiable status code 416
 * @property {(body: unknown) => void} expectationFailed status code 417
 * @property {(body: unknown) => void} unprocessableEntity status code 422
 * @property {(body: unknown) => void} tooManyRequests status code 429
 * @property {(body: unknown) => void} internalServerError status code 500
 * @property {(body: unknown) => void} notImplemented status code 501
 * @property {(body: unknown) => void} badGateway status code 502
 * @property {(body: unknown) => void} serviceUnavailable status code 503
 * @property {(body: unknown) => void} gatewayTimeout status code 504
 * @property {(body: unknown) => void} httpVersionNotSupported status code 505
 */

/**
 * @typedef {{
*  subordinada: string,
*  uor: string,
*  gerev: string,
*  super: string,
*  diretoria: string,
*  nome: string,
*  prefixo: string,
*  uf: string,
*  municipio: string,
*  endereco: string,
* }} DependenciaFunci
*/

/**
* @typedef {{
*  matricula: string,
*  nome: string,
*  dataNasc: Date,
*  dataPosse: Date,
*  grauInstr: number,
*  codFuncLotacao: string,
*  descFuncLotacao: string,
*  refOrganizacionalFuncLotacao: string,
*  comissao: string,
*  descCargo: string,
*  codSituacao: number,
*  dataSituacao: Date,
*  agenciaLocalizacao: string,
*  prefixoLotacao: string,
*  codUorTrabalho: string,
*  nomeUorTrabalho: string,
*  codUorGrupo: string,
*  nomeUorGrupo: string,
*  email: string,
*  dddCelular: number,
*  foneCelular: number,
*  sexo: number,
*  estCivil: string,
*  nomeGuerra: string,
*  rg: string,
*  cpf: string,
*  dependencia: DependenciaFunci,
* }} Funci
*/

/**
 * @typedef {import('../Commons/Arh/getOneFunci')} getOneFunci
 * @typedef {import('../Commons/Arh/getManyFuncis').getManyFuncis} getManyFuncis
 * @typedef {import('../Commons/Arh/getDadosFunciDb2').getDadosFunciDb2} getDadosFunciDb2
 */
