import Podcasts from '.';
import { mockFormData } from '../../../test/mockFormData';

const { render, screen } = require('@testing-library/react');

describe('<Podcasts>', () => {
  beforeEach(() => {
    mockFormData();
    globalThis.permissionHookMock.mockReturnValue(true);
    render(<Podcasts />)
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe('na página inicial', () => {
    it('renderiza componente de episódios', async () => {
      expect(screen.getByRole('heading', {
        name: /Episódios/i
      })).toBeInTheDocument();
    })
  })

});