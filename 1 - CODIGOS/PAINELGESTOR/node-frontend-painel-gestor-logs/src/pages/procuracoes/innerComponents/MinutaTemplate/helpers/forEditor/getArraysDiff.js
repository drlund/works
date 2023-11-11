import { createNormalizedKey } from '../others/createNormalizedKey';

/**
 * @param {string[]} arr1
 * @param {string[]} arr2
 * @param {boolean} [unique]
 */
export function getArraysDiff(arr1, arr2, unique = false) {
  const [arr1Unique, arr2Unique] = unique
    // @ts-ignore
    ? [[...new Set(arr1)], [...new Set(arr2)]]
    : [arr1, arr2];

  // reduce the items from first array
  const arr1Reduced = arr1Unique.reduce(
    /**
     * @param {{[key: string]: number}} acc
     * @param {string} key
     */
    (acc, key) => {
      if (acc[key]) {
        acc[key] += 1;
      } else {
        acc[key] = 1;
      }

      return acc;
    },
    {},
  );

  // then apply the same to second array
  const check = arr2Unique.reduce(
    /**
     * @param {{[key: string]: number}} acc
     * @param {string} key
     */
    (acc, key) => {
      const optionalKey = key.startsWith('?');
      if (optionalKey) {
        return acc;
      }
      const [ok] = createNormalizedKey(key);
      if (acc[ok] - 1 === 0) {
        Reflect.deleteProperty(acc, ok);
      } else {
        acc[ok] = (acc[ok] || 0) - 1;
      }
      return acc;
    },
    arr1Reduced,
  );

  return Object.entries(check).reduce((acc, [key, value]) => {
    if (value > 0) {
      acc.left.push(key);
    } else {
      acc.right.push(key);
    }

    return acc;
  }, /** @type {{left: string[], right:  string[]}} */({
    left: [],
    right: [],
  }));
}
