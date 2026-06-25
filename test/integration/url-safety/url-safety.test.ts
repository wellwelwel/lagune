import type { UrlSafetyVerdict } from '../../../src/types/hooks/url-safety.js';
import { describe, it, strict } from 'poku';
import { check } from '../../../src/hooks/url-safety/url-safety.js';

const expectAll = (verdict: UrlSafetyVerdict, inputs: string[]): void => {
  for (const input of inputs)
    it(`reads ${JSON.stringify(input)} as ${verdict}`, () => {
      strict.strictEqual(check(input), verdict);
    });
};

describe('a destination that connects to a public host is safe', () => {
  expectAll('safe', [
    'http://example.com/',
    'https://93.184.216.34/',
    'http://8.8.8.8./',
    'http://172.15.255.255/',
    'http://172.32.0.1/',
    'http://192.169.0.1/',
    'ftp://internal/',
  ]);
});

describe('a host that resolves to a private range is flagged regardless of how it is written', () => {
  expectAll('private-target', [
    'http://0x7f000001/',
    'http://2130706433/',
    'http://0177.0.0.1/',
    'http://127.1/',
    'http://127.0.1/',
    'http://0x7f.0.0.1/',
    'http://127.0x.0.1/',
  ]);
});

describe('a trailing dot does not hide a private target', () => {
  expectAll('private-target', [
    'http://127.0.0.1./',
    'http://0x7f000001./',
    'http://2130706433./',
    'http://169.254.169.254./',
    'http://10.0.0.1./',
  ]);
});

describe('a bare 0x part resolves to 0.0.0.0 and is flagged', () => {
  expectAll('private-target', [
    'http://0x/',
    'http://0x.0x.0x.0x/',
    'http://0.0.0.0/',
  ]);
});

describe('the cloud metadata endpoint is flagged in every shorthand form', () => {
  expectAll('private-target', [
    'http://169.254.169.254/',
    'http://169.254.43518/',
    'http://169.16689662/',
    'http://expected.com@169.254.169.254/',
  ]);
});

describe('shorthand whose last part is the low bits is resolved before classifying', () => {
  expectAll('private-target', ['http://192.168.256/', 'http://169.254.10.20/']);
});

describe('every private and reserved IPv4 range is internal', () => {
  expectAll('private-target', [
    'https://10.0.0.5:8080/x',
    'http://172.16.0.0/',
    'http://172.31.255.255/',
    'http://192.168.1.10/',
    'http://100.64.0.1/',
  ]);
});

describe('resolver-pinned loopback names are internal without any DNS', () => {
  expectAll('private-target', [
    'http://localhost/',
    'http://LOCALHOST/',
    'http://app.localhost/',
    'http://ip6-localhost/',
  ]);
});

describe('IPv6 loopback, unspecified, link-local, and unique-local are internal', () => {
  expectAll('private-target', [
    'http://[::1]/',
    'http://[0000:0000:0000:0000:0000:0000:0000:0001]/',
    'http://[::]/',
    'http://[fe80::1]/',
    'http://[feb0::1234]/',
    'http://[fc00::1]/',
    'http://[fd12:3456::1]/',
  ]);
});

describe('an embedded IPv4 inside an IPv6 form is classified by the IPv4', () => {
  expectAll('private-target', [
    'http://[::ffff:127.0.0.1]/',
    'http://[::ffff:7f00:1]/',
    'http://[::ffff:169.254.169.254]/',
    'http://[::ffff:10.0.0.5]/',
    'http://[::127.0.0.1]/',
    'http://[64:ff9b::7f00:1]/',
    'http://[2002:7f00:1::]/',
  ]);

  expectAll('safe', [
    'http://[2606:4700:4700::1111]/',
    'http://[::ffff:8.8.8.8]/',
    'http://[2002:0808:0808::]/',
  ]);
});

describe('a private connect host wins over a parser disagreement', () => {
  expectAll('private-target', [
    'http://expected.com@127.0.0.1/',
    'http://0x7f000001',
    '169.254.169.254',
  ]);
});

describe('a validator and the fetcher reading different real hosts is divergent', () => {
  expectAll('parser-divergent', [
    'http://allowed.com@evil.example/',
    'http://trusted.com@cdn.example.net/',
    'http://evil.com\\@expected.com/',
    'http://expected.com\\@127.0.0.1/',
    'http://expected.com\\@evil.com/',
  ]);
});

describe('userinfo that is a credential, not a host, does not diverge', () => {
  expectAll('safe', [
    'http://user:pass@example.com/',
    'http://api-key@api.stripe.com/v1/',
    'http://user:pass@93.184.216.34/',
    'http://user@real-host.com/@evil.com',
    'http://user:pass@real-host.com/',
  ]);
});

describe('an IDN host and its punycode are the same host, not a divergence', () => {
  expectAll('safe', ['http://бг.рф/']);
});

describe('a string with no fetchable host is invalid', () => {
  expectAll('invalid url', [
    'not a url',
    'file:///etc/passwd',
    'http://[fe80::1%eth0]/',
  ]);
});

describe('a scheme that the URL parser rejects is invalid, never salvaged into a wrong host', () => {
  expectAll('invalid url', [
    'http://[::ffff:1g]/',
    'http://256.1.1.1/',
    'http://08.0.0.1/',
    'http://1.0xffffffff/',
    'http://1.2.3.4.5/',
  ]);
});

describe('an opaque host the parser keeps verbatim is judged by its literal form', () => {
  expectAll('safe', ['http://127.0.0.1../']);
});
