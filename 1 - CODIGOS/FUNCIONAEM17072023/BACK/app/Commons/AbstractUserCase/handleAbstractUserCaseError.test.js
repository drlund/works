const mockException = jest.fn();
globalThis.use.mockReturnValue(mockException);

const { handleAbstractUserCaseError } = require('./handleAbstractUserCaseError');

describe('handleAbstractUserCaseError()', () => {
  mockException.mockImplementation((...x) => { throw Error(x); });

  describe('AbstractUserCase like errors', () => {
    const mockError = ['message', 'code'];

    it('throws the exception with message and code', () => {
      expect(() => handleAbstractUserCaseError(mockError)).toThrowError(...mockError);
    });
  });

  describe('with errors', () => {
    const errorMessage = 'custom error message';
    describe('with default Error constructor', () => {
      it('throws an exception with error name, message and code', () => {
        expect(() => handleAbstractUserCaseError(new Error(errorMessage))).toThrowError(`Error: ${errorMessage}`, 500);
      });
    });
    describe('with custom Error constructor', () => {
      const errorName = 'custom error name';
      class CustomError extends Error {
        name = errorName;
      }

      it('throws an exception with error name, message and code', () => {
        expect(() => handleAbstractUserCaseError(new CustomError(errorMessage))).toThrowError(`${errorName}: ${errorMessage}`, 500);
      });
    });
  });

  describe('with something else', () => {
    describe('that is a string', () => {
      it('throws an exception with string and code', () => {
        const somethingElse = 'something else';
        expect(() => handleAbstractUserCaseError(somethingElse)).toThrowError('something else', 500);
      });
    });

    describe('that is an object', () => {
      it('throws an exception with object and code', () => {
        const somethingElse = { something: 'else' };
        expect(() => handleAbstractUserCaseError(somethingElse)).toThrowError(JSON.stringify(somethingElse), 500);
      });
    });
  });
});