import React, { useState, useCallback } from 'react';
import { Button, Tooltip, Popconfirm, message, Select } from 'antd';
import { PlusOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import InputPrefixo from 'components/inputsBB/InputPrefixo';
import SearchTable from 'components/searchtable/SearchTable';
import QuestionHelp from 'components/questionhelp/QuestionHelp';
import CommonStyles from "@/Commons.module.scss";
import AlfaSort from 'utils/AlfaSort';
import useEffectOnce from 'utils/useEffectOnce';
import { fetchDetentoresEstoque, salvarDetentorEstoque, deleteDetentorEstoque } from 'services/ducks/Encantar.ducks';

const Option = Select.Option;

function DetentoresEstoque() {
  const [dependencia, setDependencia] = useState(null);
  const [dadosTabela, setDadosTabela] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [global, setGlobal] = useState(0);

  const loadData = useCallback(() => {
    setFetchingData(true)
    fetchDetentoresEstoque()
      .then(data => setDadosTabela(data))
      .catch(error => message.error(error))
      .then(() => setFetchingData(false))
  }, [])

  useEffectOnce(() => {
    loadData();
  })

  function onAddClick() {
    if (!dependencia || !dependencia.length) {
      message.error("Necessário o prefixo da dependência!");
      return;
    }

    setFetchingData(true);
    salvarDetentorEstoque(dependencia, global)
      .then(() => {
        message.success("Novo detentor de estoque cadastrado com sucesso!");
        loadData();
      })
      .catch(error => {
        message.error(error);
        setFetchingData(false);
      })
  }

  function onRemoverRegistro(id) {
    setFetchingData(true)
    deleteDetentorEstoque(id)
      .then(() => {
        message.success("Detentor removido com sucesso!");
        loadData();
      })
      .catch(error => {
        message.error(error);
        setFetchingData(false)
      })
  }

  const columns = [
    {
      title: "Prefixo",
      dataIndex: "prefixo",
      sorter: (a, b) => AlfaSort(a.prefixo, b.prefixo),
      width: '15%'
    },
    {
      title: "Dependência Detentora",
      dataIndex: "nomePrefixo",
      sorter: (a, b) => AlfaSort(a.nomePrefixo, b.nomePrefixo),
      width: '40%'
    },
    {
      title: "Global",
      dataIndex: "global",
      sorter: (a, b) => AlfaSort(a.global, b.global),
      width: '15%'
    },
    {
      title: "Resp. Inclusão",
      dataIndex: "matriculaInclusao",
      sorter: (a, b) => AlfaSort(a.matriculaInclusao, b.matriculaInclusao),
      width: '20%'
    },
    {
      title: "Ações",
      width: '10%',
      render: (text,record) => {
        return (
          <Tooltip title="Remover">
            <Popconfirm title="Deseja excluir esta dependência?" placement="left" onConfirm={() => onRemoverRegistro(record.id) } >
              <DeleteOutlined className="link-color" />
            </Popconfirm>
          </Tooltip>
        )
      }
    }
  ];

  function renderTable() {
    return (
      <SearchTable               
        columns={columns} 
        dataSource={dadosTabela}
        size="small"
        loading={fetchingData}
        pagination={{showSizeChanger: true}}
      />
    )
  }

  return (
    <div className={CommonStyles.flexColumn}>
      <div className={CommonStyles.flexRow} style={{marginBottom: 15}}>
        <div className={CommonStyles.flexColumn} style={{flex: "1 1 50%", flexGrow: 0, paddingRight: 10}}>
          <div className={CommonStyles.headerText}>Dependência Detentora</div>
            <InputPrefixo 
              onChange={value => setDependencia(value)} 
              allowClear={true} 
            />
        </div>

        <div className={CommonStyles.flexColumn} style={{flex: "1 1 20%", flexGrow: 0, paddingRight: 10}}>
          <div className={CommonStyles.headerText}>
            Global
            <QuestionHelp
              title="Se sim, qualquer solicitante pode incluir um brinde desta dependência. Caso contrário os brindes estarão disponíveis apenas se a dependência estiver na jurisdição do solicitante."
              style={{ marginLeft: 10 }}
              contentWidth={550}
              placement="top"
            />
          </div>
          <Select defaultValue={global} onChange={ value => setGlobal(value)}>
            <Option value={1}>Sim</Option>
            <Option value={0}>Não</Option>
          </Select>
        </div>

        <div className={CommonStyles.flexColumn} style={{flex: "1 1 5%", flexGrow: 0, paddingRight: 10}}>
          <div className={CommonStyles.headerText}>&nbsp;</div>
          <Button icon={<PlusOutlined />} type="primary" title="Incluir nova depêndencia detentora" onClick={onAddClick} />
        </div>

        <div className={CommonStyles.flexColumn} style={{flex: "1 1 25%", flexGrow: 0}}>
          <div className={CommonStyles.headerText} style={{alignSelf: 'end'}}>&nbsp;</div>
          <Button 
            icon={<ReloadOutlined />} 
            type="primary" 
            style={{alignSelf: 'end'}} onClick={loadData} 
            disabled={fetchingData}
          />
        </div>
      </div>

      {renderTable()}
    </div>
  )
}

export default DetentoresEstoque
