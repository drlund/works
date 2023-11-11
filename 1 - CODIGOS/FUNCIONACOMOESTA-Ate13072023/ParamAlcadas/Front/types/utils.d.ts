/**
 * Merge two types into one.
 * If they have the same key, it will merge their types.
 */
type Merge<A, B> = {
  [K in keyof A | keyof B]:
    K extends keyof A & keyof B
      ? A[K] | B[K]
      : K extends keyof B
        ? B[K]
        : K extends keyof A
          ? A[K]
          : never;
};


/**
 * Use for debbugging purposes only.
 * This lets you see nested types at the top level.
 *
 * So, when you have types inheriting from other types and intersections,
 * and don't know what's exactly being applied, you can use this to see
 * what's going on.
 */
type Debugfy<T> = T extends object ? {
  [K in keyof T]: Debugfy<T[K]>;
} & {} : T;
// type Debugfy<T> = {
//   [K in keyof T]: T[K];
// } & {};

/**
 * Return the type of the first parameter of a function.
 * If there's only one parameter, it will return that type.
 */
type GetProps<T extends Function> = Parameters<T>[0];

/**
 * Remove all falsy values from a type.
 */
type NonFalsy<T> = T extends false | 0 | "" | null | undefined | 0n ? never : T;

/**
 * Mark all types and nested types as optional.
 */
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/**
 * Extracts the types from an array. Returns never if the array is empty or if it's not an array.
 */
type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
