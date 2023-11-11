const jsPDF = window.jsPDF
const html2canvas = window.html2canvas

const A4Dimensions = {
  'portrait': [210, 297, 6], //[width, height, footerFontSize] in mm
  'landscape': [297, 210, 8]
}

/**
 * Convert pixels para milimetros
 * Reference: https://www.pixelto.net/px-to-mm-converter
 */
const pixelToMM = (pxValue, dpi = 96) => {
  const oneInchInMM = 25.4; //1 inch = 25.4 mm
  const onePixelInDPI = oneInchInMM / dpi
  return pxValue * onePixelInDPI
}

/**
 * Converte mm para pixels.
 */
/*const MMtoPixel = (mmValue) => {
  //densidade de 96dpi
  return Math.ceil(mmValue / 0.26458333);
}*/

/**
 * Calcula os valores corretos para o redimensionamento desejado.
 */
const resizeImage = (oldWidth, oldHeight, newWidth = 0, newHeight = 0) => {
  let width, height;   
  if (newWidth > 0 && newHeight > 0) {
     width = newWidth;      
     height = width * oldHeight / oldWidth;
     if (height > newHeight) {
        height = newHeight;         
        width = height * oldWidth / oldHeight;
     }
  } else if (newWidth > 0) {
     width = newWidth;
     height = width * oldHeight / oldWidth;
  } else {
     height = newHeight;
     width = height * oldWidth / oldHeight;
  }

  return {width, height};
}


/**
 * Metodo utilizado quando passada a opcao safeBreak.
 * Verifica a linha de pixels para identificar a frequencia de uma determinada cor.
 * @param {*} data - array de dados das cores da linha
 * @param {*} red 
 * @param {*} green 
 * @param {*} blue 
 * @param {*} acceptableFrequency - percentual aceitavel da frequencia de repeticao
 */
const hasTargetColor = (data, verifyColor = '#FFFFFF', acceptableFrequency = 60 /* 60% */) => {
  let occorrences = 0;

  let [red, green, blue] = hexToRGB(verifyColor);

  for (var i = 0; i < data.length; i += 4) {
    if (data[i] === red && data[i + 1] === green && data[i + 2] === blue) {
      occorrences++;
    }
  }

  let percValue = Math.trunc((data.length / 4) * (acceptableFrequency / 100));
  return occorrences > percValue;
}

/**
 * Metodo que verifica se os pixels de uma linha sao brancos.
 * @param {*} data 
 */
const isWhiteLine = (data) => {
  return hasTargetColor(data, '#FFFFFF', 80)
}

/**
 * Metodo que verifica se os pixels de uma linha sao pretos.
 * @param {*} data 
 */
const isBlackLine = (data) => {
  return hasTargetColor(data, '#000000', 80)
}

const hexToRGB = (hex, alpha) => {
  if (hex.length === 4 ) {
    hex = hex + hex.substr(1, 3);
  }

  const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
      return [r, g, b, alpha];
  } else {
      return [r, g, b];
  }
}

