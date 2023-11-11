import React, { useState, useEffect } from 'react';
import { Select, Spin, message } from 'antd';
import { getProtocolo } from 'services/ducks/Designacao.ducks';
import _ from 'lodash';
import { CancelToken, isCancel } from "services/apis/ApiModel";

const { Option } = Select;
let cancelRequest = null;

function SelectProtocolo(props) {

  const [protocolos, setProtocolos] = useState();
  const [protocolo, setProtocolo] = useState();
  const [loading, setLoading] = useState(false);
  const handleSearchDebounced = _.debounce(searchOptions, 500)


  useEffect(() => {
    cancelRequest && cancelRequest();

    if (protocolo === undefined) {
      setProtocolos([])
    }
  }, [protocolo]);

  function searchOptions(protocolo) {
    cancelRequest && cancelRequest();

    if (protocolo > 0) {
      setLoading(prev => true);
      getProtocolo(protocolo, new CancelToken((c) => cancelRequest = c))
        .then(protocolos => setProtocolos(prev => protocolos))
        .catch(error => {
          if (!isCancel(error)) {
            setProtocolos([]);
            message.error(error);
          }
        })
        .then(() => setLoading(false));
    } else {
      setLoading(false);
      setProtocolos([]);
    }
  }

  const fillOptions = () => {
    if (protocolos) {
      return protocolos.map((protocolo) => {
        return <Option key={protocolo.id}>{protocolo.protocolo}</Option>
      })
    }

    return null;
  }

  const onOptionChange = value => {
    setProtocolo(prev => value);
    props.onChange && props.onChange(value);
  }

  return (
    <Select
      value={protocolo}
      disabled={props.disabled}
      labelInValue
      placeholder="Digite parte do número de protocolo"
      style={props.style}
      defaultActiveFirstOption={false}
      filterOption={false}
      showSearch
      onSearch={handleSearchDebounced}
      onChange={onOptionChange}
      notFoundContent={loading ? <Spin size="small" /> : null}
      loading={loading}
    >
      {fillOptions()}
    </Select>
  )
}

export default React.memo(SelectProtocolo);