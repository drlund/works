import React, { useEffect, useState } from 'react';
import { Button, Space, Upload, message } from 'antd';
import {
  CardResponsivo,
  MainContainer,
  CardsRow,
} from 'pages/flexCriterios/styles';
import { getAcoes } from 'pages/flexCriterios/apiCalls/flexTipoDadosAPICall';
import { usePermissoesUsuario } from 'pages/flexCriterios/hooks/permissaoAcesso';
import { getPedido } from '../../apiCalls/flexPedidosAPICall';
import Cadeia from '../commons/cadeia';
import Etapas from '../commons/etapas';
import Funcionario from '../commons/funcionario';
import Resumo from '../commons/resumo';
import constantes from '../../helpers/constantes';
import Manifestacao from '../commons/formManifestacao';
import Analise from '../commons/formAnalise';
import Deferir from '../commons/formDeferir';
import Despacho from '../commons/formDespacho';
import Finalizar from '../commons/formFinalizar';
import { UploadOutlined } from '@ant-design/icons';
import { inserirNovosAnexos } from 'pages/flexCriterios/apiCalls/anexosAPICall';
import { getSessionState } from 'components/authentication/Authentication';

export default function Manifestacoes({
  match: {
    params: { idFlex },
  },
}) {
  const [pedidoFlex, setPedidoFlex] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [tipoManifestacao, setTipoManifestacao] = useState([]);
  const perfil = usePermissoesUsuario();
  let componente = null;
  useEffect(() => {
    getAcoes()
      .then((acoes) => {
        setTipoManifestacao(acoes);
      })
      .catch(() => {
        message.error(
          'Não foi possível obter a lista de Tipos de Manifestações.',
        );
      });
  }, []);

  const refreshPedido = () => {
    getPedido(idFlex)
      .then((resposta) => {
        setPedidoFlex(resposta);
      })
      .catch(() => message.error('Não foi possível localizar este pedido.'));
  };

  useEffect(() => {
    refreshPedido();
  }, []);

  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-2);

    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);
  };
  const incluirNovosAnexos = () => {
    inserirNovosAnexos(fileList, pedidoFlex?.id)
      .then(() => {
        refreshPedido();
        setFileList([]);
        message.success('Anexos incluidos com sucesso, atualizando o pedido.');
      })
      .catch((resposta) => message.error(resposta));
  };
  const sessionState = getSessionState();

  const props = {
    headers: {
      'X-CSRFToken': sessionState.token,
      'X-CSRF-Token': sessionState.token,
      token: sessionState.token,
    },
    action: `${process.env.REACT_APP_ENDPOINT_API_URL}/flexcriterios/uploads?token=${sessionState.token}`,
    onChange: handleChange,
    multiple: true,
  };

  switch (pedidoFlex?.etapa?.id) {
    case constantes.manifestar:
      (perfil.includes(constantes.perfilManifestante) ||
        perfil.includes(constantes.perfilRoot)) &&
        (componente = (
          <Manifestacao
            tipoManifestacao={tipoManifestacao}
            pedidoFlex={pedidoFlex}
            perfil={perfil}
          />
        ));
      break;
    case constantes.analisar:
      (perfil.includes(constantes.perfilAnalista) ||
        perfil.includes(constantes.perfilRoot)) &&
        (componente = (
          <Analise
            tipoManifestacao={tipoManifestacao}
            pedidoFlex={pedidoFlex}
            perfil={perfil}
          />
        ));
      break;
    case constantes.despachar:
      (perfil.includes(constantes.perfilDespachante) ||
        perfil.includes(constantes.perfilExecutante) ||
        perfil.includes(constantes.perfilRoot)) &&
        (componente = (
          <Despacho
            tipoManifestacao={tipoManifestacao}
            pedidoFlex={pedidoFlex}
            perfil={perfil}
          />
        ));
      break;
    case constantes.deferir:
      (perfil.includes(constantes.perfilDeferidor) ||
        perfil.includes(constantes.perfilAnalista) ||
        perfil.includes(constantes.perfilRoot)) &&
        (componente = (
          <Deferir
            tipoManifestacao={tipoManifestacao}
            pedidoFlex={pedidoFlex}
            perfil={perfil}
          />
        ));
      break;
    case constantes.finalizar:
      (perfil.includes(constantes.perfilExecutante) ||
        perfil.includes(constantes.perfilRoot)) &&
        (componente = (
          <Finalizar
            tipoManifestacao={tipoManifestacao}
            pedidoFlex={pedidoFlex}
            perfil={perfil}
          />
        ));
      break;
    default:
      break;
  }

  // Verificando quais as diretorias gestores autorizados.
  /** @type {{ gestorUnidadeAlvo: string[] }} */
  const foundGestorUnidadeAlvo = perfil.find(
    (/** @type {{ gestorUnidadeAlvo: string[] }} */ p) => p?.gestorUnidadeAlvo,
  );
  const gestorUnidadeAlvo = foundGestorUnidadeAlvo?.gestorUnidadeAlvo || [];
  const isGestorDestino = gestorUnidadeAlvo.includes(
    pedidoFlex?.funcionarioEnvolvido?.prefixoDestino?.prefixoDiretoria,
  );

  /*   console.log('Is Gestor Destino', isGestorDestino); */

  return (
    pedidoFlex && (
      <MainContainer>
        <Etapas etapaAtual={pedidoFlex?.etapa?.sequencial} />
        <Funcionario
          acao={pedidoFlex?.etapa?.id}
          pedidoFlex={pedidoFlex}
          perfil={perfil}
        />
        <CardsRow>
          <CardResponsivo
            title="Resumo do Pedido"
            actions={[
              <Space direction="vertical">
                <Button
                  key={pedidoFlex?.id}
                  type="primary"
                  onClick={() =>
                    window
                      .open(
                        `/v8/flex-criterios/detalhar/${pedidoFlex?.id}`,
                        '_blank',
                      )
                      .focus()
                  }
                >
                  Visualizar Detalhes
                </Button>

                {pedidoFlex?.etapa?.id ==
                  constantes.analisar /* || pedidoFlex?.etapa?.id == constantes.despachar */ &&
                isGestorDestino ? (
                  <Space align="center">
                    <Upload {...props} fileList={fileList}>
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Space>
                ) : null}
                {fileList.length ? (
                  <Button onClick={() => incluirNovosAnexos()}>
                    Salvar novos anexos
                  </Button>
                ) : null}
              </Space>,
            ]}
          >
            <div style={{ minHeight: '100%' }}>
              <Resumo pedidoFlex={pedidoFlex} />
            </div>
          </CardResponsivo>
          <Cadeia
            acao={pedidoFlex?.etapa?.id}
            perfil={perfil}
            pedidoFlex={pedidoFlex}
          />
        </CardsRow>
        {componente}
      </MainContainer>
    )
  );
}
