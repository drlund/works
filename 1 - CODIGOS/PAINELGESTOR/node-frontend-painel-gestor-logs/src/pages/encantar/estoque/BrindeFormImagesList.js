import React from 'react'
import { Card, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './BrindeFormImagesList.module.scss';

function BrindeFormImagesList(props) {

  function onRemoveImage(id, isNew) {
    if (props.onRemoveImage) {
      props.onRemoveImage(id, isNew)
    }
  }

  function isRemoved(id) {
    return props.excludesList.includes(id);
  }

  function renderImages() {
    return props.listData.map(elem => {
      if (isRemoved(elem.id)) {
        return null;
      }

      return (
        <Card            
          key={elem.id}
          style={{ width: 200 }}
          cover={<img alt="imagem brinde" src={elem.urlData} />}
          size="small"
          actions={[
            <Popconfirm title="Deseja remover esta imagem?" onConfirm={() => onRemoveImage(elem.id, elem.isNew)}>
              <DeleteOutlined key="delete" title="Remover Imagem" />
            </Popconfirm>
          ]}
        >
        </Card>
      )
    });
  }

  return (
    <div className={styles.greyBackground} style={{padding: 10, minHeight: 600}}>
      <div style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridGap: 20,
            paddingTop: 10
          }}>
            {renderImages()}
      </div>
    </div>
  )
}

export default BrindeFormImagesList
