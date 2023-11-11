import React from 'react';
import "@/App.css";
import './styles.css';
import { Row, Col } from 'antd';
import LogoSatelite from './satelite.svg';

export default function PageNotFound() {
  return (
    <Row className="container" type="flex" style={{flexGrow: 'inherit'}} justify="space-around" align="middle">
      <Col type="flex" justify="center" span={12}>
        <img src={LogoSatelite} alt="logo-satelite" />
      </Col>
      <Col span={12}>
        <h1 className="error-code">404</h1>
        <span className="detail-message">
          A página que você visitou não existe.
        </span>

      </Col>
    </Row>
  )
}
