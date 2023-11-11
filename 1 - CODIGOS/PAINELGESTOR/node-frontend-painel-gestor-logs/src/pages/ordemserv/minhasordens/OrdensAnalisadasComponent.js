import React, { useState } from 'react';
import { Row, Col, message, Select, Button } from 'antd';
import SearchTable from 'components/searchtable/SearchTable';
import { PlusOutlined, CloseSquareOutlined } from '@ant-design/icons';
import AlfaSort from 'utils/AlfaSort';
import IntegerSort from 'utils/IntegerSort';
import useEffectOnce from 'utils/useEffectOnce';
import { fetchOrdensAnalisadas, fetchListaGestoresSugestoes, fetchListaInstrucoesSugestoes } from 'services/ducks/OrdemServ.ducks';
import styles from './OrdensAnalisadasComponent.module.scss';

const { Option } = Select;

function OrdensAnalisadasComponent(props) {
  const [fetchingData, setFetchingData] = useState(true);
  const [fetchingGestores, setFetchingGestores] = useState(true);
  const [fetchingInstrucoes, setFetchingInstrucoes] = useState(true);
  const [listaGestores, setListaGestores] = useState([]);
  const [listaInstrucoes, setListaInstrucoes] = useState([]);
  const [gestor, setGestor] = useState(0);
  const [instrucao, setInstrucao] = useState(0);
  const [redeVarejo, setRedeVarejo] = useState("ambos");
  const [tableData, setTableData] = useState([]);

  function onFetchSugestoes(filters = {}) {
    setFetchingData(true);

    fetchOrdensAnalisadas(filters)
      .then(data => {
        setTableData(data);
      })
      .catch(error => {
        message.error(error);
      })
      .then(() => {
        setFetchingData(false);
      });
  }

  function onFetchListaGestores() {
    setFetchingGestores(true);
    fetchListaGestoresSugestoes()
      .then(data => {
        setListaGestores(data)
      })
      .catch(error => {
        message.error(error);
      })
      .then(() => {
        setFetchingGestores(false);
      });
  }

  function onFetchListaInstrucoes() {
    setFetchingInstrucoes(true);
    fetchListaInstrucoesSugestoes()
      .then(data => {
        setListaInstrucoes(data)
      })
      .catch(error => {
        message.error(error);
      })
      .then(() => {
        setFetchingInstrucoes(false);
      });
  }

  useEffectOnce(() => {
    onFetchSugestoes()
    onFetchListaGestores()
    onFetchListaInstrucoes()
  })

  function createColumns() {
    let columns = [
      {
        title: 'Pref.Gestor',
        dataIndex: 'gestor',
        width: '10%',
        sorter: (a, b) => IntegerSort(a.gestor, b.gestor)
      }, 
      {
        title: 'Gestor',
        dataIndex: 'nome_gestor',
        sorter: (a, b) => AlfaSort(a.nome_gestor, b.nome_gestor)
      },
      {
        title: 'INC',
        dataIndex: 'in',
        sorter: (a, b) => IntegerSort(a.in, b.in)
      },
      {
        title: 'Título',
        dataIndex: 'titulo',
        sorter: (a, b) => AlfaSort(a.titulo, b.titulo)
      },
      {
        title: 'Tipo Normativo',
        dataIndex: 'descricao',
        sorter: (a, b) => AlfaSort(a.descricao, b.descricao)
      },
      {
        title: 'Rede Varejo',
        dataIndex: 'rede_varejo',
        sorter: (a, b) => AlfaSort(a.rede_varejo, b.rede_varejo)
      },
      {
        title: 'Item',
        dataIndex: 'item',
        sorter: (a, b) => AlfaSort(a.item, b.item)
      },
      {
        title: 'Texto Item',
        dataIndex: 'texto',
        sorter: (a, b) => AlfaSort(a.texto, b.texto)
      }
    ];

    if (props.withAddAction) {
      columns.push({
        title: "Ações",
        width: '10%',
        align: 'center',
        render: (text,record) => {
          return (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              if (props.onSelectedItem) {
                props.onSelectedItem({
                  nroINC: record.in,
                  titulo: record.titulo,
                  codTipoNormativo: record.tipo,
                  tipoNormativo: record.descricao,
                  versao: record.versao,
                  item: record.item,
                  textoItem: record.texto
                })
              }
            }} />
          )
        }
      })
    }

    return columns;
  }

  function onGestorChange(value) {
    setGestor(value)
  }

  function onInstrucaoChange(value) {
    setInstrucao(value)
  }

  function onRedeVarejoChange(value) {
    setRedeVarejo(value)
  }

  function onFilter() {
    let filters = {};

    if (gestor !== 0) {
      filters["gestor"] = gestor;
    }

    if (instrucao !== 0) {
      filters["instrucao"] = instrucao
    }

    if (redeVarejo !== "ambos") {
      filters["redeVarejo"] = redeVarejo
    }

    onFetchSugestoes(filters)
  }

  function renderListaGestores() {
    return listaGestores.map(elem => {
      return (
        <Option key={elem.gestor} value={elem.gestor}>{elem.nome_gestor}</Option>
      )
    })
  }

  function renderListaInstrucoes() {
    return listaInstrucoes.map(elem => {
      return (
        <Option key={elem.in} value={elem.in}>{`${elem.in} - ${elem.titulo}`}</Option>
      )
    })
  }

  function onClearFilters() {
    setGestor(0)
    setInstrucao(0)
    setRedeVarejo("ambos")
    onFetchSugestoes()
  }

  return (
    <div>
      <Row>
        <Col span={24} sm={12} className={styles.mainContainer}>
          <div className={styles.sectionContainer}>
            <div className={styles.headerText}>
              <label>
                Gestor
              </label>
            </div>

            <div className={styles.inputContainer}>
              <Select 
                value={gestor} 
                style={{ width: 250 }} 
                onChange={onGestorChange}
                loading={fetchingGestores}
              >
                <Option key={0} value={0}>- Selecione -</Option>
                {renderListaGestores()}
              </Select>
            </div>
          </div>

          <div className={styles.sectionContainer}>
            <div className={styles.headerText}>
              <label>
                Instrução Normativa
              </label>
            </div>

            <div className={styles.inputContainer}>
              <Select 
                value={instrucao} 
                style={{ width: 400 }} 
                onChange={onInstrucaoChange}
                loading={fetchingInstrucoes}
              >
                <Option value={0} key={0}>- Selecione -</Option>
                {renderListaInstrucoes()}             
              </Select>
            </div>
          </div>

          <div className={styles.sectionContainer}>
            <div className={styles.headerText}>
              <label>
                Rede Varejo?
              </label>
            </div>

            <div className={styles.inputContainer}>
              <Select 
                value={redeVarejo} 
                style={{ width: 140 }} 
                onChange={onRedeVarejoChange}
              >
                <Option value="ambos" key={0}>- Selecione -</Option>
                <Option value="Sim" key={1}>Sim</Option>
                <Option value="Não" key={2}>Não</Option>
              </Select>
            </div>
          </div>

          <div className={styles.sectionContainer}>
            <div className={styles.headerText}>
            </div>

            <div className={styles.inputContainer}>
              <Button type="primary" style={{marginRight: 5}} disabled={fetchingData} loading={fetchingData} onClick={onFilter}>Filtrar</Button>
              <Button type="danger" title="Limpar filtros" disabled={fetchingData} icon={<CloseSquareOutlined />} onClick={onClearFilters} />
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <SearchTable
            columns={createColumns()} 
            dataSource={tableData}
            size="small"
            ignoreAutoKey
            pagination={{showSizeChanger: true, defaultPageSize: props.defaultPageSize || 10}}
            loading={fetchingData}
          />
        </Col>
      </Row>
    </div>
  )
}

export default OrdensAnalisadasComponent
