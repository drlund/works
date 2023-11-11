import React, { useState } from 'react'
import StyledCard from 'components/styledcard/StyledCard';
import { LoadingOutlined } from '@ant-design/icons';
import InfoLabel from 'components/infolabel/InfoLabel';
import VisualizarOrdemComponent from '../minhasordens/VisualizarOrdemComponent';
import { verifyPermission } from 'utils/Commons';
import { useSelector } from "react-redux";
import { fetchOrdemLinkPublico } from 'services/ducks/OrdemServ.ducks';
import {
  Spin,
  Button,
  message,
  Input,
  Row,
  Col
} from 'antd';

import styled from 'styled-components';

const HeaderPanel = styled.div`
  background-color: #7999b2;
  margin-top: -24px;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 12px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  min-height: 40px;
  text-align: center;
  border-bottom: 3px solid #5f788b;
  margin-bottom: 15px;
`;


function VisualizarLinkPublicoForm(props) {
  const [hash] = useState(props.match.params.id || null)
  const [password, setPassword] = useState("")
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  const [loading, setLoading] = useState(false)
  const [dadosOrdem, setDadosOrdem] = useState(null)
  const authState = useSelector(({app}) => app.authState)

  const visConfig = {
    mostrarDesignantes:true, 
    modoEdicaoDesignantes: false,
    mostrarDesignados:true,
    modoEdicaoDesignados: false
  };

  const hasPrintPdfPermission = verifyPermission({
    ferramenta: 'Ordem de Serviço',
    permissoesRequeridas: ['IMPRIMIR_PDF'],
    authState: authState
  });

  if (!hash || hash.length < 32) {
    return (
      <InfoLabel type="error" showicon style={{marginLeft: '20px'}}>            
        Link da ordem pública inválido!
      </InfoLabel>
    )
  }

  function onConsultarOrdem() {
    setLoading(true)

    if (!password || password.length < 8) {
      message.warning("Senha não informada!")
      return;
    }

    fetchOrdemLinkPublico(hash, password)
      .then( data => {
        setDadosOrdem({...data})
      })
      .catch(error => {
        message.error(error, 8)
        setDadosOrdem(null)
      })
      .then(() => setLoading(false))
  }

  return (
    <>
    { dadosOrdem === null &&
    <Spin indicator={antIcon} spinning={loading}>
      <StyledCard title="Digite a senha de consulta da Ordem:">
        <Input 
          placeholder="senha pública" 
          maxLength={8} 
          style={{ width: 200, marginRight: 15 }} 
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button 
          type="primary" 
          disabled={loading || !password.length} 
          loading={loading}
          onClick={onConsultarOrdem}
        >
          Consulta Ordem
        </Button>
      </StyledCard>
    </Spin>  
    }

    { dadosOrdem !== null &&
      <div>
        <HeaderPanel>
          <h2 style={{color: '#fff'}}>O.S. - {dadosOrdem.dadosBasicos.titulo}</h2>
        </HeaderPanel>

        <Row style={{marginBottom: 20}}>
          <Col span={24}>
            <VisualizarOrdemComponent 
              dadosOrdem={dadosOrdem} 
              permiteImpressaoPdf={hasPrintPdfPermission}
              config={visConfig} 
            />
          </Col>
        </Row>
      </div>
    }
    </>
  )
}

export default VisualizarLinkPublicoForm
