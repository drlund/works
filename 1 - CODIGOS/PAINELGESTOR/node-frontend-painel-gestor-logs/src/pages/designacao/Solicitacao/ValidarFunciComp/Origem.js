import React from 'react';
import { Descriptions, Typography } from 'antd';
import StyledCardPrimary from 'components/styledcard/StyledCard';
import _ from 'lodash';

const { Item } = Descriptions;
const { Text } = Typography;

export default function Origem(props) {
  const {
    matricula,
    nome,
    nome_super_lotacao,
    nivel_alfab,
    municipioUfLotacao,
    funcao_lotacao,
    desc_func_lotacao,
    municipioUfLocaliz,
    ag_localiz,
    comissao,
    desc_cargo,
    treinamentos,
    cd_super_juris,
    prefixo_lotacao,
    dependencia_lotacao,
    emSubstit,
    nome_ag_localiz,
  } = props.dados;

  return (
    <React.Fragment>
      <StyledCardPrimary title="Origem" headStyle={{ textAlign: "center", fontWeight: "bold", background: "#74B4C4", fontSize: '1.3rem', width: '100%' }} bodyStyle={{ padding: 5 }}>
        <Descriptions column={1} bordered size="small">
          <Item label="Funcionário">{matricula} {nome}</Item>
          <Item label="Função">{funcao_lotacao} {desc_func_lotacao}</Item>
          <Item label="Dependência">{prefixo_lotacao} {dependencia_lotacao}</Item>
          <Item label="Município">{municipioUfLotacao}</Item>
          <Item label="Nível">{nivel_alfab}</Item>
          <Item label="Super">{cd_super_juris} {nome_super_lotacao}</Item>
          {
            emSubstit && (
              <>
                <Item label={<Text strong>(Substituição) Função</Text>}><Text strong>{comissao} {desc_cargo}</Text></Item>
                <Item label={<Text strong>(Substituição) Prefixo</Text>}><Text strong>{ag_localiz} {nome_ag_localiz}</Text></Item>
                <Item label={<Text strong>(Substituição) Município</Text>}><Text strong>{municipioUfLocaliz}</Text></Item>
              </>
            )
          }
          <Item label="Certificações">{_.isEmpty(treinamentos.cpaFunci.cpaLista) ? '' : treinamentos.cpaFunci.cpaLista.toString().replace(/,/, ', ')}</Item>
        </Descriptions>
      </StyledCardPrimary>
    </React.Fragment>
  )
};
