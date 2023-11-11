import React, { useState, useEffect, useCallback } from 'react'
import { Button, Row, Col, Select, message, Input } from "antd";
import { fetchListaFerramentas, gerarNovaChave, fetchChavesApi } from 'services/ducks/ApiKeys.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import TableChavesApi from './TableChavesApi';

const Option = Select.Option;

function ListaChaves() {
  const [generatingKey, setGeneratingKey] = useState(false);
  const [listaFerramentas, setListaFerramentas] = useState(null);
  const [ferramentaAtual, setFerramentaAtual] = useState(null);
  const [responsavel, onChangeResponsavel] = useState("");
  const [listData, setListData] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    fetchListaFerramentas()
      .then(data => setListaFerramentas(data))
      .catch(() => {
        setListaFerramentas(null);
        message.error('Falha ao obter a lista de ferramentas!')
      })
  }, []);

  const onFetchKeys = useCallback(() => {
    setFetchingData(true);
    
    fetchChavesApi()
    .then(data => {
      setListData(data)
    })
    .catch(err => {
      setListData([]);
      message.error("Falha ao obter a lista de chaves de api!");
    })
    .then(() => setFetchingData(false))
  }, []);
  
  useEffect(() => {
    onFetchKeys()
  }, [onFetchKeys])

  function onChangeFerramenta(nomeFerramenta) {
    setFerramentaAtual(nomeFerramenta !== "" ? nomeFerramenta : null)
  }

  function onGenerateNewApiKey() {
    if (!ferramentaAtual) {
      message.warning("Seleciona uma ferramenta da lista!");
      return;
    }

    if (!responsavel.length) {
      message.warning("Digite as informações sobre o responsável pela chave!");
      return;
    }

    if (responsavel.length < 15) {
      message.warning("Informações sobre o responsável insuficientes!");
      return;
    }

    setGeneratingKey(true);

    gerarNovaChave({ nomeFerramenta: ferramentaAtual, responsavel })
      .then(() => {
        message.success("Nova chave gerada para a ferramenta: " + ferramentaAtual + "!");
        onFetchKeys();
      })
      .catch((error) => {
        message.error(error)
      })
      .then(() => {
        setGeneratingKey(false)
      })
  }

  if (!listaFerramentas) {
    return <PageLoading />
  }

  return (
    <Row>
      <Col span={24}>
        <Row style={{ marginBottom: 5}}>
          <Col span={5}><span style={{fontWeight: 'bold'}}>Ferramenta</span></Col>
          <Col span={9}><span style={{fontWeight: 'bold'}}>Responsável</span></Col>
          <Col span={10}></Col>
        </Row>
        <Row>
          <Col span={5}>
            <Select
              placeholder="Selecione a Ferramenta"
              onChange={onChangeFerramenta}
              allowClear
              style={{ width: 310}}           
            >
              {listaFerramentas.map((elem, index) => {
                  return <Option key={index} value={elem.nomeFerramenta}>{elem.nomeFerramenta}</Option>
              })
              }
            </Select>
          </Col>
          <Col span={9}>
            <Input                    
              autoComplete={"off"}
              onChange={(e) => onChangeResponsavel(e.target.value)}
              value={responsavel}
              placeholder="Digite o nome do prefixo e o responsável pela chave"
            />
          </Col>
          <Col span={10}>
            <Button 
              type="primary" 
              onClick={onGenerateNewApiKey}
              style={{marginLeft: 15}}
              disabled={generatingKey}
              loading={generatingKey}
            >
              Nova API Key
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <TableChavesApi fetchingData={fetchingData} listData={listData} onFetchData={onFetchKeys} />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ListaChaves
