import React from "react";
import { Spin } from "antd";
import BBLogo from 'components/bootstraploader/BootstrapLogo';
import "./bbspinning.css";
import styled from 'styled-components';

/**
 * @param {{
 *  children: import('react').ReactNode,
 *  spinning: Boolean,
 *  className?: String,
 * } & Parameters<Spin>['0']} props
*/
function BBSpining({ children, spinning, className, ...rest }) {
  return (
    <Spin
      {...rest}
      wrapperClassName={`bbSpinning ${className}`}
      spinning={spinning}
      indicator={<BBLogo size="50px" style={{ opacity: '0.7' }} />}
    >
      {children}
    </Spin>
  );
}

export default BBSpining;

export const BBSpinning = styled(BBSpining)`
  height: 100%;

  & .ant-spin-container {
    height: 100%;
  }
`;
