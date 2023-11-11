import React, { useState } from 'react';
import { Select, Spin, message } from 'antd';
import useEffectOnce from 'utils/useEffectOnce';
import { getTipos } from 'services/ducks/Designacao.ducks';

const { Option } = Select;

function SelectTipo(props) {

  const [tipos, setTipos] = useState();
  const [tipo, setTipo] = useState();
  const [loading, setLoading] = useState(false);

  useEffectOnce(() => {
    obterOptions()
  });

  const obterOptions = () => {
    setLoading(prev => true);
    getTipos()
      .then(tipos => setTipos(prev => tipos))
      .catch(error => message.error(error))
      .then(() => setLoading(prev => false));
  }

  const fillOptions = () => {
    if (tipos) {
      return tipos.map((tipo) => {
        return <Option key={tipo.id}>{tipo.nome}</Option>
      })
    }

    return null;
  }

  const onOptionChange = value => {
    setTipo(prev => value);
    props.onChange && props.onChange(value);
  }

  return (
    <Select
      mode="multiple"
      value={tipo}
      disabled={props.disabled}
      labelInValue
      placeholder="Selecione um tipo de Movimentação"
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

export default React.memo(SelectTipo);