const ordemModel = use('App/Models/Mysql/OrdemServ/Ordem');
const historicoModel = use('App/Models/Mysql/OrdemServ/Historico');
const exception = use('App/Exceptions/Handler');
const { validate } = use('Validator')
const requestIp = require('request-ip');
const md5 = require('md5');

/**
 * Metodo responsavel por criar uma nova entrada no historico de 
 * uma ordem de serviço.
 * 
 * @param {Object} params 
 */
async function registrarHistorico(params){
  let { idOrdem, idEvento, tipoParticipacao, 
        request, session, dadosParticipante, respAlteracao } = params;

  const schema = {
    idOrdem: 'required|integer',
    idEvento: 'required|integer',
    tipoParticipacao: 'required|string',
  };

  const validation = await validate({
    idOrdem, idEvento, tipoParticipacao
  }, schema);

  if (validation.fails() || (!session && !dadosParticipante)) {
    throw new exception("Campos obrigatórios não foram informados!", 400);
  }

  let dadosUsuario;
  
  if (session) {
    dadosUsuario = session.get('currentUserAccount');
  } else {
    dadosUsuario = dadosParticipante;
    if (!dadosParticipante.chave) {
      if (!dadosParticipante.matricula) {
        throw new exception("Matrícula do registro não foi informada!", 500);
      }

      dadosUsuario.chave = dadosParticipante.matricula;
    }
  }

  const { prefixo, chave, nome_usuario, uor, nome_funcao, bb_token } = dadosUsuario;
  let enderecoIp = request ? requestIp.getClientIp(request.request) : ""; 

  let dadosOrdem = await ordemModel.query()
    .with('estado')
    .with('colaboradores', builder => {
      builder.with('dadosFunci', builder => {
        builder.with('nomeGuerra')
      })
    })
    .with('participantesEdicao', (builder) => {
      builder.with('tipoVinculo')
        .with('dadosFunciVinculado', (builderFunci) => {
          builderFunci.setVisible(['matricula', 'nome'])
        })
        .with('participanteExpandido', builder => {
          builder.with('dadosFunci')
          .orderBy('nome', 'asc')
        })
    })
    .with('instrucoesNormativas')
    .where('id', idOrdem)
    .first();

  dadosOrdem = dadosOrdem.toJSON();
  const dadosOrdemSerializado = JSON.stringify(dadosOrdem);
  const hashOrdem = md5(dadosOrdemSerializado);

  let novoRegistro = {
    id_ordem: idOrdem,
    id_evento: idEvento,
    prefixo_participante: prefixo,
    matricula_participante: chave,
    nome_participante: nome_usuario.toUpperCase(),
    uor_participante: uor? parseInt(uor) : 0,
    funcao_participante: nome_funcao || "",
    tipo_participacao: tipoParticipacao,
    dados_ordem: dadosOrdemSerializado,
    hash_ordem: hashOrdem,
    endereco_ip: enderecoIp,
    token_intranet: bb_token || "",
    resp_alteracao: respAlteracao ? respAlteracao : chave
  }

  //inserindo a nova entrada no historico da ordem
  await historicoModel.create(novoRegistro);

}

module.exports = registrarHistorico;