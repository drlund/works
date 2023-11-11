import { Button, Divider, Image, Space, Typography } from 'antd';
import React from 'react';
import { CopyOutlined, ShareAltOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { imgFallback } from '../fallbackImage';
import useCopyToClipboard from '../hooks/useCopyToClipboard';

/**
 * @param {{
*  canalSelecionado: Podcasts.Canal;
* }} props
*/

export default function DetalhamentoCanal({ canalSelecionado }) {
  const [value, copy] = useCopyToClipboard()

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
      <div className="detalhesCanal" style={{ width: '100%', textAlign: 'left'}}>
        <Divider orientation="left">{canalSelecionado.nome}</Divider>
        <Space direction="vertical" size="large">
          <Typography.Text>{canalSelecionado.descricao}</Typography.Text>
          <Typography.Text>
            <Button
              onClick={() => copy(`${process.env.PUBLIC_URL}/podcasts/canal/${canalSelecionado.id}`)}
              //@ts-ignore
              type="secondary"
            >
              <ShareAltOutlined />
              Compartilhar
            </Button>
          </Typography.Text>
        </Space>
        {/* <Button type="primary">+ Seguir</Button> */}
      </div>
    </div>
  );
}
