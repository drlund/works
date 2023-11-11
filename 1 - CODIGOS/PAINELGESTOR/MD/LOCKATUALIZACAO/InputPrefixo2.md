
Para incluir a alteração no componente `InputPrefixo`, você pode adicionar a prop `onSearchClick` no componente e chamar essa propriedade quando o botão que contém o ícone "SearchOutlined" for clicado. Aqui está como você pode fazer isso:

```javascript
import React from 'react';
import { Select, message, Spin } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchMatchedPrefixos } from 'services/ducks/Arh.ducks';
import { SearchOutlined } from '@ant-design/icons'; // Importe o ícone SearchOutlined

const { Option } = Select;

class InputPrefixo extends React.Component {
  // Resto do seu código...

  // Função para lidar com o clique no botão de pesquisa
  handleSearchClick = () => {
    const { onSearchClick } = this.props;
    if (onSearchClick) {
      onSearchClick();
    }
  };

  render() {
    // Resto do seu código...

    return (
      <Select
        // Resto das props
      >
        {/* Renderize o ícone SearchOutlined como um botão */}
        <div>
          {/* Seu campo de entrada de texto aqui */}
          <button onClick={this.handleSearchClick}>
            <SearchOutlined />
          </button>
        </div>
      </Select>
    );
  }
}

InputPrefixo.defaultProps = {
  fullValue: false,
};

export default connect(null, {
  fetchMatchedPrefixos,
})(InputPrefixo);
```

Neste exemplo, adicionamos a função `handleSearchClick` para lidar com o clique no botão de pesquisa. Ela chama a propriedade `onSearchClick` quando o botão é clicado. Certifique-se de passar a função `onSearchClick` ao usar o componente `InputPrefixo` e defina o que deseja fazer no componente pai quando o botão de pesquisa for clicado. Isso permitirá que você atualize a cor da lâmpada quando o botão de pesquisa for clicado no componente pai.
