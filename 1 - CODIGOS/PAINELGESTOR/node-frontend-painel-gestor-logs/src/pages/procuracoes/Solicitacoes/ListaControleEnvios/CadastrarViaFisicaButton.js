import { FileTextOutlined } from '@ant-design/icons';
import { Popconfirm, message } from 'antd';
import { useState } from 'react';

import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';
import { ThemedButton } from './ThemedButton';

/**
 * @param {{
 *  id: number,
 *  label: string,
 *  postCb: () => void,
 * }} props
 */
export function CadastrarViaFisicaButton({ id, label, postCb }) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = () => {
    setLoading(true);
    fetch(FETCH_METHODS.PATCH, `/procuracoes/solicitacoes/via-fisica/${id}`)
      .then(() => {
        message.success('Via Física cadastrada com sucesso.');
        postCb();
      })
      .catch((/** @type {string} */ err) => message.error(`Erro encontrado: ${err}.`))
      .finally(() => setLoading(false));
  };

  return (
    <Popconfirm
      title="Confirma envio de Via Física?"
      okText="Sim"
      cancelText="Não"
      onConfirm={handleConfirm}
      okButtonProps={{ loading }}
    >
      <ThemedButton
        size='large'
        icon={<FileTextOutlined />}
        maincolor='#c8c8c8'
        textcolor='black'
        loading={loading}
      >
        Via Física de {label}
      </ThemedButton>
    </Popconfirm>
  );
}
