import React from "react";
import {Descriptions} from 'antd';

const DadosCliente = (props) => {
  return (
    <Descriptions layout="vertical" column={4} size={"small"} bordered>
      <Descriptions.Item span={2} label="Solicitante">
        {`${props.matriculaSolicitante} - ${props.nomeSolicitante}`}
      </Descriptions.Item>
      <Descriptions.Item span={2} label="Data de inclusão">
        {`${props.dataCriacao}`}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default DadosCliente;
