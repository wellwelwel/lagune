export type UrlSafetyVerdict =
  | 'safe'
  | 'private-target'
  | 'parser-divergent'
  | 'invalid url';

export type AddressClass =
  | 'metadata'
  | 'unspecified'
  | 'loopback'
  | 'link-local'
  | 'private'
  | 'public'
  | 'invalid';

export type ExtractedHosts = {
  whatwgHost: string;
  naiveHosts: string[];
};

export type IPv4Range = {
  network: number;
  prefix: number;
  class: AddressClass;
};
