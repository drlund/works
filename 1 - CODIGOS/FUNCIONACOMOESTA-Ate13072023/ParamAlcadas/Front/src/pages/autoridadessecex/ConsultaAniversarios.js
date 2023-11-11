import React, { useState } from 'react';
import { Row, Col, DatePicker, Button, message, Tooltip } from 'antd';
import { RedoOutlined, FileExcelOutlined } from '@ant-design/icons';
import SearchTable from 'components/searchtable/SearchTable';
import AlfaSort from 'utils/AlfaSort';
import { DownloadFileUtil } from 'utils/Commons';
import useEffectOnce from 'utils/useEffectOnce';
import { fetchAniversariosAutoridades, fetchDownloadAniversariosAutoridades } from 'services/ducks/AutoridadesSecex.ducks';
import moment from 'moment';

const { RangePicker } = DatePicker;

function ConsultaAniversarios() {
  const [dataInicial, setDataInicial] = useState(moment().format('DD-MM-YYYY'));
  const [dataFinal, setDataFinal] = useState(moment().format('DD-MM-YYYY'));
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchingFile, setFetchingFile] = useState(false);
  const [listaAniversariantes, setListaAniversariantes] = useState([]);

  function onChange(value, dateString) {
    const [dataInicial, dataFinal] = dateString;
    setDataInicial(dataInicial);
    setDataFinal(dataFinal);
  }

  function onConsultaAniversariantes() {
    if (dataInicial === '') {
      message.error('Necessária a data inicial!');
      return;
    }

    if (dataFinal === '') {
      message.error('Necessária a data final!');
      return;
    }

    setFetchingData(true);

    fetchAniversariosAutoridades(dataInicial, dataFinal)
      .then(data => {
        setListaAniversariantes(data);
      })
      .catch(error => {
        message.error(error);
      })
      .then(() => {
        setFetchingData(false);
      });
  }

  function downloadLista() {
    setFetchingFile(true);

    fetchDownloadAniversariosAutoridades(dataInicial, dataFinal)
      .then((data) => {
        let periodo = dataInicial.substr(0, 5) + "-a-" + dataFinal.substr(0, 5);
        DownloadFileUtil(`aniversariantes-${periodo}.xlsx`, data);
      })
      .then(() => {
        setFetchingFile(false)
      })
  }

  useEffectOnce(() => {
    onConsultaAniversariantes()
  })

  function renderTable() {
    let columns = [
      {
        title: 'Aniversario',
        dataIndex: 'aniversario',
        width: '10%',
        sorter: (a, b) => AlfaSort(a.aniversario, b.aniversario)
      }, 
      {
        title: 'Tipo Poder',
        dataIndex: 'tipo_poder',
        sorter: (a, b) => AlfaSort(a.tipo_poder, b.tipo_poder)
      },
      {
        title: 'Nome',
        dataIndex: 'nome',
        sorter: (a, b) => AlfaSort(a.nome, b.nome)
      },
      {
        title: 'Nome Completo',
        dataIndex: 'nome_completo',
        sorter: (a, b) => AlfaSort(a.nome_completo, b.nome_completo)
      },
      {
        title: 'Cargo/Título',
        dataIndex: 'cargo_titulo',
        sorter: (a, b) => AlfaSort(a.cargo_titulo, b.cargo_titulo)
      },
      {
        title: 'Partido/Orgão',
        dataIndex: 'partido_orgao',
        sorter: (a, b) => AlfaSort(a.partido_orgao, b.partido_orgao)
      },
      {
        title: 'E-mail',
        dataIndex: 'email',
        sorter: (a, b) => AlfaSort(a.email, b.email)
      },
      {
        title: 'Telefone(s)',
        dataIndex: 'telefones',
        sorter: (a, b) => AlfaSort(a.telefones, b.telefones)
      }
    ];

    return (
      <SearchTable
        columns={columns} 
        dataSource={listaAniversariantes}
        size="small"
        ignoreAutoKey
        pagination={{showSizeChanger: true}}
        loading={fetchingData}
      />
    )
  }

  return (
    <div>
      <Row>
        <Col>
          <label>Período:</label>
        </Col>
      </Row>
      <Row style={{marginBottom: 15}}>
        <Col span={12}>
          <RangePicker
            format="DD-MM-YYYY"            
            onChange={onChange}
            defaultValue={[moment(), moment()]}
          />
          <Button 
            type="primary" 
            style={{marginLeft: 15}}
            onClick={onConsultaAniversariantes}
          >
            Consultar
          </Button>
        </Col>

        <Col span={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Tooltip title="Download Lista Aniversariantes">
            <Button 
              type="primary" 
              icon={<FileExcelOutlined />} 
              onClick={downloadLista}
              style={{marginRight: "15px", color: '#fff', backgroundColor: "#207245", border: "none"}} 
              loading={fetchingFile}
              disabled={(dataFinal === '' && dataFinal === '') || fetchingFile || fetchingData}
            >
              Download Lista
            </Button>
          </Tooltip>

          <Button 
            icon={<RedoOutlined />} 
            onClick={onConsultaAniversariantes}
            loading={fetchingData}
            disabled={dataFinal === '' && dataFinal === ''}
          />
        </Col>

      </Row>

      <Row>
        <Col>
          {renderTable()}
        </Col>
      </Row>
    </div>
  )
}

export default ConsultaAniversarios;