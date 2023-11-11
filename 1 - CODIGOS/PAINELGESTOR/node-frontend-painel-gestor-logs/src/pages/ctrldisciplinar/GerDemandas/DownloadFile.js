import React from 'react';
// import PDFViewer from 'pdf-viewer-reactjs';
import { Button } from 'antd';
import {DownloadPDFFromlink} from 'utils/Commons';

export const DownloadFile = (props) => {

  console.log(props.linkPdfUp);

  return (
    <React.Fragment>
      <div>
        <Button onClick={() => DownloadPDFFromlink('gedip.pdf', props.linkPdfUp)}>Baixar Documento</Button>
      </div>
      {/* <PDFViewer
        document={{base64: props.linkPdfUp}}
      /> */}
    </React.Fragment>
  );

}

export default DownloadFile;