Para passar os dados que vêm da função `getPlataformas` em vez de usar o array fixo `columns`, você pode atualizar seu componente assim:

```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import { getPlataformas } from '../../apiCalls/plataformasCall';

const Board = ({ isCombineEnabled = true, containerHeight }) => {
  const [copyColum, setCopyColumn] = useState([]);
  const [changed, somethingChanged] = useState(true);

  useEffect(() => {
    // Busque os dados da API quando o componente for montado
    getPlataformas()
      .then(data => {
        setCopyColumn(data); // Defina os dados da resposta da API
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const onDragEnd = (result) => {
    // Sua lógica onDragEnd existente aqui
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId={'all'}
          type="COLUMN"
          direction="horizontal"
          ignoreContainerClipping={Boolean(containerHeight)}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {copyColum.map((valor, index) => (
                <Column key={valor.nome} column={valor} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button disabled={changed}>SALVAR ALTERAÇÔES?</Button>
    </div>
  );
};

Board.defaultProps = {
  isCombineEnabled: false,
};

Board.propTypes = {
  isCombineEnabled: PropTypes.bool,
};

export default Board;
```

Neste código, estamos buscando os dados da função `getPlataformas` usando o gancho `useEffect` quando o componente é montado. Depois que os dados são buscados, eles são armazenados no estado `copyColum` e o componente será renderizado com os dados buscados.