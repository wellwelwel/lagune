import type { LanguageId } from '../../types/hooks/regex.js';
import type { LineRule } from '../../types/scan.js';

const rule = (regex: RegExp, detail: string): LineRule => ({
  regex,
  detail,
});

const WEAK_CIPHER: Partial<Record<LanguageId, LineRule[]>> = {
  javascript: [
    rule(
      /\bcreate(?:Decipher|Cipher)\s{0,16}\(/i,
      'createCipher/createDecipher: deprecated and IV-less, use createCipheriv'
    ),
    rule(
      /[\'"`](?:des-ede3?(?:-cbc)?|des-(?:cbc|cfb|ofb)|des3|3des|rc4(?:-[a-z0-9-]{1,20})?|bf-(?:cbc|ecb|cfb|ofb))[\'"`]/i,
      'weak cipher algorithm (DES / 3DES / RC4 / Blowfish): use AES-GCM'
    ),
    rule(
      /[\'"`](?:aes(?:-\d{2,3})?|des(?:-ede3?)?|bf|rc2|camellia|seed)-ecb[\'"`]/i,
      'ECB cipher mode: leaks plaintext structure, use GCM or CBC'
    ),
    rule(
      /\bCryptoJS\.(?:DES|TripleDES|RC4|RC4Drop)\b/i,
      'weak CryptoJS cipher (DES / 3DES / RC4): use AES'
    ),
  ],
  python: [
    rule(
      /\b(?:DES3|DES|ARC4|ARC2|Blowfish)\.new\s{0,16}\(/i,
      'weak cipher primitive (DES / 3DES / RC4 / RC2 / Blowfish) constructed via pycryptodome .new(): use Crypto.Cipher.AES with MODE_GCM'
    ),
    rule(
      /from\s{1,8}Crypto\.Cipher\s{1,8}import\s{0,16}[^#\n]{0,120}\b(?:DES3|DES|ARC4|ARC2|Blowfish)\b/i,
      'importing a broken cipher (DES / 3DES / RC4 / RC2 / Blowfish) from Crypto.Cipher: use AES-GCM (from Crypto.Cipher import AES)'
    ),
    rule(
      /\balgorithms\.(?:TripleDES|Blowfish|ARC4)\b/i,
      'weak cipher algorithm (3DES / Blowfish / RC4) in cryptography hazmat: use algorithms.AES with modes.GCM'
    ),
    rule(
      /\bMODE_ECB\b|\bmodes\.ECB\s{0,16}\(/i,
      'ECB cipher mode: identical plaintext blocks leak as identical ciphertext, use an authenticated mode (GCM)'
    ),
  ],
  go: [
    rule(
      /\bdes\.New(?:TripleDESCipher|Cipher)\s{0,16}\(/i,
      'DES / 3DES cipher (des.NewCipher / des.NewTripleDESCipher): 56/64-bit blocks, broken (Sweet32), use AES-GCM via aes.NewCipher + cipher.NewGCM'
    ),
    rule(
      /\brc4\.NewCipher\s{0,16}\(/i,
      'RC4 stream cipher (rc4.NewCipher): keystream biases fully break it, use AES-GCM or ChaCha20-Poly1305'
    ),
    rule(
      /\bblowfish\.New(?:Salted)?Cipher\s{0,16}\(/i,
      'Blowfish cipher (blowfish.NewCipher / NewSaltedCipher): 64-bit block (Sweet32), use AES-GCM'
    ),
    rule(
      /\bNewECB(?:En|De)crypter\s{0,16}\(/i,
      'ECB cipher mode (NewECBEncrypter / NewECBDecrypter): identical plaintext blocks leak as identical ciphertext, use an authenticated mode via cipher.NewGCM'
    ),
  ],
  java: [
    rule(
      /["'](?:DESede|TripleDES|3DES|DES|ARCFOUR|ARC4|RC4|Blowfish|RC2)(?:\/[A-Za-z0-9]{1,20}){0,3}["']/i,
      'broken symmetric cipher (DES / 3DES / RC4 / Blowfish / RC2) named at a crypto call site: use AES/GCM'
    ),
    rule(
      /["'](?:AES|DESede|DES|Blowfish|Camellia|SEED|ARIA|RC2|TripleDES)\/ECB\b/i,
      'ECB cipher mode: identical plaintext blocks leak as identical ciphertext, use AES/GCM (or AES/CBC with an authenticated tag)'
    ),
  ],
  kotlin: [
    rule(
      /["'](?:(?:DESede|TripleDES|3DES|RC4|ARCFOUR|ARC4|Blowfish)(?:\/[A-Za-z0-9]{2,16}){0,3}|(?:DES|RC2)\/[A-Za-z0-9]{2,16}(?:\/[A-Za-z0-9]{2,16}){0,2})["']/i,
      'broken symmetric cipher named at a JCE call site (DES / 3DES-DESede / RC4-ARCFOUR / RC2 / Blowfish): use AES-GCM'
    ),
    rule(
      /["'](?:AES|DESede|TripleDES|3DES|DES|Blowfish|RC2|RC5|RC6|Camellia|SEED|ARIA|IDEA|CAST5|Twofish)\/ECB\b/i,
      'ECB cipher mode leaks plaintext structure regardless of the underlying block cipher: use AES-GCM (or CBC with a random IV)'
    ),
  ],
  php: [
    rule(
      /['"](?:des(?:-ede3?|3)(?:-(?:cbc|ecb|cfb\d{0,2}|ofb))?|des-(?:cbc|ecb|cfb\d{0,2}|ofb)|3des|rc4(?:-\d{1,3})?|rc2(?:-\d{1,3})?-(?:cbc|ecb|cfb|ofb)|bf-(?:cbc|ecb|cfb|ofb))['"]/i,
      'broken symmetric cipher at openssl_encrypt/decrypt (DES/3DES/RC4/RC2/Blowfish): use AES-256-GCM'
    ),
    rule(
      /['"](?:aes(?:-\d{2,3})?|des(?:-ede3?)?|bf|rc2|camellia(?:-\d{2,3})?|seed|aria(?:-\d{2,3})?|sm4)-ecb['"]/i,
      'ECB cipher mode: leaks plaintext structure regardless of the block cipher, use an authenticated mode such as AES-256-GCM'
    ),
    rule(
      /\bMCRYPT_(?:DES|3DES|TRIPLEDES|ARCFOUR|RC4|RC2|BLOWFISH(?:_COMPAT)?|MODE_ECB)\b/i,
      'broken cipher or ECB mode via the removed mcrypt extension (DES/3DES/RC4/RC2/Blowfish/ECB): migrate to openssl_encrypt with AES-256-GCM'
    ),
  ],
  ruby: [
    rule(
      /['"](?:des-(?:ede3?(?:-(?:cbc|ecb|cfb|ofb))?|cbc|ecb|cfb|ofb)|3des|des3|tripledes|rc4|arc4|bf-(?:cbc|ecb|cfb|ofb)|rc2-(?:cbc|ecb|cfb|ofb))['"]/i,
      'broken symmetric cipher named at OpenSSL::Cipher.new (DES / 3DES / RC4 / Blowfish / RC2): use AES-256-GCM'
    ),
    rule(
      /['"](?:aes(?:-\d{2,3})?|des(?:-ede3?)?|bf|rc2|camellia|seed|aria)-ecb['"]/i,
      'ECB cipher mode leaks plaintext block structure: use an authenticated mode such as AES-256-GCM'
    ),
    rule(
      /OpenSSL::Cipher::(?:TripleDES|DES3|DES|RC4|ARC4|Blowfish|BF|RC2)\b/i,
      'broken symmetric cipher class (DES / 3DES / RC4 / Blowfish / RC2): use OpenSSL::Cipher::AES with GCM'
    ),
    rule(
      /OpenSSL::Cipher::[A-Za-z0-9]{2,10}\.new\s{0,16}\([^)]{0,40}:ECB\b/i,
      'ECB cipher mode (:ECB) leaks plaintext block structure: use :GCM'
    ),
  ],
  rust: [
    rule(
      /\bRc4::|\brc4::(?:Rc4|Cipher)\b/i,
      'RC4 stream cipher (rc4 crate): keystream biases fully break it, use ChaCha20-Poly1305 or AES-GCM'
    ),
    rule(
      /\bBlowfish(?:LE)?::|\bblowfish::(?:Blowfish|BlowfishLE)\b/i,
      'Blowfish cipher (blowfish crate): 64-bit block (Sweet32), use AES-GCM'
    ),
    rule(
      /\bTdesEde3::|\bTdesEee3::|\bdes::(?:Des|TdesEde3|TdesEee3)\b/i,
      'DES/3DES cipher (des crate): broken (Sweet32), use AES-GCM'
    ),
    rule(
      /\bRc2::|\brc2::Rc2\b/i,
      'RC2 cipher (rc2 crate): broken, use AES-GCM'
    ),
    rule(
      /\becb::(?:Encryptor|Decryptor|\{)/i,
      'ECB block mode (ecb crate): leaks plaintext structure, use AES-GCM'
    ),
  ],
  csharp: [
    rule(
      /\b(?:TripleDES|DES|RC2)(?:\.Create\s{0,16}\(|CryptoServiceProvider\b)/i,
      'DES/TripleDES/RC2 is a broken or deprecated symmetric cipher: use AES-GCM (Aes.Create with AesGcm)'
    ),
    rule(
      /\.(?:Create|CreateFromName)\s{0,16}\(\s{0,16}["'](?:TripleDES|3DES|DESede|DES|RC2|RC4|ARC4|Blowfish)["']/i,
      'weak cipher named to a factory (DES/3DES/RC2/RC4/Blowfish): use AES-GCM'
    ),
    rule(
      /=\s{0,8}CipherMode\.ECB\b/i,
      'ECB cipher mode leaks plaintext structure: use an authenticated mode (AesGcm) or CBC with a MAC'
    ),
    rule(
      /\bnew\s{1,16}(?:RC4|ARC4|Blowfish|DesEde|Des|RC2)Engine\s{0,16}\(/i,
      'weak BouncyCastle cipher engine (RC4/Blowfish/DES/RC2): use AES-GCM'
    ),
    rule(
      /["'](?:AES|DESede|TripleDES|DES|RC2|RC4|Blowfish|Camellia|SEED)\/ECB\/[A-Za-z0-9]{2,16}["']/i,
      'ECB in a cipher transformation string: use an authenticated mode (GCM)'
    ),
  ],
  c: [
    rule(
      /\b(?:DES_[a-z0-9_]{0,30}(?:encrypt|decrypt|crypt|key(?:s)?|cksum|parity)|RC4(?:_[A-Za-z0-9_]{1,30})?|(?:RC2|BF)_(?:set_key|ecb_encrypt|cbc_encrypt|cfb64_encrypt|ofb64_encrypt|encrypt|decrypt|options))\s{0,16}\(/i,
      'low-level OpenSSL weak cipher (DES/3DES/RC4/Blowfish/RC2): use EVP_aes_256_gcm'
    ),
    rule(
      /\bEVP_(?:des|rc2|rc4|bf)[a-z0-9_]{0,30}\s{0,16}\(/i,
      'weak OpenSSL EVP cipher (DES/3DES/RC4/RC2/Blowfish): use EVP_aes_256_gcm'
    ),
    rule(
      /\b(?:EVP_[a-z0-9_]{2,20}_ecb|[A-Za-z0-9]{2,12}_ecb_encrypt)\s{0,16}\(/i,
      'ECB cipher mode: identical plaintext blocks leak as identical ciphertext, use an authenticated mode like EVP_aes_256_gcm'
    ),
  ],
  cpp: [
    rule(
      /\bEVP_(?:des(?:x)?|rc4|bf|rc2)(?:_[a-z0-9]{1,10}){0,4}\s{0,16}\(/i,
      'weak OpenSSL EVP cipher (DES / 3DES / RC4 / Blowfish / RC2): use EVP_aes_256_gcm'
    ),
    rule(
      /\b(?:RC4\s{0,16}\(|(?:DES|RC2|BF|RC4)_[a-z0-9_]{0,24}(?:crypt|key)\s{0,16}\()/i,
      'low-level OpenSSL weak cipher (DES / RC4 / Blowfish / RC2): use the EVP AES-GCM interface'
    ),
    rule(
      /\b(?:(?:CryptoPP|Weak)::){1,2}(?:DES(?:_EDE[23]|_XEX3)?|TripleDES|Blowfish|ARC4|RC2)\b|\b(?:DES(?:_EDE[23]|_XEX3)?|TripleDES|Blowfish|ARC4|RC2)::(?:Encryption|Decryption)\b/i,
      'weak Crypto++ cipher (DES / 3DES / ARC4 / Blowfish / RC2): use CryptoPP::AES with an AEAD mode'
    ),
    rule(
      /\bEVP_[a-z0-9_]{1,20}_ecb\s{0,16}\(|\bECB_Mode\s{0,16}</i,
      'ECB cipher mode: leaks plaintext structure, use GCM or CBC'
    ),
  ],
};

const WEAK_DIGEST: Partial<Record<LanguageId, LineRule[]>> = {
  javascript: [
    rule(
      /createHash\s{0,16}\(\s{0,16}[\'"`]md5[\'"`]/i,
      'MD5 digest (createHash): broken for security use (signature/token/password), fine only as a non-security checksum'
    ),
    rule(
      /createHash\s{0,16}\(\s{0,16}[\'"`]sha-?1[\'"`]/i,
      'SHA-1 digest (createHash): broken for security use (signature/token/password), fine only as a non-security checksum'
    ),
    rule(
      /\bcreateHmac\s{0,16}\(\s{0,16}[\'"`](?:md5|sha-?1)[\'"`]/i,
      'HMAC over a broken digest (MD5/SHA-1): use SHA-256 or better'
    ),
    rule(
      /\bcrypto\.hash\s{0,16}\(\s{0,16}[\'"`](?:md5|sha-?1)[\'"`]/i,
      'one-shot MD5/SHA-1 digest (crypto.hash): broken for security use'
    ),
    rule(
      /\b(?:crypto\.)?subtle\.digest\s{0,16}\(\s{0,16}[\'"`]SHA-1[\'"`]/i,
      'WebCrypto SHA-1 digest (subtle.digest): broken for security use (SubtleCrypto has no MD5)'
    ),
    rule(
      /\bCryptoJS\.(?:MD5|SHA1)\b/i,
      'weak CryptoJS digest (MD5 / SHA1): broken for security use'
    ),
  ],
  python: [
    rule(
      /\bhashlib\.(?:md5|sha1)\s{0,16}\(/i,
      'MD5/SHA-1 digest (hashlib): broken for security use (signature/token/password), fine only as a non-security checksum, otherwise use hashlib.sha256'
    ),
    rule(
      /\bhashlib\.new\s{0,16}\(\s{0,16}['"](?:md5|sha-?1)['"]/i,
      "MD5/SHA-1 digest (hashlib.new): broken for security use, fine only as a non-security checksum, otherwise use hashlib.new('sha256')"
    ),
    rule(
      /\bhmac\.new\s{0,16}\([^)]{0,200}(?:hashlib\.(?:md5|sha1)\b|digestmod\s{0,8}=\s{0,8}['"]?(?:md5|sha-?1)\b|['"](?:md5|sha-?1)['"])/i,
      'HMAC over a broken digest (MD5/SHA-1): use hmac.new(..., digestmod=hashlib.sha256) or stronger'
    ),
    rule(
      /from\s{1,8}Crypto\.Hash\s{1,8}import\s{0,16}[^#\n]{0,120}\b(?:MD5|SHA1)\b|\b(?:MD5|SHA1)\.new\s{0,16}\(/i,
      'MD5/SHA-1 digest via pycryptodome (Crypto.Hash): broken for security use, use SHA-256 or stronger'
    ),
    rule(
      /\bhashes\.(?:MD5|SHA1)\s{0,16}\(/i,
      'MD5/SHA-1 in cryptography hazmat (hashes.MD5 / hashes.SHA1): broken for security use, use hashes.SHA256'
    ),
  ],
  go: [
    rule(
      /\bmd5\.(?:New|Sum)\s{0,16}\(/i,
      'MD5 digest (md5.New / md5.Sum): broken for security use (signature/token/password), fine only as a non-security checksum, use sha256.New / sha256.Sum256'
    ),
    rule(
      /\bsha1\.(?:New|Sum)\s{0,16}\(/i,
      'SHA-1 digest (sha1.New / sha1.Sum): broken where collision or preimage resistance matters, fine only as a non-security checksum, use sha256.New / sha256.Sum256'
    ),
    rule(
      /\bhmac\.New\s{0,16}\(\s{0,16}(?:md5|sha1)\.New\b/i,
      'HMAC over a broken digest (hmac.New with md5.New / sha1.New): use hmac.New with sha256.New'
    ),
    rule(
      /\bcrypto\.(?:MD5|SHA1)\b/i,
      'MD5 / SHA-1 hash identifier (crypto.MD5 / crypto.SHA1), typically feeding a signature: broken for security use, use crypto.SHA256'
    ),
  ],
  java: [
    rule(
      /["'](?:MD5|MD4|MD2|SHA-?1)["']/i,
      'MD5/SHA-1 digest algorithm string: broken for security use (signature/token/password), fine only as a non-security checksum, use SHA-256 or better'
    ),
    rule(
      /["']Hmac(?:MD5|SHA-?1)["']/i,
      'HMAC over a broken digest (HmacMD5 / HmacSHA1): use HmacSHA256 or better'
    ),
    rule(
      /\bDigestUtils\.(?:md5|md4|md2|sha1)(?:Hex)?\s{0,16}\(/i,
      'Apache Commons DigestUtils MD5/SHA-1: broken for security use, use DigestUtils.sha256Hex or better'
    ),
    rule(
      /\bHashing\.(?:md5|sha1)\s{0,16}\(/i,
      'Guava Hashing.md5/sha1: broken for security use, use Hashing.sha256 or an HMAC'
    ),
  ],
  kotlin: [
    rule(
      /\.getInstance\s{0,16}\(\s{0,16}["'](?:MD5|SHA-?1)["']/i,
      'MD5 / SHA-1 message digest (MessageDigest.getInstance): broken for security use (signature/token/password), fine only as a non-security checksum, otherwise use SHA-256 or better'
    ),
    rule(
      /["']Hmac(?:MD5|SHA-?1)["']/i,
      'HMAC over a broken digest (HmacMD5 / HmacSHA1): use HmacSHA256 or better'
    ),
    rule(
      /["'](?:MD5|SHA-?1)with[A-Za-z0-9]{2,12}["']/i,
      'signature over a broken digest (MD5withRSA / SHA1withRSA / SHA1withECDSA): use SHA256withRSA/ECDSA or better'
    ),
  ],
  php: [
    rule(
      /\b(?:md5|sha1)(?:_file)?\s{0,16}\(/i,
      "MD5/SHA-1 digest (md5()/sha1()): broken for any security use (signature/token/password), fine only as a non-security checksum, otherwise use hash('sha256', ...) or password_hash()."
    ),
    rule(
      /\bhash(?:_hmac|_file|_pbkdf2)?\s{0,16}\(\s{0,16}['"](?:md5|sha1)['"]/i,
      "MD5/SHA-1 selected as the algorithm in hash()/hash_hmac()/hash_pbkdf2(): broken for security use, pass 'sha256' or stronger."
    ),
  ],
  ruby: [
    rule(
      /\bDigest::(?:MD5|SHA1)\b/i,
      'MD5/SHA-1 digest (Digest::MD5 / Digest::SHA1, incl. OpenSSL::Digest::): broken where collision or preimage resistance matters, fine only as a non-security checksum, use SHA-256 or better'
    ),
    rule(
      /OpenSSL::Digest(?:\.new)?\s{0,16}\(\s{0,16}['"](?:md5|sha-?1)['"]/i,
      'MD5/SHA-1 digest named at OpenSSL::Digest.new: broken for security use, fine only as a non-security checksum, use SHA-256 or better'
    ),
    rule(
      /OpenSSL::HMAC\.(?:new|digest|hexdigest|base64digest)\s{0,16}\([^)]{0,80}['"](?:md5|sha-?1)['"]/i,
      'HMAC over a broken digest (MD5/SHA-1) at OpenSSL::HMAC: use SHA-256 or better'
    ),
  ],
  rust: [
    rule(
      /\bMd5::\w|\bmd5::compute\b|\buse\s{1,8}md5\b/i,
      'MD5 digest (md5 crate): broken for security use (signature/token/password), fine only as a non-security checksum'
    ),
    rule(
      /\bSha1::\w|\buse\s{1,8}sha1\b/i,
      'SHA-1 digest (sha1 crate): broken for security use (signature/token/password), fine only as a non-security checksum'
    ),
    rule(
      /\bHmac\s{0,8}(?:::)?\s{0,8}<\s{0,8}(?:Md5|Sha1)\b/i,
      'HMAC over a broken digest (Hmac<Md5>/Hmac<Sha1>): use Hmac<Sha256> or better'
    ),
  ],
  csharp: [
    rule(
      /\b(?:MD5|SHA1)\.(?:Create|HashData|HashDataAsync|TryHashData)\s{0,16}\(/i,
      'MD5/SHA-1 digest: broken for security use (signature/token/password), fine only as a non-security checksum, otherwise use SHA-256 or better'
    ),
    rule(
      /\b(?:MD5|SHA1)(?:CryptoServiceProvider|Managed|Cng)\b/i,
      'MD5/SHA-1 provider (CryptoServiceProvider/Managed/Cng): broken for security use, use SHA-256 or better'
    ),
    rule(
      /\bHMAC(?:MD5|SHA1)\b/i,
      'HMAC over a broken digest (MD5/SHA-1): use HMACSHA256 or better'
    ),
    rule(
      /\.(?:Create|CreateFromName)\s{0,16}\(\s{0,16}["'](?:MD5|SHA-?1|HMACMD5|HMACSHA1)["']/i,
      'MD5/SHA-1 named to a hash factory: broken for security use, use SHA-256 or better'
    ),
  ],
  c: [
    rule(
      /\bMD5(?:_(?:Init|Update|Final))?\s{0,16}\(/i,
      'MD5 digest (OpenSSL MD5/MD5_Init): broken where collision or preimage resistance matters (signature/token/password), fine only as a non-security checksum, else use SHA-256'
    ),
    rule(
      /\bSHA1(?:_(?:Init|Update|Final))?\s{0,16}\(/i,
      'SHA-1 digest (OpenSSL SHA1/SHA1_Init): broken where collision or preimage resistance matters (signature/token/password), fine only as a non-security checksum, else use SHA-256'
    ),
    rule(
      /\bEVP_(?:md5|sha1)\s{0,16}\(/i,
      'EVP MD5/SHA-1 digest (EVP_md5/EVP_sha1, including when passed to HMAC): broken for security use, use EVP_sha256'
    ),
  ],
  cpp: [
    rule(
      /\bEVP_(?:md5|sha1)\s{0,16}\(/i,
      'MD5/SHA-1 digest (OpenSSL EVP): broken for security use (signature/token/password), fine only as a non-security checksum, use EVP_sha256'
    ),
    rule(
      /\b(?:MD5|SHA1)(?:_(?:Init|Update|Final))?\s{0,16}\(/i,
      'low-level MD5/SHA-1 digest (OpenSSL): broken for security use, fine only as a non-security checksum, use SHA-256 or better'
    ),
    rule(
      /\b(?:(?:CryptoPP|Weak)::){1,2}(?:MD5|SHA1)\b/i,
      'weak Crypto++ digest (MD5 / SHA1): broken for security use, fine only as a non-security checksum, use CryptoPP::SHA256'
    ),
  ],
};

const TIMING: Partial<Record<LanguageId, LineRule[]>> = {
  javascript: [
    rule(
      /(?:===?)\s{0,16}[^=]{0,40}\b(?:hmac|digest|mac|tag)\b|\b(?:hmac|digest|mac|tag)\b[^=]{0,40}(?:===?)/i,
      'timing-unsafe comparison of an hmac/digest/mac/tag: use crypto.timingSafeEqual'
    ),
  ],
  python: [
    rule(
      /(?:[=!]=)\s{0,16}[^=]{0,40}\b(?:hmac|hexdigest|digest)\b|\b(?:hmac|hexdigest|digest)\b[^=]{0,40}(?:[=!]=)/i,
      'timing-unsafe comparison of a MAC/HMAC/digest: use hmac.compare_digest (or secrets.compare_digest)'
    ),
  ],
  go: [
    rule(
      /\bbytes\.Equal\s{0,16}\([^)]{0,120}(?:hmac|mac|digest|signature)/i,
      'timing-unsafe comparison of a MAC/digest/signature (bytes.Equal returns early on the first differing byte): use hmac.Equal or subtle.ConstantTimeCompare'
    ),
    rule(
      /\w{0,24}(?:hmac|mac|digest)\s{0,16}[!=]=|[!=]=\s{0,16}\w{0,24}(?:hmac|mac|digest)\b/i,
      'timing-unsafe equality of a MAC/digest (== / !=): use hmac.Equal or subtle.ConstantTimeCompare'
    ),
  ],
  java: [
    rule(
      /\b(?:hmac|digest)\w{0,20}\s{0,4}\.equals\s{0,16}\(|\.equals\s{0,16}\([^)]{0,80}\b(?:hmac|digest)\b/i,
      'non-constant-time comparison of an HMAC/digest (String.equals / Arrays.equals) leaks via timing: use MessageDigest.isEqual'
    ),
  ],
  kotlin: [
    rule(
      /(?:==|!=)\s{0,16}[^=;{}]{0,40}\b(?:hmac|digest|mac)\b|\b(?:hmac|digest|mac)\b\s{0,16}[^=;{}]{0,40}(?:==|!=)/i,
      'timing-unsafe equality (== / !=) of a mac/hmac/digest: use MessageDigest.isEqual for a constant-time compare'
    ),
    rule(
      /\b(?:hmac|digest|mac)\b\s{0,16}\.\s{0,16}(?:contentEquals|equals)\s{0,16}\(|\b(?:contentEquals|equals|Arrays\.equals)\s{0,16}\([^)]{0,80}\b(?:hmac|digest|mac)\b/i,
      'timing-unsafe byte comparison (equals / contentEquals / Arrays.equals) of a mac/hmac/digest: use MessageDigest.isEqual'
    ),
  ],
  php: [
    rule(
      /(?:===?)\s{0,16}\$?(?:hmac|digest)\b|\b(?:hmac|digest)\b\s{0,16}={2,3}(?!=)(?!\s{0,16}(?:true|false|null)\b)/i,
      'timing-unsafe ==/=== comparison of an hmac/digest: use hash_equals()'
    ),
  ],
  ruby: [
    rule(
      /(?:==|!=)\s{0,16}[^=\n]{0,40}(?:hmac|digest)\b|(?:hmac|digest)\b[^=\n]{0,40}(?:==|!=)/i,
      'timing-unsafe == / != comparison of an hmac/digest: use Rack::Utils.secure_compare or OpenSSL.fixed_length_secure_compare'
    ),
  ],
  rust: [
    rule(
      /[!=]=\s{0,16}[^=&|;{}]{0,40}\b(?:hmac|digest|mac|tag)\b|\b(?:hmac|digest|mac|tag)\b[^=&|;{}]{0,40}[!=]=/i,
      'timing-unsafe == comparison of an hmac/digest/mac/tag, use subtle ct_eq (ConstantTimeEq) or Mac::verify_slice'
    ),
  ],
  csharp: [
    rule(
      /(?:==|!=)\s{0,16}[^=;]{0,40}\b(?:hmac|digest|mac|tag)\b|\b(?:hmac|digest|mac|tag)\b[^=!;]{0,40}(?:==|!=)/i,
      'timing-unsafe ==/!= comparison of an hmac/digest/mac/tag: use CryptographicOperations.FixedTimeEquals'
    ),
    rule(
      /\b(?:hmac|digest|mac|tag)\b[^;=]{0,40}\.SequenceEqual\s{0,16}\(|\.SequenceEqual\s{0,16}\(\s{0,16}[^)]{0,60}\b(?:hmac|digest|mac|tag)\b/i,
      'timing-unsafe SequenceEqual of an hmac/digest/mac/tag (short-circuits): use CryptographicOperations.FixedTimeEquals'
    ),
  ],
  c: [
    rule(
      /\b(?:memcmp|bcmp|strncmp|strcmp)\s{0,16}\([^;{]{0,160}(?:hmac|mac|digest|signature|tag)[^A-Za-z0-9]/i,
      'variable-time comparison (memcmp/strcmp) of a MAC/HMAC/digest/tag leaks the secret through timing, use a constant-time compare like CRYPTO_memcmp'
    ),
  ],
  cpp: [
    rule(
      /\b(?:std::)?memcmp\s{0,16}\([^;{}]{0,160}\b(?:hmac|digest|mac|tag)\b/i,
      'timing-unsafe memcmp of a MAC/HMAC/digest/tag: use OpenSSL CRYPTO_memcmp or Crypto++ VerifyBufsEqual'
    ),
    rule(
      /\b(?:hmac|digest)\b[^;=<>().]{0,40}[=!]=|[=!]=[^;=<>().]{0,40}\b(?:hmac|digest)\b/i,
      'timing-unsafe equality of an hmac/digest: use OpenSSL CRYPTO_memcmp or Crypto++ VerifyBufsEqual'
    ),
  ],
};

const INSECURE_PRNG: Partial<Record<LanguageId, RegExp>> = {
  javascript: /\bMath\.random\s{0,16}\(/i,
  python:
    /\brandom\.(?:random|randint|randrange|randbytes|getrandbits|choice|choices|sample|shuffle|uniform)\s{0,16}\(/i,
  go: /\brand\.(?:Intn|IntN|Int31n?|Int63n?|Int32|Int64|Uint32|Uint64|Float32|Float64|ExpFloat64|NormFloat64|Perm|Shuffle|Seed|NewSource|New)\s{0,16}\(/i,
  java: /\bMath\.random\s{0,16}\(|\bThreadLocalRandom\b|\bnew\s{1,8}(?:java\.util\.)?Random\s{0,16}\(/i,
  kotlin:
    /(?:\bMath\.random\s{0,16}\(|\bThreadLocalRandom\b|\bjava\.util\.Random\b|\bRandom\s{0,16}\(|\bRandom\.(?:next[A-Za-z]{1,16}|Default)\b)/i,
  php: /\b(?:mt_rand|rand|lcg_value|uniqid)\s{0,16}\(/i,
  ruby: /\brand\s{0,16}\(|\bRandom\.(?:new|rand)\b/i,
  rust: /\b(?:SmallRng|XorShiftRng)\b/i,
  csharp: /\bnew\s{1,16}(?:System\.)?Random\s{0,16}\(|\bRandom\.Shared\b/i,
  c: /\b(?:rand|random)\s{0,16}\(\s{0,16}\)/i,
  cpp: /\b(?:std::)?(?:rand|random)\s{0,16}\(\s{0,16}\)|\b(?:std::)?(?:mt19937(?:_64)?|minstd_rand0?|default_random_engine|ranlux(?:24|48)(?:_base)?|knuth_b)\b/i,
};

const CRYPTO_MARKER: Partial<Record<LanguageId, RegExp>> = {
  javascript:
    /\bcreate(?:Hash|Hmac|Cipher(?:iv)?|Decipher(?:iv)?|Sign|Verify)\b|\bMath\.random\s{0,16}\(|\brandom(?:Bytes|UUID|Int|Fill)\b|\bpbkdf2\b|\bscrypt\b|\bcrypto\.\w|\bCryptoJS\.\w|[\'"`](?:md5|sha-?1|des|rc4|blowfish|aes-\d)/i,
  python:
    /\bhashlib\.\w|\bhmac\.\w|\bsecrets\.\w|\bos\.urandom\b|\bCrypto\.\w|\b(?:AES|DES3?|ARC4|ChaCha20|Blowfish)\.new\b|\bcryptography\b|\bhazmat\b|\balgorithms\.\w|\bhashes\.\w|\bmodes\.\w|\bFernet\b|\brandom\.\w|\b(?:PBKDF2HMAC|PBKDF2|scrypt|Scrypt|bcrypt|argon2)\b|['"](?:md5|sha-?1|sha256|des|rc4|blowfish|aes)['"]/i,
  go: /\b(?:aes|des|rc4|blowfish|md5|sha1|sha256|sha512|sha3|hmac|cipher|rand|bcrypt|scrypt|pbkdf2|argon2|ed25519|ecdsa|ecdh|rsa|dsa|x509|subtle|chacha20|poly1305|nacl|salsa20)\.[A-Za-z]|\bcrypto\.[A-Za-z]|crypto\/(?:rand|aes|des|rc4|md5|sha1|sha256|sha512|cipher|hmac|tls|x509|subtle|ecdsa|ed25519|rsa)/i,
  java: /\b(?:Cipher|MessageDigest|Mac|Signature|KeyGenerator|KeyPairGenerator|KeyAgreement|KeyFactory|SecretKeyFactory)\s{0,16}\.\s{0,16}getInstance\b|\b(?:SecretKeySpec|IvParameterSpec|GCMParameterSpec|PBEKeySpec|SecureRandom|KeyStore|SSLContext|TrustManagerFactory|MessageDigest|Cipher)\b|\bjavax\.crypto\b|\bjava\.security\b|\bDigestUtils\.\w|\bHashing\.\w|\bMath\.random\s{0,16}\(|\bThreadLocalRandom\b|\bnew\s{1,8}(?:java\.util\.)?Random\s{0,16}\(/i,
  kotlin:
    /\b(?:javax\.crypto|java\.security|SecureRandom|MessageDigest|SecretKeySpec|IvParameterSpec|GCMParameterSpec|KeyGenerator|KeyPairGenerator|SecretKeyFactory|KeyAgreement|Signature\.getInstance|Mac\.getInstance|Cipher\.getInstance|Cipher\.ENCRYPT_MODE)\b/i,
  php: /\b(?:openssl_[a-z_]{2,40}\s{0,16}\(|mcrypt_[a-z_]{2,40}\s{0,16}\(|MCRYPT_[A-Z0-9_]{1,40}|hash(?:_hmac|_equals|_pbkdf2|_file)?\s{0,16}\(|md5\s{0,16}\(|sha1\s{0,16}\(|crypt\s{0,16}\(|password_(?:hash|verify)\s{0,16}\(|random_bytes\s{0,16}\(|random_int\s{0,16}\(|mt_rand\s{0,16}\(|lcg_value\s{0,16}\(|uniqid\s{0,16}\(|rand\s{0,16}\(|sodium_[a-z_]{2,40}\s{0,16}\()/i,
  ruby: /\b(?:OpenSSL|SecureRandom|HMAC|Digest|Cipher|hexdigest|secure_compare|Random)\b|\brand\s{0,16}\(/i,
  rust: /\b(?:Aes\d{2,3}\w{0,8}|ChaCha20\w{0,12}|XChaCha20\w{0,12}|chacha20poly1305|Salsa20|Sha(?:1|224|256|384|512|3)|Md[245]|Blake2\w{0,3}|Blake3|Hmac|SimpleHmac|Pbkdf2|Scrypt|Argon2\w{0,3}|Bcrypt|OsRng|thread_rng|SmallRng|XorShiftRng|StdRng|ChaCha\w{0,8}Rng|Rc4|Blowfish\w{0,2}|Rc2|Tdes\w{0,6}|RsaPrivateKey|RsaPublicKey|SigningKey|VerifyingKey|ct_eq|verify_slice)\b|\b(?:rand|rand_chacha|sha1|sha2|sha3|md5|hmac|des|rc4|rc2|ecb|cbc|ctr|ofb|cfb|gcm|blowfish|subtle|aead|aes|aes_gcm|ed25519\w{0,10}|p256|k256|x25519|argon2|pbkdf2|scrypt|ring|digest)::/i,
  csharp:
    /\bSystem\.Security\.Cryptography\b|\b(?:Aes|AesGcm|TripleDES|DES|RC2|RSA|ECDsa|ECDiffieHellman)\b|\b(?:MD5|SHA1|SHA256|SHA384|SHA512)\b|\bHMAC(?:MD5|SHA1|SHA256|SHA384|SHA512)\b|\bRandomNumberGenerator\b|\bCipherMode\.\w|\bCryptographicOperations\b|\bRfc2898DeriveBytes\b|\bProtectedData\b|\bCryptoServiceProvider\b|\bnew\s{1,16}(?:System\.)?Random\s{0,16}\(/i,
  c: /\b(?:EVP_[A-Za-z0-9_]{1,40}|(?:AES|DES|RC4|RC2|BF|MD5|SHA1|SHA224|SHA256|SHA384|SHA512|HMAC|CMAC|RSA|DSA|DH|EC|ECDSA|ECDH|BN|BIO|X509|SSL|TLS|DTLS|PEM|PKCS5|PKCS7|PKCS12|RAND|CRYPTO|ENGINE|OSSL)(?:_[A-Za-z0-9_]{1,40})?|getrandom|arc4random(?:_[a-z]{1,10})?|crypto_[a-z0-9_]{1,40}|sodium_[a-z0-9_]{1,40}|mbedtls_[a-z0-9_]{1,40})\b/i,
  cpp: /\b(?:EVP_[A-Za-z0-9_]{2,32}|(?:CryptoPP|Weak)::[A-Za-z0-9_]{2,32}|RAND_(?:bytes|priv_bytes)|CRYPTO_memcmp|VerifyBufsEqual|AutoSeededRandomPool|HMAC|SHA(?:1|224|256|384|512)?|MD5|AES|RSA|DES|RC4|Blowfish|getrandom|random_device|EncryptInit|DecryptInit|DigestInit)\b/i,
};

export const SUPPORTED_LANGUAGES: readonly LanguageId[] = Object.keys(
  CRYPTO_MARKER
) as LanguageId[];

export const isSupportedLanguage = (value: string): value is LanguageId =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

export const weakCipherRulesOf = (language: LanguageId): LineRule[] =>
  WEAK_CIPHER[language] ?? [];

export const weakDigestRulesOf = (language: LanguageId): LineRule[] =>
  WEAK_DIGEST[language] ?? [];

export const timingRulesOf = (language: LanguageId): LineRule[] =>
  TIMING[language] ?? [];

export const insecurePrngOf = (language: LanguageId): RegExp | null =>
  INSECURE_PRNG[language] ?? null;

export const cryptoMarkerOf = (language: LanguageId): RegExp | null =>
  CRYPTO_MARKER[language] ?? null;
