'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const publicoAlvoModel = use("App/Models/Mysql/AutoridadesSecex/PublicoAlvoAutoridade");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const dadosAutoridadesModel = use("App/Models/Mysql/AutoridadesSecex/DadosAutoridadesSecex");
const dadosCongressoModel = use("App/Models/Mysql/AutoridadesSecex/DadosCongresso");

const exception = use('App/Exceptions/Handler');
const publicoAlvoTransformer = use("App/Transformers/AutoridadesSecex/PublicoAlvoAutoridadesTransformer");
const dadosAutoridadesTransformer = use("App/Transformers/AutoridadesSecex/DadosAutoridadesTransformer");
const Excel = require('exceljs');
var fs = require("fs");
const moment = use("App/Commons/MomentZoneBR");
const baseMoment = require('moment-timezone');
const Database = use('Database')
const jsonExport = use('App/Commons/JsonExport');

class AutoridadesSecexController {

  async getPublicAlvoAutoridades({response, transform}) {
    let listaPublicoAlvo = await publicoAlvoModel.query()
      .with('dadosFunci', builder => {
        builder.with('dependencia')
          .with('nomeGuerra')
      })
      .fetch();

    listaPublicoAlvo = await transform.collection(listaPublicoAlvo.toJSON(), publicoAlvoTransformer);

    return response.send(listaPublicoAlvo);
  }

  async addFunciPublicoAlvo({request, response}) {
    let { matricula } = request.allParams();

    if (!matricula) {
      throw new exception("Matrícula do funcionário não informada!", 400);
    }

    let found = await publicoAlvoModel.find(matricula);

    if (found) {
      throw new exception("Este funcionário já se encontra no público-alvo!", 400);
    }

    try {
      //inclui um novo funci no publico alvo
      await publicoAlvoModel.create({ matricula, blacklist: 0});
      return response.ok();
    } catch(error) {
      throw new exception("Ocorreu um erro ao tentar incluir este funcionário no público-alvo! Contate o administrador do sistema.", 400);
    }
  }

  async deleteFunciPublicoAlvo({request, response}) {
    let { matriculas } = request.allParams();

    if (!matriculas || !matriculas.length) {
      throw new exception("Matrícula(s) para remoção não informadas!", 400);
    }

    try {
      await publicoAlvoModel.query()
        .whereIn('matricula', matriculas)
        .delete();      
      return response.ok();
    } catch (err) {
      throw new exception("Ocorreu um erro ao tentar remover este(s) funcionário(s) do público-alvo! Contate o administrador do sistema.", 400);
    }
  }

  async getDadosAutoridades({response, transform}) {
    let listaDadosAutoridades = await dadosAutoridadesModel.all();
    listaDadosAutoridades = await transform.collection(listaDadosAutoridades.toJSON(), dadosAutoridadesTransformer);
    return response.send(listaDadosAutoridades);
  }

  async processaArquivoAutoridades({request, response}) {
    const arquivo = request.file('file', { size: '20mb' });

    if (arquivo.extname !== "xlsx") {
      throw new exception("Tipo de arquivo inválido. Arquivo dever ser um arquivo excel com extensão xlsx!", 400); 
    }

    var novoAnexo = fs.readFileSync(arquivo.tmpPath);

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(novoAnexo);

    const worksheet = workbook.getWorksheet(1);    
    
    if (!worksheet) {
      throw new exception("Falha ao abrir o arquivo informado! Verifique se está no formato Excel (XLSX).", 400);
    }

    const totalRows = worksheet.actualRowCount;
    
    if (totalRows <= 1) {
      throw new exception("O arquivo informado está vázio!", 400);
    }
    
    const compiledData = [];
    const headersDefs = {
      "Seção": { dbField: "tipo_poder", index: 0},
      "Autoridade": { dbField: "nome", index: 0},
      "Cargo": { dbField: "cargo", index: 0},
      "Órgão": { dbField: "orgao", index: 0},
      "Aniversário": { dbField: "aniversario", index: 0, isBirthdayField: true},
      "Telefone": { dbField: "telefones", index: 0},
      "E-mail": { dbField: "email", index: 0}
    }

    let firstRow = worksheet.getRow(1).values;

    //preenchendo o index de cada coluna
    for (let i=1; i <= firstRow.length; ++i) {
      //pegando o index de cada coluna necessaria do header
      for (let key in headersDefs) {
        if (firstRow[i] === key) {
          headersDefs[key].index = i;
          break;
        }
      }
    }

    //verificando se todas as colunas estão presentes...
    let allColumnsOk = true;
    let columnsError = [];

    for (let key in headersDefs) {
      let value = headersDefs[key];
      if (value.index === 0) {
        allColumnsOk = false;
        columnsError.push(key);
      }
    }

    if (!allColumnsOk) {
      throw new exception("Falha ao processar o arquivo! As colunas " + columnsError.join(',') + " não estão presentes no documento.", 400);
    }

    //todas as colunhas presentes, hora de coletar os dados necessários.
    for (let i=2; i <= totalRows; ++i) {
      let row = worksheet.getRow(i).values;

      let registro = {};

      for (let key in headersDefs) {
        let value = headersDefs[key];
        if (value.isBirthdayField) {
          let baseDate = baseMoment.utc(moment(row[value.index])).format('YYYY-MM-DD');
          registro[value.dbField] = baseDate;
        } else {
          registro[value.dbField] = row[value.index];
        }
      }

      compiledData.push(registro);
    }

    try {
      //limpa a tabela de autoridades
      await dadosAutoridadesModel.query().truncate();

      //insere os novos registros na tabela de autoridades
      await dadosAutoridadesModel.createMany(compiledData);
      response.ok();
    } catch (err) {
      throw new exception("Houve um erro ao processar os dados das autoridades. Entre em contato com os responsáveis.", 400);
    }
  }

