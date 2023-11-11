const [exibirJustificativa, setExibirJustificativa] = useState(false);
const [justificativa, setJustificativa] = useState('');

{exibirJustificativa && (
    <div>
      <Divider />
      <h3>Justificativa para a exclusão:</h3>
      <textarea
        value={justificativa}
        onChange={(e) => setJustificativa(e.target.value)}
        rows={4}
      />
      <Button type="primary" onClick={() => console.log(justificativa)}>
        Confirmar exclusão
      </Button>
    </div>
  )}