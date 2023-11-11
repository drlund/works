import { useEffect, useRef, useState } from 'react';

import RichEditor from 'components/richeditor/RichEditor';

import { CampoInformacao } from '../../CampoInformacao';
import { ModalEditarMinuta } from '../ModalEditarMinuta';
import { checkIsValidReplaced } from "../helpers/forEditor/checkIsValidReplaced";
import { createReplacerMap } from '../helpers/forGeneratedData/createReplacerMap';
import { getDatasetFromTemplate } from '../helpers/forHtml/getDatasetFromTemplate';
import { replaceInTemplate } from '../helpers/forHtml/replaceInTemplate';

/**
 * @param {{
 *  cardTitle?: import('react').ReactNode,
 *  templateBase: string,
 *  dadosProcuracao: Partial<Procuracoes.DadosProcuracao>
 * } & ({
 *  editable?: never,
 *  changeDadosProcuracao?: never,
 *  callback?: never,
 * } | {
 *  editable: boolean,
 *  changeDadosProcuracao: import('./changeDadosProcuracao').ChangeDadosClosureFunc,
 *  callback?: ({ template, isValid }: { template: string, isValid: boolean }) => Void
 * })} props
 */
export function MinutaTemplateShowData({
  cardTitle = 'Visualização da Minuta',
  templateBase,
  dadosProcuracao,
  editable = false,
  changeDadosProcuracao,
  callback = () => { },
}) {
  const [template, setTemplate] = useState(() => replaceTemplate());
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const newTemplate = replaceTemplate();
      setTemplate(newTemplate);
      ref.current.setContent(newTemplate);
    }
  }, [dadosProcuracao, templateBase]);

  function replaceTemplate() {
    return replaceInTemplate({
      templateBase,
      replacerMap: createReplacerMap(dadosProcuracao),
    });
  }

  return (
    <CampoInformacao
      title={cardTitle}
      extraButton={
        editable
        && (
          <ModalEditarMinuta
            keyList={
              /** @type {{ [key: string]: string }[]} */
              (getDatasetFromTemplate(templateBase, 'minuta', ['minuta', 'display']))
            }
            dadosProcuracao={dadosProcuracao}
            changeDadosProcuracao={changeDadosProcuracao}
          />
        )
      }
    >
      <RichEditor
        key={`${template}${templateBase}`}
        id="MinutaTemplateEditor"
        disabled
        extraInit={{
          setup: () => {
            callback({
              template,
              isValid: checkIsValidReplaced(template, templateBase)
            });
          },
        }}
        inline
        menubar={false}
        entityEncoding="raw"
        onInit={(evt, editor) => {
          ref.current = editor;
        }}
        initialValue={template}
      />
    </CampoInformacao>
  );
}


