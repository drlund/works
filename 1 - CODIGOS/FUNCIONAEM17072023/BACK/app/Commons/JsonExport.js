const Excel = require('exceljs');
const exception = use('App/Exceptions/Handler');
const Drive = use('Drive');
const md5 = require('md5');
const striptags = require('striptags');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const BASE_PATH = "cache/";
const XLS_TYPE = "xls";
const CSV_TYPE = "csv";

class JsonExport {

    /**
     * Formata os dados para planilha XLS ou CSV.
     * dadosJson = array de objetos
     * type: csv ou xls
     * headers: pode ser passado de dois tipos:
     *      1 - array de strings
     *      2 - array de objetos - os objetos deve estar no formato: { key: "prefixo", header: "Prefixo"}
     *
     * nomeArquivo (opcional) - nome que sera gravado na pasta de cache
     * headerTitle (opcional) - titulo que sera inserido na primeira linha da planilha
     */
    static async convert({dadosJson, headers, type, nomeArquivo, headerTitle, delimiter}) {

      if(!type){
        type = CSV_TYPE;
      }

      let nomeArquivoFinal = nomeArquivo;
      let csvDelimiter = delimiter ? delimiter : ";";

      if(!nomeArquivoFinal){
        let hashString = (new Date()).getTime();
        nomeArquivoFinal = md5(hashString);
      }

      if(type !== CSV_TYPE && type !== XLS_TYPE){
        throw new exception(`Os tipos disponíveis são csv ou xls, recebido ${type}`, 500);
      }

      let firstRow = dadosJson[0];
      const workbookColumns = [];
      let dataset = [];

      if (Array.isArray(firstRow)) {
        let finalHeaders = headers;

        if (headers && !Array.isArray(headers)) {
          finalHeaders = Object.keys(headers);
        }

        //removendo as tags html e convertendo as entidades para os caracteres nativos
        finalHeaders = finalHeaders.map((elem) => entities.decode(striptags(elem)));

        //cria o specification a partir de um array
        for (let i=0; i < firstRow.length; i++) {
            // Configura o header de acordo com o tipo recebido
            let header = type === XLS_TYPE ?
              { richText: [{ font: {bold: true}, text: finalHeaders[i] || (i+1)}]} :  // Caso XLS
              (finalHeaders[i] || (i+1)); // Caso CSV
            workbookColumns.push({ header, key: (i+1) })
        }

        //converte os dados para objeto
        for (const linha of dadosJson) {
            let objTmp = {};

            for (let i=0; i < linha.length; i++) {
                objTmp[(i+1)] = linha[i];
            }

            dataset.push(objTmp);
        }

      } else {
        dataset = dadosJson;

        if (headers && headers.length && Array.isArray(headers[0])) {
          throw new exception("Dados do JSON do tipo objeto e elementos do header do tipo array!", 500);
        }

        //adiciona as colunas ao array de objetos columns esperado pelo compenente exceljs
        for (const column of headers) {
          //removendo as tags html e convertendo as entidades para os caracteres nativos
          let headerText = entities.decode(striptags(column.header));
          let headerKey = column.key;

          let header = type === XLS_TYPE ?
            { richText: [{ font: {bold: true}, text: headerText }]} :  // Caso XLS
            headerText; // Caso CSV

          workbookColumns.push({  header: header, key: headerKey });
        }
      }


      const workbook = new Excel.Workbook(); //creating workbook
      const worksheet = workbook.addWorksheet('Dados'); //creating worksheet

      if (type === XLS_TYPE) {
        if (headerTitle && headerTitle.length) {
          worksheet.addRow([headerTitle]);
          worksheet.mergeCells(1,1,1,workbookColumns.length);
          worksheet.getCell("A1").alignment = { horizontal: 'left'};
          worksheet.getCell("A1").font = { bold: true };
          worksheet.getCell('A1').border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          };

          let newColumns = [];
          let headersValues = [];
          for (const col of workbookColumns) {
            newColumns.push({key: col.key});
            headersValues.push(col.header)
          }

          worksheet.addRow(headersValues);
          worksheet.columns = newColumns;

          for (const reg of dataset) {
            worksheet.addRow(reg);
          }

          //inclui o auto-filtro na segunda linha
          worksheet.autoFilter = {
            from: {
              row: 2,
              column: 1
            },
            to: {
              row: dataset.length + 2,
              column: workbookColumns.length
            }
          }


        } else {
          //adiciona as colunas do cabecalho
          worksheet.columns = workbookColumns;

          // Adiciona as linhas dos registros
          worksheet.addRows(dataset);

          //inclui o auto-filtro na primeira linha
          worksheet.autoFilter = {
            from: {
              row: 1,
              column: 1
            },
            to: {
              row: dataset.length + 1,
              column: workbookColumns.length
            }
          }
        }

      } else {
        //adiciona as colunas do cabecalho
        worksheet.columns = workbookColumns;

        // Adiciona as linhas dos registros
        worksheet.addRows(dataset);
      }

      switch (type) {
        case CSV_TYPE:
          nomeArquivoFinal += ".csv";
          var options = {
            dateFormat: 'DD/MM/YYYY HH:mm:ss',
            dateUTC: true, // use utc when rendering dates,
            formatterOptions: {
              delimiter: csvDelimiter,
              quote: true,
              quoteColumns: true,
              writeBOM: true
            }
          };

          await workbook.csv.writeFile(`${BASE_PATH}${nomeArquivoFinal}`, options);
          break;
        case XLS_TYPE:
          nomeArquivoFinal += ".xlsx" ;
          await workbook.xlsx.writeFile(`${BASE_PATH}${nomeArquivoFinal}`);
          break
      }

      return `${BASE_PATH}${nomeArquivoFinal}`;
    }

    /**
     * Metodo utilitario que envia os dados ao cliente e remove o arquivo.
     * @param {*} param0
     */
    static async download(response, filename) {
      response.download(filename);

      //caminho relativo ao diretorio app
      let relativeFilename = "../" + filename;
      const exists = await Drive.exists(relativeFilename);

      if (exists) {
        await Drive.delete(relativeFilename);
      }
    }

}

module.exports = JsonExport