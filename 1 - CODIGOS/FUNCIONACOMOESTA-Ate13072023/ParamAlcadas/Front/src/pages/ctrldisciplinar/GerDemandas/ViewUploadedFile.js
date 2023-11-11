import React from 'react';
// import PDFViewer from 'pdf-viewer-reactjs';
import { Button } from 'antd';
import {DownloadPDFFromlink} from 'utils/Commons';

export const ViewUploadedFile = (props) => {

  console.log(props.linkPdfUp);

  return (
    <React.Fragment>
      <div>
        <Button onClick={() => DownloadPDFFromlink('gedip.pdf', props.linkPdfUp)}>Baixar Documento</Button>
      </div>
      {/* <PDFViewer
        document={{url: props.linkPdfUp}}
      /> */}
    </React.Fragment>
  );

}

export default ViewUploadedFile;