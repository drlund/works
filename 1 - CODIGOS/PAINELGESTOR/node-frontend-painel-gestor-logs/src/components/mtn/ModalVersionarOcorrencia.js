import React, { useEffect, useState } from 'react';
import { Button, Modal, Spin, Typography, Result, message } from 'antd';
import versionarOcorrencia from 'pages/mtn/VersionarOcorrencia/apiCalls/versionarOcorrencia';
import { useDispatch, useSelector } from 'react-redux';
import { getStatusMtn, types } from 'services/ducks/Mtn.ducks';
import { verifyPermission } from 'utils/Commons';

const { Text } = Typography;

function ModalVersionarOcorrencia({ idMtn, idEnvolvido, refreshEnvolvidos }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [possuiPermissao, setPossuiPermissao] = useState(null);

  const authState = useSelector(({ app }) => app.authState);

  const dispatch = useDispatch();

  const onVersionarOcorrencia = () => {
    setLoading(true);
    versionarOcorrencia(idEnvolvido)
      .then(() => {
        message.success('Versionado com sucesso');
        setShowModal(false);
        refreshEnvolvidos();
        getStatusMtn({idMtn}).then((res) => {
          dispatch({type: types.UPDATE_STATUS_MTN, payload: res})
        }).catch((e) => {
          console.log(e);
          message.error('Erro ao atualizar status do mtn.');  
        });
      })
      .catch(() => {
        message.error('Erro ao versionar a ocorrência');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if(possuiPermissao === null){
      const permissao = verifyPermission({
        ferramenta: "MTN",
        permissoesRequeridas: ["MTN_VERSIONAR_OCORRENCIA"],
        authState,
      });
      setPossuiPermissao(permissao);
    }
  },[possuiPermissao])


  if(!possuiPermissao){
    return null;
  }

  return (
    <>
      <Button
        type="primary"
        danger
        size="small"
        onClick={() => setShowModal(true)}
      >
        Versionar Ocorrência
      </Button>
      <Modal
        title="Deseja confirmar?"
        visible={showModal}
        maskClosable={!loading}
        closable={!loading}
        onOk={onVersionarOcorrencia}
        onCancel={() => {
          setShowModal(false);
        }}
        okButtonProps={{ loading, danger: true }}
        cancelButtonProps={{ loading }}
        okText="Confirmar versionamento"
        cancelText="Cancelar"
      >
        <Spin spinning={loading}>
          <Result status="warning" title="Esta é uma operação IRREVERSÍVEL." />
          <Text type="danger">
            Todos os registros incluídos tanto pelos analistas quanto pelo
            envolvido serão consideradas como histórico. Esta é uma operação
            IRREVERSÍVEL.
          </Text>
        </Spin>
      </Modal>
    </>
  );
}

export default ModalVersionarOcorrencia;
