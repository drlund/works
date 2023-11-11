type DatabaseManager = import('@adonisjs/lucid/src/Database/Manager');
type LucidDatabaseOriginal = import('@adonisjs/lucid/src/Database');

type originalRaw = LucidDatabaseOriginal['raw'];

namespace Adonis {
  interface LucidDatabase extends Omit<LucidDatabaseOriginal, 'raw'> {
    raw<T = unknown>(...args: Parameters<originalRaw>): Promise<T[]>;
    beginTransaction(): Promise<Adonis.Trx>;
  }

  interface Database extends Omit<DatabaseManager, 'connection'> {
    connection(...args: Parameters<DatabaseManager['connection']>): LucidDatabase;
  }

  type Trx = {
    commit: Function;
    rollback: Function;
  };
}

function use(name: 'Database'): Adonis.Database;
