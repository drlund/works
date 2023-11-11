import { useEffect } from 'react';
import * as MinutaTemplateEditavelModule from '../Editavel/Template';
import * as MinutaTemplateShowDataModule from '../ReadOnly/ShowData';
import * as MinutaTemplateShowTemplateModule from '../ReadOnly/ShowTemplate';

/** @type {jest.SpyInstance<MinutaTemplateEditavelModule.MinutaTemplateEditavel>} */
export const minutaTemplateEditavelSpy = jest.spyOn(
  MinutaTemplateEditavelModule,
  // @ts-ignore
  MinutaTemplateEditavelModule.MinutaTemplateEditavel.name
);

/** @type {jest.SpyInstance<MinutaTemplateShowDataModule.MinutaTemplateShowData>} */
export const minutaTemplateShowDataSpy = jest.spyOn(
  MinutaTemplateShowDataModule,
  // @ts-ignore
  MinutaTemplateShowDataModule.MinutaTemplateShowData.name
);

/** @type {jest.SpyInstance<MinutaTemplateShowTemplateModule.MinutaTemplateShowTemplate>} */
export const minutaTemplateShowTemplateSpy = jest.spyOn(
  MinutaTemplateShowTemplateModule,
  // @ts-ignore
  MinutaTemplateShowTemplateModule.MinutaTemplateShowTemplate.name
);

export function doMockMinutaTemplate() {
  // @ts-ignore
  minutaTemplateEditavelSpy.mockImplementation(MinutaTemplateMock);
  // @ts-ignore
  minutaTemplateShowDataSpy.mockImplementation(MinutaTemplateMock);
  // @ts-ignore
  minutaTemplateShowTemplateSpy.mockImplementation(MinutaTemplateMock);

  return {
    minutaTemplateEditavelSpy,
    minutaTemplateShowDataSpy,
    minutaTemplateShowTemplateSpy
  };
}

export const templateAfterMock = 'template after MinutaTemplateMock';

export function MinutaTemplateMock({
  editable = false,
  templateBase = 'mock inicial',
  // @ts-ignore
  callback,
}) {
  useEffect(() => {
    callback?.({ isValid: true, template: templateAfterMock });
  }, []);

  return (
    <div data-testid="minutaTemplateMock">
      {editable && (
        <span>
          {`editable: ${String(editable)}`}
        </span>)
      }
      <span>
        {String(templateBase)}
      </span>
    </div>
  );
}