const html2PDF = (targetId, opts = {}) => {
  // default opts
  opts = Object.assign({
    jsPDF: {},
    imageType: 'image/jpeg',
    // customFont: '',
    output: 'js.pdf', 
    showPageNumbers: false,
    footerText: undefined,
    paddingSize: 5, //in milimeters,
    //verifica quebra de pagina na imagem de forma inteligente
    //lê a ultima linha da pagina na altura de 1px
    safeBreak: false, 
    safeBreakConfig: {
      checkBlackLine: true, //verifica se uma linha em branco permite uma quebra de pagina segura
      checkWhiteLine: true, //verifica se uma linha preta permite uma quebra de pagina segura
      checkColorLine: null, //verifica se uma linha com uma determinada cor permite uma quebra de pagina segura      
      acceptableFrequency: 60 //frequencia em percentual para aceitar que a linha possui a cor indicada
    },
    success: function(pdf) {
      pdf.save(opts.output);
      opts.onFinished();
    }
  }, opts);

  //DOM element to print
  const dom = document.getElementById(targetId);

  //configura opcoes do safeBreak
  if (opts.safeBreak) {
    if (opts.safeBreakConfig.checkWhiteLine === undefined) {
      opts.safeBreakConfig.checkWhiteLine = true
    }

    if (opts.safeBreakConfig.checkBlackLine === undefined) {
      opts.safeBreakConfig.checkBlackLine = true
    }
  }

  // ----- html2canvas -----
  html2canvas(dom, {
    type: 'view',
    logging: false
  }).then(canvas => {
      // ----- jsPDF -----
      let pdf = new jsPDF(opts.jsPDF);

      //largura e altura do canvas original.
      const contentWidth = canvas.width,
          contentHeight = canvas.height;

      let [pageWidth, pageHeight, footerFontSize] = A4Dimensions[opts.jsPDF.orientation];
      const refPageHeight = pageHeight - 20

      //ajusta o side padding
      pageWidth = pageWidth - opts.paddingSize * 2;
      pageHeight = pageHeight - opts.paddingSize * 2;

      if (opts.showPageNumbers || opts.footerText) {
        //se apresentar o numero da pagina ou texto de rodape reduz a altura base da pagina
        pageHeight = pageHeight > refPageHeight ? refPageHeight : pageHeight
      }

      // translate content by a4's size
      let imgWidth = pixelToMM(contentWidth)
      let imgHeight = pixelToMM(contentHeight)

      if (imgWidth > pageWidth) {
        let newDimensions = resizeImage(imgWidth, imgHeight, pageWidth);
        imgWidth = pageWidth;
        imgHeight = newDimensions.height;
      }

      let images = function(type) {
        let types = {
          'image/jpeg': 'JPEG',
          'image/png': 'PNG',
          'image/webp': 'WEBP'
        };
        return types[type];
      };

      
      let totalPages = imgHeight > pageHeight ? Math.ceil(imgHeight / pageHeight) : 1;
      let pageNumber = 1;
      let position = 0; //posicao inicial do crop na imagem original

      let baseCropHeight = Math.ceil(contentHeight / (totalPages-1));
      
      const cropHeight = contentHeight > baseCropHeight ? baseCropHeight : contentHeight;
      let cropWidth = contentWidth;
      
      let calcCropHeight = cropHeight;
      pageHeight = totalPages === 1 ? imgHeight : pageHeight;

      //criando as paginas do pdf
      while (pageNumber <= totalPages) {
        calcCropHeight = cropHeight;

        if (opts.safeBreak && totalPages > 1) {
          //verifica as condicoes para quebra de pagina sem cortar a imagem indevidamente
          let safeBreak = false
          const chunkHeight = 1;

          while (!safeBreak && calcCropHeight > 0) {
            let defaultCtx = canvas.getContext('2d');
            let imageData = defaultCtx.getImageData(0, position + calcCropHeight - chunkHeight, canvas.width, chunkHeight);
            let data = imageData.data;

            safeBreak |= (opts.safeBreakConfig.checkWhiteLine && isWhiteLine(data));
            safeBreak |= (opts.safeBreakConfig.checkBlackLine && isBlackLine(data));
            
            let {checkColorLine, acceptableFrequency} = opts.safeBreakConfig;

            if (checkColorLine) {
              safeBreak |= hasTargetColor(data, checkColorLine, acceptableFrequency);
            }
            
            if (!safeBreak) {
              calcCropHeight--;
            }
          }
        }

        if (calcCropHeight) {
          let cropCanvas = document.createElement('canvas');
          cropCanvas.width = cropWidth;
          cropCanvas.height = calcCropHeight;

          const cropCtx = cropCanvas.getContext('2d');
          cropCtx.beginPath();
          cropCtx.rect(0, 0, cropWidth, calcCropHeight);
          cropCtx.fillStyle = '#FFFFFF';
          cropCtx.fill();

          cropCtx.drawImage(canvas, 0, position, cropWidth, calcCropHeight, 0, 0, cropWidth, calcCropHeight);        
          let cropData = cropCanvas.toDataURL(opts.imageType);
          pdf.addImage(cropData, images(opts.imageType), opts.paddingSize, opts.paddingSize, imgWidth, pageHeight);
        }

        if (opts.showPageNumbers) {
          pdf.setTextColor('#2f2f2f');
          pdf.setFontSize(footerFontSize);
          pdf.text(pdf.internal.pageSize.width - 25, pdf.internal.pageSize.height - 10, `${pageNumber} / ${totalPages}`);
        }

        if (opts.footerText) {
          pdf.setFontSize(footerFontSize);
          pdf.setFontStyle('italic');
          pdf.setTextColor('#666666');
          pdf.text(opts.paddingSize + 5, pdf.internal.pageSize.height - 10, opts.footerText);
        }

        // se ainda houver paginas, adicinar mais uma em branco.
        if (pageNumber < totalPages) {
          pdf.addPage(opts.jsPDF.format, opts.jsPDF.orientation);
        }

        position += calcCropHeight;
        pageNumber++;
      }
      
      // save pdf
      opts.success(pdf);
  })
}

export default html2PDF