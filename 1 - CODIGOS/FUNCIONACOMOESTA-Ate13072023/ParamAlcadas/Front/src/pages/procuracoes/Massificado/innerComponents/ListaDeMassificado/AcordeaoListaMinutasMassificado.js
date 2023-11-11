import { Checkbox } from 'antd';
import { useMemo } from 'react';

/**
 * @param {{
 *  outorgados: import('.').ItemFunciMassificado[],
 *  setSelected: React.Dispatch<React.SetStateAction<string[]>>,
 * }} props
 */
export function AcordeaoListaMinutasMassificado({ outorgados, setSelected }) {
  const checkboxOptions = useMemo(() => [...outorgados]
    .sort((a, b) => a.nomeOutorgado.localeCompare(b.nomeOutorgado))
    .map((o) => ({
      label: `${o.matriculaOutorgado} - ${o.nomeOutorgado}`,
      value: o.idMinuta,
    })),
    [outorgados]
  );

  return (
    <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
      <Checkbox.Group
        style={{ display: 'flex', flexDirection: 'column' }}
        options={checkboxOptions}
        defaultValue={outorgados.map((o) => o.idMinuta)}
        onChange={(v) => setSelected(/** @type {string[]} */(v))} />
    </div>
  );
}
