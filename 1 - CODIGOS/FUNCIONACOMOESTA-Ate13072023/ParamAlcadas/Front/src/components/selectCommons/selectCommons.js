import React, { useState, useEffect } from 'react'
import { Select, message, Spin } from 'antd'
import _ from 'lodash'
import { connect } from 'react-redux'

const { Option } = Select

export const SelectUF = (props) => {
  const [selectList, setSelectList] = useState(
    props.lenght && props.estados.lenght ? 
    props.estados : 
    ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
  )
  const [selectedValue, setSelectedValue] = useState(null)

  function renderOptions() {
    return selectList.map(item => <Option key={item}>{item}</Option>)
  }

  function handleChange(value) {
    setSelectedValue(() => {
      props.onChange(value)
      return value
    })
  }

  return (
    <Select
      {...props}
      style={props.style || {}}
      allowClear={true}
      defaultActiveFirstOption={false}
      onChange={handleChange}
    >
      {renderOptions()}
    </Select>
  )

}