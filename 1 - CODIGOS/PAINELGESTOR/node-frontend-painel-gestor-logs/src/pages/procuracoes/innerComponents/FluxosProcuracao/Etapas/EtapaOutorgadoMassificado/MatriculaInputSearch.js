import { Input } from 'antd';
import React, { useState } from 'react';

/**
 * @param {{
 *  handleOnSearch: (value: string, cb?: Function) => void
 * }} props
 */
export function MatriculaInputSearch({ handleOnSearch }) {
  const [matricula, setMatricula] = useState("");

  // aceita matriculas parciais iniciando ou não com "f"
  const matriculaParcialRegex = /^[fF]?\d{0,7}$/;

  /**
   * @param {{target: { value: string }}} props
   */
  const handleSearchChange = ({ target: { value } }) => {
    if (value.match(matriculaParcialRegex)) {
      setMatricula(value);
    }
  };

  /**
   * @param {string} value
   */
  const handleSearch = (value) => {
    const matriculaSemFLen = 7;
    if (value.length < matriculaSemFLen) {
      return;
    }

    const matriculaLen = 8;
    const searchValue = value.length === matriculaLen ? value : `F${value}`;

    handleOnSearch(searchValue, () => setMatricula(""));
  };

  return (
    <Input.Search
      placeholder="Uma Matrícula ('F' é opcional)"
      allowClear
      enterButton="+"
      value={matricula}
      onChange={handleSearchChange}
      onSearch={handleSearch}
    />
  );
}
