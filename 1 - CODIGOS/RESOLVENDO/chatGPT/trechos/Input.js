import React, { useState } from 'react';

const MeuInput = () => {
  const [valor, setValor] = useState('');

  const handleChange = (event) => {
    setValor(event.target.value);
  };

  return (
    <input type="text" value={valor} onChange={handleChange} />
  );
};