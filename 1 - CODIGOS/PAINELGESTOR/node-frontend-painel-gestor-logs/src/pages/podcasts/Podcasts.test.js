import { MemoryRouter } from 'react-router-dom';
import Podcasts from '.';
import { mockFormData } from '../../../test/mockFormData';

const { render, screen } = require('@testing-library/react');

describe('<Podcasts>', () => {
  beforeEach(() => {
    mockFormData();
    globalThis.permissionHookMock.mockReturnValue(true);
    render(
      <MemoryRouter>
        <Podcasts />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe('na página inicial', () => {
    it('renderiza componente de episódios', async () => {
      expect(screen.getByRole('heading', {
        name: /Episódios/i
      })).toBeInTheDocument();
    });
  });
});
