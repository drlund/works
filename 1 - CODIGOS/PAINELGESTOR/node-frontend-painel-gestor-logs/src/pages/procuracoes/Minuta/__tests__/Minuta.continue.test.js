// eslint-disable-next-line import/no-unresolved
import { screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { MinutasContinue } from '..';
import {
  startRender
} from '../../tests/utils';
import { regenerateParticularMock } from '../../__mocks__/regenerateMinutaMock';

jest.mock('@react-pdf/renderer', () => ({
  Document: () => <div>Document</div>,
  Image: () => <div>Image</div>,
  Page: () => <div>Page</div>,
  PDFViewer: () => <div>PDF Viewer</div>,
  PDFDownloadLink: () => <div>PDFDownloadLink</div>,
  StyleSheet: { create: () => { } },
  Text: () => <div>Text</div>,
  View: () => <div>View</div>
}));

describe('<MinutasContinue>', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('normal render', async () => {
    await startRender(MinutasContinue, {
      beforeRender: () => {
        globalThis.permissionHookMock.mockReturnValue(true);
        globalThis.fetchSpy.mockResolvedValue(regenerateParticularMock);
      },
      initialEntries: ['minutaID'],
      routePath: ':idMinuta',
      timesFetchIsCalled: 1,
    });

    // renders the helper header
    expect(screen.getByRole('heading', {
      name: 'Baixar Minuta',
      level: 2
    })).toBeInTheDocument();

    // renders the PDFDownloadLink
    expect(screen.getByText('PDFDownloadLink')).toBeInTheDocument();

    // renders the PDF Viewer
    expect(screen.getByText('PDF Viewer')).toBeInTheDocument();
  });

  it('when minuta not found', async () => {
    const mockError = 'my mockError';
    const basePath = '/mock';

    await act(() => {
      jest.runAllTimers();
    });

    await startRender(MinutasContinue, {
      beforeRender: () => globalThis.fetchSpy.mockRejectedValue(mockError),
      initialEntries: [`${basePath}/minutaID`],
      routePath: `${basePath}/:idMinuta`,
      timesFetchIsCalled: 1,
    });

    // renders 404 page
    expect(screen.getByText('404')).toBeInTheDocument();

    // renders error toast
    expect(screen.getByText(mockError)).toBeInTheDocument();

    // changes the page after few seconds
    await act(() => {
      jest.runAllTimers();
    });

    expect(globalThis.routerDomPushMock).toHaveBeenLastCalledWith(`${basePath}/`);
  });
});
