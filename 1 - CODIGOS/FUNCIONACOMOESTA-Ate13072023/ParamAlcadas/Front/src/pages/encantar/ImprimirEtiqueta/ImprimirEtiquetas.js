import React, { useState } from "react";
import { Button, message } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import EtiquetasPDF from "./EtiquetasPDF";

const remetentePadrao = {
  nome: "BANCO DO BRASIL - Edifício BB\n\n 9009 Super Adm - DF",
  cnpj: "000.000.000/5432-17",
  endereco: "SAUN QUADRA 5 LOTE B S/N",
  bairro: "Asa Norte",
  cidade: "BRASILIA / DF",
  cep: "70040-912",
};

const getRemetente = (solicitacao) => {
  if (
    solicitacao.brindesSelecionados &&
    solicitacao.brindesSelecionados.length > 0
  ) {
    console.log("solicitacao.brindes[0].dadosPrefixo");
    console.log(solicitacao.brindesSelecionados[0]);
    return solicitacao.brindesSelecionados[0].dadosPrefixo;
  } else {
    return remetentePadrao;
  }
};

const FormEnderecoCliente = (props) => {
  const [gerandoEtiquetas, setGerandoEtiquetas] = useState(false);

  const { solicitacao } = props;
  console.log(solicitacao);

  const document = (
    <EtiquetasPDF
      dadosDestinatario={{
        nome: solicitacao.nomeCliente,
        cpf: "",
        endereco: `${solicitacao.enderecoCliente.endereco} ${solicitacao.enderecoCliente.numero} - ${solicitacao.enderecoCliente.complemento}`,
        bairro: solicitacao.enderecoCliente.bairro,
        cidade: solicitacao.enderecoCliente.cidade,
        cep: solicitacao.enderecoCliente.cep,
      }}
      dadosRemetente={getRemetente(solicitacao)}
      brindes={solicitacao.brindesSelecionados}
      orientation="landscape"
    />
  );

  const gerarEtiquetas = () => {
    setGerandoEtiquetas(true);
    setTimeout(() => {
      pdf(document)
        .toBlob()
        .then((data) => {
          saveAs(data, `etiquetas.pdf`);
        })
        .catch((error) => {
          console.log(error);
          message.error("Falha ao gerar etiquetas!");
        })
        .then(() => {
          setGerandoEtiquetas(false);
        });
    }, 150);
  };

  return (
    <Button
      loading={gerandoEtiquetas}
      size="small"
      type="primary"
      danger
      icon={<PrinterOutlined />}
      onClick={gerarEtiquetas}
      style={{ marginLeft: 10 }}
    >
      Imprimir Etiquetas
    </Button>
  );
};

export default FormEnderecoCliente;
