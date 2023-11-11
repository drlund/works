import React from 'react';
import { Typography, Button } from 'antd';
import { useParams } from 'react-router-dom';
import styles from './Ambiencia.module.css';
import history from "@/history.js";

const { Title } = Typography;

const FinalizarAvaliacao = () => {
  const { idCampanha } = useParams();
  return (
    <div>
      <div className={styles.finalizarAvaliacaoImgWrapper}>
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/finalizacaoAmbiencia.png`}
        />
      </div>
      <div className={styles.finalizarAvaliacaoTxtWrapper}>
        <Title level={4}>
          Vamos continuar contribuindo para a Ambiência do BB?
        </Title>
      </div>
      <div className={styles.finalizarAvaliacaoBtnWrapper}>
        <Button
          type="primary"
          onClick={() => {
            history.push(`/ambiencia/registrar-avaliacao/${idCampanha}`);
          }}
        >
          Avaliar novo prefixo
        </Button>
      </div>
    </div>
  );
};

export default FinalizarAvaliacao;
