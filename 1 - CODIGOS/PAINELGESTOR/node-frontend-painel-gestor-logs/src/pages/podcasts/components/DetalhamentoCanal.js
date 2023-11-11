import { ShareAltOutlined } from '@ant-design/icons';
import { Button, Divider, Image, Space, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import SeguirCanal from '../Gerenciar/SeguirCanal';
import { imgFallback } from '../fallbackImage';
import useCopyToClipboard from '../hooks/useCopyToClipboard';

/** @typedef {Podcasts.Seguidor} Seguidor */

/**
 * @param {{
*  canalSelecionado: Podcasts.Canal;
* }} props
*/
export default function DetalhamentoCanal({ canalSelecionado }) {
  const [, copy] = useCopyToClipboard();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    history.replace({ ...location, state: null });
  }, []);

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        width: '100%',
        padding: 8,
      }}
    >
      <div className="imagemCanal">
        <Image
          width={200}
          height={200}
          // @ts-ignore
          src={`${process.env.REACT_APP_ENDPOINT_API_URL}/uploads/multimidia/podcast/${canalSelecionado.imagem}`}
          style={{ backgroundColor: '#f1f1f1' }}
          fallback={imgFallback}
        />
      </div>
      <div className="detalhesCanal" style={{ width: '100%', textAlign: 'left' }}>
        <Divider orientation="left">{canalSelecionado.nome}</Divider>
        <Space direction="vertical" size="large">
          <Typography.Text>{canalSelecionado.descricao}</Typography.Text>
          <Typography.Text>
            <Space direction="horizontal" size="small">
              <Button
                onClick={() => copy(`${process.env.PUBLIC_URL}/podcasts/canal/${canalSelecionado.id}`)}
                // @ts-ignore
                type="secondary"
              >
                <ShareAltOutlined />
                Compartilhar
              </Button>
              <Button>
                <SeguirCanal canal={canalSelecionado} />
              </Button>
            </Space>
          </Typography.Text>
        </Space>
      </div>
    </div>
  );
}
