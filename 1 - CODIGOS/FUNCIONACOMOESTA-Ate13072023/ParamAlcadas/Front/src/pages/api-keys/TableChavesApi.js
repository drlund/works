import React, { useState } from 'react';
import { Button, message, Popconfirm, Tooltip } from "antd";
import SearchTable from 'components/searchtable/SearchTable';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { removerChavesApi } from 'services/ducks/ApiKeys.ducks';
import AlfaSort from 'utils/AlfaSort';
import DateBrSort from "utils/DateBrSort";
import styles from './Styles.module.scss';

import { 
  DeleteOutlined, 
  RedoOutlined,
  CopyOutlined
} from '@ant-design/icons';

function TableChavesApi(props) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [clearingSelecteds, setClearingSelecteds] = useState(false);

  function onCopyKey() {
    message.success("Chave copiada para área de transferência!")
  }

  function onRemoveKeys(keysToRemove) {
    setClearingSelecteds(true);
    let successMsg = keysToRemove.length > 1 ? "Chaves removidas com sucesso!" : "Chave removida com sucesso!";

    removerChavesApi(keysToRemove)
    .then(() => {

      message.success(successMsg);
      setSelectedRowKeys([]);
      props.onFetchData();
    })
    .catch(error => {
      message.error(error);
    })
    .then(() => {
      setClearingSelecteds(false);
    })
  }

  let columns = [
    {
      title: 'Data Criação',
      dataIndex: "dataCriacao",
      width: '10%',
      defaultSortOrder: 'descend',
      sorter: (a, b) => DateBrSort(a.dataCriacao, b.dataCriacao)
    },
    {
      width: '30%',
      title: 'Chave',
      render: (record,text) => {
        return (
          <span>
            <span style={{fontWeight: 'bold', marginRight: 15}}>{record.chave}</span>
            <CopyToClipboard text={record.chave} onCopy={onCopyKey}>
              <Button icon={<CopyOutlined />} type="text" title="Clique para copiar" />
            </CopyToClipboard>
          </span>
        )   
      }
    },    
    {
      width: '20%',
      title: 'Ferramenta',
      dataIndex: 'ferramenta',
      sorter: (a, b) => AlfaSort(a.ferramenta, b.ferramenta)
    }, 
    {
      width: '30%',
      title: 'Responsável',
      dataIndex: 'responsavel'
    },    
    {
      title: 'Ações',
      width: '10%',
      align: 'center',
      render: (text,record) => {
        
      return (
        <span>     
          <Tooltip title="Remover Chave" placement="bottom">
            <Popconfirm placement="topRight" title={`Deseja excluir a chave: "${record.chave}" ?`} onConfirm={() => onRemoveKeys([record.key])}>
                <DeleteOutlined className="link-color" />
            </Popconfirm>
          </Tooltip>
        </span>
      );
      },
    }
  ];

  function onRemoveSelecteds() {
    if (!selectedRowKeys.length) { 
      message.error('Necessária a seleção de pelo menos uma chave!');
      return;
    }

    onRemoveKeys(selectedRowKeys);
  }

  function onSelectChange(selectedRowKeys) {
    setSelectedRowKeys(selectedRowKeys);
  }

  function renderTable() {
    return (
      <SearchTable
        columns={columns} 
        dataSource={props.listData || []}
        size="small"
        ignoreAutoKey
        loading={props.fetchingData || clearingSelecteds}  
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
      />
    )
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.actionsContainer}>
        <Popconfirm placement="topRight" title="Deseja excluir os funcis selecionados?" onConfirm={onRemoveSelecteds} disabled={selectedRowKeys.length === 0}>
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
          onClick = {props.onFetchData}
          loading={props.fetchingData || clearingSelecteds}
        />
      </div>

      <div>
        {renderTable()}
      </div>
    </div>
  )
}

TableChavesApi.defaultProps = {
  listData: [],
  fetchingData: false,
  onFetchData: () => {}
}

export default TableChavesApi
