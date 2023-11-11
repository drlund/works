
export function mockHistoryPushWithQuery() {
  const mockHistoryPush = jest.fn();

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
      ...jest.requireActual('react-router-dom').useHistory(),
      push: mockHistoryPush,
    }),
  }));

  return mockHistoryPush;
}
