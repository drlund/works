const { ExpectedAbstractError } = require('..');

jest.mock('../../../Models/Mongo/PermissoesFerramentas');
jest.mock('../../../Models/Mongo/ConcessoesAcessos');

const abcHasPermissionModule = require('.');

/**
 * função usada pra mockar e retornar
 */
function doMockAbcHasPermission() {
  /**
   * @type {jest.SpyInstance<abcHasPermissionModule.abcHasPermission>}
   */
  const abcHasPermissionSpy = jest.spyOn(
    abcHasPermissionModule,
    // @ts-ignore
    abcHasPermissionModule.abcHasPermission.name
  );

  /**
   * @type {jest.Mock<import('.').abcHasPermissionUCLevel>}
   */
  const abcHasPermissionUCLevelMock = jest.fn().mockResolvedValue(true);

  abcHasPermissionSpy.mockImplementation(() => abcHasPermissionUCLevelMock);

  function abcHasPermissionThrowError(code = 400) {
    abcHasPermissionUCLevelMock.mockImplementation(() => {
      throw new ExpectedAbstractError('Mock Error', code);
    });
  }

  return {
    /**
     * mock do que é chamado no controller
     */
    abcHasPermissionSpy,
    /**
     * mock do que é chamado de dentro do UC
     */
    abcHasPermissionUCLevelMock,
    /**
     * faz o abcHP lançar exceção de sem autorização
     */
    abcHasPermissionThrowError,
  };
}

module.exports = {
  doMockAbcHasPermission
};
