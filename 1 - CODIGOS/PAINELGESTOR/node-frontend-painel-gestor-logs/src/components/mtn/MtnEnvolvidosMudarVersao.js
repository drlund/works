import React from 'react';
import { Button } from 'antd';
import { StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

function LabelVersao({ versionado, versionadoEm }) {
  if (versionado === false) {
    return <span>Última versão</span>;
  }

  return <span>Versionado em {versionadoEm}</span>;
}

function MtnEnvolvidosMudarVersao({ envolvido, action, setLoading, fetchEnvolvido }) {
  const dispatch = useDispatch();

  const onPesquisarEnvolvido = async (idEnvolvido) => {
    setLoading(true, async () => {      

      const dadosEnvolvido = await fetchEnvolvido(idEnvolvido);

      dispatch({...action, payload: {
        ...action.payload,
        novosDados: dadosEnvolvido
      }});
      setLoading(false, () => {});
    })
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Button
        onClick={() => {
          onPesquisarEnvolvido(envolvido.versaoIdOriginal);
        }}
        icon={<StepBackwardOutlined />}
        disabled={envolvido.versaoIdOriginal === null}
        
      />
      <div>
        <LabelVersao
          versionado={envolvido?.versionado}
          versionadoEm={envolvido?.versionadoEm}
        />
      </div>
      <Button
        icon={<StepForwardOutlined />}
        onClick={() => {
          onPesquisarEnvolvido(envolvido.versaoIdNova);
        }}
        disabled={envolvido.versaoIdNova === null}
      />
    </div>
  );
}

export default MtnEnvolvidosMudarVersao;
