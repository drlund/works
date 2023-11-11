import React, { useState, useEffect } from 'react';
import SearchTable from 'components/searchtable/SearchTable';
import QuestionHelp from 'components/questionhelp/QuestionHelp';
import AlfaSort from 'utils/AlfaSort';
import DateBrSort from 'utils/DateBrSort';

import {
  UploadOutlined,
  RedoOutlined 
} from '@ant-design/icons';

import { 
  fetchDadosAutoridades,
  processAutoridadesFile
} from 'services/ducks/AutoridadesSecex.ducks';

import {
  Upload,
  message,
  Button
} from 'antd';

import styles from './DadosAutoridades.module.scss';

function DadosAutoridades() {
  const [dadosAutoridades, setDadosAutoridades] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadBtnKey, setUploadBtnKey] = useState(Date.now);


  function loadPublicAlvo() {
    setFetchingData(true);

    fetchDadosAutoridades()
      .then(data => {
        setDadosAutoridades(data);
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

  function handleFile() {
    if (selectedFile === null) {
      message.error('Arquivo não informado!');
      return;
    }

    setUploadingFile(true);

    processAutoridadesFile(selectedFile)
      .then(() => {
        message.success("Arquivo de autoridades processado com sucesso!");
        setSelectedFile(null);
        setUploadBtnKey(Date.now);
        loadPublicAlvo();
      })
      .catch((error) => {
        message.error(error);
      })
      .then(() => {
        setUploadingFile(false);
      })
  }

  let columns = [
    {
      title: 'Data Atualização',
      dataIndex: "data_atualizacao",
      defaultSortOrder: 'ascend',
      sorter: (a, b) => DateBrSort(a.data_atualizacao, b.data_atualizacao)
    },
    {
      title: 'Tipo Poder',
      dataIndex: 'tipo_poder',
      sorter: (a, b) => AlfaSort(a.tipo_poder, b.tipo_poder),
    },
    {
      title: 'Nome da Autoridade',
      dataIndex: 'nome',
      sorter: (a, b) => AlfaSort(a.nome, b.nome)
    }, 
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      sorter: (a, b) => AlfaSort(a.cargo, b.cargo),
    },    
    {
      title: 'Orgão',
      dataIndex: 'orgao',
      sorter: (a, b) => AlfaSort(a.orgao, b.orgao)
    }, 
    {
      title: 'Aniversário',
      dataIndex: 'aniversario',
      sorter: (a, b) => AlfaSort(a.aniversario, b.aniversario)
    },    

    {
      title: 'Telefones',
      dataIndex: 'telefones',
      sorter: (a, b) => AlfaSort(a.aniversario, b.aniversario)
    },    
    {
      title: 'E-mail',
      dataIndex: 'email',
      sorter: (a, b) => AlfaSort(a.email, b.email)
    }
  ];
  
  function renderTable() {
    return (
      <SearchTable
        columns={columns} 
        dataSource={dadosAutoridades}
        size="small"
        ignoreAutoKey
        loading={fetchingData}  
      />
    )
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.sectionContainer}>
        <div className={styles.headerText}>
          <label>
            Incluir Planilha das Autoridades (*.xlsx)
            <QuestionHelp 
              title="Arquivo deve conter um cabeçalho com as seguintes colunas: Seção, Autoridade, Órgão, Cargo, Aniversário, Telefone, E-mail." 
              style={{marginLeft: 15}}
              contentWidth={500}
            />
          </label>
        </div>

        <div className={styles.inputContainer}>
          <div>
            <Upload 
              key={uploadBtnKey}
              beforeUpload={file => { setSelectedFile(file); return false;}}
              onRemove={file => setSelectedFile(null)}
              accept=".xlsx"
              disabled={uploadingFile}
              fileList={selectedFile ? [selectedFile] : []}
            >
              <Button>
                <UploadOutlined /> Selecione o arquivo
              </Button>
            </Upload>
          </div>

          <div>
            <Button 
              onClick={handleFile}
              type="primary" 
              style={{marginLeft: 10}}
              disabled={selectedFile === null || uploadingFile}
              loading={uploadingFile}
            >
              {uploadingFile ? `Aguarde...` : `Processar Arquivo`}
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.actionsContainer}>
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

export default DadosAutoridades;
