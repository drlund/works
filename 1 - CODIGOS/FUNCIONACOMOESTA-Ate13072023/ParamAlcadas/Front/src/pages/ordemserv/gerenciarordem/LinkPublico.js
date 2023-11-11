import React, { useState, useEffect } from 'react'
import StyledCard from 'components/styledcard/StyledCard';
import QuestionHelp from 'components/questionhelp';
import { LoadingOutlined, CopyOutlined } from '@ant-design/icons';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useSelector } from "react-redux";
import { 
  fetchLinkPublico, criarLinkPublico, 
  trocarSenhaLinkPublico, excluirLinkPublico 
} from 'services/ducks/OrdemServ.ducks';

import {
  Spin,
  Button,
  message,
  Descriptions,
  Row,
  Col,
  Popconfirm
} from 'antd';

const styles = {
  senha : {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a81e3'
  }
}

const Item = Descriptions.Item;

function LinkPublico() {
  const [loading, setLoading] = useState(true)
  const [linkPublico, setLinkPublico] = useState({hash: '', senha: ''})
  const [possuiLinkPublico, setPossuiLinkPublico] = useState(false)
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  const helpTitle = `O link público permite o acesso de visualização a qualquer funcionário desde que de posse da senha.`;
  const urlBase = `${process.env.PUBLIC_URL}/ordemserv/acesso-publico/`;
  const idOrdem = useSelector(({ordemserv}) => ordemserv.ordemEdicao.dadosBasicos.id)

  useEffect(() => {
    setLoading(true)

    fetchLinkPublico(idOrdem)
      .then(data => {
        setLinkPublico({ hash: data.hash, senha: data.senha })
        setPossuiLinkPublico(data.hash !== '')
      })
      .catch(error => {
        message.error(error)
        setPossuiLinkPublico(false)
      })
      .then(() => setLoading(false))
  }, [idOrdem])

  function onCopyMsg(text) {
    message.success(`${text} para área de transferência!`)
  }

  function onClickNewLinkPublico() {
    setLoading(true)

    criarLinkPublico(idOrdem)
    .then(data => {
      setLinkPublico({ hash: data.hash, senha: data.senha })
      setPossuiLinkPublico(true)
    })
    .catch(error => {
      message.error(error)
    })
    .then(() => setLoading(false))
  }

  function onGenerateNewPassword() {
    setLoading(true)

    trocarSenhaLinkPublico(idOrdem)
    .then(data => {
      setLinkPublico({ hash: data.hash, senha: data.senha })
    })
    .catch(error => {
      message.error(error)
    })
    .then(() => setLoading(false))
  }

  function onDeleteLinkPublico() {
    setLoading(true)

    excluirLinkPublico(idOrdem)
    .then(() => {
      setLinkPublico({ hash: '', senha: ''})
      setPossuiLinkPublico(false)
    })
    .catch(error => {
      message.error(error)
    })
    .then(() => setLoading(false))
  }

  return (
    <Spin indicator={antIcon} spinning={loading}>
      <StyledCard title={<span>Link público de Consulta da Ordem <QuestionHelp title={helpTitle} style={{marginLeft: 20}} contentWidth={550} /></span>}>
        { possuiLinkPublico && 
          <div>
            <Descriptions bordered size="small" column={1} style={{marginBottom: 15}}>
              <Item label="Link">
                <Button type="link">{`${urlBase}${linkPublico.hash}`}</Button>
                <CopyToClipboard text={`${urlBase}${linkPublico.hash}`} onCopy={() => onCopyMsg("Link copiado")}>
                  <Button icon={<CopyOutlined />} type="text" title="Clique para copiar" />
                </CopyToClipboard>
              </Item>
              <Item label="Senha">
                <span style={styles.senha}>{linkPublico.senha}</span>
                <CopyToClipboard text={linkPublico.senha} onCopy={() => onCopyMsg("Senha copiada")}>
                  <Button icon={<CopyOutlined />} type="text" title="Clique para copiar" />
                </CopyToClipboard>
                <Popconfirm title="Deseja gerar uma nova senha para este link?" onConfirm={onGenerateNewPassword}>
                    <Button type="primary" size="small" style={{marginLeft: 20}}>Gerar Nova Senha</Button>
                </Popconfirm>
              </Item>
            </Descriptions>

            <Row justify="center">
              <Col span={4}>
                <Popconfirm title="Deseja excluir o link público desta ordem?" onConfirm={onDeleteLinkPublico}>
                  <Button type="primary" danger disabled={loading}>Remover Link Público</Button>
                </Popconfirm>
              </Col>
            </Row> 
          </div>
        }

        { possuiLinkPublico === false &&
          <Row justify="center">
            <Col span={4}>
              <Button type="primary" disabled={loading} onClick={onClickNewLinkPublico}>Criar Link Público</Button>
            </Col>
          </Row> 
        }
      </StyledCard>
    </Spin>
  )
}

export default LinkPublico
