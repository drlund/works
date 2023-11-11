import React from 'react';
import { Typography } from 'antd';
import { useParams } from 'react-router-dom';
import styles from './Ambiencia.module.css';
const { Title } = Typography;

const FinalizarAvaliacao = (props) => {
  const { idCampanha } = useParams();
  return (
    <div>
      <div className={styles.finalizarAvaliacaoImgWrapper}>
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/campanhaFinalizada.png`}
        />
      </div>
      <div className={styles.finalizarAvaliacaoTxtWrapper}>
        <Title level={4}>Esta campanha foi finalizada.</Title>
      </div>
    </div>
  );
};

export default FinalizarAvaliacao;
