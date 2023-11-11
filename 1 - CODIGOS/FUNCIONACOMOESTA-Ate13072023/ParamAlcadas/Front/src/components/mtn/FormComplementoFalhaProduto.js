import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "antd";
import ListaPrefixosForm from "components/AntdFormCustomFields/ListaPrefixosForm";

const FormComplementoFalhaProduto = (props) => {
  const { updateComplemento } = props;

  return <ListaPrefixosForm updateListaPrefixos={updateComplemento} />;
};

export default FormComplementoFalhaProduto;
