import React, { useState } from 'react';
import { Select, Spin, message } from 'antd';
import useEffectOnce from 'utils/useEffectOnce';
import { getSituacoes } from 'services/ducks/Designacao.ducks';

const { Option } = Select;

function SelectSituacao(props) {

  const [situacoes, setSituacoes] = useState();
  const [situacao, setSituacao] = useState();
  const [loading, setLoading] = useState(false);

  useEffectOnce(() => {
    obterOptions()
  });

  const obterOptions = () => {
    setLoading(prev => true);
    getSituacoes()
      .then(situacoes => setSituacoes(prev => situacoes))
      .catch(error => message.error(error))
      .then(() => setLoading(prev => false));
  }

  const fillOptions = () => {
    if (situacoes) {
      return situacoes.map((situacao) => {
        return <Option key={situacao.id}>{situacao.situacao}</Option>
      })
    }

    return null;
  }

  const onOptionChange = value => {
    setSituacao(prev => value);
    props.onChange && props.onChange(value);
  }

  return (
    <Select
      mode="multiple"
      value={situacao}
      disabled={props.disabled}
      labelInValue
      placeholder="Selecione uma situação"
      style={props.style}
      defaultActiveFirstOption={false}
      filterOption={false}
      onChange={onOptionChange}
      notFoundContent={loading ? <Spin size="small" /> : null}
      loading={loading}
    >
      {fillOptions()}
    </Select>
  )
}

export default React.memo(SelectSituacao);