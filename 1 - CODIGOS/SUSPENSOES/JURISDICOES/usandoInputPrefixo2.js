/**
 * O componente "InputPrefixo" deve receber e utilizar corretamente o valor de `tipoSelecionado` do componente pai, 
 * ajustando o formato do campo "tipo" de acordo com a seleção do "Radio.Group". Lembre-se de que você deve passar 
 * corretamente a propriedade `tipoSelecionado` do componente "FormParamSuspensao" para o componente "InputPrefixo".
 * 
 * Para resolver esse problema, precisamos fazer algumas modificações no componente "InputPrefixo" para que ele possa
 *  receber o valor de `tipoSelecionado` do componente pai e atualizar corretamente o formato do campo "tipo".
 * 
 * Vamos fazer as seguintes alterações no componente "InputPrefixo":
 * 
 * 1. Adicione a propriedade `tipoSelecionado` ao estado do componente e atualize o estado quando essa propriedade 
 * for recebida via props.
*/

class InputPrefixo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      data: [],
      loading: false,
      tipoSelecionado: props.tipoSelecionado || '', // Adicione essa linha
    };

    this.handleSearch = _.debounce(this.handleSearch, 750);
  }

  componentDidUpdate(prevProps) {
    const { value, tipoSelecionado } = this.props;

    if (value !== prevProps.value) {
      this.setState({ value }, () => this.handleSearch(value));
    }

    if (tipoSelecionado !== prevProps.tipoSelecionado) {
      this.setState({ tipoSelecionado }, () => this.handleChange(this.state.value));
    }
  }

  // ...
}

// 2. Atualize o método `handleChange` para ajustar o valor do campo "tipo" com base no valor de `tipoSelecionado`.

class InputPrefixo extends React.Component {
  // ...

  handleChange = (value) => {
    const { data, tipoSelecionado } = this.state;
    const { fullValue, onChange, nomePrefixo, prefixoDestino, comite, nomeComite } = this.props;
    const selectedData = value ? data.filter((elem) => elem.prefixo === value) : [];
    const thisValue = value || '';

    this.setState({ value: thisValue }, () => {
      if (tipoSelecionado === 'matricula') {
        // Se o tipoSelecionado for "matricula", ajuste o valor para o formato "F0000000"
        const formattedValue = thisValue ? `F${thisValue.toUpperCase()}` : '';
        onChange(fullValue ? selectedData : formattedValue, {
          nomePrefixo,
          prefixoDestino,
          comite,
          nomeComite,
        });
      } else {
        onChange(fullValue ? selectedData : thisValue, {
          nomePrefixo,
          prefixoDestino,
          comite,
          nomeComite,
        });
      }
    });
  };

  // ...
}

// 3. Ajuste o método `render` para usar o valor de `tipoSelecionado` no campo "tipo".

class InputPrefixo extends React.Component {
  // ...

  render() {
    const { value, loading, data, tipoSelecionado } = this.state;
    const {
      key,
      labelInValue,
      disabled,
      mode,
      placeholder,
      style,
      className,
    } = this.props;

    return (
      <Select
        // ...
      >
        {/* ... */}
        <Form.Item
          name="tipo"
          label="Tipo"
          rules={[
            {
              required: true,
              message: 'Por favor, selecione o prefixo!',
            },
          ]}
        >
          <Input placeholder="Tipo" value={tipoSelecionado === 'matricula' ? value.slice(1) : value} />
        </Form.Item>
        {/* ... */}
      </Select>
    );
  }
}

// ...
