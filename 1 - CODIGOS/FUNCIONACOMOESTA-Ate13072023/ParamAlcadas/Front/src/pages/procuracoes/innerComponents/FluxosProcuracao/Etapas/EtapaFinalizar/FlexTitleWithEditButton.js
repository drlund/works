import { Button } from 'antd';
import React from 'react';

/**
 * @param {{
 *  heading: string,
 *  editButtonFn: () => void,
 * }} props
 */
export function FlexTitleWithEditButton({
  heading, editButtonFn
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    }}>
      <h3>{heading}</h3>
      <Button onClick={editButtonFn}>Editar</Button>
    </div>
  );
}
