import React, { useState, useEffect } from 'react';
import SearchTable from 'components/searchtable/SearchTable';
import AlfaSort from 'utils/AlfaSort';
import { getProfileURL } from 'utils/Commons';

import { 
  DeleteOutlined, 
  PlusOutlined, 
  RedoOutlined 
} from '@ant-design/icons';

import InputFunci from 'components/inputsBB/InputFunci';

import { 
  fetchPublicoAlvo, 
  addFunciToPublicoAlvo, 
  deleteFuncisFromPublicoAlvo 
} from 'services/ducks/AutoridadesSecex.ducks';

import {
  Divider,
  Avatar,
  message,
  Tooltip,
  Popconfirm,
  Button
} from 'antd';

import styles from './PublicoAlvo.module.scss';

function PublicoAlvo() {
  const [publicoAlvo, setPublicoAlvo] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [addingFunci, setAddingFunci] = useState(false);
  const [matriculaIncluindo, setMatriculaIncluindo] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [clearingSelecteds, setClearingSelecteds] = useState(false);

  function onAddFunci(matricula) {
    if (!matricula || !matricula.length) { 
      message.error('Necessária a matrícula do funci!');
      return;
    }

    if (matricula.length < 8) {
      message.error('Matricula do funci inválida!');
      return;
    }

    setAddingFunci(true);

    addFunciToPublicoAlvo(matricula)
      .then(() => {
        message.success('Funcionário adicionado com sucesso!');
        loadPublicAlvo();
      })
      .catch(error => {
        message.error(error);
      })
      .then(() => {
        setAddingFunci(false);
      })
  }

  function onRemoveFunci(matricula) {
    setFetchingData(true);

    deleteFuncisFromPublicoAlvo([matricula])
      .then(() => {
        message.success('Funcionário removido com sucesso!');
        loadPublicAlvo();
      })
      .catch(error => {
        message.error(error);
      })
      .then(() => {
        setFetchingData(false);
      })
  }

  function onRemoveFuncisSelecteds() {
    if (!selectedRowKeys.length) { 
      message.error('Necessária a matrícula de pelo menos um funci!');
      return;
    }

    setClearingSelecteds(true);

    deleteFuncisFromPublicoAlvo(selectedRowKeys)
      .then(() => {
        message.success('Funcionário(s) removido(s) com sucesso!');
        setSelectedRowKeys([]);
        loadPublicAlvo();
      })
      .catch(error => {
        message.error(error);
      })
      .then(() => {
        setClearingSelecteds(false);
      })
  }

  function loadPublicAlvo() {
    setFetchingData(true);

    fetchPublicoAlvo()
      .then(data => {
        setPublicoAlvo(data);
      })
      .catch(error => {
        message.error(error);
      })
      .then(() => {
        setFetchingData(false)
      })
  }

  useEffect(() => {
    loadPublicAlvo();
  }, []);

  let columns = [
    {
      title: 'Funcionario',
      width: '40%',
      sorter: (a, b) => AlfaSort(a.nomeGuerra, b.nomeGuerra),
      render: (record,text) => {           
        return (
          <span>
            <Avatar src={`${getProfileURL(record.matricula)}`} /> 
            <Divider type="vertical" />
            <a target="_blank" rel="noopener noreferrer" href={"https://humanograma.intranet.bb.com.br/" + record.matricula}>{record.matricula} - {record.nomeGuerra}</a> 
          </span>
        )
      },
    }, 
    {
      width: '20%',
      title: 'Cargo',
      dataIndex: 'cargo',
      sorter: (a, b) => AlfaSort(a.cargo, b.cargo)
    },    
    {
      width: '20%',
      title: 'Prefixo',
      sorter: (a, b) => AlfaSort(a.prefixo, b.prefixo),
      render: (record,text) => {
        return (<span>{record.prefixo} - {record.dependencia}</span>)   
      }
    }, 
    {
      width: '10%',
      title: 'Quer receber emails?',
      dataIndex: 'blacklist'
    },    
    
    {
      title: 'Ações',
      width: '10%',
      align: 'center',
      render: (text,record) => {
        
      return (
        <span>     
          <Tooltip title="Remover colaborador" placement="bottom">
            <Popconfirm placement="topRight" title={`Deseja excluir "${record.nome}" ?`} onConfirm={() => onRemoveFunci(record.key)}>
                <DeleteOutlined className="link-color" />
            </Popconfirm>
          </Tooltip>
        </span>
      );
      },
    }
  ];
  
  function onSelectChange(selectedRowKeys) {
    setSelectedRowKeys(selectedRowKeys);
  }

  function renderTable() {
    return (
      <SearchTable
        columns={columns} 
        dataSource={publicoAlvo}
        size="small"
        ignoreAutoKey
        loading={fetchingData}  
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
      />
    )
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.sectionContainer}>
        <div className={styles.headerText}>
          <label>Incluir Funcionário no Público-Alvo</label>
        </div>

        <div className={styles.inputContainer}>
          <InputFunci allowClear={true} onChange={value => setMatriculaIncluindo(value)} style={{width: '50%'}} />
          <Button 
            onClick={() => onAddFunci(matriculaIncluindo) }
            type="primary" 
            shape="circle" 
            icon={<PlusOutlined />}
            style={{marginLeft: 10}}
            disabled={addingFunci}
          />
        </div>
      </div>

      <div className={styles.actionsContainer}>
        <Popconfirm 
          placement="topRight" 
          title="Deseja excluir os funcis selecionados?" 
          onConfirm={onRemoveFuncisSelecteds}
          disabled={selectedRowKeys.length === 0}
        >
          <Button 
            icon={<DeleteOutlined />} 
            type="danger"
            disabled={selectedRowKeys.length === 0}
            loading={clearingSelecteds}
          >
            Remover Selecionados
          </Button>
        </Popconfirm>

        <Button 
          icon={<RedoOutlined />} 
          style={{marginLeft: '15px'}}
          onClick = {loadPublicAlvo}
          loading={fetchingData}
        />
      </div>

      <div>
        {renderTable()}
      </div>
    </div>
  )
}

export default PublicoAlvo
