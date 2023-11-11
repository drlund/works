import html2PDF from "./html2pdf";

const GeneratePdf = ({
  targetId = null,
  fileName = "document",
  orientation = "portrait",
  showPageNumbers = false,
  footerText = null,
  paddingSize = 5,
  safeBreak = false,
  safeBreakConfig = {},
  onFinished = () => {}
}) => {

    html2PDF(targetId, {
      jsPDF: { orientation },
      output: `${fileName}.pdf`,
      showPageNumbers,
      footerText,
      paddingSize,
      safeBreak,
      safeBreakConfig,
      onFinished
    });  

  ////////////////////////////////////////////////////////
  // System to manually handle page breaks
  // Wasn't able to get it working !
  // The idea is to break html2canvas screenshots into multiple chunks and stich them together as a pdf
  // If you get this working, please email me a khuranashivek@outlook.com and I'll update the article
  ////////////////////////////////////////////////////////
  // range(0, numPages).forEach((page) => {
  //   console.log(`Rendering page ${page}. Capturing height: ${a4HeightPx} at yOffset: ${page*a4HeightPx}`);
  //   html2canvas(input, {height: a4HeightPx, y: page*a4HeightPx})
  //     .then((canvas) => {
  //       const imgData = canvas.toDataURL('image/png');
  //       console.log(imgData)
  //       if (page > 0) {
  //         pdf.addPage();
  //       }
  //       pdf.addImage(imgData, 'PNG', 0, 0);
  //     });
  //   ;
  // });

  // setTimeout(() => {
  //   pdf.save(`${fileName}.pdf`);
  // }, 5000);
};

export default GeneratePdf;
