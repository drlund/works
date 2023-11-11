'use strict'

const elogiosModel = use('App/Models/Mongo/Elogios');
const historicoElogiosModel = use('App/Models/Mongo/HistoricoElogios');
const historicoODIModel = use('App/Models/Mongo/HistoricoODIElogios');
const gestoresModel = use('App/Models/Mysql/Gestores');
const exception = use('App/Exceptions/Handler')
const { validate } = use('Validator')
const funciModel = use('App/Models/Mysql/Funci');
const {capitalize} = use('StringUtils');
const {sendMail} = use('SendMail');
const jsonExport = use('App/Commons/JsonExport');

const moment = use('App/Commons/MomentZone');


const DEFAULT_REMETENTE_EMAILS = "divar@bb.com.br";
const SEM_IMPEDIMENTO = 'Sem impedimento';
const TITULO_MSG = "Registro de Elogio";

class ElogioController {

  async find({request,response}){

    const {id} = request.allParams();

    if (!id)  {
      throw new exception('Id do elogio não informado', 400);
    }

    //O has do mongo deve ter, no máximo, 24 caracteres
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new exception('Formato do id inválido', 400);
    }

    const elogio = await elogiosModel.findById(id);

    if (!elogio) {
      throw new exception('Elogio não localizado!', 400);
    }

