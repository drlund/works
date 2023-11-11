import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FeatureFlagComponent } from '.';
import { FeatureFlagContext, useFeatureFlagContext } from './FeatureFlagContext';

describe('<FeatureFlagContext> & <FeatureFlagComponent>', () => {
  it('works with the component/context', async () => {
    renderTest({ query: true }).expectMock();
  });

  it('return false when trying to use context hook out of context', () => {
    render(<MockComponent />);
    expect(screen.getByText('mock false')).toBeInTheDocument();
  });
});

function MockComponent() {
  const flag = useFeatureFlagContext();
  return <div>
    {`mock ${flag.valueOf()}`}
  </div>;
}

/**
 * @param {{
 *  query?: boolean | 'other',
 *  hasPermission?: boolean
 *  featureFlagOptions?: Omit<GetProps<FeatureFlagContext>, 'children'>
 * }} [props]
 */
function renderTest({
  hasPermission = false,
  query = false,
  featureFlagOptions = {}
} = {}) {
  globalThis.permissionHookMock.mockReturnValue(hasPermission);

  const url = /** @type {import('react-router-dom').MemoryRouterProps['initialEntries'][0]} */ (
    // eslint-disable-next-line no-nested-ternary
    query === 'other'
      ? '/?flag=otherFlag'
      : query
        ? '/?flag=dev'
        : '/'
  );

  render(
    // @ts-ignore
    <MemoryRouter initialEntries={[url]}>
      <FeatureFlagContext {...featureFlagOptions}>
        <FeatureFlagComponent>mock</FeatureFlagComponent>
      </FeatureFlagContext>
    </MemoryRouter >
  );

  return {
    expectMock: () => expect(screen.getByText('mock')).toBeInTheDocument(),
    expect404: () => expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument(),
  };
}
