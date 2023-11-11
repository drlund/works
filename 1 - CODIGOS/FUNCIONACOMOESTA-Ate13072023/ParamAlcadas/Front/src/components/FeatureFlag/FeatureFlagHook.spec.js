import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useFeatureFlag } from './FeatureFlagHook';

describe('useFeatureFlag()', () => {
  it('hook works when with permission', async () => {
    renderTest({ query: true }).expectMockTrue();
  });

  it('hook works when without permission', async () => {
    renderTest().expectMockFalse();
  });
});

/**
 * @param {{
 *  query?: boolean | 'other',
 *  hasPermission?: boolean
 * }} [props]
 */
function renderTest({
  hasPermission = false,
  query = false,
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

  function MockComponent() {
    const flag = useFeatureFlag();

    return <div>
      {`mock ${flag.valueOf()}`}
    </div>;
  }

  render(
    // @ts-ignore
    <MemoryRouter initialEntries={[url]}>
      <MockComponent />
    </MemoryRouter >
  );

  return {
    expectMockTrue: () => expect(screen.getByText('mock true')).toBeInTheDocument(),
    expectMockFalse: () => expect(screen.getByText('mock false')).toBeInTheDocument(),
  };
}
