export function mockFormData({
  formData = {}, entries = jest.fn(), append = jest.fn(),
} = {}) {
  entries.mockImplementation(() => Object.entries(formData));
  append.mockImplementation((name, value) => {
    formData[name] = value;
  });
  globalThis.FormData = () => ({ entries, append, formData });

  return {
    formData, entries, append
  };
}
