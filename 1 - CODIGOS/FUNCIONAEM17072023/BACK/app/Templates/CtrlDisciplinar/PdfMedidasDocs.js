'use strict'

const PDFDocument = require('pdfkit');
const moment = require('moment');
const _ = require('lodash');
const Helpers = use('Helpers');
const fs = require('fs');
const Drive = use('Drive');
const md5 = require('md5');
const exception = use("App/Exceptions/Handler");


module.exports = {
  PdfAdvertencia: ({ docGedip }) => {

    // Create a new PDFDocument
    let doc = new PDFDocument({
      margins: {
        top: 50,
        bottom: 50,
        left: 85,
        right: 72
      }
    });

    const hash = md5(docGedip);

    let filePath = `tmp/${hash}`;

    let fileStream = fs.createWriteStream(filePath);

    // envia para o HTTP response
    doc.pipe(fileStream);

    /* Cabeçalho */
    doc.font('Helvetica')
    doc.fontSize(12)

    doc.text(docGedip.headers.header2.trim(), {
      align: 'right'
    })
    doc.moveDown(2)

    doc.font('Helvetica-Bold').text(docGedip.headers.header3.trim(), {
      align: 'right'
    })
    doc.moveDown();

    /* Fim cabeçalho */

    /* Parágrafos */
    doc.fontSize(12)
    doc.font('Helvetica')
    doc.text(docGedip.paragraphs.paragraph01.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph02.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph03, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph04, {
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph05, {
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph06, {
        paragraphGap: 2
      })
    doc.moveDown()

    doc.font('Helvetica')
    doc.text(docGedip.paragraphs.paragraph07.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph08.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph09.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph10.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph11.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.font('Helvetica')
      .text(docGedip.paragraphs.paragraph12, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph1201, {
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph1202, {
        continued: true
      })
      .font('Helvetica')
      .fillColor('blue')
      .text(docGedip.paragraphs.paragraph1203, {
        underline: true,
        paragraphGap: 2
      })
      .fillColor('black')
      .moveDown();

    /* Fim parágrafos */

    /* Assinaturas*/

    doc.text('_____________________________________', {
      align: 'left'
    })
      .fontSize(11)
      .text(docGedip.footers.footer1.trim(), {
        align: 'left',
        lineBreak: true
      })
      .text(docGedip.footers.footer2.trim())
      .moveDown(2)

    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })
    doc.moveDown(2)

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.text(docGedip.footers.footer4.trim(), {
      align: 'left'
    })

    /* Fim assinaturas */

    // Finalizando o PDF e fechando a STREAM
    doc.end();

    return filePath;

  },

  PdfDestituicao: ({ docGedip }) => {

    // Create a new PDFDocument
    let doc = new PDFDocument({
      margins: {
        top: 40,
        bottom: 30,
        left: 85,
        right: 72
      }
    });

    const hash = md5(docGedip);

    let filePath = `tmp/${hash}`;

    // envia para o HTTP response
    doc.pipe(fs.createWriteStream(filePath));

    /* Cabeçalho */
    doc.fontSize(12)
      .text(docGedip.headers.header2.trim(), {
        align: 'right'
      })
      .moveDown(2)

    doc.text(docGedip.headers.header3.trim(), {
      align: 'right'
    })
    doc.moveDown()

    /* Fim cabeçalho */

    /* Parágrafos */
    doc.fontSize(12)
    doc.text(docGedip.paragraphs.paragraph01.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph02.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph03, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0301, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph0302, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0303, {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown()

    doc.font('Helvetica')
    doc.text(docGedip.paragraphs.paragraph04.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph05.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph06.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph07.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph08.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph09.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.font('Helvetica')
      .text(docGedip.paragraphs.paragraph10, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph1001, {
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph1002, {
        continued: true
      })
      .font('Helvetica')
      .fillColor('blue')
      .text(docGedip.paragraphs.paragraph1003, {
        underline: true,
        paragraphGap: 2
      })
      .fillColor('black')
      .moveDown();

    /* Fim parágrafos */

    /* Assinaturas*/

    doc.text('_____________________________________', {
      align: 'left'
    })
      .fontSize(11)
      .text(docGedip.footers.footer1.trim(), {
        align: 'left',
        lineBreak: true
      })
      .text(docGedip.footers.footer2.trim())
      .moveDown(2)

    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })
    doc.moveDown(2)

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.text(docGedip.footers.footer4.trim(), {
      align: 'left'
    })

    /* Fim assinaturas */

    // Finalizando o PDF e fechando a STREAM
    doc.end();

    // return content;
    return filePath;
  },

  PdfSuspensao: ({ docGedip }) => {

    // Create a new PDFDocument
    let doc = new PDFDocument({
      margins: {
        top: 40,
        bottom: 30,
        left: 85,
        right: 72
      }
    });

    const hash = md5(docGedip);

    let filePath = `tmp/${hash}`;

    // envia para o HTTP response
    doc.pipe(fs.createWriteStream(filePath));

    /* Cabeçalho */
    doc.fontSize(12)

    doc.text(docGedip.headers.header2.trim(), {
      align: 'right'
    })
    doc.moveDown()

    doc.text(docGedip.headers.header3.trim(), {
      align: 'right'
    })
    doc.moveDown()

    /* Fim cabeçalho */

    /* Parágrafos */
    doc.fontSize(12)
    doc.text(docGedip.paragraphs.paragraph01.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph02.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph03, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0301, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph0302, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0303, {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph04.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph05.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph06.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph07.trim(), {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown()

    doc.font('Helvetica')
      .text(docGedip.paragraphs.paragraph08.trim(), {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph09.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.font('Helvetica')
      .text(docGedip.paragraphs.paragraph10, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph1001, {
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph1002, {
        continued: true
      })
      .font('Helvetica')
      .fillColor('blue')
      .text(docGedip.paragraphs.paragraph1003, {
        underline: true,
        paragraphGap: 2
      })
      .fillColor('black')
      .moveDown();
    /* Fim parágrafos */

    doc.addPage();
    /* Assinaturas*/

    doc.text('_____________________________________', {
      align: 'left'
    })
      .fontSize(11)
      .text(docGedip.footers.footer1.trim(), {
        align: 'left',
        lineBreak: true
      })
      .text(docGedip.footers.footer2.trim())
      .moveDown(2)

    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })
    doc.moveDown(2)

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.text(docGedip.footers.footer4.trim(), {
      align: 'left'
    })

    /* Fim assinaturas */

    // Finalizando o PDF e fechando a STREAM
    doc.end();

    // return content;
    return filePath;
  },

  PdfTermoCiencia: ({ docGedip }) => {

    // Create a new PDFDocument
    let doc = new PDFDocument({
      margins: {
        top: 50,
        bottom: 50,
        left: 85,
        right: 72
      }
    });

    const hash = md5(docGedip);

    let filePath = `tmp/${hash}`;

    // envia para o HTTP response
    doc.pipe(fs.createWriteStream(filePath));

    /* Cabeçalho */
    doc.fontSize(12)

    doc.text(docGedip.headers.header2.trim(), {
      align: 'right'
    })
    doc.moveDown(2)

    doc.text(docGedip.headers.header3.trim(), {
      align: 'right'
    })
    doc.moveDown();

    /* Fim cabeçalho */

    /* Parágrafos */
    doc.fontSize(12);
    doc.text(docGedip.paragraphs.paragraph01, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph02, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    // parágrafo com texto em negrito
    doc.font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph03, {
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0301, {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown();

    //
    doc.font('Helvetica');
    doc.text(docGedip.paragraphs.paragraph04, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph05, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph06, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph07, {
      align: 'justify',
      paragraphGap: 2
    })

    doc.moveDown(2);


    /* Fim parágrafos */

    /* Assinaturas*/


    doc.text('_____________________________________', {
      align: 'left'
    })
      .fontSize(11)
      .text(docGedip.footers.footer1.trim(), {
        align: 'left',
        lineBreak: true
      })
      .text(docGedip.footers.footer2.trim())
      .moveDown(2)

    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })
    doc.moveDown(2)

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.text(docGedip.footers.footer4.trim(), {
      align: 'left'
    })

    /* Fim assinaturas */

    // Finalizando o PDF e fechando a STREAM
    doc.end();

    // return content;
    return filePath;
  },

  PdfRespPecuniariaCiencia: ({ docGedip }) => {

    // Create a new PDFDocument
    let doc = new PDFDocument({
      margins: {
        top: 40,
        bottom: 35,
        left: 85,
        right: 72
      }
    });

    const hash = md5(docGedip);

    let filePath = `tmp/${hash}`;

    // envia para o HTTP response
    doc.pipe(fs.createWriteStream(filePath));


    /* Cabeçalho */
    doc.fontSize(12)

    doc.text(docGedip.headers.header2.trim(), {
      align: 'right'
    })
    doc.moveDown()

    doc.text(docGedip.headers.header3.trim(), {
      align: 'right'
    })
    doc.moveDown();

    /* Fim cabeçalho */

    /* Parágrafos */
    doc.fontSize(12);
    doc.text(docGedip.paragraphs.paragraph01.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph02.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph03, {
        align: 'justify',
        paragraphGap: 2
      })
      .moveDown();

    doc.font('Helvetica')
      .text(docGedip.paragraphs.paragraph04, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph05, {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown()

    doc.font('Helvetica')
      .text(docGedip.paragraphs.paragraph08, {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph09, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph10, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph11, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph12, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph13, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph14, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.addPage();

    doc.font('Helvetica')
      .text(docGedip.paragraphs.paragraph15, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph1501, {
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph1502, {
        continued: true
      })
      .font('Helvetica')
      .fillColor('blue')
      .text(docGedip.paragraphs.paragraph1503, {
        underline: true,
        paragraphGap: 2
      })
      .fillColor('black')
      .moveDown();

    /* Fim parágrafos */

    /* Assinaturas*/


    doc.text('_____________________________________', {
      align: 'left'
    })
      .fontSize(11)
      .text(docGedip.footers.footer1.trim(), {
        align: 'left',
        lineBreak: true
      })
      .text(docGedip.footers.footer2.trim())
      .moveDown(2)

    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })
    doc.moveDown(2)

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.text(docGedip.footers.footer4.trim(), {
      align: 'left'
    })

    /* Fim assinaturas */

    // Finalizando o PDF e fechando a STREAM
    doc.end();

    // return content;
    return filePath;

  },

  PdfRespPecuniariaAdvertencia: ({ docGedip }) => {

    // Create a new PDFDocument
    let doc = new PDFDocument({
      margins: {
        top: 40,
        bottom: 35,
        left: 85,
        right: 72
      }
    });

    const hash = md5(docGedip);

    let filePath = `tmp/${hash}`;

    // envia para o HTTP response
    doc.pipe(fs.createWriteStream(filePath));


    /* Cabeçalho */
    doc.fontSize(12)

    doc.text(docGedip.headers.header2.trim(), {
      align: 'right'
    })
    doc.moveDown()

    doc.text(docGedip.headers.header3.trim(), {
      align: 'right'
    })
    doc.moveDown();

    /* Fim cabeçalho */

    /* Parágrafos */
    doc.fontSize(12);
    doc.text(docGedip.paragraphs.paragraph01, {
      align: 'justify',
      paragraphGap: 2,
      continued: true
    }).font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph0102, {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph02, {
      align: 'justify',
      paragraphGap: 2
    }).moveDown();

    doc.font('Helvetica')
      .text(docGedip.paragraphs.paragraph03, {
        align: 'justify',
        continued: true
      }).font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph0302, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0303, {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph04, {
      align: 'justify',
      paragraphGap: 2
    }).moveDown();

    doc.text(docGedip.paragraphs.paragraph05, {
      align: 'justify',
      paragraphGap: 2
    }).moveDown();

    doc.text(docGedip.paragraphs.paragraph06, {
      align: 'justify',
      paragraphGap: 2
    }).moveDown();

    doc.text(docGedip.paragraphs.paragraph07, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph08, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph09, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph10, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.addPage();

    doc.font('Helvetica')
      .text(docGedip.paragraphs.paragraph11, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph1101, {
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph1102, {
        continued: true
      })
      .font('Helvetica')
      .fillColor('blue')
      .text(docGedip.paragraphs.paragraph1103, {
        underline: true,
        paragraphGap: 2
      })
      .fillColor('black')
      .moveDown();

    /* Fim parágrafos */

    /* Assinaturas*/


    doc.text('_____________________________________', {
      align: 'left'
    })
      .fontSize(11)
      .text(docGedip.footers.footer1.trim(), {
        align: 'left',
        lineBreak: true
      })
      .text(docGedip.footers.footer2.trim())
      .moveDown(2)

    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })
    doc.moveDown(2)

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.text(docGedip.footers.footer4.trim(), {
      align: 'left'
    })

    /* Fim assinaturas */

    // Finalizando o PDF e fechando a STREAM
    doc.end();

    // return content;
    return filePath;

  },

  PdfDemissao: ({ docGedip }) => {

    // Create a new PDFDocument
    let doc = new PDFDocument({
      margins: {
        top: 50,
        bottom: 50,
        left: 72,
        right: 72
      }
    });

    const hash = md5(docGedip);

    let filePath = `tmp/${hash}`;

    // envia para o HTTP response
    doc.pipe(fs.createWriteStream(filePath));

    /**AUTORIZACAO DE DEBITO **/

    /* Cabeçalho */
    doc.fontSize(12)
    doc.text(docGedip.docAutDebt.paragraph01.trim(), {
      align: 'right'
    })
    doc.moveDown(2)

    doc
      .text(docGedip.docAutDebt.paragraph02.trim(), {
        align: 'left'
      })
      .text(docGedip.docAutDebt.paragraph03.trim(), {
        align: 'left'
      })
      .text(docGedip.docAutDebt.paragraph04.trim(), {
        align: 'left'
      })
      .moveDown(3)

    /* Fim cabeçalho */

    /* Parágrafos */

    doc.fontSize(12);

    doc.text(docGedip.docAutDebt.paragraph05.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown(3);

    doc.text(docGedip.docAutDebt.paragraph06.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown(3);

    doc.text(docGedip.docAutDebt.paragraph07.trim(), {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown(3);

    doc.text(docGedip.docAutDebt.paragraph08.trim(), {
      align: 'justify',
      paragraphGap: 2
    })

    doc.moveDown(10);

    /* Fim parágrafos */

    /* Assinaturas*/

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.fontSize(12)
    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })
    doc.moveDown()

    doc.addPage();

    /** COMUNICADO QUITACAO **/

    // título

    doc.fontSize(14)
      .font('Helvetica-Bold')
      .text(docGedip.docDataQuitacao.paragraph01.trim(), {
        align: 'center'
      })
      .text(docGedip.docDataQuitacao.paragraph02.trim(), {
        align: 'center'
      })
      .moveDown(3)

    doc.fontSize(12)
      .font('Helvetica')
      .text(docGedip.docDataQuitacao.paragraph03.trim(), {
        align: 'right'
      })
      .text(docGedip.docDataQuitacao.paragraph04.trim(), {
        align: 'right'
      })
      .moveDown(3)

    // corpo

    doc.fontSize(12)
      .text(docGedip.docDataQuitacao.paragraph05.trim(), {
        align: 'left'
      })
      .moveDown(3)

    doc.fontSize(12)
      .text(docGedip.docDataQuitacao.paragraph06.trim(), {
        align: 'left'
      })
      .moveDown(3)

    doc.fontSize(12)
      .text(docGedip.docDataQuitacao.paragraph07, {
        align: 'justify',
        ident: 200
      })
      .moveDown(5)

    doc.text('___________________________________________', {
      align: 'center'
    })
    doc.fontSize(12)
    doc.text(docGedip.footers.footer1.trim(), {
      align: 'center'
    })
    doc.moveDown()
      .moveDown(14)

    // rodapé

    doc.text(docGedip.footers.footer2.trim(), {
      align: 'left'
    })
    doc.moveDown(3)

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })

    /* Fim assinaturas */

    doc.addPage();

    /** COMUNICACAO DE DEMISSAO **/

    doc.fontSize(14)
      .font('Helvetica-Bold')
      .text(docGedip.docComunicDemissao.paragraph01.trim(), {
        align: 'center'
      })
      .moveDown()

    doc.fontSize(12)
      .font('Helvetica')
      .text(docGedip.docComunicDemissao.paragraph02.trim(), {
        align: 'right'
      })
      .text(docGedip.docComunicDemissao.paragraph03.trim(), {
        align: 'right'
      })
      .moveDown(2)

    /** corpo **/

    doc.fontSize(10)
      .font('Helvetica')
      .text(docGedip.docComunicDemissao.paragraph04.trim(), {
        align: 'left'
      })
      .moveDown(2)

    doc.fontSize(12)
      .font('Helvetica')
      .text(docGedip.docComunicDemissao.paragraph05.trim(), {
        align: 'justify'
      })
      .moveDown(2)

    doc.fontSize(12)
      .font('Helvetica')
      .text(docGedip.docComunicDemissao.paragraph06, {
        align: 'justify'
      })
      .moveDown()

    doc.fontSize(12)
      .font('Helvetica')
      .text(docGedip.docComunicDemissao.paragraph07, {
        align: 'justify'
      })
      .moveDown()

    doc.fontSize(12)
      .font('Helvetica')
      .text(docGedip.docComunicDemissao.paragraph08, {
        align: 'justify'
      })
      .moveDown()

    doc.fontSize(12)
      .font('Helvetica')
      .text(docGedip.docComunicDemissao.paragraph09, {
        align: 'justify'
      })
      .moveDown()

    doc.fontSize(12)
      .font('Helvetica')
      .text(docGedip.docComunicDemissao.paragraph10, {
        align: 'justify'
      })
      .moveDown()

    /** Lista */
    doc.fontSize(12)
      .font('Helvetica')
      .list([
        docGedip.docComunicDemissao.paragraph11.trim(),
        docGedip.docComunicDemissao.paragraph12.trim(),
        docGedip.docComunicDemissao.paragraph13.trim(),
        docGedip.docComunicDemissao.paragraph14.trim(),
        docGedip.docComunicDemissao.paragraph15.trim()
      ])
      .moveDown(2)

    /** Fim Lista */

    /** rodapé */

    doc.text('_____________________________________', {
      align: 'center'
    })
    doc.fontSize(12)
    doc.text(docGedip.footers.footer1.trim(), {
      align: 'center'
    })
    doc.moveDown(2)

    doc.text(docGedip.footers.footer2.trim(), {
      align: 'left'
    })
    doc.moveDown(3)

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })

    /** Fim Rodapé */

    doc.addPage()

    /** Encaminhamento para Exame Médico Demissional **/

    doc.fontSize(14)
      .font('Helvetica-Bold')
      .text(docGedip.docEncExames.paragraph01.trim(), {
        align: 'center'
      })
      .moveDown(2)

    doc.fontSize(12)
      .font('Helvetica')
      .text(docGedip.docEncExames.paragraph02.trim(), {
        align: 'right'
      })
      .text(docGedip.docEncExames.paragraph03.trim(), {
        align: 'right'
      })
      .moveDown(4)

    /** corpo **/

    doc.fontSize(12)
      .font('Helvetica')
      .text(docGedip.docEncExames.paragraph04.trim(), {
        align: 'left'
      })
      .text(docGedip.docEncExames.paragraph05.trim(), {
        align: 'left'
      })
      .text(docGedip.docEncExames.paragraph06.trim(), {
        align: 'left'
      })
      .moveDown(4)

    doc.fontSize(12)
      .font('Helvetica')
      .text(docGedip.docEncExames.paragraph07, {
        align: 'justify'
      })
      .moveDown(5)

    /** Rodapé */
    doc.text('_____________________________________', {
      align: 'center'
    })
    doc.fontSize(12)
    doc.text(docGedip.footers.footer1.trim(), {
      align: 'center'
    })
    doc.moveDown(17)

    doc
      .text(docGedip.footers.footer2.trim(), {
        align: 'left'
      })
      .moveDown(3)
      .text('_____________________________________', {
        align: 'left'
      })
      .text(docGedip.footers.footer3.trim(), {
        align: 'left'
      })

    /** Fim Rodapé */


    // Finalizando o PDF e fechando a STREAM
    doc.end();

    // return content;
    return filePath;
  },

  PdfEncerrado: ({ docGedip }) => {

    // Create a new PDFDocument
    let doc = new PDFDocument({
      margins: {
        top: 50,
        bottom: 50,
        left: 72,
        right: 72
      }
    });

    const hash = md5(docGedip);

    let filePath = `tmp/${hash}`;

    let fileStream = fs.createWriteStream(filePath);

    // envia para o HTTP response
    doc.pipe(fileStream);

    /* Cabeçalho */
    doc.font('Helvetica')
    doc.fontSize(12)

    doc.text(docGedip.headers.header2, {
      align: 'right'
    })
    doc.moveDown(2)

    doc.font('Helvetica-Bold').text(docGedip.headers.header3, {
      align: 'right'
    })
    doc.moveDown();

    /* Fim cabeçalho */

    /* Parágrafos */
    doc.fontSize(12)
    doc.font('Helvetica')
    doc.text(docGedip.paragraphs.paragraph01, {
      align: 'justify',
      paragraphGap: 2,
      continued: true
    })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph0102, {
        align: 'justify',
      })
    doc.moveDown();

    doc.font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph02, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0202, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph0203, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0204, {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph03, {
      align: 'justify',
      paragraphGap: 2
    }).moveDown(25);

    /* Fim parágrafos */

    /* Assinaturas*/

    doc.text('_____________________________________', {
      align: 'left'
    })
      .fontSize(11)
      .text(docGedip.footers.footer1.trim(), {
        align: 'left',
        lineBreak: true
      })
      .text(docGedip.footers.footer2.trim())
      .moveDown(2)

    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })
    doc.moveDown(2)

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.text(docGedip.footers.footer4.trim(), {
      align: 'left'
    })

    /* Fim assinaturas */

    // Finalizando o PDF e fechando a STREAM
    doc.end();

    return filePath;

  },

  PdfCasoAbrangido: ({ docGedip }) => {

    // Create a new PDFDocument
    let doc = new PDFDocument({
      margins: {
        top: 50,
        bottom: 50,
        left: 72,
        right: 72
      }
    });

    const hash = md5(docGedip);

    let filePath = `tmp/${hash}`;

    let fileStream = fs.createWriteStream(filePath);

    // envia para o HTTP response
    doc.pipe(fileStream);

    /* Cabeçalho */
    doc.font('Helvetica')
    doc.fontSize(12)

    doc.text(docGedip.headers.header2.trim(), {
      align: 'right'
    })
    doc.moveDown(2)

    doc.font('Helvetica-Bold').text(docGedip.headers.header3.trim(), {
      align: 'right'
    })
    doc.moveDown();

    /* Fim cabeçalho */

    /* Parágrafos */
    doc.fontSize(12)
    doc.font('Helvetica')
    doc.text(docGedip.paragraphs.paragraph01, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph02, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0202, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph0203, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0204, {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown()

    doc.font('Helvetica')
      .text(docGedip.paragraphs.paragraph03, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph0302, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0303, {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph04, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown(20);

    /* Fim parágrafos */

    /* Assinaturas*/

    doc.text('_____________________________________', {
      align: 'left'
    })
      .fontSize(11)
      .text(docGedip.footers.footer1.trim(), {
        align: 'left',
        lineBreak: true
      })
      .text(docGedip.footers.footer2.trim())
      .moveDown(2)

    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })
    doc.moveDown(2)

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.text(docGedip.footers.footer4.trim(), {
      align: 'left'
    })

    /* Fim assinaturas */

    // Finalizando o PDF e fechando a STREAM
    doc.end();

    return filePath;

  },
  PdfCancelado: ({ docGedip }) => {

    // Create a new PDFDocument
    let doc = new PDFDocument({
      margins: {
        top: 50,
        bottom: 50,
        left: 72,
        right: 72
      }
    });

    const hash = md5(docGedip);

    let filePath = `tmp/${hash}`;

    let fileStream = fs.createWriteStream(filePath);

    // envia para o HTTP response
    doc.pipe(fileStream);

    /* Cabeçalho */
    doc.font('Helvetica')
    doc.fontSize(12)
    doc.text(docGedip.headers.header1.trim(), {
      align: 'right'
    })
    doc.moveDown()

    doc.text(docGedip.headers.header2.trim(), {
      align: 'right'
    })
    doc.moveDown(2)

    doc.font('Helvetica-Bold').text(docGedip.headers.header3.trim(), {
      align: 'right'
    })
    doc.moveDown();

    /* Fim cabeçalho */

    /* Parágrafos */
    doc.fontSize(12)
    doc.font('Helvetica')
    doc.text(docGedip.paragraphs.paragraph01, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph02, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0202, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph0203, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0204, {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph03, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown(25);

    /* Fim parágrafos */

    /* Assinaturas*/

    doc.text('_____________________________________', {
      align: 'left'
    })
      .fontSize(11)
      .text(docGedip.footers.footer1.trim(), {
        align: 'left',
        lineBreak: true
      })
      .text(docGedip.footers.footer2.trim())
      .moveDown(2)

    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })
    doc.moveDown(2)

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.text(docGedip.footers.footer4.trim(), {
      align: 'left'
    })

    /* Fim assinaturas */

    // Finalizando o PDF e fechando a STREAM
    doc.end();

    return filePath;

  },

  DownloadPdf: async function (response, fileName) {
    try {
      response.download(fileName);

      //caminho relativo ao diretorio app
      let relativeFilename = "../" + fileName;
      const exists = await Drive.exists(relativeFilename);

      if (exists) {
        await Drive.delete(relativeFilename);
      }
    } catch (error) {
      throw new exception("Problemas ao gerar o documento!");
    }
  },

  DownloadUpPdf: async function (response, filePath) {
    try {
      response.download(Helpers.appRoot(filePath));
    } catch (error) {
      throw new exception("Problemas ao baixar o documento!");
    }
  },

  PdfAlertaEticoNegocial: ({ docGedip }) => {

    // Create a new PDFDocument
    let doc = new PDFDocument({
      margins: {
        top: 40,
        bottom: 30,
        left: 85,
        right: 72
      }
    });

    const hash = md5(docGedip);

    let filePath = `tmp/${hash}`;

    // envia para o HTTP response
    doc.pipe(fs.createWriteStream(filePath));

    /* Cabeçalho */
    doc.fontSize(12)
      .text(docGedip.headers.header2.trim(), {
        align: 'right'
      })
      .moveDown(2)

    doc.text(docGedip.headers.header3.trim(), {
      align: 'right'
    })
    doc.moveDown()

    /* Fim cabeçalho */

    /* Parágrafos */
    doc.fontSize(12)
    doc.text(docGedip.paragraphs.paragraph01, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph02, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph03, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph0301, {
        align: 'justify',
        paragraphGap: 2
      })
    doc.moveDown();

    doc.font('Helvetica')
    doc.text(docGedip.paragraphs.paragraph04, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph05, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph06, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.text(docGedip.paragraphs.paragraph08, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown()

    doc.text(docGedip.paragraphs.paragraph09, {
      align: 'justify',
      paragraphGap: 2
    })
    doc.moveDown();

    doc.font('Helvetica')
      .text(docGedip.paragraphs.paragraph10, {
        align: 'justify',
        continued: true
      })
      .font('Helvetica-Bold')
      .text(docGedip.paragraphs.paragraph1001, {
        continued: true
      })
      .font('Helvetica')
      .text(docGedip.paragraphs.paragraph1002, {
        continued: true
      })
      .font('Helvetica')
      .fillColor('blue')
      .text(docGedip.paragraphs.paragraph1003, {
        underline: true,
        paragraphGap: 2
      })
      .fillColor('black')
      .moveDown();

    /* Fim parágrafos */

    /* Assinaturas*/

    doc.text('_____________________________________', {
      align: 'left'
    })
      .fontSize(11)
      .text(docGedip.footers.footer1.trim(), {
        align: 'left',
        lineBreak: true
      })
      .text(docGedip.footers.footer2.trim())
      .moveDown(2)

    doc.text(docGedip.footers.footer3.trim(), {
      align: 'left'
    })
    doc.moveDown(2)

    doc.text('_____________________________________', {
      align: 'left'
    })
    doc.text(docGedip.footers.footer4.trim(), {
      align: 'left'
    })

    /* Fim assinaturas */

    // Finalizando o PDF e fechando a STREAM
    doc.end();

    // return content;
    return filePath;
  },
}