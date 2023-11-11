import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, message, Popconfirm } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

/**
 * Componente que renderiza um botão que permite gerar um PDF a partir de um Document do react-pdf.
 * @param {*} props - ver ButtonPrintPdf.propTypes abaixo.
 */
const ButtonPrintPdf = (props) => {
  const [printingPdf, setPrintingPdf] = useState(false);

  const printPdf = (props) => {
    setPrintingPdf(true);

    setTimeout(() => {
      const document = props.document(props.orientation);

      pdf(document)
        .toBlob()
        .then((data) => {
          saveAs(data, `${props.filename}.pdf`);
        })
        .catch((error) => {
          console.log(error);
          message.error("Falha ao gerar este PDF!");
        })
        .then(() => {
          setPrintingPdf(false);
        });
    }, 150);
  };

  const renderButton = (props) => {
    //se exibir o popup de confirmacao nao realiza o action no button
    let onClikAction = props.showLayoutConfirm
      ? {}
      : { onClick: () => printPdf({ ...props }) };

    return (
      <Button
        type="primary"
        icon={<FilePdfOutlined />}
        loading={printingPdf}
        {...onClikAction}
      >
        {props.children ? props.children : props.buttonText}
      </Button>
    );
  };

  if (props.showLayoutConfirm) {
    return (
      <Popconfirm
        title="Escolha um formato de impressão"
        onConfirm={() => printPdf({ ...props, orientation: "landscape" })}
        onCancel={() => printPdf({ ...props, orientation: "portrait" })}
        okText="Paisagem"
        cancelText="Retrato"
        placement={props.placement}
      >
        {renderButton(props)}
      </Popconfirm>
    );
  } else {
    return renderButton(props);
  }
};

ButtonPrintPdf.defaultProps = {
  //texto a ser exibido no botao
  buttonText: "Gerar PDF",
  //local de exibicao do popup de selecao de layout
  placement: "bottomRight",
  //habilita ou nao o popup de confirmacao do layout de impressao
  showLayoutConfirm: true,
};

ButtonPrintPdf.propTypes = {
  document: PropTypes.func.isRequired,
  filename: PropTypes.string.isRequired,
  showLayoutConfirm: PropTypes.bool,
};

export default ButtonPrintPdf;
