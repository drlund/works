import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FeatureFlag } from '.';

describe('<FeatureFlag>', () => {
  describe('using "both" use option', () => {
    it('renders 404 page when without permission or query flag', () => {
      renderTest({ featureFlagOptions: { use: 'both' }, hasPermission: false, query: false }).expect404();
    });

    it('renders children when with permission and query flag', () => {
      renderTest({ featureFlagOptions: { use: 'both' }, hasPermission: true, query: true }).expectMock();
    });

    it('renders 404 page when with permission and without query flag', () => {
      renderTest({ featureFlagOptions: { use: 'both' }, hasPermission: true, query: false }).expect404();
    });

    it('renders 404 page when without permission and with query flag', () => {
      renderTest({ featureFlagOptions: { use: 'both' }, hasPermission: false, query: true }).expect404();
    });

    it('renders 404 page when with permission and with another query flag', () => {
      renderTest({ featureFlagOptions: { use: 'both' }, hasPermission: true, query: 'other' }).expect404();
    });

    it('renders 404 page when without permission and with another query flag', () => {
      renderTest({ featureFlagOptions: { use: 'both' }, hasPermission: false, query: 'other' }).expect404();
    });
  });

  describe('using "any" use option', () => {
    it('renders 404 page when without permission or query flag', () => {
      renderTest({ featureFlagOptions: { use: 'any' }, hasPermission: false, query: false }).expect404();
    });

    it('renders children when with permission and query flag', () => {
      renderTest({ featureFlagOptions: { use: 'any' }, hasPermission: true, query: true }).expectMock();
    });

    it('renders children when with permission and without query flag', () => {
      renderTest({ featureFlagOptions: { use: 'any' }, hasPermission: true, query: false }).expectMock();
    });

    it('renders children when without permission and with query flag', () => {
      renderTest({ featureFlagOptions: { use: 'any' }, hasPermission: false, query: true }).expectMock();
    });

    it('renders children when with permission and with another query flag', () => {
      renderTest({ featureFlagOptions: { use: 'any' }, hasPermission: true, query: 'other' }).expectMock();
    });

    it('renders 404 page when without permission and with another query flag', () => {
      renderTest({ featureFlagOptions: { use: 'any' }, hasPermission: false, query: 'other' }).expect404();
    });
  });

  describe('using "permission" use option', () => {
    it('renders 404 page when without permission or query flag', () => {
      renderTest({ featureFlagOptions: { use: 'permission' }, hasPermission: false, query: false }).expect404();
    });

    it('renders children when with permission and query flag', () => {
      renderTest({ featureFlagOptions: { use: 'permission' }, hasPermission: true, query: true }).expectMock();
    });

    it('renders children when with permission and without query flag', () => {
      renderTest({ featureFlagOptions: { use: 'permission' }, hasPermission: true, query: false }).expectMock();
    });

    it('renders 404 page when without permission and with query flag', () => {
      renderTest({ featureFlagOptions: { use: 'permission' }, hasPermission: false, query: true }).expect404();
    });

    it('renders children when with permission and with another query flag', () => {
      renderTest({ featureFlagOptions: { use: 'permission' }, hasPermission: true, query: 'other' }).expectMock();
    });

    it('renders 404 page when without permission and with another query flag', () => {
      renderTest({ featureFlagOptions: { use: 'permission' }, hasPermission: false, query: 'other' }).expect404();
    });
  });

  describe('using "query" use option', () => {
    it('renders 404 page when without permission or query flag', () => {
      renderTest({ featureFlagOptions: { use: 'query' }, hasPermission: false, query: false }).expect404();
    });

    it('renders children when with permission and query flag', () => {
      renderTest({ featureFlagOptions: { use: 'query' }, hasPermission: true, query: true }).expectMock();
    });

    it('renders 404 page when with permission and without query flag', () => {
      renderTest({ featureFlagOptions: { use: 'query' }, hasPermission: true, query: false }).expect404();
    });

    it('renders children when without permission and with query flag', () => {
      renderTest({ featureFlagOptions: { use: 'query' }, hasPermission: false, query: true }).expectMock();
    });

    it('renders 404 page when with permission and with another query flag', () => {
      renderTest({ featureFlagOptions: { use: 'query' }, hasPermission: true, query: 'other' }).expect404();
    });

    it('renders 404 page when without permission and with another query flag', () => {
      renderTest({ featureFlagOptions: { use: 'query' }, hasPermission: false, query: 'other' }).expect404();
    });

    it('renders children when without permission and with query flag other', () => {
      renderTest({ featureFlagOptions: { use: 'query', flagName: 'other' }, hasPermission: false, query: 'other' }).expect404();
    });
  });

  describe('using a fallback component', () => {
    it('renders the fallback component when without correct permissions', () => {
      renderTest({ featureFlagOptions: { fallback: <div>fallback component</div> } });
      expect(screen.getByText('fallback component')).toBeInTheDocument();
    });

    it('renders the mock component when with correct permissions', () => {
      renderTest({ featureFlagOptions: { fallback: <div>fallback component</div> }, hasPermission: true }).expectMock();
    });
  });
});

/**
 * @param {{
 *  query?: boolean | 'other',
 *  hasPermission?: boolean
 *  featureFlagOptions?: Omit<GetProps<FeatureFlag>, 'children'>
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
      <FeatureFlag {...featureFlagOptions}>mock</FeatureFlag>
    </MemoryRouter >
  );

  return {
    expectMock: () => expect(screen.getByText('mock')).toBeInTheDocument(),
    expect404: () => expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument(),
  };
}
