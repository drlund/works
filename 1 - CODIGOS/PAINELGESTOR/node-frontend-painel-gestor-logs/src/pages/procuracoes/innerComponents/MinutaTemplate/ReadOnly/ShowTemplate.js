import RichEditor from 'components/richeditor/RichEditor';
import { CampoInformacao } from '../../CampoInformacao';

/**
 * @param {{
 *  templateBase: string,
 * }} props
 */
export function MinutaTemplateShowTemplate({
  templateBase,
}) {
  return (
    <CampoInformacao
      title="Visualização da Minuta"
    >
      <RichEditor
        key={templateBase}
        id="MinutaTemplateEditor"
        disabled
        inline
        menubar={false}
        entityEncoding="raw"
        initialValue={templateBase}
      />
    </CampoInformacao>
  );
}


