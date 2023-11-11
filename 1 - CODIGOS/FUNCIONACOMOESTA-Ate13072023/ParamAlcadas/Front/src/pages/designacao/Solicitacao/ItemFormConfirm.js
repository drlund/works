import React from 'react';
import ItemOpcional from './ItemOpcional';
import ItemLimitrofes from './ItemLimitrofes';
import ItemNormal from './ItemNormal';

function ItemFormConfirm({
  tipo, elem, normFile, beforeUpload, removeFile, analise
}) {
  const render = () => {
    switch (tipo) {
      case 'opcional':
        return (
          <ItemOpcional
            key={tipo}
            elem={elem}
            normFile={normFile}
            beforeUpload={beforeUpload}
            removeFile={removeFile}
          />
        );
      case 'limitrofes':
        return (
          <ItemLimitrofes
            key={tipo}
            nivelGer={analise.nivelGer}
            rotaRodoviaria={analise.rotaRodoviaria}
            elem={elem}
            normFile={normFile}
            beforeUpload={beforeUpload}
            removeFile={removeFile}
          />
        );
      default:
        return (
          <ItemNormal
            key={tipo}
            elem={elem}
            normFile={normFile}
            beforeUpload={beforeUpload}
            removeFile={removeFile}
          />
        );
    }
  };

  return (
    <React.Fragment key={tipo}>
      {
        render()
      }
    </React.Fragment>
  );
}

export default React.memo(ItemFormConfirm);