  async exportaAniversariantesPorPeriodo({ request, response }) {
    let { dataInicial, dataFinal } = request.allParams();
    let resultado = await this._consultaAniversariantes(dataInicial, dataFinal);

    const headers = [
      {key: "aniversario", header: "Aniverário"},
      {key: "tipo_poder", header: "Tipo Poder"},
      {key: "nome", header: "Nome"},
      {key: "nome_completo", header: "Nome Completo"},
      {key: "cargo_titulo", header: "Cargo/Título"},
      {key: "partido_orgao", header: "Partido/Orgão"},
      {key: "email", header: "E-mail"},
      {key: "telefones", header: "Telefone(s)"},
    ];

    let arquivoExportado = await jsonExport.convert({
      dadosJson: resultado, 
      headers, 
      headerTitle: `Período: ${dataInicial} a ${dataFinal}`,
      type: "xls"
    });

    await jsonExport.download( response, arquivoExportado );
  }

  async getAniversariantesPorPeriodo({request, response }) {
    let { dataInicial, dataFinal } = request.allParams();
    let resultado = await this._consultaAniversariantes(dataInicial, dataFinal);
    response.send(resultado);
  }

  async _consultaAniversariantes(dataInicial, dataFinal) {
    const periodoTest = /^\d{2}-\d{2}$/;

    if (!dataInicial) {
      throw new exception("Data inicial não informada!", 400);
    }

    if (!periodoTest.test(dataInicial)) {
      throw new exception("Data inicial está inválida!", 400);
    }

    if (!dataFinal) {
      throw new exception("Data final não informada!", 400);
    }

    if (!periodoTest.test(dataFinal)) {
      throw new exception("Data final está inválida!", 400);
    }

    dataInicial = '0000-' + dataInicial.split("-").reverse().join("-");
    dataFinal = '0000-' + dataFinal.split("-").reverse().join("-");

    try {
      let resultCongresso = await dadosCongressoModel.query()
        .setHidden(['base64_foto', 'url_foto'])
        .select('*', Database.raw("STR_TO_DATE( DATE_FORMAT(data_nascimento, '%d-%m'), '%d-%m') as order_field"))
        .whereRaw("STR_TO_DATE( DATE_FORMAT(data_nascimento, '%d-%m'), '%d-%m') >= ?", dataInicial)
        .whereRaw("STR_TO_DATE( DATE_FORMAT(data_nascimento, '%d-%m'), '%d-%m') <= ?", dataFinal)
        .orderBy('order_field')
        .fetch();

      let resultSecex = await dadosAutoridadesModel.query()
        .select('*', Database.raw("STR_TO_DATE( DATE_FORMAT(aniversario, '%d-%m'), '%d-%m') as order_field"))
        .whereRaw("STR_TO_DATE( DATE_FORMAT(aniversario, '%d-%m'), '%d-%m') >= ?", dataInicial)
        .whereRaw("STR_TO_DATE( DATE_FORMAT(aniversario, '%d-%m'), '%d-%m') <= ?", dataFinal)
        .orderBy('order_field')
        .fetch();

      return this._unificaResultados(resultCongresso.toJSON(), resultSecex.toJSON());
    } catch (err) {
      throw new exception("Houve um erro ao consultar a lista de aniversariantes. Entre em contato com os responsáveis.", 400);
    }
  }

  _unificaResultados(resutadoCongresso, resultadoSecex) {
    let dados = [];

    for (const reg of resutadoCongresso) {
      dados.push({
        id: 'congresso-' + reg.id,
        key: 'congresso-' + reg.id,
        tipo_poder: reg.tipo_poder,
        nome: reg.nome,
        nome_completo: reg.nome_completo,
        cargo_titulo: reg.tipo,
        partido_orgao: reg.partido + ' - ' + reg.uf,
        aniversario: reg.data_nascimento,
        email: reg.email,
        telefones: !reg.telefone2 ? reg.telefone1 : [reg.telefone1, reg.telefone2].join(', ')
      })
    }

    for (const reg of resultadoSecex) {
      dados.push({
        id: 'secex-' + reg.id,
        key: 'secex-' + reg.id,
        tipo_poder: reg.tipo_poder,
        nome: reg.nome,
        nome_completo: '',
        cargo_titulo: reg.cargo,
        partido_orgao: reg.orgao,
        aniversario: reg.aniversario,
        email: reg.email,
        telefones: reg.telefones
      })
    }

    return dados;
  }

}

module.exports = AutoridadesSecexController
