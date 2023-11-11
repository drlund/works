
import React, { useState } from 'react';
import {
  Button, Col, Divider, Modal, Row, Space, Tag, Tooltip
} from 'antd';
import Typography from 'antd/lib/typography/Typography';
import { ExportOutlined } from '@ant-design/icons';
import { regexExtVideo } from '../helpers/regex';

export default function VisualizarEpisodio({ record }) {
  const [episodio, setEpisodio] = useState(null);
  const [open, setOpen] = useState(false);

  const onEditCanal = () => {
    setEpisodio({ ...record });
    setOpen(true);
  };
  const medidaGrid = 16;

  return (
    <>
      <Button type="link" size="small" onClick={() => onEditCanal()}>
        <Tooltip title="Visualizar Canal">
          {record.titulo}
        </Tooltip>
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        width={690}
        closable
        centered
      >
        <Row gutter={[medidaGrid, medidaGrid]}>
          <Col style={{ marginTop: '24px'}}>
            <video width="640" height="360" controls>
              <source
                src={`${process.env.REACT_APP_ENDPOINT_API_URL}/uploads/multimidia/podcast/${record.urlEpisodio}`}
                type={`video/${regexExtVideo(record.urlEpisodio)}`} />
              Your browser does not support the video tag.
            </video>
          </Col>

          <Col>
            <Typography style={{ fontSize: '28px', fontWeight: 'bold' }}>{record.titulo}</Typography>
            <Typography>por {record.canal.nome}</Typography>
          </Col>

          <Space direction="horizontal" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Col>
              {record.tags.map(tag => (
                <Tag color={tag.cor} key={tag.id} style={{ margin: '2px' }}>{tag.nome}</Tag>
              ))}
            </Col>
            <Col>
              <Button
                type="dashed"
                size="small"
                href={`${process.env.REACT_APP_ENDPOINT_API_URL}/uploads/multimidia/podcast/${record.urlEpisodio}`}
                target="_blank"
                rel="noreferrer">
                <ExportOutlined />
                Abrir em nova janela
              </Button>
            </Col>
          </Space>
        </Row>
      </Modal>
    </>
  );
}
