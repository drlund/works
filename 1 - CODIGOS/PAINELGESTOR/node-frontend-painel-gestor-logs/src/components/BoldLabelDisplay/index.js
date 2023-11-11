import React from 'react';

export function BoldLabelDisplay({ label, value }) {
  return (
    <>
      <strong>{`${label}: `}</strong>
      <span>{value}</span>
    </>
  );
}
