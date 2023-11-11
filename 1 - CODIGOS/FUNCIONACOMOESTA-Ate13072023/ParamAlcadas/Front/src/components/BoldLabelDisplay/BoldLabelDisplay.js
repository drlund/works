import React from "react";
import { Typography } from 'antd';

const { Text } = Typography;

/**
 * Componente que exibe um texto em negrito, seguido de ":" e o children.
 */
export const BoldLabelDisplay = ({ label, children }) => (
  <Text style={{ display: "block", fontWeight: "bold" }}>
    {label}:
    {' '}
    <Text style={{ display: "inline-block", fontWeight: "normal" }}>
      {children}
    </Text>
  </Text>
);
