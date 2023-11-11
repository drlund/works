import React from "react";

import { Typography } from "antd";
import { downloadAnexo } from "services/ducks/Encantar.ducks";
import styled from "styled-components";
const AnexoLink = styled.div`
  color: #1890ff;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    font-size: 105%;
  }
`;

const { Text } = Typography;

const ListaAnexosEncantar = (props) => {
  const { anexos } = props;
  
  if (!anexos || anexos.length === 0) {
    return null;
  }

  return anexos.map((anexo) => {
    return anexo.id ? (
      <AnexoLink onClick={() => downloadAnexo(anexo.id, anexo.nomeArquivo)}>
        {anexo.nomeOriginal}
      </AnexoLink>
    ) : (
      <div>
        <Text strong>{anexo.name}</Text>
      </div>
    );
  });
};

export default ListaAnexosEncantar;
