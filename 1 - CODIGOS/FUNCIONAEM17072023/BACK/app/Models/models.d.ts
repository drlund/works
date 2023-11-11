// Links Documentação:
// https://legacy.adonisjs.com/docs/4.1/query-builder
// https://legacy.adonisjs.com/docs/4.1/lucid

type LucidModelOriginal = typeof import('@adonisjs/lucid/src/Lucid/Model');
type LucidQueryBuilderOriginal = import('@adonisjs/lucid/src/Lucid/QueryBuilder');
type KnexQueryBuilder = import('../../node_modules/knex/types').QueryBuilder;

type ModelQueryReturn = null | {
  [key: string]: unknown;
  [key in Adonis.Query]: Adonis.Query[key];
  toJSON: () => unknown;
};

type updateQueryArguments = {
  (field: string, value: unknown): Promise<unknown>;
  (object: Record<string, unknown>): Promise<unknown>;
  (...args: unknown): Promise<unknown>;
};

type allWhereQueryArguments = {
  (field: string, value: unknown): Adonis.Query;
  (object: Record<string, unknown>): Adonis.Query;
  (field: string, comparisonOperator: string, value: unknown): Adonis.Query;
  (...args: unknown): Adonis.Query;
};

type functionQuery = {
  (func: (this: Adonis.Query) => void): Adonis.Query;
};

type before = '' | 'or' | 'and';
type not = Capitalize<'' | 'not'>;
type whereKeys<TAfter, TNot extends boolean = false> = Uncapitalize<`${before}Where${TNot extends true ? not : ''}${Capitalize<TAfter>}`>;

type fieldWithBuilder = (field: string, func?: (builder: Adonis.Query) => void) => Adonis.Query;

type whereQueryBuilder = {
  where: functionQuery & allWhereQueryArguments;
  whereHas: fieldWithBuilder & allWhereQueryArguments;
} & Record<whereKeys<'' | 'in', true>, allWhereQueryArguments>
  & Record<whereKeys<'null', true>, (field: string) => Adonis.Query>
  & Record<whereKeys<'exists'>, functionQuery>
  & Record<whereKeys<'between'>, (field: string, valueTuple: [number, number]) => Adonis.Query>;

type functionJoinThis = Record<Uncapitalize<`${before}On`>, (fromFieldOn: string, joinFieldOn: string) => functionJoinThis>;

type joinTypes = {
  (joinTable: string, fromFieldOn: string, joinFieldOn: string): Adonis.Query;
  (func: (this: functionJoinThis) => void): Adonis.Query;
};

type joinQueryBuilder = {
  joinRaw(raw: string): Adonis.Query;
} & Record<Uncapitalize<`${'' | 'inner' | 'fullOuter' | 'cross'}Join`>, joinTypes>
  & Record<Uncapitalize<`${'' | 'left' | 'right'}${'' | 'Outer'}Join`>, joinTypes>;

type orderingAndLimitsQueryBuilder = {
  /** precisa ser depois de `groupBy` */
  having(field: string, comparisonOperator: string, value: unknown): Adonis.Query;
  groupByRaw(raw: string): Adonis.Query;
} & Record<'groupBy', (field: string) => Adonis.Query>
  & Record<'distinct', (field?: string) => Adonis.Query>
  & Record<'orderBy' | 'orderByRaw', (column: string, direction?: 'asc' | 'desc' = 'asc') => Adonis.Query>
  & Record<'offset' | 'limit', (value: number) => Adonis.Query>
  & Record<'forPage' | 'paginate', (page: number, limit?: number) => Promise<unknown>>;

type aggregateTypes = 'min' | 'max' | 'sum' | 'sumDistinct' | 'avg' | 'avgDistinct';

type aggregatesQueryBuilder = {
  count(): Promise<[{ [`count(*)`]: number; }]>;
  count<const TName extends string>(columnAsName: `${string} as ${TName}`): Promise<[Record<`count("${TName}")`, number>]>;
  count<const TCol extends string>(column: TCol): Promise<[Record<`count("${TCol}")`, number>]>;

  getCount(): Promise<number>;

  countDistinct(): Promise<[{ [`count(distinct *)`]: number; }]>;
  countDistinct<const TName extends string>(columnAsName: `${string} as ${TName}`): Promise<[Record<`count(distinct "${TName}")`, number>]>;
  countDistinct<const TCol extends string>(column: TCol): Promise<[Record<`count(distinct "${TCol}")`, number>]>;

  increment(column: string, value?: number = 1): Promise<unknown>;
  decrement(column: string, value?: number = 1): Promise<unknown>;
} & Record<aggregateTypes, {
  (column: string): Promise<[number]>,
  (columnAsName: `${string} as ${string}`): Promise<[number]>,
}>
  & Record<`get${Capitalize<aggregateTypes>}`, {
    (): Promise<number>,
    (column: string): Promise<number>,
  }>;

namespace Adonis {

  interface Query
    extends whereQueryBuilder,
    joinQueryBuilder,
    orderingAndLimitsQueryBuilder,
    aggregatesQueryBuilder,
    LucidQueryBuilderOriginal {
    whereRaw(rawQuery: string, values?: unknown[]): Adonis.Query;

    with: fieldWithBuilder;

    select(...selects: string[]): Adonis.Query;
    table(table: string): Adonis.Query;
    from(table: string): Adonis.Query;

    transacting(trx: Adonis.Trx): Adonis.Query;

    update: updateQueryArguments;
    insert(object: Record<string, unknown>): Promise<unknown> | {
      into(table: string): Promise<unknown>;
    };
    delete(): Promise<void>;
    del(): Promise<void>;

    /** clona a query até o ponto para poder usar em outro lugar */
    clone(): Adonis.Query;
    pluck(column: string): Adonis.Query | Promise<ModelQueryReturn>;

    first(): ModelQueryReturn & Promise<ModelQueryReturn>;

    fetch(): Promise<ModelQueryReturn> & Promise<Adonis.Query>;

    toJSON: () => unknown;
  }

  interface Model extends Omit<LucidModelOriginal, 'query'> {
    query: () => Adonis.Query;
  }
}

// import do model com typeof import model
function use(name: 'Model'): LucidModelOriginal;

// imports vindo do models (ex: para uso em repositories)
function use(name: `App/Models/${string}`): Adonis.Model;
