import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import _ from 'lodash';

const { Option } = Select;

function SelectPeriodo(props) {
  const [periodos, setPeriodos] = useState(null);
  const [periodo, setPeriodo] = useState(null);
  const [loading, setLoading] = useState(false);

  const onPeriodoChange = (per) => {
    setPeriodo(prev => per);
  };

  useEffect(() => {

    if (!_.isEmpty(props.periodos) || (periodos && [periodos.map(per => per.periodo)].every(props.periodos.map(per => per.periodo)))) {
      setLoading(prev => true);
      setPeriodos(prev => props.periodos);
      periodo || setPeriodo(prev => _.head(props.periodos).dataCompleta);
      setLoading(prev => false);
    }
  }, [props, periodo, periodos, props.periodos, setLoading, setPeriodo, setPeriodos]);

  useEffect(() => {
    if (periodo) {
      props.mudarPeriodo(periodo);
    }
  }, [periodo, props, props.mudarPeriodo]);

  return (
    <Select
      style={{width: '100%'}}
      showSearch
      value={periodo && periodo}
      defaultActiveFirstOption
      placeholder="Selecione um Período"
      optionFilterProp="children"
      onChange={onPeriodoChange}
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
        periodos && periodos.map((per, index) => {
          const {mesAno, dataCompleta} = per;
          return <Option key={index} value={dataCompleta}>{mesAno}</Option>
        })
      }
    </Select>
  )
}

export default React.memo(SelectPeriodo);
