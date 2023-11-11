import { jest } from '@jest/globals';

/**
 * @param {{
 *  formData?: Record<string, string | Blob>,
 *  entries?: import('./jest').JestFn<() => [string, string|Blob][]>,
 *  append?: import('./jest').JestFn<(name: string, value: string|Blob) => void>,
 * }} [props]
 */
export function mockFormData({
  formData = {},
  entries = jest.fn(),
  append = jest.fn(),
} = {}) {
  entries.mockImplementation(() => Object.entries(formData));
  append.mockImplementation((name, value) => {
    formData[name] = value;
  });

  // @ts-ignore
  globalThis.FormData = () => ({ entries, append, formData });

  return {
    formData, entries, append
  };
}
