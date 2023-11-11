import React from "react";
import { Typography } from 'antd';

const { Text } = Typography;

/**
 * Componente que exibe um texto em negrito, seguido de ":" e o children.
 * @param {{
 *  label: string,
 *  children: React.ReactNode,
 *  style?: React.CSSProperties
 * }} props
 */
export const BoldLabelDisplay = ({ label, children, style }) => (
  <Text style={{ display: "block", fontWeight: "bold", ...style }}>
    {label}:
    {' '}
    <Text style={{ display: "inline-block", fontWeight: "normal" }}>
      {children}
    </Text>
  </Text>
);
