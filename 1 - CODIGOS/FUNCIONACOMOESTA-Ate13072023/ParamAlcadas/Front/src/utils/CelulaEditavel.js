import React from 'react';
import { NumericFormat } from 'react-number-format';
import { Input, Form } from 'antd';

function CelulaEditavel({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) {
  const inputNode = inputType === 'number' ? (
    <NumericFormat
      customInput={Input}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      />
  ) : (
    <Input />
  );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}

export default CelulaEditavel;
