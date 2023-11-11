/**
 * Para utilizar o componente "InputPrefixo" com as alterações sugeridas, você precisará fazer algumas modificações 
 * no componente "InputPrefixo". Vamos adicionar a propriedade `tipoSelecionado` ao componente e ajustar o formato 
 * do campo "tipo" com base nessa propriedade. Veja como fazer:
 * 
 * 1. Adicione a propriedade `tipoSelecionado` ao componente "InputPrefixo":
 */

import React from 'react';
import { Select, message, Spin } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchMatchedPrefixos } from 'services/ducks/Arh.ducks';

const { Option } = Select;

class InputPrefixo extends React.Component {
  // ...
}

InputPrefixo.defaultProps = {
  fullValue: false,
};

export default connect(null, {
  fetchMatchedPrefixos,
})(InputPrefixo);

// 2. Adicione a verificação do formato do campo "tipo" no método `render` do componente "InputPrefixo":

class InputPrefixo extends React.Component {
  // ...

  render() {
    const { value, loading, data } = this.state;
    const {
      key,
      labelInValue,
      disabled,
      mode,
      placeholder,
      style,
      className,
      tipoSelecionado, // Adicione a propriedade tipoSelecionado aqui
    } = this.props;

    // Verifica se o tipo selecionado é "matricula" para definir o formato adequado
    let inputFormat = '0000'; // Formato padrão para outros tipos de prefixo

    if (tipoSelecionado === 'matricula') {
      inputFormat = 'F0000000'; // Formato para matrícula: "F0000000"
    }

    // ...
  }
}

// 3. Ajuste o campo "tipo" no método `render` do componente "InputPrefixo":

class InputPrefixo extends React.Component {
  // ...

  render() {
    const { value, loading, data } = this.state;
    const {
      key,
      labelInValue,
      disabled,
      mode,
      placeholder,
      style,
      className,
      tipoSelecionado,
    } = this.props;

    let inputFormat = '0000';

    if (tipoSelecionado === 'matricula') {
      inputFormat = 'F0000000';
    }

    return (
      <Select
        key={key}
        labelInValue={labelInValue}
        showSearch
        disabled={disabled}
        mode={mode || ''}
        value={value}
        placeholder={placeholder}
        style={style}
        className={className || ''}
        defaultActiveFirstOption
        allowClear
        showArrow={loading}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={loading ? <Spin size="small" /> : null}
        loading={loading}
      >
        {this.renderOptions(data)}
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

/**
 * Agora você pode usar o componente "InputPrefixo" no seu formulário "FormParamSuspensao" e passar a propriedade 
 * `tipoSelecionado` para ajustar o formato do campo "tipo" com base na seleção do "Radio.Group":
 */

// ...

function FormParamSuspensao({ location }) {
  const [tipoSelecionado, setTipoSelecionado] = useState('');

  const handleTipoChange = (e) => {
    const valorSelecionado = e.target.value;
    setTipoSelecionado(valorSelecionado);
    // ...
  };

  // ...

  return (
    <>
      <Card>
        {/* ... */}
      </Card>
      <Card>
        <Form
          form={form}
          {...layout}
          name="control-ref"
          onFinish={incluirSuspensao}
        >
          <Form.Item label="Tipo">
            <Radio.Group onChange={handleTipoChange} value={tipoSelecionado}>
              <Radio value="vicePresi"> Vice Presidência </Radio>
              <Radio value="diretoria"> Unid. Estratégica </Radio>
              <Radio value="super"> Unid. Tática </Radio>
              <Radio value="gerev"> Comercial </Radio>
              <Radio value="prefixo"> Prefixo </Radio>
              <Radio value="matricula"> Matrícula </Radio>
            </Radio.Group>
          </Form.Item>
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
            {/* Use o InputPrefixo e passe a propriedade tipoSelecionado */}
            <InputPrefixo tipoSelecionado={tipoSelecionado} />
          </Form.Item>
          {/* ... */}
        </Form>
      </Card>
    </>
  );
}

export default FormParamSuspensao;
