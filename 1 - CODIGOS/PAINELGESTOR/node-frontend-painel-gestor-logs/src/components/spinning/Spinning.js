/**
 * Componente baseado no <Spin> do ant design com o icone de loading por padrao.
 */
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const loadIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export default (props) => <Spin {...props} indicator={loadIcon}>{props.children}</Spin>;