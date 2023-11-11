import React, { useState } from 'react';
import { Select, Spin, message } from 'antd';
import useEffectOnce from 'utils/useEffectOnce';
import { getStatus } from 'services/ducks/Designacao.ducks';

const { Option } = Select;

function SelectStatus(props) {

  const [statuses, setStatuses] = useState();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);

  useEffectOnce(() => {
    obterOptions()
  });

  const obterOptions = () => {
    setLoading(prev => true);
    getStatus()
      .then(statuses => setStatuses(prev => statuses))
      .catch(error => message.error(error))
      .then(() => setLoading(prev => false));
  }

  const fillOptions = () => {
    if (statuses) {
      return statuses.map((status) => {
        return <Option key={status.id}>{status.status}</Option>
      })
    }

    return null;
  }

  const onOptionChange = value => {
    setStatus(prev => value);
    props.onChange && props.onChange(value);
  }

  return (
    <Select
      mode="multiple"
      value={status}
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

export default React.memo(SelectStatus);