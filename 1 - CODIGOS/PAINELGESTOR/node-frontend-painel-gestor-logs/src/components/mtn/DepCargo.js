import React from "react";
import { Descriptions } from "antd";

export default function DepCargo(props) {

  const {cdCargo, nomeCargo, title, cdPrefixo, nomePrefixo} = props;

  return (
    <div style={{paddingTop: "50px", paddingBottom: "50px"}}>
      <Descriptions bordered layout="vertical" title={title} size="small">
        <Descriptions.Item label="Dependência">
          {`${cdPrefixo} - ${nomePrefixo}`}
        </Descriptions.Item>
        <Descriptions.Item label="Cargo">
          {`${cdCargo} - ${nomeCargo}`}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

}
