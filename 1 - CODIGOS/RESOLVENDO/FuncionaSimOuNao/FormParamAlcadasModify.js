// Importações omitidas para maior clareza

function FormParamAlcadas({ location }) {
    const { idParametro } = parseInt(location.state.id, 10 || 0);
    const id = parseInt(location.state.id, 10);
    const {
      prefixoDestino,
      nomePrefixo,
      comissaoDestino,
      nomeComissaoDestino,
      comite,
      nomeComite,
      observacao,
    } = location.state;
    const [, setDadosParametroForm] = useState();
    const [form] = Form.useForm();
    const dadosDoUsuario = useUsuarioLogado();
  
    useEffect(() => {
      if (![null, undefined, 'NaN'].includes()) {
        dadosDoUsuario(id);
      }
    }, [id]);
  
    const { matricula, nome_usuario: nomeUsuario } = dadosDoUsuario;
  
    function gravaEditaParametros() {
      const dadosForm = form.getFieldsValue();
  
      const dadosParametro = {
        ...dadosForm,
        prefixoDestino: dadosForm.prefixoDestino.value,
        nomePrefixo: dadosForm.prefixoDestino.label?.slice(2).toString(),
        comite: dadosForm.comite.value,
        nomeComite: dadosForm.comite.label?.slice(2).toString(),
        id,
      };
  
      if (id) {
        // Desabilitar os campos do formulário
        form.setFields([{ name: 'prefixoDestino', value: prefixoDestino, disabled: true }]);
        form.setFields([{ name: 'comissaoDestino', value: comissaoDestino, disabled: true }]);
        form.setFields([{ name: 'nomeComissaoDestino', value: nomeComissaoDestino, disabled: true }]);
        form.setFields([{ name: 'comite', value: comite, disabled: true }]);
        form.setFields([{ name: 'observacao', value: observacao, disabled: true }]);
  
        patchParametros(dadosParametro)
          .then((dadosParametroForm) => {
            setDadosParametroForm(dadosParametroForm);
            history.goBack();
          })
          .catch(() => message.error('Falha ao editar parâmetro!'));
      } else {
        gravarParametro({ ...dadosParametro, idParametro })
          .then((dadosParametroForm) => {
            setDadosParametroForm(dadosParametroForm);
            history.goBack();
          })
          .catch(() => message.error('Falha ao gravar parâmetro!'));
      }
    }
  
    return (
      <>
        <Card>
          <Row>
            <Col span={12}>{`Matrícula: ${matricula} `}</Col>
            <Col span={12}>{`Nome : ${nomeUsuario} `}</Col>
          </Row>
        </Card>
        <Card>
          <Form
            initialValues={{
              prefixoDestino,
              nomePrefixo,
              comissaoDestino,
              nomeComissaoDestino,
              comite,
              nomeComite,
              observacao,
            }}
            form={form}
            {...layout}
            name="control-ref"
            onFinish={gravaEditaParametros}
          >
            <Form.Item
              name="prefixoDestino"
              label="Prefixo Destino"
              rules={[
                {
                  required: true,
                  message: 'Por favor, selecione o prefixo!',
                },
              ]}
            >
              <Input
                disabled={id !== 0} // Desabilitar o input se o ID for diferente de 0
                placeholder="Prefixo/Nome"
                defaultValue={location.state.prefixoDestino}
              />
            </Form.Item>
            <Form.Item
              name="comissaoDestino"
              label="Comissão Destino"
              required
            >
              <Input
                disabled={id !== 0} // Desabilitar o input se o ID for diferente de 0
                type="text"
                required
                placeholder="Comissão"
                defaultValue={location.state.comissaoDestino}
              />
            </Form.Item>
            <Form.Item
              name="nomeComissaoDestino"
              label="Nome da Comissão"
              higth="150px"
              required
            >
              <Input
                disabled={id !== 0} // Desabilitar o input se o ID for diferente de 0
                type="text"
                required
                placeholder="Nome da comissão"
                defaultValue={location.state.nomeComissaoDestino}
              />
            </Form.Item>
            <Form.Item
              name="comite"
              label="Comitê/Nome comitê"
              higth="150px"
              required
            >
              <Input
                disabled={id !== 0} // Desabilitar o input se o ID for diferente de 0
                placeholder="Comitê/Nome"
                defaultValue={location.state.comite}
              />
            </Form.Item>
            <Form.Item
              name="observacao"
              label="Observação"
            >
              <TextArea
                disabled={id !== 0} // Desabilitar o input se o ID for diferente de 0
                rows={4}
                type="text"
                placeholder="Observação!"
                defaultValue={location.state.observacao}
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button
                style={{ marginRight: 10, borderRadius: 3 }}
                type="primary"
                htmlType="submit"
              >
                Salvar
              </Button>
              <Button
                style={{ borderRadius: 3 }}
                type="danger"
                onClick={() => history.goBack()}
              >
                Cancelar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </>
    );
  }
  
  export default FormParamAlcadas;