import React from 'react';
import { Form, Button, Divider } from 'antd';

import FormTipoPergunta from './FormTipoPergunta';

class FormPerguntas extends React.Component {
  // state = { resposta: {} };

  renderButtons() {
    const { buttons } = this.props;

    if (!buttons) {
      return <div />;
    }

    return (
      <>
        <Divider />
        <Form.Item>
          {buttons.map((button) => {
            let styleButton = { style: button.style };

            switch (button.type) {
              case 'buttonOk':
                styleButton = {
                  ...styleButton,
                  type: 'primary',
                  htmlType: 'submit',
                };
                break;
              default:
                styleButton = { ...styleButton, htmlType: 'button' };
            }

            styleButton.style = { ...styleButton.style, marginLeft: 15 };

            return (
              <Button
                key={button.type}
                {...styleButton}
                icon={button.icon}
                onClick={button.onClick}
                disabled={button.disabled}
              >
                {button.label}
              </Button>
            );
          })}
        </Form.Item>
      </>
    );
  }

  renderPerguntas() {
    const { perguntas, idSolicitacao, tipoSolicitacao } = this.props;
    const newProps = { ...this.props };

    newProps.idsolicitacao = idSolicitacao;
    newProps.tiposolicitacao = tipoSolicitacao;
    delete newProps.idSolicitacao;
    delete newProps.tipoSolicitacao;

    return (
      <div>
        {perguntas.map((pergunta) => {
          const isRespostaObrigatoria = pergunta.obrigatorio
            ? [{ required: true, message: 'Preenchimento obrigatório!' }]
            : null;

          return (
            <Form.Item
              key={pergunta.id}
              name={`${pergunta.id}`}
              label={(
                <span
                  style={{
                    fontWeight: 'bold',
                    color: 'rgba(0, 0, 0, 0.65)',
                    marginBottom:
                      pergunta.descricaoPergunta.length > 400 ? 15 : 0,
                  }}
                >
                  {pergunta.descricaoPergunta}
                </span>
              )}
              rules={isRespostaObrigatoria}
            >
              <FormTipoPergunta
                {...newProps}
                pergunta={pergunta}
              />
            </Form.Item>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <>
        {this.renderPerguntas()}
        {this.renderButtons()}
      </>
    );
  }
}

export default FormPerguntas;
