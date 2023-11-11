import React, { useState } from 'react'
import AlfaSort from 'utils/AlfaSort';
import StyledCard from 'components/styledcard/StyledCard';
import SearchTable from 'components/searchtable/SearchTable';
import { DeleteOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import QuestionHelp from 'components/questionhelp';
import { useSelector, useDispatch } from "react-redux";
import _ from 'lodash';

import {
  Divider,
  Tooltip,
  Popconfirm,
  Spin,
  Button,
  Row,
  Col,
  Avatar,
  message,
} from 'antd';

import InputFunci from 'components/inputsBB/InputFunci';
import { fetchFunciAutorizacao, removeFunciAutorizacao } from 'services/ducks/OrdemServ.ducks';

function AutorizacaoConsulta() {
  const [loading, setLoading] = useState(false)
  const [matriculaIncluindo, setMatriculaIncluindo] = useState(null)
  const autorizacaoConsulta  = useSelector(({ordemserv}) => ordemserv.ordemEdicao.autorizacaoConsulta)
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  const helpTitle = `A ordem em questão será exibida na lista "Minhas Ordens" dos funcionários adicionados. O funcionário poderá apenas consultar o conteúdo da ordem sem nenhum poder de alterção da mesma. Obs.: Caso o funcionário não deseje mais o acesso à ordem, este poderá remover o acesso por conta própria.`
  const dispatch = useDispatch()

  const columns = [
    {
      title: 'Funcionario',
      key: 'matricula',
      width: '50%',
      sorter: (a, b) => AlfaSort(a.nome, b.nome),
      render: (record,text) => {           
        return (<span>   <Avatar src={record.img} /> <Divider type="vertical" /><a target="_blank" rel="noopener noreferrer" href={"https://humanograma.intranet.bb.com.br/" + record.matricula}>{record.matricula} - {record.nome}</a> </span>)   
      },
    }, {
      width: '15%',
      title: 'Cargo',
      dataIndex: 'cargo',
      sorter: (a, b) => AlfaSort(a.cargo, b.cargo),
      key: 'cargo',
    },    
    {
      width: '15%',
      title: 'Prefixo',
      sorter: (a, b) => AlfaSort(a.prefixo, b.prefixo),
      render: (record,text) => {
        return (<span>{record.prefixo} - {record.nomeDependencia}</span>)   
      }
    }, {
      key: 'key',
      title: 'Ações',
      width: '10%',
      align: 'center',
      render: (text,record) => {        
        return (
          <span>     
            <Tooltip placement="bottom">
              <Popconfirm title="Deseja excluir este funcionário?" onConfirm={() => removeRegister(record.key) }>
                  <DeleteOutlined className="link-color" />
              </Popconfirm>
            </Tooltip>
          </span>
        );
      }
    }
  ];

  function isFunciInList(matricula) {
    return _.find(autorizacaoConsulta, (funci) => { 
      return funci.key === matricula
    })
  }

  function addFunciAutorizacao() {
    if (!matriculaIncluindo || matriculaIncluindo.length < 8) {
      message.warning("Informe o funcionário a ser adicionado!")
      return
    }

    if (isFunciInList(matriculaIncluindo)) {
      message.warning("Funcionário já está na lista!")
      return
    }

    setLoading(true);

    dispatch(fetchFunciAutorizacao(matriculaIncluindo, {
      successCallback: () => {
        message.success("Funcionário adicionado com sucesso!")
        setLoading(false)
      },
      errorCallback: err => {
        setLoading(false)
        message.error(err)
      }
    }))
  }

  function removeRegister(matricula) {
    setLoading(true)
    dispatch(removeFunciAutorizacao(matricula, {
      successCallback: () => {
        message.success("Funcionário removido com sucesso!")
        setLoading(false)
      },
      errorCallback: err => {
        message.error(err)
        setLoading(false)
      }
    }))
  }

  return (
      <Spin indicator={antIcon} spinning={loading}>
        <StyledCard title={<span>Incluir Funcionários para Consultar esta Ordem <QuestionHelp title={helpTitle} style={{marginLeft: 20}} contentWidth={550} /></span>}>
          <Row>
            <Col span={12}>
              <InputFunci allowClear={true} onChange={setMatriculaIncluindo} style={{width: "100%"}} />
            </Col>
            <Col span={1}>
              <Button 
                style={{ marginLeft: 15 }}
                onClick={addFunciAutorizacao}
                type="primary" 
                shape="circle" 
                icon={<PlusOutlined />} />
            </Col>
          </Row>

          <Divider />        

          {!_.isEmpty(autorizacaoConsulta) && 
            <Row>
              <Col span={24}>
                <SearchTable 
                  columns={columns} 
                  dataSource={autorizacaoConsulta}
                  showHeader={autorizacaoConsulta.length ? true : false}
                />
              </Col>
            </Row>
          }
        </StyledCard>
      </Spin>
    )
}

export default AutorizacaoConsulta
