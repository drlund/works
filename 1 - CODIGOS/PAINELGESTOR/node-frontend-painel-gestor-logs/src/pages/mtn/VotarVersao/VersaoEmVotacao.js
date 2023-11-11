import React from "react";
import { Descriptions, Typography } from "antd";
import useToken from "hooks/useToken";
const { Link } = Typography;

const VersaoEmVotacao = (props) => {
  const { versaoEmVotacao } = props;
  const token = useToken();
  return (
    <Descriptions column={4} bordered>
      <Descriptions.Item label="Funcionário" span={4}>
        {`${versaoEmVotacao.incluidoPor} - ${versaoEmVotacao.incluidoPorNome}`}
      </Descriptions.Item>
      <Descriptions.Item label="Tipo Versão" span={4}>
        {versaoEmVotacao.tipoVersao}
      </Descriptions.Item>
      <Descriptions.Item label="Incluido Em" span={4}>
        {`${versaoEmVotacao.createdAt}`}
      </Descriptions.Item>
      <Descriptions.Item label="Status" span={4}>
        {versaoEmVotacao.status.display}
      </Descriptions.Item>
      <Descriptions.Item label="Motivação" span={4}>
        {versaoEmVotacao.motivacao}
      </Descriptions.Item>
      <Descriptions.Item label="Documento" span={4}>
        <Link
          href={`${versaoEmVotacao.documento.url}?token=${token}`}
          target="_blank"
        >
          {versaoEmVotacao.documento.nomeOriginal}
        </Link>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default VersaoEmVotacao;
