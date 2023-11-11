import React from "react";
import { Input, Space, Typography } from 'antd';
import { setDataExpiracaoFutura } from '../../../../utils/dateFunctions/setDataExpiracaoFutura';
import { displayDateBR } from "../../../../utils/dateFunctions/displayDateBR";
import { BoldLabelDisplay } from "../../../../components/BoldLabelDisplay/BoldLabelDisplay";

const { Text } = Typography;

export function MesesExpirar({ handleChange, dados, novo = false }) {
  return (
    <Space direction="vertical" style={{ marginTop: "1em" }}>
      <Space size="small">
        <Text style={{ display: "block", fontWeight: "bold", alignSelf: "center", marginRight: "0.2em" }}>
          Meses para expirar:
        </Text>
        <Input
          type="number"
          max={12}
          min={0}
          defaultValue={0}
          value={dados.month}
          onChange={handleChange}
          name="month"
          placeholder="Month"
          style={{ width: 'auto' }} />
      </Space>
      <BoldLabelDisplay label={novo ? "Novo vencimento" : "Expirará em"}>
        {displayDateBR(setDataExpiracaoFutura(dados.month))}
      </BoldLabelDisplay>
    </Space>
  );
}
