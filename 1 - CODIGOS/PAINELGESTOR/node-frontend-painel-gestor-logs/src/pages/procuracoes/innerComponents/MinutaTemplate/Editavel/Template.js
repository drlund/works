import { useState } from 'react';

import RichEditor from 'components/richeditor/RichEditor';

import { CampoInformacao } from '../../CampoInformacao';
import { addLineBreakToStrongTags } from '../helpers/forEditor/addLineBreakToStrongTags';
import { checkIsValidTemplate } from "../helpers/forEditor/checkIsValidTemplate";
import { createTemplateButtons } from '../helpers/forEditor/createTemplateButtons';
import { cleanHTML } from '../helpers/forHtml/cleanHTML';
import { makeToolbar } from '../helpers/others/makeToolbar';

/**
 * @param {{
 *  templateBase: string,
 *  fieldsMap: {[key: string]: string},
 *  callback: ({ template, isValid }: { template: string, isValid: boolean }) => Void
 * }} props
 */
export function MinutaTemplateEditavel({
  templateBase,
  fieldsMap,
  callback,
}) {
  const [template, setTemplate] = useState(templateBase);

  /**
   * @param {{ target: { getContent: () => string; }}} props
   */
  const handleBlur = ({ target }) => {
    const updatedTemplate = cleanHTML(target.getContent());
    const updatedIsValid = checkIsValidTemplate(updatedTemplate, fieldsMap);

    setTemplate(updatedTemplate);

    callback({
      template: addLineBreakToStrongTags(updatedTemplate),
      isValid: updatedIsValid
    });
  };

  return (
    <CampoInformacao
      title="Criação do Template"
    >
      <RichEditor
        key={`${template}${templateBase}`}
        id="MinutaTemplateEditor"
        toolbar={makeToolbar(fieldsMap)}
        extraInit={{
          setup: (editor) => {
            const buttons = {};

            createTemplateButtons({ fieldsMap, editor, buttons });

            callback({
              template: addLineBreakToStrongTags(template),
              isValid: checkIsValidTemplate(template, fieldsMap)
            });
          },
        }}
        inline
        menubar={false}
        entityEncoding="raw"
        onBlur={handleBlur}
        initialValue={template}
      />
    </CampoInformacao>
  );
}
