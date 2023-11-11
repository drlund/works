declare namespace Intl {
  interface ListFormatOptions {
    localeMatcher?: 'lookup' | 'best fit';
    type?: 'conjunction' | 'disjunction';
    style?: 'long' | 'short' | 'narrow';
  }

  class ListFormat {
    constructor(locale: string, options: ListFormatOptions);
    public format: (items?: string | string[]) => string;
  }
}
