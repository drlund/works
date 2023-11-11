/**
 * @param {{
 *  observacao: string,
 * }} props
 */
export function SolicitacaoObservacao({ observacao }) {
  return (<>
    <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Observação:</div>
    <div style={{ margin: '0.5em 0 1em 1em' }}>{observacao}</div>
  </>);
}
