import React from 'react';
import { NumericFormat, PatternFormat } from 'react-number-format';

export function InputMoeda(props) {
  return (
    <NumericFormat
      {...props}
      prefix="R$ "
      className="ant-input"
      type="text"
      thousandSeparator="."
      decimalSeparator=","
      displayType="input"
        />
  );
}

export function InputInteger(props) {
  return (
    <NumericFormat
      {...props}
      className="ant-input"
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={0}
        />
  );
}

export function InputCNPJ(props) {
  return (
    <PatternFormat
      {...props}
      className="ant-input"
      format="##.###.###/####-##"
      mask="_"
        />
  );
}

export function InputNumberCustomMask(props) {
  return (
    <PatternFormat
      {...props}
      className="ant-input"
      format={props.format}
      mask="_"
        />
  );
}

export function InputCEP(props) {
  return (
    <PatternFormat
      {...props}
      className="ant-input"
      format="#####-###"
      mask="_"
        />
  );
}
