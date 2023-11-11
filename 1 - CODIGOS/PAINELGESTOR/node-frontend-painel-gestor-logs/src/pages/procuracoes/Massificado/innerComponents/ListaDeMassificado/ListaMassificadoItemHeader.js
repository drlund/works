import { Button, Popconfirm, Tooltip } from 'antd';
import { useCadastroProcuracao } from 'pages/procuracoes/contexts/ProcuracoesContext';

const pluralRules = (/** @type {number} */ n) => new Intl.PluralRules('pt-BR').select(n);

/**
 * @param {{
 *  item: import('.').ItemMassificadoGroup,
 *  ativos: number,
 *  handleGerar: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
 *  handleDeletar: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
 *  minutasSelected: number, // -1 sem seleção, 0+ selecionadas
 * }} props
 */
export function ListaMassificadoItemHeader({ item, ativos, handleGerar, handleDeletar, minutasSelected }) {
  const { fluxos } = useCadastroProcuracao();

  const nadaSelecionado = minutasSelected === -1;
  const minutasText = nadaSelecionado ? '' : `(${minutasSelected} ${pluralRules(minutasSelected) === 'one' ? 'minuta' : 'minutas'})`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2em' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexGrow: 1, gap: '5em' }}>
        <Tooltip title={item.idMassificado}>
          <span style={{ width: '5em', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.idMassificado}</span>
        </Tooltip>
        <span>{fluxos[item.idFluxo].minuta}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
        <span>{ativos}/{item.total}</span>
        <Button
          onClick={handleGerar}
          disabled={minutasSelected === 0}
        >
          Gerar Arquivos Novamente {minutasText}
        </Button>
        <Popconfirm
          title="Tem certeza que deseja deletar?"
          onConfirm={handleDeletar}
          okText="Deletar"
          cancelText="Cancelar"
          disabled={minutasSelected === 0}
        >
          <Button
            danger
            type='dashed'
            disabled={minutasSelected === 0}
          >
            Deletar Massificado {minutasText}
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
}
