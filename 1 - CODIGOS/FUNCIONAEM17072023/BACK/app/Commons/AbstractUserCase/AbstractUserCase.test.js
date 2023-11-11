const { AbstractUserCase } = require('./AbstractUserCase');
const { ExpectedAbstractError } = require('./ExpectedError');
const { doMockAbcHasPermission } = require('./abcHasPermission/abcHasPermissionMock');

describe('AbstractUserCase', () => {
  const mockPayload = 'my payload';
  const mockError = 'my error';
  const mockRepository = 'my repository';

  const badRequestError = 400;
  const internalError = 500;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('direct instantiation', () => {
    it('throws when instantiated directly', () => {
      // @ts-ignore
      expect(() => new AbstractUserCase({})).toThrowError("Abstract classes can't be instantiated.");
    });
  });

  describe('extending class', () => {
    describe('with all methods', () => {
      describe('common use', () => {
        class TestWithAllMethods extends AbstractUserCase {
          _action(something) {
            return [this.repository, something];
          }
          _checks(something) {
            if (something !== mockPayload) {
              throw new Error(mockError);
            }
          }
        }

        it('returns the payload when the checks pass', async () => {
          expect(
            await new TestWithAllMethods({ repository: mockRepository }).run(mockPayload)
          ).toEqual({ payload: [mockRepository, mockPayload] });
        });

        it('returns the error when checks fails', async () => {
          expect(
            await new TestWithAllMethods({ repository: mockRepository }).run('something else')
          ).toEqual({ error: [mockError, badRequestError] });
        });
      });

      describe('with multiple objects as payload', () => {
        class TestWithMultipleArgs extends AbstractUserCase {
          _action(arg1, arg2, arg3) {
            return [arg3, arg2, arg1];
          }
          _checks() { /* intentionally blank */ }
        }

        it('works with multiple objects as payload', async () => {
          expect(
            await new TestWithMultipleArgs({ repository: mockRepository }).run('arg1', 'arg2', 'arg3')
          ).toEqual({ payload: ['arg3', 'arg2', 'arg1'] });
        });
      });

      describe('use without payload', () => {
        describe('whithout payload config', () => {
          class TestWithAllMethodsWithoutPayloadConfig extends AbstractUserCase {
            _action() { /* intentionally blank */ }
            _checks() { /* intentionally blank */ }
          }

          it('returns error that payload must not be empty', async () => {
            expect(
              await new TestWithAllMethodsWithoutPayloadConfig({ repository: mockRepository }).run()
            ).toEqual({ error: ['Payload não pode ser vazio', badRequestError] });
          });
        });

        describe('with payload config', () => {
          class TestWithAllMethodsWithPayloadConfig extends AbstractUserCase {
            constructor({ repository }) {
              super({ repository });
              this._config({ usePayload: false });
            }

            _action(something) {
              return [this.repository, something];
            }
            _checks() { /* intentionally blank */ }
          }

          it('returns a payload', async () => {
            expect(
              await new TestWithAllMethodsWithPayloadConfig({ repository: mockRepository }).run()
            ).toEqual({ payload: [mockRepository] });
          });
        });
      });

      describe('checks throws error without message', () => {
        const customError = { customError: true };
        class TestChecksThrowsErrorWithoutMessage extends AbstractUserCase {
          _action() { /* intentionally blank */ }
          _checks() {
            throw customError;
          }
        }

        it('returns error object', async () => {
          expect(
            await new TestChecksThrowsErrorWithoutMessage({ repository: mockRepository }).run(mockPayload)
          ).toEqual({ error: [JSON.stringify(customError), badRequestError] });
        });
      });

      describe('action throws error', () => {
        describe('normal error object', () => {
          class TestActionThrowsNormalError extends AbstractUserCase {
            _action() {
              throw new Error(mockError);
            }
            _checks() { /* intentionally blank */ }
          }

          it('returns error', async () => {
            expect(
              await new TestActionThrowsNormalError({ repository: mockRepository }).run(mockPayload)
            ).toEqual({ error: [mockError, internalError] });
          });
        });

        describe('error without message', () => {
          const customError = { customError: true };
          class TestActionThrowsErrorWithoutMessage extends AbstractUserCase {
            _action() {
              throw customError;
            }
            _checks() { /* intentionally blank */ }
          }

          it('returns custom error', async () => {
            expect(
              await new TestActionThrowsErrorWithoutMessage({ repository: mockRepository }).run(mockPayload)
            ).toEqual({ error: [customError, internalError] });
          });
        });
      });
    });

    describe('without implementing checks method', () => {
      describe('when checks are enabled', () => {
        class TestWithoutChecksNoConfig extends AbstractUserCase {
          _action(something) {
            return [this.repository, something];
          }
        }

        it('throws error to implement checks', async () => {
          await expect(
            new TestWithoutChecksNoConfig({ repository: mockRepository }).run(mockPayload)
          ).rejects.toThrowError('Checks must be implemented');
        });
      });

      describe('when checks are disabled', () => {
        class TestWithoutChecksWithConfig extends AbstractUserCase {
          constructor(repo) {
            super(repo);
            this._config({ useChecks: false });
          }

          _action(something) {
            return [this.repository, something];
          }
        }

        it('runs without throwing', async () => {
          expect(
            await new TestWithoutChecksWithConfig({ repository: mockRepository }).run(mockPayload)
          ).toEqual({ payload: [mockRepository, mockPayload] });
        });
      });
    });

    describe('without implementing action method', () => {
      class TestWithoutAction extends AbstractUserCase {
        constructor(repo) {
          super(repo);
          this._config({ useChecks: false });
        }
      }

      it('throws error to implement action', async () => {
        await expect(() => new TestWithoutAction({ repository: mockRepository }).run(mockPayload)
        ).toThrowError('Action must be implemented');
      });
    });

    describe('methods that shouldnt be overriden', () => {
      describe('AbstractUserCase.run', () => {
        class TestOverridingRun extends AbstractUserCase {
          // @ts-ignore
          run() { /* intentionally blank */ }
        }

        it('throws error on constructor', async () => {
          expect(
            () => new TestOverridingRun({ repository: mockRepository })
          ).toThrowError('Dont override the "run" method');
        });
      });

      describe('AbstractUserCase._config', () => {
        class TestOverridingConfig extends AbstractUserCase {
          _config() { /* intentionally blank */ }
        }

        it('throws error on constructor', async () => {
          expect(
            () => new TestOverridingConfig({ repository: mockRepository })
          ).toThrowError('Dont override the "_config" method');
        });
      });
    });

    describe('throwing expected errors', () => {
      const withClass = 'error class';
      const withFunction = 'helper function';

      class TestWithExpectedErrors extends AbstractUserCase {
        _action({ payload }) {
          if (payload === withClass) {
            throw new ExpectedAbstractError('error in action using class');
          }

          if (payload === withFunction) {
            this._throwExpectedError('error in action using helper function');
          }

          return 'no error thrown';
        }
        _checks({ where, payload }) {
          if (where !== '_checks') return;

          if (payload === withClass) {
            throw new ExpectedAbstractError('error in checks using class');
          }

          if (payload === withFunction) {
            this._throwExpectedError('error in checks using helper function');
          }
        }
      }

      describe('inside _checks', () => {
        it('throws error using helper function', async () => {
          expect(await new TestWithExpectedErrors({ repository: mockRepository })
            .run({
              where: '_checks',
              payload: withFunction
            })
          ).toEqual({ error: ['error in checks using helper function', badRequestError] });
        });
        it('throws error using the error class', async () => {
          expect(await new TestWithExpectedErrors({ repository: mockRepository })
            .run({
              where: '_checks',
              payload: withClass
            })
          ).toEqual({ error: ['error in checks using class', badRequestError] });
        });
      });
      describe('inside _action', () => {
        it('throws error using helper function', async () => {
          expect(await new TestWithExpectedErrors({ repository: mockRepository })
            .run({
              where: '_action',
              payload: withFunction
            })
          ).toEqual({ error: ['error in action using helper function', badRequestError] });
        });
        it('throws error using the error class', async () => {
          expect(await new TestWithExpectedErrors({ repository: mockRepository })
            .run({
              where: '_action',
              payload: withClass
            })
          ).toEqual({ error: ['error in action using class', badRequestError] });
        });
      });
    });

    describe('throwing expected errors with error code', () => {
      const withClass = 'error class';
      const withFunction = 'helper function';
      const errorCode1 = 1;
      const errorCode2 = 2;
      const errorCode3 = 3;
      const errorCode4 = 4;

      class TestWithExpectedErrors extends AbstractUserCase {
        _action({ payload }) {
          if (payload === withClass) {
            throw new ExpectedAbstractError('error in action using class', errorCode1);
          }

          if (payload === withFunction) {
            this._throwExpectedError('error in action using helper function', errorCode2);
          }

          return 'no error thrown';
        }
        _checks({ where, payload }) {
          if (where !== '_checks') {
            return;
          }

          if (payload === withClass) {
            throw new ExpectedAbstractError('error in checks using class', errorCode3);
          }

          if (payload === withFunction) {
            this._throwExpectedError('error in checks using helper function', errorCode4);
          }
        }
      }

      describe('inside _checks', () => {
        it('throws error using helper function', async () => {
          expect(await new TestWithExpectedErrors({ repository: mockRepository })
            .run({
              where: '_checks',
              payload: withFunction
            })
          ).toEqual({ error: ['error in checks using helper function', errorCode4] });
        });
        it('throws error using the error class', async () => {
          expect(await new TestWithExpectedErrors({ repository: mockRepository })
            .run({
              where: '_checks',
              payload: withClass
            })
          ).toEqual({ error: ['error in checks using class', errorCode3] });
        });
      });

      describe('inside _action', () => {
        it('throws error using helper function', async () => {
          expect(await new TestWithExpectedErrors({ repository: mockRepository })
            .run({
              where: '_action',
              payload: withFunction
            })
          ).toEqual({ error: ['error in action using helper function', errorCode2] });
        });

        it('throws error using the error class', async () => {
          expect(await new TestWithExpectedErrors({ repository: mockRepository })
            .run({
              where: '_action',
              payload: withClass
            })
          ).toEqual({ error: ['error in action using class', errorCode1] });
        });
      });
    });

    describe('using abcHasPermission', () => {
      /**
       * @typedef {{
       *  Repository: string,
       *  Functions: {
       *    hasPermission: import('./abcHasPermission').abcHasPermissionUCLevel,
       *  },
       *  RunArguments: string,
       *  Payload: string,
       *  UseTrx: false
       * }} TestWithAbcHasPermissionTypes
      */
      /**
       * @extends {AbstractUserCase<TestWithAbcHasPermissionTypes>}
       */
      class TestWithAbcHasPermission extends AbstractUserCase {
        constructor(args) {
          super(args);
          this._config({ usePayload: false });
        }

        _action() {
          return 'ok';
        }
        _checks() {
          this.functions.hasPermission({
            nomeFerramenta: 'mock ferramenta',
            permissoesRequeridas: 'mockPermissoes',
          });
        }
      }

      const { abcHasPermissionThrowError, abcHasPermissionUCLevelMock } = doMockAbcHasPermission();

      const uc = new TestWithAbcHasPermission({
        repository: mockRepository,
        functions: { hasPermission: abcHasPermissionUCLevelMock }
      });

      it('run without errors when with permission', async () => {
        const { error, payload } = await uc.run();
        expect(error).toBeUndefined();
        expect(payload).toBe('ok');
      });

      it('throws when without permission', async () => {
        abcHasPermissionThrowError();

        const { error } = await uc.run();
        expect(error).toEqual(["Mock Error", badRequestError]);
      });
    });

    describe('other possible mistakes', () => {
      describe('when repository is not passed', () => {
        class TestWithoutRepository extends AbstractUserCase {
        }

        it('throws error on contructor', () => {
          expect(
            // @ts-ignore
            () => new TestWithoutRepository({})
          ).toThrowError('Repository must be passed');
        });
      });
    });
  });

  describe('other examples of use', () => {
    describe('optional payload', () => {
      const noPayloadReturn = "worked without payload";
      class TestWithOptionalPayload extends AbstractUserCase {
        constructor(
          repository,
          usePayload,
        ) {
          super({ repository });
          this._config({ usePayload });
        }

        _action(something) {
          if (something) {
            return [something];
          }
          return noPayloadReturn;
        }
        _checks() { /* intentionally blank */ }
      }

      describe('with payload', () => {
        it('returns the payload', async () => {
          expect(
            await new TestWithOptionalPayload(mockRepository, true).run(mockPayload)
          ).toEqual({ payload: [mockPayload] });
        });
      });

      describe('without payload', () => {
        it('throws if you want payload to be used', async () => {
          expect(
            await new TestWithOptionalPayload(mockRepository, true).run()
          ).toEqual({ error: ['Payload não pode ser vazio', badRequestError] });
        });

        it('returns the payload', async () => {
          expect(
            await new TestWithOptionalPayload(mockRepository, false).run()
          ).toEqual({ payload: noPayloadReturn });
        });
      });
    });

    describe('optional checks', () => {
      const optionalCheckError = 'optional check failed';
      class TestWithOptionalChecks extends AbstractUserCase {
        constructor(
          repository,
          optionalCheck,
        ) {
          super({ repository });
          this.optionalCheck = optionalCheck;
        }

        _action(something) { return something; }
        _checks(something) {
          if (this.optionalCheck && something !== mockPayload) {
            throw new Error(optionalCheckError);
          }
        }
      }

      describe('with optional check', () => {
        it('returns the payload when the check pass', async () => {
          expect(
            await new TestWithOptionalChecks(mockRepository, true).run(mockPayload)
          ).toEqual({ payload: mockPayload });
        });

        it('returns the error when the check fail', async () => {
          expect(
            await new TestWithOptionalChecks(mockRepository, true).run('test')
          ).toEqual({ error: [optionalCheckError, badRequestError] });
        });
      });

      describe('without optional check', () => {
        it('dont throw even if check should fail', async () => {
          expect(
            await new TestWithOptionalChecks(mockRepository, false).run('test')
          ).toEqual({ payload: 'test' });
        });
      });
    });

    describe('multiple repositories', () => {
      class TestMultipleRepositories extends AbstractUserCase {
        _action(something) {
          return [something, this.repository.repo1, this.repository.repo2];
        }
        _checks() { /* intentionally blank */ }
      }

      it('returns the payload', async () => {
        const multipleRepo = { repo1: 'repo1', repo2: 'repo2' };
        expect(
          await new TestMultipleRepositories({ repository: multipleRepo }).run(mockPayload)
        ).toEqual({ payload: [mockPayload, multipleRepo.repo1, multipleRepo.repo2] });
      });
    });

    describe('external functions', () => {
      class TestExternalFunctions extends AbstractUserCase {
        _action(something) {
          return this.functions.external(something);
        }
        _checks() { /* intentionally blank */ }
      }

      const externalFunction1 = (something) => something.toUpperCase();
      const externalFunction2 = (something) => something.split('').reverse().join('');

      describe('with external function one', () => {
        it('returns the payload', async () => {
          expect(
            await new TestExternalFunctions({ repository: mockRepository, functions: { external: externalFunction1 } }).run(mockPayload)
          ).toEqual({ payload: mockPayload.toUpperCase() });
        });
      });

      describe('with external function two', () => {
        it('returns the payload', async () => {
          expect(
            await new TestExternalFunctions({ repository: mockRepository, functions: { external: externalFunction2 } }).run(mockPayload)
          ).toEqual({ payload: mockPayload.split('').reverse().join('') });
        });
      });
    });

    describe('using transactions', () => {
      const mockRepositoryWithGet = {
        get: jest.fn(),
      };
      const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
      };
      class TestUsingTransactions extends AbstractUserCase {
        _action(something) {
          return this.repository.get(something);
        }
        _checks() { /* intentionally blank */ }
      }

      describe('when transaction works', () => {
        it('calls the transaction commit function', async () => {
          await new TestUsingTransactions({ repository: mockRepositoryWithGet, trx: mockTransaction }).run(mockPayload);
          expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
          expect(mockTransaction.commit).toHaveBeenCalledWith();
        });

        it('dont call the transaction rollback function', async () => {
          await new TestUsingTransactions({ repository: mockRepositoryWithGet, trx: mockTransaction }).run(mockPayload);
          expect(mockTransaction.rollback).toHaveBeenCalledTimes(0);
        });
      });

      describe('when transaction fails', () => {
        it('dont call the transaction commit function', async () => {
          mockRepositoryWithGet.get.mockImplementation(() => { throw new Error(mockError); });
          await new TestUsingTransactions({ repository: mockRepositoryWithGet, trx: mockTransaction }).run(mockPayload);
          expect(mockTransaction.commit).toHaveBeenCalledTimes(0);
        });

        it('calls the transaction rollback function', async () => {
          mockRepositoryWithGet.get.mockImplementation(() => { throw new Error(mockError); });
          await new TestUsingTransactions({ repository: mockRepositoryWithGet, trx: mockTransaction }).run(mockPayload);
          expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
          expect(mockTransaction.rollback).toHaveBeenCalledWith();
        });
      });

      describe('when transaction is an invalid object', () => {
        describe('when the methods are not present', () => {
          it('throws if the expected methods are not present', async () => {
            expect(
              // @ts-ignore
              () => new TestUsingTransactions({ repository: mockRepositoryWithGet, trx: {} })
            ).toThrowError("Transaction doesn't comply with the interface.");
          });

          describe('when only one of the methods are present', () => {
            it('throws when only commit is present', async () => {
              expect(
                // @ts-ignore
                () => new TestUsingTransactions({ repository: mockRepositoryWithGet, trx: { commit: jest.fn() } })
              ).toThrowError("Transaction doesn't comply with the interface.");
            });

            it('throws when only rollback is present', async () => {
              expect(
                // @ts-ignore
                () => new TestUsingTransactions({ repository: mockRepositoryWithGet, trx: { rollback: jest.fn() } })
              ).toThrowError("Transaction doesn't comply with the interface.");
            });
          });

        });

        describe('when the methods are present', () => {
          describe("but aren't functions", () => {
            it('throws if the expected methods are not functions', async () => {
              expect(
                // @ts-ignore
                () => new TestUsingTransactions({ repository: mockRepositoryWithGet, trx: { commit: 'test', rollback: 'test' } })
              ).toThrowError("Transaction doesn't comply with the interface.");
            });

            it('throws if one of the expected methods are not functions', async () => {
              expect(
                // @ts-ignore
                () => new TestUsingTransactions({ repository: mockRepositoryWithGet, trx: { commit: jest.fn(), rollback: 'test' } })
              ).toThrowError("Transaction doesn't comply with the interface.");
            });
          });
        });
      });

      describe('when autocommit is off', () => {
        it('dont commit afterwards', async () => {
          mockRepositoryWithGet.get.mockImplementation((v) => Promise.resolve(v));
          const { payload, error } = await new TestUsingTransactions({
            repository: mockRepositoryWithGet,
            trx: mockTransaction,
            autoCommitTrx: false
          }).run(mockPayload);

          expect(mockTransaction.commit).toHaveBeenCalledTimes(0);
          expect(error).toBeUndefined();
          expect(payload).toBe(mockPayload);
        });

        it('still rollback afterwards', async () => {
          mockRepositoryWithGet.get.mockImplementation(() => {
            throw new Error(mockError);
          });

          const { payload, error } = await new TestUsingTransactions({
            repository: mockRepositoryWithGet,
            trx: mockTransaction,
            autoCommitTrx: false
          }).run('something');

          expect(mockTransaction.commit).toHaveBeenCalledTimes(0);
          expect(mockTransaction.rollback).toHaveBeenCalledTimes(1);
          expect(payload).toBeUndefined();
          expect(error).toEqual([mockError, internalError]);
        });
      });
    });

    describe('extra variables for class', () => {
      const extraVariable = 'extra variable';

      class ExtraClass {
        constructor() {
          return "extra class";
        }
      }

      class TestExtraVariables extends AbstractUserCase {
        extraVariable = extraVariable;
        extraClass = new ExtraClass();

        _action(which) {
          if (which === 'extraVariable') {
            return this.extraVariable;
          }
          if (which === 'extraClass') {
            return this.extraClass;
          }
        }

        _checks() { /* intentionally blank */ }
      }

      it('returns the variable', async () => {
        expect(
          await new TestExtraVariables({ repository: mockRepository }).run('extraVariable')
        ).toEqual({ payload: extraVariable });
      });

      it('returns the class', async () => {
        const result = await new TestExtraVariables({ repository: mockRepository }).run('extraClass');
        expect(result).toEqual({ payload: new ExtraClass() });
      });
    });
  });

  describe('other errors', () => {
    class ErrorTestBed extends AbstractUserCase {
      _checks(args) {
        if (args === 'check') {
          this.functions.check();
        }
      }
      _action(args) {
        if (args === 'action') {
          this.functions.action();
        }
      }
    }

    describe('on action', () => {
      it('returns full error for type error', async () => {
        // @ts-ignore
        const { error } = await new ErrorTestBed({ repository: mockRepository, functions: { action: () => ({}).foo.baz } }).run('action');
        expect(error).toEqual([
          expect.stringMatching(
            /.*"name":"TypeError","message":"Cannot read properties of undefined \(reading 'baz'\)","stack":"TypeError: Cannot read properties of undefined \(reading 'baz'*/i
          ),
          internalError
        ]);
      });

      it('returns full error for reference error', async () => {
        // @ts-ignore
        const { error } = await new ErrorTestBed({ repository: mockRepository, functions: { action: () => baz } }).run('action');
        expect(error).toEqual([
          expect.stringMatching(/.*"name":"ReferenceError","message":"baz is not defined","stack":"ReferenceError: baz is not defined*/i),
          internalError
        ]);
      });
    });

    describe('on check', () => {
      it('returns full error for type error', async () => {
      // @ts-ignore
        const { error } = await new ErrorTestBed({ repository: mockRepository, functions: { check: () => ({}).foo.baz } }).run('check');
        expect(error).toEqual([
          expect.stringMatching(
            /.*"name":"TypeError","message":"Cannot read properties of undefined \(reading 'baz'\)","stack":"TypeError: Cannot read properties of undefined \(reading 'baz'*/i
          ),
          internalError
        ]);
      });

      it('returns full error for reference error', async () => {
      // @ts-ignore
        const { error } = await new ErrorTestBed({ repository: mockRepository, functions: { check: () => baz } }).run('check');
        expect(error).toEqual([
          expect.stringMatching(/.*"name":"ReferenceError","message":"baz is not defined","stack":"ReferenceError: baz is not defined*/i),
          internalError
        ]);
      });
    });
  });
});
