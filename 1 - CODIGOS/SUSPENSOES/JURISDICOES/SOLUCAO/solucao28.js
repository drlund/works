// Claro, aqui está o código completo com as modificações sugeridas:


// ...

function FormParamSuspensao({ location }) {
  const tipoInputRef = useRef(null);
  const id = parseInt(location.id, 10);
  const [validaJurisdicao, setValidaJurisdicao] = useState([]);
  const [tipoInputValue, setTipoInputValue] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [tipoSelecionadoTemp, setTipoSelecionadoTemp] = useState(''); // Adicione esta linha
  const [tiposSuspensao, setTiposSuspensao] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoTipoDeSuspensao, setNovoTipoDeSuspensao] = useState('');
  const [dadosJurisdicoes, setDadosJurisdicoes] = useState({});
  const [, setTiposJurisdicoes] = useState([]);
  const [, setValidade] = useState(null);
  const [, setDadosSuspensoesForm] = useState();

  // ...

  const handleTipoChange = (e) => {
    const valorSelecionado = e.target.value;

    if (!tipoJurisdicoesMap[valorSelecionado]) {
      message.error('Opção de tipo selecionada inválida!');
      return;
    }

    const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
    setTipoSelecionado(valorRadioGroup);
    setTipoSelecionadoTemp(valorRadioGroup); // Adicione esta linha

    let formatoInput = '';
    switch (valorRadioGroup) {
      // ...
    }

    // ...
  };

  // ...

  <Form.Item
    name="tipo"
    label="Tipo"
    rules={[
      {
        required: true,
        message: 'Por favor, selecione um tipo!',
      },
      ({ getFieldValue }) => ({
        validator(_, value) {
          const tipoSelecionado = tipoSelecionadoTemp; // Usamos tipoSelecionadoTemp aqui
          if (!value || validaJurisdicao.includes(value)) {
            return Promise.resolve();
          }

          if (!tipoSelecionado) {
            return Promise.resolve();
          }

          const chaveJurisdicao = `${tipoSelecionado}Juris`;
          const isValid = validarTipo(value, chaveJurisdicao);

          if (isValid) {
            return Promise.resolve();
          }

          return Promise.reject(
            'O tipo selecionado não é válido para esta opção.',
          );
        },
      }),
    ]}
  >
    <InputPrefixoAlcada
      placeholder="Tipo"
      value={tipoInputValue}
      ref={tipoInputRef}
    />
  </Form.Item>

  // ...
}

// Certifique-se de adicionar as linhas relevantes conforme indicado acima. Isso deve ajudar a resolver o problema de validação que você estava enfrentando.