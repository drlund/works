import React from 'react';
import { WarningTwoTone } from '@ant-design/icons';

const IconWarning = props => {
  let fSize = props.fontSize ? props.fontSize : '18px';

  return <WarningTwoTone style={{ fontSize: fSize }} twoToneColor="#FFA832" />;
}

export {
  IconWarning
}