import React from "react";
import { Icon as LegacyIcon } from "@ant-design/compatible";
import { DeleteOutlined } from "@ant-design/icons";
import { Tooltip, List, Popconfirm, message } from "antd";
import styled from "styled-components";

/**
 * Componente que apresenta uma lista de anexos.
 *
 *  Props:
 *    downloadAnexo: (Obrigatório) Função para realizar o dowload do anexo
 *    removeAnexo: (Opcional) Função para remover o anexo
 *    idEnvolvido: (Obrigatório caso remove anexo) Id do envolvido.
 *    anexos: (Obrigatório) Array de anexos, no formato:
 *      [...
 *        {   idAnexo: <Identificador do anexo que será passado para as funções downloadAnexo e removeAnexo>,
 *            nomeArquivo: <Nome do arquivo para ser exibido na lista,
 *            mimeType: <Mimetype do arquivo>,
 *            extensao: <Extensao do arquivo>,
 *         }
 *      ]
 *
 */

const extensionsData = [
  {
    type: "file-excel",
    color: "#1D8F50",
    toolTip: "Planilha",
    arrayExtensions: ["xls", "xlsx", "ods"],
  },
  {
    type: "file-pdf",
    color: "#FF2116",
    toolTip: "PDF",
    arrayExtensions: ["pdf"],
  },
  {
    type: "file-text",
    color: "#2654A9",
    toolTip: "Texto",
    arrayExtensions: ["doc", "docx", "odt"],
  },
];

const AnexoLink = styled.div`
  color: #1890ff;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    font-size: 105%;
  }
`;

const getFileIcon = (anexo) => {
  let iconProps = {
    type: "file-unknown",
    style: { fontSize: "2rem", marginRight: "10px" },
    toolTip: "Outros formatos",
  };
  if (anexo.mimeType.split("/")[0] === "image") {
    iconProps.type = "file-image";
    iconProps.style.color = "#f58a42";
  } else {
    const index = extensionsData.findIndex((elem) =>
      elem.arrayExtensions.includes(anexo.extensao)
    );

    if (index >= 0) {
      iconProps.type = extensionsData[index].type;
      iconProps.style.color = extensionsData[index].color;
      iconProps.toolTip = extensionsData[index].toolTip;
    }
  }

  return (
    <Tooltip title={iconProps.toolTip}>
      <LegacyIcon style={iconProps.style} type={iconProps.type} />
    </Tooltip>
  );
};

const baixarAnexo = (anexo, downloadFunc) => {
  downloadFunc({
    idAnexo: anexo.idAnexo,
    fileName: anexo.nomeArquivo,
    responseHandler: {
      successCallback: () => console.log("Baixado"),
      errorCallback: () => message.error("Erro no download"),
    },
  });
};

const removeAnexo = (anexo, removeFunc, idEnvolvido) => {
  removeFunc({
    idAnexo: anexo.idAnexo,
    idEnvolvido: idEnvolvido,
    responseHandler: {
      successCallback: () => message.success("Anexo Removido"),
      errorCallback: () => message.error("Erro ao remover anexo"),
    },
  });
};

export default function ListaAnexos(props) {
  if (props.anexos.length > 0) {
    return (
      <List
        header={<div>Anexos</div>}
        bordered
        itemLayout="horizontal"
        size="small"
        dataSource={props.anexos}
        rowKey={({ nomeArquivo }) => nomeArquivo}
        renderItem={(anexo) => (
          <List.Item actions={[]}>
            {getFileIcon(anexo)}
            <AnexoLink onClick={() => baixarAnexo(anexo, props.downloadAnexo)}>
              {anexo.nomeArquivo}
            </AnexoLink>
            {props.removeAnexo && (
              <div style={{ marginLeft: "auto" }}>
                <Tooltip title="Remover anexo" placement="bottom">
                  <Popconfirm
                    title="Deseja excluir o anexo?"
                    onConfirm={() =>
                      removeAnexo(anexo, props.removeAnexo, props.idEnvolvido)
                    }
                  >
                    <DeleteOutlined
                      className="link-color"
                      style={{ color: "red" }}
                    />
                  </Popconfirm>
                </Tooltip>
              </div>
            )}
          </List.Item>
        )}
      />
    );
  } else {
    return <span></span>;
  }
}
