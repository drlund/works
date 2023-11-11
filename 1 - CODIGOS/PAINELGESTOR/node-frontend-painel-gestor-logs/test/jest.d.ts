import { jest } from '@jest/globals';

export declare type UnknownFunction = (...args: Array<unknown>) => unknown;
export declare type FunctionLike = (...args: any) => any;

export type JestFn<T extends FunctionLike = UnknownFunction> = ReturnType<typeof jest.fn<T>>;
