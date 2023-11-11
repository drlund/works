import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Tabs, Modal, message } from 'antd';
import PageLoading from 'components/pageloading/PageLoading';
import Validacao from 'pages/designacao/Solicitacao/Validacao';
import {
  getTiposMovimentacao,
  getNegativas,
  setCadeia
} from 'services/ducks/Designacao.ducks';
import useUsuarioLogado from 'hooks/useUsuarioLogado';

const { TabPane } = Tabs;

function Solicitacao() {
  const dispatch = useDispatch();

  const funciLogado = useUsuarioLogado();

  const [tipos, setTipos] = useState([]);
  const [tipo, setTipo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [validKey, setValidKey] = useState(moment().valueOf());
  const [, setNegativas] = useState('');
  const [protocolo, setProtocolo] = useState('');
  const [, setRecharge] = useState(false);

  const onInfo = useCallback((num = 1) => {
    if (!modalVisible && !_.isEmpty(tipos)) {
      const numero = parseInt(num, 10);
      const [tipoOperacao] = tipos.filter((elem) => elem.id === numero);

      if (!_.isNull(tipoOperacao)) {
        dispatch(setTipo(tipoOperacao.id))
          .then(() => setModalVisible(true))
          .catch((error) => message.error(error))
          .then(() => setValidKey(moment().valueOf()));
      }
    }
  }, [dispatch, modalVisible, tipos, setModalVisible, setValidKey]);

  useEffect(() => {
    let isMounted = true;

    dispatch(getTiposMovimentacao())
      .then((thisTipos) => isMounted && setTipos(thisTipos))
      .then(() => isMounted && onInfo(1))
      .then(() => isMounted && dispatch(getNegativas()))
      .then((thisNegativas) => isMounted && setNegativas(thisNegativas))
      .then(() => (isMounted && protocolo) && dispatch(setCadeia(protocolo)))
      .catch((error) => message.error(error))
      .then(() => isMounted && setRecharge(false));

    return () => { isMounted = false; };
  }, [dispatch, onInfo, setNegativas, setRecharge, protocolo]);

  const onTabChange = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (modalVisible) {
      Modal.info({
        title: `${tipo.nome}`,
        content: (
          <div>
            <div style={{ fontSize: '1.3rem' }}>
              {tipo.titulo}
            </div>
            <div style={{ fontSize: '1.2rem', textAlign: 'justify' }}>
              &quot;
              {tipo.texto}
              &quot;
            </div>
          </div>
        )
      });
    }
  }, [modalVisible, dispatch, onInfo, tipo]);

  const confirmar = (protocol = null) => {
    setValidKey(moment().valueOf());
    setProtocolo(protocol);
  };

  useEffect(() => {
    if (!protocolo) {
      setRecharge(true);
    }
  }, [validKey, protocolo]);

  return (
    (funciLogado && !_.isEmpty(tipos))
      ? (
        <Tabs type="card" tabBarGutter={20} style={{ inkBar: true }} onTabClick={onTabChange}>
          {
            tipos.map((elem) => (
              <TabPane
                tab={elem.nome}
                key={elem.id}
              >
                <Validacao
                  key={validKey}
                  tipo={elem}
                  confirmar={confirmar}
                  funciLogado={funciLogado}
                  protocolo={protocolo}
                />
              </TabPane>
            ))
          }
        </Tabs>
      )
      : <PageLoading />
  );
}

export default React.memo(Solicitacao);
