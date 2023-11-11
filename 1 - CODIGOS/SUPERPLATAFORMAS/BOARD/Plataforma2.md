Vejo que você mencionou que os dados chegam na variável `data`, mas não estão sendo carregados no `return`. Se você possui os dados na variável `data` e deseja exibi-los, você deve atualizar o estado do componente com esses dados e renderizá-los. Veja como você pode modificar o código:
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
    // Fetch the data from the API when the component mounts
    getPlataformas()
      .then(data => {
        setCopyColumn(data); // Set the data from the API response
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const onDragEnd = (result) => {
    // Your existing onDragEnd logic here
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

Este código busca os dados da API usando `useEffect` e atualiza o estado com os dados buscados, que serão usados ​​na instrução `return` para renderizar os dados no componente.