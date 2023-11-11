import React from 'react';
import './Footer.css';
import { Layout } from 'antd';
const { Footer } = Layout;

export default function MainFooter() {
  let initialYear = 2019;
  let year = new Date().getFullYear();
  year = year === initialYear ? year : initialYear + '-' + year;

  return (
    <Footer className="footer-main">
      {`SuperADM - Copyright © ${year} - Banco do Brasil S.A`}
    </Footer>
  )
}
