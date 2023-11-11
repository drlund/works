import React, { useState, useEffect } from 'react';
import { Row, Col, message } from 'antd';
// import getCampanhas from './apiCalls/getCampanhas';
import InstrucoesHome from './internalComponents/InstrucoesHome';
import Campanhas from './internalComponents/Campanhas';
import { toggleSideBar } from 'services/actions/commons';
import { useDispatch } from 'react-redux';

const Home = () => {
  const dispatch = useDispatch();
 
  const campanhasVigentes = [
    {
      titulo: '1º Sem/2022',
      capaUrl: '/v8/assets/images/capa_topBB.png',
      idCampanha: 1,
    },
  ];

  const campanhasAnteriores = [];

  useEffect(() => {
    dispatch(toggleSideBar(true));
  }, []);

  return (
    <Row gutter={[0, 32]}>
      <Col span={24}>
        <InstrucoesHome />
      </Col>
      <Col span={24}>
        <Campanhas campanhas={campanhasVigentes} title="Campanhas Vigentes" />
      </Col>
      {campanhasAnteriores &&
        Array.isArray(campanhasAnteriores) &&
        campanhasAnteriores.length > 0 && (
          <Col span={24}>
            <Campanhas
              campanhas={campanhasAnteriores}
              title="Campanhas Anteriores"
            />
          </Col>
        )}
    </Row>
  );
};

export default Home;
