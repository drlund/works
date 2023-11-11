import React, { useState, useEffect } from "react";
import { Input } from "antd";

const removeCaracteresNaoNumericos = (valorDigitado) => {
  const valorSemCaracteresNumericos = valorDigitado.replace(/\D/g, "");
  return valorSemCaracteresNumericos;
};

const InputNumberForm = (props) => {
  const { form, name, maxLength } = props;
  const [valor, setValor] = useState("");

  useEffect(() => {
    if (form) {
      form.setFieldsValue({ [name]: valor });
    }
  }, [valor, form, name]);
  return (
    <Input
      value={valor}
      maxLength={maxLength ? maxLength : 9999}
      onChange={(e) => setValor(removeCaracteresNaoNumericos(e.target.value))}
    />
  );
};

export default InputNumberForm;
