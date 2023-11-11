import React, { useState } from 'react';
import { Select, message, Spin } from 'antd';
import _ from 'lodash';
import { fetchPrefixosAndSubords } from 'pages/designacao/apiCalls/fetch';
import { CancelToken, isCancel } from 'services/apis/ApiModel';

const { Option } = Select;

function InputPrefixo({
  defaultOptions,
  defaultValue,
  disabled,
  dv,
  key,
  onChange,
  placeholder,
  style,
  value,
}) {
  const [prefixo, setPrefixo] = useState({ key: '', label: '' });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const handleSearch = (valor) => {
    let cancelRequest = null;
    if (cancelRequest) cancelRequest();

    const setOk = (dat = []) => {
      setData(dat);
      setLoading(false);
    };

    if (valor.length > 2) {
      startLoading();
      onChange('');

      fetchPrefixosAndSubords(
        valor,
        new CancelToken((c) => {
          cancelRequest = c;
        })
      )
        .then((dta) => {
          setOk(dta);
        })
        .catch((error) => {
          if (!isCancel(error)) {
            message.error(error);
            setOk();
          }
        });
    } else {
      setOk();
    }
  };

  const debHandleSearch = _.debounce(handleSearch, 750);

  const handleChange = (valor) => {
    const selectedData = data.filter(
      (elem) => elem.prefixo === valor
    );

    const setOk = (val, dt) => {
      setPrefixo(val);
      setData(dt);
    };

    setOk(valor, selectedData);

    onChange(valor);
  };

  const renderOptions = () => {
    const dtta = data;
    if (_.isNil(dtta)) {
      return null;
    }

    let finalOptions = [];

    if (defaultOptions) {
      finalOptions = defaultOptions.map((elem) => (
        <Option key={elem.prefixo}>{`${elem.prefixo} ${elem.nome}`}</Option>));
    }

    let options = [];

    if (dv) {
      options = data.map((elem) => (
        <Option key={elem.prefixo}>{`${elem.prefixo}-${elem.dv} ${elem.nome}`}</Option>));
    } else {
      options = data.map((elem) => (
        <Option key={elem.prefixo}>{`${elem.prefixo} ${elem.nome}`}</Option>));
    }

    finalOptions = finalOptions.concat(options);
    return finalOptions;
  };

  return (
    <Select
      key={key}
      disabled={disabled}
      labelInValue
      showSearch
      autoClearSearchValue={false}
      value={value || prefixo}
      placeholder={placeholder}
      style={style}
      defaultActiveFirstOption={false}
      defaultValue={defaultValue && defaultOptions && defaultOptions.prefixo}
      allowClear
      filterOption={(input, option) => {
        const label = ''.concat(...option.children);
        return (
          label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      }}
      onSearch={debHandleSearch}
      onChange={handleChange}
      notFoundContent={loading ? <Spin size="small" /> : null}
      loading={loading}
    >
      {renderOptions()}
    </Select>
  );
}

export default React.memo(InputPrefixo);
