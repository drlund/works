const {
  AbstractUserCaseNoPayload,
  AbstractUserCaseNoChecks,
  AbstractUserCaseNoChecksPayload,
} = require('./AbstractUserCaseVariations');

describe('AbstractUserCaseVariations', () => {
  const mockPayloadReturn = 'my payload';
  const mockRepository = 'my repository';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('AbstractUserCaseNoPayload', () => {
    describe('direct instantiation', () => {
      it.failing('impossible to instantiated directly', () => {
        // not possible to instantiate directly because you need to implement action/checks
        // left here if someone chooses to add overrides to the methods, then it will break this test
        // @ts-ignore
        expect(() => new AbstractUserCaseNoPayload({ repository: mockRepository })).toThrowError("Abstract classes can't be instantiated.");
      });
    });

    describe('basic extension', () => {
      class NoPayload extends AbstractUserCaseNoPayload {
        _action() {
          return mockPayloadReturn;
        }

        _checks() { /* intentionally blank */ }
      }

      it('returns a value', async () => {
        const { payload } = await new NoPayload({ repository: mockRepository }).run();
        expect(payload).toBe(mockPayloadReturn);
      });
    });
  });

  describe('AbstractUserCaseNoChecks', () => {
    describe('direct instantiation', () => {
      it.failing('impossible to instantiated directly normally', () => {
        // not possible to instantiate directly because you need to implement action/checks
        // left here if someone chooses to add overrides to the methods, then it will break this test
        // @ts-ignore
        expect(() => new AbstractUserCaseNoChecks({ repository: mockRepository })).toThrowError("Abstract classes can't be instantiated.");
      });
    });

    describe('basic extension', () => {
      class NoChecks extends AbstractUserCaseNoChecks {
        _action() {
          return mockPayloadReturn;
        }
      }

      it('returns a value', async () => {
        const { payload } = await new NoChecks({ repository: mockRepository }).run('mock args');
        expect(payload).toBe(mockPayloadReturn);
      });
    });
  });

  describe('AbstractUserCaseNoChecksPayload', () => {
    describe('direct instantiation', () => {
      it.failing('impossible to instantiated directly normally', () => {
        // not possible to instantiate directly because you need to implement action/checks
        // left here if someone chooses to add overrides to the methods, then it will break this test
        // @ts-ignore
        expect(() => new AbstractUserCaseNoChecksPayload({ repository: mockRepository })).toThrowError("Abstract classes can't be instantiated.");
      });
    });

    describe('basic extension', () => {
      class NoChecks extends AbstractUserCaseNoChecksPayload {
        _action() {
          return mockPayloadReturn;
        }
      }

      it('returns a value', async () => {
        const { payload } = await new NoChecks({ repository: mockRepository }).run();
        expect(payload).toBe(mockPayloadReturn);
      });
    });
  });
});
