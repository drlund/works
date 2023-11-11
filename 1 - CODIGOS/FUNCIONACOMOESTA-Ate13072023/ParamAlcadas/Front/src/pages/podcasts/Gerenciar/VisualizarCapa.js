import { Button, Image, Modal } from "antd";
import { useState } from "react";
import { EyeOutlined } from '@ant-design/icons';
import { imgFallback } from '../fallbackImage';

export default function VisualizarCapa({ record }) {
  const [open, setOpen] = useState(false);
  const [visualizandoCapa, setvisualizandoCapa] = useState(null);

  const onVisualizandoCapa = () => {
    setOpen(true);
    setvisualizandoCapa({ ...record });
  };
  const onFinish = () => {
    setOpen(false);
    setvisualizandoCapa(null);
  }

  return (
    <>
      <Button type="link" size="small" onClick={() => onVisualizandoCapa(record)}>
      <EyeOutlined />
      </Button>

      <Modal
        title="Visualizar Capa"
        open={open}
        onOk={() => onFinish()}
        okText="Voltar"
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => onFinish()}
        cancelText="Voltar"
        width={250}
      >
        <Image
          width={200}
          height={200}
          src={`${process.env.REACT_APP_ENDPOINT_API_URL}/uploads/multimidia/podcast/${visualizandoCapa?.imagem}`}
          fallback={imgFallback}
          style={{ backgroundColor: '#f1f1f1' }}
        />
      </Modal>

    </>
  );
}