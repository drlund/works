/**
 * Neste exemplo, as principais alterações estão na lógica de tratamento da entrada e na função `handleSearch`. 
 * Agora o componente `InputPrefixoAlcada` aceitará diferentes formatos de entrada e executará a consulta por 
 * nome quando necessário. Certifique-se de passar a propriedade `format` ao renderizar o componente no seu 
 * formulário, conforme discutido nas respostas anteriores.
 * 
 * Aqui estão as alterações que você pode fazer no seu componente `InputPrefixoAlcada` para aceitar o formato 
 * "F0000000" e permitir a digitação de um nome que possa ser consultado em `getMatriculas`:
 */

import React, { useState, useEffect } from 'react';
import { Select, message, Spin } from 'antd';
import _ from 'lodash';
import { fetchMatchedPrefixos } from 'services/ducks/Arh.ducks';
import { connect } from 'react-redux';

const { Option } = Select;

const InputPrefixoAlcada = ({
  format,
  fetchMatchedPrefixos: thisFetchMatchedPrefixos,
  value: initialValue,
  tipoSelecionado,
  fullValue,
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(initialValue || '');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (newValue) => {
    setInputValue(newValue);

    if (tipoSelecionado === 'matricula') {
      const formattedValue = newValue ? `F${newValue.toUpperCase()}` : '';
      onChange(fullValue ? data : formattedValue);
    } else {
      onChange(fullValue ? data : newValue);
    }
  };

  const handleSearch = _.debounce((searchValue) => {
    if (searchValue.length > 2) {
      setLoading(true);

      thisFetchMatchedPrefixos(searchValue)
        .then((fetchedData) => {
          setData(fetchedData);
          setLoading(false);

          if (!fetchedData.length) {
            message.warn('Nenhum prefixo localizado!');
          }
        })
        .catch((error) => {
          message.error(error);
          setData([]);
          setLoading(false);
        });
    } else {
      setData([]);
    }
  }, 750);

  useEffect(() => {
    handleSearch(inputValue);
  }, [inputValue]);

  const renderOptions = (data) => {
    const { defaultOptions, dv } = props;

    if (_.isNil(data)) {
      return null;
    }

    let finalOptions = [];

    if (defaultOptions) {
      finalOptions = defaultOptions.map((elem) => (
        <Option key={elem.prefixo}>
          {elem.prefixo} {elem.nome}
        </Option>
      ));
    }

    let options = [];

    switch (dv) {
      case true: {
        options = data.map((d) => (
          <Option key={d.prefixo}>
            {d.prefixo}-{d.dv} {d.nome}
          </Option>
        ));
        break;
      }
      default:
        options = data.map((d) => (
          <Option key={d.prefixo}>
            {d.prefixo} {d.nome}
          </Option>
        ));
    }

    finalOptions = finalOptions.concat(options);
    return finalOptions;
  };

  return (
    <Select
      showSearch
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      loading={loading}
      value={inputValue}
      onChange={handleChange}
      {...props}
    >
      {renderOptions(data)}
    </Select>
  );
};

InputPrefixoAlcada.defaultProps = {
  fullValue: false,
};

export default connect(null, {
  fetchMatchedPrefixos,
})(InputPrefixoAlcada);
