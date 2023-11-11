import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import _ from 'lodash';

const { Option } = Select;

function SelectRegionais(props) {
  const [regionais, setRegionais] = useState(null);
  const [regional, setRegional] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!_.isEmpty(props.regionais)) {
      isMounted && setLoading(prev => true);
      isMounted && setRegionais(prev => props.regionais);
      isMounted && setRegional(prev => _.head(props.regionais).prefixo);
      isMounted && setLoading(prev => false);
    }

    return () => isMounted = false;
  }, [setRegionais, props.regionais]);

  useEffect(() => {
    if (regional) {
    props.mudarRegional(regional);
    }
  }, [regional, props, props.mudarRegional]);

  const onRegionalChange = (reg) => {
    setRegional(prev => reg);
  }

  return (
    <Select
      style={{width: '100%'}}
      showSearch
      value={regional && regional}
      defaultActiveFirstOption
      placeholder="Selecione uma Regional"
      optionFilterProp="children"
      onChange={onRegionalChange}
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
        regionais && regionais.map((reg, indx) => {
          return <Option key={indx} value={reg.prefixo}>{reg.nome}</Option>
        })
      }
    </Select>
  )
}

export default React.memo(SelectRegionais);
