import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import _ from 'lodash';

const { Option } = Select;

function SelectStatus(props) {
  const [estados, setEstados] = useState(null);
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!_.isEmpty(props.estados)) {
      isMounted && setLoading(prev => true);
      isMounted && setEstados(prev => props.estados);
      isMounted && setEstado(prev => _.head(props.estados.filter(estado => estado.selected)).id_status);
      isMounted && setLoading(prev => false);
    }

    return () => isMounted = false;
  }, [props.estados, setLoading, setEstados, setEstado]);

  useEffect(() => {
    if (estado) {
      props.mudarStatus(estado);
    }
  }, [estado, props, props.mudarStatus]);

  return (
    <Select
      style={{width: '100%'}}
      showSearch
      value={estado && estado}
      defaultActiveFirstOption
      placeholder="Selecione um Status"
      optionFilterProp="children"
      onChange={(status) => setEstado(status)}
      loading={loading}
      disabled={loading}
      notFoundContent={loading ? <Spin size="small" /> : null}
      filterOption={(input, option) => {
        const label = "".concat(...option.children);
        return (
          label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      }}
    >
      {
        estados && estados.map((ests) => {
          return <Option key={ests.id_status} value={ests.id_status}>{ests.nome_status}</Option>
        })
      }
    </Select>
  )
}

export default React.memo(SelectStatus);