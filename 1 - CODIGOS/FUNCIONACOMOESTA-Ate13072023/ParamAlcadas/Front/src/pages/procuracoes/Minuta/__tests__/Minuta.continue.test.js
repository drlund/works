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

  describe('normal render', () => {
    beforeEach(async () => {
      await startRender(MinutasContinue, {
        beforeRender: () => {
          globalThis.permissionHookMock.mockReturnValue(true);
          globalThis.fetchSpy.mockResolvedValue(regenerateParticularMock);
        },
        initialEntries: ['minutaID'],
        routePath: ':idMinuta',
        timesFetchIsCalled: 1,
      });
    });

    it('renders the helper header', async () => {
      expect(screen.getByRole('heading', {
        name: 'Baixar Minuta',
        level: 2
      })).toBeInTheDocument();
    });

    it('renders the PDFDownloadLink', () => {
      expect(screen.getByText('PDFDownloadLink')).toBeInTheDocument();
    });

    it('renders the PDF Viewer', () => {
      expect(screen.getByText('PDF Viewer')).toBeInTheDocument();
    });
  });

  describe('when minuta not found', () => {
    const mockError = 'my mockError';
    const basePath = '/mock'

    beforeEach(async () => {
      act(() => {
        jest.runAllTimers();
      });

      await startRender(MinutasContinue, {
        beforeRender: () => globalThis.fetchSpy.mockRejectedValue(mockError),
        initialEntries: [`${basePath}/minutaID`],
        routePath: `${basePath}/:idMinuta`,
        timesFetchIsCalled: 1,
      });
    });

    it('renders 404 page', async () => {
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('renders error toast', async () => {
      expect(screen.getByText(mockError)).toBeInTheDocument();
    });

    it('changes the page after few seconds', async () => {
      act(() => {
        jest.runAllTimers();
      });

      expect(globalThis.routerDomPushMock).toHaveBeenLastCalledWith(`${basePath}/`);
    });
  });
});
