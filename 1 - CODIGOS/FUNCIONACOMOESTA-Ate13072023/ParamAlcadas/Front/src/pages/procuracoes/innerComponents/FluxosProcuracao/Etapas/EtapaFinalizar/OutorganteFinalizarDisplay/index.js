import { UserOutlined } from '@ant-design/icons';
import { Avatar, Checkbox, Image } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { getProfileURL } from 'utils/Commons';
import { FinalizarItemWrapper } from '../FinalizarItemWrapper';

/**
 * @param {{ poderes: Procuracoes.Poderes}} props
 */
export function OutorganteFinalizarDisplay({ poderes: { outorganteSelecionado, outorgantes } }) {
  const {
    idProcuracao, idProxy, matricula, nome, subsidiariasSelected
  } = outorganteSelecionado;

  const subsidiarias = outorgantes
    .find((o) => o.idProcuracao === idProcuracao && o.idProxy === idProxy)
    .procuracao[0]
    .subsidiarias
    .reduce((acc, cur) => {
      if (!acc.ids[cur.id]) {
        acc.arr.push({ label: cur.nome, value: cur.id });
        acc.ids[cur.id] = cur.id;
      }
      return acc;
    }, {
      arr: /** @type {{label: string, value: number }[]} */([]),
      ids: /** @type {Record<number,number>} */ ({}),
    }).arr;

  return (
    <FinalizarItemWrapper
      icon={(
        <Avatar
          src={(
            <Image src={getProfileURL(matricula)} />
          )}
          style={{ height: '4em', width: '4em' }}
          icon={<UserOutlined style={{ fontSize: '5em' }} />} />
      )}
      text={`${matricula} - ${nome}`}
      detalhesAppend="dos Poderes Vinculados"
    >
      <CheckboxGroup
        options={subsidiarias}
        value={subsidiariasSelected}
        disabled />
    </FinalizarItemWrapper>
  );
}

const CheckboxGroup = styled(Checkbox.Group)`
  & .ant-checkbox-checked {
    & + span {
      color: black;
    }

    & .ant-checkbox-inner {
      background-color: #1890ff;
      border-color: #1890ff;

      &::after {
      border-color: #f5f5f5;
    }
  }
}
`;