    return response.ok(elogio);
  }

  async findAll({request,response}){

    let params = request.allParams();

    if(!params.tipo){
      return response.badRequest("Tipo não informado");
    }

    let autorizado = null;

    switch (params.tipo) {
        case 'pendentes':
            autorizado = false;
            break;

        case 'autorizados':
            autorizado = true;
            break;
        default:
            return response.badRequest("Tipo não informado");
    }

    let elogios;

    if (params.dadosBasicos) {
        elogios = await elogiosModel.find({autorizado}).select("id dataCriacao")
    } else {

      let findQuery = { $match : { autorizado : autorizado } };

      let fields = { $addFields: {
        "id": "$_id",
        "fonteElogio": "$formData.fonteElogio"
      }};

      //excluindo o formData por ser o maior campo e nao ser necessario 
      //na apresentacao da tabela.
      let project = {
        $project: {
          "formData": false
        }
      }
  
      let sortFields = {
        $sort: { dataCriacao : -1 }
      }

       elogios = await elogiosModel.aggregate([ findQuery, fields, project, sortFields ]) 
    }

    if (!elogios) {
      return response.badRequest("Elogios não localizados!");
    }

    return response.ok(elogios);

  }

  async findAllHistorico({request,response}){

    let historico = await historicoElogiosModel.find({}).sort({dataRegistro: 'desc'}).limit(150);
    if(historico.length == 0){
      return response.badRequest('Falha ao obter a lista de históricos de elogios.');
    }
    return response.ok(historico);
  }

  async findAllHistoricoODI({request,response}){

    let historicoODI = await historicoODIModel.find({}).sort({dataRegistro: 'desc'});

    if(!historicoODI){
      return response.notFound('Falha ao obter a lista de históricos ODI de elogios.');
    }

    return response.ok(historicoODI);

  }

  async salvarElogio({request,response,session}){

    const schema = {
      listaFuncis: 'array|required_without_all:listaDependencias',
      listaDependencias: 'array|required_without_all:listaFuncis',
      formData: 'required|object'
    };

    const  {id, listaDependencias, listaFuncis, formData} = request.allParams();

    const validation = await validate({
      listaFuncis,
      listaDependencias,
      formData
    }, schema);

    if (validation.fails()) {
      throw new exception("Função salvar elogios não recebeu todos os parâmetros obrigatórios", 400);
    }

    let dadosUsuario = session.get('currentUserAccount');
    let dadosAutor = {
        matricula: dadosUsuario.chave,
        nome: dadosUsuario.nome_usuario,
        nomeFuncao: dadosUsuario.nome_funcao
      };

    //Caso não exista o id, significa que é um novo registro
    if (!id) {
        let saveData = {
          dataCriacao: moment().toDate(),
          dadosAutor,
          listaFuncis,
          listaDependencias,
          formData
        };

        let elogio = new elogiosModel(saveData);

        await elogio.save();

        if(elogio.isNew){
          throw new exception(`Não foi possível salvar elogio no banco de dados. Funcionário logado: ${dadosUsuario.chave}. SaveData: ${JSON.stringify(saveData)}`, 500);
        }

        saveData = {
          elogio: elogio.id,
          dataRegistro: moment().toDate(),
          dadosAutor,
          acao: 'Criação de elogio'
        };

        //registra o historico
        let historicoElogio = new historicoElogiosModel(saveData)

        await historicoElogio.save();

        if(elogio.isNew){
          throw new exception(`Não foi possível salvar elogio no banco de dados. Funcionário logado: ${dadosUsuario.chave}`, 500);
        }


        return response.ok({ id: elogio.id });

    //Caso seja a atualização de um elogio
    } else {

        let updateData = {
            listaFuncis,
            listaDependencias,
            formData
        };

        let elogio = await elogiosModel.findByIdAndUpdate(id, updateData);

        if (elogio) {

          let saveData = {
            elogio: elogio.id,
            dataRegistro: moment().toDate(),
            dadosAutor,
            acao: 'Alteração de elogio'
          };

          //registra o historico
          let historicoElogio = new historicoElogiosModel(saveData)

          await historicoElogio.save();

          if(elogio.isNew){
            throw new exception(`Não foi possível salvar elogio no banco de dados. Funcionário logado: ${dadosUsuario.chave}`, 500);
          }

        }

        return response.ok({ id: elogio.id });
    }
  }

  async deleteElogio({request,response}){

    let {id} = request.allParams();

    if (!id) {
      throw new exception("Função deletar elogios não recebeu todos os parâmetros obrigatórios", 400);
    }

    let teste = await elogiosModel.findByIdAndRemove(id);

    if(!teste){
      throw new exception(`Elogio não localizado para exclusão.Id do elogio: ${id}`, 404);
    }
    return response.ok({id});
  }

  async autorizarEnvios({request,response,session}){

    let {listaEnvio} = request.allParams();

    if (!listaEnvio) {
      throw new exception('Falha ao autoriza envio: Lista de envio não informada.', 400);
    }

    //iniciando o loop de envio dos emails dos elogios.
    //array com as mensagens formatadas prontas para envio.
    const listaPendentesEnvios = [];
    const listaPrefixoFunciODI = [];

    let dadosUsuario = session.get('currentUserAccount');

    for (const idElogio of listaEnvio) {
        let elogio = await elogiosModel.findById(idElogio).lean();
        if (elogio) {
            let {listaFuncis, listaDependencias, formData} = elogio;
            //loops nos funcis
            for (const funci of listaFuncis) {
                let funciODI = await this._funciTemODI(funci.matricula);

                if (funciODI) {
                    listaPrefixoFunciODI.push(funci.prefixo);
                    //Funci com ODI - preenche entrada no histórico
                    let registroODI = await this._getODIFunci(funci.matricula);

                    let dadosODI = new historicoODIModel({
                        dataRegistro: moment().toDate(),
                        dadosAutorizador: {
                            matricula: dadosUsuario.chave,
                            nome: dadosUsuario.nome_usuario,
                            nomeFuncao: dadosUsuario.nome_funcao
                        },
                        dadosODI: {...funci, odi: registroODI},
                        elogio: idElogio
                    });


                    //insere o historico do ODI
                    await dadosODI.save();

                    //continua para o proximo funci
                    continue;
                }

                let nomeFunciCaptalizado = funci.nomeGuerra ? funci.nomeGuerra : funci.nome;
                nomeFunciCaptalizado = capitalize(nomeFunciCaptalizado);

                let emailParams = {
                    nome: nomeFunciCaptalizado,
                    dataElogio: moment(formData.dataElogio).format("DD/MM/YYYY HH:mm"),
                    fonteElogio: (formData.fonteElogio === "Outros") ? formData.outros : formData.fonteElogio,
                    textoElogio: formData.textoElogio
                }

                let templateEmail = this._getTemplateHtmlElogio(emailParams);
                let emailsCopia = await this._getEmailsParaCopia(funci.prefixo);
                let tituloMensagem = TITULO_MSG + " - " + nomeFunciCaptalizado;

                //gerando o registro para a lista de envios
                let emailDataPendente = {
                    from: DEFAULT_REMETENTE_EMAILS,
                    to: funci.email,
                    subject: tituloMensagem,
                    body: templateEmail,
                    cc: emailsCopia
                }

                listaPendentesEnvios.push(emailDataPendente);
            }

            //faz o loop das dependencias
            for (const dependencia of listaDependencias) {
                if (listaPrefixoFunciODI.includes(dependencia.prefixo)) {
                  continue;
                }

                let nomeDepCaptalizado = dependencia.nome;

                let emailParams = {
                    dependencia: nomeDepCaptalizado,
                    dataElogio: moment(formData.dataElogio).format("DD/MM/YYYY HH:mm"),
                    fonteElogio: (formData.fonteElogio === "Outros") ? formData.outros : formData.fonteElogio,
                    textoElogio: formData.textoElogio
                }

                let templateEmail = this._getTemplateHtmlElogio(emailParams);
                let emailsCopia = await this._getEmailsParaCopia(dependencia.prefixo);
                let tituloMensagem = TITULO_MSG + " - " + nomeDepCaptalizado;

                //gerando o registro para a lista de envios
                let emailDataPendente = {
                    from: DEFAULT_REMETENTE_EMAILS,
                    to: dependencia.email.toLowerCase(),
                    subject: tituloMensagem,
                    body: templateEmail,
                    cc: emailsCopia
                }

                listaPendentesEnvios.push(emailDataPendente);
            }
        }
    }

    if (listaPendentesEnvios.length) {
        //faz o loop de envio de emails
        for (const dadosEmail of listaPendentesEnvios) {
            //faz o envio efetivo do email
            await sendMail(dadosEmail);
        }
    }

    //marcando os emails como autorizados
    let dadosAutorizador = {
        matricula: dadosUsuario.chave,
        nome: dadosUsuario.nome_usuario,
        nomeFuncao: dadosUsuario.nome_funcao
    };

    for (const idElogio of listaEnvio) {
        let autorizData = {
            autorizado: true,
            dataAutorizacao: moment().toDate(),
            dadosAutorizador: dadosAutorizador
        }

        await elogiosModel.findByIdAndUpdate(idElogio, autorizData);

        //registra o historico
        let historicoAutorizacao = new historicoElogiosModel({
            elogio: idElogio,
            dataRegistro: moment().toDate(),
            dadosAutor: dadosAutorizador,
            acao: 'Autorização e envio de elogio'
        });

        //salva o historico de quem realizou a autorizacao do envio.
        await historicoAutorizacao.save();
    }

    return response.ok();

  }

  async exportarElogios({ request, response, session }) {

    try {
      let findQuery = { $match : { autorizado : true } };

      let fields = { $addFields: {
        "id": "$_id",
        "fonteElogio": "$formData.fonteElogio",
        "dataElogio": "$formData.dataElogio"
      }};

      //excluindo o formData por ser o maior campo e nao ser necessario 
      //na apresentacao da tabela.
      let project = {
        $project: {
          "formData": false
        }
      }
  
      let sortFields = {
        $sort: { dataCriacao : -1 }
      }

      let listaElogios = await elogiosModel.aggregate([ findQuery, fields, project, sortFields ]) 

      if (listaElogios.length) {
        const headers = [
          {key: "identificador", header: "ID"},
          {key: "dataCriacao", header: "Data do Registro"},
          {key: "matriculaAutor", header: "Matrícula Autor"},
          {key: "nomeAutor", header: "Nome Autor"},
          {key: "cargoAutor", header: "Função Autor"},
          {key: "dataAutorizacao", header: "Diretoria"},
          {key: "matriculaAutorizador", header: "Matrícula Autorizador"},
          {key: "nomeAutorizador", header: "Nome Autorizador"},
          {key: "cargoAutorizador", header: "Função Autorizador"},
          {key: "dataElogio", header: "Data do Elogio"},
          {key: "fonteElogio", header: "Fonte do Elogio"},
          {key: "elogiado", header: "Elogiado"}, //prefixo | funci
          {key: "prefixo", header: "Prefixo"},
          {key: "nomePrefixo", header: "Nome Dependência"},
          {key: "matricula", header: "Matricula"},
          {key: "nomeElogiado", header: "Nome Funci"},
          {key: "funcao", header: "Cargo/Comissão"},
          {key: "email", header: "Email"},
          {key: "odi", header: "Email Enviado"}
        ];

        const dadosExport = [];
        let id = 1;

        for (const elogio of listaElogios) {
          let listaMatriculas = elogio.listaFuncis;
          let listaDependencias = elogio.listaDependencias;

          let temODI = await historicoODIModel.find({ elogio: elogio.id }).countDocuments();          

          let registroExport = {
            identificador: id++,
            dataCriacao: moment(elogio.dataCriacao).format("DD/MM/YYYY HH:mm"),
            matriculaAutor: elogio.dadosAutor.matricula,
            nomeAutor: elogio.dadosAutor.nome,
            cargoAutor: elogio.dadosAutor.nomeFuncao,
            dataAutorizacao: moment(elogio.dataAutorizacao).format("DD/MM/YYYY HH:mm"),
            matriculaAutorizador: elogio.dadosAutorizador.matricula,
            nomeAutorizador: elogio.dadosAutorizador.nome,
            cargoAutorizador: elogio.dadosAutorizador.nomeFuncao,
            dataElogio: moment(elogio.dataElogio).format("DD/MM/YYYY HH:mm"),
            fonteElogio: elogio.fonteElogio,
            // dataElogio: moment(elogio.formData.dataElogio).format("DD/MM/YYYY HH:mm"),
            // fonteElogio: elogio.formData.fonteElogio,
            odi: temODI ? "N" : "S"
          };

          for (const funci of listaMatriculas) {
            let dadosFunci = {
              elogiado: 'funci',
              prefixo: funci.prefixo,
              nomePrefixo: funci.nome_prefixo,
              matricula: funci.matricula,
              nomeElogiado: funci.nome,
              funcao: funci.cargo,
              email: funci.email
            }

            dadosExport.push({ ...registroExport, ...dadosFunci });
          }

          for (const dependencia of listaDependencias) {
            let dadosDependencia = {
              elogiado: 'prefixo',
              prefixo: dependencia.prefixo,
              nomePrefixo: dependencia.nome,
              email: dependencia.email
            }

            dadosExport.push({ ...registroExport, ...dadosDependencia });
          }

        }
        
        let arquivoExportado = await jsonExport.convert({
          dadosJson: dadosExport, 
          headers, 
          type: "xls"
        });

        await jsonExport.download( response, arquivoExportado );
      }
    } catch (err) {
      //lanca nova excecao para logar no arquivo de erros.
      throw new exception("Falha ao exportar a lista dos elogios. Entre em contato com o admnistrador do sistema.", 400);
    }
  }

  /** Método privados */

  async _funciTemODI(matricula){
    const funci = await funciModel.findBy('matricula',matricula);
    return funci.dt_imped_odi.trim() !== SEM_IMPEDIMENTO;
  }

  async _getODIFunci(matricula){
    // const funci = await funciModel.query().select("dt_imped_odi").table("arhfot01").where("matricula",matricula).fetch();
    const funci = await funciModel.findBy("matricula",matricula);

    return funci.dt_imped_odi.trim();
  }

  async _getEmailGestor(prefixo){

    let respPref = await gestoresModel.findBy('prefixo', prefixo);

    if (respPref) {
        return respPref.email.trim();
    }

    return null;
  }

  async _getEmailsParaCopia(prefixo){

    let arrayPrefs = [];
    let arrayEmails = [];
    // let respPref = await Gestores.find({ where: {prefixo} });
    let respPref = await gestoresModel.query().where('prefixo', prefixo).fetch();
    respPref = respPref.toJSON();
    if (respPref.length) {
        let { email, cd_gerev_juris, cd_super_juris, cd_diretor_juris} = respPref[0];

        if (parseInt(cd_gerev_juris)) {
            arrayPrefs.push(cd_gerev_juris);
        }
        if (parseInt(cd_super_juris)) {
            arrayPrefs.push(cd_super_juris);
        }
        arrayPrefs.push(cd_diretor_juris);

        if (cd_diretor_juris === '9220' || cd_diretor_juris === '9270') {
            //adiciona o prefixo da DIVAR
            arrayPrefs.push('8592');
        }

        //adiciona o email do resposavel pelo prefixo
        if (prefixo !== cd_gerev_juris && prefixo !== cd_super_juris && prefixo !== cd_diretor_juris) {
            arrayEmails.push(email.trim());
            //caso tenha mais de um gestor, adiciona apenas os emails dos demais como copia
            for (let i=1; i < respPref.length; ++i) {
                arrayEmails.push(respPref[i].email.trim());
            }
        }

        //faz a busca dos emails dos demais da cadeia
        for (const pref of arrayPrefs) {
            let email = await this._getEmailGestor(pref);
            if (email) {
                arrayEmails.push(email);
            }
        }
    }

    return arrayEmails;
  }

  _getTemplateHtmlElogio(params){
    let saudacao;
    //cabecalho
    saudacao = `<div style="text-align: right; font-size: 0.7rem; padding: 2px;
                    font-weight:bold; border-bottom: 1px solid rgba(35, 65, 90, .8); color: rgba(35, 65, 90); margin-bottom: 10px;">
                    DIVAR / SuperADM
                </div>`;

    if (params.nome) {
        saudacao += `Olá <strong>${params.nome}</strong>, <br /><br />`;
    } else {
        saudacao += `Campeões da <strong>${params.dependencia}</strong>, <br /><br />`;
    }

    saudacao += `
      Ficamos muito felizes quando recebemos elogios sobre nosso atendimento, em especial quando eles vem pelas redes sociais destacando a atenção de nosso Time com os Clientes! Esse é um sinal de que estamos no caminho certo, cuidando das Pessoas (Colegas, Clientes e Acionistas) para gerar negócios sustentáveis e satisfação do cliente.
      <br /><br />
      Nosso compromisso como Banco do Brasil é estar próximo das pessoas e ajudar a preservar o que é importante para elas, e um atendimento dedicado e resolutivo cumpre esse propósito de aproximar e apaixonar cada vez mais nossos clientes, contribuindo de forma significativa para entrega de percepção de valor!
      <br /><br />
      Em nome de todo o Varejo do BB, parabéns por fazer a diferença!<br /><br />

      DIVAR<br />
      <font size="1" face="Default Sans Serif,Verdana,Arial,Helvetica,sans-serif" color="black">
        &nbsp;DIRETORIA COMERCIAL VAREJO
      </font>  
      <br /><br /><br />`;

    return (
        `${saudacao} Confira abaixo:<br /><br />
        <strong>Dia:</strong> ${params.dataElogio}  <strong>Fonte:</strong> ${params.fonteElogio}<br />
        <br/><strong>Texto de elogio:</strong><br/></br>${params.textoElogio}<br /><br />
        `
    )
  }

}

module.exports = ElogioController