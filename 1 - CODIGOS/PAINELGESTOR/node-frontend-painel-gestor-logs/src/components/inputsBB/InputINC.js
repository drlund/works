import React, { useState, useEffect } from 'react'
import { Select, message, Spin } from 'antd'
import _ from 'lodash'
import { connect } from 'react-redux'
import { searchINC } from 'services/ducks/INC.ducks'
import { CancelToken, isCancel } from 'services/apis/ApiModel';

const { Option } = Select
let cancelRequest = null;

function InputINC(props) {
  const [instrucoesList, setInstrucoesList] = useState([])
  const [selectedValue, setSelectedValue] = useState(null)
  const [searching, setSearching] = useState(false)
  const handleSearchDebounced = _.debounce(handleSearch, 500)

  function renderOptions() {
    return instrucoesList.map(e => <Option key={e.numero}>{String(e.numero).padStart(4,'0')} - {e.titulo}</Option>)
  }

  function handleChange(value) {
    setSelectedValue(() => {
      props.onChange(value)
      return value
    })
  }

  useEffect(() => {
    cancelRequest && cancelRequest();

    if (selectedValue === undefined) {
      setInstrucoesList([])
    }
  }, [selectedValue])

  function handleSearch(value) {
    cancelRequest && cancelRequest();

    if (value.length > 1) {
      setSearching(true)

      props.searchINC(value, new CancelToken(c => cancelRequest = c))
        .then((resultList) => {
          setInstrucoesList(resultList)
        })
        .catch((error) => {
          if (!isCancel(error)) {
            setInstrucoesList([])
            message.error(error)
          }
        })
        .then(() => setSearching(false))
    } else {
      setSearching(false)
      setInstrucoesList([])
    }
  }

  function onItemSelected(value) {
    if (props.onItemSelected) {
      if (instrucoesList.length === 1) {
        setTimeout(() => {
          props.onItemSelected(value)
        }, 500)
      }
    }
  }

  return (
    <Select
      {...props}
      showSearch
      placeholder={props.placeholder || "Número ou título da IN"}
      style={props.style || {}}
      allowClear={true}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearchDebounced}
      onChange={handleChange}
      notFoundContent={searching ? <Spin size="small" /> : null}
      loading={searching}
      onSelect={onItemSelected}
    >
      {renderOptions()}
    </Select>
  )

}

export default connect(null, { searchINC })(InputINC)