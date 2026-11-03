#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: !0 });
};

// src/bin/index.ts
import process3 from "node:process";
import { fileURLToPath as fileURLToPath4 } from "node:url";

// src/core/collections.ts
var isStringArray = (value) => Array.isArray(value) && value.every((item) => typeof item == "string"), isRecord = (value) => typeof value == "object" && value !== null && !Array.isArray(value), readField = (payload, field) => isRecord(payload) ? payload[field] : void 0;
var joinNaturally = (values, conjunction) => values.length <= 1 ? values[0] ?? "" : values.length === 2 ? `${values[0]} ${conjunction} ${values[1]}` : `${values.slice(0, -1).join(", ")}, ${conjunction} ${values[values.length - 1]}`, oneOf = (values) => joinNaturally(values, "or"), allOf = (values) => joinNaturally(values, "and");

// src/core/configs.ts
import { join as join2 } from "node:path";

// src/core/fs-actions.ts
import {
  access,
  lstat,
  mkdir,
  readdir,
  realpath,
  rm,
  writeFile
} from "node:fs/promises";
import { basename, dirname, join, sep } from "node:path";
var hasErrorCode = (error, code) => error instanceof Error && error.code === code, isWithin = (root, path) => path === root || path.startsWith(`${root}${sep}`), realPathOf = (path) => realpath(path).catch(() => {
}), existingWithin = async (root, path) => {
  let [realRoot, realPath] = await Promise.all([
    realPathOf(root),
    realPathOf(path)
  ]);
  if (!(realRoot === void 0 || realPath === void 0))
    return isWithin(realRoot, realPath) ? realPath : void 0;
}, listingWithin = async (root, folder) => {
  let real = await existingWithin(root, folder);
  return real === void 0 ? [] : readdir(real).catch(() => []);
}, entryWithin = async (root, path) => {
  let folder = await existingWithin(root, dirname(path));
  return folder === void 0 ? void 0 : join(folder, basename(path));
}, fileWithin = async (root, path) => {
  let entry2 = await entryWithin(root, path);
  return entry2 === void 0 || (await lstat(entry2).catch(() => {
  }))?.isSymbolicLink() === !0 ? void 0 : entry2;
}, ensureDir = async (dir) => {
  await mkdir(dir, { recursive: !0 });
}, pathExists = async (path) => {
  try {
    return await access(path), !0;
  } catch {
    return !1;
  }
}, writeFileOverwrite = async (filePath, contents) => {
  await writeFile(filePath, contents, "utf8");
}, removeFileIfPresent = async (filePath) => {
  try {
    return await rm(filePath), "removed";
  } catch (error) {
    if (hasErrorCode(error, "ENOENT")) return "absent";
    throw error;
  }
}, removeEntryIfPresent = async (path) => {
  try {
    await lstat(path);
  } catch {
    return "absent";
  }
  return await rm(path, { recursive: !0, force: !0 }), "removed";
};

// src/core/json.ts
var parseJsonObject = (raw, file) => {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`${file} is not valid JSON: fix it, then run this again.`);
  }
  if (!isRecord(parsed))
    throw new Error(
      `${file} is not a JSON object: fix it, then run this again.`
    );
  return parsed;
};

// src/core/markdown/read.ts
import { readFile } from "node:fs/promises";

// node_modules/mdast-util-to-string/lib/index.js
var emptyOptions = {};
function toString(value, options) {
  let settings = options || emptyOptions, includeImageAlt = typeof settings.includeImageAlt == "boolean" ? settings.includeImageAlt : !0, includeHtml = typeof settings.includeHtml == "boolean" ? settings.includeHtml : !0;
  return one(value, includeImageAlt, includeHtml);
}
function one(value, includeImageAlt, includeHtml) {
  if (node(value)) {
    if ("value" in value)
      return value.type === "html" && !includeHtml ? "" : value.value;
    if (includeImageAlt && "alt" in value && value.alt)
      return value.alt;
    if ("children" in value)
      return all(value.children, includeImageAlt, includeHtml);
  }
  return Array.isArray(value) ? all(value, includeImageAlt, includeHtml) : "";
}
function all(values, includeImageAlt, includeHtml) {
  let result = [], index2 = -1;
  for (; ++index2 < values.length; )
    result[index2] = one(values[index2], includeImageAlt, includeHtml);
  return result.join("");
}
function node(value) {
  return !!(value && typeof value == "object");
}

// node_modules/character-entities/index.js
var characterEntities = {
  AElig: "\xC6",
  AMP: "&",
  Aacute: "\xC1",
  Abreve: "\u0102",
  Acirc: "\xC2",
  Acy: "\u0410",
  Afr: "\u{1D504}",
  Agrave: "\xC0",
  Alpha: "\u0391",
  Amacr: "\u0100",
  And: "\u2A53",
  Aogon: "\u0104",
  Aopf: "\u{1D538}",
  ApplyFunction: "\u2061",
  Aring: "\xC5",
  Ascr: "\u{1D49C}",
  Assign: "\u2254",
  Atilde: "\xC3",
  Auml: "\xC4",
  Backslash: "\u2216",
  Barv: "\u2AE7",
  Barwed: "\u2306",
  Bcy: "\u0411",
  Because: "\u2235",
  Bernoullis: "\u212C",
  Beta: "\u0392",
  Bfr: "\u{1D505}",
  Bopf: "\u{1D539}",
  Breve: "\u02D8",
  Bscr: "\u212C",
  Bumpeq: "\u224E",
  CHcy: "\u0427",
  COPY: "\xA9",
  Cacute: "\u0106",
  Cap: "\u22D2",
  CapitalDifferentialD: "\u2145",
  Cayleys: "\u212D",
  Ccaron: "\u010C",
  Ccedil: "\xC7",
  Ccirc: "\u0108",
  Cconint: "\u2230",
  Cdot: "\u010A",
  Cedilla: "\xB8",
  CenterDot: "\xB7",
  Cfr: "\u212D",
  Chi: "\u03A7",
  CircleDot: "\u2299",
  CircleMinus: "\u2296",
  CirclePlus: "\u2295",
  CircleTimes: "\u2297",
  ClockwiseContourIntegral: "\u2232",
  CloseCurlyDoubleQuote: "\u201D",
  CloseCurlyQuote: "\u2019",
  Colon: "\u2237",
  Colone: "\u2A74",
  Congruent: "\u2261",
  Conint: "\u222F",
  ContourIntegral: "\u222E",
  Copf: "\u2102",
  Coproduct: "\u2210",
  CounterClockwiseContourIntegral: "\u2233",
  Cross: "\u2A2F",
  Cscr: "\u{1D49E}",
  Cup: "\u22D3",
  CupCap: "\u224D",
  DD: "\u2145",
  DDotrahd: "\u2911",
  DJcy: "\u0402",
  DScy: "\u0405",
  DZcy: "\u040F",
  Dagger: "\u2021",
  Darr: "\u21A1",
  Dashv: "\u2AE4",
  Dcaron: "\u010E",
  Dcy: "\u0414",
  Del: "\u2207",
  Delta: "\u0394",
  Dfr: "\u{1D507}",
  DiacriticalAcute: "\xB4",
  DiacriticalDot: "\u02D9",
  DiacriticalDoubleAcute: "\u02DD",
  DiacriticalGrave: "`",
  DiacriticalTilde: "\u02DC",
  Diamond: "\u22C4",
  DifferentialD: "\u2146",
  Dopf: "\u{1D53B}",
  Dot: "\xA8",
  DotDot: "\u20DC",
  DotEqual: "\u2250",
  DoubleContourIntegral: "\u222F",
  DoubleDot: "\xA8",
  DoubleDownArrow: "\u21D3",
  DoubleLeftArrow: "\u21D0",
  DoubleLeftRightArrow: "\u21D4",
  DoubleLeftTee: "\u2AE4",
  DoubleLongLeftArrow: "\u27F8",
  DoubleLongLeftRightArrow: "\u27FA",
  DoubleLongRightArrow: "\u27F9",
  DoubleRightArrow: "\u21D2",
  DoubleRightTee: "\u22A8",
  DoubleUpArrow: "\u21D1",
  DoubleUpDownArrow: "\u21D5",
  DoubleVerticalBar: "\u2225",
  DownArrow: "\u2193",
  DownArrowBar: "\u2913",
  DownArrowUpArrow: "\u21F5",
  DownBreve: "\u0311",
  DownLeftRightVector: "\u2950",
  DownLeftTeeVector: "\u295E",
  DownLeftVector: "\u21BD",
  DownLeftVectorBar: "\u2956",
  DownRightTeeVector: "\u295F",
  DownRightVector: "\u21C1",
  DownRightVectorBar: "\u2957",
  DownTee: "\u22A4",
  DownTeeArrow: "\u21A7",
  Downarrow: "\u21D3",
  Dscr: "\u{1D49F}",
  Dstrok: "\u0110",
  ENG: "\u014A",
  ETH: "\xD0",
  Eacute: "\xC9",
  Ecaron: "\u011A",
  Ecirc: "\xCA",
  Ecy: "\u042D",
  Edot: "\u0116",
  Efr: "\u{1D508}",
  Egrave: "\xC8",
  Element: "\u2208",
  Emacr: "\u0112",
  EmptySmallSquare: "\u25FB",
  EmptyVerySmallSquare: "\u25AB",
  Eogon: "\u0118",
  Eopf: "\u{1D53C}",
  Epsilon: "\u0395",
  Equal: "\u2A75",
  EqualTilde: "\u2242",
  Equilibrium: "\u21CC",
  Escr: "\u2130",
  Esim: "\u2A73",
  Eta: "\u0397",
  Euml: "\xCB",
  Exists: "\u2203",
  ExponentialE: "\u2147",
  Fcy: "\u0424",
  Ffr: "\u{1D509}",
  FilledSmallSquare: "\u25FC",
  FilledVerySmallSquare: "\u25AA",
  Fopf: "\u{1D53D}",
  ForAll: "\u2200",
  Fouriertrf: "\u2131",
  Fscr: "\u2131",
  GJcy: "\u0403",
  GT: ">",
  Gamma: "\u0393",
  Gammad: "\u03DC",
  Gbreve: "\u011E",
  Gcedil: "\u0122",
  Gcirc: "\u011C",
  Gcy: "\u0413",
  Gdot: "\u0120",
  Gfr: "\u{1D50A}",
  Gg: "\u22D9",
  Gopf: "\u{1D53E}",
  GreaterEqual: "\u2265",
  GreaterEqualLess: "\u22DB",
  GreaterFullEqual: "\u2267",
  GreaterGreater: "\u2AA2",
  GreaterLess: "\u2277",
  GreaterSlantEqual: "\u2A7E",
  GreaterTilde: "\u2273",
  Gscr: "\u{1D4A2}",
  Gt: "\u226B",
  HARDcy: "\u042A",
  Hacek: "\u02C7",
  Hat: "^",
  Hcirc: "\u0124",
  Hfr: "\u210C",
  HilbertSpace: "\u210B",
  Hopf: "\u210D",
  HorizontalLine: "\u2500",
  Hscr: "\u210B",
  Hstrok: "\u0126",
  HumpDownHump: "\u224E",
  HumpEqual: "\u224F",
  IEcy: "\u0415",
  IJlig: "\u0132",
  IOcy: "\u0401",
  Iacute: "\xCD",
  Icirc: "\xCE",
  Icy: "\u0418",
  Idot: "\u0130",
  Ifr: "\u2111",
  Igrave: "\xCC",
  Im: "\u2111",
  Imacr: "\u012A",
  ImaginaryI: "\u2148",
  Implies: "\u21D2",
  Int: "\u222C",
  Integral: "\u222B",
  Intersection: "\u22C2",
  InvisibleComma: "\u2063",
  InvisibleTimes: "\u2062",
  Iogon: "\u012E",
  Iopf: "\u{1D540}",
  Iota: "\u0399",
  Iscr: "\u2110",
  Itilde: "\u0128",
  Iukcy: "\u0406",
  Iuml: "\xCF",
  Jcirc: "\u0134",
  Jcy: "\u0419",
  Jfr: "\u{1D50D}",
  Jopf: "\u{1D541}",
  Jscr: "\u{1D4A5}",
  Jsercy: "\u0408",
  Jukcy: "\u0404",
  KHcy: "\u0425",
  KJcy: "\u040C",
  Kappa: "\u039A",
  Kcedil: "\u0136",
  Kcy: "\u041A",
  Kfr: "\u{1D50E}",
  Kopf: "\u{1D542}",
  Kscr: "\u{1D4A6}",
  LJcy: "\u0409",
  LT: "<",
  Lacute: "\u0139",
  Lambda: "\u039B",
  Lang: "\u27EA",
  Laplacetrf: "\u2112",
  Larr: "\u219E",
  Lcaron: "\u013D",
  Lcedil: "\u013B",
  Lcy: "\u041B",
  LeftAngleBracket: "\u27E8",
  LeftArrow: "\u2190",
  LeftArrowBar: "\u21E4",
  LeftArrowRightArrow: "\u21C6",
  LeftCeiling: "\u2308",
  LeftDoubleBracket: "\u27E6",
  LeftDownTeeVector: "\u2961",
  LeftDownVector: "\u21C3",
  LeftDownVectorBar: "\u2959",
  LeftFloor: "\u230A",
  LeftRightArrow: "\u2194",
  LeftRightVector: "\u294E",
  LeftTee: "\u22A3",
  LeftTeeArrow: "\u21A4",
  LeftTeeVector: "\u295A",
  LeftTriangle: "\u22B2",
  LeftTriangleBar: "\u29CF",
  LeftTriangleEqual: "\u22B4",
  LeftUpDownVector: "\u2951",
  LeftUpTeeVector: "\u2960",
  LeftUpVector: "\u21BF",
  LeftUpVectorBar: "\u2958",
  LeftVector: "\u21BC",
  LeftVectorBar: "\u2952",
  Leftarrow: "\u21D0",
  Leftrightarrow: "\u21D4",
  LessEqualGreater: "\u22DA",
  LessFullEqual: "\u2266",
  LessGreater: "\u2276",
  LessLess: "\u2AA1",
  LessSlantEqual: "\u2A7D",
  LessTilde: "\u2272",
  Lfr: "\u{1D50F}",
  Ll: "\u22D8",
  Lleftarrow: "\u21DA",
  Lmidot: "\u013F",
  LongLeftArrow: "\u27F5",
  LongLeftRightArrow: "\u27F7",
  LongRightArrow: "\u27F6",
  Longleftarrow: "\u27F8",
  Longleftrightarrow: "\u27FA",
  Longrightarrow: "\u27F9",
  Lopf: "\u{1D543}",
  LowerLeftArrow: "\u2199",
  LowerRightArrow: "\u2198",
  Lscr: "\u2112",
  Lsh: "\u21B0",
  Lstrok: "\u0141",
  Lt: "\u226A",
  Map: "\u2905",
  Mcy: "\u041C",
  MediumSpace: "\u205F",
  Mellintrf: "\u2133",
  Mfr: "\u{1D510}",
  MinusPlus: "\u2213",
  Mopf: "\u{1D544}",
  Mscr: "\u2133",
  Mu: "\u039C",
  NJcy: "\u040A",
  Nacute: "\u0143",
  Ncaron: "\u0147",
  Ncedil: "\u0145",
  Ncy: "\u041D",
  NegativeMediumSpace: "\u200B",
  NegativeThickSpace: "\u200B",
  NegativeThinSpace: "\u200B",
  NegativeVeryThinSpace: "\u200B",
  NestedGreaterGreater: "\u226B",
  NestedLessLess: "\u226A",
  NewLine: `
`,
  Nfr: "\u{1D511}",
  NoBreak: "\u2060",
  NonBreakingSpace: "\xA0",
  Nopf: "\u2115",
  Not: "\u2AEC",
  NotCongruent: "\u2262",
  NotCupCap: "\u226D",
  NotDoubleVerticalBar: "\u2226",
  NotElement: "\u2209",
  NotEqual: "\u2260",
  NotEqualTilde: "\u2242\u0338",
  NotExists: "\u2204",
  NotGreater: "\u226F",
  NotGreaterEqual: "\u2271",
  NotGreaterFullEqual: "\u2267\u0338",
  NotGreaterGreater: "\u226B\u0338",
  NotGreaterLess: "\u2279",
  NotGreaterSlantEqual: "\u2A7E\u0338",
  NotGreaterTilde: "\u2275",
  NotHumpDownHump: "\u224E\u0338",
  NotHumpEqual: "\u224F\u0338",
  NotLeftTriangle: "\u22EA",
  NotLeftTriangleBar: "\u29CF\u0338",
  NotLeftTriangleEqual: "\u22EC",
  NotLess: "\u226E",
  NotLessEqual: "\u2270",
  NotLessGreater: "\u2278",
  NotLessLess: "\u226A\u0338",
  NotLessSlantEqual: "\u2A7D\u0338",
  NotLessTilde: "\u2274",
  NotNestedGreaterGreater: "\u2AA2\u0338",
  NotNestedLessLess: "\u2AA1\u0338",
  NotPrecedes: "\u2280",
  NotPrecedesEqual: "\u2AAF\u0338",
  NotPrecedesSlantEqual: "\u22E0",
  NotReverseElement: "\u220C",
  NotRightTriangle: "\u22EB",
  NotRightTriangleBar: "\u29D0\u0338",
  NotRightTriangleEqual: "\u22ED",
  NotSquareSubset: "\u228F\u0338",
  NotSquareSubsetEqual: "\u22E2",
  NotSquareSuperset: "\u2290\u0338",
  NotSquareSupersetEqual: "\u22E3",
  NotSubset: "\u2282\u20D2",
  NotSubsetEqual: "\u2288",
  NotSucceeds: "\u2281",
  NotSucceedsEqual: "\u2AB0\u0338",
  NotSucceedsSlantEqual: "\u22E1",
  NotSucceedsTilde: "\u227F\u0338",
  NotSuperset: "\u2283\u20D2",
  NotSupersetEqual: "\u2289",
  NotTilde: "\u2241",
  NotTildeEqual: "\u2244",
  NotTildeFullEqual: "\u2247",
  NotTildeTilde: "\u2249",
  NotVerticalBar: "\u2224",
  Nscr: "\u{1D4A9}",
  Ntilde: "\xD1",
  Nu: "\u039D",
  OElig: "\u0152",
  Oacute: "\xD3",
  Ocirc: "\xD4",
  Ocy: "\u041E",
  Odblac: "\u0150",
  Ofr: "\u{1D512}",
  Ograve: "\xD2",
  Omacr: "\u014C",
  Omega: "\u03A9",
  Omicron: "\u039F",
  Oopf: "\u{1D546}",
  OpenCurlyDoubleQuote: "\u201C",
  OpenCurlyQuote: "\u2018",
  Or: "\u2A54",
  Oscr: "\u{1D4AA}",
  Oslash: "\xD8",
  Otilde: "\xD5",
  Otimes: "\u2A37",
  Ouml: "\xD6",
  OverBar: "\u203E",
  OverBrace: "\u23DE",
  OverBracket: "\u23B4",
  OverParenthesis: "\u23DC",
  PartialD: "\u2202",
  Pcy: "\u041F",
  Pfr: "\u{1D513}",
  Phi: "\u03A6",
  Pi: "\u03A0",
  PlusMinus: "\xB1",
  Poincareplane: "\u210C",
  Popf: "\u2119",
  Pr: "\u2ABB",
  Precedes: "\u227A",
  PrecedesEqual: "\u2AAF",
  PrecedesSlantEqual: "\u227C",
  PrecedesTilde: "\u227E",
  Prime: "\u2033",
  Product: "\u220F",
  Proportion: "\u2237",
  Proportional: "\u221D",
  Pscr: "\u{1D4AB}",
  Psi: "\u03A8",
  QUOT: '"',
  Qfr: "\u{1D514}",
  Qopf: "\u211A",
  Qscr: "\u{1D4AC}",
  RBarr: "\u2910",
  REG: "\xAE",
  Racute: "\u0154",
  Rang: "\u27EB",
  Rarr: "\u21A0",
  Rarrtl: "\u2916",
  Rcaron: "\u0158",
  Rcedil: "\u0156",
  Rcy: "\u0420",
  Re: "\u211C",
  ReverseElement: "\u220B",
  ReverseEquilibrium: "\u21CB",
  ReverseUpEquilibrium: "\u296F",
  Rfr: "\u211C",
  Rho: "\u03A1",
  RightAngleBracket: "\u27E9",
  RightArrow: "\u2192",
  RightArrowBar: "\u21E5",
  RightArrowLeftArrow: "\u21C4",
  RightCeiling: "\u2309",
  RightDoubleBracket: "\u27E7",
  RightDownTeeVector: "\u295D",
  RightDownVector: "\u21C2",
  RightDownVectorBar: "\u2955",
  RightFloor: "\u230B",
  RightTee: "\u22A2",
  RightTeeArrow: "\u21A6",
  RightTeeVector: "\u295B",
  RightTriangle: "\u22B3",
  RightTriangleBar: "\u29D0",
  RightTriangleEqual: "\u22B5",
  RightUpDownVector: "\u294F",
  RightUpTeeVector: "\u295C",
  RightUpVector: "\u21BE",
  RightUpVectorBar: "\u2954",
  RightVector: "\u21C0",
  RightVectorBar: "\u2953",
  Rightarrow: "\u21D2",
  Ropf: "\u211D",
  RoundImplies: "\u2970",
  Rrightarrow: "\u21DB",
  Rscr: "\u211B",
  Rsh: "\u21B1",
  RuleDelayed: "\u29F4",
  SHCHcy: "\u0429",
  SHcy: "\u0428",
  SOFTcy: "\u042C",
  Sacute: "\u015A",
  Sc: "\u2ABC",
  Scaron: "\u0160",
  Scedil: "\u015E",
  Scirc: "\u015C",
  Scy: "\u0421",
  Sfr: "\u{1D516}",
  ShortDownArrow: "\u2193",
  ShortLeftArrow: "\u2190",
  ShortRightArrow: "\u2192",
  ShortUpArrow: "\u2191",
  Sigma: "\u03A3",
  SmallCircle: "\u2218",
  Sopf: "\u{1D54A}",
  Sqrt: "\u221A",
  Square: "\u25A1",
  SquareIntersection: "\u2293",
  SquareSubset: "\u228F",
  SquareSubsetEqual: "\u2291",
  SquareSuperset: "\u2290",
  SquareSupersetEqual: "\u2292",
  SquareUnion: "\u2294",
  Sscr: "\u{1D4AE}",
  Star: "\u22C6",
  Sub: "\u22D0",
  Subset: "\u22D0",
  SubsetEqual: "\u2286",
  Succeeds: "\u227B",
  SucceedsEqual: "\u2AB0",
  SucceedsSlantEqual: "\u227D",
  SucceedsTilde: "\u227F",
  SuchThat: "\u220B",
  Sum: "\u2211",
  Sup: "\u22D1",
  Superset: "\u2283",
  SupersetEqual: "\u2287",
  Supset: "\u22D1",
  THORN: "\xDE",
  TRADE: "\u2122",
  TSHcy: "\u040B",
  TScy: "\u0426",
  Tab: "	",
  Tau: "\u03A4",
  Tcaron: "\u0164",
  Tcedil: "\u0162",
  Tcy: "\u0422",
  Tfr: "\u{1D517}",
  Therefore: "\u2234",
  Theta: "\u0398",
  ThickSpace: "\u205F\u200A",
  ThinSpace: "\u2009",
  Tilde: "\u223C",
  TildeEqual: "\u2243",
  TildeFullEqual: "\u2245",
  TildeTilde: "\u2248",
  Topf: "\u{1D54B}",
  TripleDot: "\u20DB",
  Tscr: "\u{1D4AF}",
  Tstrok: "\u0166",
  Uacute: "\xDA",
  Uarr: "\u219F",
  Uarrocir: "\u2949",
  Ubrcy: "\u040E",
  Ubreve: "\u016C",
  Ucirc: "\xDB",
  Ucy: "\u0423",
  Udblac: "\u0170",
  Ufr: "\u{1D518}",
  Ugrave: "\xD9",
  Umacr: "\u016A",
  UnderBar: "_",
  UnderBrace: "\u23DF",
  UnderBracket: "\u23B5",
  UnderParenthesis: "\u23DD",
  Union: "\u22C3",
  UnionPlus: "\u228E",
  Uogon: "\u0172",
  Uopf: "\u{1D54C}",
  UpArrow: "\u2191",
  UpArrowBar: "\u2912",
  UpArrowDownArrow: "\u21C5",
  UpDownArrow: "\u2195",
  UpEquilibrium: "\u296E",
  UpTee: "\u22A5",
  UpTeeArrow: "\u21A5",
  Uparrow: "\u21D1",
  Updownarrow: "\u21D5",
  UpperLeftArrow: "\u2196",
  UpperRightArrow: "\u2197",
  Upsi: "\u03D2",
  Upsilon: "\u03A5",
  Uring: "\u016E",
  Uscr: "\u{1D4B0}",
  Utilde: "\u0168",
  Uuml: "\xDC",
  VDash: "\u22AB",
  Vbar: "\u2AEB",
  Vcy: "\u0412",
  Vdash: "\u22A9",
  Vdashl: "\u2AE6",
  Vee: "\u22C1",
  Verbar: "\u2016",
  Vert: "\u2016",
  VerticalBar: "\u2223",
  VerticalLine: "|",
  VerticalSeparator: "\u2758",
  VerticalTilde: "\u2240",
  VeryThinSpace: "\u200A",
  Vfr: "\u{1D519}",
  Vopf: "\u{1D54D}",
  Vscr: "\u{1D4B1}",
  Vvdash: "\u22AA",
  Wcirc: "\u0174",
  Wedge: "\u22C0",
  Wfr: "\u{1D51A}",
  Wopf: "\u{1D54E}",
  Wscr: "\u{1D4B2}",
  Xfr: "\u{1D51B}",
  Xi: "\u039E",
  Xopf: "\u{1D54F}",
  Xscr: "\u{1D4B3}",
  YAcy: "\u042F",
  YIcy: "\u0407",
  YUcy: "\u042E",
  Yacute: "\xDD",
  Ycirc: "\u0176",
  Ycy: "\u042B",
  Yfr: "\u{1D51C}",
  Yopf: "\u{1D550}",
  Yscr: "\u{1D4B4}",
  Yuml: "\u0178",
  ZHcy: "\u0416",
  Zacute: "\u0179",
  Zcaron: "\u017D",
  Zcy: "\u0417",
  Zdot: "\u017B",
  ZeroWidthSpace: "\u200B",
  Zeta: "\u0396",
  Zfr: "\u2128",
  Zopf: "\u2124",
  Zscr: "\u{1D4B5}",
  aacute: "\xE1",
  abreve: "\u0103",
  ac: "\u223E",
  acE: "\u223E\u0333",
  acd: "\u223F",
  acirc: "\xE2",
  acute: "\xB4",
  acy: "\u0430",
  aelig: "\xE6",
  af: "\u2061",
  afr: "\u{1D51E}",
  agrave: "\xE0",
  alefsym: "\u2135",
  aleph: "\u2135",
  alpha: "\u03B1",
  amacr: "\u0101",
  amalg: "\u2A3F",
  amp: "&",
  and: "\u2227",
  andand: "\u2A55",
  andd: "\u2A5C",
  andslope: "\u2A58",
  andv: "\u2A5A",
  ang: "\u2220",
  ange: "\u29A4",
  angle: "\u2220",
  angmsd: "\u2221",
  angmsdaa: "\u29A8",
  angmsdab: "\u29A9",
  angmsdac: "\u29AA",
  angmsdad: "\u29AB",
  angmsdae: "\u29AC",
  angmsdaf: "\u29AD",
  angmsdag: "\u29AE",
  angmsdah: "\u29AF",
  angrt: "\u221F",
  angrtvb: "\u22BE",
  angrtvbd: "\u299D",
  angsph: "\u2222",
  angst: "\xC5",
  angzarr: "\u237C",
  aogon: "\u0105",
  aopf: "\u{1D552}",
  ap: "\u2248",
  apE: "\u2A70",
  apacir: "\u2A6F",
  ape: "\u224A",
  apid: "\u224B",
  apos: "'",
  approx: "\u2248",
  approxeq: "\u224A",
  aring: "\xE5",
  ascr: "\u{1D4B6}",
  ast: "*",
  asymp: "\u2248",
  asympeq: "\u224D",
  atilde: "\xE3",
  auml: "\xE4",
  awconint: "\u2233",
  awint: "\u2A11",
  bNot: "\u2AED",
  backcong: "\u224C",
  backepsilon: "\u03F6",
  backprime: "\u2035",
  backsim: "\u223D",
  backsimeq: "\u22CD",
  barvee: "\u22BD",
  barwed: "\u2305",
  barwedge: "\u2305",
  bbrk: "\u23B5",
  bbrktbrk: "\u23B6",
  bcong: "\u224C",
  bcy: "\u0431",
  bdquo: "\u201E",
  becaus: "\u2235",
  because: "\u2235",
  bemptyv: "\u29B0",
  bepsi: "\u03F6",
  bernou: "\u212C",
  beta: "\u03B2",
  beth: "\u2136",
  between: "\u226C",
  bfr: "\u{1D51F}",
  bigcap: "\u22C2",
  bigcirc: "\u25EF",
  bigcup: "\u22C3",
  bigodot: "\u2A00",
  bigoplus: "\u2A01",
  bigotimes: "\u2A02",
  bigsqcup: "\u2A06",
  bigstar: "\u2605",
  bigtriangledown: "\u25BD",
  bigtriangleup: "\u25B3",
  biguplus: "\u2A04",
  bigvee: "\u22C1",
  bigwedge: "\u22C0",
  bkarow: "\u290D",
  blacklozenge: "\u29EB",
  blacksquare: "\u25AA",
  blacktriangle: "\u25B4",
  blacktriangledown: "\u25BE",
  blacktriangleleft: "\u25C2",
  blacktriangleright: "\u25B8",
  blank: "\u2423",
  blk12: "\u2592",
  blk14: "\u2591",
  blk34: "\u2593",
  block: "\u2588",
  bne: "=\u20E5",
  bnequiv: "\u2261\u20E5",
  bnot: "\u2310",
  bopf: "\u{1D553}",
  bot: "\u22A5",
  bottom: "\u22A5",
  bowtie: "\u22C8",
  boxDL: "\u2557",
  boxDR: "\u2554",
  boxDl: "\u2556",
  boxDr: "\u2553",
  boxH: "\u2550",
  boxHD: "\u2566",
  boxHU: "\u2569",
  boxHd: "\u2564",
  boxHu: "\u2567",
  boxUL: "\u255D",
  boxUR: "\u255A",
  boxUl: "\u255C",
  boxUr: "\u2559",
  boxV: "\u2551",
  boxVH: "\u256C",
  boxVL: "\u2563",
  boxVR: "\u2560",
  boxVh: "\u256B",
  boxVl: "\u2562",
  boxVr: "\u255F",
  boxbox: "\u29C9",
  boxdL: "\u2555",
  boxdR: "\u2552",
  boxdl: "\u2510",
  boxdr: "\u250C",
  boxh: "\u2500",
  boxhD: "\u2565",
  boxhU: "\u2568",
  boxhd: "\u252C",
  boxhu: "\u2534",
  boxminus: "\u229F",
  boxplus: "\u229E",
  boxtimes: "\u22A0",
  boxuL: "\u255B",
  boxuR: "\u2558",
  boxul: "\u2518",
  boxur: "\u2514",
  boxv: "\u2502",
  boxvH: "\u256A",
  boxvL: "\u2561",
  boxvR: "\u255E",
  boxvh: "\u253C",
  boxvl: "\u2524",
  boxvr: "\u251C",
  bprime: "\u2035",
  breve: "\u02D8",
  brvbar: "\xA6",
  bscr: "\u{1D4B7}",
  bsemi: "\u204F",
  bsim: "\u223D",
  bsime: "\u22CD",
  bsol: "\\",
  bsolb: "\u29C5",
  bsolhsub: "\u27C8",
  bull: "\u2022",
  bullet: "\u2022",
  bump: "\u224E",
  bumpE: "\u2AAE",
  bumpe: "\u224F",
  bumpeq: "\u224F",
  cacute: "\u0107",
  cap: "\u2229",
  capand: "\u2A44",
  capbrcup: "\u2A49",
  capcap: "\u2A4B",
  capcup: "\u2A47",
  capdot: "\u2A40",
  caps: "\u2229\uFE00",
  caret: "\u2041",
  caron: "\u02C7",
  ccaps: "\u2A4D",
  ccaron: "\u010D",
  ccedil: "\xE7",
  ccirc: "\u0109",
  ccups: "\u2A4C",
  ccupssm: "\u2A50",
  cdot: "\u010B",
  cedil: "\xB8",
  cemptyv: "\u29B2",
  cent: "\xA2",
  centerdot: "\xB7",
  cfr: "\u{1D520}",
  chcy: "\u0447",
  check: "\u2713",
  checkmark: "\u2713",
  chi: "\u03C7",
  cir: "\u25CB",
  cirE: "\u29C3",
  circ: "\u02C6",
  circeq: "\u2257",
  circlearrowleft: "\u21BA",
  circlearrowright: "\u21BB",
  circledR: "\xAE",
  circledS: "\u24C8",
  circledast: "\u229B",
  circledcirc: "\u229A",
  circleddash: "\u229D",
  cire: "\u2257",
  cirfnint: "\u2A10",
  cirmid: "\u2AEF",
  cirscir: "\u29C2",
  clubs: "\u2663",
  clubsuit: "\u2663",
  colon: ":",
  colone: "\u2254",
  coloneq: "\u2254",
  comma: ",",
  commat: "@",
  comp: "\u2201",
  compfn: "\u2218",
  complement: "\u2201",
  complexes: "\u2102",
  cong: "\u2245",
  congdot: "\u2A6D",
  conint: "\u222E",
  copf: "\u{1D554}",
  coprod: "\u2210",
  copy: "\xA9",
  copysr: "\u2117",
  crarr: "\u21B5",
  cross: "\u2717",
  cscr: "\u{1D4B8}",
  csub: "\u2ACF",
  csube: "\u2AD1",
  csup: "\u2AD0",
  csupe: "\u2AD2",
  ctdot: "\u22EF",
  cudarrl: "\u2938",
  cudarrr: "\u2935",
  cuepr: "\u22DE",
  cuesc: "\u22DF",
  cularr: "\u21B6",
  cularrp: "\u293D",
  cup: "\u222A",
  cupbrcap: "\u2A48",
  cupcap: "\u2A46",
  cupcup: "\u2A4A",
  cupdot: "\u228D",
  cupor: "\u2A45",
  cups: "\u222A\uFE00",
  curarr: "\u21B7",
  curarrm: "\u293C",
  curlyeqprec: "\u22DE",
  curlyeqsucc: "\u22DF",
  curlyvee: "\u22CE",
  curlywedge: "\u22CF",
  curren: "\xA4",
  curvearrowleft: "\u21B6",
  curvearrowright: "\u21B7",
  cuvee: "\u22CE",
  cuwed: "\u22CF",
  cwconint: "\u2232",
  cwint: "\u2231",
  cylcty: "\u232D",
  dArr: "\u21D3",
  dHar: "\u2965",
  dagger: "\u2020",
  daleth: "\u2138",
  darr: "\u2193",
  dash: "\u2010",
  dashv: "\u22A3",
  dbkarow: "\u290F",
  dblac: "\u02DD",
  dcaron: "\u010F",
  dcy: "\u0434",
  dd: "\u2146",
  ddagger: "\u2021",
  ddarr: "\u21CA",
  ddotseq: "\u2A77",
  deg: "\xB0",
  delta: "\u03B4",
  demptyv: "\u29B1",
  dfisht: "\u297F",
  dfr: "\u{1D521}",
  dharl: "\u21C3",
  dharr: "\u21C2",
  diam: "\u22C4",
  diamond: "\u22C4",
  diamondsuit: "\u2666",
  diams: "\u2666",
  die: "\xA8",
  digamma: "\u03DD",
  disin: "\u22F2",
  div: "\xF7",
  divide: "\xF7",
  divideontimes: "\u22C7",
  divonx: "\u22C7",
  djcy: "\u0452",
  dlcorn: "\u231E",
  dlcrop: "\u230D",
  dollar: "$",
  dopf: "\u{1D555}",
  dot: "\u02D9",
  doteq: "\u2250",
  doteqdot: "\u2251",
  dotminus: "\u2238",
  dotplus: "\u2214",
  dotsquare: "\u22A1",
  doublebarwedge: "\u2306",
  downarrow: "\u2193",
  downdownarrows: "\u21CA",
  downharpoonleft: "\u21C3",
  downharpoonright: "\u21C2",
  drbkarow: "\u2910",
  drcorn: "\u231F",
  drcrop: "\u230C",
  dscr: "\u{1D4B9}",
  dscy: "\u0455",
  dsol: "\u29F6",
  dstrok: "\u0111",
  dtdot: "\u22F1",
  dtri: "\u25BF",
  dtrif: "\u25BE",
  duarr: "\u21F5",
  duhar: "\u296F",
  dwangle: "\u29A6",
  dzcy: "\u045F",
  dzigrarr: "\u27FF",
  eDDot: "\u2A77",
  eDot: "\u2251",
  eacute: "\xE9",
  easter: "\u2A6E",
  ecaron: "\u011B",
  ecir: "\u2256",
  ecirc: "\xEA",
  ecolon: "\u2255",
  ecy: "\u044D",
  edot: "\u0117",
  ee: "\u2147",
  efDot: "\u2252",
  efr: "\u{1D522}",
  eg: "\u2A9A",
  egrave: "\xE8",
  egs: "\u2A96",
  egsdot: "\u2A98",
  el: "\u2A99",
  elinters: "\u23E7",
  ell: "\u2113",
  els: "\u2A95",
  elsdot: "\u2A97",
  emacr: "\u0113",
  empty: "\u2205",
  emptyset: "\u2205",
  emptyv: "\u2205",
  emsp13: "\u2004",
  emsp14: "\u2005",
  emsp: "\u2003",
  eng: "\u014B",
  ensp: "\u2002",
  eogon: "\u0119",
  eopf: "\u{1D556}",
  epar: "\u22D5",
  eparsl: "\u29E3",
  eplus: "\u2A71",
  epsi: "\u03B5",
  epsilon: "\u03B5",
  epsiv: "\u03F5",
  eqcirc: "\u2256",
  eqcolon: "\u2255",
  eqsim: "\u2242",
  eqslantgtr: "\u2A96",
  eqslantless: "\u2A95",
  equals: "=",
  equest: "\u225F",
  equiv: "\u2261",
  equivDD: "\u2A78",
  eqvparsl: "\u29E5",
  erDot: "\u2253",
  erarr: "\u2971",
  escr: "\u212F",
  esdot: "\u2250",
  esim: "\u2242",
  eta: "\u03B7",
  eth: "\xF0",
  euml: "\xEB",
  euro: "\u20AC",
  excl: "!",
  exist: "\u2203",
  expectation: "\u2130",
  exponentiale: "\u2147",
  fallingdotseq: "\u2252",
  fcy: "\u0444",
  female: "\u2640",
  ffilig: "\uFB03",
  fflig: "\uFB00",
  ffllig: "\uFB04",
  ffr: "\u{1D523}",
  filig: "\uFB01",
  fjlig: "fj",
  flat: "\u266D",
  fllig: "\uFB02",
  fltns: "\u25B1",
  fnof: "\u0192",
  fopf: "\u{1D557}",
  forall: "\u2200",
  fork: "\u22D4",
  forkv: "\u2AD9",
  fpartint: "\u2A0D",
  frac12: "\xBD",
  frac13: "\u2153",
  frac14: "\xBC",
  frac15: "\u2155",
  frac16: "\u2159",
  frac18: "\u215B",
  frac23: "\u2154",
  frac25: "\u2156",
  frac34: "\xBE",
  frac35: "\u2157",
  frac38: "\u215C",
  frac45: "\u2158",
  frac56: "\u215A",
  frac58: "\u215D",
  frac78: "\u215E",
  frasl: "\u2044",
  frown: "\u2322",
  fscr: "\u{1D4BB}",
  gE: "\u2267",
  gEl: "\u2A8C",
  gacute: "\u01F5",
  gamma: "\u03B3",
  gammad: "\u03DD",
  gap: "\u2A86",
  gbreve: "\u011F",
  gcirc: "\u011D",
  gcy: "\u0433",
  gdot: "\u0121",
  ge: "\u2265",
  gel: "\u22DB",
  geq: "\u2265",
  geqq: "\u2267",
  geqslant: "\u2A7E",
  ges: "\u2A7E",
  gescc: "\u2AA9",
  gesdot: "\u2A80",
  gesdoto: "\u2A82",
  gesdotol: "\u2A84",
  gesl: "\u22DB\uFE00",
  gesles: "\u2A94",
  gfr: "\u{1D524}",
  gg: "\u226B",
  ggg: "\u22D9",
  gimel: "\u2137",
  gjcy: "\u0453",
  gl: "\u2277",
  glE: "\u2A92",
  gla: "\u2AA5",
  glj: "\u2AA4",
  gnE: "\u2269",
  gnap: "\u2A8A",
  gnapprox: "\u2A8A",
  gne: "\u2A88",
  gneq: "\u2A88",
  gneqq: "\u2269",
  gnsim: "\u22E7",
  gopf: "\u{1D558}",
  grave: "`",
  gscr: "\u210A",
  gsim: "\u2273",
  gsime: "\u2A8E",
  gsiml: "\u2A90",
  gt: ">",
  gtcc: "\u2AA7",
  gtcir: "\u2A7A",
  gtdot: "\u22D7",
  gtlPar: "\u2995",
  gtquest: "\u2A7C",
  gtrapprox: "\u2A86",
  gtrarr: "\u2978",
  gtrdot: "\u22D7",
  gtreqless: "\u22DB",
  gtreqqless: "\u2A8C",
  gtrless: "\u2277",
  gtrsim: "\u2273",
  gvertneqq: "\u2269\uFE00",
  gvnE: "\u2269\uFE00",
  hArr: "\u21D4",
  hairsp: "\u200A",
  half: "\xBD",
  hamilt: "\u210B",
  hardcy: "\u044A",
  harr: "\u2194",
  harrcir: "\u2948",
  harrw: "\u21AD",
  hbar: "\u210F",
  hcirc: "\u0125",
  hearts: "\u2665",
  heartsuit: "\u2665",
  hellip: "\u2026",
  hercon: "\u22B9",
  hfr: "\u{1D525}",
  hksearow: "\u2925",
  hkswarow: "\u2926",
  hoarr: "\u21FF",
  homtht: "\u223B",
  hookleftarrow: "\u21A9",
  hookrightarrow: "\u21AA",
  hopf: "\u{1D559}",
  horbar: "\u2015",
  hscr: "\u{1D4BD}",
  hslash: "\u210F",
  hstrok: "\u0127",
  hybull: "\u2043",
  hyphen: "\u2010",
  iacute: "\xED",
  ic: "\u2063",
  icirc: "\xEE",
  icy: "\u0438",
  iecy: "\u0435",
  iexcl: "\xA1",
  iff: "\u21D4",
  ifr: "\u{1D526}",
  igrave: "\xEC",
  ii: "\u2148",
  iiiint: "\u2A0C",
  iiint: "\u222D",
  iinfin: "\u29DC",
  iiota: "\u2129",
  ijlig: "\u0133",
  imacr: "\u012B",
  image: "\u2111",
  imagline: "\u2110",
  imagpart: "\u2111",
  imath: "\u0131",
  imof: "\u22B7",
  imped: "\u01B5",
  in: "\u2208",
  incare: "\u2105",
  infin: "\u221E",
  infintie: "\u29DD",
  inodot: "\u0131",
  int: "\u222B",
  intcal: "\u22BA",
  integers: "\u2124",
  intercal: "\u22BA",
  intlarhk: "\u2A17",
  intprod: "\u2A3C",
  iocy: "\u0451",
  iogon: "\u012F",
  iopf: "\u{1D55A}",
  iota: "\u03B9",
  iprod: "\u2A3C",
  iquest: "\xBF",
  iscr: "\u{1D4BE}",
  isin: "\u2208",
  isinE: "\u22F9",
  isindot: "\u22F5",
  isins: "\u22F4",
  isinsv: "\u22F3",
  isinv: "\u2208",
  it: "\u2062",
  itilde: "\u0129",
  iukcy: "\u0456",
  iuml: "\xEF",
  jcirc: "\u0135",
  jcy: "\u0439",
  jfr: "\u{1D527}",
  jmath: "\u0237",
  jopf: "\u{1D55B}",
  jscr: "\u{1D4BF}",
  jsercy: "\u0458",
  jukcy: "\u0454",
  kappa: "\u03BA",
  kappav: "\u03F0",
  kcedil: "\u0137",
  kcy: "\u043A",
  kfr: "\u{1D528}",
  kgreen: "\u0138",
  khcy: "\u0445",
  kjcy: "\u045C",
  kopf: "\u{1D55C}",
  kscr: "\u{1D4C0}",
  lAarr: "\u21DA",
  lArr: "\u21D0",
  lAtail: "\u291B",
  lBarr: "\u290E",
  lE: "\u2266",
  lEg: "\u2A8B",
  lHar: "\u2962",
  lacute: "\u013A",
  laemptyv: "\u29B4",
  lagran: "\u2112",
  lambda: "\u03BB",
  lang: "\u27E8",
  langd: "\u2991",
  langle: "\u27E8",
  lap: "\u2A85",
  laquo: "\xAB",
  larr: "\u2190",
  larrb: "\u21E4",
  larrbfs: "\u291F",
  larrfs: "\u291D",
  larrhk: "\u21A9",
  larrlp: "\u21AB",
  larrpl: "\u2939",
  larrsim: "\u2973",
  larrtl: "\u21A2",
  lat: "\u2AAB",
  latail: "\u2919",
  late: "\u2AAD",
  lates: "\u2AAD\uFE00",
  lbarr: "\u290C",
  lbbrk: "\u2772",
  lbrace: "{",
  lbrack: "[",
  lbrke: "\u298B",
  lbrksld: "\u298F",
  lbrkslu: "\u298D",
  lcaron: "\u013E",
  lcedil: "\u013C",
  lceil: "\u2308",
  lcub: "{",
  lcy: "\u043B",
  ldca: "\u2936",
  ldquo: "\u201C",
  ldquor: "\u201E",
  ldrdhar: "\u2967",
  ldrushar: "\u294B",
  ldsh: "\u21B2",
  le: "\u2264",
  leftarrow: "\u2190",
  leftarrowtail: "\u21A2",
  leftharpoondown: "\u21BD",
  leftharpoonup: "\u21BC",
  leftleftarrows: "\u21C7",
  leftrightarrow: "\u2194",
  leftrightarrows: "\u21C6",
  leftrightharpoons: "\u21CB",
  leftrightsquigarrow: "\u21AD",
  leftthreetimes: "\u22CB",
  leg: "\u22DA",
  leq: "\u2264",
  leqq: "\u2266",
  leqslant: "\u2A7D",
  les: "\u2A7D",
  lescc: "\u2AA8",
  lesdot: "\u2A7F",
  lesdoto: "\u2A81",
  lesdotor: "\u2A83",
  lesg: "\u22DA\uFE00",
  lesges: "\u2A93",
  lessapprox: "\u2A85",
  lessdot: "\u22D6",
  lesseqgtr: "\u22DA",
  lesseqqgtr: "\u2A8B",
  lessgtr: "\u2276",
  lesssim: "\u2272",
  lfisht: "\u297C",
  lfloor: "\u230A",
  lfr: "\u{1D529}",
  lg: "\u2276",
  lgE: "\u2A91",
  lhard: "\u21BD",
  lharu: "\u21BC",
  lharul: "\u296A",
  lhblk: "\u2584",
  ljcy: "\u0459",
  ll: "\u226A",
  llarr: "\u21C7",
  llcorner: "\u231E",
  llhard: "\u296B",
  lltri: "\u25FA",
  lmidot: "\u0140",
  lmoust: "\u23B0",
  lmoustache: "\u23B0",
  lnE: "\u2268",
  lnap: "\u2A89",
  lnapprox: "\u2A89",
  lne: "\u2A87",
  lneq: "\u2A87",
  lneqq: "\u2268",
  lnsim: "\u22E6",
  loang: "\u27EC",
  loarr: "\u21FD",
  lobrk: "\u27E6",
  longleftarrow: "\u27F5",
  longleftrightarrow: "\u27F7",
  longmapsto: "\u27FC",
  longrightarrow: "\u27F6",
  looparrowleft: "\u21AB",
  looparrowright: "\u21AC",
  lopar: "\u2985",
  lopf: "\u{1D55D}",
  loplus: "\u2A2D",
  lotimes: "\u2A34",
  lowast: "\u2217",
  lowbar: "_",
  loz: "\u25CA",
  lozenge: "\u25CA",
  lozf: "\u29EB",
  lpar: "(",
  lparlt: "\u2993",
  lrarr: "\u21C6",
  lrcorner: "\u231F",
  lrhar: "\u21CB",
  lrhard: "\u296D",
  lrm: "\u200E",
  lrtri: "\u22BF",
  lsaquo: "\u2039",
  lscr: "\u{1D4C1}",
  lsh: "\u21B0",
  lsim: "\u2272",
  lsime: "\u2A8D",
  lsimg: "\u2A8F",
  lsqb: "[",
  lsquo: "\u2018",
  lsquor: "\u201A",
  lstrok: "\u0142",
  lt: "<",
  ltcc: "\u2AA6",
  ltcir: "\u2A79",
  ltdot: "\u22D6",
  lthree: "\u22CB",
  ltimes: "\u22C9",
  ltlarr: "\u2976",
  ltquest: "\u2A7B",
  ltrPar: "\u2996",
  ltri: "\u25C3",
  ltrie: "\u22B4",
  ltrif: "\u25C2",
  lurdshar: "\u294A",
  luruhar: "\u2966",
  lvertneqq: "\u2268\uFE00",
  lvnE: "\u2268\uFE00",
  mDDot: "\u223A",
  macr: "\xAF",
  male: "\u2642",
  malt: "\u2720",
  maltese: "\u2720",
  map: "\u21A6",
  mapsto: "\u21A6",
  mapstodown: "\u21A7",
  mapstoleft: "\u21A4",
  mapstoup: "\u21A5",
  marker: "\u25AE",
  mcomma: "\u2A29",
  mcy: "\u043C",
  mdash: "\u2014",
  measuredangle: "\u2221",
  mfr: "\u{1D52A}",
  mho: "\u2127",
  micro: "\xB5",
  mid: "\u2223",
  midast: "*",
  midcir: "\u2AF0",
  middot: "\xB7",
  minus: "\u2212",
  minusb: "\u229F",
  minusd: "\u2238",
  minusdu: "\u2A2A",
  mlcp: "\u2ADB",
  mldr: "\u2026",
  mnplus: "\u2213",
  models: "\u22A7",
  mopf: "\u{1D55E}",
  mp: "\u2213",
  mscr: "\u{1D4C2}",
  mstpos: "\u223E",
  mu: "\u03BC",
  multimap: "\u22B8",
  mumap: "\u22B8",
  nGg: "\u22D9\u0338",
  nGt: "\u226B\u20D2",
  nGtv: "\u226B\u0338",
  nLeftarrow: "\u21CD",
  nLeftrightarrow: "\u21CE",
  nLl: "\u22D8\u0338",
  nLt: "\u226A\u20D2",
  nLtv: "\u226A\u0338",
  nRightarrow: "\u21CF",
  nVDash: "\u22AF",
  nVdash: "\u22AE",
  nabla: "\u2207",
  nacute: "\u0144",
  nang: "\u2220\u20D2",
  nap: "\u2249",
  napE: "\u2A70\u0338",
  napid: "\u224B\u0338",
  napos: "\u0149",
  napprox: "\u2249",
  natur: "\u266E",
  natural: "\u266E",
  naturals: "\u2115",
  nbsp: "\xA0",
  nbump: "\u224E\u0338",
  nbumpe: "\u224F\u0338",
  ncap: "\u2A43",
  ncaron: "\u0148",
  ncedil: "\u0146",
  ncong: "\u2247",
  ncongdot: "\u2A6D\u0338",
  ncup: "\u2A42",
  ncy: "\u043D",
  ndash: "\u2013",
  ne: "\u2260",
  neArr: "\u21D7",
  nearhk: "\u2924",
  nearr: "\u2197",
  nearrow: "\u2197",
  nedot: "\u2250\u0338",
  nequiv: "\u2262",
  nesear: "\u2928",
  nesim: "\u2242\u0338",
  nexist: "\u2204",
  nexists: "\u2204",
  nfr: "\u{1D52B}",
  ngE: "\u2267\u0338",
  nge: "\u2271",
  ngeq: "\u2271",
  ngeqq: "\u2267\u0338",
  ngeqslant: "\u2A7E\u0338",
  nges: "\u2A7E\u0338",
  ngsim: "\u2275",
  ngt: "\u226F",
  ngtr: "\u226F",
  nhArr: "\u21CE",
  nharr: "\u21AE",
  nhpar: "\u2AF2",
  ni: "\u220B",
  nis: "\u22FC",
  nisd: "\u22FA",
  niv: "\u220B",
  njcy: "\u045A",
  nlArr: "\u21CD",
  nlE: "\u2266\u0338",
  nlarr: "\u219A",
  nldr: "\u2025",
  nle: "\u2270",
  nleftarrow: "\u219A",
  nleftrightarrow: "\u21AE",
  nleq: "\u2270",
  nleqq: "\u2266\u0338",
  nleqslant: "\u2A7D\u0338",
  nles: "\u2A7D\u0338",
  nless: "\u226E",
  nlsim: "\u2274",
  nlt: "\u226E",
  nltri: "\u22EA",
  nltrie: "\u22EC",
  nmid: "\u2224",
  nopf: "\u{1D55F}",
  not: "\xAC",
  notin: "\u2209",
  notinE: "\u22F9\u0338",
  notindot: "\u22F5\u0338",
  notinva: "\u2209",
  notinvb: "\u22F7",
  notinvc: "\u22F6",
  notni: "\u220C",
  notniva: "\u220C",
  notnivb: "\u22FE",
  notnivc: "\u22FD",
  npar: "\u2226",
  nparallel: "\u2226",
  nparsl: "\u2AFD\u20E5",
  npart: "\u2202\u0338",
  npolint: "\u2A14",
  npr: "\u2280",
  nprcue: "\u22E0",
  npre: "\u2AAF\u0338",
  nprec: "\u2280",
  npreceq: "\u2AAF\u0338",
  nrArr: "\u21CF",
  nrarr: "\u219B",
  nrarrc: "\u2933\u0338",
  nrarrw: "\u219D\u0338",
  nrightarrow: "\u219B",
  nrtri: "\u22EB",
  nrtrie: "\u22ED",
  nsc: "\u2281",
  nsccue: "\u22E1",
  nsce: "\u2AB0\u0338",
  nscr: "\u{1D4C3}",
  nshortmid: "\u2224",
  nshortparallel: "\u2226",
  nsim: "\u2241",
  nsime: "\u2244",
  nsimeq: "\u2244",
  nsmid: "\u2224",
  nspar: "\u2226",
  nsqsube: "\u22E2",
  nsqsupe: "\u22E3",
  nsub: "\u2284",
  nsubE: "\u2AC5\u0338",
  nsube: "\u2288",
  nsubset: "\u2282\u20D2",
  nsubseteq: "\u2288",
  nsubseteqq: "\u2AC5\u0338",
  nsucc: "\u2281",
  nsucceq: "\u2AB0\u0338",
  nsup: "\u2285",
  nsupE: "\u2AC6\u0338",
  nsupe: "\u2289",
  nsupset: "\u2283\u20D2",
  nsupseteq: "\u2289",
  nsupseteqq: "\u2AC6\u0338",
  ntgl: "\u2279",
  ntilde: "\xF1",
  ntlg: "\u2278",
  ntriangleleft: "\u22EA",
  ntrianglelefteq: "\u22EC",
  ntriangleright: "\u22EB",
  ntrianglerighteq: "\u22ED",
  nu: "\u03BD",
  num: "#",
  numero: "\u2116",
  numsp: "\u2007",
  nvDash: "\u22AD",
  nvHarr: "\u2904",
  nvap: "\u224D\u20D2",
  nvdash: "\u22AC",
  nvge: "\u2265\u20D2",
  nvgt: ">\u20D2",
  nvinfin: "\u29DE",
  nvlArr: "\u2902",
  nvle: "\u2264\u20D2",
  nvlt: "<\u20D2",
  nvltrie: "\u22B4\u20D2",
  nvrArr: "\u2903",
  nvrtrie: "\u22B5\u20D2",
  nvsim: "\u223C\u20D2",
  nwArr: "\u21D6",
  nwarhk: "\u2923",
  nwarr: "\u2196",
  nwarrow: "\u2196",
  nwnear: "\u2927",
  oS: "\u24C8",
  oacute: "\xF3",
  oast: "\u229B",
  ocir: "\u229A",
  ocirc: "\xF4",
  ocy: "\u043E",
  odash: "\u229D",
  odblac: "\u0151",
  odiv: "\u2A38",
  odot: "\u2299",
  odsold: "\u29BC",
  oelig: "\u0153",
  ofcir: "\u29BF",
  ofr: "\u{1D52C}",
  ogon: "\u02DB",
  ograve: "\xF2",
  ogt: "\u29C1",
  ohbar: "\u29B5",
  ohm: "\u03A9",
  oint: "\u222E",
  olarr: "\u21BA",
  olcir: "\u29BE",
  olcross: "\u29BB",
  oline: "\u203E",
  olt: "\u29C0",
  omacr: "\u014D",
  omega: "\u03C9",
  omicron: "\u03BF",
  omid: "\u29B6",
  ominus: "\u2296",
  oopf: "\u{1D560}",
  opar: "\u29B7",
  operp: "\u29B9",
  oplus: "\u2295",
  or: "\u2228",
  orarr: "\u21BB",
  ord: "\u2A5D",
  order: "\u2134",
  orderof: "\u2134",
  ordf: "\xAA",
  ordm: "\xBA",
  origof: "\u22B6",
  oror: "\u2A56",
  orslope: "\u2A57",
  orv: "\u2A5B",
  oscr: "\u2134",
  oslash: "\xF8",
  osol: "\u2298",
  otilde: "\xF5",
  otimes: "\u2297",
  otimesas: "\u2A36",
  ouml: "\xF6",
  ovbar: "\u233D",
  par: "\u2225",
  para: "\xB6",
  parallel: "\u2225",
  parsim: "\u2AF3",
  parsl: "\u2AFD",
  part: "\u2202",
  pcy: "\u043F",
  percnt: "%",
  period: ".",
  permil: "\u2030",
  perp: "\u22A5",
  pertenk: "\u2031",
  pfr: "\u{1D52D}",
  phi: "\u03C6",
  phiv: "\u03D5",
  phmmat: "\u2133",
  phone: "\u260E",
  pi: "\u03C0",
  pitchfork: "\u22D4",
  piv: "\u03D6",
  planck: "\u210F",
  planckh: "\u210E",
  plankv: "\u210F",
  plus: "+",
  plusacir: "\u2A23",
  plusb: "\u229E",
  pluscir: "\u2A22",
  plusdo: "\u2214",
  plusdu: "\u2A25",
  pluse: "\u2A72",
  plusmn: "\xB1",
  plussim: "\u2A26",
  plustwo: "\u2A27",
  pm: "\xB1",
  pointint: "\u2A15",
  popf: "\u{1D561}",
  pound: "\xA3",
  pr: "\u227A",
  prE: "\u2AB3",
  prap: "\u2AB7",
  prcue: "\u227C",
  pre: "\u2AAF",
  prec: "\u227A",
  precapprox: "\u2AB7",
  preccurlyeq: "\u227C",
  preceq: "\u2AAF",
  precnapprox: "\u2AB9",
  precneqq: "\u2AB5",
  precnsim: "\u22E8",
  precsim: "\u227E",
  prime: "\u2032",
  primes: "\u2119",
  prnE: "\u2AB5",
  prnap: "\u2AB9",
  prnsim: "\u22E8",
  prod: "\u220F",
  profalar: "\u232E",
  profline: "\u2312",
  profsurf: "\u2313",
  prop: "\u221D",
  propto: "\u221D",
  prsim: "\u227E",
  prurel: "\u22B0",
  pscr: "\u{1D4C5}",
  psi: "\u03C8",
  puncsp: "\u2008",
  qfr: "\u{1D52E}",
  qint: "\u2A0C",
  qopf: "\u{1D562}",
  qprime: "\u2057",
  qscr: "\u{1D4C6}",
  quaternions: "\u210D",
  quatint: "\u2A16",
  quest: "?",
  questeq: "\u225F",
  quot: '"',
  rAarr: "\u21DB",
  rArr: "\u21D2",
  rAtail: "\u291C",
  rBarr: "\u290F",
  rHar: "\u2964",
  race: "\u223D\u0331",
  racute: "\u0155",
  radic: "\u221A",
  raemptyv: "\u29B3",
  rang: "\u27E9",
  rangd: "\u2992",
  range: "\u29A5",
  rangle: "\u27E9",
  raquo: "\xBB",
  rarr: "\u2192",
  rarrap: "\u2975",
  rarrb: "\u21E5",
  rarrbfs: "\u2920",
  rarrc: "\u2933",
  rarrfs: "\u291E",
  rarrhk: "\u21AA",
  rarrlp: "\u21AC",
  rarrpl: "\u2945",
  rarrsim: "\u2974",
  rarrtl: "\u21A3",
  rarrw: "\u219D",
  ratail: "\u291A",
  ratio: "\u2236",
  rationals: "\u211A",
  rbarr: "\u290D",
  rbbrk: "\u2773",
  rbrace: "}",
  rbrack: "]",
  rbrke: "\u298C",
  rbrksld: "\u298E",
  rbrkslu: "\u2990",
  rcaron: "\u0159",
  rcedil: "\u0157",
  rceil: "\u2309",
  rcub: "}",
  rcy: "\u0440",
  rdca: "\u2937",
  rdldhar: "\u2969",
  rdquo: "\u201D",
  rdquor: "\u201D",
  rdsh: "\u21B3",
  real: "\u211C",
  realine: "\u211B",
  realpart: "\u211C",
  reals: "\u211D",
  rect: "\u25AD",
  reg: "\xAE",
  rfisht: "\u297D",
  rfloor: "\u230B",
  rfr: "\u{1D52F}",
  rhard: "\u21C1",
  rharu: "\u21C0",
  rharul: "\u296C",
  rho: "\u03C1",
  rhov: "\u03F1",
  rightarrow: "\u2192",
  rightarrowtail: "\u21A3",
  rightharpoondown: "\u21C1",
  rightharpoonup: "\u21C0",
  rightleftarrows: "\u21C4",
  rightleftharpoons: "\u21CC",
  rightrightarrows: "\u21C9",
  rightsquigarrow: "\u219D",
  rightthreetimes: "\u22CC",
  ring: "\u02DA",
  risingdotseq: "\u2253",
  rlarr: "\u21C4",
  rlhar: "\u21CC",
  rlm: "\u200F",
  rmoust: "\u23B1",
  rmoustache: "\u23B1",
  rnmid: "\u2AEE",
  roang: "\u27ED",
  roarr: "\u21FE",
  robrk: "\u27E7",
  ropar: "\u2986",
  ropf: "\u{1D563}",
  roplus: "\u2A2E",
  rotimes: "\u2A35",
  rpar: ")",
  rpargt: "\u2994",
  rppolint: "\u2A12",
  rrarr: "\u21C9",
  rsaquo: "\u203A",
  rscr: "\u{1D4C7}",
  rsh: "\u21B1",
  rsqb: "]",
  rsquo: "\u2019",
  rsquor: "\u2019",
  rthree: "\u22CC",
  rtimes: "\u22CA",
  rtri: "\u25B9",
  rtrie: "\u22B5",
  rtrif: "\u25B8",
  rtriltri: "\u29CE",
  ruluhar: "\u2968",
  rx: "\u211E",
  sacute: "\u015B",
  sbquo: "\u201A",
  sc: "\u227B",
  scE: "\u2AB4",
  scap: "\u2AB8",
  scaron: "\u0161",
  sccue: "\u227D",
  sce: "\u2AB0",
  scedil: "\u015F",
  scirc: "\u015D",
  scnE: "\u2AB6",
  scnap: "\u2ABA",
  scnsim: "\u22E9",
  scpolint: "\u2A13",
  scsim: "\u227F",
  scy: "\u0441",
  sdot: "\u22C5",
  sdotb: "\u22A1",
  sdote: "\u2A66",
  seArr: "\u21D8",
  searhk: "\u2925",
  searr: "\u2198",
  searrow: "\u2198",
  sect: "\xA7",
  semi: ";",
  seswar: "\u2929",
  setminus: "\u2216",
  setmn: "\u2216",
  sext: "\u2736",
  sfr: "\u{1D530}",
  sfrown: "\u2322",
  sharp: "\u266F",
  shchcy: "\u0449",
  shcy: "\u0448",
  shortmid: "\u2223",
  shortparallel: "\u2225",
  shy: "\xAD",
  sigma: "\u03C3",
  sigmaf: "\u03C2",
  sigmav: "\u03C2",
  sim: "\u223C",
  simdot: "\u2A6A",
  sime: "\u2243",
  simeq: "\u2243",
  simg: "\u2A9E",
  simgE: "\u2AA0",
  siml: "\u2A9D",
  simlE: "\u2A9F",
  simne: "\u2246",
  simplus: "\u2A24",
  simrarr: "\u2972",
  slarr: "\u2190",
  smallsetminus: "\u2216",
  smashp: "\u2A33",
  smeparsl: "\u29E4",
  smid: "\u2223",
  smile: "\u2323",
  smt: "\u2AAA",
  smte: "\u2AAC",
  smtes: "\u2AAC\uFE00",
  softcy: "\u044C",
  sol: "/",
  solb: "\u29C4",
  solbar: "\u233F",
  sopf: "\u{1D564}",
  spades: "\u2660",
  spadesuit: "\u2660",
  spar: "\u2225",
  sqcap: "\u2293",
  sqcaps: "\u2293\uFE00",
  sqcup: "\u2294",
  sqcups: "\u2294\uFE00",
  sqsub: "\u228F",
  sqsube: "\u2291",
  sqsubset: "\u228F",
  sqsubseteq: "\u2291",
  sqsup: "\u2290",
  sqsupe: "\u2292",
  sqsupset: "\u2290",
  sqsupseteq: "\u2292",
  squ: "\u25A1",
  square: "\u25A1",
  squarf: "\u25AA",
  squf: "\u25AA",
  srarr: "\u2192",
  sscr: "\u{1D4C8}",
  ssetmn: "\u2216",
  ssmile: "\u2323",
  sstarf: "\u22C6",
  star: "\u2606",
  starf: "\u2605",
  straightepsilon: "\u03F5",
  straightphi: "\u03D5",
  strns: "\xAF",
  sub: "\u2282",
  subE: "\u2AC5",
  subdot: "\u2ABD",
  sube: "\u2286",
  subedot: "\u2AC3",
  submult: "\u2AC1",
  subnE: "\u2ACB",
  subne: "\u228A",
  subplus: "\u2ABF",
  subrarr: "\u2979",
  subset: "\u2282",
  subseteq: "\u2286",
  subseteqq: "\u2AC5",
  subsetneq: "\u228A",
  subsetneqq: "\u2ACB",
  subsim: "\u2AC7",
  subsub: "\u2AD5",
  subsup: "\u2AD3",
  succ: "\u227B",
  succapprox: "\u2AB8",
  succcurlyeq: "\u227D",
  succeq: "\u2AB0",
  succnapprox: "\u2ABA",
  succneqq: "\u2AB6",
  succnsim: "\u22E9",
  succsim: "\u227F",
  sum: "\u2211",
  sung: "\u266A",
  sup1: "\xB9",
  sup2: "\xB2",
  sup3: "\xB3",
  sup: "\u2283",
  supE: "\u2AC6",
  supdot: "\u2ABE",
  supdsub: "\u2AD8",
  supe: "\u2287",
  supedot: "\u2AC4",
  suphsol: "\u27C9",
  suphsub: "\u2AD7",
  suplarr: "\u297B",
  supmult: "\u2AC2",
  supnE: "\u2ACC",
  supne: "\u228B",
  supplus: "\u2AC0",
  supset: "\u2283",
  supseteq: "\u2287",
  supseteqq: "\u2AC6",
  supsetneq: "\u228B",
  supsetneqq: "\u2ACC",
  supsim: "\u2AC8",
  supsub: "\u2AD4",
  supsup: "\u2AD6",
  swArr: "\u21D9",
  swarhk: "\u2926",
  swarr: "\u2199",
  swarrow: "\u2199",
  swnwar: "\u292A",
  szlig: "\xDF",
  target: "\u2316",
  tau: "\u03C4",
  tbrk: "\u23B4",
  tcaron: "\u0165",
  tcedil: "\u0163",
  tcy: "\u0442",
  tdot: "\u20DB",
  telrec: "\u2315",
  tfr: "\u{1D531}",
  there4: "\u2234",
  therefore: "\u2234",
  theta: "\u03B8",
  thetasym: "\u03D1",
  thetav: "\u03D1",
  thickapprox: "\u2248",
  thicksim: "\u223C",
  thinsp: "\u2009",
  thkap: "\u2248",
  thksim: "\u223C",
  thorn: "\xFE",
  tilde: "\u02DC",
  times: "\xD7",
  timesb: "\u22A0",
  timesbar: "\u2A31",
  timesd: "\u2A30",
  tint: "\u222D",
  toea: "\u2928",
  top: "\u22A4",
  topbot: "\u2336",
  topcir: "\u2AF1",
  topf: "\u{1D565}",
  topfork: "\u2ADA",
  tosa: "\u2929",
  tprime: "\u2034",
  trade: "\u2122",
  triangle: "\u25B5",
  triangledown: "\u25BF",
  triangleleft: "\u25C3",
  trianglelefteq: "\u22B4",
  triangleq: "\u225C",
  triangleright: "\u25B9",
  trianglerighteq: "\u22B5",
  tridot: "\u25EC",
  trie: "\u225C",
  triminus: "\u2A3A",
  triplus: "\u2A39",
  trisb: "\u29CD",
  tritime: "\u2A3B",
  trpezium: "\u23E2",
  tscr: "\u{1D4C9}",
  tscy: "\u0446",
  tshcy: "\u045B",
  tstrok: "\u0167",
  twixt: "\u226C",
  twoheadleftarrow: "\u219E",
  twoheadrightarrow: "\u21A0",
  uArr: "\u21D1",
  uHar: "\u2963",
  uacute: "\xFA",
  uarr: "\u2191",
  ubrcy: "\u045E",
  ubreve: "\u016D",
  ucirc: "\xFB",
  ucy: "\u0443",
  udarr: "\u21C5",
  udblac: "\u0171",
  udhar: "\u296E",
  ufisht: "\u297E",
  ufr: "\u{1D532}",
  ugrave: "\xF9",
  uharl: "\u21BF",
  uharr: "\u21BE",
  uhblk: "\u2580",
  ulcorn: "\u231C",
  ulcorner: "\u231C",
  ulcrop: "\u230F",
  ultri: "\u25F8",
  umacr: "\u016B",
  uml: "\xA8",
  uogon: "\u0173",
  uopf: "\u{1D566}",
  uparrow: "\u2191",
  updownarrow: "\u2195",
  upharpoonleft: "\u21BF",
  upharpoonright: "\u21BE",
  uplus: "\u228E",
  upsi: "\u03C5",
  upsih: "\u03D2",
  upsilon: "\u03C5",
  upuparrows: "\u21C8",
  urcorn: "\u231D",
  urcorner: "\u231D",
  urcrop: "\u230E",
  uring: "\u016F",
  urtri: "\u25F9",
  uscr: "\u{1D4CA}",
  utdot: "\u22F0",
  utilde: "\u0169",
  utri: "\u25B5",
  utrif: "\u25B4",
  uuarr: "\u21C8",
  uuml: "\xFC",
  uwangle: "\u29A7",
  vArr: "\u21D5",
  vBar: "\u2AE8",
  vBarv: "\u2AE9",
  vDash: "\u22A8",
  vangrt: "\u299C",
  varepsilon: "\u03F5",
  varkappa: "\u03F0",
  varnothing: "\u2205",
  varphi: "\u03D5",
  varpi: "\u03D6",
  varpropto: "\u221D",
  varr: "\u2195",
  varrho: "\u03F1",
  varsigma: "\u03C2",
  varsubsetneq: "\u228A\uFE00",
  varsubsetneqq: "\u2ACB\uFE00",
  varsupsetneq: "\u228B\uFE00",
  varsupsetneqq: "\u2ACC\uFE00",
  vartheta: "\u03D1",
  vartriangleleft: "\u22B2",
  vartriangleright: "\u22B3",
  vcy: "\u0432",
  vdash: "\u22A2",
  vee: "\u2228",
  veebar: "\u22BB",
  veeeq: "\u225A",
  vellip: "\u22EE",
  verbar: "|",
  vert: "|",
  vfr: "\u{1D533}",
  vltri: "\u22B2",
  vnsub: "\u2282\u20D2",
  vnsup: "\u2283\u20D2",
  vopf: "\u{1D567}",
  vprop: "\u221D",
  vrtri: "\u22B3",
  vscr: "\u{1D4CB}",
  vsubnE: "\u2ACB\uFE00",
  vsubne: "\u228A\uFE00",
  vsupnE: "\u2ACC\uFE00",
  vsupne: "\u228B\uFE00",
  vzigzag: "\u299A",
  wcirc: "\u0175",
  wedbar: "\u2A5F",
  wedge: "\u2227",
  wedgeq: "\u2259",
  weierp: "\u2118",
  wfr: "\u{1D534}",
  wopf: "\u{1D568}",
  wp: "\u2118",
  wr: "\u2240",
  wreath: "\u2240",
  wscr: "\u{1D4CC}",
  xcap: "\u22C2",
  xcirc: "\u25EF",
  xcup: "\u22C3",
  xdtri: "\u25BD",
  xfr: "\u{1D535}",
  xhArr: "\u27FA",
  xharr: "\u27F7",
  xi: "\u03BE",
  xlArr: "\u27F8",
  xlarr: "\u27F5",
  xmap: "\u27FC",
  xnis: "\u22FB",
  xodot: "\u2A00",
  xopf: "\u{1D569}",
  xoplus: "\u2A01",
  xotime: "\u2A02",
  xrArr: "\u27F9",
  xrarr: "\u27F6",
  xscr: "\u{1D4CD}",
  xsqcup: "\u2A06",
  xuplus: "\u2A04",
  xutri: "\u25B3",
  xvee: "\u22C1",
  xwedge: "\u22C0",
  yacute: "\xFD",
  yacy: "\u044F",
  ycirc: "\u0177",
  ycy: "\u044B",
  yen: "\xA5",
  yfr: "\u{1D536}",
  yicy: "\u0457",
  yopf: "\u{1D56A}",
  yscr: "\u{1D4CE}",
  yucy: "\u044E",
  yuml: "\xFF",
  zacute: "\u017A",
  zcaron: "\u017E",
  zcy: "\u0437",
  zdot: "\u017C",
  zeetrf: "\u2128",
  zeta: "\u03B6",
  zfr: "\u{1D537}",
  zhcy: "\u0436",
  zigrarr: "\u21DD",
  zopf: "\u{1D56B}",
  zscr: "\u{1D4CF}",
  zwj: "\u200D",
  zwnj: "\u200C"
};

// node_modules/decode-named-character-reference/index.js
var own = {}.hasOwnProperty;
function decodeNamedCharacterReference(value) {
  return own.call(characterEntities, value) ? characterEntities[value] : !1;
}

// node_modules/micromark-util-chunked/index.js
function splice(list3, start, remove, items) {
  let end = list3.length, chunkStart = 0, parameters;
  if (start < 0 ? start = -start > end ? 0 : end + start : start = start > end ? end : start, remove = remove > 0 ? remove : 0, items.length < 1e4)
    parameters = Array.from(items), parameters.unshift(start, remove), list3.splice(...parameters);
  else
    for (remove && list3.splice(start, remove); chunkStart < items.length; )
      parameters = items.slice(chunkStart, chunkStart + 1e4), parameters.unshift(start, 0), list3.splice(...parameters), chunkStart += 1e4, start += 1e4;
}
function push(list3, items) {
  return list3.length > 0 ? (splice(list3, list3.length, 0, items), list3) : items;
}

// node_modules/micromark-util-combine-extensions/index.js
var hasOwnProperty = {}.hasOwnProperty;
function combineExtensions(extensions) {
  let all2 = {}, index2 = -1;
  for (; ++index2 < extensions.length; )
    syntaxExtension(all2, extensions[index2]);
  return all2;
}
function syntaxExtension(all2, extension2) {
  let hook;
  for (hook in extension2) {
    let left = (hasOwnProperty.call(all2, hook) ? all2[hook] : void 0) || (all2[hook] = {}), right = extension2[hook], code;
    if (right)
      for (code in right) {
        hasOwnProperty.call(left, code) || (left[code] = []);
        let value = right[code];
        constructs(
          // @ts-expect-error Looks like a list.
          left[code],
          Array.isArray(value) ? value : value ? [value] : []
        );
      }
  }
}
function constructs(existing, list3) {
  let index2 = -1, before = [];
  for (; ++index2 < list3.length; )
    (list3[index2].add === "after" ? existing : before).push(list3[index2]);
  splice(existing, 0, 0, before);
}

// node_modules/micromark-util-decode-numeric-character-reference/index.js
function decodeNumericCharacterReference(value, base) {
  let code = Number.parseInt(value, base);
  return (
    // C0 except for HT, LF, FF, CR, space.
    code < 9 || code === 11 || code > 13 && code < 32 || // Control character (DEL) of C0, and C1 controls.
    code > 126 && code < 160 || // Lone high surrogates and low surrogates.
    code > 55295 && code < 57344 || // Noncharacters.
    code > 64975 && code < 65008 || /* eslint-disable no-bitwise */
    (code & 65535) === 65535 || (code & 65535) === 65534 || /* eslint-enable no-bitwise */
    // Out of range
    code > 1114111 ? "\uFFFD" : String.fromCodePoint(code)
  );
}

// node_modules/micromark-util-normalize-identifier/index.js
function normalizeIdentifier(value) {
  return value.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}

// node_modules/micromark-util-character/index.js
var asciiAlpha = regexCheck(/[A-Za-z]/), asciiAlphanumeric = regexCheck(/[\dA-Za-z]/), asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
function asciiControl(code) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code !== null && (code < 32 || code === 127)
  );
}
var asciiDigit = regexCheck(/\d/), asciiHexDigit = regexCheck(/[\dA-Fa-f]/), asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
function markdownLineEnding(code) {
  return code !== null && code < -2;
}
function markdownLineEndingOrSpace(code) {
  return code !== null && (code < 0 || code === 32);
}
function markdownSpace(code) {
  return code === -2 || code === -1 || code === 32;
}
var unicodePunctuation = regexCheck(new RegExp("\\p{P}|\\p{S}", "u")), unicodeWhitespace = regexCheck(/\s/);
function regexCheck(regex) {
  return check4;
  function check4(code) {
    return code !== null && code > -1 && regex.test(String.fromCharCode(code));
  }
}

// node_modules/micromark-factory-space/index.js
function factorySpace(effects, ok, type, max) {
  let limit = max ? max - 1 : 1 / 0, size = 0;
  return start;
  function start(code) {
    return markdownSpace(code) ? (effects.enter(type), prefix(code)) : ok(code);
  }
  function prefix(code) {
    return markdownSpace(code) && size++ < limit ? (effects.consume(code), prefix) : (effects.exit(type), ok(code));
  }
}
function factorySpaceMinMax(effects, ok, nok, type, min, max) {
  let size = 0;
  return start;
  function start(code) {
    return max > 0 && markdownSpace(code) ? (effects.enter(type), prefix(code)) : after(code);
  }
  function prefix(code) {
    return markdownSpace(code) && size < max ? (effects.consume(code), size++, prefix) : (effects.exit(type), after(code));
  }
  function after(code) {
    return size >= min ? ok(code) : nok(code);
  }
}

// node_modules/micromark/lib/initialize/content.js
var content = {
  tokenize: initializeContent
};
function initializeContent(effects) {
  let contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial), previous2;
  return contentStart;
  function afterContentStartConstruct(code) {
    if (code === null) {
      effects.consume(code);
      return;
    }
    return effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), factorySpace(effects, contentStart, "linePrefix");
  }
  function paragraphInitial(code) {
    return effects.enter("paragraph"), lineStart(code);
  }
  function lineStart(code) {
    let token = effects.enter("chunkText", {
      contentType: "text",
      previous: previous2
    });
    return previous2 && (previous2.next = token), previous2 = token, data(code);
  }
  function data(code) {
    if (code === null) {
      effects.exit("chunkText"), effects.exit("paragraph"), effects.consume(code);
      return;
    }
    return markdownLineEnding(code) ? (effects.consume(code), effects.exit("chunkText"), lineStart) : (effects.consume(code), data);
  }
}

// node_modules/micromark-util-edit-map/index.js
var EditMap = class {
  /**
   * Create a new edit map.
   *
   * @returns
   *   New instance.
   */
  constructor() {
    this.index = /* @__PURE__ */ new Map(), this.map = [];
  }
  /**
   * Create an edit: a remove and/or add at a certain place.
   *
   * @param {number} index
   *   Index at which to apply the edit.
   * @param {number} remove
   *   Count of items to remove at the index.
   * @param {Array<Event>} add
   *   Items to add at the index.
   * @returns {undefined}
   *   Nothing.
   */
  add(index2, remove, add) {
    addImplementation(this, index2, remove, add, !1);
  }
  /**
   * Create an edit: but insert `add` before existing additions, instead of
   * after them.
   *
   * @param {number} index
   *   Index at which to apply the edit.
   * @param {number} remove
   *   Count of items to remove at the index.
   * @param {Array<Event>} add
   *   Items to add at the index.
   * @returns {undefined}
   *   Nothing.
   */
  addBefore(index2, remove, add) {
    addImplementation(this, index2, remove, add, !0);
  }
  /**
   * Done, change the events.
   *
   * @param {Array<Event>} events
   *   List of events to apply the edits to.
   * @returns {undefined}
   *   Nothing.
   */
  consume(events) {
    if (this.map.sort(function(a, b) {
      return a[0] - b[0];
    }), this.map.length === 0)
      return;
    let index2 = this.map.length, vecs = [];
    for (; index2 > 0; )
      index2 -= 1, vecs.push(events.slice(this.map[index2][0] + this.map[index2][1]), this.map[index2][2]), events.length = this.map[index2][0];
    vecs.push(events.slice()), events.length = 0;
    let slice = vecs.pop();
    for (; slice; ) {
      for (let element of slice)
        events.push(element);
      slice = vecs.pop();
    }
    this.map.length = 0, this.index.clear();
  }
};
function addImplementation(editMap, at, remove, add, before) {
  if (remove === 0 && add.length === 0)
    return;
  let existing = editMap.index.get(at);
  if (existing) {
    existing[1] += remove, before ? (add.push(...existing[2]), existing[2] = add) : existing[2].push(...add);
    return;
  }
  let change = [at, remove, add];
  editMap.map.push(change), editMap.index.set(at, change);
}

// node_modules/micromark/lib/initialize/document.js
var document = {
  tokenize: initializeDocument
}, containerConstruct = {
  tokenize: tokenizeContainer
};
function initializeDocument(effects) {
  let self = this, stack = [], continued = 0, childFlow, childToken, lineStartOffset;
  return start;
  function start(code) {
    if (continued < stack.length) {
      let item = stack[continued];
      return self.containerState = item[1], effects.attempt(item[0].continuation, documentContinue, checkNewContainers)(code);
    }
    return checkNewContainers(code);
  }
  function documentContinue(code) {
    if (continued++, self.containerState._closeFlow) {
      self.containerState._closeFlow = void 0, childFlow && closeFlow();
      let indexBeforeExits = self.events.length, indexBeforeFlow = indexBeforeExits, point3;
      for (; indexBeforeFlow--; )
        if (self.events[indexBeforeFlow][0] === "exit" && self.events[indexBeforeFlow][1].type === "chunkFlow") {
          point3 = self.events[indexBeforeFlow][1].end;
          break;
        }
      exitContainers(continued);
      let index2 = indexBeforeExits;
      for (; index2 < self.events.length; )
        self.events[index2][1].end = {
          ...point3
        }, index2++;
      let editMap = new EditMap();
      return editMap.add(indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits)), editMap.add(indexBeforeExits, index2 - indexBeforeExits, []), editMap.consume(self.events), checkNewContainers(code);
    }
    return start(code);
  }
  function checkNewContainers(code) {
    if (continued === stack.length) {
      if (!childFlow)
        return documentContinued(code);
      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete)
        return flowStart(code);
      self.interrupt = !!(childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack);
    }
    return self.containerState = {}, effects.check(containerConstruct, thereIsANewContainer, thereIsNoNewContainer)(code);
  }
  function thereIsANewContainer(code) {
    return childFlow && closeFlow(), exitContainers(continued), documentContinued(code);
  }
  function thereIsNoNewContainer(code) {
    return self.parser.lazy[self.now().line] = continued !== stack.length, lineStartOffset = self.now().offset, flowStart(code);
  }
  function documentContinued(code) {
    return self.containerState = {}, effects.attempt(containerConstruct, containerContinue, flowStart)(code);
  }
  function containerContinue(code) {
    return continued++, stack.push([self.currentConstruct, self.containerState]), documentContinued(code);
  }
  function flowStart(code) {
    if (code === null) {
      childFlow && closeFlow(), exitContainers(0), effects.consume(code);
      return;
    }
    return childFlow = childFlow || self.parser.flow(self.now()), effects.enter("chunkFlow", {
      _tokenizer: childFlow,
      contentType: "flow",
      previous: childToken
    }), flowContinue(code);
  }
  function flowContinue(code) {
    if (code === null) {
      writeToChild(effects.exit("chunkFlow"), !0), exitContainers(0), effects.consume(code);
      return;
    }
    return markdownLineEnding(code) ? (effects.consume(code), writeToChild(effects.exit("chunkFlow")), continued = 0, self.interrupt = void 0, start) : (effects.consume(code), flowContinue);
  }
  function writeToChild(token, endOfFile) {
    let stream = self.sliceStream(token);
    if (endOfFile && stream.push(null), token.previous = childToken, childToken && (childToken.next = token), childToken = token, childFlow.defineSkip(token.start), childFlow.write(stream), self.parser.lazy[token.start.line]) {
      let index2 = childFlow.events.length;
      for (; index2--; )
        if (
          // The token starts before the line ending…
          childFlow.events[index2][1].start.offset < lineStartOffset && // …and either is not ended yet…
          (!childFlow.events[index2][1].end || // …or ends after it.
          childFlow.events[index2][1].end.offset > lineStartOffset)
        )
          return;
      let indexBeforeExits = self.events.length, indexBeforeFlow = indexBeforeExits, seen, point3;
      for (; indexBeforeFlow--; )
        if (self.events[indexBeforeFlow][0] === "exit" && self.events[indexBeforeFlow][1].type === "chunkFlow") {
          if (seen) {
            point3 = self.events[indexBeforeFlow][1].end;
            break;
          }
          seen = !0;
        }
      for (exitContainers(continued), index2 = indexBeforeExits; index2 < self.events.length; )
        self.events[index2][1].end = {
          ...point3
        }, index2++;
      let editMap = new EditMap();
      editMap.add(indexBeforeFlow + 1, 0, self.events.slice(indexBeforeExits)), editMap.add(indexBeforeExits, index2 - indexBeforeExits, []), editMap.consume(self.events);
    }
  }
  function exitContainers(size) {
    let index2 = stack.length;
    for (; index2-- > size; ) {
      let entry2 = stack[index2];
      self.containerState = entry2[1], entry2[0].exit.call(self, effects);
    }
    stack.length = size;
  }
  function closeFlow() {
    childFlow.write([null]), childToken = void 0, childFlow = void 0, self.containerState._closeFlow = void 0;
  }
}
function tokenizeContainer(effects, ok, nok) {
  return factorySpace(effects, effects.attempt(this.parser.constructs.document, ok, nok), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
}

// node_modules/micromark-util-classify-character/index.js
function classifyCharacter(code) {
  if (code === null || markdownLineEndingOrSpace(code) || unicodeWhitespace(code))
    return 1;
  if (unicodePunctuation(code))
    return 2;
}

// node_modules/micromark-util-resolve-all/index.js
function resolveAll(constructs2, events, context) {
  let called = [], index2 = -1;
  for (; ++index2 < constructs2.length; ) {
    let resolve5 = constructs2[index2].resolveAll;
    resolve5 && !called.includes(resolve5) && (events = resolve5(events, context), called.push(resolve5));
  }
  return events;
}

// node_modules/micromark-core-commonmark/lib/attention.js
var attention = {
  name: "attention",
  resolveAll: resolveAllAttention,
  tokenize: tokenizeAttention
};
function resolveAllAttention(events, context) {
  let index2 = -1, nextEvents;
  for (; ++index2 < events.length; )
    if (events[index2][0] === "enter" && events[index2][1].type === "attentionSequence" && events[index2][1]._close) {
      let open = index2;
      for (; open--; )
        if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && // If the markers are the same:
        context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index2][1]).charCodeAt(0)) {
          if ((events[open][1]._close || events[index2][1]._open) && (events[index2][1].end.offset - events[index2][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index2][1].end.offset - events[index2][1].start.offset) % 3))
            continue;
          let use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index2][1].end.offset - events[index2][1].start.offset > 1 ? 2 : 1, start = {
            ...events[open][1].end
          }, end = {
            ...events[index2][1].start
          };
          movePoint(start, -use), movePoint(end, use);
          let openingSequence = {
            type: use > 1 ? "strongSequence" : "emphasisSequence",
            start,
            end: {
              ...events[open][1].end
            }
          }, closingSequence = {
            type: use > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...events[index2][1].start
            },
            end
          }, text3 = {
            type: use > 1 ? "strongText" : "emphasisText",
            start: {
              ...events[open][1].end
            },
            end: {
              ...events[index2][1].start
            }
          }, group = {
            type: use > 1 ? "strong" : "emphasis",
            start: {
              ...openingSequence.start
            },
            end: {
              ...closingSequence.end
            }
          };
          events[open][1].end = {
            ...openingSequence.start
          }, events[index2][1].start = {
            ...closingSequence.end
          }, nextEvents = [], events[open][1].end.offset - events[open][1].start.offset && (nextEvents = push(nextEvents, [["enter", events[open][1], context], ["exit", events[open][1], context]])), nextEvents = push(nextEvents, [["enter", group, context], ["enter", openingSequence, context], ["exit", openingSequence, context], ["enter", text3, context]]), nextEvents = push(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index2), context)), nextEvents = push(nextEvents, [["exit", text3, context], ["enter", closingSequence, context], ["exit", closingSequence, context], ["exit", group, context]]);
          let offset = 0;
          events[index2][1].end.offset - events[index2][1].start.offset && (offset = 2, nextEvents = push(nextEvents, [["enter", events[index2][1], context], ["exit", events[index2][1], context]])), splice(events, open - 1, index2 - open + 3, nextEvents), index2 = open + nextEvents.length - offset - 2;
          break;
        }
    }
  for (index2 = -1; ++index2 < events.length; )
    events[index2][1].type === "attentionSequence" && (events[index2][1].type = "data");
  return events;
}
function tokenizeAttention(effects, ok) {
  let attentionMarkers2 = this.parser.constructs.attentionMarkers.null, previous2 = this.previous, before = classifyCharacter(previous2), marker;
  return start;
  function start(code) {
    return marker = code, effects.enter("attentionSequence"), inside(code);
  }
  function inside(code) {
    if (code === marker)
      return effects.consume(code), inside;
    let token = effects.exit("attentionSequence"), after = classifyCharacter(code), open = !after || after === 2 && before || attentionMarkers2.includes(code) && code !== 42 && code !== 95, close = !before || before === 2 && after || attentionMarkers2.includes(previous2) && previous2 !== 42 && previous2 !== 95;
    return token._open = !!(marker === 42 ? open : open && (before || !close)), token._close = !!(marker === 42 ? close : close && (after || !open)), ok(code);
  }
}
function movePoint(point3, offset) {
  point3.column += offset, point3.offset += offset, point3._bufferIndex += offset;
}

// node_modules/micromark-core-commonmark/lib/autolink.js
var autolink = {
  name: "autolink",
  tokenize: tokenizeAutolink
};
function tokenizeAutolink(effects, ok, nok) {
  let size = 0;
  return start;
  function start(code) {
    return effects.enter("autolink"), effects.enter("autolinkMarker"), effects.consume(code), effects.exit("autolinkMarker"), effects.enter("autolinkProtocol"), open;
  }
  function open(code) {
    return asciiAlpha(code) ? (effects.consume(code), schemeOrEmailAtext) : code === 64 ? nok(code) : emailAtext(code);
  }
  function schemeOrEmailAtext(code) {
    return code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code) ? (size = 1, schemeInsideOrEmailAtext(code)) : emailAtext(code);
  }
  function schemeInsideOrEmailAtext(code) {
    return code === 58 ? (effects.consume(code), size = 0, urlInside) : (code === 43 || code === 45 || code === 46 || asciiAlphanumeric(code)) && size++ < 32 ? (effects.consume(code), schemeInsideOrEmailAtext) : (size = 0, emailAtext(code));
  }
  function urlInside(code) {
    return code === 62 ? (effects.exit("autolinkProtocol"), effects.enter("autolinkMarker"), effects.consume(code), effects.exit("autolinkMarker"), effects.exit("autolink"), ok) : code === null || code === 32 || code === 60 || asciiControl(code) ? nok(code) : (effects.consume(code), urlInside);
  }
  function emailAtext(code) {
    return code === 64 ? (effects.consume(code), emailAtSignOrDot) : asciiAtext(code) ? (effects.consume(code), emailAtext) : nok(code);
  }
  function emailAtSignOrDot(code) {
    return asciiAlphanumeric(code) ? emailLabel(code) : nok(code);
  }
  function emailLabel(code) {
    return code === 46 ? (effects.consume(code), size = 0, emailAtSignOrDot) : code === 62 ? (effects.exit("autolinkProtocol").type = "autolinkEmail", effects.enter("autolinkMarker"), effects.consume(code), effects.exit("autolinkMarker"), effects.exit("autolink"), ok) : emailValue(code);
  }
  function emailValue(code) {
    if ((code === 45 || asciiAlphanumeric(code)) && size++ < 63) {
      let next = code === 45 ? emailValue : emailLabel;
      return effects.consume(code), next;
    }
    return nok(code);
  }
}

// node_modules/micromark-core-commonmark/lib/blank-line.js
var blankLine = {
  partial: !0,
  tokenize: tokenizeBlankLine
};
function tokenizeBlankLine(effects, ok, nok) {
  return start;
  function start(code) {
    return markdownSpace(code) ? factorySpace(effects, after, "linePrefix")(code) : after(code);
  }
  function after(code) {
    return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
  }
}

// node_modules/micromark-core-commonmark/lib/block-quote.js
var blockQuote = {
  continuation: {
    tokenize: tokenizeBlockQuoteContinuation
  },
  exit,
  name: "blockQuote",
  tokenize: tokenizeBlockQuoteStart
};
function tokenizeBlockQuoteStart(effects, ok, nok) {
  let self = this;
  return start;
  function start(code) {
    if (code === 62) {
      let state = self.containerState;
      return state.open || (effects.enter("blockQuote", {
        _container: !0
      }), state.open = !0), effects.enter("blockQuotePrefix"), effects.enter("blockQuoteMarker"), effects.consume(code), effects.exit("blockQuoteMarker"), after;
    }
    return nok(code);
  }
  function after(code) {
    return markdownSpace(code) ? (effects.enter("blockQuotePrefixWhitespace"), effects.consume(code), effects.exit("blockQuotePrefixWhitespace"), effects.exit("blockQuotePrefix"), ok) : (effects.exit("blockQuotePrefix"), ok(code));
  }
}
function tokenizeBlockQuoteContinuation(effects, ok, nok) {
  let self = this;
  return contStart;
  function contStart(code) {
    return markdownSpace(code) ? factorySpace(effects, contBefore, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code) : contBefore(code);
  }
  function contBefore(code) {
    return effects.attempt(blockQuote, ok, nok)(code);
  }
}
function exit(effects) {
  effects.exit("blockQuote");
}

// node_modules/micromark-core-commonmark/lib/character-escape.js
var characterEscape = {
  name: "characterEscape",
  tokenize: tokenizeCharacterEscape
};
function tokenizeCharacterEscape(effects, ok, nok) {
  return start;
  function start(code) {
    return effects.enter("characterEscape"), effects.enter("escapeMarker"), effects.consume(code), effects.exit("escapeMarker"), inside;
  }
  function inside(code) {
    return asciiPunctuation(code) ? (effects.enter("characterEscapeValue"), effects.consume(code), effects.exit("characterEscapeValue"), effects.exit("characterEscape"), ok) : nok(code);
  }
}

// node_modules/micromark-core-commonmark/lib/character-reference.js
var characterReference = {
  name: "characterReference",
  tokenize: tokenizeCharacterReference
};
function tokenizeCharacterReference(effects, ok, nok) {
  let self = this, size = 0, max, test;
  return start;
  function start(code) {
    return effects.enter("characterReference"), effects.enter("characterReferenceMarker"), effects.consume(code), effects.exit("characterReferenceMarker"), open;
  }
  function open(code) {
    return code === 35 ? (effects.enter("characterReferenceMarkerNumeric"), effects.consume(code), effects.exit("characterReferenceMarkerNumeric"), numeric) : (effects.enter("characterReferenceValue"), max = 31, test = asciiAlphanumeric, value(code));
  }
  function numeric(code) {
    return code === 88 || code === 120 ? (effects.enter("characterReferenceMarkerHexadecimal"), effects.consume(code), effects.exit("characterReferenceMarkerHexadecimal"), effects.enter("characterReferenceValue"), max = 6, test = asciiHexDigit, value) : (effects.enter("characterReferenceValue"), max = 7, test = asciiDigit, value(code));
  }
  function value(code) {
    if (code === 59 && size) {
      let token = effects.exit("characterReferenceValue");
      return test === asciiAlphanumeric && !decodeNamedCharacterReference(self.sliceSerialize(token)) ? nok(code) : (effects.enter("characterReferenceMarker"), effects.consume(code), effects.exit("characterReferenceMarker"), effects.exit("characterReference"), ok);
    }
    return test(code) && size++ < max ? (effects.consume(code), value) : nok(code);
  }
}

// node_modules/micromark-core-commonmark/lib/partial-non-lazy-continuation.js
var nonLazyContinuation = {
  partial: !0,
  tokenize: tokenizeNonLazyContinuation
};
function tokenizeNonLazyContinuation(effects, ok, nok) {
  let self = this;
  return start;
  function start(code) {
    return code === null ? nok(code) : (effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), after);
  }
  function after(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
  }
}

// node_modules/micromark-core-commonmark/lib/code-fenced.js
var codeFenced = {
  concrete: !0,
  name: "codeFenced",
  tokenize: tokenizeCodeFenced
};
function tokenizeCodeFenced(effects, ok, nok) {
  let self = this, closeStart = {
    partial: !0,
    tokenize: tokenizeCloseStart
  }, initialPrefix = 0, sizeOpen = 0, marker;
  return start;
  function start(code) {
    return beforeSequenceOpen(code);
  }
  function beforeSequenceOpen(code) {
    let tail = self.events[self.events.length - 1];
    return initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], !0).length : 0, marker = code, effects.enter("codeFenced"), effects.enter("codeFencedFence"), effects.enter("codeFencedFenceSequence"), sequenceOpen(code);
  }
  function sequenceOpen(code) {
    return code === marker ? (sizeOpen++, effects.consume(code), sequenceOpen) : sizeOpen < 3 ? nok(code) : (effects.exit("codeFencedFenceSequence"), markdownSpace(code) ? factorySpace(effects, infoBefore, "whitespace")(code) : infoBefore(code));
  }
  function infoBefore(code) {
    return code === null || markdownLineEnding(code) ? (effects.exit("codeFencedFence"), self.interrupt ? ok(code) : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code)) : (effects.enter("codeFencedFenceInfo"), effects.enter("chunkString", {
      contentType: "string"
    }), info(code));
  }
  function info(code) {
    return code === null || markdownLineEnding(code) ? (effects.exit("chunkString"), effects.exit("codeFencedFenceInfo"), infoBefore(code)) : markdownSpace(code) ? (effects.exit("chunkString"), effects.exit("codeFencedFenceInfo"), factorySpace(effects, metaBefore, "whitespace")(code)) : code === 96 && code === marker ? nok(code) : (effects.consume(code), info);
  }
  function metaBefore(code) {
    return code === null || markdownLineEnding(code) ? infoBefore(code) : (effects.enter("codeFencedFenceMeta"), effects.enter("chunkString", {
      contentType: "string"
    }), meta(code));
  }
  function meta(code) {
    return code === null || markdownLineEnding(code) ? (effects.exit("chunkString"), effects.exit("codeFencedFenceMeta"), infoBefore(code)) : code === 96 && code === marker ? nok(code) : (effects.consume(code), meta);
  }
  function atNonLazyBreak(code) {
    return effects.attempt(closeStart, after, contentBefore)(code);
  }
  function contentBefore(code) {
    return effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), contentStart;
  }
  function contentStart(code) {
    return initialPrefix > 0 && markdownSpace(code) ? factorySpace(effects, beforeContentChunk, "linePrefix", initialPrefix + 1)(code) : beforeContentChunk(code);
  }
  function beforeContentChunk(code) {
    return code === null || markdownLineEnding(code) ? effects.check(nonLazyContinuation, atNonLazyBreak, after)(code) : (effects.enter("codeFlowValue"), contentChunk(code));
  }
  function contentChunk(code) {
    return code === null || markdownLineEnding(code) ? (effects.exit("codeFlowValue"), beforeContentChunk(code)) : (effects.consume(code), contentChunk);
  }
  function after(code) {
    return effects.exit("codeFenced"), ok(code);
  }
  function tokenizeCloseStart(effects2, ok2, nok2) {
    let size = 0;
    return startBefore;
    function startBefore(code) {
      return effects2.enter("lineEnding"), effects2.consume(code), effects2.exit("lineEnding"), start2;
    }
    function start2(code) {
      return effects2.enter("codeFencedFence"), markdownSpace(code) ? factorySpace(effects2, beforeSequenceClose, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code) : beforeSequenceClose(code);
    }
    function beforeSequenceClose(code) {
      return code === marker ? (effects2.enter("codeFencedFenceSequence"), sequenceClose(code)) : nok2(code);
    }
    function sequenceClose(code) {
      return code === marker ? (size++, effects2.consume(code), sequenceClose) : size >= sizeOpen ? (effects2.exit("codeFencedFenceSequence"), markdownSpace(code) ? factorySpace(effects2, sequenceCloseAfter, "whitespace")(code) : sequenceCloseAfter(code)) : nok2(code);
    }
    function sequenceCloseAfter(code) {
      return code === null || markdownLineEnding(code) ? (effects2.exit("codeFencedFence"), ok2(code)) : nok2(code);
    }
  }
}

// node_modules/micromark-core-commonmark/lib/code-indented.js
var codeIndented = {
  name: "codeIndented",
  tokenize: tokenizeCodeIndented
}, furtherStart = {
  partial: !0,
  tokenize: tokenizeFurtherStart
};
function tokenizeCodeIndented(effects, ok, nok) {
  return start;
  function start(code) {
    return effects.enter("codeIndented"), factorySpaceMinMax(effects, atBreak, nok, "linePrefix", 4, 4)(code);
  }
  function atBreak(code) {
    return code === null ? after(code) : markdownLineEnding(code) ? effects.attempt(furtherStart, atBreak, after)(code) : (effects.enter("codeFlowValue"), inside(code));
  }
  function inside(code) {
    return code === null || markdownLineEnding(code) ? (effects.exit("codeFlowValue"), atBreak(code)) : (effects.consume(code), inside);
  }
  function after(code) {
    return effects.exit("codeIndented"), ok(code);
  }
}
function tokenizeFurtherStart(effects, ok, nok) {
  let self = this;
  return furtherStart2;
  function furtherStart2(code) {
    return self.parser.lazy[self.now().line] ? nok(code) : markdownLineEnding(code) ? (effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), furtherStart2) : factorySpaceMinMax(effects, ok, onNotEnoughPrefix, "linePrefix", 4, 4)(code);
  }
  function onNotEnoughPrefix(code) {
    return markdownLineEnding(code) ? furtherStart2(code) : nok(code);
  }
}

// node_modules/micromark-core-commonmark/lib/code-text.js
var codeText = {
  name: "codeText",
  previous,
  resolve: resolveCodeText,
  tokenize: tokenizeCodeText
};
function resolveCodeText(events) {
  let tailExitIndex = events.length - 4, headEnterIndex = 3, index2, enter;
  if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
    for (index2 = headEnterIndex; ++index2 < tailExitIndex; )
      if (events[index2][1].type === "codeTextData") {
        events[headEnterIndex][1].type = "codeTextPadding", events[tailExitIndex][1].type = "codeTextPadding", headEnterIndex += 2, tailExitIndex -= 2;
        break;
      }
  }
  for (index2 = headEnterIndex - 1, tailExitIndex++; ++index2 <= tailExitIndex; )
    enter === void 0 ? index2 !== tailExitIndex && events[index2][1].type !== "lineEnding" && (enter = index2) : (index2 === tailExitIndex || events[index2][1].type === "lineEnding") && (events[enter][1].type = "codeTextData", index2 !== enter + 2 && (events[enter][1].end = events[index2 - 1][1].end, events.splice(enter + 2, index2 - enter - 2), tailExitIndex -= index2 - enter - 2, index2 = enter + 2), enter = void 0);
  return events;
}
function previous(code) {
  return code !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function tokenizeCodeText(effects, ok, nok) {
  let self = this, sizeOpen = 0, size, token;
  return start;
  function start(code) {
    return effects.enter("codeText"), effects.enter("codeTextSequence"), sequenceOpen(code);
  }
  function sequenceOpen(code) {
    return code === 96 ? (effects.consume(code), sizeOpen++, sequenceOpen) : (effects.exit("codeTextSequence"), between(code));
  }
  function between(code) {
    return code === null ? nok(code) : code === 32 ? (effects.enter("space"), effects.consume(code), effects.exit("space"), between) : code === 96 ? (token = effects.enter("codeTextSequence"), size = 0, sequenceClose(code)) : markdownLineEnding(code) ? (effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), between) : (effects.enter("codeTextData"), data(code));
  }
  function data(code) {
    return code === null || code === 32 || code === 96 || markdownLineEnding(code) ? (effects.exit("codeTextData"), between(code)) : (effects.consume(code), data);
  }
  function sequenceClose(code) {
    return code === 96 ? (effects.consume(code), size++, sequenceClose) : size === sizeOpen ? (effects.exit("codeTextSequence"), effects.exit("codeText"), ok(code)) : (token.type = "codeTextData", data(code));
  }
}

// node_modules/micromark-util-subtokenize/lib/splice-buffer.js
var SpliceBuffer = class {
  /**
   * @param {ReadonlyArray<T> | null | undefined} [initial]
   *   Initial items (optional).
   * @returns
   *   Splice buffer.
   */
  constructor(initial) {
    this.left = initial ? [...initial] : [], this.right = [];
  }
  /**
   * Array access;
   * does not move the cursor.
   *
   * @param {number} index
   *   Index.
   * @return {T}
   *   Item.
   */
  get(index2) {
    if (index2 < 0 || index2 >= this.left.length + this.right.length)
      throw new RangeError("Cannot access index `" + index2 + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
    return index2 < this.left.length ? this.left[index2] : this.right[this.right.length - index2 + this.left.length - 1];
  }
  /**
   * The length of the splice buffer, one greater than the largest index in the
   * array.
   */
  get length() {
    return this.left.length + this.right.length;
  }
  /**
   * Remove and return `list[0]`;
   * moves the cursor to `0`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  shift() {
    return this.setCursor(0), this.right.pop();
  }
  /**
   * Slice the buffer to get an array;
   * does not move the cursor.
   *
   * @param {number} start
   *   Start.
   * @param {number | null | undefined} [end]
   *   End (optional).
   * @returns {Array<T>}
   *   Array of items.
   */
  slice(start, end) {
    let stop = end ?? Number.POSITIVE_INFINITY;
    return stop < this.left.length ? this.left.slice(start, stop) : start > this.left.length ? this.right.slice(this.right.length - stop + this.left.length, this.right.length - start + this.left.length).reverse() : this.left.slice(start).concat(this.right.slice(this.right.length - stop + this.left.length).reverse());
  }
  /**
   * Mimics the behavior of Array.prototype.splice() except for the change of
   * interface necessary to avoid segfaults when patching in very large arrays.
   *
   * This operation moves cursor is moved to `start` and results in the cursor
   * placed after any inserted items.
   *
   * @param {number} start
   *   Start;
   *   zero-based index at which to start changing the array;
   *   negative numbers count backwards from the end of the array and values
   *   that are out-of bounds are clamped to the appropriate end of the array.
   * @param {number | null | undefined} [deleteCount=0]
   *   Delete count (default: `0`);
   *   maximum number of elements to delete, starting from start.
   * @param {Array<T> | null | undefined} [items=[]]
   *   Items to include in place of the deleted items (default: `[]`).
   * @return {Array<T>}
   *   Any removed items.
   */
  splice(start, deleteCount, items) {
    let count = deleteCount || 0;
    this.setCursor(Math.trunc(start));
    let removed = this.right.splice(this.right.length - count, Number.POSITIVE_INFINITY);
    return items && chunkedPush(this.left, items), removed.reverse();
  }
  /**
   * Remove and return the highest-numbered item in the array, so
   * `list[list.length - 1]`;
   * Moves the cursor to `length`.
   *
   * @returns {T | undefined}
   *   Item, optional.
   */
  pop() {
    return this.setCursor(Number.POSITIVE_INFINITY), this.left.pop();
  }
  /**
   * Inserts a single item to the high-numbered side of the array;
   * moves the cursor to `length`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  push(item) {
    this.setCursor(Number.POSITIVE_INFINITY), this.left.push(item);
  }
  /**
   * Inserts many items to the high-numbered side of the array.
   * Moves the cursor to `length`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  pushMany(items) {
    this.setCursor(Number.POSITIVE_INFINITY), chunkedPush(this.left, items);
  }
  /**
   * Inserts a single item to the low-numbered side of the array;
   * Moves the cursor to `0`.
   *
   * @param {T} item
   *   Item.
   * @returns {undefined}
   *   Nothing.
   */
  unshift(item) {
    this.setCursor(0), this.right.push(item);
  }
  /**
   * Inserts many items to the low-numbered side of the array;
   * moves the cursor to `0`.
   *
   * @param {Array<T>} items
   *   Items.
   * @returns {undefined}
   *   Nothing.
   */
  unshiftMany(items) {
    this.setCursor(0), chunkedPush(this.right, items.reverse());
  }
  /**
   * Move the cursor to a specific position in the array. Requires
   * time proportional to the distance moved.
   *
   * If `n < 0`, the cursor will end up at the beginning.
   * If `n > length`, the cursor will end up at the end.
   *
   * @param {number} n
   *   Position.
   * @return {undefined}
   *   Nothing.
   */
  setCursor(n) {
    if (!(n === this.left.length || n > this.left.length && this.right.length === 0 || n < 0 && this.left.length === 0))
      if (n < this.left.length) {
        let removed = this.left.splice(n, Number.POSITIVE_INFINITY);
        chunkedPush(this.right, removed.reverse());
      } else {
        let removed = this.right.splice(this.left.length + this.right.length - n, Number.POSITIVE_INFINITY);
        chunkedPush(this.left, removed.reverse());
      }
  }
};
function chunkedPush(list3, right) {
  let chunkStart = 0;
  if (right.length < 1e4)
    list3.push(...right);
  else
    for (; chunkStart < right.length; )
      list3.push(...right.slice(chunkStart, chunkStart + 1e4)), chunkStart += 1e4;
}

// node_modules/micromark-util-subtokenize/index.js
function subtokenize(eventsArray) {
  let jumps = {}, index2 = -1, event, lineIndex, otherIndex, otherEvent, parameters, subevents, more, events = new SpliceBuffer(eventsArray);
  for (; ++index2 < events.length; ) {
    for (; index2 in jumps; )
      index2 = jumps[index2];
    if (event = events.get(index2), index2 && event[1].type === "chunkFlow" && events.get(index2 - 1)[1].type === "listItemPrefix" && (subevents = event[1]._tokenizer.events, otherIndex = 0, otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank" && (otherIndex += 2), otherIndex < subevents.length && subevents[otherIndex][1].type === "content"))
      for (; ++otherIndex < subevents.length && subevents[otherIndex][1].type !== "content"; )
        subevents[otherIndex][1].type === "chunkText" && (subevents[otherIndex][1]._isInFirstContentOfListItem = !0, otherIndex++);
    if (event[0] === "enter")
      event[1].contentType && (Object.assign(jumps, subcontent(events, index2)), index2 = jumps[index2], more = !0);
    else if (event[1]._container) {
      for (otherIndex = index2, lineIndex = void 0; otherIndex--; )
        if (otherEvent = events.get(otherIndex), otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank")
          otherEvent[0] === "enter" && (lineIndex && (events.get(lineIndex)[1].type = "lineEndingBlank"), otherEvent[1].type = "lineEnding", lineIndex = otherIndex);
        else if (!(otherEvent[1].type === "linePrefix" || otherEvent[1].type === "listItemIndent"))
          break;
      lineIndex && (event[1].end = {
        ...events.get(lineIndex)[1].start
      }, parameters = events.slice(lineIndex, index2), parameters.unshift(event), events.splice(lineIndex, index2 - lineIndex + 1, parameters));
    }
  }
  return splice(eventsArray, 0, Number.POSITIVE_INFINITY, events.slice(0)), !more;
}
function subcontent(events, eventIndex) {
  let token = events.get(eventIndex)[1], context = events.get(eventIndex)[2], startPosition = eventIndex - 1, startPositions = [], tokenizer = token._tokenizer;
  tokenizer || (tokenizer = context.parser[token.contentType](token.start), token._contentTypeTextTrailing && (tokenizer._contentTypeTextTrailing = !0));
  let childEvents = tokenizer.events, jumps = [], gaps = {}, stream, previous2, index2 = -1, current = token, adjust = 0, start = 0, breaks = [start];
  for (; current; ) {
    for (; events.get(++startPosition)[1] !== current; )
      ;
    startPositions.push(startPosition), current._tokenizer || (stream = context.sliceStream(current), current.next || stream.push(null), previous2 && tokenizer.defineSkip(current.start), current._isInFirstContentOfListItem && (tokenizer._gfmTasklistFirstContentOfListItem = !0), tokenizer.write(stream), current._isInFirstContentOfListItem && (tokenizer._gfmTasklistFirstContentOfListItem = void 0)), previous2 = current, current = current.next;
  }
  for (current = token; ++index2 < childEvents.length; )
    // Find a void token that includes a break.
    childEvents[index2][0] === "exit" && childEvents[index2 - 1][0] === "enter" && childEvents[index2][1].type === childEvents[index2 - 1][1].type && childEvents[index2][1].start.line !== childEvents[index2][1].end.line && (start = index2 + 1, breaks.push(start), current._tokenizer = void 0, current.previous = void 0, current = current.next);
  for (tokenizer.events = [], current ? (current._tokenizer = void 0, current.previous = void 0) : breaks.pop(), index2 = breaks.length; index2--; ) {
    let slice = childEvents.slice(breaks[index2], breaks[index2 + 1]), start2 = startPositions.pop();
    jumps.push([start2, start2 + slice.length - 1]), events.splice(start2, 2, slice);
  }
  for (jumps.reverse(), index2 = -1; ++index2 < jumps.length; )
    gaps[adjust + jumps[index2][0]] = adjust + jumps[index2][1], adjust += jumps[index2][1] - jumps[index2][0] - 1;
  return gaps;
}

// node_modules/micromark-core-commonmark/lib/content.js
var content2 = {
  resolve: resolveContent,
  tokenize: tokenizeContent
}, continuationConstruct = {
  partial: !0,
  tokenize: tokenizeContinuation
};
function resolveContent(events) {
  return subtokenize(events), events;
}
function tokenizeContent(effects, ok) {
  let previous2;
  return chunkStart;
  function chunkStart(code) {
    return effects.enter("content"), previous2 = effects.enter("chunkContent", {
      contentType: "content"
    }), chunkInside(code);
  }
  function chunkInside(code) {
    return code === null ? contentEnd(code) : markdownLineEnding(code) ? effects.check(continuationConstruct, contentContinue, contentEnd)(code) : (effects.consume(code), chunkInside);
  }
  function contentEnd(code) {
    return effects.exit("chunkContent"), effects.exit("content"), ok(code);
  }
  function contentContinue(code) {
    return effects.consume(code), effects.exit("chunkContent"), previous2.next = effects.enter("chunkContent", {
      contentType: "content",
      previous: previous2
    }), previous2 = previous2.next, chunkInside;
  }
}
function tokenizeContinuation(effects, ok, nok) {
  let self = this;
  return startLookahead;
  function startLookahead(code) {
    return effects.exit("chunkContent"), effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), factorySpace(effects, prefixed, "linePrefix");
  }
  function prefixed(code) {
    if (code === null || markdownLineEnding(code))
      return nok(code);
    let tail = self.events[self.events.length - 1];
    return !self.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], !0).length >= 4 ? ok(code) : effects.interrupt(self.parser.constructs.flow, nok, ok)(code);
  }
}

// node_modules/micromark-factory-destination/index.js
function factoryDestination(effects, ok, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
  let limit = max || Number.POSITIVE_INFINITY, balance = 0;
  return start;
  function start(code) {
    return code === 60 ? (effects.enter(type), effects.enter(literalType), effects.enter(literalMarkerType), effects.consume(code), effects.exit(literalMarkerType), enclosedBefore) : code === null || code === 32 || code === 41 || asciiControl(code) ? nok(code) : (effects.enter(type), effects.enter(rawType), effects.enter(stringType), effects.enter("chunkString", {
      contentType: "string"
    }), raw(code));
  }
  function enclosedBefore(code) {
    return code === 62 ? (effects.enter(literalMarkerType), effects.consume(code), effects.exit(literalMarkerType), effects.exit(literalType), effects.exit(type), ok) : (effects.enter(stringType), effects.enter("chunkString", {
      contentType: "string"
    }), enclosed(code));
  }
  function enclosed(code) {
    return code === 62 ? (effects.exit("chunkString"), effects.exit(stringType), enclosedBefore(code)) : code === null || code === 60 || markdownLineEnding(code) ? nok(code) : (effects.consume(code), code === 92 ? enclosedEscape : enclosed);
  }
  function enclosedEscape(code) {
    return code === 60 || code === 62 || code === 92 ? (effects.consume(code), enclosed) : enclosed(code);
  }
  function raw(code) {
    return !balance && (code === null || code === 41 || markdownLineEndingOrSpace(code)) ? (effects.exit("chunkString"), effects.exit(stringType), effects.exit(rawType), effects.exit(type), ok(code)) : balance < limit && code === 40 ? (effects.consume(code), balance++, raw) : code === 41 ? (effects.consume(code), balance--, raw) : code === null || code === 32 || code === 40 || asciiControl(code) ? nok(code) : (effects.consume(code), code === 92 ? rawEscape : raw);
  }
  function rawEscape(code) {
    return code === 40 || code === 41 || code === 92 ? (effects.consume(code), raw) : raw(code);
  }
}

// node_modules/micromark-factory-label/index.js
function factoryLabel(effects, ok, nok, type, markerType, stringType) {
  let self = this, size = 0, seen;
  return start;
  function start(code) {
    return effects.enter(type), effects.enter(markerType), effects.consume(code), effects.exit(markerType), effects.enter(stringType), atBreak;
  }
  function atBreak(code) {
    return size > 999 || code === null || code === 91 || code === 93 && !seen || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    code === 94 && !size && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code) : code === 93 ? (effects.exit(stringType), effects.enter(markerType), effects.consume(code), effects.exit(markerType), effects.exit(type), ok) : markdownLineEnding(code) ? (effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), atBreak) : (effects.enter("chunkString", {
      contentType: "string"
    }), labelInside(code));
  }
  function labelInside(code) {
    return code === null || code === 91 || code === 93 || markdownLineEnding(code) || size++ > 999 ? (effects.exit("chunkString"), atBreak(code)) : (effects.consume(code), seen || (seen = !markdownSpace(code)), code === 92 ? labelEscape : labelInside);
  }
  function labelEscape(code) {
    return code === 91 || code === 92 || code === 93 ? (effects.consume(code), size++, labelInside) : labelInside(code);
  }
}

// node_modules/micromark-factory-title/index.js
function factoryTitle(effects, ok, nok, type, markerType, stringType) {
  let marker;
  return start;
  function start(code) {
    return code === 34 || code === 39 || code === 40 ? (effects.enter(type), effects.enter(markerType), effects.consume(code), effects.exit(markerType), marker = code === 40 ? 41 : code, begin) : nok(code);
  }
  function begin(code) {
    return code === marker ? (effects.enter(markerType), effects.consume(code), effects.exit(markerType), effects.exit(type), ok) : (effects.enter(stringType), atBreak(code));
  }
  function atBreak(code) {
    return code === marker ? (effects.exit(stringType), begin(marker)) : code === null ? nok(code) : markdownLineEnding(code) ? (effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), factorySpace(effects, atBreak, "linePrefix")) : (effects.enter("chunkString", {
      contentType: "string"
    }), inside(code));
  }
  function inside(code) {
    return code === marker || code === null || markdownLineEnding(code) ? (effects.exit("chunkString"), atBreak(code)) : (effects.consume(code), code === 92 ? escape : inside);
  }
  function escape(code) {
    return code === marker || code === 92 ? (effects.consume(code), inside) : inside(code);
  }
}

// node_modules/micromark-factory-whitespace/index.js
function factoryWhitespace(effects, ok) {
  let seen;
  return start;
  function start(code) {
    return markdownLineEnding(code) ? (effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), seen = !0, start) : markdownSpace(code) ? factorySpace(effects, start, seen ? "linePrefix" : "lineSuffix")(code) : ok(code);
  }
}

// node_modules/micromark-core-commonmark/lib/definition.js
var definition = {
  name: "definition",
  tokenize: tokenizeDefinition
}, titleBefore = {
  partial: !0,
  tokenize: tokenizeTitleBefore
};
function tokenizeDefinition(effects, ok, nok) {
  let self = this, identifier;
  return start;
  function start(code) {
    return effects.enter("definition"), before(code);
  }
  function before(code) {
    return factoryLabel.call(
      self,
      effects,
      labelAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(code);
  }
  function labelAfter(code) {
    return identifier = normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1)), code === 58 ? (effects.enter("definitionMarker"), effects.consume(code), effects.exit("definitionMarker"), markerAfter) : nok(code);
  }
  function markerAfter(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, destinationBefore)(code) : destinationBefore(code);
  }
  function destinationBefore(code) {
    return factoryDestination(
      effects,
      destinationAfter,
      // Note: we don’t need to reset the way `markdown-rs` does.
      nok,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(code);
  }
  function destinationAfter(code) {
    return effects.attempt(titleBefore, after, after)(code);
  }
  function after(code) {
    return markdownSpace(code) ? factorySpace(effects, afterWhitespace, "whitespace")(code) : afterWhitespace(code);
  }
  function afterWhitespace(code) {
    return code === null || markdownLineEnding(code) ? (effects.exit("definition"), self.parser.defined.push(identifier), ok(code)) : nok(code);
  }
}
function tokenizeTitleBefore(effects, ok, nok) {
  return titleBefore2;
  function titleBefore2(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, beforeMarker)(code) : nok(code);
  }
  function beforeMarker(code) {
    return factoryTitle(effects, titleAfter, nok, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(code);
  }
  function titleAfter(code) {
    return markdownSpace(code) ? factorySpace(effects, titleAfterOptionalWhitespace, "whitespace")(code) : titleAfterOptionalWhitespace(code);
  }
  function titleAfterOptionalWhitespace(code) {
    return code === null || markdownLineEnding(code) ? ok(code) : nok(code);
  }
}

// node_modules/micromark-core-commonmark/lib/hard-break-escape.js
var hardBreakEscape = {
  name: "hardBreakEscape",
  tokenize: tokenizeHardBreakEscape
};
function tokenizeHardBreakEscape(effects, ok, nok) {
  return start;
  function start(code) {
    return effects.enter("hardBreakEscape"), effects.consume(code), after;
  }
  function after(code) {
    return markdownLineEnding(code) ? (effects.exit("hardBreakEscape"), ok(code)) : nok(code);
  }
}

// node_modules/micromark-core-commonmark/lib/heading-atx.js
var headingAtx = {
  name: "headingAtx",
  resolve: resolveHeadingAtx,
  tokenize: tokenizeHeadingAtx
};
function resolveHeadingAtx(events, context) {
  let contentEnd = events.length - 2, contentStart = 3;
  if (events[contentStart][1].type === "whitespace" && (contentStart += 2), contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace" && (contentEnd -= 2), events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace") && (contentEnd -= contentStart + 1 === contentEnd ? 2 : 4), contentEnd > contentStart) {
    let content3 = {
      type: "atxHeadingText",
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end
    }, text3 = {
      type: "chunkText",
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      contentType: "text"
    };
    splice(events, contentStart, contentEnd - contentStart + 1, [["enter", content3, context], ["enter", text3, context], ["exit", text3, context], ["exit", content3, context]]);
  }
  return events;
}
function tokenizeHeadingAtx(effects, ok, nok) {
  let size = 0;
  return start;
  function start(code) {
    return effects.enter("atxHeading"), before(code);
  }
  function before(code) {
    return effects.enter("atxHeadingSequence"), sequenceOpen(code);
  }
  function sequenceOpen(code) {
    return code === 35 && size++ < 6 ? (effects.consume(code), sequenceOpen) : code === null || markdownLineEndingOrSpace(code) ? (effects.exit("atxHeadingSequence"), atBreak(code)) : nok(code);
  }
  function atBreak(code) {
    return code === 35 ? (effects.enter("atxHeadingSequence"), sequenceFurther(code)) : code === null || markdownLineEnding(code) ? (effects.exit("atxHeading"), ok(code)) : markdownSpace(code) ? factorySpace(effects, atBreak, "whitespace")(code) : (effects.enter("atxHeadingText"), data(code));
  }
  function sequenceFurther(code) {
    return code === 35 ? (effects.consume(code), sequenceFurther) : (effects.exit("atxHeadingSequence"), atBreak(code));
  }
  function data(code) {
    return code === null || code === 35 || markdownLineEndingOrSpace(code) ? (effects.exit("atxHeadingText"), atBreak(code)) : (effects.consume(code), data);
  }
}

// node_modules/micromark-util-html-tag-name/index.js
var htmlBlockNames = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], htmlRawNames = ["pre", "script", "style", "textarea"];

// node_modules/micromark-core-commonmark/lib/html-flow.js
var htmlFlow = {
  concrete: !0,
  name: "htmlFlow",
  resolveTo: resolveToHtmlFlow,
  tokenize: tokenizeHtmlFlow
}, blankLineBefore = {
  partial: !0,
  tokenize: tokenizeBlankLineBefore
};
function resolveToHtmlFlow(events) {
  let index2 = events.length;
  for (; index2-- && !(events[index2][0] === "enter" && events[index2][1].type === "htmlFlow"); )
    ;
  return index2 > 1 && events[index2 - 2][1].type === "linePrefix" && (events[index2][1].start = events[index2 - 2][1].start, events[index2 + 1][1].start = events[index2 - 2][1].start, events.splice(index2 - 2, 2)), events;
}
function tokenizeHtmlFlow(effects, ok, nok) {
  let self = this, marker, closingTag, buffer, index2, markerB;
  return start;
  function start(code) {
    return before(code);
  }
  function before(code) {
    return effects.enter("htmlFlow"), effects.enter("htmlFlowData"), effects.consume(code), open;
  }
  function open(code) {
    return code === 33 ? (effects.consume(code), declarationOpen) : code === 47 ? (effects.consume(code), closingTag = !0, tagCloseStart) : code === 63 ? (effects.consume(code), marker = 3, self.interrupt ? ok : continuationDeclarationInside) : asciiAlpha(code) ? (effects.consume(code), buffer = String.fromCharCode(code), tagName) : nok(code);
  }
  function declarationOpen(code) {
    return code === 45 ? (effects.consume(code), marker = 2, commentOpenInside) : code === 91 ? (effects.consume(code), marker = 5, index2 = 0, cdataOpenInside) : asciiAlpha(code) ? (effects.consume(code), marker = 4, self.interrupt ? ok : continuationDeclarationInside) : nok(code);
  }
  function commentOpenInside(code) {
    return code === 45 ? (effects.consume(code), self.interrupt ? ok : continuationDeclarationInside) : nok(code);
  }
  function cdataOpenInside(code) {
    let value = "CDATA[";
    return code === value.charCodeAt(index2++) ? (effects.consume(code), index2 === value.length ? self.interrupt ? ok : continuation : cdataOpenInside) : nok(code);
  }
  function tagCloseStart(code) {
    return asciiAlpha(code) ? (effects.consume(code), buffer = String.fromCharCode(code), tagName) : nok(code);
  }
  function tagName(code) {
    if (code === null || code === 47 || code === 62 || markdownLineEndingOrSpace(code)) {
      let slash = code === 47, name = buffer.toLowerCase();
      return !slash && !closingTag && htmlRawNames.includes(name) ? (marker = 1, self.interrupt ? ok(code) : continuation(code)) : htmlBlockNames.includes(buffer.toLowerCase()) ? (marker = 6, slash ? (effects.consume(code), basicSelfClosing) : self.interrupt ? ok(code) : continuation(code)) : (marker = 7, self.interrupt && !self.parser.lazy[self.now().line] ? nok(code) : closingTag ? completeClosingTagAfter(code) : completeAttributeNameBefore(code));
    }
    return code === 45 || asciiAlphanumeric(code) ? (effects.consume(code), buffer += String.fromCharCode(code), tagName) : nok(code);
  }
  function basicSelfClosing(code) {
    return code === 62 ? (effects.consume(code), self.interrupt ? ok : continuation) : nok(code);
  }
  function completeClosingTagAfter(code) {
    return markdownSpace(code) ? (effects.consume(code), completeClosingTagAfter) : completeEnd(code);
  }
  function completeAttributeNameBefore(code) {
    return code === 47 ? (effects.consume(code), completeEnd) : code === 58 || code === 95 || asciiAlpha(code) ? (effects.consume(code), completeAttributeName) : markdownSpace(code) ? (effects.consume(code), completeAttributeNameBefore) : completeEnd(code);
  }
  function completeAttributeName(code) {
    return code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code) ? (effects.consume(code), completeAttributeName) : completeAttributeNameAfter(code);
  }
  function completeAttributeNameAfter(code) {
    return code === 61 ? (effects.consume(code), completeAttributeValueBefore) : markdownSpace(code) ? (effects.consume(code), completeAttributeNameAfter) : completeAttributeNameBefore(code);
  }
  function completeAttributeValueBefore(code) {
    return code === null || code === 60 || code === 61 || code === 62 || code === 96 ? nok(code) : code === 34 || code === 39 ? (effects.consume(code), markerB = code, completeAttributeValueQuoted) : markdownSpace(code) ? (effects.consume(code), completeAttributeValueBefore) : completeAttributeValueUnquoted(code);
  }
  function completeAttributeValueQuoted(code) {
    return code === markerB ? (effects.consume(code), markerB = null, completeAttributeValueQuotedAfter) : code === null || markdownLineEnding(code) ? nok(code) : (effects.consume(code), completeAttributeValueQuoted);
  }
  function completeAttributeValueUnquoted(code) {
    return code === null || code === 34 || code === 39 || code === 47 || code === 60 || code === 61 || code === 62 || code === 96 || markdownLineEndingOrSpace(code) ? completeAttributeNameAfter(code) : (effects.consume(code), completeAttributeValueUnquoted);
  }
  function completeAttributeValueQuotedAfter(code) {
    return code === 47 || code === 62 || markdownSpace(code) ? completeAttributeNameBefore(code) : nok(code);
  }
  function completeEnd(code) {
    return code === 62 ? (effects.consume(code), completeAfter) : nok(code);
  }
  function completeAfter(code) {
    return code === null || markdownLineEnding(code) ? continuation(code) : markdownSpace(code) ? (effects.consume(code), completeAfter) : nok(code);
  }
  function continuation(code) {
    return code === 45 && marker === 2 ? (effects.consume(code), continuationCommentInside) : code === 60 && marker === 1 ? (effects.consume(code), continuationRawTagOpen) : code === 62 && marker === 4 ? (effects.consume(code), continuationClose) : code === 63 && marker === 3 ? (effects.consume(code), continuationDeclarationInside) : code === 93 && marker === 5 ? (effects.consume(code), continuationCdataInside) : markdownLineEnding(code) && (marker === 6 || marker === 7) ? (effects.exit("htmlFlowData"), effects.check(blankLineBefore, continuationAfter, continuationStart)(code)) : code === null || markdownLineEnding(code) ? (effects.exit("htmlFlowData"), continuationStart(code)) : (effects.consume(code), continuation);
  }
  function continuationStart(code) {
    return effects.check(nonLazyContinuation, continuationStartNonLazy, continuationAfter)(code);
  }
  function continuationStartNonLazy(code) {
    return effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), continuationBefore;
  }
  function continuationBefore(code) {
    return code === null || markdownLineEnding(code) ? continuationStart(code) : (effects.enter("htmlFlowData"), continuation(code));
  }
  function continuationCommentInside(code) {
    return code === 45 ? (effects.consume(code), continuationDeclarationInside) : continuation(code);
  }
  function continuationRawTagOpen(code) {
    return code === 47 ? (effects.consume(code), buffer = "", continuationRawEndTag) : continuation(code);
  }
  function continuationRawEndTag(code) {
    if (code === 62) {
      let name = buffer.toLowerCase();
      return htmlRawNames.includes(name) ? (effects.consume(code), continuationClose) : continuation(code);
    }
    return asciiAlpha(code) && buffer.length < 8 ? (effects.consume(code), buffer += String.fromCharCode(code), continuationRawEndTag) : continuation(code);
  }
  function continuationCdataInside(code) {
    return code === 93 ? (effects.consume(code), continuationDeclarationInside) : continuation(code);
  }
  function continuationDeclarationInside(code) {
    return code === 62 ? (effects.consume(code), continuationClose) : code === 45 && marker === 2 ? (effects.consume(code), continuationDeclarationInside) : continuation(code);
  }
  function continuationClose(code) {
    return code === null || markdownLineEnding(code) ? (effects.exit("htmlFlowData"), continuationAfter(code)) : (effects.consume(code), continuationClose);
  }
  function continuationAfter(code) {
    return effects.exit("htmlFlow"), ok(code);
  }
}
function tokenizeBlankLineBefore(effects, ok, nok) {
  return start;
  function start(code) {
    return effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), effects.attempt(blankLine, ok, nok);
  }
}

// node_modules/micromark-core-commonmark/lib/html-text.js
var htmlText = {
  name: "htmlText",
  tokenize: tokenizeHtmlText
};
function tokenizeHtmlText(effects, ok, nok) {
  let self = this, marker, index2, returnState;
  return start;
  function start(code) {
    return effects.enter("htmlText"), effects.enter("htmlTextData"), effects.consume(code), open;
  }
  function open(code) {
    return code === 33 ? (effects.consume(code), declarationOpen) : code === 47 ? (effects.consume(code), tagCloseStart) : code === 63 ? (effects.consume(code), instruction) : asciiAlpha(code) ? (effects.consume(code), tagOpen) : nok(code);
  }
  function declarationOpen(code) {
    return code === 45 ? (effects.consume(code), commentOpenInside) : code === 91 ? (effects.consume(code), index2 = 0, cdataOpenInside) : asciiAlpha(code) ? (effects.consume(code), declaration) : nok(code);
  }
  function commentOpenInside(code) {
    return code === 45 ? (effects.consume(code), commentEnd) : nok(code);
  }
  function comment(code) {
    return code === null ? nok(code) : code === 45 ? (effects.consume(code), commentClose) : markdownLineEnding(code) ? (returnState = comment, lineEndingBefore(code)) : (effects.consume(code), comment);
  }
  function commentClose(code) {
    return code === 45 ? (effects.consume(code), commentEnd) : comment(code);
  }
  function commentEnd(code) {
    return code === 62 ? end(code) : code === 45 ? commentClose(code) : comment(code);
  }
  function cdataOpenInside(code) {
    let value = "CDATA[";
    return code === value.charCodeAt(index2++) ? (effects.consume(code), index2 === value.length ? cdata : cdataOpenInside) : nok(code);
  }
  function cdata(code) {
    return code === null ? nok(code) : code === 93 ? (effects.consume(code), cdataClose) : markdownLineEnding(code) ? (returnState = cdata, lineEndingBefore(code)) : (effects.consume(code), cdata);
  }
  function cdataClose(code) {
    return code === 93 ? (effects.consume(code), cdataEnd) : cdata(code);
  }
  function cdataEnd(code) {
    return code === 62 ? end(code) : code === 93 ? (effects.consume(code), cdataEnd) : cdata(code);
  }
  function declaration(code) {
    return code === null || code === 62 ? end(code) : markdownLineEnding(code) ? (returnState = declaration, lineEndingBefore(code)) : (effects.consume(code), declaration);
  }
  function instruction(code) {
    return code === null ? nok(code) : code === 63 ? (effects.consume(code), instructionClose) : markdownLineEnding(code) ? (returnState = instruction, lineEndingBefore(code)) : (effects.consume(code), instruction);
  }
  function instructionClose(code) {
    return code === 62 ? end(code) : instruction(code);
  }
  function tagCloseStart(code) {
    return asciiAlpha(code) ? (effects.consume(code), tagClose) : nok(code);
  }
  function tagClose(code) {
    return code === 45 || asciiAlphanumeric(code) ? (effects.consume(code), tagClose) : tagCloseBetween(code);
  }
  function tagCloseBetween(code) {
    return markdownLineEnding(code) ? (returnState = tagCloseBetween, lineEndingBefore(code)) : markdownSpace(code) ? (effects.consume(code), tagCloseBetween) : end(code);
  }
  function tagOpen(code) {
    return code === 45 || asciiAlphanumeric(code) ? (effects.consume(code), tagOpen) : code === 47 || code === 62 || markdownLineEndingOrSpace(code) ? tagOpenBetween(code) : nok(code);
  }
  function tagOpenBetween(code) {
    return code === 47 ? (effects.consume(code), end) : code === 58 || code === 95 || asciiAlpha(code) ? (effects.consume(code), tagOpenAttributeName) : markdownLineEnding(code) ? (returnState = tagOpenBetween, lineEndingBefore(code)) : markdownSpace(code) ? (effects.consume(code), tagOpenBetween) : end(code);
  }
  function tagOpenAttributeName(code) {
    return code === 45 || code === 46 || code === 58 || code === 95 || asciiAlphanumeric(code) ? (effects.consume(code), tagOpenAttributeName) : tagOpenAttributeNameAfter(code);
  }
  function tagOpenAttributeNameAfter(code) {
    return code === 61 ? (effects.consume(code), tagOpenAttributeValueBefore) : markdownLineEnding(code) ? (returnState = tagOpenAttributeNameAfter, lineEndingBefore(code)) : markdownSpace(code) ? (effects.consume(code), tagOpenAttributeNameAfter) : tagOpenBetween(code);
  }
  function tagOpenAttributeValueBefore(code) {
    return code === null || code === 60 || code === 61 || code === 62 || code === 96 ? nok(code) : code === 34 || code === 39 ? (effects.consume(code), marker = code, tagOpenAttributeValueQuoted) : markdownLineEnding(code) ? (returnState = tagOpenAttributeValueBefore, lineEndingBefore(code)) : markdownSpace(code) ? (effects.consume(code), tagOpenAttributeValueBefore) : (effects.consume(code), tagOpenAttributeValueUnquoted);
  }
  function tagOpenAttributeValueQuoted(code) {
    return code === marker ? (effects.consume(code), marker = void 0, tagOpenAttributeValueQuotedAfter) : code === null ? nok(code) : markdownLineEnding(code) ? (returnState = tagOpenAttributeValueQuoted, lineEndingBefore(code)) : (effects.consume(code), tagOpenAttributeValueQuoted);
  }
  function tagOpenAttributeValueUnquoted(code) {
    return code === null || code === 34 || code === 39 || code === 60 || code === 61 || code === 96 ? nok(code) : code === 47 || code === 62 || markdownLineEndingOrSpace(code) ? tagOpenBetween(code) : (effects.consume(code), tagOpenAttributeValueUnquoted);
  }
  function tagOpenAttributeValueQuotedAfter(code) {
    return code === 47 || code === 62 || markdownLineEndingOrSpace(code) ? tagOpenBetween(code) : nok(code);
  }
  function end(code) {
    return code === 62 ? (effects.consume(code), effects.exit("htmlTextData"), effects.exit("htmlText"), ok) : nok(code);
  }
  function lineEndingBefore(code) {
    return effects.exit("htmlTextData"), effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), lineEndingAfter;
  }
  function lineEndingAfter(code) {
    return markdownSpace(code) ? factorySpace(effects, lineEndingAfterPrefix, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code) : lineEndingAfterPrefix(code);
  }
  function lineEndingAfterPrefix(code) {
    return effects.enter("htmlTextData"), returnState(code);
  }
}

// node_modules/micromark-core-commonmark/lib/label-end.js
var labelEnd = {
  name: "labelEnd",
  resolveAll: resolveAllLabelEnd,
  resolveTo: resolveToLabelEnd,
  tokenize: tokenizeLabelEnd
}, resourceConstruct = {
  tokenize: tokenizeResource
}, referenceFullConstruct = {
  tokenize: tokenizeReferenceFull
}, referenceCollapsedConstruct = {
  tokenize: tokenizeReferenceCollapsed
};
function resolveAllLabelEnd(events) {
  let index2 = -1, newEvents = [];
  for (; ++index2 < events.length; ) {
    let token = events[index2][1];
    if (newEvents.push(events[index2]), token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
      let offset = token.type === "labelImage" ? 4 : 2;
      token.type = "data", index2 += offset;
    }
  }
  return events.length !== newEvents.length && splice(events, 0, events.length, newEvents), events;
}
function resolveToLabelEnd(events, context) {
  let index2 = events.length, offset = 0, open, close, media;
  for (; index2--; ) {
    let token = events[index2][1];
    if (open) {
      if (token.type === "link" || token.type === "labelLink" && token._inactive)
        break;
      events[index2][0] === "enter" && token.type === "labelLink" && (token._inactive = !0);
    } else if (close) {
      if (events[index2][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced && (open = index2, token.type !== "labelLink")) {
        offset = 2;
        break;
      }
    } else token.type === "labelEnd" && (close = index2);
  }
  let group = {
    type: events[open][1].type === "labelLink" ? "link" : "image",
    start: {
      ...events[open][1].start
    },
    end: {
      ...events[events.length - 1][1].end
    }
  }, label = {
    type: "label",
    start: {
      ...events[open][1].start
    },
    end: {
      ...events[close][1].end
    }
  }, text3 = {
    type: "labelText",
    start: {
      ...events[open + offset + 2][1].end
    },
    end: {
      ...events[close - 2][1].start
    }
  };
  return media = [["enter", group, context], ["enter", label, context]], media = push(media, events.slice(open + 1, open + offset + 3)), media = push(media, [["enter", text3, context]]), media = push(media, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + offset + 4, close - 3), context)), media = push(media, [["exit", text3, context], events[close - 2], events[close - 1], ["exit", label, context]]), media = push(media, events.slice(close + 1)), media = push(media, [["exit", group, context]]), splice(events, open, events.length, media), events;
}
function tokenizeLabelEnd(effects, ok, nok) {
  let self = this, labelStarts = self._labelStarts, labelStart, defined;
  if (labelStarts) {
    for (; labelStarts.length > 0 && labelStarts[labelStarts.length - 1]._balanced; )
      labelStarts.pop();
    labelStart = labelStarts[labelStarts.length - 1];
  }
  return start;
  function start(code) {
    return labelStart ? labelStart._inactive ? labelEndNok(code) : (defined = self.parser.defined.includes(normalizeIdentifier(self.sliceSerialize({
      start: labelStart.end,
      end: self.now()
    }))), effects.enter("labelEnd"), effects.enter("labelMarker"), effects.consume(code), effects.exit("labelMarker"), effects.exit("labelEnd"), after) : nok(code);
  }
  function after(code) {
    return code === 40 ? effects.attempt(resourceConstruct, labelEndOk, defined ? labelEndOk : labelEndNok)(code) : code === 91 ? effects.attempt(referenceFullConstruct, labelEndOk, defined ? referenceNotFull : labelEndNok)(code) : defined ? labelEndOk(code) : labelEndNok(code);
  }
  function referenceNotFull(code) {
    return effects.attempt(referenceCollapsedConstruct, labelEndOk, labelEndNok)(code);
  }
  function labelEndOk(code) {
    return labelStarts.pop(), ok(code);
  }
  function labelEndNok(code) {
    return labelStart._balanced = !0, nok(code);
  }
}
function tokenizeResource(effects, ok, nok) {
  return resourceStart;
  function resourceStart(code) {
    return effects.enter("resource"), effects.enter("resourceMarker"), effects.consume(code), effects.exit("resourceMarker"), resourceBefore;
  }
  function resourceBefore(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceOpen)(code) : resourceOpen(code);
  }
  function resourceOpen(code) {
    return code === 41 ? resourceEnd(code) : factoryDestination(effects, resourceDestinationAfter, resourceDestinationMissing, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(code);
  }
  function resourceDestinationAfter(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceBetween)(code) : resourceEnd(code);
  }
  function resourceDestinationMissing(code) {
    return nok(code);
  }
  function resourceBetween(code) {
    return code === 34 || code === 39 || code === 40 ? factoryTitle(effects, resourceTitleAfter, nok, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(code) : resourceEnd(code);
  }
  function resourceTitleAfter(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceEnd)(code) : resourceEnd(code);
  }
  function resourceEnd(code) {
    return code === 41 ? (effects.enter("resourceMarker"), effects.consume(code), effects.exit("resourceMarker"), effects.exit("resource"), ok) : nok(code);
  }
}
function tokenizeReferenceFull(effects, ok, nok) {
  let self = this;
  return referenceFull;
  function referenceFull(code) {
    return factoryLabel.call(self, effects, referenceFullAfter, referenceFullMissing, "reference", "referenceMarker", "referenceString")(code);
  }
  function referenceFullAfter(code) {
    return self.parser.defined.includes(normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1))) ? ok(code) : nok(code);
  }
  function referenceFullMissing(code) {
    return nok(code);
  }
}
function tokenizeReferenceCollapsed(effects, ok, nok) {
  return referenceCollapsedStart;
  function referenceCollapsedStart(code) {
    return effects.enter("reference"), effects.enter("referenceMarker"), effects.consume(code), effects.exit("referenceMarker"), referenceCollapsedOpen;
  }
  function referenceCollapsedOpen(code) {
    return code === 93 ? (effects.enter("referenceMarker"), effects.consume(code), effects.exit("referenceMarker"), effects.exit("reference"), ok) : nok(code);
  }
}

// node_modules/micromark-core-commonmark/lib/label-start-image.js
var labelStartImage = {
  name: "labelStartImage",
  resolveAll: labelEnd.resolveAll,
  tokenize: tokenizeLabelStartImage
};
function tokenizeLabelStartImage(effects, ok, nok) {
  let self = this, labelImage;
  return start;
  function start(code) {
    return effects.enter("labelImage"), effects.enter("labelImageMarker"), effects.consume(code), effects.exit("labelImageMarker"), open;
  }
  function open(code) {
    return code === 91 ? (effects.enter("labelMarker"), effects.consume(code), effects.exit("labelMarker"), labelImage = effects.exit("labelImage"), after) : nok(code);
  }
  function after(code) {
    return code === 94 && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code) : (self._labelStarts = self._labelStarts || [], self._labelStarts.push(labelImage), ok(code));
  }
}

// node_modules/micromark-core-commonmark/lib/label-start-link.js
var labelStartLink = {
  name: "labelStartLink",
  resolveAll: labelEnd.resolveAll,
  tokenize: tokenizeLabelStartLink
};
function tokenizeLabelStartLink(effects, ok, nok) {
  let self = this, labelLink;
  return start;
  function start(code) {
    return effects.enter("labelLink"), effects.enter("labelMarker"), effects.consume(code), effects.exit("labelMarker"), labelLink = effects.exit("labelLink"), after;
  }
  function after(code) {
    return code === 94 && "_hiddenFootnoteSupport" in self.parser.constructs ? nok(code) : (self._labelStarts = self._labelStarts || [], self._labelStarts.push(labelLink), ok(code));
  }
}

// node_modules/micromark-core-commonmark/lib/line-ending.js
var lineEnding = {
  name: "lineEnding",
  tokenize: tokenizeLineEnding
};
function tokenizeLineEnding(effects, ok) {
  return start;
  function start(code) {
    return effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), factorySpace(effects, ok, "linePrefix");
  }
}

// node_modules/micromark-core-commonmark/lib/thematic-break.js
var thematicBreak = {
  name: "thematicBreak",
  tokenize: tokenizeThematicBreak
};
function tokenizeThematicBreak(effects, ok, nok) {
  let size = 0, marker;
  return start;
  function start(code) {
    return effects.enter("thematicBreak"), before(code);
  }
  function before(code) {
    return marker = code, atBreak(code);
  }
  function atBreak(code) {
    return code === marker ? (effects.enter("thematicBreakSequence"), sequence(code)) : size >= 3 && (code === null || markdownLineEnding(code)) ? (effects.exit("thematicBreak"), ok(code)) : nok(code);
  }
  function sequence(code) {
    return code === marker ? (effects.consume(code), size++, sequence) : (effects.exit("thematicBreakSequence"), markdownSpace(code) ? factorySpace(effects, atBreak, "whitespace")(code) : atBreak(code));
  }
}

// node_modules/micromark-core-commonmark/lib/list.js
var list = {
  continuation: {
    tokenize: tokenizeListContinuation
  },
  exit: tokenizeListEnd,
  name: "list",
  tokenize: tokenizeListStart
}, listItemPrefixWhitespaceConstruct = {
  partial: !0,
  tokenize: tokenizeListItemPrefixWhitespace
}, indentConstruct = {
  partial: !0,
  tokenize: tokenizeIndent
};
function tokenizeListStart(effects, ok, nok) {
  let self = this, tail = self.events[self.events.length - 1], initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], !0).length : 0, size = 0;
  return start;
  function start(code) {
    let kind = self.containerState.type || (code === 42 || code === 43 || code === 45 ? "listUnordered" : "listOrdered");
    if (kind === "listUnordered" ? !self.containerState.marker || code === self.containerState.marker : asciiDigit(code)) {
      if (self.containerState.type || (self.containerState.type = kind, effects.enter(kind, {
        _container: !0
      })), kind === "listUnordered")
        return effects.enter("listItemPrefix"), code === 42 || code === 45 ? effects.check(thematicBreak, nok, atMarker)(code) : atMarker(code);
      if (!self.interrupt || code === 49)
        return effects.enter("listItemPrefix"), effects.enter("listItemValue"), inside(code);
    }
    return nok(code);
  }
  function inside(code) {
    return asciiDigit(code) && ++size < 10 ? (effects.consume(code), inside) : (!self.interrupt || size < 2) && (self.containerState.marker ? code === self.containerState.marker : code === 41 || code === 46) ? (effects.exit("listItemValue"), atMarker(code)) : nok(code);
  }
  function atMarker(code) {
    return effects.enter("listItemMarker"), effects.consume(code), effects.exit("listItemMarker"), self.containerState.marker = self.containerState.marker || code, effects.check(
      blankLine,
      // Can’t be empty when interrupting.
      self.interrupt ? nok : onBlank,
      effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix)
    );
  }
  function onBlank(code) {
    return self.containerState.initialBlankLine = !0, initialSize++, endOfPrefix(code);
  }
  function otherPrefix(code) {
    return markdownSpace(code) ? (effects.enter("listItemPrefixWhitespace"), effects.consume(code), effects.exit("listItemPrefixWhitespace"), endOfPrefix) : nok(code);
  }
  function endOfPrefix(code) {
    return self.containerState.size = initialSize + self.sliceSerialize(effects.exit("listItemPrefix"), !0).length, ok(code);
  }
}
function tokenizeListContinuation(effects, ok, nok) {
  let self = this;
  return self.containerState._closeFlow = void 0, effects.check(blankLine, onBlank, notBlank);
  function onBlank(code) {
    return self.containerState.furtherBlankLines = self.containerState.furtherBlankLines || self.containerState.initialBlankLine, factorySpace(effects, ok, "listItemIndent", self.containerState.size + 1)(code);
  }
  function notBlank(code) {
    return self.containerState.furtherBlankLines || !markdownSpace(code) ? (self.containerState.furtherBlankLines = void 0, self.containerState.initialBlankLine = void 0, notInCurrentItem(code)) : (self.containerState.furtherBlankLines = void 0, self.containerState.initialBlankLine = void 0, effects.attempt(indentConstruct, ok, notInCurrentItem)(code));
  }
  function notInCurrentItem(code) {
    return self.containerState._closeFlow = !0, self.interrupt = void 0, factorySpace(effects, effects.attempt(list, ok, nok), "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code);
  }
}
function tokenizeIndent(effects, ok, nok) {
  let self = this;
  return factorySpace(effects, afterPrefix, "listItemIndent", self.containerState.size + 1);
  function afterPrefix(code) {
    let tail = self.events[self.events.length - 1];
    return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], !0).length === self.containerState.size ? ok(code) : nok(code);
  }
}
function tokenizeListEnd(effects) {
  effects.exit(this.containerState.type);
}
function tokenizeListItemPrefixWhitespace(effects, ok, nok) {
  let self = this;
  return factorySpace(effects, afterPrefix, "listItemPrefixWhitespace", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
  function afterPrefix(code) {
    let tail = self.events[self.events.length - 1];
    return !markdownSpace(code) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok(code) : nok(code);
  }
}

// node_modules/micromark-core-commonmark/lib/setext-underline.js
var setextUnderline = {
  name: "setextUnderline",
  resolveTo: resolveToSetextUnderline,
  tokenize: tokenizeSetextUnderline
};
function resolveToSetextUnderline(events, context) {
  let editMap = new EditMap(), index2 = events.length, content3, text3, definition2;
  for (; index2--; )
    if (events[index2][0] === "enter") {
      if (events[index2][1].type === "content") {
        content3 = index2;
        break;
      }
      events[index2][1].type === "paragraph" && (text3 = index2);
    } else
      events[index2][1].type === "content" && editMap.add(index2, 1, []), !definition2 && events[index2][1].type === "definition" && (definition2 = index2);
  let heading2 = {
    type: "setextHeading",
    start: {
      ...events[content3][1].start
    },
    end: {
      ...events[events.length - 1][1].end
    }
  };
  return events[text3][1].type = "setextHeadingText", definition2 ? (editMap.add(text3, 0, [["enter", heading2, context]]), editMap.add(definition2 + 1, 0, [["exit", events[content3][1], context]]), events[content3][1].end = {
    ...events[definition2][1].end
  }) : events[content3][1] = heading2, editMap.add(events.length, 0, [["exit", heading2, context]]), editMap.consume(events), events;
}
function tokenizeSetextUnderline(effects, ok, nok) {
  let self = this, marker;
  return start;
  function start(code) {
    let index2 = self.events.length, paragraph;
    for (; index2--; )
      if (self.events[index2][1].type !== "lineEnding" && self.events[index2][1].type !== "linePrefix" && self.events[index2][1].type !== "content") {
        paragraph = self.events[index2][1].type === "paragraph";
        break;
      }
    return !self.parser.lazy[self.now().line] && (self.interrupt || paragraph) ? (effects.enter("setextHeadingLine"), marker = code, before(code)) : nok(code);
  }
  function before(code) {
    return effects.enter("setextHeadingLineSequence"), inside(code);
  }
  function inside(code) {
    return code === marker ? (effects.consume(code), inside) : (effects.exit("setextHeadingLineSequence"), markdownSpace(code) ? factorySpace(effects, after, "lineSuffix")(code) : after(code));
  }
  function after(code) {
    return code === null || markdownLineEnding(code) ? (effects.exit("setextHeadingLine"), ok(code)) : nok(code);
  }
}

// node_modules/micromark/lib/initialize/flow.js
var flow = {
  tokenize: initializeFlow
};
function initializeFlow(effects) {
  let self = this, initial = effects.attempt(
    // Try to parse a blank line.
    blankLine,
    atBlankEnding,
    // Try to parse initial flow (essentially, only code).
    effects.attempt(this.parser.constructs.flowInitial, afterConstruct, factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt(content2, afterConstruct)), "linePrefix"))
  );
  return initial;
  function atBlankEnding(code) {
    if (code === null) {
      effects.consume(code);
      return;
    }
    return effects.enter("lineEndingBlank"), effects.consume(code), effects.exit("lineEndingBlank"), self.currentConstruct = void 0, initial;
  }
  function afterConstruct(code) {
    if (code === null) {
      effects.consume(code);
      return;
    }
    return effects.enter("lineEnding"), effects.consume(code), effects.exit("lineEnding"), self.currentConstruct = void 0, initial;
  }
}

// node_modules/micromark/lib/initialize/text.js
var resolver = {
  resolveAll: createResolver()
}, string = initializeFactory("string"), text = initializeFactory("text");
function initializeFactory(field) {
  return {
    resolveAll: createResolver(field === "text" ? resolveAllLineSuffixes : void 0),
    tokenize: initializeText
  };
  function initializeText(effects) {
    let self = this, constructs2 = this.parser.constructs[field], text3 = effects.attempt(constructs2, start, notText);
    return start;
    function start(code) {
      return atBreak(code) ? text3(code) : notText(code);
    }
    function notText(code) {
      if (code === null) {
        effects.consume(code);
        return;
      }
      return effects.enter("data"), effects.consume(code), data;
    }
    function data(code) {
      return atBreak(code) ? (effects.exit("data"), text3(code)) : (effects.consume(code), data);
    }
    function atBreak(code) {
      if (code === null)
        return !0;
      let list3 = constructs2[code], index2 = -1;
      if (list3)
        for (; ++index2 < list3.length; ) {
          let item = list3[index2];
          if (!item.previous || item.previous.call(self, self.previous))
            return !0;
        }
      return !1;
    }
  }
}
function createResolver(extraResolver) {
  return resolveAllText;
  function resolveAllText(events, context) {
    let index2 = -1, enter;
    for (; ++index2 <= events.length; )
      enter === void 0 ? events[index2] && events[index2][1].type === "data" && (enter = index2, index2++) : (!events[index2] || events[index2][1].type !== "data") && (index2 !== enter + 2 && (events[enter][1].end = events[index2 - 1][1].end, events.splice(enter + 2, index2 - enter - 2), index2 = enter + 2), enter = void 0);
    return extraResolver ? extraResolver(events, context) : events;
  }
}
function resolveAllLineSuffixes(events, context) {
  let editMap = new EditMap(), eventIndex = 0;
  for (; ++eventIndex <= events.length; )
    if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
      let data = events[eventIndex - 1][1], chunks = context.sliceStream(data), index2 = chunks.length, bufferIndex = -1, size = 0, tabs;
      for (; index2--; ) {
        let chunk = chunks[index2];
        if (typeof chunk == "string") {
          for (bufferIndex = chunk.length; chunk.charCodeAt(bufferIndex - 1) === 32; )
            size++, bufferIndex--;
          if (bufferIndex)
            break;
          bufferIndex = -1;
        } else if (chunk === -2)
          tabs = !0, size++;
        else if (chunk !== -1) {
          index2++;
          break;
        }
      }
      if (context._contentTypeTextTrailing && eventIndex === events.length && (size = 0), size) {
        let token = {
          type: eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: index2 ? bufferIndex : data.start._bufferIndex + bufferIndex,
            _index: data.start._index + index2,
            line: data.end.line,
            column: data.end.column - size,
            offset: data.end.offset - size
          },
          end: {
            ...data.end
          }
        };
        data.end = {
          ...token.start
        }, data.start.offset === data.end.offset ? Object.assign(data, token) : editMap.add(eventIndex, 0, [["enter", token, context], ["exit", token, context]]);
      }
      eventIndex++;
    }
  return editMap.consume(events), events;
}

// node_modules/micromark/lib/constructs.js
var constructs_exports = {};
__export(constructs_exports, {
  attentionMarkers: () => attentionMarkers,
  contentInitial: () => contentInitial,
  disable: () => disable,
  document: () => document2,
  flow: () => flow2,
  flowInitial: () => flowInitial,
  insideSpan: () => insideSpan,
  string: () => string2,
  text: () => text2
});
var document2 = {
  42: list,
  43: list,
  45: list,
  48: list,
  49: list,
  50: list,
  51: list,
  52: list,
  53: list,
  54: list,
  55: list,
  56: list,
  57: list,
  62: blockQuote
}, contentInitial = {
  91: definition
}, flowInitial = {
  [-2]: codeIndented,
  [-1]: codeIndented,
  32: codeIndented
}, flow2 = {
  35: headingAtx,
  42: thematicBreak,
  45: [setextUnderline, thematicBreak],
  60: htmlFlow,
  61: setextUnderline,
  95: thematicBreak,
  96: codeFenced,
  126: codeFenced
}, string2 = {
  38: characterReference,
  92: characterEscape
}, text2 = {
  [-5]: lineEnding,
  [-4]: lineEnding,
  [-3]: lineEnding,
  33: labelStartImage,
  38: characterReference,
  42: attention,
  60: [autolink, htmlText],
  91: labelStartLink,
  92: [hardBreakEscape, characterEscape],
  93: labelEnd,
  95: attention,
  96: codeText
}, insideSpan = {
  null: [attention, resolver]
}, attentionMarkers = {
  null: [42, 95]
}, disable = {
  null: []
};

// node_modules/micromark/lib/create-tokenizer.js
function createTokenizer(parser, initialize2, from) {
  let point3 = {
    _bufferIndex: -1,
    _index: 0,
    line: from && from.line || 1,
    column: from && from.column || 1,
    offset: from && from.offset || 0
  }, columnStart = {}, resolveAllConstructs = [], chunks = [], stack = [], consumed = !0, effects = {
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    consume,
    enter,
    exit: exit2,
    interrupt: constructFactory(onsuccessfulcheck, {
      interrupt: !0
    })
  }, context = {
    code: null,
    containerState: {},
    defineSkip,
    events: [],
    now,
    parser,
    previous: null,
    sliceSerialize,
    sliceStream,
    write
  }, state = initialize2.tokenize.call(context, effects), expectedCode;
  return initialize2.resolveAll && resolveAllConstructs.push(initialize2), context;
  function write(slice) {
    return chunks = push(chunks, slice), main(), chunks[chunks.length - 1] !== null ? [] : (addResult(initialize2, 0), context.events = resolveAll(resolveAllConstructs, context.events, context), context.events);
  }
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs);
  }
  function sliceStream(token) {
    return sliceChunks(chunks, token);
  }
  function now() {
    let {
      _bufferIndex,
      _index,
      line,
      column,
      offset
    } = point3;
    return {
      _bufferIndex,
      _index,
      line,
      column,
      offset
    };
  }
  function defineSkip(value) {
    columnStart[value.line] = value.column, accountForPotentialSkip();
  }
  function main() {
    for (; point3._index < chunks.length; ) {
      let chunk = chunks[point3._index];
      if (typeof chunk == "string") {
        let chunkIndex = point3._index;
        for (point3._bufferIndex < 0 && (point3._bufferIndex = 0); point3._index === chunkIndex && point3._bufferIndex < chunk.length; )
          go(chunk.charCodeAt(point3._bufferIndex));
      } else
        go(chunk);
    }
  }
  function go(code) {
    consumed = void 0, expectedCode = code, state = state(code);
  }
  function consume(code) {
    markdownLineEnding(code) ? (point3.line++, point3.column = 1, point3.offset += code === -3 ? 2 : 1, accountForPotentialSkip()) : code !== -1 && (point3.column++, point3.offset++), point3._bufferIndex < 0 ? point3._index++ : (point3._bufferIndex++, point3._bufferIndex === // Points w/ non-negative `_bufferIndex` reference
    // strings.
    /** @type {string} */
    chunks[point3._index].length && (point3._bufferIndex = -1, point3._index++)), context.previous = code, consumed = !0;
  }
  function enter(type, fields) {
    let token = fields || {};
    return token.type = type, token.start = now(), context.events.push(["enter", token, context]), stack.push(token), token;
  }
  function exit2(type) {
    let token = stack.pop();
    return token.end = now(), context.events.push(["exit", token, context]), token;
  }
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from);
  }
  function onsuccessfulcheck(_, info) {
    info.restore();
  }
  function constructFactory(onreturn, fields) {
    return hook;
    function hook(constructs2, returnState, bogusState) {
      let listOfConstructs, constructIndex, currentConstruct, info;
      return Array.isArray(constructs2) ? (
        /* c8 ignore next 1 */
        handleListOfConstructs(constructs2)
      ) : "tokenize" in constructs2 ? (
        // Looks like a construct.
        handleListOfConstructs([
          /** @type {Construct} */
          constructs2
        ])
      ) : handleMapOfConstructs(constructs2);
      function handleMapOfConstructs(map) {
        return start;
        function start(code) {
          let left = code !== null && map[code], all2 = code !== null && map.null, list3 = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(left) ? left : left ? [left] : [],
            ...Array.isArray(all2) ? all2 : all2 ? [all2] : []
          ];
          return handleListOfConstructs(list3)(code);
        }
      }
      function handleListOfConstructs(list3) {
        return listOfConstructs = list3, constructIndex = 0, list3.length === 0 ? bogusState : handleConstruct(list3[constructIndex]);
      }
      function handleConstruct(construct) {
        return start;
        function start(code) {
          return info = store(), currentConstruct = construct, construct.partial || (context.currentConstruct = construct), construct.name && context.parser.constructs.disable.null.includes(construct.name) ? nok(code) : construct.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            fields ? Object.assign(Object.create(context), fields) : context,
            effects,
            ok,
            nok
          )(code);
        }
      }
      function ok(code) {
        return consumed = !0, onreturn(currentConstruct, info), returnState;
      }
      function nok(code) {
        return consumed = !0, info.restore(), ++constructIndex < listOfConstructs.length ? handleConstruct(listOfConstructs[constructIndex]) : bogusState;
      }
    }
  }
  function addResult(construct, from2) {
    construct.resolveAll && !resolveAllConstructs.includes(construct) && resolveAllConstructs.push(construct), construct.resolve && splice(context.events, from2, context.events.length - from2, construct.resolve(context.events.slice(from2), context)), construct.resolveTo && (context.events = construct.resolveTo(context.events, context));
  }
  function store() {
    let startPoint = now(), startPrevious = context.previous, startCurrentConstruct = context.currentConstruct, startEventsIndex = context.events.length, startStack = Array.from(stack);
    return {
      from: startEventsIndex,
      restore
    };
    function restore() {
      point3 = startPoint, context.previous = startPrevious, context.currentConstruct = startCurrentConstruct, context.events.length = startEventsIndex, stack = startStack, accountForPotentialSkip();
    }
  }
  function accountForPotentialSkip() {
    point3.line in columnStart && point3.column < 2 && (point3.column = columnStart[point3.line], point3.offset += columnStart[point3.line] - 1);
  }
}
function sliceChunks(chunks, token) {
  let startIndex = token.start._index, startBufferIndex = token.start._bufferIndex, endIndex = token.end._index, endBufferIndex = token.end._bufferIndex, view;
  if (startIndex === endIndex)
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
  else {
    if (view = chunks.slice(startIndex, endIndex), startBufferIndex > -1) {
      let head = view[0];
      typeof head == "string" ? view[0] = head.slice(startBufferIndex) : view.shift();
    }
    endBufferIndex > 0 && view.push(chunks[endIndex].slice(0, endBufferIndex));
  }
  return view;
}
function serializeChunks(chunks, expandTabs) {
  let index2 = -1, result = [], atTab;
  for (; ++index2 < chunks.length; ) {
    let chunk = chunks[index2], value;
    if (typeof chunk == "string")
      value = chunk;
    else
      switch (chunk) {
        case -5: {
          value = "\r";
          break;
        }
        case -4: {
          value = `
`;
          break;
        }
        case -3: {
          value = `\r
`;
          break;
        }
        case -2: {
          value = expandTabs ? " " : "	";
          break;
        }
        case -1: {
          if (!expandTabs && atTab)
            continue;
          value = " ";
          break;
        }
        default:
          value = String.fromCharCode(chunk);
      }
    atTab = chunk === -2, result.push(value);
  }
  return result.join("");
}

// node_modules/micromark/lib/parse.js
function parse(options) {
  let parser = {
    constructs: (
      /** @type {FullNormalizedExtension} */
      combineExtensions([constructs_exports, ...(options || {}).extensions || []])
    ),
    content: create(content),
    defined: [],
    document: create(document),
    flow: create(flow),
    lazy: {},
    string: create(string),
    text: create(text)
  };
  return parser;
  function create(initial) {
    return creator;
    function creator(from) {
      return createTokenizer(parser, initial, from);
    }
  }
}

// node_modules/micromark/lib/postprocess.js
function postprocess(events) {
  for (; !subtokenize(events); )
    ;
  return events;
}

// node_modules/micromark/lib/preprocess.js
var search = /[\0\t\n\r]/g;
function preprocess() {
  let column = 1, buffer = "", start = !0, atCarriageReturn;
  return preprocessor;
  function preprocessor(value, encoding, end) {
    value = buffer + (typeof value == "string" ? value.toString() : new TextDecoder(encoding || void 0).decode(value));
    let chunks = [], startPosition = 0;
    for (buffer = "", start && (value.charCodeAt(0) === 65279 && startPosition++, start = void 0); startPosition < value.length; ) {
      search.lastIndex = startPosition;
      let match = search.exec(value), endPosition = match && match.index !== void 0 ? match.index : value.length, code = value.charCodeAt(endPosition);
      if (!match) {
        buffer = value.slice(startPosition);
        break;
      }
      if (code === 10 && startPosition === endPosition && atCarriageReturn)
        chunks.push(-3), atCarriageReturn = void 0;
      else
        switch (atCarriageReturn && (chunks.push(-5), atCarriageReturn = void 0), startPosition < endPosition && (chunks.push(value.slice(startPosition, endPosition)), column += endPosition - startPosition), code) {
          case 0: {
            chunks.push(65533), column++;
            break;
          }
          case 9: {
            let next = Math.ceil(column / 4) * 4;
            for (chunks.push(-2); column++ < next; )
              chunks.push(-1);
            break;
          }
          case 10: {
            chunks.push(-4), column = 1;
            break;
          }
          default:
            atCarriageReturn = !0, column = 1;
        }
      startPosition = endPosition + 1;
    }
    return end && (atCarriageReturn && chunks.push(-5), buffer && chunks.push(buffer), chunks.push(null)), chunks;
  }
}

// node_modules/micromark-util-decode-string/index.js
var characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function decodeString(value) {
  return value.replace(characterEscapeOrReference, decode);
}
function decode($0, $1, $2) {
  if ($1)
    return $1;
  if ($2.charCodeAt(0) === 35) {
    let head2 = $2.charCodeAt(1), hex = head2 === 120 || head2 === 88;
    return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
  }
  return decodeNamedCharacterReference($2) || $0;
}

// node_modules/unist-util-stringify-position/lib/index.js
function stringifyPosition(value) {
  return !value || typeof value != "object" ? "" : "position" in value || "type" in value ? position(value.position) : "start" in value || "end" in value ? position(value) : "line" in value || "column" in value ? point(value) : "";
}
function point(point3) {
  return index(point3 && point3.line) + ":" + index(point3 && point3.column);
}
function position(pos) {
  return point(pos && pos.start) + "-" + point(pos && pos.end);
}
function index(value) {
  return value && typeof value == "number" ? value : 1;
}

// node_modules/mdast-util-from-markdown/lib/index.js
var own2 = {}.hasOwnProperty;
function fromMarkdown(value, encoding, options) {
  return encoding && typeof encoding == "object" && (options = encoding, encoding = void 0), compiler(options)(postprocess(parse(options).document().write(preprocess()(value, encoding, !0))));
}
function compiler(options) {
  let config = {
    afterExit: [],
    beforeEnter: [],
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: opener(link2),
      autolinkProtocol: onenterdata,
      autolinkEmail: onenterdata,
      atxHeading: opener(heading2),
      blockQuote: opener(blockQuote2),
      characterEscape: onenterdata,
      characterReference: onenterdata,
      codeFenced: opener(codeFlow),
      codeFencedFenceInfo: buffer,
      codeFencedFenceMeta: buffer,
      codeIndented: opener(codeFlow, buffer),
      codeText: opener(codeText2, buffer),
      codeTextData: onenterdata,
      data: onenterdata,
      codeFlowValue: onenterdata,
      definition: opener(definition2),
      definitionDestinationString: buffer,
      definitionLabelString: buffer,
      definitionTitleString: buffer,
      emphasis: opener(emphasis),
      hardBreakEscape: opener(hardBreak),
      hardBreakTrailing: opener(hardBreak),
      htmlFlow: opener(html, buffer),
      htmlFlowData: onenterdata,
      htmlText: opener(html, buffer),
      htmlTextData: onenterdata,
      image: opener(image),
      label: buffer,
      link: opener(link2),
      listItem: opener(listItem),
      listItemValue: onenterlistitemvalue,
      listOrdered: opener(list3, onenterlistordered),
      listUnordered: opener(list3),
      paragraph: opener(paragraph),
      reference: onenterreference,
      referenceString: buffer,
      resourceDestinationString: buffer,
      resourceTitleString: buffer,
      setextHeading: opener(heading2),
      strong: opener(strong),
      thematicBreak: opener(thematicBreak2)
    },
    exit: {
      atxHeading: closer(),
      atxHeadingSequence: onexitatxheadingsequence,
      autolink: closer(),
      autolinkEmail: onexitautolinkemail,
      autolinkProtocol: onexitautolinkprotocol,
      blockQuote: closer(),
      characterEscapeValue: onexitdata,
      characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
      characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
      characterReferenceValue: onexitcharacterreferencevalue,
      characterReference: onexitcharacterreference,
      codeFenced: closer(onexitcodefenced),
      codeFencedFence: onexitcodefencedfence,
      codeFencedFenceInfo: onexitcodefencedfenceinfo,
      codeFencedFenceMeta: onexitcodefencedfencemeta,
      codeFlowValue: onexitdata,
      codeIndented: closer(onexitcodeindented),
      codeText: closer(onexitcodetext),
      codeTextData: onexitdata,
      data: onexitdata,
      definition: closer(),
      definitionDestinationString: onexitdefinitiondestinationstring,
      definitionLabelString: onexitdefinitionlabelstring,
      definitionTitleString: onexitdefinitiontitlestring,
      emphasis: closer(),
      hardBreakEscape: closer(onexithardbreak),
      hardBreakTrailing: closer(onexithardbreak),
      htmlFlow: closer(onexithtmlflow),
      htmlFlowData: onexitdata,
      htmlText: closer(onexithtmltext),
      htmlTextData: onexitdata,
      image: closer(onexitimage),
      label: onexitlabel,
      labelText: onexitlabeltext,
      lineEnding: onexitlineending,
      link: closer(onexitlink),
      listItem: closer(),
      listOrdered: closer(),
      listUnordered: closer(),
      paragraph: closer(),
      referenceString: onexitreferencestring,
      resourceDestinationString: onexitresourcedestinationstring,
      resourceTitleString: onexitresourcetitlestring,
      resource: onexitresource,
      setextHeading: closer(onexitsetextheading),
      setextHeadingLineSequence: onexitsetextheadinglinesequence,
      setextHeadingText: onexitsetextheadingtext,
      strong: closer(),
      thematicBreak: closer()
    }
  };
  configure(config, (options || {}).mdastExtensions || []);
  let data = {};
  return compile2;
  function compile2(events) {
    let tree = {
      type: "root",
      children: [],
      position: void 0
    }, context = {
      stack: [tree],
      tokenStack: [],
      config,
      enter,
      exit: exit2,
      buffer,
      resume,
      data
    }, listStack = [], prepared = [], index2 = -1;
    for (; ++index2 < events.length; )
      if (prepared.push(events[index2]), events[index2][1].type === "listOrdered" || events[index2][1].type === "listUnordered")
        if (events[index2][0] === "enter")
          listStack.push(prepared.length - 1);
        else {
          let tail = listStack.pop();
          prepareList(prepared, tail);
        }
    for (events = prepared, index2 = -1; ++index2 < events.length; ) {
      let handler = config[events[index2][0]];
      events[index2][0] === "enter" && config.beforeEnter.length > 0 && callListeners(config.beforeEnter, {
        ...context,
        sliceSerialize: events[index2][2].sliceSerialize
      }, events[index2][1]), own2.call(handler, events[index2][1].type) && handler[events[index2][1].type].call({
        ...context,
        sliceSerialize: events[index2][2].sliceSerialize
      }, events[index2][1]), events[index2][0] === "exit" && config.afterExit.length > 0 && callListeners(config.afterExit, {
        ...context,
        sliceSerialize: events[index2][2].sliceSerialize
      }, events[index2][1]);
    }
    if (context.tokenStack.length > 0) {
      let tail = context.tokenStack[context.tokenStack.length - 1];
      (tail[1] || defaultOnError).call(context, void 0, tail[0]);
    }
    for (tree.position = {
      start: point2(events.length > 0 ? events[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: point2(events.length > 0 ? events[events.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    }, index2 = -1; ++index2 < config.transforms.length; )
      tree = config.transforms[index2](tree) || tree;
    return tree;
  }
  function callListeners(listeners, context, token) {
    let index2 = -1;
    for (; ++index2 < listeners.length; )
      listeners[index2].call(context, token);
  }
  function prepareList(events, start) {
    let end = events.length - 1, index2 = start - 1, containerBalance = -1, listSpread = !1, listItem2, lineIndex, firstBlankLineIndex, atMarker, insertions = [];
    for (; ++index2 <= end; ) {
      let event = events[index2];
      switch (event[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          event[0] === "enter" ? containerBalance++ : containerBalance--, atMarker = void 0;
          break;
        }
        case "lineEndingBlank": {
          event[0] === "enter" && (listItem2 && !atMarker && !containerBalance && !firstBlankLineIndex && (firstBlankLineIndex = index2), atMarker = void 0);
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          atMarker = void 0;
      }
      if (!containerBalance && event[0] === "enter" && event[1].type === "listItemPrefix" || containerBalance === -1 && event[0] === "exit" && (event[1].type === "listUnordered" || event[1].type === "listOrdered")) {
        if (listItem2) {
          let tailIndex = index2;
          for (lineIndex = void 0; tailIndex--; ) {
            let tailEvent = events[tailIndex];
            if (tailEvent[1].type === "lineEnding" || tailEvent[1].type === "lineEndingBlank") {
              if (tailEvent[0] === "exit") continue;
              lineIndex && (events[lineIndex][1].type = "lineEndingBlank", listSpread = !0), tailEvent[1].type = "lineEnding", lineIndex = tailIndex;
            } else if (!(tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent"))
              break;
          }
          firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex) && (listItem2._spread = !0), listItem2.end = Object.assign({}, lineIndex ? events[lineIndex][1].start : event[1].end), insertions.push({
            at: lineIndex || index2,
            event: ["exit", listItem2, event[2]]
          });
        }
        if (event[1].type === "listItemPrefix") {
          let item = {
            type: "listItem",
            _spread: !1,
            start: Object.assign({}, event[1].start),
            // @ts-expect-error: we’ll add `end` in a second.
            end: void 0
          };
          listItem2 = item, insertions.push({
            at: index2,
            event: ["enter", item, event[2]]
          }), firstBlankLineIndex = void 0, atMarker = !0;
        }
      }
    }
    let listEvents = events.splice(start), insertion = 0;
    for (index2 = -1; ++index2 < listEvents.length; ) {
      for (; insertion < insertions.length && insertions[insertion].at === start + index2; )
        events.push(insertions[insertion++].event);
      events.push(listEvents[index2]);
    }
    events[start][1]._spread = listSpread;
  }
  function opener(create, and) {
    return open;
    function open(token) {
      enter.call(this, create(token), token), and && and.call(this, token);
    }
  }
  function buffer() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function enter(node2, token, errorHandler) {
    this.stack[this.stack.length - 1].children.push(node2), this.stack.push(node2), this.tokenStack.push([token, errorHandler || void 0]), node2.position = {
      start: point2(token.start),
      // @ts-expect-error: `end` will be patched later.
      end: void 0
    };
  }
  function closer(and) {
    return close;
    function close(token) {
      and && and.call(this, token), exit2.call(this, token);
    }
  }
  function exit2(token, onExitError) {
    let node2 = this.stack.pop(), open = this.tokenStack.pop();
    if (!open)
      throw new Error("Cannot close `" + token.type + "` (" + stringifyPosition({
        start: token.start,
        end: token.end
      }) + "): it\u2019s not open");
    open[0].type !== token.type && (onExitError ? onExitError.call(this, token, open[0]) : (open[1] || defaultOnError).call(this, token, open[0])), node2.position.end = point2(token.end);
  }
  function resume() {
    return toString(this.stack.pop());
  }
  function onenterlistordered() {
    this.data.expectingFirstListItemValue = !0;
  }
  function onenterlistitemvalue(token) {
    if (this.data.expectingFirstListItemValue) {
      let ancestor = this.stack[this.stack.length - 2];
      ancestor.start = Number.parseInt(this.sliceSerialize(token), 10), this.data.expectingFirstListItemValue = void 0;
    }
  }
  function onexitcodefencedfenceinfo() {
    let data2 = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.lang = data2;
  }
  function onexitcodefencedfencemeta() {
    let data2 = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.meta = data2;
  }
  function onexitcodefencedfence() {
    this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0);
  }
  function onexitcodefenced() {
    let data2 = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.value = data2.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0;
  }
  function onexitcodeindented() {
    let data2 = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.value = data2.replace(/(\r?\n|\r)$/g, "");
  }
  function onexitdefinitionlabelstring(token) {
    let label = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.label = label, node2.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
  }
  function onexitdefinitiontitlestring() {
    let data2 = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.title = data2;
  }
  function onexitdefinitiondestinationstring() {
    let data2 = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.url = data2;
  }
  function onexitatxheadingsequence(token) {
    let node2 = this.stack[this.stack.length - 1];
    if (!node2.depth) {
      let depth = this.sliceSerialize(token).length;
      node2.depth = depth;
    }
  }
  function onexitsetextheadingtext() {
    this.data.setextHeadingSlurpLineEnding = !0;
  }
  function onexitsetextheadinglinesequence(token) {
    let node2 = this.stack[this.stack.length - 1];
    node2.depth = this.sliceSerialize(token).codePointAt(0) === 61 ? 1 : 2;
  }
  function onexitsetextheading() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function onenterdata(token) {
    let siblings = this.stack[this.stack.length - 1].children, tail = siblings[siblings.length - 1];
    (!tail || tail.type !== "text") && (tail = text3(), tail.position = {
      start: point2(token.start),
      // @ts-expect-error: we’ll add `end` later.
      end: void 0
    }, siblings.push(tail)), this.stack.push(tail);
  }
  function onexitdata(token) {
    let tail = this.stack.pop();
    tail.value += this.sliceSerialize(token), tail.position.end = point2(token.end);
  }
  function onexitlineending(token) {
    let context = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      let tail = context.children[context.children.length - 1];
      tail.position.end = point2(token.end), this.data.atHardBreak = void 0;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && config.canContainEols.includes(context.type) && (onenterdata.call(this, token), onexitdata.call(this, token));
  }
  function onexithardbreak() {
    this.data.atHardBreak = !0;
  }
  function onexithtmlflow() {
    let data2 = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.value = data2;
  }
  function onexithtmltext() {
    let data2 = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.value = data2;
  }
  function onexitcodetext() {
    let data2 = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.value = data2;
  }
  function onexitlink() {
    let node2 = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      let referenceType = this.data.referenceType || "shortcut";
      node2.type += "Reference", node2.referenceType = referenceType, delete node2.url, delete node2.title;
    } else
      delete node2.identifier, delete node2.label;
    this.data.referenceType = void 0;
  }
  function onexitimage() {
    let node2 = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      let referenceType = this.data.referenceType || "shortcut";
      node2.type += "Reference", node2.referenceType = referenceType, delete node2.url, delete node2.title;
    } else
      delete node2.identifier, delete node2.label;
    this.data.referenceType = void 0;
  }
  function onexitlabeltext(token) {
    let string3 = this.sliceSerialize(token), ancestor = this.stack[this.stack.length - 2];
    ancestor.label = decodeString(string3), ancestor.identifier = normalizeIdentifier(string3).toLowerCase();
  }
  function onexitlabel() {
    let fragment = this.stack[this.stack.length - 1], value = this.resume(), node2 = this.stack[this.stack.length - 1];
    if (this.data.inReference = !0, node2.type === "link") {
      let children = fragment.children;
      node2.children = children;
    } else
      node2.alt = value;
  }
  function onexitresourcedestinationstring() {
    let data2 = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.url = data2;
  }
  function onexitresourcetitlestring() {
    let data2 = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.title = data2;
  }
  function onexitresource() {
    this.data.inReference = void 0;
  }
  function onenterreference() {
    this.data.referenceType = "collapsed";
  }
  function onexitreferencestring(token) {
    let label = this.resume(), node2 = this.stack[this.stack.length - 1];
    node2.label = label, node2.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase(), this.data.referenceType = "full";
  }
  function onexitcharacterreferencemarker(token) {
    this.data.characterReferenceType = token.type;
  }
  function onexitcharacterreferencevalue(token) {
    let data2 = this.sliceSerialize(token), type = this.data.characterReferenceType, value;
    type ? (value = decodeNumericCharacterReference(data2, type === "characterReferenceMarkerNumeric" ? 10 : 16), this.data.characterReferenceType = void 0) : value = decodeNamedCharacterReference(data2);
    let tail = this.stack[this.stack.length - 1];
    tail.value += value;
  }
  function onexitcharacterreference(token) {
    let tail = this.stack.pop();
    tail.position.end = point2(token.end);
  }
  function onexitautolinkprotocol(token) {
    onexitdata.call(this, token);
    let node2 = this.stack[this.stack.length - 1];
    node2.url = this.sliceSerialize(token);
  }
  function onexitautolinkemail(token) {
    onexitdata.call(this, token);
    let node2 = this.stack[this.stack.length - 1];
    node2.url = "mailto:" + this.sliceSerialize(token);
  }
  function blockQuote2() {
    return {
      type: "blockquote",
      children: [],
      position: void 0
    };
  }
  function codeFlow() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: "",
      position: void 0
    };
  }
  function codeText2() {
    return {
      type: "inlineCode",
      value: "",
      position: void 0
    };
  }
  function definition2() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: "",
      position: void 0
    };
  }
  function emphasis() {
    return {
      type: "emphasis",
      children: [],
      position: void 0
    };
  }
  function heading2() {
    return {
      type: "heading",
      // @ts-expect-error `depth` will be set later.
      depth: 0,
      children: [],
      position: void 0
    };
  }
  function hardBreak() {
    return {
      type: "break",
      position: void 0
    };
  }
  function html() {
    return {
      type: "html",
      value: "",
      position: void 0
    };
  }
  function image() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null,
      position: void 0
    };
  }
  function link2() {
    return {
      type: "link",
      title: null,
      url: "",
      children: [],
      position: void 0
    };
  }
  function list3(token) {
    return {
      type: "list",
      ordered: token.type === "listOrdered",
      start: null,
      spread: token._spread,
      children: [],
      position: void 0
    };
  }
  function listItem(token) {
    return {
      type: "listItem",
      spread: token._spread,
      checked: null,
      children: [],
      position: void 0
    };
  }
  function paragraph() {
    return {
      type: "paragraph",
      children: [],
      position: void 0
    };
  }
  function strong() {
    return {
      type: "strong",
      children: [],
      position: void 0
    };
  }
  function text3() {
    return {
      type: "text",
      value: "",
      position: void 0
    };
  }
  function thematicBreak2() {
    return {
      type: "thematicBreak",
      position: void 0
    };
  }
}
function point2(d) {
  return {
    line: d.line,
    column: d.column,
    offset: d.offset
  };
}
function configure(combined, extensions) {
  let index2 = -1;
  for (; ++index2 < extensions.length; ) {
    let value = extensions[index2];
    Array.isArray(value) ? configure(combined, value) : extension(combined, value);
  }
}
function extension(combined, extension2) {
  let key;
  for (key in extension2)
    if (own2.call(extension2, key))
      switch (key) {
        case "canContainEols": {
          let right = extension2[key];
          right && combined[key].push(...right);
          break;
        }
        case "transforms": {
          let right = extension2[key];
          right && combined[key].push(...right);
          break;
        }
        case "afterExit":
        case "beforeEnter": {
          let right = extension2[key];
          right && combined[key].push(right);
          break;
        }
        case "enter":
        case "exit": {
          let right = extension2[key];
          right && Object.assign(combined[key], right);
          break;
        }
      }
}
function defaultOnError(left, right) {
  throw left ? new Error("Cannot close `" + left.type + "` (" + stringifyPosition({
    start: left.start,
    end: left.end
  }) + "): a different token (`" + right.type + "`, " + stringifyPosition({
    start: right.start,
    end: right.end
  }) + ") is open") : new Error("Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
    start: right.start,
    end: right.end
  }) + ") is still open");
}

// src/core/markdown/lines.ts
var walk = (node2, visit) => {
  if (visit(node2), "children" in node2) for (let child of node2.children) walk(child, visit);
}, markdownLines = (text3) => {
  let codeLines2 = /* @__PURE__ */ new Set();
  return walk(fromMarkdown(text3), (node2) => {
    if (!(node2.type !== "code" || node2.position === void 0))
      for (let line = node2.position.start.line; line <= node2.position.end.line; line += 1)
        codeLines2.add(line);
  }), text3.split(`
`).map((line, index2) => ({ text: line, code: codeLines2.has(index2 + 1) }));
}, headingLevel = (line) => {
  let level = 0;
  for (; line[level] === "#"; ) level += 1;
  return level >= 1 && level <= 6 && line[level] === " " ? level : 0;
}, structuralText = (text3) => markdownLines(text3).filter((line) => !line.code).map((line) => line.text).join(`
`), inlineText = (value) => (value ?? "").trim(), slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), BULLET_MARKERS = ["- ", "* ", "+ "], bulletText = (line) => {
  for (let marker of BULLET_MARKERS)
    if (line.startsWith(marker)) return line.slice(marker.length);
  return null;
};

// src/core/markdown/comments.ts
var OPEN_COMMENT = "<!--", CLOSE_COMMENT = "-->", commentSpans = (text3) => {
  let spans = [];
  return walk(fromMarkdown(text3), (node2) => {
    if (node2.type !== "html" || node2.position === void 0) return;
    let from = node2.position.start.offset, to = node2.position.end.offset;
    if (from === void 0 || to === void 0) return;
    let cursor = from;
    for (; cursor < to; ) {
      let open = text3.indexOf(OPEN_COMMENT, cursor);
      if (open === -1 || open >= to) break;
      let close = text3.indexOf(CLOSE_COMMENT, open + OPEN_COMMENT.length);
      if (close === -1 || close + CLOSE_COMMENT.length > to) break;
      spans.push({ from: open, to: close + CLOSE_COMMENT.length }), cursor = close + CLOSE_COMMENT.length;
    }
  }), spans.sort((left, right) => left.from - right.from);
}, coversWholeLines = (text3, open, afterClose) => {
  let lineStart = text3.lastIndexOf(`
`, open - 1) + 1, lineEnd = text3.indexOf(`
`, afterClose), nextLineStart = lineEnd === -1 ? text3.length : lineEnd + 1, leading = text3.slice(lineStart, open), trailing = text3.slice(
    afterClose,
    lineEnd === -1 ? text3.length : lineEnd
  );
  return {
    covers: leading.trim() === "" && trailing.trim() === "",
    lineStart,
    nextLineStart
  };
}, stripComments = (text3) => {
  let spans = commentSpans(text3);
  if (spans.length === 0) return text3;
  let output = "", position2 = 0;
  for (let span of spans) {
    if (span.from < position2) continue;
    let line = coversWholeLines(text3, span.from, span.to);
    line.covers && line.lineStart >= position2 ? (output += text3.slice(position2, line.lineStart), position2 = line.nextLineStart) : (output += text3.slice(position2, span.from), position2 = span.to);
  }
  return output + text3.slice(position2);
};

// src/core/markdown/read.ts
var readText = async (path) => {
  try {
    return await readFile(path, "utf8");
  } catch {
    return null;
  }
}, readMarkdown = async (path) => {
  let text3 = await readText(path);
  return text3 === null ? null : stripComments(text3);
};

// src/core/configs.ts
var CONFIGS_FILE = ".lagune/configs.json", CONFIGS_SCHEMA = "https://lagune.ai/schemas/configs.json", parseConfigs = (raw) => raw === null ? /* @__PURE__ */ Object.create(null) : parseJsonObject(raw, CONFIGS_FILE), readConfigs = async (cwd14) => parseConfigs(await readText(join2(cwd14, CONFIGS_FILE))), writeConfigs = async (path, fields) => {
  let current = parseConfigs(await readText(path)), merged = Object.assign(
    /* @__PURE__ */ Object.create(null),
    { $schema: CONFIGS_SCHEMA },
    current,
    fields
  );
  await writeFileOverwrite(path, `${JSON.stringify(merged, null, 2)}
`);
};

// src/mcp/tools.ts
var ARGUMENTS_GUIDE = "Pass the engine subcommand as command and each of its arguments, without shell quotes, as one item of arguments.", ENGINE_TOOLS = [
  {
    name: "lagune_read",
    prefix: "read",
    title: "Lagune engine (read)",
    summary: "Runs a Lagune engine command that only reads the project: the catalog, the tracked findings and categories, the memory validation, the CVSS scoring, and the checkers.",
    readOnly: !0,
    commands: [
      "catalog",
      "list",
      "validate",
      "cvss",
      "agent",
      "cors",
      "crypto",
      "infra",
      "interpreter",
      "jwt",
      "network",
      "regex",
      "secrets"
    ]
  },
  {
    name: "lagune_write",
    prefix: "write",
    title: "Lagune engine (write)",
    summary: "Runs a Lagune engine command that changes the project's .lagune/ state: tracking findings, standing them down, repairing the tracking map, and recording categories.",
    readOnly: !1,
    commands: ["track", "untrack", "repair", "add", "remove"]
  }
], findTool = (name) => ENGINE_TOOLS.find((tool) => tool.name === name), toolBehind = (prefix) => ENGINE_TOOLS.find((tool) => tool.prefix === prefix), runsCommand = (tool, command) => tool.commands.some((candidate) => candidate === command), toolFor = (command) => ENGINE_TOOLS.find((tool) => runsCommand(tool, command)), commandRefusal = (tool, command, named) => {
  let owner = toolFor(command);
  return owner === void 0 ? `${named(tool)} runs one of: ${tool.commands.join(", ")}.` : `${String(command)} runs through ${named(owner)}, not ${named(tool)}.`;
}, toolName = (tool) => tool.name, runTool = async (tool, input, run16) => {
  let command = readField(input, "command"), values = readField(input, "arguments") ?? [];
  return runsCommand(tool, command) ? isStringArray(values) ? run16([tool.prefix, command, ...values]) : { output: "arguments must be a list of strings.", failed: !0 } : { output: commandRefusal(tool, command, toolName), failed: !0 };
}, describeTool = (tool) => ({
  name: tool.name,
  title: tool.title,
  description: `${tool.summary} ${ARGUMENTS_GUIDE}`,
  inputSchema: {
    type: "object",
    properties: {
      command: { type: "string", enum: tool.commands },
      arguments: { type: "array", items: { type: "string" } }
    },
    required: ["command"],
    additionalProperties: !1
  },
  annotations: {
    title: tool.title,
    readOnlyHint: tool.readOnly,
    destructiveHint: !tool.readOnly,
    openWorldHint: !1
  }
});

// src/cli/colors.ts
import { env, stdout } from "node:process";
import { styleText } from "node:util";
var OFF = /* @__PURE__ */ new Set(["", "0", "false"]), colorEnabled = () => {
  let force = env.FORCE_COLOR;
  return force !== void 0 && !OFF.has(force) ? !0 : env.NO_COLOR ? !1 : stdout.isTTY === !0;
}, paint = (style) => (text3) => colorEnabled() ? styleText(style, text3, { stream: stdout }) : text3, color = {
  dim: paint("dim"),
  bold: paint("bold"),
  green: paint("green"),
  blue: paint("blueBright")
};

// src/cli/messages.ts
var ENGINE_COMMAND = "npx lagune", INSTALL_PAGE = "https://lagune.ai/docs", MIGRATE_PAGE = "https://lagune.ai/docs/commands/migrate", GLYPH = {
  added: color.blue("+"),
  moved: color.blue("\u21BB"),
  kept: color.dim("\xB7"),
  removed: color.blue("-")
}, banner = () => `
\u{1FABC} ${color.bold(color.blue("Lagune"))}`, done = (text3) => `${color.blue("\u2713")} ${text3}`, heading = (text3) => color.blue(text3), bullet = (text3) => `  ${color.blue("\u2022")} ${text3}`, definitions = (rows) => {
  let width = Math.max(...rows.map(([term]) => term.length));
  return rows.map(
    ([term, description]) => bullet(`${term.padEnd(width)}  ${description}`)
  );
}, capitalized = (word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`, toolCommandLine = (tool) => `${ENGINE_COMMAND} ${tool.prefix}`, commandLine = (command) => {
  let tool = toolFor(command);
  return tool === void 0 ? `${ENGINE_COMMAND} ${command}` : `${toolCommandLine(tool)} ${command}`;
}, helpUsage = (tools) => [
  `${ENGINE_COMMAND} [--port <number>]`,
  ...tools.map((tool) => `${toolCommandLine(tool)} <command> [<arguments...>]`),
  `${ENGINE_COMMAND} dashboard [--port <number>]`,
  `${ENGINE_COMMAND} migrate`,
  `${ENGINE_COMMAND} mcp [<project>]`
], HELP_TOOL_COMMANDS = {
  catalog: [
    "catalog [<name>]",
    "List this project's specializations, or print one by name"
  ],
  list: [
    "list [--findings] [--categories]",
    "List tracked findings or specialization categories (asks which)"
  ],
  add: [
    "add --categories [<category...>]",
    "Record specialization categories for this project"
  ],
  remove: [
    "remove --categories [<category...>]",
    "Drop specialization categories from this project"
  ]
}, HELP_COMMANDS = [
  ["dashboard", "Serve a live view of .lagune/ and open it in the browser"],
  [
    "migrate",
    "Move a manifest-based Lagune project to the skills-based layout"
  ],
  ["mcp", "Serve the engine's commands to an agent over MCP, from the project"]
], HELP_OPTIONS = [
  [
    "--categories <...>",
    "With add, remove, or list, the categories (no value to choose interactively)"
  ],
  ["--findings", "With list, show the tracked findings"],
  [
    "--port <1024-65535>",
    "With dashboard, the port to serve on (default: random)"
  ],
  ["--help", "Show this help"],
  ["--version", "Show the version"]
], toolCommands = (tool) => {
  let described = tool.commands.map((command) => HELP_TOOL_COMMANDS[command]).filter((row) => row !== void 0), listed = tool.commands.filter(
    (command) => HELP_TOOL_COMMANDS[command] === void 0
  );
  return [
    heading(`${capitalized(tool.prefix)} commands`),
    ...definitions(described),
    ...listed.length === 0 ? [] : [bullet(listed.join(color.dim(", ")))],
    ""
  ];
}, helpText = (tools) => [
  banner(),
  color.dim("A defensive, security-first workflow for your project."),
  "",
  heading("Usage"),
  ...helpUsage(tools).map(bullet),
  "",
  ...tools.flatMap(toolCommands),
  heading("Other commands"),
  ...definitions(HELP_COMMANDS),
  "",
  heading("Options"),
  ...definitions(HELP_OPTIONS),
  "",
  heading("Agent commands"),
  bullet(`Install and update them for your agent at ${INSTALL_PAGE}`)
].join(`
`), unknownCommand = (command) => [
  `Unknown command: ${command}`,
  `Run ${ENGINE_COMMAND} --help to see the commands.`
].join(`
`), unprefixedCommand = (command) => `${command} runs only as ${commandLine(command)}.`, movedToSkills = (command) => `${command} is gone: install and update Lagune's commands for your agent at ${INSTALL_PAGE}`, categoriesUsage = (command) => [
  `usage: ${commandLine(command)} --categories <category...>`,
  `Run ${commandLine("list")} --categories to see every category.`
].join(`
`), listUsage = () => [
  `usage: ${commandLine("list")} --findings`,
  `       ${commandLine("list")} --categories`
].join(`
`), catalogUsage = () => `usage: ${commandLine("catalog")} [<name>]`, invalidSpecializationName = (name) => `"${name}" is not a specialization name: a name uses only lowercase letters, digits, and hyphens.`, noSpecialization = (name) => `No specialization is named "${name}". Run ${commandLine("catalog")} to list the ones this project uses.`, noProjectFolder = (project) => `The MCP server runs from the project folder, and ${project} is not a folder.`, notAProjectFolder = (project) => `The MCP server runs from the project folder, and ${project} is Lagune's own folder or the root of the file system, never a project. The agent started the server outside the project, so the commands run the engine through npx instead.`, noServedProject = () => "The MCP server runs from the project folder, and the agent named none: it started the server outside the project and listed no single project folder as its root. The commands run the engine through npx instead.";
var frozenHandoff = (version) => `This project runs on the manifest-based Lagune, which keeps working: lagune@${version} answers here. To move the project to the skills-based Lagune, see ${MIGRATE_PAGE}`, frozenRefusal = (command) => `This project runs on the manifest-based Lagune, which keeps working here, but ${command} is part of the skills-based Lagune the project has not moved to yet. To move it, see ${MIGRATE_PAGE}`, handoffLoop = (version) => `lagune@${version} answered with this skills-based Lagune instead of the manifest-based Lagune, so the hand-off stopped rather than starting itself again. Remove the copy that carries that version, such as a linked one, then run this again. To move the project to the skills-based Lagune, see ${MIGRATE_PAGE}`, handoffUnavailable = (version) => `This project runs on the manifest-based Lagune, which keeps working with lagune@${version}, but this runtime brings no npm to start it. Run npx lagune@${version} yourself with the same arguments. To move the project to the skills-based Lagune, see ${MIGRATE_PAGE}`, footer = (...middle) => ["Enter to confirm", ...middle, "Esc to cancel"].join(" \xB7 "), selectFooter = () => footer(), categoriesSelectFooter = () => footer("empty to skip"), listSelectTitle = () => "What do you want to list?", listSelectHint = () => "Arrow keys to move.", categoriesSelectTitle = () => "Which specialization categories do you want?", categoriesSelectHint = () => "Space to toggle, arrow keys to move.", nothingSelected = () => color.dim("Nothing selected."), usedLine = (used) => used.length === 0 ? "This project uses no category." : `This project uses ${allOf(used)}.`, categoryList = (categories, used, recorded) => {
  let keyWidth = Math.max(
    ...categories.map((category) => category.key.length)
  ), rows = categories.map((category) => {
    let key = category.key.padEnd(keyWidth), state = used.includes(category.key) ? color.green("[used]     ") : color.dim("[available]");
    return bullet(`${key}  ${state}  ${category.description}`);
  }), origin = recorded ? `Recorded in ${CONFIGS_FILE}.` : `No category is recorded yet, so this project uses the default: ${allOf(used)}.`;
  return [heading("Categories"), ...rows, "", color.dim(origin)].join(`
`);
}, categoriesRecorded = (action, change) => {
  let verb = action === "add" ? "Added" : "Removed", untouched = action === "add" ? "Already used" : "Not used";
  return [
    ...change.changed.length > 0 ? [
      done(
        `${verb} ${allOf(change.changed)} ${color.dim(`\xB7 ${CONFIGS_FILE}`)}`
      )
    ] : [],
    ...change.unchanged.length > 0 ? [color.dim(`${untouched}: ${allOf(change.unchanged)}.`)] : [],
    usedLine(change.categories)
  ].join(`
`);
}, findingsReport = (names) => names.length === 0 ? color.dim("No findings tracked yet.") : [heading("Findings"), ...names.map(bullet)].join(`
`), migrateNothing = () => color.dim(
  "No manifest-based Lagune found here, so there is nothing to migrate."
), migrateBlueSpecFirst = (version) => `This project is still on Blue Spec, Lagune's former name. Move it to the manifest-based Lagune with ${color.blue(`npx lagune@${version} migrate`)}, then run this again.`, removedLine = (path) => `  ${GLYPH.removed} ${path}`, movedLine = (from, to) => `  ${GLYPH.moved} ${from} ${color.dim(`\u2192 ${to}`)}`, keptLine = (path) => `  ${GLYPH.kept} ${path} ${color.dim("(kept: its destination already exists)")}`, GITIGNORE_NOTES = {
  removed: "Removed .gitignore, which held only the Lagune block",
  updated: "Removed the Lagune block from .gitignore",
  unchanged: ""
}, CONFIG_NOTES = {
  categories: "the categories",
  catalog: "the index of your own specializations"
}, migrateNotes = (summary) => [
  ...summary.configs.length === 0 ? [] : [
    done(
      `Recorded ${allOf(summary.configs.map((config) => CONFIG_NOTES[config]))} in ${CONFIGS_FILE}`
    )
  ],
  ...summary.gitignore === "unchanged" ? [] : [done(GITIGNORE_NOTES[summary.gitignore])],
  ...summary.proofs ? [done("Kept .lagune/proofs/ out of commits with its own .gitignore")] : []
], migrateSteps = (summary) => [
  ...summary.manifest ? ["Commit this change on its own"] : [],
  `Install Lagune's commands for your agent at ${INSTALL_PAGE}`,
  `Follow the rest of the move at ${MIGRATE_PAGE}`
].map((step, index2) => `  ${color.dim(String(index2 + 1))}  ${step}`), migrateReport = (summary) => [
  ...summary.removed.length > 0 ? [heading("Removed"), ...summary.removed.map(removedLine), ""] : [],
  ...summary.moved.length > 0 || summary.kept.length > 0 ? [
    heading("Moved"),
    ...summary.moved.map((file) => movedLine(file.from, file.to)),
    ...summary.kept.map(keptLine),
    ""
  ] : [],
  done(
    `Moved to the skills-based layout ${color.dim("\xB7")} ${summary.removed.length} removed${color.dim(`, ${summary.moved.length} moved`)}`
  ),
  ...migrateNotes(summary),
  "",
  color.bold("Next steps"),
  ...migrateSteps(summary)
].join(`
`);

// src/cli/parse-args.ts
import { parseArgs } from "node:util";
var COMMANDS = [
  "catalog",
  "add",
  "remove",
  "list",
  "dashboard",
  "migrate",
  "init",
  "pull",
  "update"
], toCommand = (value) => COMMANDS.find((command) => command === value), parsePort = (value) => {
  if (typeof value != "string") return;
  let port = Number(value);
  if (!Number.isInteger(port) || port < 1024 || port > 65535)
    throw new Error(`Invalid port: ${value} (expected 1024-65535)`);
  return port;
}, parseCliArgs = (argv) => {
  let { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: !0,
    strict: !1,
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
      categories: { type: "boolean" },
      findings: { type: "boolean" },
      port: { type: "string", short: "p" }
    }
  }), [first, ...rest] = positionals, command = toCommand(first), categoriesRequested = values.categories === !0, findingsRequested = values.findings === !0, help = values.help === !0, version = values.version === !0, bare = positionals.length === 0 && !categoriesRequested && !findingsRequested && !help && !version;
  return {
    command,
    unknown: command === void 0 ? first : void 0,
    values: rest,
    categoriesRequested,
    findingsRequested,
    help,
    version,
    bare,
    port: parsePort(values.port)
  };
};

// src/cli/run-hook.ts
import process2, { stderr, stdout as stdout2 } from "node:process";
var normalize = (result) => typeof result == "string" ? { output: result, finding: !1 } : { output: result.output, finding: result.hasFinding }, executeHook = async (handler, args2) => {
  try {
    let { output, finding } = normalize(await handler(args2));
    stdout2.write(output), finding && (process2.exitCode = 1);
  } catch (error) {
    stderr.write(`${error instanceof Error ? error.message : String(error)}
`), process2.exitCode = 1;
  }
};

// src/core/migrate.ts
import { rename, rmdir } from "node:fs/promises";
import { join as join8, resolve } from "node:path";

// src/catalog/builtin.ts
var BUILTIN_SPECIALIZATIONS = [
  {
    name: "regex",
    tags: ["Regular Expression"],
    categories: ["owasp"],
    required: !0
  },
  {
    name: "javascript",
    tags: ["Node.js", "Deno", "Bun", "TypeScript"],
    categories: ["javascript"]
  },
  {
    name: "browser",
    tags: ["DOM", "Client-Side", "CSP"],
    categories: ["javascript", "lovable"]
  },
  {
    name: "network",
    tags: ["Requests", "Webhook", "URL Fetch", "Socket", "IMDS", "Redirect"],
    categories: ["owasp"]
  },
  {
    name: "interpreter",
    tags: ["Evaluator", "Sink", "Shell", "Dynamic Execution"],
    categories: ["owasp", "lovable"]
  },
  {
    name: "sql",
    tags: ["MySQL", "PostgreSQL", "MariaDB", "ORM"],
    categories: ["owasp"]
  },
  {
    name: "path",
    tags: ["Directory Traversal", "File Path", "Filesystem", "NTFS"],
    categories: ["owasp"]
  },
  {
    name: "upload",
    tags: ["File Upload", "Multipart", "Attachment", "MIME Type"],
    categories: ["owasp"]
  },
  {
    name: "access-control",
    tags: ["Authentication", "Authorization", "Session", "RBAC"],
    categories: ["owasp", "lovable"]
  },
  {
    name: "credential-endpoint",
    tags: ["Login", "Rate Limiting", "Anti-Automation", "CAPTCHA"],
    categories: ["owasp", "lovable"]
  },
  {
    name: "federation",
    tags: ["OAuth", "OIDC", "SAML", "JWT"],
    categories: ["owasp"]
  },
  {
    name: "http-request",
    tags: ["CSRF", "CORS", "Origin Header", "Forwarded Headers"],
    categories: ["owasp"]
  },
  {
    name: "transport",
    tags: ["TLS", "HTTPS", "HSTS", "Certificate Pinning"],
    categories: ["owasp"]
  },
  {
    name: "crypto",
    tags: ["Cryptography", "Encryption", "Key Management", "Randomness"],
    categories: ["owasp", "lovable"]
  },
  {
    name: "secrets",
    tags: ["Hardcoded Credential", "API Key", "Token", "Env Var"],
    categories: ["owasp", "lovable"]
  },
  {
    name: "api-endpoint",
    tags: ["GraphQL", "gRPC", "WebSocket", "RPC"],
    categories: ["owasp"]
  },
  {
    name: "payment",
    tags: ["Checkout", "Gateway", "PSP", "Stripe"],
    categories: ["owasp", "lovable"]
  },
  {
    name: "xml",
    tags: ["XXE", "DTD", "Entity Expansion", "SAML"],
    categories: ["owasp"]
  },
  {
    name: "csv",
    tags: ["Formula Injection", "Spreadsheet", "Excel"],
    categories: ["owasp"]
  },
  {
    name: "container",
    tags: ["Docker", "Kubernetes", "Dockerfile", "Pod Security"],
    categories: ["owasp", "infra"]
  },
  {
    name: "infra",
    tags: ["Terraform", "Dockerfile", "GitHub Actions", "IaC"],
    categories: ["infra"]
  },
  {
    name: "serverless",
    tags: ["FaaS", "Lambda", "Cloud Functions", "IAM"],
    categories: ["owasp", "infra", "lovable"]
  },
  {
    name: "llm",
    tags: ["AI API", "RAG", "MCP", "Agent"],
    categories: ["ai", "lovable"]
  },
  {
    name: "supabase",
    tags: ["Lovable", "RLS", "PostgREST", "service_role"],
    categories: ["lovable"]
  },
  {
    name: "python",
    tags: ["CPython", "pickle", "Django"],
    categories: ["python"]
  },
  {
    name: "rust",
    tags: ["Cargo", "crates.io", "unsafe"],
    categories: ["rust"]
  },
  {
    name: "java",
    tags: ["JVM", "Serializable", "Cloneable"],
    categories: ["java"]
  },
  {
    name: "ruby",
    tags: ["Rails", "Marshal", "Psych"],
    categories: ["ruby"]
  },
  {
    name: "php",
    tags: ["Laravel", "Symfony", "WordPress", "Composer"],
    categories: ["php"]
  },
  {
    name: "go",
    tags: ["Golang", "goroutine", "go vet"],
    categories: ["go"]
  },
  {
    name: "c-cpp",
    tags: ["C", "C++"],
    categories: ["c-cpp"]
  },
  {
    name: "dotnet",
    tags: [".NET", "C#", "ASP.NET", "BinaryFormatter"],
    categories: ["dotnet"]
  }
];

// src/catalog/project.ts
import { join as join5 } from "node:path";
import { fileURLToPath } from "node:url";

// src/categories/project.ts
import { join as join4 } from "node:path";

// src/core/state-file.ts
import { join as join3 } from "node:path";
var containedStateFile = async (cwd14, file) => {
  let path = await fileWithin(cwd14, join3(cwd14, file));
  if (path === void 0)
    throw new Error(
      `${file} must be a file inside this project, not a link or a path outside it: fix it, then run this again.`
    );
  return path;
};

// src/categories/project.ts
var DEFAULT_CATEGORIES = ["owasp"], recordedIn = (configs) => {
  if (configs.categories !== void 0) {
    if (!isStringArray(configs.categories))
      throw new Error(
        `${CONFIGS_FILE} records categories that are not a list of names: fix it, then run this again.`
      );
    return [...configs.categories];
  }
}, readProjectCategories = async (cwd14) => recordedIn(await readConfigs(cwd14)), usedCategories = (recorded) => recorded ?? DEFAULT_CATEGORIES, recordCategories = async (cwd14, categories) => {
  await ensureDir(join4(cwd14, ".lagune"));
  let path = await containedStateFile(cwd14, CONFIGS_FILE);
  await writeConfigs(path, { categories });
};

// src/catalog/catalog.ts
var builtinsIn = (builtins, keys) => builtins.filter(
  (entry2) => entry2.categories.some((key) => keys.includes(key))
), merge = (builtin, own3) => {
  let overridden = new Set(own3.map((entry2) => entry2.name));
  return [...builtin.filter((entry2) => !overridden.has(entry2.name)), ...own3];
}, list2 = (catalog) => catalog.length === 0 ? `No specialization is in this project's catalog.
` : `${catalog.map((entry2) => {
  let base = entry2.tags.length === 0 ? entry2.name : `${entry2.name}: ${entry2.tags.join(", ")}`;
  return entry2.required === !0 ? `${base} [required]` : base;
}).join(`
`)}
`;

// src/catalog/name.ts
var NAME_CHARACTER = /[a-z0-9-]/, leadingNameLength = (text3) => {
  let length = 0;
  for (; length < text3.length && NAME_CHARACTER.test(text3[length]); ) length += 1;
  return length;
}, isSpecializationName = (value) => value.length > 0 && leadingNameLength(value) === value.length;

// src/catalog/project.ts
var CATALOG_DIR = ".lagune/catalog", toSpecialization = (value) => {
  if (!isRecord(value)) return [];
  let { name, tags } = value;
  return typeof name != "string" || !isSpecializationName(name) ? [] : isStringArray(tags) ? [{ name, tags: [...tags] }] : [];
}, specializationsOf = (entries) => Array.isArray(entries) ? entries.flatMap(toSpecialization) : [], readOwnIndex = async (cwd14) => specializationsOf((await readConfigs(cwd14)).catalog), ownFile = (cwd14, name) => existingWithin(cwd14, join5(cwd14, CATALOG_DIR, `${name}.md`)), presentOwn = async (cwd14, entries) => {
  let present = await Promise.all(
    entries.map((entry2) => ownFile(cwd14, entry2.name))
  );
  return entries.filter((_entry, index2) => present[index2] !== void 0);
}, resolveCatalog = async (cwd14, categories, own3) => merge(
  builtinsIn(BUILTIN_SPECIALIZATIONS, categories),
  await presentOwn(cwd14, own3)
), catalogEntries = async (cwd14) => {
  let [categories, own3] = await Promise.all([
    readProjectCategories(cwd14),
    readOwnIndex(cwd14)
  ]);
  return resolveCatalog(cwd14, usedCategories(categories), own3);
}, isBuiltin = (name) => BUILTIN_SPECIALIZATIONS.some((entry2) => entry2.name === name), readOwn = async (cwd14, name) => {
  let file = await ownFile(cwd14, name);
  return file === void 0 ? null : readText(file);
}, readSpecialization = async (cwd14, packageRoot2, name) => {
  let own3 = await readOwn(cwd14, name);
  return own3 !== null ? own3 : isBuiltin(name) ? await readText(
    fileURLToPath(new URL(`catalog/${name}.md`, packageRoot2))
  ) ?? void 0 : void 0;
};

// src/core/gitignore.ts
import { join as join6 } from "node:path";
var SECTION_HEADER = "# Lagune", LAGUNE_ENTRIES = [
  "/.lagune/templates/",
  "/.lagune/hooks/",
  "/.lagune/proofs/",
  "/.lagune/specializations.md",
  "/.lagune/skills/*",
  "/**/lagune.*",
  "/**/lagune/"
], KEPT_SPECIALIZATION_PREFIX = "!/.lagune/skills/", isLaguneLine = (line) => line === SECTION_HEADER || LAGUNE_ENTRIES.includes(line) || line.startsWith(KEPT_SPECIALIZATION_PREFIX), tidy = (lines) => lines.join(`
`).replace(/\n{3,}/g, `

`).trim(), removeLaguneBlock = async (cwd14) => {
  let path = await fileWithin(cwd14, join6(cwd14, ".gitignore"));
  if (path === void 0) return "unchanged";
  let existing = await readText(path);
  if (existing === null) return "unchanged";
  let lines = existing.split(`
`);
  if (!lines.some((line) => isLaguneLine(line.trimEnd()))) return "unchanged";
  let kept = tidy(lines.filter((line) => !isLaguneLine(line.trimEnd())));
  return kept === "" ? (await removeFileIfPresent(path), "removed") : (await writeFileOverwrite(path, `${kept}
`), "updated");
};

// src/core/legacy-commands.ts
import { join as join7 } from "node:path";
var COMMAND_FOLDERS = [
  ".adal/skills",
  ".agent/skills",
  ".agents/commands",
  ".agents/skills",
  ".aider-desk/skills",
  ".amazonq/prompts",
  ".augment/commands",
  ".autohand/skills",
  ".bob/commands",
  ".claude/skills",
  ".cline/skills",
  ".clinerules/workflows",
  ".codeartsdoer/skills",
  ".codebuddy/commands",
  ".codemaker/skills",
  ".codestudio/skills",
  ".codex/skills",
  ".commandcode/skills",
  ".continue/prompts",
  ".cortex/skills",
  ".cospec/commands",
  ".crush/commands",
  ".crush/skills",
  ".cursor/skills",
  ".devin/skills",
  ".factory/commands",
  ".factory/skills",
  ".firebender/commands",
  ".forge/commands",
  ".gemini/commands",
  ".github/prompts",
  ".github/skills",
  ".goose/recipes",
  ".hermes/skills",
  ".iflow/commands",
  ".inferencesh/skills",
  ".jazz/skills",
  ".junie/commands",
  ".kilo/skills",
  ".kilocode/workflows",
  ".kimi/skills",
  ".kiro/prompts",
  ".kode/skills",
  ".lingma/skills",
  ".mcpjam/skills",
  ".moxby/skills",
  ".mux/skills",
  ".neovate/commands",
  ".ona/skills",
  ".opencode/commands",
  ".openhands/skills",
  ".pi/prompts",
  ".pochi/skills",
  ".qoder/commands",
  ".qwen/commands",
  ".reasonix/skills",
  ".roo/commands",
  ".rovodev/skills",
  ".shai/commands",
  ".shai/skills",
  ".tabnine/agent/commands",
  ".terramind/skills",
  ".tinycloud/skills",
  ".trae/skills",
  ".vibe/skills",
  ".windsurf/workflows",
  ".xum/skills",
  ".zcode/skills",
  ".zencoder/skills",
  "agent/skills",
  "data/skills",
  "skills"
], COMMAND_NAME = /^lagune(\.(?:charter|detect|harden|plan|prove|repair|specialize|verify))?(\.(?:md|mdc|toml|yaml|prompt|prompt\.md))?$/, MAIN_COMMAND_MARK = ".lagune/specializations.md", commandOf = (folder, name) => {
  let match = COMMAND_NAME.exec(name);
  if (match === null) return [];
  let [, subcommand2, extension2] = match, path = `${folder}/${name}`, main = subcommand2 === void 0;
  return extension2 === void 0 ? [{ path: `${path}/`, main, source: `${path}/SKILL.md` }] : [{ path, main, source: path }];
}, commandsIn = async (cwd14, folder) => (await listingWithin(cwd14, join7(cwd14, folder))).flatMap(
  (name) => commandOf(folder, name)
), readWithin = async (cwd14, path) => {
  let real = await existingWithin(cwd14, join7(cwd14, path));
  return (real === void 0 ? null : await readText(real)) ?? "";
}, isLegacy = async (cwd14, command) => !command.main || (await readWithin(cwd14, command.source)).includes(MAIN_COMMAND_MARK), legacyCommands = async (cwd14) => {
  let found = (await Promise.all(COMMAND_FOLDERS.map((folder) => commandsIn(cwd14, folder)))).flat(), legacy = await Promise.all(
    found.map((command) => isLegacy(cwd14, command))
  );
  return found.filter((_command, index2) => legacy[index2]).map((command) => command.path);
};

// src/core/migrate.ts
var MANIFEST_FILE = ".lagune/manifest.json", BLUE_SPEC_DIR = ".bluespec", LEGACY_INDEX_FILE = ".lagune/skills.json", LEGACY_SPECIALIZATIONS_DIR = ".lagune/skills", PROOFS_DIR = ".lagune/proofs", GENERATED = [
  ".lagune/templates/",
  ".lagune/hooks/",
  ".lagune/specializations.md"
], CONFIG_FIELDS = ["categories", "catalog"], hasManifest = (cwd14) => pathExists(join8(cwd14, MANIFEST_FILE)), hasBlueSpec = (cwd14) => pathExists(join8(cwd14, BLUE_SPEC_DIR)), readManifestCategories = async (cwd14) => {
  let raw = await readText(join8(cwd14, MANIFEST_FILE));
  if (raw === null) return;
  let { categories } = parseJsonObject(raw, MANIFEST_FILE);
  return isStringArray(categories) ? categories : void 0;
}, readLegacyIndex = async (cwd14) => {
  let raw = await readText(join8(cwd14, LEGACY_INDEX_FILE));
  return raw === null ? [] : specializationsOf(parseJsonObject(raw, LEGACY_INDEX_FILE).entries);
}, removeWithin = async (cwd14, path) => {
  let entry2 = await entryWithin(cwd14, resolve(cwd14, path));
  return entry2 === void 0 ? !1 : await removeEntryIfPresent(entry2) === "removed";
}, removeAll = async (cwd14, paths) => {
  let removed = await Promise.all(
    paths.map((path) => removeWithin(cwd14, path))
  );
  return paths.filter((_path, index2) => removed[index2]);
}, legacyFiles = async (cwd14) => (await listingWithin(cwd14, join8(cwd14, LEGACY_SPECIALIZATIONS_DIR))).filter((entry2) => entry2.endsWith(".md")).toSorted(), isGeneratedCopy = (file, ownNames) => {
  let name = file.slice(0, -3);
  return !ownNames.has(name) && BUILTIN_SPECIALIZATIONS.some((entry2) => entry2.name === name);
}, moveIfFree = async (cwd14, file) => {
  let [from, to] = await Promise.all([
    entryWithin(cwd14, join8(cwd14, file.from)),
    entryWithin(cwd14, join8(cwd14, file.to))
  ]);
  return from === void 0 || to === void 0 || await pathExists(to) ? !1 : (await rename(from, to), !0);
}, removeIfEmpty = (dir) => rmdir(dir).catch(() => {
}), moveOwnSpecializations = async (cwd14, files) => {
  let planned = files.map((file) => ({
    from: `${LEGACY_SPECIALIZATIONS_DIR}/${file}`,
    to: `${CATALOG_DIR}/${file}`
  }));
  planned.length > 0 && await ensureDir(join8(cwd14, CATALOG_DIR));
  let outcomes = await Promise.all(
    planned.map((file) => moveIfFree(cwd14, file))
  );
  return {
    moved: planned.filter((_file, index2) => outcomes[index2]),
    kept: planned.filter((_file, index2) => !outcomes[index2]).map((file) => file.from)
  };
}, mergedEntries = (current, legacy) => [
  ...current,
  ...legacy.filter(
    (entry2) => !current.some((existing) => existing.name === entry2.name)
  )
], configChanges = (categories, catalog) => ({
  ...categories === void 0 ? {} : { categories },
  ...catalog.length === 0 ? {} : { catalog }
}), guardProofs = async (cwd14) => {
  let ignore = await fileWithin(cwd14, join8(cwd14, PROOFS_DIR, ".gitignore"));
  return ignore === void 0 || await pathExists(ignore) ? !1 : (await writeFileOverwrite(ignore, `*
`), !0);
}, changedAnything = (summary) => summary.manifest || summary.removed.length > 0 || summary.moved.length > 0 || summary.kept.length > 0 || summary.configs.length > 0 || summary.gitignore !== "unchanged" || summary.proofs, performMigrate = async (cwd14) => {
  let [manifestCategories, legacy, ownIndex, recorded, files] = await Promise.all([
    readManifestCategories(cwd14),
    readLegacyIndex(cwd14),
    readOwnIndex(cwd14),
    readProjectCategories(cwd14),
    legacyFiles(cwd14)
  ]), changes = configChanges(
    recorded === void 0 ? manifestCategories : void 0,
    legacy.length === 0 ? [] : mergedEntries(ownIndex, legacy)
  ), configs = CONFIG_FIELDS.filter((field) => changes[field] !== void 0), configsFile = configs.length === 0 ? void 0 : await containedStateFile(cwd14, CONFIGS_FILE), ownNames = new Set([...legacy, ...ownIndex].map((entry2) => entry2.name)), copies = files.filter((file) => isGeneratedCopy(file, ownNames)).map((file) => `${LEGACY_SPECIALIZATIONS_DIR}/${file}`), own3 = files.filter((file) => !isGeneratedCopy(file, ownNames)), removed = await removeAll(cwd14, [
    ...GENERATED,
    ...copies,
    ...await legacyCommands(cwd14)
  ]), { moved: moved2, kept } = await moveOwnSpecializations(cwd14, own3);
  await removeIfEmpty(join8(cwd14, LEGACY_SPECIALIZATIONS_DIR)), configsFile !== void 0 && await writeConfigs(configsFile, changes);
  let index2 = await removeAll(cwd14, [LEGACY_INDEX_FILE]), proofs = await guardProofs(cwd14), gitignore = await removeLaguneBlock(cwd14), summary = {
    manifest: await removeWithin(cwd14, MANIFEST_FILE),
    removed: [...removed, ...index2],
    moved: moved2,
    kept,
    configs,
    gitignore,
    proofs
  };
  return changedAnything(summary) ? { migrated: !0, ...summary } : { migrated: !1 };
};

// src/bin/fallback.ts
import { spawn } from "node:child_process";
import { basename as basename3, delimiter as delimiter2, dirname as dirname3, join as join10 } from "node:path";
import { env as env3, execPath } from "node:process";

// src/core/search-path.ts
import { basename as basename2, delimiter, dirname as dirname2, isAbsolute, join as join9 } from "node:path";
import { env as env2, platform } from "node:process";
var isPackageBinFolder = (entry2) => basename2(entry2) === ".bin" && basename2(dirname2(entry2)) === "node_modules";
var pathKey = () => Object.keys(env2).find((key) => key.toUpperCase() === "PATH") ?? "PATH", trustedFolders = (inherited) => (inherited ?? "").split(delimiter).filter((entry2) => isAbsolute(entry2) && !isPackageBinFolder(entry2));

// src/bin/fallback.ts
var FROZEN_VERSION = "0.15.0", FROZEN_ENGINE = ["--yes", "--prefer-offline", `lagune@${FROZEN_VERSION}`], SKILLS_ONLY_COMMANDS = /* @__PURE__ */ new Set(["catalog"]), CATEGORY_COMMANDS = /* @__PURE__ */ new Set(["add", "remove", "list"]), NPX_ENTRY = "npx-cli.js", HANDOFF_MARK = "LAGUNE_FROZEN_HANDOFF", NPM_CONFIG_PREFIX = "npm_config_", EXEC_SELECTORS = /* @__PURE__ */ new Set([
  "package",
  "call",
  "workspace",
  "workspaces",
  "include-workspace-root"
]), installedRoute = (args2) => args2.command === "migrate" || args2.unknown !== void 0 ? "local" : args2.command !== void 0 && SKILLS_ONLY_COMMANDS.has(args2.command) || args2.categoriesRequested && args2.command !== void 0 && CATEGORY_COMMANDS.has(args2.command) ? "refused" : "frozen", npxLayouts = (runtimeFolder) => [
  join10(runtimeFolder, "npx"),
  join10(runtimeFolder, "node_modules", "npm", "bin", NPX_ENTRY)
], npxBeside = async (runtime) => {
  let realRuntime = await realPathOf(runtime);
  return realRuntime === void 0 ? void 0 : (await Promise.all(
    npxLayouts(dirname3(realRuntime)).map(realPathOf)
  )).find(
    (entry2) => entry2 !== void 0 && basename3(entry2) === NPX_ENTRY
  );
}, pinnedPath = (runtime, inherited) => [dirname3(runtime), ...trustedFolders(inherited)].join(delimiter2), selectsExec = (key) => {
  let lowered = key.toLowerCase();
  return lowered.startsWith(NPM_CONFIG_PREFIX) && EXEC_SELECTORS.has(
    lowered.slice(NPM_CONFIG_PREFIX.length).replaceAll("_", "-")
  );
}, pinnedEnv = () => {
  let key = pathKey(), pinned = Object.assign(
    /* @__PURE__ */ Object.create(null),
    Object.fromEntries(
      Object.entries(env3).filter(([name]) => !selectsExec(name))
    )
  );
  return pinned[key] = pinnedPath(execPath, env3[key]), pinned[HANDOFF_MARK] = FROZEN_VERSION, pinned;
}, frozenNpx = async () => {
  if (env3[HANDOFF_MARK] !== void 0)
    throw new Error(handoffLoop(FROZEN_VERSION));
  let npx = await npxBeside(execPath);
  if (npx === void 0) throw new Error(handoffUnavailable(FROZEN_VERSION));
  return npx;
}, handOff = (npx, args2) => new Promise((resolve5, reject) => {
  let child = spawn(execPath, [npx, ...FROZEN_ENGINE, ...args2], {
    stdio: "inherit",
    shell: !1,
    env: pinnedEnv()
  });
  child.once("error", reject), child.once("close", (code) => resolve5(code ?? 1));
});

// src/hooks/agent/cli.ts
import { cwd } from "node:process";
import { parseArgs as parseNodeArgs } from "node:util";

// src/core/scan/driver.ts
import { readFile as readFile2 } from "node:fs/promises";
import { join as join12 } from "node:path";

// src/core/scan/walk.ts
import { readdir as readdir2, stat } from "node:fs/promises";
import { join as join11, relative } from "node:path";
var isIgnoredDir = (filter, scanRoot, path, name) => filter.ignoredDirs.has(name) || filter.ignoredDirPatterns.some((pattern) => pattern.test(name)) || path === join11(scanRoot, ".lagune"), collect = async (scanRoot, displayRoot, current, filter) => {
  let entries;
  try {
    entries = await readdir2(current, { withFileTypes: !0 });
  } catch {
    return [];
  }
  let found = [];
  for (let entry2 of entries.toSorted(
    (a, b) => a.name.localeCompare(b.name)
  )) {
    let path = join11(current, entry2.name);
    if (entry2.isDirectory()) {
      if (isIgnoredDir(filter, scanRoot, path, entry2.name)) continue;
      found.push(...await collect(scanRoot, displayRoot, path, filter));
      continue;
    }
    if (entry2.isFile()) {
      let rel = relative(displayRoot, path);
      filter.accept(rel) && found.push(rel);
    }
  }
  return found;
}, walk2 = async (displayRoot, target, filter) => {
  try {
    if ((await stat(target)).isFile()) {
      let rel = relative(displayRoot, target);
      return filter.accept(rel) ? [rel] : [];
    }
    return collect(target, displayRoot, target, filter);
  } catch {
    return [];
  }
};

// src/core/scan/driver.ts
var readText2 = async (path) => {
  try {
    return await readFile2(path, "utf8");
  } catch {
    return null;
  }
}, isPresent = (entry2) => entry2 !== null, details = (analyzed, pick) => analyzed.flatMap(
  ({ file, analysis }) => pick(analysis).map((detail) => ({ file, detail }))
), scanReport = async (root, targets, filter, analyze8) => {
  let walked = await Promise.all(
    targets.map((target) => walk2(root, target, filter))
  ), files = [...new Set(walked.flat())].toSorted(
    (a, b) => a.localeCompare(b)
  ), present = (await Promise.all(
    files.map(async (file) => {
      let content3 = await readText2(join12(root, file));
      return content3 === null ? null : { file, analysis: analyze8(file, content3) };
    })
  )).filter(isPresent);
  return {
    findings: details(present, (analysis) => analysis.findings),
    review: details(present, (analysis) => analysis.review),
    advisory: details(present, (analysis) => analysis.advisory)
  };
};

// src/core/scan/filters.ts
var BASE_IGNORED_DIRS = /* @__PURE__ */ new Set([
  ".git",
  ".hg",
  ".svn",
  "node_modules",
  "bower_components",
  ".next",
  ".nuxt",
  ".svelte-kit",
  ".angular",
  ".astro",
  ".parcel-cache",
  ".turbo",
  ".output",
  ".cache",
  "__pycache__",
  ".venv",
  ".tox",
  ".mypy_cache",
  ".pytest_cache",
  ".ruff_cache",
  ".gradle",
  ".bundle",
  ".dart_tool",
  ".build",
  "Pods",
  "Carthage",
  "DerivedData",
  ".terraform",
  ".idea",
  "__test__",
  "__tests__",
  "__fixture__",
  "__fixtures__"
]), BASE_IGNORED_DIR_PATTERNS = [
  /^lagune-/,
  /\.egg-info$/
], IGNORED_EXTENSIONS = /* @__PURE__ */ new Set([
  ".gif",
  ".gz",
  ".ico",
  ".jpeg",
  ".jpg",
  ".lock",
  ".pdf",
  ".png",
  ".svg",
  ".tar",
  ".webp",
  ".woff",
  ".woff2",
  ".zip",
  ".md",
  ".mdx",
  ".yml",
  ".yaml",
  ".txt",
  ".json",
  ".jsonc",
  ".toml",
  ".csv",
  ".xml",
  ".css",
  ".scss"
]), IGNORED_NAME_PATTERNS = [
  /\.(test|spec)\.[^.]{1,200}$/i,
  /(^|[/\\])\.env(\.[^/\\]*)?$/i,
  /\.min\.[^./\\]{1,10}$/i
], hasIgnoredExtension = (path) => {
  let dot = path.lastIndexOf(".");
  return dot !== -1 && IGNORED_EXTENSIONS.has(path.slice(dot).toLowerCase());
}, SOURCE_FILTER = {
  ignoredDirs: BASE_IGNORED_DIRS,
  ignoredDirPatterns: BASE_IGNORED_DIR_PATTERNS,
  accept: (relativePath) => !hasIgnoredExtension(relativePath) && !IGNORED_NAME_PATTERNS.some((pattern) => pattern.test(relativePath))
};

// src/core/scan/report.ts
var groupByFile = (items) => {
  let groups = /* @__PURE__ */ new Map();
  for (let { file, detail } of items) {
    let details2 = groups.get(file) ?? [];
    details2.push(detail), groups.set(file, details2);
  }
  return groups;
}, groupedSection = (header2, items) => {
  let blocks = [...groupByFile(items)].toSorted(([left], [right]) => left.localeCompare(right)).map(([file, details2]) => {
    let lines = details2.map((detail) => `  ${detail}`).join(`
`);
    return `${file}
${lines}`;
  });
  return `${header2}

${blocks.join(`

`)}`;
}, formatReport = (report, headings) => {
  let sections = [];
  return report.findings.length > 0 && sections.push(groupedSection(headings.findings, report.findings)), report.review.length > 0 && headings.review !== void 0 && sections.push(groupedSection(headings.review, report.review)), report.advisory.length > 0 && headings.advisory !== void 0 && sections.push(groupedSection(headings.advisory, report.advisory)), sections.length === 0 ? headings.sentinel : `${sections.join(`

`)}
`;
};

// src/core/scan/targets.ts
import { isAbsolute as isAbsolute2, relative as relative2, resolve as resolve2, sep as sep2 } from "node:path";
var realOrSelf = async (path) => await realPathOf(path) ?? path, isWithin2 = (root, path) => {
  let fromRoot = relative2(root, path);
  return !isAbsolute2(fromRoot) && fromRoot !== ".." && !fromRoot.startsWith(`..${sep2}`);
}, resolveTargets = async (root, targets) => {
  let realRoot = await realOrSelf(root), resolved = await Promise.all(
    (targets.length > 0 ? targets : ["."]).map(async (target) => {
      let path = resolve2(root, target);
      return { target, path, real: await realOrSelf(path) };
    })
  ), outside = resolved.filter(({ real }) => !isWithin2(realRoot, real));
  if (outside.length > 0)
    throw new Error(
      `the checkers scan only inside the project, and ${outside.map(({ target }) => `"${target}"`).join(", ")} is outside it`
    );
  return resolved.map(({ path }) => path);
};

// src/core/scan/language.ts
import { extname } from "node:path";
var EXTENSIONS = {
  ".js": "javascript",
  ".jsx": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".ts": "javascript",
  ".tsx": "javascript",
  ".mts": "javascript",
  ".cts": "javascript",
  ".astro": "javascript",
  ".vue": "javascript",
  ".svelte": "javascript",
  ".marko": "javascript",
  ".riot": "javascript",
  ".py": "python",
  ".pyi": "python",
  ".rb": "ruby",
  ".go": "go",
  ".php": "php",
  ".rs": "rust",
  ".java": "java",
  ".cs": "csharp",
  ".c": "c",
  ".h": "c",
  ".cc": "cpp",
  ".cpp": "cpp",
  ".cxx": "cpp",
  ".hpp": "cpp",
  ".hh": "cpp",
  ".hxx": "cpp",
  ".kt": "kotlin",
  ".kts": "kotlin",
  ".swift": "swift",
  ".scala": "scala",
  ".sc": "scala",
  ".dart": "dart",
  ".ps1": "powershell",
  ".psm1": "powershell",
  ".psd1": "powershell",
  ".ex": "elixir",
  ".exs": "elixir",
  ".m": "objc",
  ".mm": "objc",
  ".r": "r",
  ".jl": "julia",
  ".clj": "clojure",
  ".cljs": "clojure",
  ".cljc": "clojure",
  ".edn": "clojure",
  ".cr": "crystal",
  ".nim": "nim",
  ".nims": "nim",
  ".v": "vlang",
  ".d": "dlang",
  ".pl": "perl",
  ".pm": "perl"
}, BY_EXTENSION = EXTENSIONS, languageOf = (file) => BY_EXTENSION[extname(file).toLowerCase()] ?? null;

// src/core/scan/lines.ts
var C_STYLE = { line: ["//"], block: ["/*", "*/"] }, HASH = { line: ["#"] }, COMMENT_SPECS = {
  javascript: C_STYLE,
  c: C_STYLE,
  cpp: C_STYLE,
  objc: C_STYLE,
  java: C_STYLE,
  kotlin: C_STYLE,
  csharp: C_STYLE,
  go: C_STYLE,
  rust: C_STYLE,
  swift: C_STYLE,
  scala: C_STYLE,
  dart: C_STYLE,
  vlang: C_STYLE,
  dlang: C_STYLE,
  php: { line: ["//", "#"], block: ["/*", "*/"] },
  python: HASH,
  ruby: HASH,
  perl: HASH,
  elixir: HASH,
  r: HASH,
  julia: HASH,
  crystal: HASH,
  nim: HASH,
  powershell: HASH,
  clojure: { line: [";"] }
}, FALLBACK = C_STYLE, commentSpec = (language) => language && COMMENT_SPECS[language] || FALLBACK, LEADING_WHITESPACE = /^\s*/, isWholeLineComment = (line, spec) => {
  let rest = line.slice(LEADING_WHITESPACE.exec(line)[0].length);
  return spec.line.some(
    (leader) => rest.startsWith(leader) && !(leader === "#" && rest.startsWith("#["))
  );
}, scanOutsideBlock = (line, spec) => {
  if (isWholeLineComment(line, spec)) return { text: "", inBlock: !1 };
  if (spec.block === void 0) return { text: line, inBlock: !1 };
  let [open, close] = spec.block, text3 = "", index2 = 0, inString = !1, quote = "";
  for (; index2 < line.length; ) {
    let char = line[index2];
    if (inString) {
      if (text3 += char, char === "\\") {
        text3 += line[index2 + 1] ?? "", index2 += 2;
        continue;
      }
      char === quote && (inString = !1), index2 += 1;
      continue;
    }
    if (spec.line.some((leader) => line.startsWith(leader, index2)))
      return { text: text3 + line.slice(index2), inBlock: !1 };
    if (line.startsWith(open, index2)) {
      let closeAt = line.indexOf(close, index2 + open.length);
      if (closeAt === -1) return { text: text3, inBlock: !0 };
      text3 += " ", index2 = closeAt + close.length;
      continue;
    }
    (char === '"' || char === "'" || char === "`") && (inString = !0, quote = char), text3 += char, index2 += 1;
  }
  return { text: text3, inBlock: !1 };
}, scanLine = (line, spec, inBlock) => {
  if (!inBlock) return scanOutsideBlock(line, spec);
  if (spec.block === void 0) return { text: line, inBlock: !1 };
  let closeAt = line.indexOf(spec.block[1]);
  return closeAt === -1 ? { text: "", inBlock: !0 } : scanOutsideBlock(line.slice(closeAt + spec.block[1].length), spec);
}, codeLines = (content3, language) => {
  let spec = commentSpec(language), lines = content3.split(`
`), result = [], inBlock = !1;
  for (let line of lines) {
    let scanned = scanLine(line, spec, inBlock);
    result.push(scanned.text), inBlock = scanned.inBlock;
  }
  return result;
}, firedRules = (content3, rules, language) => {
  let lines = codeLines(content3, language);
  return rules.filter((rule2) => lines.some((line) => rule2.regex.test(line))).map((rule2) => rule2.detail);
};

// src/hooks/agent/patterns.ts
var SDK_IMPORT = {
  javascript: /(?:\bfrom\s{1,16}|\brequire\s{0,16}\(\s{0,16})["']@anthropic-ai\/claude-(?:agent|code)-sdk["']/,
  python: /(?:from|import)\s{1,16}(?:langchain|langgraph|llama_index|crewai|autogen|agents|claude_agent_sdk|claude_code_sdk)\b/
}, ALWAYS_LOOP_CALL = {
  javascript: /\bquery\s{0,16}\(\s{0,16}\{|\bclaude\.\s{0,16}query\s{0,16}\(/,
  python: /\bAgentExecutor\s{0,16}\(|\binitialize_agent\s{0,16}\(|\bcreate_(?:react|tool_calling|openai_tools|structured_chat)_agent\s{0,16}\(|\bCrew\s{0,16}\(|\bRunner\.run\w{0,8}\s{0,16}\(/
}, CAP = {
  javascript: /\bmaxTurns\s{0,16}:\s{0,16}(?!0\b)[A-Za-z0-9_]|\bmaxBudgetUsd\s{0,16}:\s{0,16}(?!0\b)[A-Za-z0-9_]|\bstopWhen\s{0,16}:|\babortController\s{0,16}[:,}]|\babortSignal\s{0,16}[:,}]|\bsignal\s{0,16}:|\btimeout\s{0,16}:\s{0,16}(?!0\b)[A-Za-z0-9_]/,
  python: /\bmax_iterations\s{0,16}=\s{0,16}(?!None)|\bmax_execution_time\s{0,16}=\s{0,16}(?!None)|\brecursion_limit\s{0,16}[=:]|\bmax_iter\s{0,16}=\s{0,16}(?!None)|\bmax_turns\s{0,16}=\s{0,16}(?!None)/
}, UNCAPPED_RULES = {
  python: [
    {
      regex: /\bmax_iterations\s{0,16}=\s{0,16}None\b/,
      detail: "agent with max_iterations=None: removes the default step cap, so the tool loop is unbounded (DoS / cost-burn)"
    },
    {
      regex: /\bmax_execution_time\s{0,16}=\s{0,16}None\b/,
      detail: "agent with max_execution_time=None: removes the time bound on the loop (a step cap, if set, still applies)"
    },
    {
      regex: /\bmax_iter\s{0,16}=\s{0,16}None\b/,
      detail: "agent with max_iter=None: removes the default iteration cap, so the loop is unbounded"
    },
    {
      regex: /\bmax_turns\s{0,16}=\s{0,16}None\b/,
      detail: "agent with max_turns=None: removes the turn limit, so the agent loop is unbounded (DoS / cost-burn)"
    }
  ]
}, FLAGS_MISSING_CAP = {
  javascript: !0
}, SUPPORTED_LANGUAGES = Object.keys(
  SDK_IMPORT
), isSupportedLanguage = (value) => SUPPORTED_LANGUAGES.includes(value), sdkImportOf = (language) => SDK_IMPORT[language] ?? null, alwaysLoopCallsOf = (language) => ALWAYS_LOOP_CALL[language] ?? null, capOf = (language) => CAP[language] ?? null, uncappedRulesOf = (language) => UNCAPPED_RULES[language] ?? [], flagsMissingCap = (language) => FLAGS_MISSING_CAP[language] ?? !1;

// src/hooks/agent/agent.ts
var EMPTY = { findings: [], review: [], advisory: [] }, WINDOW = 30, UNCAPPED_DETAIL = "agent runtime call without a step/turn/time/budget cap (maxTurns/maxBudgetUsd/stopWhen/signal): DoS and cost-burn risk", hasUncappedLoop = (language, content3) => {
  if (!flagsMissingCap(language)) return !1;
  let always = alwaysLoopCallsOf(language);
  if (always === null) return !1;
  let cap = capOf(language), lines = codeLines(content3, language);
  for (let index2 = 0; index2 < lines.length; index2 += 1) {
    if (!always.test(lines[index2])) continue;
    let window = lines.slice(index2, Math.min(lines.length, index2 + WINDOW)).join(`
`);
    if (!(cap !== null && cap.test(window)))
      return !0;
  }
  return !1;
}, analyzeFor = (language, content3) => {
  let sdk = sdkImportOf(language);
  if (sdk === null || !sdk.test(content3)) return EMPTY;
  let findings = [
    ...firedRules(content3, uncappedRulesOf(language), language)
  ];
  return hasUncappedLoop(language, content3) && !findings.includes(UNCAPPED_DETAIL) && findings.push(UNCAPPED_DETAIL), { findings, review: [], advisory: [] };
}, analyze = (file, content3) => {
  let language = languageOf(file);
  return language === null ? EMPTY : analyzeFor(language, content3);
}, classify = (snippet, language) => {
  if (uncappedRulesOf(language).some((rule2) => rule2.regex.test(snippet)))
    return "uncapped";
  let always = alwaysLoopCallsOf(language);
  if (!(always !== null && always.test(snippet))) return "invalid";
  let cap = capOf(language);
  return cap !== null && cap.test(snippet) ? "safe" : flagsMissingCap(language) ? "uncapped" : "safe";
};

// src/hooks/agent/cli.ts
var OPTIONS = {
  pattern: { type: "string", short: "p", multiple: !0 },
  lang: { type: "string", short: "l" },
  dir: { type: "string", short: "d", multiple: !0 },
  file: { type: "string", short: "f", multiple: !0 }
}, HEADINGS = {
  sentinel: `no uncapped agent loops found
`,
  findings: "Uncapped agent loops found:"
}, LANGUAGE_LIST = SUPPORTED_LANGUAGES.join(", "), runCheck = (snippets, lang) => {
  if (lang === void 0)
    throw new Error(`-p needs -l <language> (${LANGUAGE_LIST})`);
  if (!isSupportedLanguage(lang))
    throw new Error(`unknown language "${lang}": use ${LANGUAGE_LIST}`);
  let verdicts = snippets.map((snippet) => classify(snippet, lang));
  return {
    output: verdicts.join(`
`) + `
`,
    hasFinding: verdicts.includes("uncapped")
  };
}, runScan = async (targets) => {
  let root = cwd(), paths = await resolveTargets(root, targets), report = await scanReport(root, paths, SOURCE_FILTER, analyze);
  return {
    output: formatReport(report, HEADINGS),
    hasFinding: report.findings.length > 0
  };
}, run = async (args2) => {
  let { values } = parseNodeArgs({ args: args2, options: OPTIONS, strict: !0 }), snippets = values.pattern ?? [], targets = [...values.dir ?? [], ...values.file ?? []];
  if (snippets.length > 0) {
    if (targets.length > 0)
      throw new Error(
        "-p checks a snippet and cannot be combined with -d or -f"
      );
    return runCheck(snippets, values.lang);
  }
  return runScan(targets);
};

// src/hooks/cors/cli.ts
import { cwd as cwd2 } from "node:process";
import { parseArgs as parseNodeArgs2 } from "node:util";

// src/hooks/cors/cors.ts
var normalize2 = (origin) => origin.trim().replace(/^access-control-allow-origin\s*:\s*/i, "").replace(/^['"`]+|(?<!['"`])['"`]+$/g, "").trim(), scoreToken = (token) => token.toLowerCase() === "null" ? "null" : token.includes("*") ? "wildcard" : "safe", check = (origin) => {
  let scored2 = normalize2(origin).split(/[\s,]+/).filter(Boolean).map(scoreToken);
  return scored2.includes("wildcard") ? "wildcard" : scored2.includes("null") ? "null" : "safe";
};

// src/hooks/regex/lexer.ts
var QUOTES = /* @__PURE__ */ new Set(["'", '"', "`"]), PREFIX_LIMIT = 4, RAW_PREFIXES = {
  python: /(?:^|[^\w])(?:[rR][bB]?|[bB][rR])$/,
  rust: /(?:^|[^\w])r#*$/,
  csharp: /@\$?$|\$@$/,
  dart: /(?:^|[^\w])r$/
}, STATIC_PREFIXES = {
  python: /^(?:[rRbBuU]|[rR][bB]|[bB][rR])$/,
  rust: /^(?:b|b?r#*)$/,
  csharp: /^@$/,
  objc: /^@$/,
  dart: /^r$/
}, STRING_ESCAPES = {
  n: `
`,
  r: "\r",
  t: "	",
  v: "\v",
  f: "\f",
  b: "\b",
  0: "\0"
}, isRawLiteral = (text3, open, language) => text3[open] === "`" ? language === "go" : RAW_PREFIXES[language]?.test(
  text3.slice(Math.max(0, open - PREFIX_LIMIT), open)
) ?? !1, hexAt = (body, from, length) => {
  let digits = body.slice(from, from + length);
  return /^[0-9A-Fa-f]+$/.test(digits) && digits.length === length ? digits : null;
}, decodeEscape = (body, index2, language) => {
  let next = body[index2 + 1] ?? "";
  if (language === "php")
    return next === "\\" || next === "'" || next === '"' ? [next, 2] : [`\\${next}`, 2];
  let byte = next === "x" ? hexAt(body, index2 + 2, 2) : null, unit = next === "u" ? hexAt(body, index2 + 2, 4) : null;
  return byte !== null ? [String.fromCharCode(Number.parseInt(byte, 16)), 4] : unit !== null ? [String.fromCharCode(Number.parseInt(unit, 16)), 6] : STRING_ESCAPES[next] !== void 0 ? [STRING_ESCAPES[next], 2] : "\\'\"`/".includes(next) ? [next, 2] : next === `
` ? ["", 2] : language === "javascript" ? [next, 2] : [`\\${next}`, 2];
}, decodeLiteral = (text3, open, end, language) => {
  let body = text3.slice(open + 1, end);
  if (isRawLiteral(text3, open, language)) return body;
  let decoded = "";
  for (let index2 = 0; index2 < body.length; ) {
    if (body[index2] !== "\\") {
      decoded += body[index2], index2 += 1;
      continue;
    }
    let [chunk, width] = decodeEscape(body, index2, language);
    decoded += chunk, index2 += width;
  }
  return decoded;
}, isIdentifierChar = (char) => /[A-Za-z0-9_]/.test(char), skipSpace = (text3, from) => {
  let index2 = from;
  for (; index2 < text3.length && (text3[index2] === " " || text3[index2] === "	"); )
    index2 += 1;
  return index2;
}, readLiteral = (text3, open) => {
  let quote = text3[open], interpolated = !1;
  for (let index2 = open + 1; index2 < text3.length; index2 += 1) {
    let char = text3[index2];
    if (char === "\\") {
      index2 += 1;
      continue;
    }
    if ((char === "$" || char === "#") && text3[index2 + 1] === "{" && (interpolated = !0), char === quote) return { interpolated, end: index2 };
    if (char === `
`) return null;
  }
  return null;
}, skipLabel = (text3, at) => {
  let end = at;
  for (; end < text3.length && isIdentifierChar(text3[end]); ) end += 1;
  let colon = skipSpace(text3, end);
  return end === at || text3[colon] !== ":" || text3[colon + 1] === ":" ? at : skipSpace(text3, colon + 1);
}, openingQuote = (text3, at, language) => {
  if (QUOTES.has(text3[at])) return at;
  let open = at;
  for (; open - at < PREFIX_LIMIT && /[A-Za-z@#]/.test(text3[open] ?? ""); )
    open += 1;
  let prefix = text3.slice(at, open);
  return QUOTES.has(text3[open]) && (STATIC_PREFIXES[language]?.test(prefix) ?? !1) ? open : -1;
}, staticLiteralAt = (text3, start, language) => {
  let at = skipLabel(text3, skipSpace(text3, start)), open = openingQuote(text3, at, language);
  if (open === -1) return null;
  let hashes = text3.slice(at, open).split("#").length - 1;
  if (hashes > 0) {
    let close = text3.indexOf(`"${"#".repeat(hashes)}`, open + 1);
    return close === -1 ? null : { open, end: close, next: close + 1 + hashes };
  }
  let literal2 = readLiteral(text3, open);
  return literal2 === null || literal2.interpolated ? null : { open, end: literal2.end, next: literal2.end + 1 };
};

// src/hooks/regex/calls.ts
var REGEX_CALLS = [
  {
    name: "new RegExp",
    argumentIndex: 0,
    hasLiteralForm: !0,
    languages: ["javascript"]
  },
  {
    name: "RegExp",
    argumentIndex: 0,
    hasLiteralForm: !0,
    languages: ["javascript"]
  },
  {
    name: "RegExp",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["dart"]
  },
  {
    name: "re.compile",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["python"]
  },
  {
    name: "re.match",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["python"]
  },
  {
    name: "re.search",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["python"]
  },
  {
    name: "re.sub",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["python"]
  },
  {
    name: "re.findall",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["python"]
  },
  {
    name: "re.fullmatch",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["python"]
  },
  {
    name: "regex.compile",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["python"]
  },
  {
    name: "Pattern.compile",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["java", "kotlin", "scala"]
  },
  {
    name: "new Regex",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["csharp", "scala"]
  },
  {
    name: "Regex.Match",
    argumentIndex: 1,
    hasLiteralForm: !1,
    languages: ["csharp"]
  },
  {
    name: "Regex.Matches",
    argumentIndex: 1,
    hasLiteralForm: !1,
    languages: ["csharp"]
  },
  {
    name: "Regex.IsMatch",
    argumentIndex: 1,
    hasLiteralForm: !1,
    languages: ["csharp"]
  },
  {
    name: "Regex.Replace",
    argumentIndex: 1,
    hasLiteralForm: !1,
    languages: ["csharp"]
  },
  {
    name: "Regex",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["csharp", "kotlin", "julia"]
  },
  {
    name: "regexp.Compile",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["go"]
  },
  {
    name: "regexp.MustCompile",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["go"]
  },
  {
    name: "regexp.MatchString",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["go"]
  },
  {
    name: "Regexp.new",
    argumentIndex: 0,
    hasLiteralForm: !0,
    languages: ["ruby"]
  },
  {
    name: "Regexp.compile",
    argumentIndex: 0,
    hasLiteralForm: !0,
    languages: ["ruby"]
  },
  {
    name: "preg_match_all",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["php"]
  },
  {
    name: "preg_match",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["php"]
  },
  {
    name: "preg_replace",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["php"]
  },
  {
    name: "preg_split",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["php"]
  },
  {
    name: "Regex::new",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["rust"]
  },
  {
    name: "RegexBuilder::new",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["rust"]
  },
  {
    name: "std::regex",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["cpp"]
  },
  {
    name: "NSRegularExpression",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["swift", "objc"]
  },
  {
    name: "regularExpressionWithPattern",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["swift", "objc"],
    opener: "colon"
  },
  {
    name: "[regex]::Match",
    argumentIndex: 1,
    hasLiteralForm: !1,
    languages: ["powershell"]
  },
  {
    name: "[regex]::Matches",
    argumentIndex: 1,
    hasLiteralForm: !1,
    languages: ["powershell"]
  },
  {
    name: "[regex]::IsMatch",
    argumentIndex: 1,
    hasLiteralForm: !1,
    languages: ["powershell"]
  },
  {
    name: "[regex]::Replace",
    argumentIndex: 1,
    hasLiteralForm: !1,
    languages: ["powershell"]
  },
  {
    name: "Regex.compile",
    argumentIndex: 0,
    hasLiteralForm: !0,
    languages: ["elixir"]
  },
  { name: "grepl", argumentIndex: 0, hasLiteralForm: !1, languages: ["r"] },
  { name: "gsub", argumentIndex: 0, hasLiteralForm: !1, languages: ["r"] },
  {
    name: "regexpr",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["r"]
  },
  {
    name: "regexec",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["r"]
  },
  {
    name: "re-pattern",
    argumentIndex: 0,
    hasLiteralForm: !0,
    languages: ["clojure"],
    opener: "space"
  },
  {
    name: "Regex.new",
    argumentIndex: 0,
    hasLiteralForm: !0,
    languages: ["crystal"]
  },
  {
    name: "nre.re",
    argumentIndex: 0,
    hasLiteralForm: !0,
    languages: ["nim"]
  },
  {
    name: "regex.regex_opt",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["vlang"]
  },
  {
    name: "regex",
    argumentIndex: 0,
    hasLiteralForm: !1,
    languages: ["dlang"]
  },
  {
    name: "regcomp",
    argumentIndex: 1,
    hasLiteralForm: !1,
    languages: ["c", "cpp"]
  }
], callsOf = (language) => REGEX_CALLS.filter((call) => call.languages.includes(language)), skipDeclarator = (text3, from) => {
  let index2 = skipSpace(text3, from);
  for (; index2 < text3.length && isIdentifierChar(text3[index2]); ) index2 += 1;
  return skipSpace(text3, index2);
}, isWordBoundaryMatch = (text3, at, name) => {
  let before = text3[at - 1] ?? "";
  if (isIdentifierChar(name[0]) && isIdentifierChar(before)) return !1;
  let after = text3[at + name.length] ?? "";
  return !isIdentifierChar(after);
}, skipArguments = (text3, afterParen, count) => {
  let index2 = afterParen, depth = 0, skipped = 0;
  for (; index2 < text3.length && skipped < count; ) {
    let char = text3[index2];
    if (QUOTES.has(char)) {
      let literal2 = readLiteral(text3, index2);
      if (literal2 === null) return -1;
      index2 = literal2.end + 1;
      continue;
    }
    if ((char === "(" || char === "[" || char === "{") && (depth += 1), char === ")" || char === "]" || char === "}") {
      if (depth === 0) return -1;
      depth -= 1;
    }
    char === "," && depth === 0 && (skipped += 1), index2 += 1;
  }
  return skipped === count ? index2 : -1;
}, argumentStart = (text3, afterName, opener, argumentIndex) => {
  if (opener === "colon") {
    let colon = skipSpace(text3, afterName);
    return text3[colon] === ":" ? colon + 1 : -1;
  }
  if (opener === "space")
    return text3[afterName] === " " || text3[afterName] === "	" ? skipSpace(text3, afterName) : -1;
  let paren = skipDeclarator(text3, afterName);
  return text3[paren] === "(" ? skipArguments(text3, paren + 1, argumentIndex) : -1;
}, patternArgumentStarts = (text3, { name, argumentIndex, opener = "paren" }) => {
  let starts = [];
  for (let at = text3.indexOf(name); at !== -1; at = text3.indexOf(name, at + name.length)) {
    if (!isWordBoundaryMatch(text3, at, name)) continue;
    let start = argumentStart(text3, at + name.length, opener, argumentIndex);
    start !== -1 && starts.push(start);
  }
  return starts;
};

// src/hooks/regex/extract.ts
var METACHARACTERS = /[.*+?^${}()|[\]\\]/, REGEX_TOKENS = /\\[dwsbDWSB]|\[[^[\]]{1,200}\]|[*+?]|\{\d{1,9}(,\d{0,9})?\}|\|/, MIN_LENGTH = 3, JS_FLAGS = "dgimsuvy", SLASH_LITERAL_LANGUAGES = /* @__PURE__ */ new Set([
  "javascript",
  "ruby",
  "php",
  "elixir",
  "crystal",
  "perl"
]), JS_STRING_METHODS = [
  { name: ".match", argumentIndex: 0 },
  { name: ".matchAll", argumentIndex: 0 },
  { name: ".search", argumentIndex: 0 }
], JS_REGEX_OPENERS = /* @__PURE__ */ new Set([
  "(",
  ",",
  "=",
  ":",
  "!",
  "&",
  "|",
  "?",
  "{",
  ";",
  "[",
  ">",
  `
`
]), looksLikeRegex = (source) => source.length >= MIN_LENGTH && METACHARACTERS.test(source) && REGEX_TOKENS.test(source), opensJsRegex = (text3, slash) => {
  let index2 = slash - 1;
  for (; index2 >= 0 && (text3[index2] === " " || text3[index2] === "	"); )
    index2 -= 1;
  return index2 < 0 || JS_REGEX_OPENERS.has(text3[index2]);
}, slashLiteralEnd = (text3, open) => {
  for (let index2 = open + 1; index2 < text3.length; index2 += 1) {
    let char = text3[index2];
    if (char === "\\") {
      index2 += 1;
      continue;
    }
    if (char === "/") return index2;
    if (char === `
`) return -1;
  }
  return -1;
}, readFlags = (text3, from) => {
  let end = from;
  for (; end < text3.length && JS_FLAGS.includes(text3[end]); ) end += 1;
  return text3.slice(from, end);
}, skipComment = (text3, start) => {
  if (text3[start + 1] === "/") {
    let newline = text3.indexOf(`
`, start + 2);
    return newline === -1 ? text3.length : newline;
  }
  let close = text3.indexOf("*/", start + 2);
  return close === -1 ? text3.length : close + 1;
}, readingKey = ({ source, flags }) => `${flags}/${source}`, keep = (out, source, flags) => {
  looksLikeRegex(source) && out.set(readingKey({ source, flags }), { source, flags });
}, collectSlashLiterals = (text3, language, out) => {
  for (let index2 = 0; index2 < text3.length; index2 += 1) {
    if (text3[index2] !== "/") continue;
    let next = text3[index2 + 1];
    if (next === "/" || next === "*") {
      index2 = skipComment(text3, index2);
      continue;
    }
    if (language === "javascript" && !opensJsRegex(text3, index2)) continue;
    let end = slashLiteralEnd(text3, index2);
    if (end === -1) continue;
    let flags = language === "javascript" ? readFlags(text3, end + 1) : "";
    keep(out, text3.slice(index2 + 1, end), flags), index2 = end + flags.length;
  }
}, collectCallArguments = (text3, language, calls, out) => {
  for (let call of calls)
    for (let start of patternArgumentStarts(text3, call)) {
      let literal2 = staticLiteralAt(text3, start, language);
      literal2 !== null && keep(out, decodeLiteral(text3, literal2.open, literal2.end, language), "");
    }
}, collectQuotedFallback = (text3, language, out) => {
  for (let index2 = 0; index2 < text3.length; index2 += 1) {
    if (text3[index2] !== "'" && text3[index2] !== '"') continue;
    let literal2 = readLiteral(text3, index2);
    literal2 !== null && (literal2.interpolated || keep(out, decodeLiteral(text3, index2, literal2.end, language), ""), index2 = literal2.end);
  }
}, extractPatterns = (text3, language) => {
  let out = /* @__PURE__ */ new Map();
  return SLASH_LITERAL_LANGUAGES.has(language) && collectSlashLiterals(text3, language, out), collectCallArguments(text3, language, callsOf(language), out), language === "javascript" ? collectCallArguments(text3, language, JS_STRING_METHODS, out) : collectQuotedFallback(text3, language, out), [...out.values()];
}, extractSources = (text3, language) => [
  ...new Set(extractPatterns(text3, language).map(({ source }) => source))
];

// src/hooks/cors/url.ts
var GREEDY_BEFORE_HOST = /[a-z][a-z0-9?()|*+.-]{0,20}:\\?\/\\?\/[^/\n]{0,200}(?:\.\+|\.\*|\.\{\d{0,4},\})[^/\n]{0,200}\\\./i, validatesUrlWithGreedyWildcard = (source) => GREEDY_BEFORE_HOST.test(source);

// src/hooks/cors/scan.ts
var EMPTY2 = { findings: [], review: [], advisory: [] }, bypassable = (content3, language) => extractSources(content3, language).filter(validatesUrlWithGreedyWildcard).toSorted((left, right) => left.localeCompare(right)), analyze2 = (file, content3) => {
  let language = languageOf(file);
  return language === null ? EMPTY2 : { findings: [], review: bypassable(content3, language), advisory: [] };
};

// src/hooks/cors/cli.ts
var UNSAFE = /* @__PURE__ */ new Set(["wildcard", "null"]), OPTIONS2 = {
  origin: { type: "string", short: "o", multiple: !0 },
  dir: { type: "string", short: "d", multiple: !0 },
  file: { type: "string", short: "f", multiple: !0 }
}, HEADINGS2 = {
  sentinel: `no bypassable origin allowlist found
`,
  findings: "Bypassable origin allowlists found:",
  review: "Origin-allowlist patterns with a greedy wildcard (bypassable, review):"
}, scoreOrigins = (origins) => {
  let verdicts = origins.map((origin) => check(origin));
  return {
    output: verdicts.join(`
`) + `
`,
    hasFinding: verdicts.some((verdict) => UNSAFE.has(verdict))
  };
}, scanSources = async (targets) => {
  let root = cwd2(), paths = await resolveTargets(root, targets), report = await scanReport(root, paths, SOURCE_FILTER, analyze2);
  return { output: formatReport(report, HEADINGS2), hasFinding: !1 };
}, run2 = (args2) => {
  let { values } = parseNodeArgs2({ args: args2, options: OPTIONS2, strict: !0 }), origins = values.origin ?? [], targets = [...values.dir ?? [], ...values.file ?? []];
  if (origins.length > 0) {
    if (targets.length > 0)
      throw new Error(
        "-o scores an origin and cannot be combined with -d or -f"
      );
    return scoreOrigins(origins);
  }
  return scanSources(targets);
};

// src/hooks/crypto/cli.ts
import { cwd as cwd3 } from "node:process";
import { parseArgs as parseNodeArgs3 } from "node:util";

// src/hooks/crypto/patterns.ts
var rule = (regex, detail) => ({
  regex,
  detail
}), WEAK_CIPHER = {
  javascript: [
    rule(
      /\bcreate(?:Decipher|Cipher)\s{0,16}\(/i,
      "createCipher/createDecipher: deprecated and IV-less, use createCipheriv"
    ),
    rule(
      /[\'"`](?:des-ede3?(?:-cbc)?|des-(?:cbc|cfb|ofb)|des3|3des|rc4(?:-[a-z0-9-]{1,20})?|bf-(?:cbc|ecb|cfb|ofb))[\'"`]/i,
      "weak cipher algorithm (DES / 3DES / RC4 / Blowfish): use AES-GCM"
    ),
    rule(
      /[\'"`](?:aes(?:-\d{2,3})?|des(?:-ede3?)?|bf|rc2|camellia|seed)-ecb[\'"`]/i,
      "ECB cipher mode: leaks plaintext structure, use GCM or CBC"
    ),
    rule(
      /\bCryptoJS\.(?:DES|TripleDES|RC4|RC4Drop)\b/i,
      "weak CryptoJS cipher (DES / 3DES / RC4): use AES"
    )
  ],
  python: [
    rule(
      /\b(?:DES3|DES|ARC4|ARC2|Blowfish)\.new\s{0,16}\(/i,
      "weak cipher primitive (DES / 3DES / RC4 / RC2 / Blowfish) constructed via pycryptodome .new(): use Crypto.Cipher.AES with MODE_GCM"
    ),
    rule(
      /from\s{1,8}Crypto\.Cipher\s{1,8}import\s{0,16}[^#\n]{0,120}\b(?:DES3|DES|ARC4|ARC2|Blowfish)\b/i,
      "importing a broken cipher (DES / 3DES / RC4 / RC2 / Blowfish) from Crypto.Cipher: use AES-GCM (from Crypto.Cipher import AES)"
    ),
    rule(
      /\balgorithms\.(?:TripleDES|Blowfish|ARC4)\b/i,
      "weak cipher algorithm (3DES / Blowfish / RC4) in cryptography hazmat: use algorithms.AES with modes.GCM"
    ),
    rule(
      /\bMODE_ECB\b|\bmodes\.ECB\s{0,16}\(/i,
      "ECB cipher mode: identical plaintext blocks leak as identical ciphertext, use an authenticated mode (GCM)"
    )
  ],
  go: [
    rule(
      /\bdes\.New(?:TripleDESCipher|Cipher)\s{0,16}\(/i,
      "DES / 3DES cipher (des.NewCipher / des.NewTripleDESCipher): 56/64-bit blocks, broken (Sweet32), use AES-GCM via aes.NewCipher + cipher.NewGCM"
    ),
    rule(
      /\brc4\.NewCipher\s{0,16}\(/i,
      "RC4 stream cipher (rc4.NewCipher): keystream biases fully break it, use AES-GCM or ChaCha20-Poly1305"
    ),
    rule(
      /\bblowfish\.New(?:Salted)?Cipher\s{0,16}\(/i,
      "Blowfish cipher (blowfish.NewCipher / NewSaltedCipher): 64-bit block (Sweet32), use AES-GCM"
    ),
    rule(
      /\bNewECB(?:En|De)crypter\s{0,16}\(/i,
      "ECB cipher mode (NewECBEncrypter / NewECBDecrypter): identical plaintext blocks leak as identical ciphertext, use an authenticated mode via cipher.NewGCM"
    )
  ],
  java: [
    rule(
      /["'](?:DESede|TripleDES|3DES|DES|ARCFOUR|ARC4|RC4|Blowfish|RC2)(?:\/[A-Za-z0-9]{1,20}){0,3}["']/i,
      "broken symmetric cipher (DES / 3DES / RC4 / Blowfish / RC2) named at a crypto call site: use AES/GCM"
    ),
    rule(
      /["'](?:AES|DESede|DES|Blowfish|Camellia|SEED|ARIA|RC2|TripleDES)\/ECB\b/i,
      "ECB cipher mode: identical plaintext blocks leak as identical ciphertext, use AES/GCM (or AES/CBC with an authenticated tag)"
    )
  ],
  kotlin: [
    rule(
      /["'](?:(?:DESede|TripleDES|3DES|RC4|ARCFOUR|ARC4|Blowfish)(?:\/[A-Za-z0-9]{2,16}){0,3}|(?:DES|RC2)\/[A-Za-z0-9]{2,16}(?:\/[A-Za-z0-9]{2,16}){0,2})["']/i,
      "broken symmetric cipher named at a JCE call site (DES / 3DES-DESede / RC4-ARCFOUR / RC2 / Blowfish): use AES-GCM"
    ),
    rule(
      /["'](?:AES|DESede|TripleDES|3DES|DES|Blowfish|RC2|RC5|RC6|Camellia|SEED|ARIA|IDEA|CAST5|Twofish)\/ECB\b/i,
      "ECB cipher mode leaks plaintext structure regardless of the underlying block cipher: use AES-GCM (or CBC with a random IV)"
    )
  ],
  php: [
    rule(
      /['"](?:des(?:-ede3?|3)(?:-(?:cbc|ecb|cfb\d{0,2}|ofb))?|des-(?:cbc|ecb|cfb\d{0,2}|ofb)|3des|rc4(?:-\d{1,3})?|rc2(?:-\d{1,3})?-(?:cbc|ecb|cfb|ofb)|bf-(?:cbc|ecb|cfb|ofb))['"]/i,
      "broken symmetric cipher at openssl_encrypt/decrypt (DES/3DES/RC4/RC2/Blowfish): use AES-256-GCM"
    ),
    rule(
      /['"](?:aes(?:-\d{2,3})?|des(?:-ede3?)?|bf|rc2|camellia(?:-\d{2,3})?|seed|aria(?:-\d{2,3})?|sm4)-ecb['"]/i,
      "ECB cipher mode: leaks plaintext structure regardless of the block cipher, use an authenticated mode such as AES-256-GCM"
    ),
    rule(
      /\bMCRYPT_(?:DES|3DES|TRIPLEDES|ARCFOUR|RC4|RC2|BLOWFISH(?:_COMPAT)?|MODE_ECB)\b/i,
      "broken cipher or ECB mode via the removed mcrypt extension (DES/3DES/RC4/RC2/Blowfish/ECB): migrate to openssl_encrypt with AES-256-GCM"
    )
  ],
  ruby: [
    rule(
      /['"](?:des-(?:ede3?(?:-(?:cbc|ecb|cfb|ofb))?|cbc|ecb|cfb|ofb)|3des|des3|tripledes|rc4|arc4|bf-(?:cbc|ecb|cfb|ofb)|rc2-(?:cbc|ecb|cfb|ofb))['"]/i,
      "broken symmetric cipher named at OpenSSL::Cipher.new (DES / 3DES / RC4 / Blowfish / RC2): use AES-256-GCM"
    ),
    rule(
      /['"](?:aes(?:-\d{2,3})?|des(?:-ede3?)?|bf|rc2|camellia|seed|aria)-ecb['"]/i,
      "ECB cipher mode leaks plaintext block structure: use an authenticated mode such as AES-256-GCM"
    ),
    rule(
      /OpenSSL::Cipher::(?:TripleDES|DES3|DES|RC4|ARC4|Blowfish|BF|RC2)\b/i,
      "broken symmetric cipher class (DES / 3DES / RC4 / Blowfish / RC2): use OpenSSL::Cipher::AES with GCM"
    ),
    rule(
      /OpenSSL::Cipher::[A-Za-z0-9]{2,10}\.new\s{0,16}\([^)]{0,40}:ECB\b/i,
      "ECB cipher mode (:ECB) leaks plaintext block structure: use :GCM"
    )
  ],
  rust: [
    rule(
      /\bRc4::|\brc4::(?:Rc4|Cipher)\b/i,
      "RC4 stream cipher (rc4 crate): keystream biases fully break it, use ChaCha20-Poly1305 or AES-GCM"
    ),
    rule(
      /\bBlowfish(?:LE)?::|\bblowfish::(?:Blowfish|BlowfishLE)\b/i,
      "Blowfish cipher (blowfish crate): 64-bit block (Sweet32), use AES-GCM"
    ),
    rule(
      /\bTdesEde3::|\bTdesEee3::|\bdes::(?:Des|TdesEde3|TdesEee3)\b/i,
      "DES/3DES cipher (des crate): broken (Sweet32), use AES-GCM"
    ),
    rule(
      /\bRc2::|\brc2::Rc2\b/i,
      "RC2 cipher (rc2 crate): broken, use AES-GCM"
    ),
    rule(
      /\becb::(?:Encryptor|Decryptor|\{)/i,
      "ECB block mode (ecb crate): leaks plaintext structure, use AES-GCM"
    )
  ],
  csharp: [
    rule(
      /\b(?:TripleDES|DES|RC2)(?:\.Create\s{0,16}\(|CryptoServiceProvider\b)/i,
      "DES/TripleDES/RC2 is a broken or deprecated symmetric cipher: use AES-GCM (Aes.Create with AesGcm)"
    ),
    rule(
      /\.(?:Create|CreateFromName)\s{0,16}\(\s{0,16}["'](?:TripleDES|3DES|DESede|DES|RC2|RC4|ARC4|Blowfish)["']/i,
      "weak cipher named to a factory (DES/3DES/RC2/RC4/Blowfish): use AES-GCM"
    ),
    rule(
      /=\s{0,8}CipherMode\.ECB\b/i,
      "ECB cipher mode leaks plaintext structure: use an authenticated mode (AesGcm) or CBC with a MAC"
    ),
    rule(
      /\bnew\s{1,16}(?:RC4|ARC4|Blowfish|DesEde|Des|RC2)Engine\s{0,16}\(/i,
      "weak BouncyCastle cipher engine (RC4/Blowfish/DES/RC2): use AES-GCM"
    ),
    rule(
      /["'](?:AES|DESede|TripleDES|DES|RC2|RC4|Blowfish|Camellia|SEED)\/ECB\/[A-Za-z0-9]{2,16}["']/i,
      "ECB in a cipher transformation string: use an authenticated mode (GCM)"
    )
  ],
  c: [
    rule(
      /\b(?:DES_[a-z0-9_]{0,30}(?:encrypt|decrypt|crypt|key(?:s)?|cksum|parity)|RC4(?:_[A-Za-z0-9_]{1,30})?|(?:RC2|BF)_(?:set_key|ecb_encrypt|cbc_encrypt|cfb64_encrypt|ofb64_encrypt|encrypt|decrypt|options))\s{0,16}\(/i,
      "low-level OpenSSL weak cipher (DES/3DES/RC4/Blowfish/RC2): use EVP_aes_256_gcm"
    ),
    rule(
      /\bEVP_(?:des|rc2|rc4|bf)[a-z0-9_]{0,30}\s{0,16}\(/i,
      "weak OpenSSL EVP cipher (DES/3DES/RC4/RC2/Blowfish): use EVP_aes_256_gcm"
    ),
    rule(
      /\b(?:EVP_[a-z0-9_]{2,20}_ecb|[A-Za-z0-9]{2,12}_ecb_encrypt)\s{0,16}\(/i,
      "ECB cipher mode: identical plaintext blocks leak as identical ciphertext, use an authenticated mode like EVP_aes_256_gcm"
    )
  ],
  cpp: [
    rule(
      /\bEVP_(?:des(?:x)?|rc4|bf|rc2)(?:_[a-z0-9]{1,10}){0,4}\s{0,16}\(/i,
      "weak OpenSSL EVP cipher (DES / 3DES / RC4 / Blowfish / RC2): use EVP_aes_256_gcm"
    ),
    rule(
      /\b(?:RC4\s{0,16}\(|(?:DES|RC2|BF|RC4)_[a-z0-9_]{0,24}(?:crypt|key)\s{0,16}\()/i,
      "low-level OpenSSL weak cipher (DES / RC4 / Blowfish / RC2): use the EVP AES-GCM interface"
    ),
    rule(
      /\b(?:(?:CryptoPP|Weak)::){1,2}(?:DES(?:_EDE[23]|_XEX3)?|TripleDES|Blowfish|ARC4|RC2)\b|\b(?:DES(?:_EDE[23]|_XEX3)?|TripleDES|Blowfish|ARC4|RC2)::(?:Encryption|Decryption)\b/i,
      "weak Crypto++ cipher (DES / 3DES / ARC4 / Blowfish / RC2): use CryptoPP::AES with an AEAD mode"
    ),
    rule(
      /\bEVP_[a-z0-9_]{1,20}_ecb\s{0,16}\(|\bECB_Mode\s{0,16}</i,
      "ECB cipher mode: leaks plaintext structure, use GCM or CBC"
    )
  ]
}, WEAK_DIGEST = {
  javascript: [
    rule(
      /createHash\s{0,16}\(\s{0,16}[\'"`]md5[\'"`]/i,
      "MD5 digest (createHash): broken for security use (signature/token/password), fine only as a non-security checksum"
    ),
    rule(
      /createHash\s{0,16}\(\s{0,16}[\'"`]sha-?1[\'"`]/i,
      "SHA-1 digest (createHash): broken for security use (signature/token/password), fine only as a non-security checksum"
    ),
    rule(
      /\bcreateHmac\s{0,16}\(\s{0,16}[\'"`](?:md5|sha-?1)[\'"`]/i,
      "HMAC over a broken digest (MD5/SHA-1): use SHA-256 or better"
    ),
    rule(
      /\bcrypto\.hash\s{0,16}\(\s{0,16}[\'"`](?:md5|sha-?1)[\'"`]/i,
      "one-shot MD5/SHA-1 digest (crypto.hash): broken for security use"
    ),
    rule(
      /\b(?:crypto\.)?subtle\.digest\s{0,16}\(\s{0,16}[\'"`]SHA-1[\'"`]/i,
      "WebCrypto SHA-1 digest (subtle.digest): broken for security use (SubtleCrypto has no MD5)"
    ),
    rule(
      /\bCryptoJS\.(?:MD5|SHA1)\b/i,
      "weak CryptoJS digest (MD5 / SHA1): broken for security use"
    )
  ],
  python: [
    rule(
      /\bhashlib\.(?:md5|sha1)\s{0,16}\(/i,
      "MD5/SHA-1 digest (hashlib): broken for security use (signature/token/password), fine only as a non-security checksum, otherwise use hashlib.sha256"
    ),
    rule(
      /\bhashlib\.new\s{0,16}\(\s{0,16}['"](?:md5|sha-?1)['"]/i,
      "MD5/SHA-1 digest (hashlib.new): broken for security use, fine only as a non-security checksum, otherwise use hashlib.new('sha256')"
    ),
    rule(
      /\bhmac\.new\s{0,16}\([^)]{0,200}(?:hashlib\.(?:md5|sha1)\b|digestmod\s{0,8}=\s{0,8}['"]?(?:md5|sha-?1)\b|['"](?:md5|sha-?1)['"])/i,
      "HMAC over a broken digest (MD5/SHA-1): use hmac.new(..., digestmod=hashlib.sha256) or stronger"
    ),
    rule(
      /from\s{1,8}Crypto\.Hash\s{1,8}import\s{0,16}[^#\n]{0,120}\b(?:MD5|SHA1)\b|\b(?:MD5|SHA1)\.new\s{0,16}\(/i,
      "MD5/SHA-1 digest via pycryptodome (Crypto.Hash): broken for security use, use SHA-256 or stronger"
    ),
    rule(
      /\bhashes\.(?:MD5|SHA1)\s{0,16}\(/i,
      "MD5/SHA-1 in cryptography hazmat (hashes.MD5 / hashes.SHA1): broken for security use, use hashes.SHA256"
    )
  ],
  go: [
    rule(
      /\bmd5\.(?:New|Sum)\s{0,16}\(/i,
      "MD5 digest (md5.New / md5.Sum): broken for security use (signature/token/password), fine only as a non-security checksum, use sha256.New / sha256.Sum256"
    ),
    rule(
      /\bsha1\.(?:New|Sum)\s{0,16}\(/i,
      "SHA-1 digest (sha1.New / sha1.Sum): broken where collision or preimage resistance matters, fine only as a non-security checksum, use sha256.New / sha256.Sum256"
    ),
    rule(
      /\bhmac\.New\s{0,16}\(\s{0,16}(?:md5|sha1)\.New\b/i,
      "HMAC over a broken digest (hmac.New with md5.New / sha1.New): use hmac.New with sha256.New"
    ),
    rule(
      /\bcrypto\.(?:MD5|SHA1)\b/i,
      "MD5 / SHA-1 hash identifier (crypto.MD5 / crypto.SHA1), typically feeding a signature: broken for security use, use crypto.SHA256"
    )
  ],
  java: [
    rule(
      /["'](?:MD5|MD4|MD2|SHA-?1)["']/i,
      "MD5/SHA-1 digest algorithm string: broken for security use (signature/token/password), fine only as a non-security checksum, use SHA-256 or better"
    ),
    rule(
      /["']Hmac(?:MD5|SHA-?1)["']/i,
      "HMAC over a broken digest (HmacMD5 / HmacSHA1): use HmacSHA256 or better"
    ),
    rule(
      /\bDigestUtils\.(?:md5|md4|md2|sha1)(?:Hex)?\s{0,16}\(/i,
      "Apache Commons DigestUtils MD5/SHA-1: broken for security use, use DigestUtils.sha256Hex or better"
    ),
    rule(
      /\bHashing\.(?:md5|sha1)\s{0,16}\(/i,
      "Guava Hashing.md5/sha1: broken for security use, use Hashing.sha256 or an HMAC"
    )
  ],
  kotlin: [
    rule(
      /\.getInstance\s{0,16}\(\s{0,16}["'](?:MD5|SHA-?1)["']/i,
      "MD5 / SHA-1 message digest (MessageDigest.getInstance): broken for security use (signature/token/password), fine only as a non-security checksum, otherwise use SHA-256 or better"
    ),
    rule(
      /["']Hmac(?:MD5|SHA-?1)["']/i,
      "HMAC over a broken digest (HmacMD5 / HmacSHA1): use HmacSHA256 or better"
    ),
    rule(
      /["'](?:MD5|SHA-?1)with[A-Za-z0-9]{2,12}["']/i,
      "signature over a broken digest (MD5withRSA / SHA1withRSA / SHA1withECDSA): use SHA256withRSA/ECDSA or better"
    )
  ],
  php: [
    rule(
      /\b(?:md5|sha1)(?:_file)?\s{0,16}\(/i,
      "MD5/SHA-1 digest (md5()/sha1()): broken for any security use (signature/token/password), fine only as a non-security checksum, otherwise use hash('sha256', ...) or password_hash()."
    ),
    rule(
      /\bhash(?:_hmac|_file|_pbkdf2)?\s{0,16}\(\s{0,16}['"](?:md5|sha1)['"]/i,
      "MD5/SHA-1 selected as the algorithm in hash()/hash_hmac()/hash_pbkdf2(): broken for security use, pass 'sha256' or stronger."
    )
  ],
  ruby: [
    rule(
      /\bDigest::(?:MD5|SHA1)\b/i,
      "MD5/SHA-1 digest (Digest::MD5 / Digest::SHA1, incl. OpenSSL::Digest::): broken where collision or preimage resistance matters, fine only as a non-security checksum, use SHA-256 or better"
    ),
    rule(
      /OpenSSL::Digest(?:\.new)?\s{0,16}\(\s{0,16}['"](?:md5|sha-?1)['"]/i,
      "MD5/SHA-1 digest named at OpenSSL::Digest.new: broken for security use, fine only as a non-security checksum, use SHA-256 or better"
    ),
    rule(
      /OpenSSL::HMAC\.(?:new|digest|hexdigest|base64digest)\s{0,16}\([^)]{0,80}['"](?:md5|sha-?1)['"]/i,
      "HMAC over a broken digest (MD5/SHA-1) at OpenSSL::HMAC: use SHA-256 or better"
    )
  ],
  rust: [
    rule(
      /\bMd5::\w|\bmd5::compute\b|\buse\s{1,8}md5\b/i,
      "MD5 digest (md5 crate): broken for security use (signature/token/password), fine only as a non-security checksum"
    ),
    rule(
      /\bSha1::\w|\buse\s{1,8}sha1\b/i,
      "SHA-1 digest (sha1 crate): broken for security use (signature/token/password), fine only as a non-security checksum"
    ),
    rule(
      /\bHmac\s{0,8}(?:::)?\s{0,8}<\s{0,8}(?:Md5|Sha1)\b/i,
      "HMAC over a broken digest (Hmac<Md5>/Hmac<Sha1>): use Hmac<Sha256> or better"
    )
  ],
  csharp: [
    rule(
      /\b(?:MD5|SHA1)\.(?:Create|HashData|HashDataAsync|TryHashData)\s{0,16}\(/i,
      "MD5/SHA-1 digest: broken for security use (signature/token/password), fine only as a non-security checksum, otherwise use SHA-256 or better"
    ),
    rule(
      /\b(?:MD5|SHA1)(?:CryptoServiceProvider|Managed|Cng)\b/i,
      "MD5/SHA-1 provider (CryptoServiceProvider/Managed/Cng): broken for security use, use SHA-256 or better"
    ),
    rule(
      /\bHMAC(?:MD5|SHA1)\b/i,
      "HMAC over a broken digest (MD5/SHA-1): use HMACSHA256 or better"
    ),
    rule(
      /\.(?:Create|CreateFromName)\s{0,16}\(\s{0,16}["'](?:MD5|SHA-?1|HMACMD5|HMACSHA1)["']/i,
      "MD5/SHA-1 named to a hash factory: broken for security use, use SHA-256 or better"
    )
  ],
  c: [
    rule(
      /\bMD5(?:_(?:Init|Update|Final))?\s{0,16}\(/i,
      "MD5 digest (OpenSSL MD5/MD5_Init): broken where collision or preimage resistance matters (signature/token/password), fine only as a non-security checksum, else use SHA-256"
    ),
    rule(
      /\bSHA1(?:_(?:Init|Update|Final))?\s{0,16}\(/i,
      "SHA-1 digest (OpenSSL SHA1/SHA1_Init): broken where collision or preimage resistance matters (signature/token/password), fine only as a non-security checksum, else use SHA-256"
    ),
    rule(
      /\bEVP_(?:md5|sha1)\s{0,16}\(/i,
      "EVP MD5/SHA-1 digest (EVP_md5/EVP_sha1, including when passed to HMAC): broken for security use, use EVP_sha256"
    )
  ],
  cpp: [
    rule(
      /\bEVP_(?:md5|sha1)\s{0,16}\(/i,
      "MD5/SHA-1 digest (OpenSSL EVP): broken for security use (signature/token/password), fine only as a non-security checksum, use EVP_sha256"
    ),
    rule(
      /\b(?:MD5|SHA1)(?:_(?:Init|Update|Final))?\s{0,16}\(/i,
      "low-level MD5/SHA-1 digest (OpenSSL): broken for security use, fine only as a non-security checksum, use SHA-256 or better"
    ),
    rule(
      /\b(?:(?:CryptoPP|Weak)::){1,2}(?:MD5|SHA1)\b/i,
      "weak Crypto++ digest (MD5 / SHA1): broken for security use, fine only as a non-security checksum, use CryptoPP::SHA256"
    )
  ]
}, TIMING = {
  javascript: [
    rule(
      /(?:===?)\s{0,16}[^=]{0,40}\b(?:hmac|digest|mac|tag)\b|\b(?:hmac|digest|mac|tag)\b[^=]{0,40}(?:===?)/i,
      "timing-unsafe comparison of an hmac/digest/mac/tag: use crypto.timingSafeEqual"
    )
  ],
  python: [
    rule(
      /(?:[=!]=)\s{0,16}[^=]{0,40}\b(?:hmac|hexdigest|digest)\b|\b(?:hmac|hexdigest|digest)\b[^=]{0,40}(?:[=!]=)/i,
      "timing-unsafe comparison of a MAC/HMAC/digest: use hmac.compare_digest (or secrets.compare_digest)"
    )
  ],
  go: [
    rule(
      /\bbytes\.Equal\s{0,16}\([^)]{0,120}(?:hmac|mac|digest|signature)/i,
      "timing-unsafe comparison of a MAC/digest/signature (bytes.Equal returns early on the first differing byte): use hmac.Equal or subtle.ConstantTimeCompare"
    ),
    rule(
      /\w{0,24}(?:hmac|mac|digest)\s{0,16}[!=]=|[!=]=\s{0,16}\w{0,24}(?:hmac|mac|digest)\b/i,
      "timing-unsafe equality of a MAC/digest (== / !=): use hmac.Equal or subtle.ConstantTimeCompare"
    )
  ],
  java: [
    rule(
      /\b(?:hmac|digest)\w{0,20}\s{0,4}\.equals\s{0,16}\(|\.equals\s{0,16}\([^)]{0,80}\b(?:hmac|digest)\b/i,
      "non-constant-time comparison of an HMAC/digest (String.equals / Arrays.equals) leaks via timing: use MessageDigest.isEqual"
    )
  ],
  kotlin: [
    rule(
      /(?:==|!=)\s{0,16}[^=;{}]{0,40}\b(?:hmac|digest|mac)\b|\b(?:hmac|digest|mac)\b\s{0,16}[^=;{}]{0,40}(?:==|!=)/i,
      "timing-unsafe equality (== / !=) of a mac/hmac/digest: use MessageDigest.isEqual for a constant-time compare"
    ),
    rule(
      /\b(?:hmac|digest|mac)\b\s{0,16}\.\s{0,16}(?:contentEquals|equals)\s{0,16}\(|\b(?:contentEquals|equals|Arrays\.equals)\s{0,16}\([^)]{0,80}\b(?:hmac|digest|mac)\b/i,
      "timing-unsafe byte comparison (equals / contentEquals / Arrays.equals) of a mac/hmac/digest: use MessageDigest.isEqual"
    )
  ],
  php: [
    rule(
      /(?:===?)\s{0,16}\$?(?:hmac|digest)\b|\b(?:hmac|digest)\b\s{0,16}={2,3}(?!=)(?!\s{0,16}(?:true|false|null)\b)/i,
      "timing-unsafe ==/=== comparison of an hmac/digest: use hash_equals()"
    )
  ],
  ruby: [
    rule(
      /(?:==|!=)\s{0,16}[^=\n]{0,40}(?:hmac|digest)\b|(?:hmac|digest)\b[^=\n]{0,40}(?:==|!=)/i,
      "timing-unsafe == / != comparison of an hmac/digest: use Rack::Utils.secure_compare or OpenSSL.fixed_length_secure_compare"
    )
  ],
  rust: [
    rule(
      /[!=]=\s{0,16}[^=&|;{}]{0,40}\b(?:hmac|digest|mac|tag)\b|\b(?:hmac|digest|mac|tag)\b[^=&|;{}]{0,40}[!=]=/i,
      "timing-unsafe == comparison of an hmac/digest/mac/tag, use subtle ct_eq (ConstantTimeEq) or Mac::verify_slice"
    )
  ],
  csharp: [
    rule(
      /(?:==|!=)\s{0,16}[^=;]{0,40}\b(?:hmac|digest|mac|tag)\b|\b(?:hmac|digest|mac|tag)\b[^=!;]{0,40}(?:==|!=)/i,
      "timing-unsafe ==/!= comparison of an hmac/digest/mac/tag: use CryptographicOperations.FixedTimeEquals"
    ),
    rule(
      /\b(?:hmac|digest|mac|tag)\b[^;=]{0,40}\.SequenceEqual\s{0,16}\(|\.SequenceEqual\s{0,16}\(\s{0,16}[^)]{0,60}\b(?:hmac|digest|mac|tag)\b/i,
      "timing-unsafe SequenceEqual of an hmac/digest/mac/tag (short-circuits): use CryptographicOperations.FixedTimeEquals"
    )
  ],
  c: [
    rule(
      /\b(?:memcmp|bcmp|strncmp|strcmp)\s{0,16}\([^;{]{0,160}(?:hmac|mac|digest|signature|tag)[^A-Za-z0-9]/i,
      "variable-time comparison (memcmp/strcmp) of a MAC/HMAC/digest/tag leaks the secret through timing, use a constant-time compare like CRYPTO_memcmp"
    )
  ],
  cpp: [
    rule(
      /\b(?:std::)?memcmp\s{0,16}\([^;{}]{0,160}\b(?:hmac|digest|mac|tag)\b/i,
      "timing-unsafe memcmp of a MAC/HMAC/digest/tag: use OpenSSL CRYPTO_memcmp or Crypto++ VerifyBufsEqual"
    ),
    rule(
      /\b(?:hmac|digest)\b[^;=<>().]{0,40}[=!]=|[=!]=[^;=<>().]{0,40}\b(?:hmac|digest)\b/i,
      "timing-unsafe equality of an hmac/digest: use OpenSSL CRYPTO_memcmp or Crypto++ VerifyBufsEqual"
    )
  ]
}, INSECURE_PRNG = {
  javascript: /\bMath\.random\s{0,16}\(/i,
  python: /\brandom\.(?:random|randint|randrange|randbytes|getrandbits|choice|choices|sample|shuffle|uniform)\s{0,16}\(/i,
  go: /\brand\.(?:Intn|IntN|Int31n?|Int63n?|Int32|Int64|Uint32|Uint64|Float32|Float64|ExpFloat64|NormFloat64|Perm|Shuffle|Seed|NewSource|New)\s{0,16}\(/i,
  java: /\bMath\.random\s{0,16}\(|\bThreadLocalRandom\b|\bnew\s{1,8}(?:java\.util\.)?Random\s{0,16}\(/i,
  kotlin: /(?:\bMath\.random\s{0,16}\(|\bThreadLocalRandom\b|\bjava\.util\.Random\b|\bRandom\s{0,16}\(|\bRandom\.(?:next[A-Za-z]{1,16}|Default)\b)/i,
  php: /\b(?:mt_rand|rand|lcg_value|uniqid)\s{0,16}\(/i,
  ruby: /\brand\s{0,16}\(|\bRandom\.(?:new|rand)\b/i,
  rust: /\b(?:SmallRng|XorShiftRng)\b/i,
  csharp: /\bnew\s{1,16}(?:System\.)?Random\s{0,16}\(|\bRandom\.Shared\b/i,
  c: /\b(?:rand|random)\s{0,16}\(\s{0,16}\)/i,
  cpp: /\b(?:std::)?(?:rand|random)\s{0,16}\(\s{0,16}\)|\b(?:std::)?(?:mt19937(?:_64)?|minstd_rand0?|default_random_engine|ranlux(?:24|48)(?:_base)?|knuth_b)\b/i
}, CRYPTO_MARKER = {
  javascript: /\bcreate(?:Hash|Hmac|Cipher(?:iv)?|Decipher(?:iv)?|Sign|Verify)\b|\bMath\.random\s{0,16}\(|\brandom(?:Bytes|UUID|Int|Fill)\b|\bpbkdf2\b|\bscrypt\b|\bcrypto\.\w|\bCryptoJS\.\w|[\'"`](?:md5|sha-?1|des|rc4|blowfish|aes-\d)/i,
  python: /\bhashlib\.\w|\bhmac\.\w|\bsecrets\.\w|\bos\.urandom\b|\bCrypto\.\w|\b(?:AES|DES3?|ARC4|ChaCha20|Blowfish)\.new\b|\bcryptography\b|\bhazmat\b|\balgorithms\.\w|\bhashes\.\w|\bmodes\.\w|\bFernet\b|\brandom\.\w|\b(?:PBKDF2HMAC|PBKDF2|scrypt|Scrypt|bcrypt|argon2)\b|['"](?:md5|sha-?1|sha256|des|rc4|blowfish|aes)['"]/i,
  go: /\b(?:aes|des|rc4|blowfish|md5|sha1|sha256|sha512|sha3|hmac|cipher|rand|bcrypt|scrypt|pbkdf2|argon2|ed25519|ecdsa|ecdh|rsa|dsa|x509|subtle|chacha20|poly1305|nacl|salsa20)\.[A-Za-z]|\bcrypto\.[A-Za-z]|crypto\/(?:rand|aes|des|rc4|md5|sha1|sha256|sha512|cipher|hmac|tls|x509|subtle|ecdsa|ed25519|rsa)/i,
  java: /\b(?:Cipher|MessageDigest|Mac|Signature|KeyGenerator|KeyPairGenerator|KeyAgreement|KeyFactory|SecretKeyFactory)\s{0,16}\.\s{0,16}getInstance\b|\b(?:SecretKeySpec|IvParameterSpec|GCMParameterSpec|PBEKeySpec|SecureRandom|KeyStore|SSLContext|TrustManagerFactory|MessageDigest|Cipher)\b|\bjavax\.crypto\b|\bjava\.security\b|\bDigestUtils\.\w|\bHashing\.\w|\bMath\.random\s{0,16}\(|\bThreadLocalRandom\b|\bnew\s{1,8}(?:java\.util\.)?Random\s{0,16}\(/i,
  kotlin: /\b(?:javax\.crypto|java\.security|SecureRandom|MessageDigest|SecretKeySpec|IvParameterSpec|GCMParameterSpec|KeyGenerator|KeyPairGenerator|SecretKeyFactory|KeyAgreement|Signature\.getInstance|Mac\.getInstance|Cipher\.getInstance|Cipher\.ENCRYPT_MODE)\b/i,
  php: /\b(?:openssl_[a-z_]{2,40}\s{0,16}\(|mcrypt_[a-z_]{2,40}\s{0,16}\(|MCRYPT_[A-Z0-9_]{1,40}|hash(?:_hmac|_equals|_pbkdf2|_file)?\s{0,16}\(|md5\s{0,16}\(|sha1\s{0,16}\(|crypt\s{0,16}\(|password_(?:hash|verify)\s{0,16}\(|random_bytes\s{0,16}\(|random_int\s{0,16}\(|mt_rand\s{0,16}\(|lcg_value\s{0,16}\(|uniqid\s{0,16}\(|rand\s{0,16}\(|sodium_[a-z_]{2,40}\s{0,16}\()/i,
  ruby: /\b(?:OpenSSL|SecureRandom|HMAC|Digest|Cipher|hexdigest|secure_compare|Random)\b|\brand\s{0,16}\(/i,
  rust: /\b(?:Aes\d{2,3}\w{0,8}|ChaCha20\w{0,12}|XChaCha20\w{0,12}|chacha20poly1305|Salsa20|Sha(?:1|224|256|384|512|3)|Md[245]|Blake2\w{0,3}|Blake3|Hmac|SimpleHmac|Pbkdf2|Scrypt|Argon2\w{0,3}|Bcrypt|OsRng|thread_rng|SmallRng|XorShiftRng|StdRng|ChaCha\w{0,8}Rng|Rc4|Blowfish\w{0,2}|Rc2|Tdes\w{0,6}|RsaPrivateKey|RsaPublicKey|SigningKey|VerifyingKey|ct_eq|verify_slice)\b|\b(?:rand|rand_chacha|sha1|sha2|sha3|md5|hmac|des|rc4|rc2|ecb|cbc|ctr|ofb|cfb|gcm|blowfish|subtle|aead|aes|aes_gcm|ed25519\w{0,10}|p256|k256|x25519|argon2|pbkdf2|scrypt|ring|digest)::/i,
  csharp: /\bSystem\.Security\.Cryptography\b|\b(?:Aes|AesGcm|TripleDES|DES|RC2|RSA|ECDsa|ECDiffieHellman)\b|\b(?:MD5|SHA1|SHA256|SHA384|SHA512)\b|\bHMAC(?:MD5|SHA1|SHA256|SHA384|SHA512)\b|\bRandomNumberGenerator\b|\bCipherMode\.\w|\bCryptographicOperations\b|\bRfc2898DeriveBytes\b|\bProtectedData\b|\bCryptoServiceProvider\b|\bnew\s{1,16}(?:System\.)?Random\s{0,16}\(/i,
  c: /\b(?:EVP_[A-Za-z0-9_]{1,40}|(?:AES|DES|RC4|RC2|BF|MD5|SHA1|SHA224|SHA256|SHA384|SHA512|HMAC|CMAC|RSA|DSA|DH|EC|ECDSA|ECDH|BN|BIO|X509|SSL|TLS|DTLS|PEM|PKCS5|PKCS7|PKCS12|RAND|CRYPTO|ENGINE|OSSL)(?:_[A-Za-z0-9_]{1,40})?|getrandom|arc4random(?:_[a-z]{1,10})?|crypto_[a-z0-9_]{1,40}|sodium_[a-z0-9_]{1,40}|mbedtls_[a-z0-9_]{1,40})\b/i,
  cpp: /\b(?:EVP_[A-Za-z0-9_]{2,32}|(?:CryptoPP|Weak)::[A-Za-z0-9_]{2,32}|RAND_(?:bytes|priv_bytes)|CRYPTO_memcmp|VerifyBufsEqual|AutoSeededRandomPool|HMAC|SHA(?:1|224|256|384|512)?|MD5|AES|RSA|DES|RC4|Blowfish|getrandom|random_device|EncryptInit|DecryptInit|DigestInit)\b/i
}, SUPPORTED_LANGUAGES2 = Object.keys(
  CRYPTO_MARKER
), isSupportedLanguage2 = (value) => SUPPORTED_LANGUAGES2.includes(value), weakCipherRulesOf = (language) => WEAK_CIPHER[language] ?? [], weakDigestRulesOf = (language) => WEAK_DIGEST[language] ?? [], timingRulesOf = (language) => TIMING[language] ?? [], insecurePrngOf = (language) => INSECURE_PRNG[language] ?? null, cryptoMarkerOf = (language) => CRYPTO_MARKER[language] ?? null;

// src/hooks/crypto/crypto.ts
var EMPTY3 = { findings: [], review: [], advisory: [] }, SECURITY_CONTEXT = /\b(?:token|secret|password|nonce|salt|session|csrf|auth|credential|api[_-]?key|private[_-]?key|otp|reset|\biv\b)\b/i, PRNG_DETAIL = "insecure PRNG in a security context: use a cryptographically secure generator (secrets / SecureRandom / crypto rand)", weakDetails = (language, content3) => firedRules(content3, weakCipherRulesOf(language), language), prngInSecurityContext = (language, content3, prng) => {
  let lines = codeLines(content3, language);
  return lines.some((line, index2) => {
    if (!prng.test(line)) return !1;
    let window = lines.slice(Math.max(0, index2 - 3), index2 + 4).join(`
`);
    return SECURITY_CONTEXT.test(window);
  });
}, reviewDetails = (language, content3) => {
  let prng = insecurePrngOf(language), randomness = prng !== null && prngInSecurityContext(language, content3, prng) ? [PRNG_DETAIL] : [];
  return [
    ...firedRules(content3, weakDigestRulesOf(language), language),
    ...firedRules(content3, timingRulesOf(language), language),
    ...randomness
  ];
}, analyzeFor2 = (language, content3) => ({
  findings: weakDetails(language, content3),
  review: reviewDetails(language, content3),
  advisory: []
}), analyze3 = (file, content3) => {
  let language = languageOf(file);
  return language === null ? EMPTY3 : analyzeFor2(language, content3);
}, classify2 = (snippet, language) => {
  if (weakDetails(language, snippet).length > 0) return "weak";
  if (reviewDetails(language, snippet).length > 0) return "review";
  let marker = cryptoMarkerOf(language);
  return marker !== null && marker.test(snippet) ? "safe" : "invalid";
};

// src/hooks/crypto/cli.ts
var OPTIONS3 = {
  pattern: { type: "string", short: "p", multiple: !0 },
  lang: { type: "string", short: "l" },
  dir: { type: "string", short: "d", multiple: !0 },
  file: { type: "string", short: "f", multiple: !0 }
}, HEADINGS3 = {
  sentinel: `no weak cryptography found
`,
  findings: "Weak cryptography found:",
  review: "Cryptography to review manually:"
}, LANGUAGE_LIST2 = SUPPORTED_LANGUAGES2.join(", "), runCheck2 = (snippets, lang) => {
  if (lang === void 0)
    throw new Error(`-p needs -l <language> (${LANGUAGE_LIST2})`);
  if (!isSupportedLanguage2(lang))
    throw new Error(`unknown language "${lang}": use ${LANGUAGE_LIST2}`);
  let verdicts = snippets.map((snippet) => classify2(snippet, lang));
  return {
    output: verdicts.join(`
`) + `
`,
    hasFinding: verdicts.includes("weak")
  };
}, runScan2 = async (targets) => {
  let root = cwd3(), paths = await resolveTargets(root, targets), report = await scanReport(root, paths, SOURCE_FILTER, analyze3);
  return {
    output: formatReport(report, HEADINGS3),
    hasFinding: report.findings.length > 0
  };
}, run3 = async (args2) => {
  let { values } = parseNodeArgs3({ args: args2, options: OPTIONS3, strict: !0 }), snippets = values.pattern ?? [], targets = [...values.dir ?? [], ...values.file ?? []];
  if (snippets.length > 0) {
    if (targets.length > 0)
      throw new Error(
        "-p checks a snippet and cannot be combined with -d or -f"
      );
    return runCheck2(snippets, values.lang);
  }
  return runScan2(targets);
};

// src/hooks/cvss/cli.ts
import { parseArgs as parseNodeArgs4 } from "node:util";

// src/core/cvss/metrics.ts
var NOT_DEFINED_VALUE = { X: "Not Defined" }, IMPACT_VALUES = { H: "High", L: "Low", N: "None" }, SAFETY_VALUE = { S: "Safety" }, REQUIREMENT_VALUES = {
  ...NOT_DEFINED_VALUE,
  H: "High",
  M: "Medium",
  L: "Low"
}, BASE_DEFINITIONS = [
  {
    code: "AV",
    name: "Attack Vector",
    group: "base",
    values: { N: "Network", A: "Adjacent", L: "Local", P: "Physical" }
  },
  {
    code: "AC",
    name: "Attack Complexity",
    group: "base",
    values: { L: "Low", H: "High" }
  },
  {
    code: "AT",
    name: "Attack Requirements",
    group: "base",
    values: { N: "None", P: "Present" }
  },
  {
    code: "PR",
    name: "Privileges Required",
    group: "base",
    values: { N: "None", L: "Low", H: "High" }
  },
  {
    code: "UI",
    name: "User Interaction",
    group: "base",
    values: { N: "None", P: "Passive", A: "Active" }
  },
  {
    code: "VC",
    name: "Vulnerable System Confidentiality",
    group: "base",
    values: IMPACT_VALUES
  },
  {
    code: "VI",
    name: "Vulnerable System Integrity",
    group: "base",
    values: IMPACT_VALUES
  },
  {
    code: "VA",
    name: "Vulnerable System Availability",
    group: "base",
    values: IMPACT_VALUES
  },
  {
    code: "SC",
    name: "Subsequent System Confidentiality",
    group: "base",
    values: IMPACT_VALUES
  },
  {
    code: "SI",
    name: "Subsequent System Integrity",
    group: "base",
    values: IMPACT_VALUES
  },
  {
    code: "SA",
    name: "Subsequent System Availability",
    group: "base",
    values: IMPACT_VALUES
  }
], THREAT_DEFINITION = {
  code: "E",
  name: "Exploit Maturity",
  group: "threat",
  values: {
    ...NOT_DEFINED_VALUE,
    A: "Attacked",
    P: "Proof-of-Concept",
    U: "Unreported"
  }
}, REQUIREMENT_DEFINITIONS = [
  {
    code: "CR",
    name: "Confidentiality Requirement",
    group: "environmental",
    values: REQUIREMENT_VALUES
  },
  {
    code: "IR",
    name: "Integrity Requirement",
    group: "environmental",
    values: REQUIREMENT_VALUES
  },
  {
    code: "AR",
    name: "Availability Requirement",
    group: "environmental",
    values: REQUIREMENT_VALUES
  }
], SUPPLEMENTAL_DEFINITIONS = [
  {
    code: "S",
    name: "Safety",
    group: "supplemental",
    values: { ...NOT_DEFINED_VALUE, N: "Negligible", P: "Present" }
  },
  {
    code: "AU",
    name: "Automatable",
    group: "supplemental",
    values: { ...NOT_DEFINED_VALUE, N: "No", Y: "Yes" }
  },
  {
    code: "R",
    name: "Recovery",
    group: "supplemental",
    values: {
      ...NOT_DEFINED_VALUE,
      A: "Automatic",
      U: "User",
      I: "Irrecoverable"
    }
  },
  {
    code: "V",
    name: "Value Density",
    group: "supplemental",
    values: { ...NOT_DEFINED_VALUE, D: "Diffuse", C: "Concentrated" }
  },
  {
    code: "RE",
    name: "Vulnerability Response Effort",
    group: "supplemental",
    values: { ...NOT_DEFINED_VALUE, L: "Low", M: "Moderate", H: "High" }
  },
  {
    code: "U",
    name: "Provider Urgency",
    group: "supplemental",
    values: {
      ...NOT_DEFINED_VALUE,
      Clear: "Clear",
      Green: "Green",
      Amber: "Amber",
      Red: "Red"
    }
  }
], modifiedOf = (metric) => `M${metric}`, safetyOf = (metric) => metric === "SI" || metric === "SA" ? SAFETY_VALUE : /* @__PURE__ */ Object.create(null), modifiedDefinition = (definition2) => ({
  code: modifiedOf(definition2.code),
  name: `Modified ${definition2.name}`,
  group: "environmental",
  values: Object.assign(
    /* @__PURE__ */ Object.create(null),
    NOT_DEFINED_VALUE,
    safetyOf(definition2.code),
    definition2.values
  )
}), CVSS_METRICS = [
  ...BASE_DEFINITIONS,
  THREAT_DEFINITION,
  ...REQUIREMENT_DEFINITIONS,
  ...BASE_DEFINITIONS.map(modifiedDefinition),
  ...SUPPLEMENTAL_DEFINITIONS
], BASE_METRICS = BASE_DEFINITIONS.map(
  (definition2) => definition2.code
), IMPACT_METRICS = [
  "VC",
  "VI",
  "VA",
  "SC",
  "SI",
  "SA"
], BY_CODE = new Map(
  CVSS_METRICS.map((definition2) => [definition2.code, definition2])
), MODIFIED_CODES = new Set(BASE_METRICS.map(modifiedOf)), definitionOf = (code) => BY_CODE.get(code), isBaseDefinition = (definition2) => definition2.group === "base", isModifiedDefinition = (definition2) => MODIFIED_CODES.has(definition2.code), isDefined = (value) => value !== void 0 && value !== "X", labelOf = (definition2) => `${definition2.code} (${definition2.name})`, baseOnly = (vector) => ({
  AV: vector.AV,
  AC: vector.AC,
  AT: vector.AT,
  PR: vector.PR,
  UI: vector.UI,
  VC: vector.VC,
  VI: vector.VI,
  VA: vector.VA,
  SC: vector.SC,
  SI: vector.SI,
  SA: vector.SA
});

// src/core/cvss/parse.ts
var CVSS_PREFIX = "CVSS:4.0/", VERSION = /^CVSS:([^/]*)\//, prefixProblem = (text3) => {
  let version = text3.match(VERSION)?.[1];
  return version === void 0 ? `the vector must start with ${CVSS_PREFIX}` : `only CVSS v4.0 vectors are supported, and this one is CVSS:${version}`;
}, valueList = (definition2) => oneOf(
  Object.entries(definition2.values).map(([code, name]) => `${code} (${name})`)
), readPair = (part) => {
  if (part === "") return { problem: "an empty part sits between two slashes" };
  let [code, value, ...rest] = part.split(":");
  if (value === void 0 || value === "" || code === "" || rest.length > 0)
    return { problem: `"${part}" is not a metric:value pair` };
  let definition2 = definitionOf(code);
  return definition2 === void 0 ? { problem: `"${code}" is not a CVSS v4.0 metric` } : Object.hasOwn(definition2.values, value) ? { code: definition2.code, value } : {
    problem: `${labelOf(definition2)} does not take "${value}": use ${valueList(definition2)}`
  };
}, isProblem = (reading) => "problem" in reading, hasBaseMetrics = (metrics) => BASE_METRICS.every((metric) => metrics[metric] !== void 0), missingBaseProblem = (metrics) => {
  let missing = BASE_DEFINITIONS.filter(
    (definition2) => metrics[definition2.code] === void 0
  ).map(labelOf);
  return missing.length === 1 ? `the base metric ${missing[0]} is missing` : `the base metrics ${allOf(missing)} are missing`;
}, partsOf = (body) => {
  let trimmed = body.endsWith("/") ? body.slice(0, -1) : body;
  return trimmed === "" ? [] : trimmed.split("/");
}, parseVector = (input) => {
  let text3 = input.trim();
  if (!text3.startsWith(CVSS_PREFIX)) return { problem: prefixProblem(text3) };
  let readings = partsOf(text3.slice(CVSS_PREFIX.length)).map(readPair), failed2 = readings.find(isProblem);
  if (failed2 !== void 0) return failed2;
  let pairs = readings.flatMap(
    (reading) => isProblem(reading) ? [] : [reading]
  ), repeated = pairs.find(
    (pair, index2) => pairs.findIndex((other) => other.code === pair.code) !== index2
  );
  if (repeated !== void 0)
    return { problem: `the metric ${repeated.code} appears more than once` };
  let metrics = Object.assign(
    /* @__PURE__ */ Object.create(null),
    Object.fromEntries(pairs.map((pair) => [pair.code, pair.value]))
  );
  return hasBaseMetrics(metrics) ? { metrics } : { problem: missingBaseProblem(metrics) };
};

// src/core/cvss/macrovector.ts
var WORST_EXPLOIT_MATURITY = "A", WORST_REQUIREMENT = "H", baseValue = (vector, metric) => {
  let modified = vector[modifiedOf(metric)];
  return isDefined(modified) ? modified : vector[metric];
}, requirementValue = (value) => isDefined(value) ? value : WORST_REQUIREMENT, effectiveMetrics = (vector) => ({
  AV: baseValue(vector, "AV"),
  AC: baseValue(vector, "AC"),
  AT: baseValue(vector, "AT"),
  PR: baseValue(vector, "PR"),
  UI: baseValue(vector, "UI"),
  VC: baseValue(vector, "VC"),
  VI: baseValue(vector, "VI"),
  VA: baseValue(vector, "VA"),
  SC: baseValue(vector, "SC"),
  SI: baseValue(vector, "SI"),
  SA: baseValue(vector, "SA"),
  E: isDefined(vector.E) ? vector.E : WORST_EXPLOIT_MATURITY,
  CR: requirementValue(vector.CR),
  IR: requirementValue(vector.IR),
  AR: requirementValue(vector.AR)
}), reach = ({ AV, PR, UI }) => {
  let fullyOpen = AV === "N" && PR === "N" && UI === "N", partlyOpen = AV === "N" || PR === "N" || UI === "N";
  return fullyOpen ? 0 : partlyOpen && AV !== "P" ? 1 : 2;
}, effort = ({ AC, AT }) => AC === "L" && AT === "N" ? 0 : 1, vulnerableImpact = ({ VC, VI, VA }) => VC === "H" && VI === "H" ? 0 : VC === "H" || VI === "H" || VA === "H" ? 1 : 2, subsequentImpact = ({ SC, SI, SA }) => SI === "S" || SA === "S" ? 0 : SC === "H" || SI === "H" || SA === "H" ? 1 : 2, exploitMaturity = ({ E }) => E === "A" ? 0 : E === "P" ? 1 : 2, requirements = ({
  CR,
  IR,
  AR,
  VC,
  VI,
  VA
}) => CR === "H" && VC === "H" || IR === "H" && VI === "H" || AR === "H" && VA === "H" ? 0 : 1, macroVector = (effective) => ({
  eq1: reach(effective),
  eq2: effort(effective),
  eq3: vulnerableImpact(effective),
  eq4: subsequentImpact(effective),
  eq5: exploitMaturity(effective),
  eq6: requirements(effective)
}), macroKey = ({
  eq1,
  eq2,
  eq3,
  eq4,
  eq5,
  eq6
}) => `${eq1}${eq2}${eq3}${eq4}${eq5}${eq6}`;

// src/core/cvss/lookup.ts
var MACRO_VECTOR_SCORES = {
  "000000": 10,
  "000001": 9.9,
  "000010": 9.8,
  "000011": 9.5,
  "000020": 9.5,
  "000021": 9.2,
  "000100": 10,
  "000101": 9.6,
  "000110": 9.3,
  "000111": 8.7,
  "000120": 9.1,
  "000121": 8.1,
  "000200": 9.3,
  "000201": 9,
  "000210": 8.9,
  "000211": 8,
  "000220": 8.1,
  "000221": 6.8,
  "001000": 9.8,
  "001001": 9.5,
  "001010": 9.5,
  "001011": 9.2,
  "001020": 9,
  "001021": 8.4,
  "001100": 9.3,
  "001101": 9.2,
  "001110": 8.9,
  "001111": 8.1,
  "001120": 8.1,
  "001121": 6.5,
  "001200": 8.8,
  "001201": 8,
  "001210": 7.8,
  "001211": 7,
  "001220": 6.9,
  "001221": 4.8,
  "002001": 9.2,
  "002011": 8.2,
  "002021": 7.2,
  "002101": 7.9,
  "002111": 6.9,
  "002121": 5,
  "002201": 6.9,
  "002211": 5.5,
  "002221": 2.7,
  "010000": 9.9,
  "010001": 9.7,
  "010010": 9.5,
  "010011": 9.2,
  "010020": 9.2,
  "010021": 8.5,
  "010100": 9.5,
  "010101": 9.1,
  "010110": 9,
  "010111": 8.3,
  "010120": 8.4,
  "010121": 7.1,
  "010200": 9.2,
  "010201": 8.1,
  "010210": 8.2,
  "010211": 7.1,
  "010220": 7.2,
  "010221": 5.3,
  "011000": 9.5,
  "011001": 9.3,
  "011010": 9.2,
  "011011": 8.5,
  "011020": 8.5,
  "011021": 7.3,
  "011100": 9.2,
  "011101": 8.2,
  "011110": 8,
  "011111": 7.2,
  "011120": 7,
  "011121": 5.9,
  "011200": 8.4,
  "011201": 7,
  "011210": 7.1,
  "011211": 5.2,
  "011220": 5,
  "011221": 3,
  "012001": 8.6,
  "012011": 7.5,
  "012021": 5.2,
  "012101": 7.1,
  "012111": 5.2,
  "012121": 2.9,
  "012201": 6.3,
  "012211": 2.9,
  "012221": 1.7,
  1e5: 9.8,
  100001: 9.5,
  100010: 9.4,
  100011: 8.7,
  100020: 9.1,
  100021: 8.1,
  100100: 9.4,
  100101: 8.9,
  100110: 8.6,
  100111: 7.4,
  100120: 7.7,
  100121: 6.4,
  100200: 8.7,
  100201: 7.5,
  100210: 7.4,
  100211: 6.3,
  100220: 6.3,
  100221: 4.9,
  101e3: 9.4,
  101001: 8.9,
  101010: 8.8,
  101011: 7.7,
  101020: 7.6,
  101021: 6.7,
  101100: 8.6,
  101101: 7.6,
  101110: 7.4,
  101111: 5.8,
  101120: 5.9,
  101121: 5,
  101200: 7.2,
  101201: 5.7,
  101210: 5.7,
  101211: 5.2,
  101220: 5.2,
  101221: 2.5,
  102001: 8.3,
  102011: 7,
  102021: 5.4,
  102101: 6.5,
  102111: 5.8,
  102121: 2.6,
  102201: 5.3,
  102211: 2.1,
  102221: 1.3,
  11e4: 9.5,
  110001: 9,
  110010: 8.8,
  110011: 7.6,
  110020: 7.6,
  110021: 7,
  110100: 9,
  110101: 7.7,
  110110: 7.5,
  110111: 6.2,
  110120: 6.1,
  110121: 5.3,
  110200: 7.7,
  110201: 6.6,
  110210: 6.8,
  110211: 5.9,
  110220: 5.2,
  110221: 3,
  111e3: 8.9,
  111001: 7.8,
  111010: 7.6,
  111011: 6.7,
  111020: 6.2,
  111021: 5.8,
  111100: 7.4,
  111101: 5.9,
  111110: 5.7,
  111111: 5.7,
  111120: 4.7,
  111121: 2.3,
  111200: 6.1,
  111201: 5.2,
  111210: 5.7,
  111211: 2.9,
  111220: 2.4,
  111221: 1.6,
  112001: 7.1,
  112011: 5.9,
  112021: 3,
  112101: 5.8,
  112111: 2.6,
  112121: 1.5,
  112201: 2.3,
  112211: 1.3,
  112221: 0.6,
  2e5: 9.3,
  200001: 8.7,
  200010: 8.6,
  200011: 7.2,
  200020: 7.5,
  200021: 5.8,
  200100: 8.6,
  200101: 7.4,
  200110: 7.4,
  200111: 6.1,
  200120: 5.6,
  200121: 3.4,
  200200: 7,
  200201: 5.4,
  200210: 5.2,
  200211: 4,
  200220: 4,
  200221: 2.2,
  201e3: 8.5,
  201001: 7.5,
  201010: 7.4,
  201011: 5.5,
  201020: 6.2,
  201021: 5.1,
  201100: 7.2,
  201101: 5.7,
  201110: 5.5,
  201111: 4.1,
  201120: 4.6,
  201121: 1.9,
  201200: 5.3,
  201201: 3.6,
  201210: 3.4,
  201211: 1.9,
  201220: 1.9,
  201221: 0.8,
  202001: 6.4,
  202011: 5.1,
  202021: 2,
  202101: 4.7,
  202111: 2.1,
  202121: 1.1,
  202201: 2.4,
  202211: 0.9,
  202221: 0.4,
  21e4: 8.8,
  210001: 7.5,
  210010: 7.3,
  210011: 5.3,
  210020: 6,
  210021: 5,
  210100: 7.3,
  210101: 5.5,
  210110: 5.9,
  210111: 4,
  210120: 4.1,
  210121: 2,
  210200: 5.4,
  210201: 4.3,
  210210: 4.5,
  210211: 2.2,
  210220: 2,
  210221: 1.1,
  211e3: 7.5,
  211001: 5.5,
  211010: 5.8,
  211011: 4.5,
  211020: 4,
  211021: 2.1,
  211100: 6.1,
  211101: 5.1,
  211110: 4.8,
  211111: 1.8,
  211120: 2,
  211121: 0.9,
  211200: 4.6,
  211201: 1.8,
  211210: 1.7,
  211211: 0.7,
  211220: 0.8,
  211221: 0.2,
  212001: 5.3,
  212011: 2.4,
  212021: 1.4,
  212101: 2.4,
  212111: 1.2,
  212121: 0.5,
  212201: 1,
  212211: 0.3,
  212221: 0.1
};

// src/core/cvss/score.ts
var STEP = 0.1, ROUNDING_EPSILON = 10 ** -6, TOP_SCORE = 10, LEVELS = {
  AV: { N: 0, A: 0.1, L: 0.2, P: 0.3 },
  PR: { N: 0, L: 0.1, H: 0.2 },
  UI: { N: 0, P: 0.1, A: 0.2 },
  AC: { L: 0, H: 0.1 },
  AT: { N: 0, P: 0.1 },
  VC: { H: 0, L: 0.1, N: 0.2 },
  VI: { H: 0, L: 0.1, N: 0.2 },
  VA: { H: 0, L: 0.1, N: 0.2 },
  SC: { H: 0.1, L: 0.2, N: 0.3 },
  SI: { S: 0, H: 0.1, L: 0.2, N: 0.3 },
  SA: { S: 0, H: 0.1, L: 0.2, N: 0.3 },
  CR: { H: 0, M: 0.1, L: 0.2 },
  IR: { H: 0, M: 0.1, L: 0.2 },
  AR: { H: 0, M: 0.1, L: 0.2 }
}, CLASSES = ["eq1", "eq2", "eq3eq6", "eq4", "eq5"], DISTANCE_METRICS = {
  eq1: ["AV", "PR", "UI"],
  eq2: ["AC", "AT"],
  eq3eq6: ["VC", "VI", "VA", "CR", "IR", "AR"],
  eq4: ["SC", "SI", "SA"],
  eq5: []
}, HIGHEST_SEVERITY = {
  eq1: {
    0: ["AV:N/PR:N/UI:N"],
    1: ["AV:A/PR:N/UI:N", "AV:N/PR:L/UI:N", "AV:N/PR:N/UI:P"],
    2: ["AV:P/PR:N/UI:N", "AV:A/PR:L/UI:P"]
  },
  eq2: {
    0: ["AC:L/AT:N"],
    1: ["AC:H/AT:N", "AC:L/AT:P"]
  },
  eq3eq6: {
    "00": ["VC:H/VI:H/VA:H/CR:H/IR:H/AR:H"],
    "01": ["VC:H/VI:H/VA:L/CR:M/IR:M/AR:H", "VC:H/VI:H/VA:H/CR:M/IR:M/AR:M"],
    10: ["VC:L/VI:H/VA:H/CR:H/IR:H/AR:H", "VC:H/VI:L/VA:H/CR:H/IR:H/AR:H"],
    11: [
      "VC:L/VI:H/VA:L/CR:H/IR:M/AR:H",
      "VC:L/VI:H/VA:H/CR:H/IR:M/AR:M",
      "VC:H/VI:L/VA:H/CR:M/IR:H/AR:M",
      "VC:H/VI:L/VA:L/CR:M/IR:H/AR:H",
      "VC:L/VI:L/VA:H/CR:H/IR:H/AR:M"
    ],
    21: ["VC:L/VI:L/VA:L/CR:H/IR:H/AR:H"]
  },
  eq4: {
    0: ["SC:H/SI:S/SA:S"],
    1: ["SC:H/SI:H/SA:H"],
    2: ["SC:L/SI:L/SA:L"]
  },
  eq5: {
    0: ["E:A"],
    1: ["E:P"],
    2: ["E:U"]
  }
}, DEPTHS = {
  eq1: { 0: 1, 1: 4, 2: 5 },
  eq2: { 0: 1, 1: 2 },
  eq3eq6: { "00": 7, "01": 6, 10: 8, 11: 8, 21: 10 },
  eq4: { 0: 6, 1: 5, 2: 4 },
  eq5: { 0: 1, 1: 1, 2: 1 }
}, levelOf = (macro, equivalenceClass) => equivalenceClass === "eq3eq6" ? `${macro.eq3}${macro.eq6}` : `${macro[equivalenceClass]}`, lookup = (macro) => MACRO_VECTOR_SCORES[macroKey(macro)] ?? Number.NaN, lowerImpactScore = (macro) => {
  let { eq3, eq6 } = macro;
  return eq3 === 2 ? Number.NaN : eq3 === 0 && eq6 === 0 ? Math.max(lookup({ ...macro, eq6: 1 }), lookup({ ...macro, eq3: 1 })) : lookup(eq3 === 1 && eq6 === 0 ? { ...macro, eq6: 1 } : { ...macro, eq3: eq3 + 1 });
}, lowerScore = (macro, equivalenceClass) => equivalenceClass === "eq3eq6" ? lowerImpactScore(macro) : lookup({
  ...macro,
  [equivalenceClass]: macro[equivalenceClass] + 1
}), parseHighest = (text3) => Object.assign(
  /* @__PURE__ */ Object.create(null),
  Object.fromEntries(text3.split("/").map((part) => part.split(":")))
), distancesTo = (effective, metrics, highest) => metrics.map(
  (metric) => LEVELS[metric][effective[metric]] - LEVELS[metric][highest[metric]]
), sum = (values) => values.reduce((total, value) => total + value, 0), classDistance = (effective, macro, equivalenceClass) => {
  let candidates = HIGHEST_SEVERITY[equivalenceClass][levelOf(macro, equivalenceClass)].map(
    (text3) => distancesTo(
      effective,
      DISTANCE_METRICS[equivalenceClass],
      parseHighest(text3)
    )
  ), dominant = candidates.find((distances) => distances.every((value) => value >= 0)) ?? candidates[candidates.length - 1];
  return sum(dominant);
}, adjustment = (effective, macro, score, equivalenceClass) => {
  let available = score - lowerScore(macro, equivalenceClass);
  if (Number.isNaN(available)) return null;
  let depth = DEPTHS[equivalenceClass][levelOf(macro, equivalenceClass)] * STEP;
  return available * (classDistance(effective, macro, equivalenceClass) / depth);
}, isNumber = (value) => value !== null, clamp = (value) => Math.min(TOP_SCORE, Math.max(0, value)), round = (value) => Math.round((value + ROUNDING_EPSILON) * 10) / 10, scoreEffective = (effective) => {
  if (IMPACT_METRICS.every((metric) => effective[metric] === "N")) return 0;
  let macro = macroVector(effective), score = lookup(macro), adjustments = CLASSES.map(
    (equivalenceClass) => adjustment(effective, macro, score, equivalenceClass)
  ).filter(isNumber), mean = adjustments.length === 0 ? 0 : sum(adjustments) / adjustments.length;
  return round(clamp(score - mean));
}, severityOf = (score) => score === 0 ? "None" : score < 4 ? "Low" : score < 7 ? "Medium" : score < 9 ? "High" : "Critical";

// src/core/cvss/rating.ts
var SEVERITIES = [
  "None",
  "Low",
  "Medium",
  "High",
  "Critical"
], RATING_LINE = /^(\S+)\s*\((\d+(?:\.\d+)?),\s*([A-Za-z]+)\)$/, groupDefined = (vector, group) => CVSS_METRICS.some(
  (definition2) => definition2.group === group && isDefined(vector[definition2.code])
), nomenclatureOf = (vector) => {
  let threat = groupDefined(vector, "threat"), environmental = groupDefined(vector, "environmental");
  return threat && environmental ? "CVSS-BTE" : threat ? "CVSS-BT" : environmental ? "CVSS-BE" : "CVSS-B";
}, canonicalVector = (vector) => CVSS_PREFIX + CVSS_METRICS.flatMap(({ code }) => {
  let value = vector[code];
  return isDefined(value) ? [`${code}:${value}`] : [];
}).join("/"), scored = (score) => ({
  score,
  severity: severityOf(score)
}), rateVector = (vector) => ({
  vector: canonicalVector(vector),
  nomenclature: nomenclatureOf(vector),
  overall: scored(scoreEffective(effectiveMetrics(vector))),
  base: scored(scoreEffective(effectiveMetrics(baseOnly(vector))))
}), formatScore = ({ score, severity }) => `${score.toFixed(1)}, ${severity}`, readRatingLine = (line) => {
  let match = line.trim().match(RATING_LINE);
  if (match === null) return null;
  let severity = SEVERITIES.find((candidate) => candidate === match[3]);
  return severity === void 0 ? null : { vector: match[1], score: Number(match[2]), severity };
};

// src/hooks/cvss/explain.ts
var INDENT = "  ", valueName = (definition2, value) => definition2.values[value] ?? value, modifiedName = (metric, value) => definitionOf(modifiedOf(metric))?.values[value] ?? value, baseLine = (vector, definition2) => {
  let own3 = `${definition2.name}: ${valueName(definition2, vector[definition2.code])}`, modified = vector[modifiedOf(definition2.code)];
  return isDefined(modified) ? `${own3}, modified to ${modifiedName(definition2.code, modified)}` : own3;
}, describe = (vector, definition2) => {
  if (isBaseDefinition(definition2)) return [baseLine(vector, definition2)];
  let value = vector[definition2.code];
  return !isDefined(value) || isModifiedDefinition(definition2) ? [] : [`${definition2.name}: ${valueName(definition2, value)}`];
}, explainRating = (vector, rating) => [
  ...rating.nomenclature === "CVSS-B" ? [] : [`Base metrics alone: ${formatScore(rating.base)}`],
  ...CVSS_METRICS.flatMap((definition2) => describe(vector, definition2))
].map((line) => `${INDENT}${line}`);

// src/hooks/cvss/cli.ts
var OPTIONS4 = {
  vector: { type: "string", short: "v", multiple: !0 },
  explain: { type: "boolean", short: "e" }
}, parseArgs2 = (args2) => {
  let { values } = parseNodeArgs4({ args: args2, options: OPTIONS4, strict: !0 }), vectors = values.vector ?? [];
  if (vectors.length === 0)
    throw new Error("the cvss hook needs at least one -v <vector>");
  return { vectors, explain: values.explain === !0 };
}, render = (reading, explain) => {
  if (isProblem(reading)) return [`invalid vector: ${reading.problem}`];
  let rating = rateVector(reading.metrics);
  return [
    formatScore(rating.overall),
    ...explain ? explainRating(reading.metrics, rating) : []
  ];
}, run4 = (args2) => {
  let { vectors, explain } = parseArgs2(args2), readings = vectors.map(parseVector);
  return {
    output: readings.flatMap((reading) => render(reading, explain)).join(`
`) + `
`,
    hasFinding: readings.some(isProblem)
  };
};

// src/hooks/infra/cli.ts
import { cwd as cwd4 } from "node:process";
import { parseArgs as parseNodeArgs5 } from "node:util";

// src/hooks/infra/kind.ts
var KINDS = [
  "terraform",
  "dockerfile",
  "github-actions"
], infraKindOf = (relativePath) => {
  let posix = relativePath.replace(/\\/g, "/"), base = posix.split("/").pop() ?? "";
  return /\.(?:tf|hcl)$/i.test(base) || /\.tf\.json$/i.test(base) ? "terraform" : /^dockerfile(?:\.[\w.-]+)?$/i.test(base) || /\.dockerfile$/i.test(base) ? "dockerfile" : /(?:^|\/)\.github\/(?:workflows|actions)\/[^\n]{1,200}\.ya?ml$/i.test(posix) ? "github-actions" : null;
}, isInfraKind = (value) => KINDS.includes(value);

// src/hooks/infra/rules.ts
var OPEN_CIDR = /(?:cidr_blocks?|cidr_ipv4|cidr_ipv6)\s{0,16}=\s{0,16}\[?\s{0,16}["'](?:0\.0\.0\.0\/0|::\/0)["']|["']::\/0["']/, SENSITIVE_PORTS = [
  22,
  23,
  25,
  135,
  139,
  445,
  1433,
  1521,
  2049,
  2375,
  2376,
  27017,
  3306,
  3389,
  5432,
  5601,
  5984,
  6379,
  7001,
  8020,
  9e3,
  9042,
  9200,
  9300,
  11211
], PORT_ASSIGNMENT = /\b(?:from_port|to_port|port)\s{0,16}=\s{0,16}(\d{1,5})\b/g, OPEN_PROTOCOL = /\b(?:protocol|ip_protocol)\s{0,16}=\s{0,16}["']-1["']/, stripBlockComments = (content3) => {
  let kept = [], cursor = 0;
  for (; cursor < content3.length; ) {
    let open = content3.indexOf("/*", cursor), close = open === -1 ? -1 : content3.indexOf("*/", open + 2);
    if (close === -1) break;
    kept.push(content3.slice(cursor, open)), cursor = close + 2;
  }
  return kept.push(content3.slice(cursor)), kept.join(" ");
}, stripHclComments = (content3) => stripBlockComments(content3).split(`
`).map((line) => line.replace(/#[^\n]*/, "").replace(/(^|[^:])\/\/.*/, "$1")).join(`
`), balancedSpan = (text3, openIndex, open, close) => {
  let depth = 0, limit = Math.min(text3.length, openIndex + 2e4);
  for (let index2 = openIndex; index2 < limit; index2 += 1)
    if (text3[index2] === open) depth += 1;
    else if (text3[index2] === close && (depth -= 1, depth === 0))
      return text3.slice(openIndex, index2 + 1);
  return null;
}, topLevelObjects = (list3) => {
  let objects = [], index2 = 0;
  for (; index2 < list3.length; ) {
    if (list3[index2] !== "{") {
      index2 += 1;
      continue;
    }
    let object = balancedSpan(list3, index2, "{", "}");
    if (object === null) break;
    objects.push(object), index2 += object.length;
  }
  return objects;
}, INGRESS_OPENER = /(?:\bingress\b\s{0,16}=?\s{0,16}|dynamic\s{1,16}"ingress"\s{0,16}|"ingress"\s{0,16}:\s{0,16})([{[])/g, ingressRuleBodies = (content3) => {
  let stripped = stripHclComments(content3);
  return [...stripped.matchAll(INGRESS_OPENER)].flatMap((match) => {
    let open = match[1], start = match.index + match[0].length - 1, block = balancedSpan(stripped, start, open, open === "{" ? "}" : "]");
    return block === null ? [] : open === "[" ? topLevelObjects(block) : [block];
  });
}, namesSensitivePort = (body) => [...body.matchAll(PORT_ASSIGNMENT)].some(
  (match) => SENSITIVE_PORTS.includes(Number(match[1]))
), coversSensitivePort = (body) => {
  if (namesSensitivePort(body) || OPEN_PROTOCOL.test(body)) return !0;
  let from = /\bfrom_port\s{0,16}=\s{0,16}(\d{1,5})/.exec(body), to = /\bto_port\s{0,16}=\s{0,16}(\d{1,5})/.exec(body);
  if (from === null || to === null) return !1;
  let low = Number(from[1]), high = Number(to[1]);
  return SENSITIVE_PORTS.some((port) => low <= port && port <= high);
}, hasPublicIngress = (content3) => ingressRuleBodies(content3).some(
  (body) => OPEN_CIDR.test(body) && coversSensitivePort(body)
), IAM_WILDCARD_LINE = [
  /^[ \t]*actions\s*=\s*\[\s*["']\*["']/im,
  /^[ \t]*resources\s*=\s*\[\s*["']\*["']/im,
  /["']Action["']\s{0,16}:\s{0,16}\[?\s{0,16}["']\*["']/i,
  /["']Resource["']\s{0,16}:\s{0,16}\[?\s{0,16}["']\*["']/i,
  /["']Principal["']\s{0,16}:\s{0,16}\[?\s{0,16}["']\*["']/i,
  /\bidentifiers\s{0,16}=\s{0,16}\[\s{0,16}["']\*["']/im
], DENY = /\beffect\s{0,16}=\s{0,16}["']?Deny|["']Effect["']\s{0,16}:\s{0,16}["']Deny/i, hasIamWildcard = (content3) => {
  let lines = content3.split(`
`);
  return lines.some((line, index2) => {
    if (!IAM_WILDCARD_LINE.some((rule2) => rule2.test(line))) return !1;
    let window = lines.slice(Math.max(0, index2 - 10), Math.min(lines.length, index2 + 11)).join(`
`);
    return !DENY.test(window);
  });
}, hasUnpinnedModule = (content3) => content3.split(`
`).some(
  (line) => /\bsource\s{0,16}=\s{0,16}"(?:(?:git::|git@|github\.com\/|bitbucket\.org\/)|https:\/\/(?=[^"]{0,500}\.git))[^"]{0,500}"/i.test(
    line
  ) && !/\?ref=[0-9a-f]{6,40}\b/i.test(line)
), SECRET_IN_DATA = /^[ \t]*[\w-]{0,64}(?:password|secret|token|api_key|access_key|client_secret|private_key)[ \t]*=[ \t]*"(?!\$\{)[^"]{6,4096}"/im, finalStage = (content3) => {
  let lines = content3.split(`
`), start = 0;
  return lines.forEach((line, index2) => {
    /^\s*FROM\s+/i.test(line) && (start = index2);
  }), lines.slice(start).join(`
`);
}, runsAsRoot = (content3) => {
  let users = [...finalStage(content3).matchAll(/^[ \t]*USER[ \t]+(\S+)/gim)];
  return users.length === 0 ? !1 : /^(?:root|0)\b/i.test(users[users.length - 1][1]);
}, DOWNLOADER = /\b(?:curl|wget)\b/, SHELL_STAGE = /^\s{0,16}(?:sudo\s{1,16})?(?:sh|bash|zsh)\b/, pipesDownloadIntoShell = (line) => line.split("|").some(
  (stage, index2, stages) => index2 > 0 && SHELL_STAGE.test(stage) && DOWNLOADER.test(stages[index2 - 1])
), hasCurlPipe = (content3) => content3.replace(/\\\s{0,16}\n/g, " ").split(`
`).some(
  (line) => pipesDownloadIntoShell(line) && !/\b(?:sha256sum|sha512sum|gpg|cosign|checksum|--verify)\b/i.test(line)
), finalImage = (content3) => {
  let lines = content3.split(`
`), image = null;
  for (let line of lines) {
    let match = /^\s*FROM\s+(\S+)/i.exec(line);
    match !== null && (image = match[1]);
  }
  return image;
}, hasMutableFrom = (content3) => {
  let image = finalImage(content3);
  return image === null ? !1 : !/@sha256:/.test(image) && !/^scratch$/i.test(image);
}, EVENT_EXPRESSION = /\$\{\{\s{0,16}github\.event\.([^}]{0,400})\}\}/gi, UNTRUSTED_EVENT_FIELD = /title|body|message|name|email|label|ref|head_ref|comment|description|author|default_branch/i, runStepBodies = (content3) => {
  let lines = content3.split(`
`), bodies = [];
  for (let index2 = 0; index2 < lines.length; index2 += 1) {
    let match = /^(\s*)(?:-\s{0,4})?run\s{0,16}:(.*)$/.exec(lines[index2]);
    if (match === null) continue;
    let indent = match[1].length, inline = match[2].trim();
    if (inline !== "" && !/^[|>]/.test(inline)) {
      bodies.push(inline);
      continue;
    }
    let body = "";
    for (let next = index2 + 1; next < lines.length; next += 1)
      if (lines[next].trim() !== "") {
        if (/^\s*/.exec(lines[next])[0].length <= indent) break;
        body += `${lines[next]}
`;
      }
    bodies.push(body);
  }
  return bodies;
}, interpolatesUntrustedField = (body) => [...body.matchAll(EVENT_EXPRESSION)].some(
  (match) => UNTRUSTED_EVENT_FIELD.test(match[1])
), hasScriptInjection = (content3) => runStepBodies(content3).some(interpolatesUntrustedField), hasUnpinnedUses = (content3) => content3.split(`
`).some((line) => {
  let match = /^\s*(?:-\s*)?uses\s*:\s*['"]?[\w.-]+\/[\w.-]+@([^\s'"]+)/i.exec(line);
  return match !== null && !/^[0-9a-f]{40}$/i.test(match[1]);
}), RULES = {
  terraform: [
    {
      tag: "public-ingress",
      severity: "finding",
      detail: "security group / NACL ingress open to 0.0.0.0/0 on a sensitive port",
      test: hasPublicIngress
    },
    {
      tag: "iam-wildcard",
      severity: "finding",
      detail: 'IAM policy grants a wildcard Action / Resource / Principal ("*")',
      test: hasIamWildcard
    },
    {
      tag: "secret-in-data",
      severity: "finding",
      detail: "a literal secret value in a resource attribute: use a variable or a secret store",
      test: (content3) => SECRET_IN_DATA.test(content3)
    },
    {
      tag: "encryption-disabled",
      severity: "finding",
      detail: "encryption explicitly disabled (encrypted = false)",
      test: (content3) => /\bencrypted\s{0,16}=\s{0,16}false\b/i.test(content3)
    },
    {
      tag: "unpinned-module",
      severity: "finding",
      detail: "module sourced from git without a commit-pinned ?ref=<sha>",
      test: hasUnpinnedModule
    }
  ],
  dockerfile: [
    {
      tag: "root-user",
      severity: "finding",
      detail: "final image sets USER root (or USER 0)",
      test: runsAsRoot
    },
    {
      tag: "curl-pipe",
      severity: "finding",
      detail: "RUN pipes a downloaded script into a shell without verification",
      test: hasCurlPipe
    },
    {
      tag: "mutable-tag",
      severity: "advisory",
      detail: "final FROM uses a mutable tag (or is untagged), not a @sha256 digest",
      test: hasMutableFrom
    }
  ],
  "github-actions": [
    {
      tag: "script-injection",
      severity: "finding",
      detail: "untrusted github.event field interpolated into a run: block",
      test: hasScriptInjection
    },
    {
      tag: "write-all",
      severity: "finding",
      detail: "workflow grants permissions: write-all",
      test: (content3) => /permissions\s{0,16}:\s{0,16}write-all/i.test(content3)
    },
    {
      tag: "unpinned-action",
      severity: "advisory",
      detail: "uses: an action pinned to a tag/branch, not a full commit SHA",
      test: hasUnpinnedUses
    }
  ]
}, FINDING_TAGS = new Set(
  Object.values(RULES).flat().filter((rule2) => rule2.severity === "finding").map((rule2) => rule2.tag)
);

// src/hooks/infra/analyze.ts
var analyze4 = (content3, kind) => {
  let fired = RULES[kind].filter((rule2) => rule2.test(content3));
  return {
    findings: fired.filter((rule2) => rule2.severity === "finding").map((rule2) => rule2.detail),
    review: [],
    advisory: fired.filter((rule2) => rule2.severity === "advisory").map((rule2) => rule2.detail)
  };
}, analyzeInfra = (file, content3) => {
  let kind = infraKindOf(file);
  return kind === null ? { findings: [], review: [], advisory: [] } : analyze4(content3, kind);
}, classify3 = (snippet, kind) => {
  let finding = RULES[kind].find(
    (rule2) => rule2.severity === "finding" && rule2.test(snippet)
  );
  if (finding !== void 0) return finding.tag;
  let advisory = RULES[kind].find(
    (rule2) => rule2.severity === "advisory" && rule2.test(snippet)
  );
  return advisory === void 0 ? "safe" : advisory.tag;
};

// src/hooks/infra/filter.ts
var INFRA_FILTER = {
  ignoredDirs: BASE_IGNORED_DIRS,
  ignoredDirPatterns: BASE_IGNORED_DIR_PATTERNS,
  accept: (relativePath) => infraKindOf(relativePath) !== null
};

// src/hooks/infra/cli.ts
var OPTIONS5 = {
  pattern: { type: "string", short: "p", multiple: !0 },
  kind: { type: "string", short: "k" },
  dir: { type: "string", short: "d", multiple: !0 },
  file: { type: "string", short: "f", multiple: !0 }
}, HEADINGS4 = {
  sentinel: `no infrastructure risks found
`,
  findings: "Infrastructure risks found:",
  advisory: "Infrastructure hardening advisories:"
}, runCheck3 = (snippets, kind) => {
  if (kind === void 0)
    throw new Error("-p needs -k <terraform|dockerfile|github-actions>");
  if (!isInfraKind(kind))
    throw new Error(
      `unknown kind "${kind}": use terraform, dockerfile, or github-actions`
    );
  let verdicts = snippets.map((snippet) => classify3(snippet, kind));
  return {
    output: verdicts.join(`
`) + `
`,
    hasFinding: verdicts.some((verdict) => FINDING_TAGS.has(verdict))
  };
}, runScan3 = async (targets) => {
  let root = cwd4(), paths = await resolveTargets(root, targets), report = await scanReport(root, paths, INFRA_FILTER, analyzeInfra);
  return {
    output: formatReport(report, HEADINGS4),
    hasFinding: report.findings.length > 0
  };
}, run5 = async (args2) => {
  let { values } = parseNodeArgs5({ args: args2, options: OPTIONS5, strict: !0 }), snippets = values.pattern ?? [], targets = [...values.dir ?? [], ...values.file ?? []];
  if (snippets.length > 0) {
    if (targets.length > 0)
      throw new Error(
        "-p checks a snippet and cannot be combined with -d or -f"
      );
    return runCheck3(snippets, values.kind);
  }
  return runScan3(targets);
};

// src/hooks/interpreter/cli.ts
import { cwd as cwd5 } from "node:process";
import { parseArgs as parseNodeArgs6 } from "node:util";

// src/hooks/interpreter/patterns.ts
var REVIEW = "review statically, never run it", C_FAMILY = [
  {
    regex: /\bsystem\s{0,16}\(/,
    detail: `system() runs a shell command (C/C++): ${REVIEW}`
  },
  {
    regex: /\bpopen\s{0,16}\(/,
    detail: `popen() runs a shell command (C/C++): ${REVIEW}`
  },
  {
    regex: /\bf?exec(?:l|lp|le|v|vp|vpe|ve)\s{0,16}\(/,
    detail: `exec* replaces the process image with another program (C/C++): ${REVIEW}`
  }
], JVM_FAMILY = [
  {
    regex: /\.exec\s{0,16}\(/,
    detail: `Runtime.exec spawns a system process (JVM): ${REVIEW}`
  },
  {
    regex: /\bnew\s{1,16}ProcessBuilder\s{0,16}\(/,
    detail: `ProcessBuilder runs a system process (JVM): ${REVIEW}`
  },
  {
    regex: /\bScriptEngine\b/,
    detail: `ScriptEngine.eval runs a script string (JVM): ${REVIEW}`
  },
  {
    regex: /\bObjectInputStream\b|\.readObject\s{0,16}\(/,
    detail: `ObjectInputStream.readObject can run gadget code on load (JVM): ${REVIEW}`
  }
], SINK_RULES = {
  javascript: [
    {
      regex: /(?<![.\w])eval\s{0,16}\(|(?<![.\w])eval\s{0,16}\?\.\s{0,16}\(|\(\s{0,8}0\s{0,8},\s{0,8}eval\s{0,8}\)|(?:globalThis|window|self)\s{0,16}\[\s{0,16}['"`]eval['"`]\s{0,16}\]/,
      detail: `eval() (incl. indirect / optional-call forms) runs a string as code: ${REVIEW}`
    },
    {
      regex: /(?<![.\w])Function\s{0,16}\(/,
      detail: `Function constructor (with or without new) compiles a string into code: ${REVIEW}`
    },
    {
      regex: /\b(?:setTimeout|setInterval)\s{0,16}\(\s{0,16}['"`]/,
      detail: `setTimeout/setInterval with a string body evaluates code: ${REVIEW}`
    },
    {
      regex: /\bvm\.(?:runInNewContext|runInThisContext|runInContext|compileFunction)\s{0,16}\(|\bnew\s{1,16}vm\.Script\s{0,16}\(/,
      detail: `vm module executes a string as code: ${REVIEW}`
    },
    {
      regex: /\bchild_process\b|\bexecSync\s{0,16}\(|\bexec\s{0,16}\(\s{0,16}['"`]/,
      detail: `child_process exec spawns a shell command: ${REVIEW}`
    },
    {
      regex: /\brequire\s{0,16}\(\s{0,16}(?:[^\s'"`)/]|['"`][^)]{0,200}(?:\+|\$\{))/,
      detail: `require() with a non-literal or interpolated specifier loads code at runtime: ${REVIEW}`
    },
    {
      regex: /\bimport\s{0,16}\(\s{0,16}(?:[^\s'"`)/]|['"`][^)]{0,200}(?:\+|\$\{))/,
      detail: `import() with a non-literal or interpolated specifier loads code at runtime: ${REVIEW}`
    }
  ],
  python: [
    {
      regex: /(?<![.\w])(?:eval|exec)\s{0,16}\(/,
      detail: `eval/exec run a string as code: ${REVIEW}`
    },
    {
      regex: /\b__import__\s{0,16}\(/,
      detail: `__import__() loads a module named at runtime: ${REVIEW}`
    },
    {
      regex: /\bos\.(?:system|popen|exec[lv]\w{0,16}|spawn[lv]\w{0,16})\s{0,16}\(|\bsubprocess\.getoutput\s{0,16}\(/,
      detail: `os / subprocess process launcher runs a command: ${REVIEW}`
    },
    {
      regex: /\bshell\s{0,16}=\s{0,16}True\b/,
      detail: `subprocess with shell=True runs a shell command: ${REVIEW}`
    },
    {
      regex: /\b(?:pickle|cPickle)\.loads?\s{0,16}\(/,
      detail: `pickle.load/loads can run arbitrary objects on load: ${REVIEW}`
    },
    {
      regex: /\byaml\.(?:unsafe_load|load)\s{0,16}\(/,
      detail: `yaml.load without SafeLoader can instantiate arbitrary objects: ${REVIEW}`
    }
  ],
  php: [
    {
      regex: /\beval\s{0,16}\(/,
      detail: `eval() runs a string as code: ${REVIEW}`
    },
    {
      regex: /\bassert\s{0,16}\(\s{0,16}['"]/,
      detail: `assert() on a string evaluates it as code (PHP): ${REVIEW}`
    },
    {
      regex: /\bcreate_function\s{0,16}\(/,
      detail: `create_function() compiles a string into a function (PHP): ${REVIEW}`
    },
    {
      regex: /(?<![>:$\w])(?:system|exec|shell_exec|passthru|popen|proc_open)\s{0,16}\(/,
      detail: `shell exec function runs a system command (PHP): ${REVIEW}`
    },
    {
      regex: /`[^`\n]{1,400}`/,
      detail: `backtick operator runs a shell command (PHP): ${REVIEW}`
    },
    {
      regex: /\bcall_user_func(?:_array)?\s{0,16}\(/,
      detail: `call_user_func dispatches a function named at runtime (PHP): ${REVIEW}`
    },
    {
      regex: /\b(?:include|include_once|require|require_once)\b[^\n;]{0,40}\$/,
      detail: `include/require with a runtime path loads code (PHP): ${REVIEW}`
    }
  ],
  ruby: [
    {
      regex: /\b(?:instance_eval|class_eval|module_eval|eval)\b/,
      detail: `eval family runs a string as code (Ruby): ${REVIEW}`
    },
    {
      regex: /\b(?:system|exec)\b\s{0,16}(?:\(|['"])/,
      detail: `system/exec run a shell command (Ruby): ${REVIEW}`
    },
    {
      regex: /\bProcess\.spawn\s{0,16}\(|(?<![.\w])spawn\s{0,16}\(/,
      detail: `Process.spawn / Kernel#spawn launch a process (Ruby): ${REVIEW}`
    },
    {
      regex: /`[^`\n]{1,400}`|%x[^\w\s]/,
      detail: `backticks or %x run a shell command (Ruby): ${REVIEW}`
    },
    {
      regex: /(?<![.\w])open\s{0,16}\(|\bIO\.(?:popen|read|binread)\s{0,16}\(|\bOpen3\b/,
      detail: `Kernel#open / IO can run a command via a leading pipe (Ruby): ${REVIEW}`
    },
    {
      regex: /\bMarshal\.load\s{0,16}\(/,
      detail: `Marshal.load reconstructs and can run arbitrary objects (Ruby): ${REVIEW}`
    }
  ],
  java: JVM_FAMILY,
  kotlin: JVM_FAMILY,
  go: [
    {
      regex: /\bexec\.Command(?:Context)?\s{0,16}\(/,
      detail: `exec.Command runs a system process (Go): ${REVIEW}`
    },
    {
      regex: /\bplugin\.Open\s{0,16}\(/,
      detail: `plugin.Open loads and runs a shared object (Go): ${REVIEW}`
    }
  ],
  rust: [
    {
      regex: /\bCommand::new\s{0,16}\(/,
      detail: `Command::new runs a system process (Rust): ${REVIEW}`
    },
    {
      regex: /\bprocess::Command\b/,
      detail: `process::Command runs a system process (Rust): ${REVIEW}`
    }
  ],
  c: C_FAMILY,
  cpp: C_FAMILY,
  csharp: [
    {
      regex: /\bProcess\.Start\s{0,16}\(|\bnew\s{1,16}Process\s{0,16}\(/,
      detail: `Process.Start runs a system process (.NET): ${REVIEW}`
    },
    {
      regex: /\bBinaryFormatter\b/,
      detail: `BinaryFormatter can run gadget code on load (.NET): ${REVIEW}`
    },
    {
      regex: /\bAssembly\.Load\w{0,20}\s{0,16}\(/,
      detail: `Assembly.Load loads and runs code at runtime (.NET): ${REVIEW}`
    }
  ]
}, SUPPORTED_LANGUAGES3 = Object.keys(
  SINK_RULES
), rulesOf = (language) => SINK_RULES[language] ?? [], isSupportedLanguage3 = (value) => SUPPORTED_LANGUAGES3.includes(value);

// src/hooks/interpreter/interpreter.ts
var EMPTY4 = { findings: [], review: [], advisory: [] }, analyzeFor3 = (language, content3) => ({
  findings: [],
  review: firedRules(content3, rulesOf(language), language),
  advisory: []
}), analyze5 = (file, content3) => {
  let language = languageOf(file);
  return language === null ? EMPTY4 : analyzeFor3(language, content3);
}, classify4 = (snippet, language) => firedRules(snippet, rulesOf(language), language).length > 0 ? "careful" : "safe";

// src/hooks/interpreter/cli.ts
var OPTIONS6 = {
  pattern: { type: "string", short: "p", multiple: !0 },
  lang: { type: "string", short: "l" },
  dir: { type: "string", short: "d", multiple: !0 },
  file: { type: "string", short: "f", multiple: !0 }
}, HEADINGS5 = {
  sentinel: `no dynamic-execution sinks found
`,
  findings: "Dynamic-execution sinks found:",
  review: "Dynamic-execution sinks to review (read them, never run them):"
}, LANGUAGE_LIST3 = SUPPORTED_LANGUAGES3.join(", "), runCheck4 = (snippets, lang) => {
  if (lang === void 0)
    throw new Error(`-p needs -l <language> (${LANGUAGE_LIST3})`);
  if (!isSupportedLanguage3(lang))
    throw new Error(`unknown language "${lang}": use ${LANGUAGE_LIST3}`);
  return { output: snippets.map((snippet) => classify4(snippet, lang)).join(`
`) + `
`, hasFinding: !1 };
}, runScan4 = async (targets) => {
  let root = cwd5(), paths = await resolveTargets(root, targets), report = await scanReport(root, paths, SOURCE_FILTER, analyze5);
  return { output: formatReport(report, HEADINGS5), hasFinding: !1 };
}, run6 = async (args2) => {
  let { values } = parseNodeArgs6({ args: args2, options: OPTIONS6, strict: !0 }), snippets = values.pattern ?? [], targets = [...values.dir ?? [], ...values.file ?? []];
  if (snippets.length > 0) {
    if (targets.length > 0)
      throw new Error(
        "-p checks a snippet and cannot be combined with -d or -f"
      );
    return runCheck4(snippets, values.lang);
  }
  return runScan4(targets);
};

// src/hooks/jwt/cli.ts
import { cwd as cwd6 } from "node:process";
import { parseArgs as parseNodeArgs7 } from "node:util";

// src/hooks/jwt/patterns.ts
var VERIFY_CALL = {
  javascript: /\bjwt\.verify\s{0,16}\(|\bjwtVerify\s{0,16}\(|\bverifyJwt\s{0,16}\(|\bcompactVerify\s{0,16}\(|\bflattenedVerify\s{0,16}\(/i,
  python: /\bjwt\.decode\s{0,10}\(/i,
  go: /jwt\.Parse(WithClaims)?\s{0,4}\(/i,
  java: /(?:\.parseSignedClaims|\.parseClaimsJws|\.parseSignedContent)\s{0,4}\(|\bJWT\.require\s{0,4}\(|\.(?:verify|process)\s{0,4}\(/i,
  kotlin: /\bparseClaimsJws\s{0,8}\(|\bparseSignedClaims\s{0,8}\(|\bparseSignedContent\s{0,8}\(|\.verify\s{0,8}\(/i,
  php: /JWT::decode\s{0,4}\(/i,
  ruby: /JWT\.decode\s{0,4}\(/i,
  rust: /\bdecode\s{0,4}(?:::\s{0,4}<[^>]{1,80}>\s{0,4})?\(/i,
  csharp: /\.ValidateToken(?:Async)?\s{0,16}\(/i
}, PIN_PRESENT = {
  python: /\balgorithms\s{0,5}=/i
}, PIN_OPTION = {
  javascript: /\balgorithms\s{0,16}:\s{0,16}\[([^\]]{0,400})\]/i,
  python: /algorithms\s{0,5}=\s{0,5}\[([^\]]{0,200})\]/i,
  go: /WithValidMethods\s{0,4}\(\s{0,4}\[\]string\s{0,4}\{([^}]{0,200})\}/i,
  java: /(?:(?:Set|List|Arrays)\.(?:of|asList)|JWSVerificationKeySelector\s{0,4}(?:<[^>]{0,60}>)?)\s{0,4}\(\s{0,4}((?:JWSAlgorithm\.[A-Za-z0-9]{2,8}\s{0,3},?\s{0,3}){1,8})/i,
  php: /(?:new\s{1,4}Key\s{0,4}\([^,)]{1,80},|,\s{0,4}\[)\s{0,4}(['"][^\]\)]{0,120}['"])/i,
  ruby: /algorithms?["']?\s{0,4}(?::|=>)\s{0,4}\[?\s{0,4}([^\]}\n]{1,200})/i,
  rust: /(?:Validation::new\s{0,4}\(|\balgorithms\s{0,4}=\s{0,4}vec!\s{0,4}\[)\s{0,4}([^)\]]{1,200})/i,
  csharp: /\bValidAlgorithms\s{0,16}=\s{0,16}new\b[^{]{0,64}\{([^}]{0,400})\}/i
}, DISABLE_VERIFY = {
  python: /\bverify(?:_signature)?["']?\s{0,5}[:=]\s{0,5}False/i,
  go: /ParseUnverified\s{0,4}\(/i,
  java: /\.unsecured\s{0,4}\(\s{0,4}\)|\b(?:parseClaimsJwt|parseUnsecuredClaims|parseUnsecuredContent)\s{0,4}\(/i,
  kotlin: /\.unsecured\s{0,8}\(|\bparseClaimsJwt\s{0,8}\(|\bparseUnsecuredClaims\s{0,8}\(|\bparseUnsecuredContent\s{0,8}\(/i,
  ruby: /JWT\.decode\s{0,4}\([^,\n]{1,80},[^,\n]{1,80},\s{0,4}false\b/i,
  rust: /insecure_disable_signature_validation\s{0,4}\(/i,
  csharp: /\bRequireSignedTokens\s{0,16}=\s{0,16}false\b|\bValidateIssuerSigningKey\s{0,16}=\s{0,16}false\b|\bSignatureValidator\s{0,16}=/i
}, REQUIRES_PIN = {
  javascript: !0,
  python: !0,
  go: !0,
  ruby: !0
}, DISABLE_STANDALONE = {
  python: !1
}, SUPPORTED_LANGUAGES4 = Object.keys(
  VERIFY_CALL
), isSupportedLanguage4 = (value) => SUPPORTED_LANGUAGES4.includes(value), verifyCallOf = (language) => VERIFY_CALL[language] ?? null, pinOptionOf = (language) => PIN_OPTION[language] ?? null, pinPresentOf = (language) => PIN_PRESENT[language] ?? null, disableVerifyOf = (language) => DISABLE_VERIFY[language] ?? null, requiresExplicitPin = (language) => REQUIRES_PIN[language] ?? !1, disableIsStandalone = (language) => DISABLE_STANDALONE[language] ?? !0;

// src/hooks/jwt/jwt.ts
var EMPTY5 = { findings: [], review: [], advisory: [] }, ASYMMETRIC = /^(?:RS|ES|PS)(?:256|384|512)$/i, HMAC = /^HS(?:256|384|512)$/i, WINDOW2 = 6, UNPINNED_DETAIL = "JWT verification without an explicit algorithms allowlist: pin the accepted algorithms to block algorithm confusion", UNSAFE_DETAIL = "JWT algorithms allowlist is unsafe ('none', or an asymmetric algorithm mixed with HMAC): pin a single algorithm family", DISABLED_DETAIL = "JWT signature verification is disabled: the token is trusted without checking its signature", isUnsafeAllowlist = (body) => {
  let algorithms = body.match(/[A-Za-z0-9]+/g) ?? [];
  return algorithms.some((alg) => /^none$/i.test(alg)) ? !0 : algorithms.some((alg) => ASYMMETRIC.test(alg)) && algorithms.some((alg) => HMAC.test(alg));
}, pinDetail = (window, language) => {
  let pin = pinOptionOf(language), match = pin === null ? null : pin.exec(window);
  if (match !== null) return isUnsafeAllowlist(match[1]) ? UNSAFE_DETAIL : null;
  let present = pinPresentOf(language);
  return present !== null && present.test(window) ? null : requiresExplicitPin(language) ? UNPINNED_DETAIL : null;
}, analyzeFor4 = (language, content3) => {
  let call = verifyCallOf(language);
  if (call === null) return EMPTY5;
  let disable2 = disableVerifyOf(language), lines = codeLines(content3, language), findings = [], add = (detail) => {
    findings.includes(detail) || findings.push(detail);
  };
  for (let index2 = 0; index2 < lines.length; index2 += 1) {
    let line = lines[index2];
    if (call.test(line)) {
      let window = lines.slice(index2, Math.min(lines.length, index2 + WINDOW2)).join(`
`);
      if (disable2 !== null && disable2.test(window)) add(DISABLED_DETAIL);
      else {
        let detail = pinDetail(window, language);
        detail !== null && add(detail);
      }
      continue;
    }
    disableIsStandalone(language) && disable2 !== null && disable2.test(line) && add(DISABLED_DETAIL);
  }
  return { findings, review: [], advisory: [] };
}, analyze6 = (file, content3) => {
  let language = languageOf(file);
  return language === null ? EMPTY5 : analyzeFor4(language, content3);
}, classify5 = (snippet, language) => {
  let call = verifyCallOf(language), disable2 = disableVerifyOf(language), isCall = call !== null && call.test(snippet), isDisable = disable2 !== null && disable2.test(snippet) && (disableIsStandalone(language) || isCall);
  return !isCall && !isDisable ? "invalid" : isDisable ? "unpinned" : pinDetail(snippet, language) === null ? "safe" : "unpinned";
};

// src/hooks/jwt/cli.ts
var OPTIONS7 = {
  pattern: { type: "string", short: "p", multiple: !0 },
  lang: { type: "string", short: "l" },
  dir: { type: "string", short: "d", multiple: !0 },
  file: { type: "string", short: "f", multiple: !0 }
}, HEADINGS6 = {
  sentinel: `no unpinned JWT verification found
`,
  findings: "Unpinned JWT verification found:"
}, LANGUAGE_LIST4 = SUPPORTED_LANGUAGES4.join(", "), runCheck5 = (snippets, lang) => {
  if (lang === void 0)
    throw new Error(`-p needs -l <language> (${LANGUAGE_LIST4})`);
  if (!isSupportedLanguage4(lang))
    throw new Error(`unknown language "${lang}": use ${LANGUAGE_LIST4}`);
  let verdicts = snippets.map((snippet) => classify5(snippet, lang));
  return {
    output: verdicts.join(`
`) + `
`,
    hasFinding: verdicts.includes("unpinned")
  };
}, runScan5 = async (targets) => {
  let root = cwd6(), paths = await resolveTargets(root, targets), report = await scanReport(root, paths, SOURCE_FILTER, analyze6);
  return {
    output: formatReport(report, HEADINGS6),
    hasFinding: report.findings.length > 0
  };
}, run7 = async (args2) => {
  let { values } = parseNodeArgs7({ args: args2, options: OPTIONS7, strict: !0 }), snippets = values.pattern ?? [], targets = [...values.dir ?? [], ...values.file ?? []];
  if (snippets.length > 0) {
    if (targets.length > 0)
      throw new Error(
        "-p checks a snippet and cannot be combined with -d or -f"
      );
    return runCheck5(snippets, values.lang);
  }
  return runScan5(targets);
};

// src/hooks/network/cli.ts
import { parseArgs as parseNodeArgs8 } from "node:util";

// src/hooks/network/ipv4-address.ts
var DOTTED_QUAD = /^(0|[1-9]\d{0,2})\.(0|[1-9]\d{0,2})\.(0|[1-9]\d{0,2})\.(0|[1-9]\d{0,2})$/;
var packOctets = (octets) => octets.reduce((address, octet) => address * 256 + octet, 0) >>> 0, unpackOctets = (address) => [
  address >>> 24 & 255,
  address >>> 16 & 255,
  address >>> 8 & 255,
  address & 255
], toDottedQuad = (address) => unpackOctets(address).join("."), stripRootDot = (host2) => host2.length > 1 && host2.endsWith(".") && !host2.endsWith("..") ? host2.slice(0, -1) : host2;

// src/hooks/network/ipv4.ts
var NON_HOST_CHARS = /[:/\\@?#[\]\s]/, HEX_DIGITS = /^[0-9a-fA-F]+$/, OCTAL_DIGITS = /^[0-7]+$/, DECIMAL_DIGITS = /^[0-9]+$/, parseHex = (part) => {
  let digits = part.slice(2);
  return digits.length === 0 ? 0 : HEX_DIGITS.test(digits) ? Number.parseInt(digits, 16) : null;
}, isHexPart = (part) => part.length >= 2 && part[0] === "0" && (part[1] === "x" || part[1] === "X"), isOctalPart = (part) => part.length >= 2 && part[0] === "0", parsePart = (part) => isHexPart(part) ? parseHex(part) : isOctalPart(part) ? OCTAL_DIGITS.test(part) ? Number.parseInt(part, 8) : null : DECIMAL_DIGITS.test(part) ? Number.parseInt(part, 10) : null, packParts = (parts) => {
  let lastIndex = parts.length - 1;
  for (let index2 = 0; index2 < lastIndex; index2 += 1)
    if (parts[index2] > 255) return null;
  let remainingBits = (4 - parts.length + 1) * 8;
  if (parts[lastIndex] > 2 ** remainingBits - 1) return null;
  let highOctets = parts.slice(0, lastIndex), lowOctets = unpackOctets(parts[lastIndex]).slice(parts.length - 1);
  return packOctets([...highOctets, ...lowOctets]);
}, canonicalizeIPv4 = (host2) => {
  if (host2.length === 0 || NON_HOST_CHARS.test(host2)) return null;
  let parts = stripRootDot(host2).split(".");
  if (parts.length > 4) return null;
  let values = [];
  for (let part of parts) {
    if (part === "") return null;
    let value = parsePart(part);
    if (value === null) return null;
    values.push(value);
  }
  let address = packParts(values);
  return address === null ? null : toDottedQuad(address);
};

// src/hooks/network/ipv6.ts
var hextet = /^[0-9a-fA-F]{1,4}$/, ipv4Octet = /^(0|[1-9]\d{0,2})$/, parseIPv4Tail = (text3) => {
  let octets = text3.split(".");
  if (octets.length !== 4) return null;
  let value = 0;
  for (let octet of octets) {
    if (!ipv4Octet.test(octet)) return null;
    let part = Number.parseInt(octet, 10);
    if (part > 255) return null;
    value = value * 256 + part;
  }
  return value >>> 0;
}, parseGroups = (text3) => {
  if (text3 === "") return [];
  let groups = [];
  for (let group of text3.split(":")) {
    if (!hextet.test(group)) return null;
    groups.push(Number.parseInt(group, 16));
  }
  return groups;
}, stripBrackets = (host2) => {
  let open = host2.startsWith("["), close = host2.endsWith("]");
  return open && close ? host2.slice(1, -1) : open || close ? null : host2;
}, normalizeIPv6 = (host2) => {
  let unbracketed = stripBrackets(host2);
  if (unbracketed === null) return null;
  let zoneIndex = unbracketed.indexOf("%"), body = zoneIndex === -1 ? unbracketed : unbracketed.slice(0, zoneIndex);
  if (body.split("::").length > 2) return null;
  let lastColon = body.lastIndexOf(":"), lastGroup = lastColon === -1 ? body : body.slice(lastColon + 1), hasIPv4Tail = lastGroup.includes("."), tailHextets = [], scanned = body;
  if (hasIPv4Tail) {
    let ipv4 = parseIPv4Tail(lastGroup);
    if (ipv4 === null) return null;
    tailHextets = [ipv4 >>> 16 & 65535, ipv4 & 65535], scanned = body.slice(0, lastColon);
  }
  let [head, tail, extra] = scanned.split("::");
  if (extra !== void 0) return null;
  if (tail === void 0) {
    let groups = parseGroups(head);
    if (groups === null) return null;
    let all2 = [...groups, ...tailHextets];
    return all2.length === 8 ? all2 : null;
  }
  let headGroups = parseGroups(head), tailGroups = parseGroups(tail);
  if (headGroups === null || tailGroups === null) return null;
  let present = headGroups.length + tailGroups.length + tailHextets.length;
  if (present > 7) return null;
  let fill = new Array(8 - present).fill(0);
  return [...headGroups, ...fill, ...tailGroups, ...tailHextets];
};

// src/hooks/network/classify.ts
var LOOPBACK_NAMES = /* @__PURE__ */ new Set([
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback"
]), dottedToAddress = (dotted) => packOctets(dotted.split(".").map((octet) => Number.parseInt(octet, 10))), range = (network, prefix, addressClass) => ({
  network: dottedToAddress(network),
  prefix,
  class: addressClass
}), IPV4_RANGES_BY_PRECEDENCE = [
  range("169.254.169.254", 32, "metadata"),
  range("0.0.0.0", 8, "unspecified"),
  range("127.0.0.0", 8, "loopback"),
  range("169.254.0.0", 16, "link-local"),
  range("10.0.0.0", 8, "private"),
  range("100.64.0.0", 10, "private"),
  range("172.16.0.0", 12, "private"),
  range("192.168.0.0", 16, "private")
], contains = (address, { network, prefix }) => {
  let mask = prefix === 0 ? 0 : 4294967295 << 32 - prefix >>> 0;
  return (address & mask) >>> 0 === network;
}, classifyIPv4 = (dotted) => {
  let octets = dotted.split(".").map((octet) => Number.parseInt(octet, 10));
  if (octets.some((octet) => octet > 255)) return "invalid";
  let address = packOctets(octets);
  return IPV4_RANGES_BY_PRECEDENCE.find(
    (candidate) => contains(address, candidate)
  )?.class ?? "public";
}, MAPPED_PREFIX = [0, 0, 0, 0, 0, 65535], COMPATIBLE_PREFIX = [0, 0, 0, 0, 0, 0], NAT64_PREFIX = [100, 65435, 0, 0, 0, 0], SIXTOFOUR_TAG = 8194, matchesPrefix = (hextets, prefix) => prefix.every((value, index2) => hextets[index2] === value), hextetPairToIPv4 = (high, low) => packOctets([
  high >>> 8 & 255,
  high & 255,
  low >>> 8 & 255,
  low & 255
]), embeddedIPv4 = (hextets) => {
  let trailing = hextetPairToIPv4(hextets[6], hextets[7]);
  return matchesPrefix(hextets, MAPPED_PREFIX) || matchesPrefix(hextets, COMPATIBLE_PREFIX) && trailing > 65535 || matchesPrefix(hextets, NAT64_PREFIX) ? trailing : hextets[0] === SIXTOFOUR_TAG ? hextetPairToIPv4(hextets[1], hextets[2]) : null;
}, isUnspecified = (hextets) => hextets.every((value) => value === 0), isLoopback = (hextets) => hextets.slice(0, 7).every((value) => value === 0) && hextets[7] === 1, isLinkLocal = (hextets) => (hextets[0] & 65472) === 65152, isUniqueLocal = (hextets) => (hextets[0] & 65024) === 64512, classifyIPv6 = (host2) => {
  let hextets = normalizeIPv6(host2);
  if (hextets === null) return "invalid";
  let embedded = embeddedIPv4(hextets);
  return embedded !== null ? classifyIPv4(toDottedQuad(embedded)) : isUnspecified(hextets) ? "unspecified" : isLoopback(hextets) ? "loopback" : isLinkLocal(hextets) ? "link-local" : isUniqueLocal(hextets) ? "private" : "public";
}, isPinnedLoopback = (name) => LOOPBACK_NAMES.has(name) || name.endsWith(".localhost"), classifyAddress = (host2) => {
  let name = stripRootDot(host2.toLowerCase());
  if (isPinnedLoopback(name)) return "loopback";
  if (host2.includes(":")) return classifyIPv6(host2);
  if (DOTTED_QUAD.test(host2)) return classifyIPv4(host2);
  let dotted = canonicalizeIPv4(host2);
  return dotted === null ? "public" : classifyIPv4(dotted);
};

// src/hooks/network/extract.ts
var SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/, AUTHORITY_END = /[/?#]/, tryParse = (source) => {
  try {
    return new URL(source);
  } catch {
    return null;
  }
}, sourceOf = (input) => SCHEME.test(input) ? input : `http://${input}`, authorityOf = (source) => {
  let afterScheme = source.replace(SCHEME, "").replace(/^\/+/, ""), end = afterScheme.search(AUTHORITY_END);
  return end === -1 ? afterScheme : afterScheme.slice(0, end);
}, stripPort = (candidate) => {
  if (candidate.startsWith("[")) {
    let close = candidate.indexOf("]");
    return close === -1 ? candidate : candidate.slice(0, close + 1);
  }
  return candidate.replace(/:\d{1,5}$/, "");
}, hostBeforeUserinfo = (authority) => stripPort(authority.split("@")[0]).toLowerCase(), hostAfterUserinfo = (authority) => {
  let atIndex = authority.lastIndexOf("@");
  return atIndex === -1 ? "" : stripPort(authority.slice(atIndex + 1)).toLowerCase();
}, extractHosts = (input) => {
  let source = sourceOf(input), parsed = tryParse(source);
  if (parsed === null || parsed.hostname === "") return null;
  let authority = authorityOf(source);
  return {
    whatwgHost: parsed.hostname,
    naiveHosts: [hostBeforeUserinfo(authority), hostAfterUserinfo(authority)]
  };
};

// src/hooks/network/network.ts
var INTERNAL = /* @__PURE__ */ new Set([
  "metadata",
  "unspecified",
  "loopback",
  "link-local",
  "private"
]), canonicalHost = (host2) => {
  try {
    return new URL(`http://${host2}/`).hostname.toLowerCase();
  } catch {
    return null;
  }
}, isPlausibleHost = (host2) => host2.includes(".") || host2.includes(":"), divergesFrom = (naiveHost, connectHost) => {
  if (naiveHost === "" || !isPlausibleHost(naiveHost)) return !1;
  let naiveCanonical = canonicalHost(naiveHost);
  return naiveCanonical === null ? !1 : naiveCanonical !== connectHost;
}, diverges = (naiveHosts, connectHost) => naiveHosts.some((naiveHost) => divergesFrom(naiveHost, connectHost)), check2 = (destination) => {
  let hosts = extractHosts(destination);
  return hosts === null ? "invalid url" : INTERNAL.has(classifyAddress(hosts.whatwgHost)) ? "private-target" : diverges(hosts.naiveHosts, hosts.whatwgHost) ? "parser-divergent" : "safe";
};

// src/hooks/network/cli.ts
var UNSAFE2 = /* @__PURE__ */ new Set([
  "private-target",
  "parser-divergent"
]), OPTIONS8 = {
  url: { type: "string", short: "u", multiple: !0 }
}, parseArgs3 = (args2) => {
  let { values } = parseNodeArgs8({ args: args2, options: OPTIONS8, strict: !0 }), urls = values.url ?? [];
  if (urls.length === 0)
    throw new Error("the network hook needs at least one -u <url-or-host>");
  return { urls };
}, run8 = (args2) => {
  let { urls } = parseArgs3(args2), verdicts = urls.map((url) => check2(url));
  return {
    output: verdicts.join(`
`) + `
`,
    hasFinding: verdicts.some((verdict) => UNSAFE2.has(verdict))
  };
};

// src/hooks/regex/cli.ts
import { cwd as cwd7 } from "node:process";
import { parseArgs as parseNodeArgs9 } from "node:util";

// src/hooks/regex/format.ts
var EMPTY6 = `no unsafe patterns found
`, UNSAFE_HEADER = "Vulnerable regular expressions found:", UNDETERMINED_HEADER = "Regular expressions the analysis could not settle (review manually):", DYNAMIC_HEADER = "Dynamically built regular expressions (review manually by simulating a constructed regex):", STATIC_WRAP_HEADER = "Static regex wrapped in a constructor (use a literal instead):", findingLine = ({
  source,
  flags,
  reason,
  scope
}) => {
  let details2 = [
    reason,
    ...scope === null ? [] : [scope],
    ...flags === "" ? [] : [`flags: ${flags}`]
  ];
  return `${source} (${details2.join(", ")})`;
}, findingSection = (header2, findings) => groupedSection(
  header2,
  findings.map((finding) => ({
    file: finding.file,
    detail: findingLine(finding)
  }))
), fileSection = (header2, files) => `${header2}

${files.join(`
`)}`, format = ({
  unsafe,
  undetermined,
  dynamic,
  staticWrap
}) => {
  let sections = [];
  return unsafe.length > 0 && sections.push(findingSection(UNSAFE_HEADER, unsafe)), undetermined.length > 0 && sections.push(findingSection(UNDETERMINED_HEADER, undetermined)), dynamic.length > 0 && sections.push(fileSection(DYNAMIC_HEADER, dynamic)), staticWrap.length > 0 && sections.push(fileSection(STATIC_WRAP_HEADER, staticWrap)), sections.length === 0 ? EMPTY6 : `${sections.join(`

`)}
`;
};

// src/core/dynamic-regex.ts
var compilePattern = (source, flags) => new RegExp(source, flags), propertyRun = (expression) => new RegExp(`\\p{${expression}}+`, "gu");

// src/hooks/regex/budget.ts
var CAP_REACHED = new Error("the analysis reached its work cap"), reachCap = () => {
  throw CAP_REACHED;
}, isCapReached = (error) => error === CAP_REACHED, createMeter = (cap) => ({ cap, spent: 0 }), spend = (meter, steps) => {
  meter.spent += steps, meter.spent > meter.cap && reachCap();
};

// src/hooks/regex/automaton/graph.ts
var toDigraph = (size, sources, targets, labels) => {
  let offsets = new Int32Array(size + 1);
  for (let edge = 0; edge < sources.length; edge += 1)
    offsets[sources[edge] + 1] += 1;
  for (let node2 = 0; node2 < size; node2 += 1) offsets[node2 + 1] += offsets[node2];
  let cursor = offsets.slice(0, size), packedTargets = new Int32Array(sources.length), packedLabels = new Int32Array(sources.length);
  for (let edge = 0; edge < sources.length; edge += 1) {
    let slot = cursor[sources[edge]];
    packedTargets[slot] = targets[edge], packedLabels[slot] = labels[edge], cursor[sources[edge]] += 1;
  }
  return { size, offsets, targets: packedTargets, labels: packedLabels };
}, stronglyConnected = (graph, listed = !0) => {
  let { size, offsets, targets } = graph, order = new Int32Array(size).fill(-1), low = new Int32Array(size), onStack = new Uint8Array(size), component = new Int32Array(size).fill(-1), members = [], stack = new Int32Array(size), callNodes = new Int32Array(size), callEdges = new Int32Array(size), stackTop = 0, callTop = 0, counter = 0, count = 0, open = (node2) => {
    order[node2] = counter, low[node2] = counter, counter += 1, stack[stackTop] = node2, stackTop += 1, onStack[node2] = 1, callNodes[callTop] = node2, callEdges[callTop] = offsets[node2], callTop += 1;
  };
  for (let root = 0; root < size; root += 1)
    if (order[root] === -1)
      for (open(root); callTop > 0; ) {
        let node2 = callNodes[callTop - 1], edge = callEdges[callTop - 1];
        if (edge < offsets[node2 + 1]) {
          let next = targets[edge];
          callEdges[callTop - 1] = edge + 1, order[next] === -1 ? open(next) : onStack[next] && (low[node2] = Math.min(low[node2], order[next]));
          continue;
        }
        if (callTop -= 1, callTop > 0) {
          let parent = callNodes[callTop - 1];
          low[parent] = Math.min(low[parent], low[node2]);
        }
        if (low[node2] === order[node2]) {
          for (listed && members.push([]); ; ) {
            stackTop -= 1;
            let member = stack[stackTop];
            if (onStack[member] = 0, component[member] = count, listed && members[count].push(member), member === node2) break;
          }
          count += 1;
        }
      }
  return { component, members };
}, hasSelfLoop = (graph, node2) => {
  for (let edge = graph.offsets[node2]; edge < graph.offsets[node2 + 1]; edge += 1)
    if (graph.targets[edge] === node2) return !0;
  return !1;
}, reach2 = (size, seeds, neighbors) => {
  let seen = new Uint8Array(size), queue = [];
  for (let seed of seeds)
    seen[seed] || (seen[seed] = 1, queue.push(seed));
  let visit = (next) => {
    seen[next] || (seen[next] = 1, queue.push(next));
  };
  for (let head = 0; head < queue.length; head += 1)
    neighbors(queue[head], visit);
  return seen;
}, reverseDigraph = (graph) => {
  let sources = [], targets = [], labels = [];
  for (let node2 = 0; node2 < graph.size; node2 += 1)
    for (let edge = graph.offsets[node2]; edge < graph.offsets[node2 + 1]; edge += 1)
      sources.push(graph.targets[edge]), targets.push(node2), labels.push(graph.labels[edge]);
  return toDigraph(graph.size, sources, targets, labels);
}, isCyclic = (graph, group) => group.length > 1 || hasSelfLoop(graph, group[0]), cyclicStates = (graph, { members }) => {
  let cyclic = new Uint8Array(graph.size);
  for (let group of members)
    if (isCyclic(graph, group)) for (let member of group) cyclic[member] = 1;
  return cyclic;
}, ancestorsOf = (graph, marked) => {
  let reversed = reverseDigraph(graph), seeds = [...marked.keys()].filter((node2) => marked[node2] === 1);
  return reach2(graph.size, seeds, (node2, visit) => {
    for (let edge = reversed.offsets[node2]; edge < reversed.offsets[node2 + 1]; edge += 1)
      visit(reversed.targets[edge]);
  });
}, componentLinks = (graph, { component, members }) => {
  let count = members.length, forward = Array.from({ length: count }, () => []), backward = Array.from({ length: count }, () => []), stamps = new Int32Array(count).fill(-1), { offsets, targets } = graph;
  return members.forEach((group, from) => {
    for (let node2 of group)
      for (let edge = offsets[node2]; edge < offsets[node2 + 1]; edge += 1) {
        let to = component[targets[edge]];
        to === from || stamps[to] === from || (stamps[to] = from, forward[from].push(to), backward[to].push(from));
      }
  }), { forward, backward };
};

// src/hooks/regex/automaton/buffers.ts
var grownInt32 = (array, size, fill = 0) => {
  if (size <= array.length) return array;
  let grown = new Int32Array(Math.max(size, array.length * 2));
  return grown.set(array), fill !== 0 && grown.fill(fill, array.length), grown;
}, grownFloat64 = (array, size) => {
  if (size <= array.length) return array;
  let grown = new Float64Array(Math.max(size, array.length * 2));
  return grown.set(array), grown;
}, grownUint8 = (array, size) => {
  if (size <= array.length) return array;
  let grown = new Uint8Array(Math.max(size, array.length * 2));
  return grown.set(array), grown;
};

// src/hooks/regex/automaton/intern.ts
var UINT32_SPAN = 2 ** 32, createRunTable = () => ({
  count: 0,
  klasses: new Int32Array(64),
  hashes: new Int32Array(64),
  runs: [],
  slots: new Int32Array(128)
}), hashRuns = (klass, runs, length) => {
  let hash = Math.imul(klass ^ 625341585, 2654435761) ^ length;
  for (let index2 = 0; index2 < length; index2 += 1)
    hash = Math.imul(hash ^ runs[index2], 2246822507), hash ^= hash >>> 13;
  return hash;
}, sameRuns = (stored, runs, length) => {
  if (stored.length !== length) return !1;
  for (let index2 = 0; index2 < length; index2 += 1)
    if (stored[index2] !== runs[index2]) return !1;
  return !0;
}, findRuns = (table, klass, runs, length, hash) => {
  let mask = table.slots.length - 1;
  for (let slot = hash & mask; ; slot = slot + 1 & mask) {
    let entry2 = table.slots[slot];
    if (entry2 === 0) return -1;
    let id = entry2 - 1;
    if (table.hashes[id] === hash && table.klasses[id] === klass && sameRuns(table.runs[id], runs, length))
      return id;
  }
}, placeSlot = (slots, hash, id) => {
  let mask = slots.length - 1, slot = hash & mask;
  for (; slots[slot] !== 0; ) slot = slot + 1 & mask;
  slots[slot] = id + 1;
}, addRuns = (table, klass, runs, length, hash) => {
  let id = table.count;
  if (table.klasses = grownInt32(table.klasses, id + 1), table.hashes = grownInt32(table.hashes, id + 1), table.klasses[id] = klass, table.hashes[id] = hash, table.runs.push(runs.slice(0, length)), table.count = id + 1, table.count * 2 <= table.slots.length)
    return placeSlot(table.slots, hash, id), id;
  table.slots = new Int32Array(table.slots.length * 2);
  for (let known = 0; known < table.count; known += 1)
    placeSlot(table.slots, table.hashes[known], known);
  return id;
}, createKeyIndex = () => ({
  count: 0,
  keys: new Float64Array(256),
  slots: new Float64Array(1024)
}), keyHash = (key) => Math.imul(
  key >>> 0 ^ Math.imul(key / UINT32_SPAN >>> 0, 2654435761),
  2246822507
), slotOf = (slots, key) => {
  let mask = (slots.length >> 1) - 1, slot = keyHash(key) & mask;
  for (; slots[slot * 2 + 1] !== 0 && slots[slot * 2] !== key; )
    slot = slot + 1 & mask;
  return slot;
}, growKeys = (index2) => {
  let keys = new Float64Array(index2.keys.length * 2), slots = new Float64Array(index2.slots.length * 2);
  keys.set(index2.keys);
  for (let entry2 = 0; entry2 < index2.count; entry2 += 1) {
    let slot = slotOf(slots, keys[entry2]);
    slots[slot * 2] = keys[entry2], slots[slot * 2 + 1] = entry2 + 1;
  }
  index2.keys = keys, index2.slots = slots;
}, keyOf = (index2, key) => index2.slots[slotOf(index2.slots, key) * 2 + 1] - 1, internKey = (index2, key) => {
  let slot = slotOf(index2.slots, key);
  if (index2.slots[slot * 2 + 1] !== 0) return index2.slots[slot * 2 + 1] - 1;
  index2.count === index2.keys.length && (growKeys(index2), slot = slotOf(index2.slots, key));
  let entry2 = index2.count;
  return index2.keys[entry2] = key, index2.count = entry2 + 1, index2.slots[slot * 2] = key, index2.slots[slot * 2 + 1] = entry2 + 1, entry2;
};

// src/hooks/regex/automaton/kinds.ts
var KINDS2 = Array.from(
  { length: 5 },
  (_, kind) => kind
), ALL_KINDS = 31, maskOf = (kind) => 1 << kind, isLineTest = (test) => test === "begin" || test === "end", wordMask = (unicodeWord) => maskOf(2) | (unicodeWord ? maskOf(3) : 0), allowedAfter = (test, multiline, unicodeWord, previous2) => {
  if (test === "begin")
    return previous2 === 0 || multiline && previous2 === 1 ? ALL_KINDS : 0;
  if (test === "end") return maskOf(0) | (multiline ? maskOf(1) : 0);
  let words = wordMask(unicodeWord), afterWord = (words & maskOf(previous2)) !== 0, sameSide = afterWord ? words : ALL_KINDS & ~words, otherSide = afterWord ? ALL_KINDS & ~words : words;
  return test === "word" ? otherSide : sameSide;
};

// src/hooks/regex/automaton/lookahead.ts
var NO_GATES = [], STAMP_LIMIT = 2 ** 30, forwardEdges = (ordered, alphabet, state, visit) => {
  let sink = ordered.states.length;
  if (state === sink) {
    alphabet.pieceKinds.forEach((_, piece) => visit(piece, sink, NO_GATES));
    return;
  }
  let { context, events, exits } = ordered.states[state];
  for (let [piece, list3] of events)
    for (let event of list3)
      event.type === "move" && event.certain && event.context === context && visit(piece, event.target, event.gates);
  for (let exit2 of exits)
    alphabet.pieceKinds.forEach((kind, piece) => {
      (exit2.kinds & maskOf(kind)) !== 0 && visit(piece, sink, exit2.gates);
    });
}, depthOf = (gates) => gates.reduce((deepest, gate) => Math.max(deepest, gate.depth), 0), holds = (gates, accepting) => {
  for (let gate of gates)
    if (accepting.has(gate.state) === gate.negative) return !1;
  return !0;
}, reverseEdges = (ordered, alphabet, included) => {
  let plain = alphabet.pieceKinds.map(() => /* @__PURE__ */ new Map()), gated = alphabet.pieceKinds.map(() => []);
  for (let state = 0; state < included.length; state += 1)
    included[state] && forwardEdges(ordered, alphabet, state, (piece, target, gates) => {
      if (gates.length > 0) {
        gated[piece].push({
          source: state,
          target,
          gates,
          depth: depthOf(gates)
        });
        return;
      }
      let sources = plain[piece].get(target);
      sources ? sources.push(state) : plain[piece].set(target, [state]);
    });
  return {
    plain,
    gated: gated.map(
      (edges) => edges.toSorted((left, right) => left.depth - right.depth)
    )
  };
}, createBackScratch = (size) => ({
  marks: new Int32Array(size),
  seen: new Int32Array(size),
  generation: 0
}), reserveStamps = (scratch) => (scratch.generation >= STAMP_LIMIT && (scratch.marks.fill(0), scratch.seen.fill(0), scratch.generation = 0), scratch.generation += 2, scratch.generation), holdsIn = (gates, seen, stamp) => {
  for (let gate of gates)
    if (seen[gate.state] === stamp === gate.negative) return !1;
  return !0;
}, stepBack = (states, plain, gated, scratch) => {
  let stamp = reserveStamps(scratch), current = stamp - 1, found = [];
  for (let state of states) scratch.marks[state] = current;
  for (let state of states)
    for (let source of plain.get(state) ?? [])
      scratch.seen[source] !== stamp && (scratch.seen[source] = stamp, found.push(source));
  for (let { source, target, gates } of gated)
    scratch.marks[target] !== current || scratch.seen[source] === stamp || holdsIn(gates, scratch.seen, stamp) && (scratch.seen[source] = stamp, found.push(source));
  return found.sort((left, right) => left - right);
}, acceptingAtEnd = (ordered, included) => {
  let boundary = maskOf(0), sink = ordered.states.length, plain = /* @__PURE__ */ new Set([sink]);
  ordered.states.forEach((state, id) => {
    if (included[id])
      for (let exit2 of state.exits)
        (exit2.kinds & boundary) !== 0 && exit2.gates.length === 0 && plain.add(id);
  });
  let gatedExits = ordered.states.flatMap(
    (state, id) => included[id] ? state.exits.filter(
      (exit2) => (exit2.kinds & boundary) !== 0 && exit2.gates.length > 0
    ).map((exit2) => ({
      id,
      gates: exit2.gates,
      depth: depthOf(exit2.gates)
    })) : []
  ).toSorted((left, right) => left.depth - right.depth);
  for (let { id, gates } of gatedExits)
    holds(gates, plain) && plain.add(id);
  return [...plain].toSorted((left, right) => left - right);
}, minimize = (outputs, next, pieces, meter) => {
  let firstIds = /* @__PURE__ */ new Map(), classOf = new Int32Array(outputs.length);
  outputs.forEach((output, state) => {
    let known = firstIds.get(output);
    classOf[state] = known ?? firstIds.size, known === void 0 && firstIds.set(output, firstIds.size);
  });
  let count = firstIds.size, signature = [];
  for (; ; ) {
    let ids = createRunTable(), refined = new Int32Array(outputs.length);
    spend(meter, outputs.length * pieces);
    for (let state = 0; state < outputs.length; state += 1) {
      signature[0] = classOf[state];
      for (let piece = 0; piece < pieces; piece += 1)
        signature[piece + 1] = classOf[next[state * pieces + piece]];
      let hash = hashRuns(0, signature, pieces + 1), known = findRuns(ids, 0, signature, pieces + 1, hash);
      refined[state] = known === -1 ? addRuns(ids, 0, signature, pieces + 1, hash) : known;
    }
    if (ids.count === count) return classOf;
    classOf = refined, count = ids.count;
  }
}, readerOf = (ordered, alphabet, relevant) => {
  let sink = ordered.states.length, included = reach2(
    sink + 1,
    [...relevant, sink],
    (state, visit) => forwardEdges(ordered, alphabet, state, (_, target, gates) => {
      visit(target);
      for (let gate of gates) visit(gate.state);
    })
  );
  return {
    ...reverseEdges(ordered, alphabet, included),
    start: acceptingAtEnd(ordered, included)
  };
}, lookaheadAlong = (ordered, { plain, gated, start }, input, meter) => {
  let scratch = createBackScratch(ordered.states.length + 1), accepting = [start];
  for (let index2 = input.length - 1; index2 >= 0; index2 -= 1) {
    let current = accepting[accepting.length - 1];
    spend(meter, current.length + 1), accepting.push(
      stepBack(current, plain[input[index2]], gated[input[index2]], scratch)
    );
  }
  let members = accepting.toReversed().map((states) => new Set(states));
  return {
    blind: !1,
    classCount: members.length,
    pieces: plain.length,
    predecessors: [],
    members,
    back: new Int32Array(0)
  };
}, lookaheadFrom = ({ plain, gated, start }, ordered, alphabet, relevant, meter) => {
  let pieces = alphabet.pieceKinds.length, scratch = createBackScratch(ordered.states.length + 1), table = createRunTable(), dfaStates = table.runs, next = [];
  addRuns(table, 0, start, start.length, hashRuns(0, start, start.length));
  for (let head = 0; head < table.count; head += 1) {
    let current = dfaStates[head];
    for (let piece = 0; piece < pieces; piece += 1) {
      let target = stepBack(current, plain[piece], gated[piece], scratch), hash = hashRuns(0, target, target.length), known = findRuns(table, 0, target, target.length, hash);
      if (spend(meter, current.length + 1), known !== -1) {
        next.push(known);
        continue;
      }
      next.push(table.count), addRuns(table, 0, target, target.length, hash);
    }
  }
  let outputs = dfaStates.map(
    (states) => states.filter((state) => relevant.has(state)).join(",")
  ), classOf = minimize(outputs, next, pieces, meter), classCount = classOf.reduce((highest, klass) => Math.max(highest, klass), 0) + 1, representatives = new Int32Array(classCount).fill(-1);
  classOf.forEach((klass, state) => {
    representatives[klass] === -1 && (representatives[klass] = state);
  });
  let predecessors = Array.from(
    { length: classCount * pieces },
    () => []
  ), members = Array.from(
    representatives,
    (state) => new Set(dfaStates[state].filter((member) => relevant.has(member)))
  ), back = new Int32Array(classCount * pieces);
  return representatives.forEach((state, klass) => {
    for (let piece = 0; piece < pieces; piece += 1) {
      let prior = classOf[next[state * pieces + piece]];
      back[klass * pieces + piece] = prior, predecessors[prior * pieces + piece].push(klass);
    }
  }), { blind: !1, classCount, pieces, predecessors, members, back };
}, sureLookahead = (pieces, sure) => ({
  blind: !0,
  classCount: 1,
  pieces,
  predecessors: Array.from({ length: pieces }, () => [0]),
  members: [sure],
  back: new Int32Array(pieces)
}), acceptsIn = (lookahead, state, klass) => lookahead.members[klass].has(state), gatesMayHold = (lookahead, gates, klass) => lookahead.blind || holds(gates, lookahead.members[klass]), gatesSurelyHold = (lookahead, gates, klass) => gates.length === 0 || !lookahead.blind && holds(gates, lookahead.members[klass]), runsInOrder = (event, lookahead, current, next, blocked) => event.type === "stop" ? (gatesSurelyHold(lookahead, event.gates, current) && blocked.push(event.context), !1) : blocked.includes(event.context) || !gatesMayHold(lookahead, event.gates, current) ? !1 : (event.certain && acceptsIn(lookahead, event.target, next) && gatesSurelyHold(lookahead, event.gates, current) && blocked.push(event.context), !0), predecessorsOf = (lookahead, klass, piece) => lookahead.predecessors[klass * lookahead.pieces + piece];

// src/hooks/regex/syntax/tree.ts
var EMPTY_NODE = { kind: "empty" }, reversedCache = /* @__PURE__ */ new WeakMap(), charNode = (set) => ({ kind: "char", set }), alternationOf = (branches) => branches.length === 1 ? branches[0] : { kind: "alternation", branches }, reverseFresh = (node2) => {
  switch (node2.kind) {
    case "sequence":
      return { ...node2, items: node2.items.map(reverseNode).toReversed() };
    case "alternation":
      return { ...node2, branches: node2.branches.map(reverseNode) };
    case "repeat":
    case "look":
    case "uncertain":
      return { ...node2, body: reverseNode(node2.body) };
    case "assertion":
      return node2.test === "begin" ? { ...node2, test: "end" } : node2.test === "end" ? { ...node2, test: "begin" } : node2;
    default:
      return node2;
  }
}, reverseNode = (node2) => {
  let cached = reversedCache.get(node2);
  if (cached) return cached;
  let reversed = reverseFresh(node2);
  return reversedCache.set(node2, reversed), reversed;
}, canMatchEmpty = (node2) => {
  switch (node2.kind) {
    case "char":
      return !1;
    case "sequence":
      return node2.items.every(canMatchEmpty);
    case "alternation":
      return node2.branches.some(canMatchEmpty);
    case "repeat":
      return node2.min === 0 || canMatchEmpty(node2.body);
    case "uncertain":
      return canMatchEmpty(node2.body);
    default:
      return !0;
  }
}, someNode = (node2, predicate) => {
  if (predicate(node2)) return !0;
  switch (node2.kind) {
    case "sequence":
      return node2.items.some((item) => someNode(item, predicate));
    case "alternation":
      return node2.branches.some((branch) => someNode(branch, predicate));
    case "repeat":
    case "look":
    case "uncertain":
      return someNode(node2.body, predicate);
    default:
      return !1;
  }
}, repeatsUnbounded = (node2, captures, visiting = []) => someNode(node2, (inner) => inner.kind === "repeat" ? inner.max === 1 / 0 : inner.kind !== "backreference" ? !1 : inner.captures.some(
  (index2) => visiting.includes(index2) || repeatsUnbounded(captures.get(index2) ?? EMPTY_NODE, captures, [
    ...visiting,
    index2
  ])
));

// src/hooks/regex/syntax/codeset.ts
var EMPTY_SET = [];
var toggle = (boundaries, point3) => {
  boundaries.at(-1) === point3 ? boundaries.pop() : boundaries.push(point3);
}, combine = (left, right, keep2) => {
  let boundaries = [], leftIndex = 0, rightIndex = 0, inLeft = !1, inRight = !1;
  for (; leftIndex < left.length || rightIndex < right.length; ) {
    let point3 = Math.min(
      left[leftIndex] ?? 1 / 0,
      right[rightIndex] ?? 1 / 0
    );
    left[leftIndex] === point3 && (inLeft = !inLeft, leftIndex += 1), right[rightIndex] === point3 && (inRight = !inRight, rightIndex += 1), keep2(inLeft, inRight) !== (boundaries.length % 2 === 1) && toggle(boundaries, point3);
  }
  return boundaries;
}, rangeSet = (start, end) => start < end ? [start, end] : EMPTY_SET, pointSet = (point3) => [point3, point3 + 1], union = (left, right) => combine(left, right, (inLeft, inRight) => inLeft || inRight), intersect = (left, right) => combine(left, right, (inLeft, inRight) => inLeft && inRight), subtract = (left, right) => combine(left, right, (inLeft, inRight) => inLeft && !inRight), complement = (set, limit) => subtract(rangeSet(0, limit), set), fromPoints = (points) => {
  let sorted = [...new Set(points)].toSorted((left, right) => left - right), boundaries = [];
  for (let point3 of sorted)
    toggle(boundaries, point3), boundaries.push(point3 + 1);
  return boundaries;
}, fromRanges = (ranges) => ranges.map(([start, end]) => rangeSet(start, end)).reduce(union, EMPTY_SET), isEmptySet = (set) => set.length === 0, overlaps = (left, right) => !isEmptySet(intersect(left, right)), setKey = (set) => set.join(","), expandPoints = (set) => {
  let points = [];
  for (let index2 = 0; index2 < set.length; index2 += 2)
    for (let point3 = set[index2]; point3 < set[index2 + 1]; point3 += 1)
      points.push(point3);
  return points;
}, lowerBound = (sorted, value) => {
  let low = 0, high = sorted.length;
  for (; low < high; ) {
    let middle = low + high >> 1;
    sorted[middle] < value ? low = middle + 1 : high = middle;
  }
  return low;
}, pointsWithin = (set, sortedPoints) => {
  let found = [];
  for (let index2 = 0; index2 < set.length; index2 += 2)
    for (let position2 = lowerBound(sortedPoints, set[index2]); position2 < sortedPoints.length && sortedPoints[position2] < set[index2 + 1]; position2 += 1)
      found.push(sortedPoints[position2]);
  return found;
};

// src/hooks/regex/syntax/unicode.ts
var CHUNK = 4096, UNICODE_SEGMENTS = [
  [0, 55296, 1],
  [55296, 56320, 1],
  [56320, 57344, 1],
  [57344, 65536, 1],
  [65536, 1114112, 2]
], FOLDING_PAIRS = [
  [8147, 912],
  [8163, 944],
  [64261, 64262]
], LINE_TERMINATORS = fromRanges([
  [10, 11],
  [13, 14],
  [8232, 8234]
]), DIGITS = rangeSet(48, 58), BASIC_WORD = fromRanges([
  [48, 58],
  [65, 91],
  [95, 96],
  [97, 123]
]), CASE_CHANGING_RUN = /[\p{Changes_When_Casemapped}\p{Changes_When_Casefolded}]+/gu, SPACE_RUN = /\s+/gu, CASELESS_WORD_RUN = /\w+/giu, EMOJI_RUN = /[\p{Emoji}\p{Emoji_Component}\p{Extended_Pictographic}]+/gu, EMOJI_COMPONENT_RUN = /[\p{Emoji}\p{Emoji_Component}\p{Extended_Pictographic}\u200d\ufe0f\u20e3\u{e0020}-\u{e007f}]+/gu, CASELESS_REPEAT = /^(.)\1$/isu, STRING_PROPERTY_MATCHERS = /* @__PURE__ */ new Map([
  ["Basic_Emoji", new RegExp("^\\p{Basic_Emoji}$", "v")],
  ["Emoji_Keycap_Sequence", new RegExp("^\\p{Emoji_Keycap_Sequence}$", "v")],
  ["RGI_Emoji_Modifier_Sequence", new RegExp("^\\p{RGI_Emoji_Modifier_Sequence}$", "v")],
  ["RGI_Emoji_Flag_Sequence", new RegExp("^\\p{RGI_Emoji_Flag_Sequence}$", "v")],
  ["RGI_Emoji_Tag_Sequence", new RegExp("^\\p{RGI_Emoji_Tag_Sequence}$", "v")],
  ["RGI_Emoji_ZWJ_Sequence", new RegExp("^\\p{RGI_Emoji_ZWJ_Sequence}$", "v")],
  ["RGI_Emoji", new RegExp("^\\p{RGI_Emoji}$", "v")]
]), nativeCache = /* @__PURE__ */ new Map(), caseCache = /* @__PURE__ */ new Map(), segments = null, segmentText = (start, end) => {
  let parts = [], units = [];
  for (let chunk = start; chunk < end; chunk += CHUNK) {
    let last = Math.min(chunk + CHUNK, end);
    units.length = 0;
    for (let point3 = chunk; point3 < last; point3 += 1)
      point3 < 65536 ? units.push(point3) : units.push(
        55296 + (point3 - 65536 >> 10),
        56320 + (point3 - 65536 & 1023)
      );
    parts.push(String.fromCharCode.apply(null, units));
  }
  return parts.join("");
}, unicodeSegments = () => (segments ??= UNICODE_SEGMENTS.map(([start, end, width]) => ({
  start,
  width,
  text: segmentText(start, end)
})), segments), nativeSet = (matcher) => {
  let key = `${matcher.flags}/${matcher.source}`, cached = nativeCache.get(key);
  if (cached) return cached;
  let set = fromRanges(
    unicodeSegments().flatMap(
      ({ start, width, text: text3 }) => Array.from(text3.matchAll(matcher), (match) => [
        start + match.index / width,
        start + (match.index + match[0].length) / width
      ])
    )
  );
  return nativeCache.set(key, set), set;
}, legacyCanonical = (unit) => {
  let upper = String.fromCharCode(unit).toUpperCase();
  if (upper.length !== 1) return unit;
  let canonical = upper.charCodeAt(0);
  return unit >= 128 && canonical < 128 ? unit : canonical;
}, tableFromGroups = (groups) => {
  let classes = /* @__PURE__ */ new Map();
  for (let members of groups.values()) {
    if (members.length < 2) continue;
    let sorted = members.toSorted((left, right) => left - right);
    for (let member of sorted) classes.set(member, sorted);
  }
  return {
    points: [...classes.keys()].toSorted((left, right) => left - right),
    classes
  };
}, legacyTable = () => {
  let groups = /* @__PURE__ */ new Map();
  for (let unit = 0; unit < 65536; unit += 1) {
    let canonical = legacyCanonical(unit), members = groups.get(canonical) ?? [];
    members.push(unit), groups.set(canonical, members);
  }
  return tableFromGroups(groups);
}, findRoot = (parents, point3) => {
  let root = point3;
  for (; (parents.get(root) ?? root) !== root; ) root = parents.get(root) ?? root;
  return parents.set(point3, root), root;
}, singlePoint = (text3) => {
  let point3 = text3.codePointAt(0);
  return point3 !== void 0 && String.fromCodePoint(point3) === text3 ? point3 : null;
}, foldsTogether = (left, right) => CASELESS_REPEAT.test(String.fromCodePoint(left, right)), unicodeLinks = (point3) => {
  let text3 = String.fromCodePoint(point3);
  return [singlePoint(text3.toLowerCase()), singlePoint(text3.toUpperCase())].filter((other) => other !== null && other !== point3).filter((other) => foldsTogether(point3, other));
}, unicodeTable = () => {
  let parents = /* @__PURE__ */ new Map(), links = [
    ...expandPoints(nativeSet(CASE_CHANGING_RUN)).flatMap(
      (point3) => unicodeLinks(point3).map((other) => [point3, other])
    ),
    ...FOLDING_PAIRS.filter(([left, right]) => foldsTogether(left, right))
  ];
  for (let [left, right] of links)
    parents.set(findRoot(parents, left), findRoot(parents, right));
  let groups = /* @__PURE__ */ new Map();
  for (let point3 of parents.keys()) {
    let root = findRoot(parents, point3), members = groups.get(root) ?? [];
    members.push(point3), groups.set(root, members);
  }
  return tableFromGroups(groups);
}, caseTable = (unicode) => {
  let cached = caseCache.get(unicode);
  if (cached) return cached;
  let table = unicode ? unicodeTable() : legacyTable();
  return caseCache.set(unicode, table), table;
}, caseClosure = (set, unicode) => {
  let table = caseTable(unicode), extra = pointsWithin(set, table.points).flatMap(
    (point3) => table.classes.get(point3) ?? []
  );
  return extra.length === 0 ? set : union(set, fromPoints(extra));
}, caseRepresentative = (point3, unicode) => caseTable(unicode).classes.get(point3)?.[0] ?? point3, spaceSet = () => nativeSet(SPACE_RUN), wordSet = (ignoreCase, unicode) => ignoreCase && unicode ? nativeSet(CASELESS_WORD_RUN) : BASIC_WORD, propertySet = (expression) => nativeSet(propertyRun(expression)), stringPropertySingles = (expression) => {
  let matcher = STRING_PROPERTY_MATCHERS.get(expression);
  return matcher === void 0 ? null : fromPoints(
    expandPoints(nativeSet(EMOJI_RUN)).filter(
      (point3) => matcher.test(String.fromCodePoint(point3))
    )
  );
}, emojiComponents = () => nativeSet(EMOJI_COMPONENT_RUN), universeLimit = (unicode) => unicode ? 1114112 : 65536;

// src/hooks/regex/automaton/alphabet.ts
var kindSets = (automaton) => {
  let sets = [], uses = (kind) => (automaton.kinds & maskOf(kind)) !== 0;
  return uses(1) && sets.push([LINE_TERMINATORS, 1]), uses(3) && sets.push([subtract(wordSet(!0, !0), BASIC_WORD), 3]), uses(2) && sets.push([BASIC_WORD, 2]), sets;
}, partitionAlphabet = (automaton) => {
  let kinds = kindSets(automaton), sets = [...automaton.sets, ...kinds.map(([set]) => set)], boundaries = [
    .../* @__PURE__ */ new Set([0, automaton.universe[1], ...sets.flat()])
  ].toSorted((left, right) => left - right), members = Array.from(
    { length: boundaries.length - 1 },
    () => []
  );
  sets.forEach((set, index2) => {
    for (let range2 = 0; range2 < set.length; range2 += 2) {
      let last = lowerBound(boundaries, set[range2 + 1]);
      for (let segment = lowerBound(boundaries, set[range2]); segment < last; segment += 1)
        members[segment].push(index2);
    }
  });
  let pieceIds = createRunTable(), pieceSets = [], pieceKinds = [], setPieces = automaton.sets.map(() => []);
  members.forEach((owners, segment) => {
    let hash = hashRuns(0, owners, owners.length), known = findRuns(pieceIds, 0, owners, owners.length, hash), start = boundaries[segment], end = boundaries[segment + 1];
    if (known !== -1) {
      let set = pieceSets[known];
      set[set.length - 1] === start ? set[set.length - 1] = end : set.push(start, end);
      return;
    }
    let piece = pieceSets.length, kindOwner = owners.find((owner) => owner >= automaton.sets.length);
    addRuns(pieceIds, 0, owners, owners.length, hash), pieceSets.push([start, end]), pieceKinds.push(
      kindOwner === void 0 ? 4 : kinds[kindOwner - automaton.sets.length][1]
    );
    for (let owner of owners)
      owner < automaton.sets.length && setPieces[owner].push(piece);
  });
  let setKinds = setPieces.map(
    (pieces) => pieces.reduce((mask, piece) => mask | maskOf(pieceKinds[piece]), 0)
  );
  return { pieceSets, pieceKinds, setPieces, setKinds };
};

// src/hooks/regex/automaton/shape.ts
var isLineAssertion = (node2) => node2.kind === "assertion" && isLineTest(node2.test), lineAssertionInMiddle = (node2, isBegin, isEnd) => {
  switch (node2.kind) {
    case "alternation":
      return node2.branches.some(
        (branch) => lineAssertionInMiddle(branch, isBegin, isEnd)
      );
    case "sequence":
      return node2.items.some(
        (item, index2) => lineAssertionInMiddle(
          item,
          isBegin && index2 === 0,
          isEnd && index2 === node2.items.length - 1
        )
      );
    case "repeat":
    case "look":
    case "uncertain":
      return lineAssertionInMiddle(node2.body, !1, !1);
    case "assertion":
      return node2.test === "begin" ? !isBegin : node2.test === "end" ? !isEnd : !1;
    default:
      return !1;
  }
}, everyEdge = (node2, atStart, predicate) => {
  switch (node2.kind) {
    case "alternation":
      return node2.branches.every(
        (branch) => everyEdge(branch, atStart, predicate)
      );
    case "sequence":
      return node2.items.length > 0 && everyEdge(
        node2.items[atStart ? 0 : node2.items.length - 1],
        atStart,
        predicate
      );
    case "empty":
      return !1;
    default:
      return predicate(node2);
  }
}, strictLine = (test) => (node2) => node2.kind === "assertion" && node2.test === test && !node2.multiline, anyLine = (test) => (node2) => node2.kind === "assertion" && node2.test === test, notLine = (test) => (node2) => !(node2.kind === "assertion" && node2.test === test), anchoring = (root, sticky) => {
  let searches = !sticky && !everyEdge(root, !0, strictLine("begin")), trails = !everyEdge(root, !1, strictLine("end")), multilineAnchor = someNode(
    root,
    (node2) => isLineAssertion(node2) && node2.multiline
  ), anyAnchor = someNode(root, isLineAssertion), ragged = !everyEdge(root, !0, anyLine("begin")) && !everyEdge(root, !0, notLine("begin")) || !everyEdge(root, !1, anyLine("end")) && !everyEdge(root, !1, notLine("end")), keepsLines = sticky || multilineAnchor || anyAnchor && (lineAssertionInMiddle(root, !0, !0) || ragged);
  return { searches, trails, keepsLines };
}, SUBMATCH_SHAPE = {
  searches: !1,
  trails: !0,
  keepsLines: !0
}, shapeOf = (job) => job.scope === "submatch" ? SUBMATCH_SHAPE : job.scope === "search" ? anchoring(job.root, job.flags.sticky) : { ...anchoring(job.root, !1), searches: !1, trails: !1 };

// src/hooks/regex/automaton/epsilon.ts
var DEAD = { type: "dead" }, addState = (builder) => (builder.transitions.push(DEAD), spend(builder.meter, 1), builder.transitions.length - 1), link = (builder, state, transition) => {
  builder.transitions[state] = transition;
}, setId = (builder, set) => {
  let key = setKey(set), known = builder.setIds.get(key);
  return known !== void 0 ? known : (builder.sets.push(set), builder.setIds.set(key, builder.sets.length - 1), builder.sets.length - 1);
}, emptyFragment = (builder) => {
  let state = addState(builder);
  return [state, state];
}, consumeFragment = (builder, set, scope) => {
  let start = addState(builder), end = addState(builder);
  return link(builder, start, {
    type: "consume",
    set: setId(builder, set),
    target: end,
    context: scope.context,
    certain: scope.certain,
    prefix: !1
  }), [start, end];
}, chain = (builder, fragments) => {
  for (let index2 = 1; index2 < fragments.length; index2 += 1)
    link(builder, fragments[index2 - 1][1], {
      type: "split",
      targets: [fragments[index2][0]]
    });
  return [fragments[0][0], fragments[fragments.length - 1][1]];
}, sequenceFragment = (builder, items, scope) => items.length === 0 ? emptyFragment(builder) : chain(
  builder,
  items.map((item) => buildNode(builder, item, scope))
), alternationFragment = (builder, branches, scope) => {
  let fragments = branches.map((branch) => buildNode(builder, branch, scope)), start = addState(builder), end = addState(builder);
  link(builder, start, {
    type: "split",
    targets: fragments.map(([branchStart]) => branchStart)
  });
  for (let [, branchEnd] of fragments)
    link(builder, branchEnd, { type: "split", targets: [end] });
  return [start, end];
}, starFragment = (builder, body, lazy, scope) => {
  let [bodyStart, bodyEnd] = buildNode(builder, body, scope), loop = builder.loops, start = addState(builder), entry2 = addState(builder), leave = addState(builder), end = addState(builder);
  return builder.loops += 1, link(builder, start, {
    type: "split",
    targets: lazy ? [leave, entry2] : [entry2, leave]
  }), link(builder, entry2, { type: "enter", loop, target: bodyStart }), link(builder, bodyEnd, { type: "split", targets: [start] }), link(builder, leave, { type: "exit", loop, target: end }), [start, end];
}, plusFragment = (builder, body, lazy, scope) => {
  let [bodyStart, bodyEnd] = buildNode(builder, body, scope), loop = builder.loops, again = addState(builder), leave = addState(builder), end = addState(builder);
  return builder.loops += 1, link(builder, bodyEnd, {
    type: "split",
    targets: lazy ? [leave, again] : [again, leave]
  }), link(builder, again, { type: "enter", loop, target: bodyStart }), link(builder, leave, { type: "exit", loop, target: end }), [bodyStart, end];
}, optionalIteration = (builder, [bodyStart, bodyEnd], next, end, lazy) => {
  let loop = builder.loops, start = addState(builder), entry2 = addState(builder);
  return builder.loops += 1, link(builder, start, {
    type: "split",
    targets: lazy ? [end, entry2] : [entry2, end]
  }), link(builder, entry2, { type: "enter", loop, target: bodyStart }), link(builder, bodyEnd, { type: "exit", loop, target: next }), start;
}, nestedOptional = (builder, body, depth, lazy, scope) => {
  let end = addState(builder), start = end;
  for (let level = 0; level < depth; level += 1)
    start = optionalIteration(
      builder,
      buildNode(builder, body, scope),
      start,
      end,
      lazy
    );
  return [start, end];
}, repeatFragment = (builder, node2, scope) => {
  let { body, min, max, lazy } = node2;
  if (max === 0) return emptyFragment(builder);
  if (min === 0 && max === 1 / 0)
    return starFragment(builder, body, lazy, scope);
  if (min === 1 && max === 1 / 0)
    return plusFragment(builder, body, lazy, scope);
  let required = Array.from(
    { length: min },
    () => buildNode(builder, body, scope)
  );
  if (min === max) return chain(builder, required);
  let rest = max === 1 / 0 ? starFragment(builder, body, lazy, scope) : nestedOptional(builder, body, max - min, lazy, scope);
  return chain(builder, [...required, rest]);
}, assertionFragment = (builder, node2) => {
  if (isLineTest(node2.test) && !builder.keepsLines) return emptyFragment(builder);
  let start = addState(builder), end = addState(builder);
  return link(builder, start, {
    type: "assert",
    test: node2.test,
    multiline: node2.multiline,
    unicodeWord: node2.unicodeWord,
    target: end
  }), [start, end];
}, isPlain = (node2) => !someNode(
  node2,
  (inner) => inner.kind === "backreference" || inner.kind === "uncertain" || inner.kind === "look"
), isInline = (builder, node2) => node2.behind === (builder.direction === "backward"), isRecalled = (builder, node2) => builder.recalling && isPlain(node2.body), isRegular = (builder, node2) => !someNode(
  node2,
  (inner) => inner.kind === "backreference" || inner.kind === "uncertain" || inner.kind === "look" && !isInline(builder, inner) && !isRecalled(builder, inner)
), recallFragment = (builder, node2, [start, end]) => {
  let look = builder.looks.length;
  if (builder.looks.push({
    body: reverseNode(node2.body),
    direction: node2.behind ? "backward" : "forward"
  }), !isRecalled(builder, node2))
    return link(builder, start, { type: "invoke", look, target: end }), [start, end];
  let tracked = builder.recalls.length, [bodyStart, bodyEnd] = buildNode(builder, node2.body, {
    context: 0,
    certain: !0
  });
  return builder.recalls.push(bodyStart), link(builder, bodyEnd, { type: "recalled", tracked }), link(builder, start, {
    type: "recall",
    look,
    tracked,
    negative: node2.negative,
    target: end
  }), [start, end];
}, lookFragment = (builder, node2, scope) => {
  let start = addState(builder), end = addState(builder);
  if (!isInline(builder, node2))
    return recallFragment(builder, node2, [start, end]);
  builder.contexts += 1;
  let context = builder.contexts, nested = builder.gates.length, [bodyStart, bodyEnd] = buildNode(builder, node2.body, {
    context,
    certain: scope.certain
  }), resume = addState(builder);
  if (link(builder, bodyEnd, { type: "success", context }), link(builder, start, { type: "split", targets: [bodyStart, resume] }), !isRegular(builder, node2.body))
    return link(builder, resume, { type: "doubt", target: end }), [start, end];
  let depth = 1 + builder.gates.slice(nested).reduce((deepest, gate) => Math.max(deepest, gate.depth), 0);
  return link(builder, resume, {
    type: "gate",
    look: builder.gates.length,
    negative: node2.negative,
    target: end
  }), builder.gates.push({ start: bodyStart, context, depth }), [start, end];
}, uncertainFragment = (builder, body, scope) => {
  let start = addState(builder), [bodyStart, bodyEnd] = buildNode(builder, body, {
    ...scope,
    certain: !1
  });
  return link(builder, start, { type: "doubt", target: bodyStart }), [start, bodyEnd];
}, orient = (builder, body) => builder.direction === "forward" ? body : reverseNode(body), backreferenceFragment = (builder, captures, scope) => {
  if (captures.some((index2) => builder.copying.includes(index2)))
    return uncertainFragment(
      builder,
      {
        kind: "repeat",
        body: charNode(builder.universe),
        min: 0,
        max: 1 / 0,
        lazy: !1
      },
      scope
    );
  let bodies = captures.map(
    (index2) => orient(builder, builder.captures.get(index2) ?? EMPTY_NODE)
  ), copy = alternationOf(bodies), guarded = canMatchEmpty(copy) ? copy : { kind: "alternation", branches: [copy, EMPTY_NODE] };
  builder.copying.push(...captures);
  let fragment = uncertainFragment(builder, guarded, scope);
  return builder.copying.length -= captures.length, fragment;
}, buildNode = (builder, node2, scope) => {
  switch (node2.kind) {
    case "empty":
      return emptyFragment(builder);
    case "char":
      return consumeFragment(builder, node2.set, scope);
    case "sequence":
      return sequenceFragment(builder, node2.items, scope);
    case "alternation":
      return alternationFragment(builder, node2.branches, scope);
    case "repeat":
      return repeatFragment(builder, node2, scope);
    case "assertion":
      return assertionFragment(builder, node2);
    case "look":
      return lookFragment(builder, node2, scope);
    case "backreference":
      return backreferenceFragment(builder, node2.captures, scope);
    case "uncertain":
      return uncertainFragment(builder, node2.body, scope);
  }
}, searchLoop = (builder, bodyStart) => {
  let loop = builder.loops, start = addState(builder), entry2 = addState(builder), step = addState(builder), leave = addState(builder);
  return builder.loops += 1, link(builder, start, { type: "split", targets: [leave, entry2] }), link(builder, entry2, { type: "enter", loop, target: step }), link(builder, step, {
    type: "consume",
    set: setId(builder, builder.universe),
    target: start,
    context: 0,
    certain: !0,
    prefix: !0
  }), link(builder, leave, { type: "exit", loop, target: bodyStart }), start;
}, kindsInUse = (transitions) => {
  let mask = maskOf(0) | maskOf(4);
  for (let transition of transitions) {
    if (transition.type !== "assert") continue;
    let lineAnchor = isLineTest(transition.test);
    lineAnchor && transition.multiline && (mask |= maskOf(1)), lineAnchor || (mask |= maskOf(2)), !lineAnchor && transition.unicodeWord && (mask |= maskOf(3));
  }
  return mask;
}, startsAnywhere = (job) => job.scope === "submatch" || job.scope === "search" && job.flags.sticky, buildEpsilon = (job, recalling) => {
  let shape = shapeOf(job), builder = {
    transitions: [],
    setIds: /* @__PURE__ */ new Map(),
    sets: [],
    loops: 0,
    contexts: 0,
    looks: [],
    gates: [],
    captures: job.captures,
    direction: job.direction,
    keepsLines: shape.keepsLines,
    copying: [],
    universe: rangeSet(0, universeLimit(job.flags.unicode)),
    recalling,
    recalls: [],
    meter: job.meter
  }, [bodyStart, bodyEnd] = buildNode(builder, job.root, {
    context: 0,
    certain: !0
  });
  link(
    builder,
    bodyEnd,
    shape.trails ? { type: "success", context: 0 } : { type: "accept" }
  );
  let start = shape.searches ? searchLoop(builder, bodyStart) : bodyStart, kinds = kindsInUse(builder.transitions), startKinds = startsAnywhere(job) ? KINDS2.filter((kind) => (kinds & maskOf(kind)) !== 0) : [0];
  return {
    transitions: builder.transitions,
    start,
    startKinds,
    sets: builder.sets,
    looks: builder.looks,
    gates: builder.gates,
    recalls: builder.recalls,
    kinds,
    universe: builder.universe
  };
};

// src/hooks/regex/automaton/past.ts
var PAST_LIMIT = 256, startsAtBeginning = (automaton) => automaton.startKinds.length === 1 && automaton.startKinds[0] === 0, closeOver = (automaton, seeds, kind) => {
  let seen = /* @__PURE__ */ new Set(), items = [], holds2 = automaton.recalls.map(() => 0), pending = [...seeds];
  for (; pending.length > 0; ) {
    let item = pending.pop();
    if (!item || item.allowed === 0) continue;
    let key = item.state * (ALL_KINDS + 1) + item.allowed;
    if (seen.has(key)) continue;
    seen.add(key);
    let transition = automaton.transitions[item.state];
    switch (transition.type) {
      case "split":
        for (let target of transition.targets)
          pending.push({ state: target, allowed: item.allowed });
        break;
      case "assert":
        pending.push({
          state: transition.target,
          allowed: item.allowed & allowedAfter(
            transition.test,
            transition.multiline,
            transition.unicodeWord,
            kind
          )
        });
        break;
      case "enter":
      case "exit":
        pending.push({ state: transition.target, allowed: item.allowed });
        break;
      case "consume":
        items.push(item);
        break;
      case "recalled":
        holds2[transition.tracked] |= item.allowed;
        break;
      default:
        break;
    }
  }
  return { items, holds: holds2 };
}, kindPast = (automaton, alphabet) => {
  let pieces = alphabet.pieceKinds.length;
  return {
    recalling: !1,
    kinds: KINDS2,
    next: Int32Array.from(KINDS2.flatMap(() => alphabet.pieceKinds)),
    pieces,
    holds: KINDS2.map(() => []),
    starts: automaton.startKinds,
    forgotten: 0
  };
}, forget = (past, state) => state >= past.forgotten ? state : past.forgotten + past.kinds[state], recallPast = (automaton, alphabet) => {
  let pieces = alphabet.pieceKinds.length, members = alphabet.setPieces.map((list3) => new Set(list3)), restarts = automaton.recalls.map((state) => ({
    state,
    allowed: ALL_KINDS
  })), ids = /* @__PURE__ */ new Map(), kinds = [], itemSets = [], holds2 = [], next = [], intern = (kind, seeds) => {
    let closed = closeOver(automaton, [...seeds, ...restarts], kind), listed = closed.items.map(({ state, allowed }) => state * (ALL_KINDS + 1) + allowed).toSorted((left, right) => left - right), key = `${kind}|${closed.holds.join(",")}|${listed.join(",")}`, known = ids.get(key);
    return known !== void 0 ? known : kinds.length >= PAST_LIMIT ? null : (ids.set(key, kinds.length), kinds.push(kind), itemSets.push(closed.items), holds2.push(closed.holds), kinds.length - 1);
  }, advance = (items, piece) => items.flatMap(({ state, allowed }) => {
    let transition = automaton.transitions[state];
    return transition.type === "consume" && (allowed & maskOf(alphabet.pieceKinds[piece])) !== 0 && members[transition.set].has(piece) ? [{ state: transition.target, allowed: ALL_KINDS }] : [];
  });
  intern(0, []);
  for (let head = 0; head < kinds.length; head += 1)
    for (let piece = 0; piece < pieces; piece += 1) {
      let target = intern(
        alphabet.pieceKinds[piece],
        advance(itemSets[head], piece)
      );
      if (target === null) return null;
      next.push(target);
    }
  let forgotten = kinds.length;
  return {
    recalling: !0,
    kinds: [...kinds, ...KINDS2],
    next: Int32Array.from([
      ...next,
      ...KINDS2.flatMap(
        () => alphabet.pieceKinds.map((kind) => forgotten + kind)
      )
    ]),
    pieces,
    holds: [...holds2, ...KINDS2.map(() => automaton.recalls.map(() => 0))],
    starts: startsAtBeginning(automaton) ? [0] : kinds.map((_, past) => past),
    forgotten
  };
};

// src/hooks/regex/automaton/compile.ts
var compile = (job, recalling) => {
  let epsilon = buildEpsilon(job, recalling), alphabet = partitionAlphabet(epsilon);
  if (epsilon.recalls.length === 0)
    return { epsilon, alphabet, past: kindPast(epsilon, alphabet) };
  let past = recallPast(epsilon, alphabet);
  return past ? { epsilon, alphabet, past } : compile(job, !1);
};

// src/hooks/regex/automaton/ordered.ts
var recalledKinds = (past, pastState, transition) => {
  let holds2 = past.holds[pastState][transition.tracked];
  return transition.negative ? ALL_KINDS & ~holds2 : holds2;
}, closureStep = (automaton, alphabet, past, pastState, path, out) => {
  let transition = automaton.transitions[path.state];
  switch (transition.type) {
    case "split":
      return transition.targets.map((target) => ({ ...path, state: target }));
    case "assert":
      return [
        {
          ...path,
          state: transition.target,
          allowed: path.allowed & allowedAfter(
            transition.test,
            transition.multiline,
            transition.unicodeWord,
            past.kinds[pastState]
          )
        }
      ];
    case "enter":
      return path.loops.includes(transition.loop) ? [] : [
        {
          ...path,
          state: transition.target,
          loops: [...path.loops, transition.loop]
        }
      ];
    case "exit":
      return path.loops.includes(transition.loop) ? [] : [{ ...path, state: transition.target }];
    case "doubt":
      return [{ ...path, state: transition.target, certain: !1 }];
    case "invoke":
      return [
        {
          ...path,
          state: transition.target,
          certain: !1,
          marks: [...path.marks, transition.look]
        }
      ];
    case "recall":
      return [
        {
          ...path,
          state: transition.target,
          allowed: past.recalling ? path.allowed & recalledKinds(past, pastState, transition) : path.allowed,
          certain: path.certain && past.recalling,
          marks: [...path.marks, transition.look]
        }
      ];
    case "gate":
      return [
        {
          ...path,
          state: transition.target,
          gates: [
            ...path.gates,
            {
              look: transition.look,
              negative: transition.negative,
              past: pastState
            }
          ]
        }
      ];
    case "consume":
      return (alphabet.setKinds[transition.set] & path.allowed) !== 0 && out.push({
        type: "consume",
        state: path.state,
        kinds: path.allowed,
        certain: path.certain && transition.certain,
        marks: path.marks,
        gates: path.gates
      }), [];
    case "accept":
      return (path.allowed & maskOf(0)) !== 0 && out.push({ type: "accept", certain: path.certain, gates: path.gates }), [];
    case "success":
      return out.push({
        type: "success",
        context: transition.context,
        kinds: path.allowed,
        certain: path.certain,
        gates: path.gates
      }), [];
    case "recalled":
    case "dead":
      return [];
  }
}, collectClosure = (automaton, alphabet, past, pastState, state, meter) => {
  let out = [], pending = [
    {
      state,
      allowed: ALL_KINDS,
      loops: [],
      certain: !0,
      marks: [],
      gates: []
    }
  ];
  for (; pending.length > 0; ) {
    let path = pending.pop();
    if (spend(meter, 1), !path || path.allowed === 0) continue;
    let next = closureStep(automaton, alphabet, past, pastState, path, out);
    for (let index2 = next.length - 1; index2 >= 0; index2 -= 1)
      pending.push(next[index2]);
  }
  return out;
}, gatesKey = (gates) => gates.map(({ look, negative, past }) => `${look}${negative ? "!" : "="}${past}`).join("/"), itemKey = (item) => {
  let gates = gatesKey(item.gates);
  return item.type === "consume" ? `c${item.state}.${item.kinds}.${item.certain ? 1 : 0}.${item.marks.join("/")}.${gates}` : item.type === "accept" ? `a${item.certain ? 1 : 0}.${gates}` : `s${item.context}.${item.kinds}.${item.certain ? 1 : 0}.${gates}`;
}, successorsOf = (transition) => {
  switch (transition.type) {
    case "split":
      return transition.targets;
    case "accept":
    case "success":
    case "recalled":
    case "dead":
      return [];
    default:
      return [transition.target];
  }
}, leadsToRecall = (automaton) => {
  let predecessors = automaton.transitions.map(() => []), recalls = automaton.transitions.flatMap(
    (transition, state) => transition.type === "recall" ? [state] : []
  );
  return automaton.transitions.forEach((transition, state) => {
    for (let target of successorsOf(transition))
      predecessors[target].push(state);
  }), reach2(automaton.transitions.length, recalls, (state, visit) => {
    for (let source of predecessors[state]) visit(source);
  });
}, pushEvent = (events, piece, event) => {
  let list3 = events.get(piece);
  list3 ? list3.push(event) : events.set(piece, [event]);
}, contextSpanOf = (automaton) => {
  let highest = 0;
  for (let transition of automaton.transitions)
    (transition.type === "consume" || transition.type === "success") && (highest = Math.max(highest, transition.context));
  for (let gate of automaton.gates) highest = Math.max(highest, gate.context);
  return highest + 1;
}, buildOrdered = (automaton, alphabet, past, meter) => {
  let closureIds = /* @__PURE__ */ new Map(), closureItems = [], closureSignatures = [], signatureIds = /* @__PURE__ */ new Map(), stateIds = /* @__PURE__ */ new Map(), states = [], queue = [], contextSpan = contextSpanOf(automaton), pastSpan = past.kinds.length + 1, ahead = past.recalling ? leadsToRecall(automaton) : null, pastAt = (pastState, state) => ahead === null || ahead[state] ? pastState : forget(past, pastState), closureOf = (pastState, state) => {
    let key = pastState * automaton.transitions.length + state, cached = closureIds.get(key);
    if (cached !== void 0) return cached;
    let items = collectClosure(
      automaton,
      alphabet,
      past,
      pastState,
      state,
      meter
    ), text3 = items.map(itemKey).join(";"), signature = signatureIds.get(text3) ?? signatureIds.size;
    return signatureIds.set(text3, signature), closureIds.set(key, closureItems.length), closureItems.push(items), closureSignatures.push(signature), closureItems.length - 1;
  }, intern = (pastState, state, context) => {
    let closure = closureOf(pastState, state), remembered2 = past.recalling && pastState < past.forgotten, key = (closureSignatures[closure] * contextSpan + context) * pastSpan + (remembered2 ? pastState + 1 : 0), known = stateIds.get(key);
    if (known !== void 0) return known;
    let items = closureItems[closure], marks = [
      ...new Set(
        items.flatMap((item) => item.type === "consume" ? item.marks : [])
      )
    ];
    return states.push({
      past: pastState,
      context,
      items,
      marks,
      exits: [],
      events: /* @__PURE__ */ new Map()
    }), spend(meter, 1), stateIds.set(key, states.length - 1), queue.push(states.length - 1), states.length - 1;
  }, resolve5 = (gates) => gates.map((gate) => ({
    state: intern(
      pastAt(gate.past, automaton.gates[gate.look].start),
      automaton.gates[gate.look].start,
      automaton.gates[gate.look].context
    ),
    negative: gate.negative,
    depth: automaton.gates[gate.look].depth
  })), starts = [
    ...new Set(
      past.starts.map(
        (pastState) => intern(pastAt(pastState, automaton.start), automaton.start, 0)
      )
    )
  ];
  for (let head = 0; head < queue.length; head += 1) {
    let state = states[queue[head]];
    for (let item of state.items) {
      if (item.type !== "consume") {
        if (!item.certain) continue;
        let gates2 = resolve5(item.gates);
        if (item.type === "accept") {
          state.context === 0 && state.exits.push({ kinds: maskOf(0), gates: gates2 });
          continue;
        }
        item.context === state.context && state.exits.push({ kinds: item.kinds, gates: gates2 }), alphabet.pieceKinds.forEach((kind, piece) => {
          (item.kinds & maskOf(kind)) !== 0 && pushEvent(state.events, piece, {
            type: "stop",
            context: item.context,
            gates: gates2
          });
        });
        continue;
      }
      let transition = automaton.transitions[item.state];
      if (transition.type !== "consume") continue;
      let gates = resolve5(item.gates);
      for (let piece of alphabet.setPieces[transition.set]) {
        let kind = alphabet.pieceKinds[piece];
        (item.kinds & maskOf(kind)) !== 0 && (pushEvent(state.events, piece, {
          type: "move",
          target: intern(
            pastAt(
              past.next[state.past * past.pieces + piece],
              transition.target
            ),
            transition.target,
            transition.context
          ),
          certain: item.certain,
          context: transition.context,
          prefix: transition.prefix,
          gates
        }), spend(meter, 1));
      }
    }
  }
  return { states, starts };
}, forEachShadow = (ordered, visit) => ordered.states.forEach((state, source) => {
  for (let events of state.events.values()) {
    let laterContexts = /* @__PURE__ */ new Set();
    for (let index2 = events.length - 1; index2 >= 0; index2 -= 1) {
      let event = events[index2];
      event.type === "move" && (event.certain && laterContexts.has(event.context) && visit(source, event.target), laterContexts.add(event.context));
    }
  }
}), shadowingTargets = (ordered, keep2) => {
  let shadowing = /* @__PURE__ */ new Set();
  return forEachShadow(ordered, (source, target) => {
    keep2(source) && shadowing.add(target);
  }), shadowing;
}, decidingStates = (ordered) => {
  let deciding = new Uint8Array(ordered.states.length);
  return forEachShadow(ordered, (source) => {
    deciding[source] = 1;
  }), ordered.states.forEach((state, id) => {
    for (let events of state.events.values())
      events.some((event) => event.gates.length > 0) && (deciding[id] = 1);
  }), deciding;
}, sureStates = (ordered, alphabet) => {
  let following = alphabet.pieceKinds.reduce(
    (mask, kind) => mask | maskOf(kind),
    maskOf(0)
  );
  return new Set(
    ordered.states.flatMap(
      (state, id) => state.exits.some(
        (exit2) => exit2.gates.length === 0 && (exit2.kinds & following) === following
      ) ? [id] : []
    )
  );
}, gateStates = (ordered, keep2) => {
  let gated = /* @__PURE__ */ new Set();
  return ordered.states.forEach((state, id) => {
    if (keep2(id)) {
      for (let exit2 of state.exits)
        for (let gate of exit2.gates) gated.add(gate.state);
      for (let events of state.events.values())
        for (let event of events)
          for (let gate of event.gates) gated.add(gate.state);
    }
  }), gated;
}, orderedGraph = (ordered) => {
  let sources = [], targets = [], labels = [];
  return ordered.states.forEach((state, id) => {
    for (let [piece, events] of state.events)
      for (let event of events)
        event.type === "move" && (sources.push(id), targets.push(event.target), labels.push(piece));
  }), toDigraph(ordered.states.length, sources, targets, labels);
}, consultedStates = (ordered, keep2) => /* @__PURE__ */ new Set([...shadowingTargets(ordered, keep2), ...gateStates(ordered, keep2)]);

// src/hooks/regex/amplification/layout.ts
var NO_LOOP = -1, isLoopState = (state) => {
  for (let events of state.events.values())
    for (let event of events)
      if (event.type === "move" && event.prefix) return !0;
  return !1;
}, rawTargets = (state) => {
  let pieces = [...state.events.keys()].sort((left, right) => left - right), targets = [];
  for (let piece of pieces)
    for (let event of state.events.get(piece) ?? [])
      event.type === "move" && !event.prefix && targets.push(event.target);
  return targets;
}, renumber = (targets, loop, roots) => {
  let order = new Int32Array(targets.length).fill(-1), stackStates = new Int32Array(targets.length), stackIndices = new Int32Array(targets.length), next = 0, claim = (state) => loop[state] || order[state] !== -1 ? !1 : (order[state] = next, next += 1, !0), visit = (root) => {
    if (!claim(root)) return;
    let depth = 1;
    for (stackStates[0] = root, stackIndices[0] = 0; depth > 0; ) {
      let list3 = targets[stackStates[depth - 1]], index2 = stackIndices[depth - 1];
      if (index2 === list3.length) {
        depth -= 1;
        continue;
      }
      stackIndices[depth - 1] = index2 + 1, claim(list3[index2]) && (stackStates[depth] = list3[index2], stackIndices[depth] = 0, depth += 1);
    }
  };
  for (let root of roots) visit(root);
  for (let state = 0; state < targets.length; state += 1) visit(state);
  return order;
}, layoutOf = (job) => {
  let { epsilon, alphabet, past } = compile(job, !0), ordered = buildOrdered(epsilon, alphabet, past, job.meter), total = ordered.states.length, targets = ordered.states.map(rawTargets), loop = new Uint8Array(total), loopIndex = new Int32Array(total).fill(NO_LOOP), loopStates = [], roots = [], startLoops = [], startStates = [];
  for (let state = 0; state < total; state += 1)
    isLoopState(ordered.states[state]) && (loop[state] = 1, loopIndex[state] = loopStates.length, loopStates.push(state));
  for (let state of loopStates)
    for (let target of targets[state]) roots.push(target);
  for (let state of ordered.starts) roots.push(state);
  let order = renumber(targets, loop, roots);
  for (let state of ordered.starts)
    loop[state] ? startLoops.push(loopIndex[state]) : startStates.push(order[state]);
  return {
    ordered,
    alphabet,
    order,
    loopIndex,
    loopStates,
    stateCount: total - loopStates.length,
    startLoops,
    startStates,
    startOrder: Int32Array.from(startStates).sort(),
    moves: /* @__PURE__ */ new WeakMap(),
    walks: /* @__PURE__ */ new WeakMap(),
    consulted: void 0,
    reader: void 0
  };
}, remembered = (cache, lookahead, klass, build) => {
  let byClass = cache.get(lookahead);
  byClass === void 0 && (byClass = /* @__PURE__ */ new Map(), cache.set(lookahead, byClass));
  let known = byClass.get(klass);
  if (known !== void 0) return known;
  let value = build();
  return byClass.set(klass, value), value;
}, consultedFor = (layout) => layout.consulted ??= consultedStates(layout.ordered, () => !0), readerFor = (layout) => layout.reader ??= readerOf(
  layout.ordered,
  layout.alphabet,
  consultedFor(layout)
), sureOf = (layout) => sureLookahead(
  layout.alphabet.pieceKinds.length,
  sureStates(layout.ordered, layout.alphabet)
);

// src/hooks/regex/amplification/moves.ts
var tableOf = (states, lookahead, klass) => {
  let entryOffsets = new Int32Array(states.length + 1), loopOffsets = new Int32Array(states.length + 1), entryPieces = [], targetOffsets = [0], targets = [], loopPieces = [], loopTargets = [], blocked = [];
  return states.forEach((state, index2) => {
    for (let [piece, events] of state.events) {
      let current = lookahead.back[klass * lookahead.pieces + piece], first = targets.length, loop = NO_LOOP;
      blocked.length = 0;
      for (let event of events)
        runsInOrder(event, lookahead, current, klass, blocked) && (event.prefix ? loop === NO_LOOP && (loop = event.target) : targets.push(event.target));
      targets.length > first && (entryPieces.push(piece), targetOffsets.push(targets.length)), loop !== NO_LOOP && (loopPieces.push(piece), loopTargets.push(loop));
    }
    entryOffsets[index2 + 1] = entryPieces.length, loopOffsets[index2 + 1] = loopPieces.length;
  }), {
    entryOffsets,
    entryPieces: Int32Array.from(entryPieces),
    targetOffsets: Int32Array.from(targetOffsets),
    targets: Int32Array.from(targets),
    loopOffsets,
    loopPieces: Int32Array.from(loopPieces),
    loopTargets: Int32Array.from(loopTargets)
  };
}, movesOf = (layout, lookahead, klass) => remembered(
  layout.moves,
  lookahead,
  klass,
  () => tableOf(layout.ordered.states, lookahead, klass)
), stateCountOf = (moves) => moves.entryOffsets.length - 1, targetsStart = (moves, state) => moves.targetOffsets[moves.entryOffsets[state]], targetsEnd = (moves, state) => moves.targetOffsets[moves.entryOffsets[state + 1]], entryOf = (moves, state, piece) => {
  for (let entry2 = moves.entryOffsets[state]; entry2 < moves.entryOffsets[state + 1]; entry2 += 1)
    if (moves.entryPieces[entry2] === piece) return entry2;
  return -1;
};

// src/hooks/regex/amplification/walk.ts
var MULTIPLICITY_SLOTS = 2 ** 21, SHIFT = 0, FAN = 1, GAIN = 2, MIRROR = 3, collectBundles = (layout, moves) => {
  let { order, loopIndex } = layout, { entryOffsets, entryPieces, targetOffsets, targets } = moves, bundles = {
    gains: [],
    sources: [],
    targets: [],
    multiplicities: [],
    pieces: []
  }, bundleOf = /* @__PURE__ */ new Map(), owners = [], stamps = new Int32Array(order.length + 1), counts = new Int32Array(order.length + 1), distinct = [], generation = 0;
  for (let state = 0; state < stateCountOf(moves); state += 1) {
    let gain = loopIndex[state] !== NO_LOOP ? 1 : 0, source = gain === 1 ? loopIndex[state] : order[state];
    for (let entry2 = entryOffsets[state]; entry2 < entryOffsets[state + 1]; entry2 += 1) {
      let piece = entryPieces[entry2];
      generation += 1, distinct.length = 0;
      for (let item = targetOffsets[entry2]; item < targetOffsets[entry2 + 1]; item += 1) {
        let slot = order[targets[item]] + 1;
        stamps[slot] !== generation && (stamps[slot] = generation, counts[slot] = 0, distinct.push(slot)), counts[slot] += 1;
      }
      for (let slot of distinct) {
        let key = (slot - 1) * MULTIPLICITY_SLOTS + counts[slot], bundle = bundleOf.get(key) ?? -1;
        (bundle === -1 || owners[bundle] !== state) && (bundle = bundles.sources.length, bundleOf.set(key, bundle), owners.push(state), bundles.gains.push(gain), bundles.sources.push(source), bundles.targets.push(slot - 1), bundles.multiplicities.push(counts[slot]), bundles.pieces.push([])), bundles.pieces[bundle].push(piece);
      }
    }
  }
  return bundles;
}, streakLengths = (sorted, continues) => {
  let lengths = [];
  for (let index2 = 0; index2 < sorted.length; index2 += 1)
    index2 > 0 && continues(sorted[index2 - 1], sorted[index2]) ? lengths[lengths.length - 1] += 1 : lengths.push(1);
  return lengths;
}, streaksBy = (bundles, pieceIds, edges, keys, step) => {
  let { sources, targets, multiplicities } = bundles, sorted = edges.toSorted(
    (left, right) => pieceIds[left] - pieceIds[right] || multiplicities[left] - multiplicities[right] || keys[left] - keys[right] || sources[left] - sources[right]
  ), lengths = streakLengths(
    sorted,
    (previous2, edge) => pieceIds[previous2] === pieceIds[edge] && multiplicities[previous2] === multiplicities[edge] && sources[edge] === sources[previous2] + 1 && targets[edge] === targets[previous2] + step
  );
  return { sorted, lengths };
}, singlesOf = ({ sorted, lengths }) => {
  let singles = [], start = 0;
  for (let length of lengths)
    length === 1 && singles.push(sorted[start]), start += length;
  return singles;
}, runCount = ({ lengths }) => lengths.reduce((total, length) => total + (length > 1 ? 1 : 0), 0), groupBundles = (bundles, pieceIds) => {
  let { sources, targets, multiplicities } = bundles, edges = [], gains = [];
  for (let bundle = 0; bundle < sources.length; bundle += 1)
    bundles.gains[bundle] === 1 ? gains.push(bundle) : edges.push(bundle);
  let shiftOffsets = sources.map(
    (source, bundle) => targets[bundle] - source
  ), mirrorSums = sources.map((source, bundle) => targets[bundle] + source), shifted = streaksBy(bundles, pieceIds, edges, shiftOffsets, 1), fanned = streaksBy(bundles, pieceIds, singlesOf(shifted), targets, 0), mirrored = streaksBy(
    bundles,
    pieceIds,
    singlesOf(fanned),
    mirrorSums,
    -1
  ), count = runCount(shifted) + runCount(fanned) + mirrored.lengths.length + gains.length, groups = {
    count,
    kinds: new Uint8Array(count),
    sources: new Int32Array(count),
    targets: new Int32Array(count),
    multiplicities: new Int32Array(count),
    pieces: new Int32Array(count),
    lengths: new Int32Array(count)
  }, group = 0, place = (edge, kind, length) => {
    groups.kinds[group] = kind, groups.sources[group] = sources[edge], groups.targets[group] = kind === MIRROR ? targets[edge] - length + 1 : targets[edge], groups.multiplicities[group] = multiplicities[edge], groups.pieces[group] = pieceIds[edge], groups.lengths[group] = length, group += 1;
  }, placeRuns = ({ sorted, lengths }, kind, single) => {
    let start = 0;
    for (let length of lengths)
      length > 1 !== single && place(sorted[start], kind, length), start += length;
  };
  placeRuns(shifted, SHIFT, !1), placeRuns(fanned, FAN, !1), placeRuns(mirrored, MIRROR, !1), placeRuns(mirrored, FAN, !0);
  for (let gain of gains) place(gain, GAIN, 1);
  return groups;
}, segmentsOf = (spanStarts, spanEnds, members) => {
  let endpoints = new Int32Array(members.length * 2);
  members.forEach((member, index2) => {
    endpoints[index2 * 2] = spanStarts[member], endpoints[index2 * 2 + 1] = spanEnds[member];
  }), endpoints.sort();
  let boundCount = 0;
  for (let index2 = 0; index2 < endpoints.length; index2 += 1)
    (boundCount === 0 || endpoints[boundCount - 1] !== endpoints[index2]) && (endpoints[boundCount] = endpoints[index2], boundCount += 1);
  let bounds = endpoints.subarray(0, boundCount), covered = new Int32Array(boundCount), segmentOf = new Int32Array(boundCount);
  for (let member of members)
    for (let index2 = lowerBound(bounds, spanStarts[member]); index2 < boundCount && bounds[index2] < spanEnds[member]; index2 += 1)
      covered[index2] += 1;
  let count = 0;
  for (let index2 = 0; index2 < boundCount; index2 += 1)
    segmentOf[index2] = covered[index2] > 0 ? count : -1, count += covered[index2] > 0 ? 1 : 0;
  let segments2 = {
    count,
    starts: new Int32Array(count),
    ends: new Int32Array(count),
    offsets: new Int32Array(count + 1),
    members: new Int32Array(0),
    openOffsets: new Int32Array(count + 1),
    openMembers: new Int32Array(members.length)
  };
  for (let index2 = 0; index2 < boundCount; index2 += 1) {
    let segment = segmentOf[index2];
    segment !== -1 && (segments2.starts[segment] = bounds[index2], segments2.ends[segment] = bounds[index2 + 1], segments2.offsets[segment + 1] = segments2.offsets[segment] + covered[index2]);
  }
  let cursor = segments2.offsets.slice(0, count);
  segments2.members = new Int32Array(segments2.offsets[count]);
  for (let member of members)
    for (let index2 = lowerBound(bounds, spanStarts[member]); index2 < boundCount && bounds[index2] < spanEnds[member]; index2 += 1)
      segments2.members[cursor[segmentOf[index2]]] = member, cursor[segmentOf[index2]] += 1;
  let { openOffsets, openMembers } = segments2;
  for (let member of members)
    openOffsets[segmentOf[lowerBound(bounds, spanStarts[member])] + 1] += 1;
  for (let segment = 0; segment < count; segment += 1)
    openOffsets[segment + 1] += openOffsets[segment];
  let opening = openOffsets.slice(0, count);
  for (let member of members) {
    let segment = segmentOf[lowerBound(bounds, spanStarts[member])];
    openMembers[opening[segment]] = member, opening[segment] += 1;
  }
  return segments2;
}, targetSegments = (groups) => {
  let ends = new Int32Array(groups.count), members = [];
  for (let group = 0; group < groups.count; group += 1)
    ends[group] = groups.targets[group] + (groups.kinds[group] === SHIFT || groups.kinds[group] === MIRROR ? groups.lengths[group] : 1), members.push(group);
  return segmentsOf(groups.targets, ends, members);
}, sourceEnd = (groups, group) => groups.sources[group] + groups.lengths[group], sourceSegments = (groups) => {
  let ends = new Int32Array(groups.count), members = [];
  for (let group = 0; group < groups.count; group += 1)
    groups.kinds[group] !== GAIN && (ends[group] = sourceEnd(groups, group), members.push(group));
  return segmentsOf(groups.sources, ends, members);
}, refinePartition = (blocks, keys, width) => {
  let blocksByKey = /* @__PURE__ */ new Map(), refined = new Int32Array(blocks.length);
  for (let piece = 0; piece < blocks.length; piece += 1) {
    let key = blocks[piece] * width + keys[piece], block = blocksByKey.get(key);
    block === void 0 && (block = blocksByKey.size, blocksByKey.set(key, block)), refined[piece] = block;
  }
  return refined;
}, buildWalk = (layout, pieceCount, moves) => {
  let { loopIndex, loopStates } = layout, loopCount = loopStates.length, bundles = collectBundles(layout, moves), pieceIds = new Int32Array(bundles.sources.length), pieceKeys = /* @__PURE__ */ new Map(), pieceLists = [];
  bundles.pieces.forEach((pieces, bundle) => {
    let key = pieces.join(","), known = pieceKeys.get(key);
    pieceIds[bundle] = known ?? pieceLists.length, known === void 0 && (pieceKeys.set(key, pieceLists.length), pieceLists.push(pieces));
  });
  let groups = groupBundles(bundles, pieceIds), pieceSets = new Uint8Array(pieceLists.length * pieceCount), pieceOffsets = new Int32Array(pieceLists.length + 1), loopNext = new Int32Array(pieceCount * loopCount).fill(NO_LOOP), column = new Int32Array(pieceCount), loopClasses = new Int32Array(pieceCount);
  pieceLists.forEach((pieces, pieceSet) => {
    pieceOffsets[pieceSet + 1] = pieceOffsets[pieceSet] + pieces.length;
    for (let piece of pieces) pieceSets[pieceSet * pieceCount + piece] = 1;
  });
  let pieceItems = Int32Array.from(pieceLists.flat());
  loopStates.forEach((state, loop) => {
    for (let entry2 = moves.loopOffsets[state]; entry2 < moves.loopOffsets[state + 1]; entry2 += 1)
      loopNext[moves.loopPieces[entry2] * loopCount + loop] = loopIndex[moves.loopTargets[entry2]];
  });
  for (let loop = 0; loop < loopCount; loop += 1) {
    for (let piece = 0; piece < pieceCount; piece += 1)
      column[piece] = loopNext[piece * loopCount + loop] + 1;
    loopClasses = refinePartition(loopClasses, column, loopCount + 1);
  }
  return {
    pieceCount,
    loopCount,
    groups,
    segments: targetSegments(groups),
    sources: sourceSegments(groups),
    pieceSets,
    pieceOffsets,
    pieceItems,
    loopClasses,
    loopClassCount: loopClasses.reduce((highest, klass) => Math.max(highest, klass), 0) + 1,
    loopNext
  };
}, walkOf = (layout, lookahead, klass) => remembered(
  layout.walks,
  lookahead,
  klass,
  () => buildWalk(layout, lookahead.pieces, movesOf(layout, lookahead, klass))
), mirrorAxis = (groups, group) => groups.sources[group] + groups.targets[group] + groups.lengths[group];

// src/hooks/regex/amplification/chains.ts
var isChain = (groups, group) => groups.kinds[group] === SHIFT && groups.targets[group] === groups.sources[group] + 1, sharesPiece = (walk3, left, right) => {
  let { pieceSets, pieceCount } = walk3;
  for (let piece = 0; piece < pieceCount; piece += 1)
    if (pieceSets[left * pieceCount + piece] === 1 && pieceSets[right * pieceCount + piece] === 1)
      return !0;
  return !1;
}, startsAttempt = (walk3, pieces) => {
  let { groups } = walk3;
  for (let group = 0; group < groups.count; group += 1)
    if (groups.kinds[group] === GAIN && sharesPiece(walk3, groups.pieces[group], pieces))
      return !0;
  return !1;
}, splitsChain = (walk3, chain2) => {
  let { groups } = walk3, first = groups.sources[chain2], last = first + groups.lengths[chain2];
  for (let group = 0; group < groups.count; group += 1)
    if (group !== chain2 && groups.kinds[group] !== GAIN && groups.sources[group] <= last && sourceEnd(groups, group) > first && sharesPiece(walk3, groups.pieces[group], groups.pieces[chain2]))
      return !0;
  return !1;
}, chainRanges = (walk3, keep2) => {
  let { groups } = walk3, ranges = [];
  for (let group = 0; group < groups.count; group += 1)
    isChain(groups, group) && keep2(group) && ranges.push(
      groups.sources[group],
      groups.sources[group] + groups.lengths[group] + 1
    );
  return ranges;
}, quietRanges = (walk3) => chainRanges(walk3, (group) => !startsAttempt(walk3, walk3.groups.pieces[group])), steadyRanges = (walk3) => chainRanges(walk3, (group) => !splitsChain(walk3, group));

// src/hooks/regex/amplification/pairs.ts
var createPairs = () => ({
  count: 0,
  olders: new Int32Array(256),
  youngers: new Int32Array(256),
  lives: new Int32Array(256),
  settled: new Uint8Array(256),
  slots: new Int32Array(512)
}), pairHash = (older, younger) => Math.imul(older ^ 1540483477, 2654435761) ^ Math.imul(younger, 2246822507), findPair = (pairs, older, younger) => {
  let mask = pairs.slots.length - 1;
  for (let slot = pairHash(older, younger) & mask; ; slot = slot + 1 & mask) {
    let entry2 = pairs.slots[slot];
    if (entry2 === 0) return -1;
    if (pairs.olders[entry2 - 1] === older && pairs.youngers[entry2 - 1] === younger)
      return entry2 - 1;
  }
}, placePair = (pairs, entry2) => {
  let mask = pairs.slots.length - 1, slot = pairHash(pairs.olders[entry2], pairs.youngers[entry2]) & mask;
  for (; pairs.slots[slot] !== 0; ) slot = slot + 1 & mask;
  pairs.slots[slot] = entry2 + 1;
}, pairOf = (pairs, older, younger) => {
  let known = findPair(pairs, older, younger);
  if (known !== -1) return known;
  let entry2 = pairs.count;
  if (pairs.olders = grownInt32(pairs.olders, entry2 + 1), pairs.youngers = grownInt32(pairs.youngers, entry2 + 1), pairs.lives = grownInt32(pairs.lives, entry2 + 1), pairs.settled = grownUint8(pairs.settled, entry2 + 1), pairs.olders[entry2] = older, pairs.youngers[entry2] = younger, pairs.lives[entry2] = 1, pairs.count = entry2 + 1, pairs.count * 2 <= pairs.slots.length)
    return placePair(pairs, entry2), entry2;
  pairs.slots = new Int32Array(pairs.slots.length * 2);
  for (let known2 = 0; known2 < pairs.count; known2 += 1) placePair(pairs, known2);
  return entry2;
}, livesOf = (pairs, older, younger) => {
  let entry2 = findPair(pairs, older, younger);
  return entry2 === -1 ? 1 : pairs.lives[entry2];
}, outlives = (moves, pairs, older, younger, required, meter) => {
  let entry2 = findPair(pairs, older, younger);
  if (entry2 !== -1 && pairs.lives[entry2] >= required || entry2 === -1 && required <= 1) return !0;
  if (entry2 !== -1 && pairs.settled[entry2] === 1) return !1;
  let { entryOffsets, entryPieces, targetOffsets, targets } = moves, first = entryOffsets[younger], last = entryOffsets[younger + 1], children = 0;
  for (let young = first; young < last; young += 1) {
    let old = entryOf(moves, older, entryPieces[young]);
    old !== -1 && (children += (targetOffsets[old + 1] - targetOffsets[old]) * (targetOffsets[young + 1] - targetOffsets[young]));
  }
  spend(meter, 1 + children);
  for (let young = first; young < last; young += 1) {
    let old = entryOf(moves, older, entryPieces[young]);
    if (old !== -1) {
      for (let oldItem = targetOffsets[old]; oldItem < targetOffsets[old + 1]; oldItem += 1)
        for (let youngItem = targetOffsets[young]; youngItem < targetOffsets[young + 1]; youngItem += 1)
          if (outlives(
            moves,
            pairs,
            targets[oldItem],
            targets[youngItem],
            required - 1,
            meter
          ))
            return pairs.lives[pairOf(pairs, older, younger)] = required, !0;
    }
  }
  let longest = 0;
  for (let young = first; young < last; young += 1) {
    let old = entryOf(moves, older, entryPieces[young]);
    if (old !== -1)
      for (let oldItem = targetOffsets[old]; oldItem < targetOffsets[old + 1]; oldItem += 1)
        for (let youngItem = targetOffsets[young]; youngItem < targetOffsets[young + 1]; youngItem += 1)
          longest = Math.max(
            longest,
            livesOf(pairs, targets[oldItem], targets[youngItem])
          );
  }
  let settledEntry = pairOf(pairs, older, younger);
  return pairs.lives[settledEntry] = 1 + longest, pairs.settled[settledEntry] = 1, !1;
};

// src/hooks/regex/amplification/spread.ts
var EXACT_SUMS = 2 ** 53, createScratch = () => ({
  incidences: 0,
  pathCount: 0,
  pathPieces: new Int32Array(64),
  pathStarts: new Int32Array(64),
  pathEnds: new Int32Array(64),
  pathValues: new Float64Array(64),
  gainCount: 0,
  gainPieces: new Int32Array(16),
  gainLoops: new Int32Array(16),
  gainValues: new Float64Array(16),
  eventKeys: new Float64Array(128),
  eventPieces: new Int32Array(128),
  eventPositions: new Int32Array(128),
  eventDeltas: new Float64Array(128),
  positionSlots: new Int32Array(256),
  runs: [],
  runLengths: new Int32Array(32),
  levels: new Float64Array(32),
  previous: new Int32Array(32),
  readers: new Int32Array(64),
  spare: [],
  labels: new Int32Array(64),
  splitStamps: new Int32Array(64),
  splitTargets: new Int32Array(64),
  touchedStamps: new Int32Array(64),
  touched: [],
  touchedCount: 0,
  choiceTable: createRunTable(),
  choices: [],
  classStamps: new Int32Array(64),
  classLabels: new Int32Array(64),
  generation: 0,
  representatives: new Int32Array(64)
}), reservePaths = (scratch, extra) => {
  let size = scratch.pathCount + extra;
  size <= scratch.pathPieces.length || (scratch.pathPieces = grownInt32(scratch.pathPieces, size), scratch.pathStarts = grownInt32(scratch.pathStarts, size), scratch.pathEnds = grownInt32(scratch.pathEnds, size), scratch.pathValues = grownFloat64(scratch.pathValues, size));
}, pushPath = (scratch, pieces, start, end, value) => {
  let path = scratch.pathCount;
  reservePaths(scratch, 1), scratch.pathPieces[path] = pieces, scratch.pathStarts[path] = start, scratch.pathEnds[path] = end, scratch.pathValues[path] = value, scratch.pathCount = path + 1;
}, pushGain = (scratch, pieces, loop, value) => {
  let gain = scratch.gainCount;
  gain === scratch.gainPieces.length && (scratch.gainPieces = grownInt32(scratch.gainPieces, gain + 1), scratch.gainLoops = grownInt32(scratch.gainLoops, gain + 1), scratch.gainValues = grownFloat64(scratch.gainValues, gain + 1)), scratch.gainPieces[gain] = pieces, scratch.gainLoops[gain] = loop, scratch.gainValues[gain] = value, scratch.gainCount = gain + 1;
}, firstSegment = (segments2, position2) => {
  let low = 0, high = segments2.count;
  for (; low < high; ) {
    let middle = low + high >> 1;
    segments2.ends[middle] <= position2 ? low = middle + 1 : high = middle;
  }
  return low;
}, openingSlot = (segments2, index2, first) => index2 === first ? segments2.offsets[index2] : segments2.openOffsets[index2], closingSlot = (segments2, index2, first) => index2 === first ? segments2.offsets[index2 + 1] : segments2.openOffsets[index2 + 1], memberAt = (segments2, index2, first, slot) => index2 === first ? segments2.members[slot] : segments2.openMembers[slot], spreadMerged = (walk3, runs, scratch) => {
  let { segments: segments2 } = walk3, { kinds, sources, targets, multiplicities, pieces, lengths } = walk3.groups, largest = 0, incidences = 0;
  scratch.pathCount = 0, scratch.gainCount = 0;
  for (let run16 = 0; run16 < runs.length; run16 += 3) {
    let start = runs[run16], end = runs[run16 + 1], value = runs[run16 + 2], first = firstSegment(segments2, start);
    for (let index2 = first; index2 < segments2.count && segments2.starts[index2] < end; index2 += 1) {
      let last = closingSlot(segments2, index2, first), opening = openingSlot(segments2, index2, first);
      incidences += segments2.offsets[index2 + 1] - segments2.offsets[index2], reservePaths(scratch, last - opening);
      let { pathPieces, pathStarts, pathEnds, pathValues } = scratch, path = scratch.pathCount;
      for (let slot = opening; slot < last; slot += 1) {
        let group = memberAt(segments2, index2, first, slot), amount = value * multiplicities[group], source = sources[group];
        if (kinds[group] === GAIN) {
          pushGain(scratch, pieces[group], source, amount);
          continue;
        }
        switch (largest = Math.max(largest, amount), pathPieces[path] = pieces[group], pathValues[path] = amount, kinds[group]) {
          case SHIFT:
            pathStarts[path] = Math.max(start, targets[group]) + source - targets[group], pathEnds[path] = Math.min(end, targets[group] + lengths[group]) + source - targets[group];
            break;
          case MIRROR: {
            let axis = mirrorAxis(walk3.groups, group);
            pathStarts[path] = axis - Math.min(end, targets[group] + lengths[group]), pathEnds[path] = axis - Math.max(start, targets[group]);
            break;
          }
          default:
            pathStarts[path] = source, pathEnds[path] = source + lengths[group];
        }
        path += 1;
      }
      scratch.pathCount = path;
    }
  }
  return scratch.incidences = incidences, 2 * incidences * largest < EXACT_SUMS;
}, spreadSegments = (walk3, runs, scratch) => {
  let { groups, segments: segments2 } = walk3;
  scratch.pathCount = 0, scratch.gainCount = 0;
  for (let run16 = 0; run16 < runs.length; run16 += 3) {
    let start = runs[run16], end = runs[run16 + 1], value = runs[run16 + 2];
    for (let index2 = firstSegment(segments2, start); index2 < segments2.count && segments2.starts[index2] < end; index2 += 1) {
      let low = Math.max(start, segments2.starts[index2]), high = Math.min(end, segments2.ends[index2]);
      for (let slot = segments2.offsets[index2]; slot < segments2.offsets[index2 + 1]; slot += 1) {
        let group = segments2.members[slot], amount = value * groups.multiplicities[group], kind = groups.kinds[group], source = groups.sources[group];
        if (kind === GAIN) {
          pushGain(scratch, groups.pieces[group], source, amount);
          continue;
        }
        if (kind === SHIFT) {
          let offset = source - groups.targets[group];
          pushPath(
            scratch,
            groups.pieces[group],
            low + offset,
            high + offset,
            amount
          );
          continue;
        }
        if (kind === MIRROR) {
          let axis = mirrorAxis(groups, group);
          pushPath(
            scratch,
            groups.pieces[group],
            axis - high,
            axis - low,
            amount
          );
          continue;
        }
        pushPath(
          scratch,
          groups.pieces[group],
          source,
          source + groups.lengths[group],
          amount
        );
      }
    }
  }
  scratch.incidences = scratch.pathCount + scratch.gainCount;
}, spreadInto = (walk3, runs, scratch) => {
  spreadMerged(walk3, runs, scratch) || spreadSegments(walk3, runs, scratch);
}, advanceMerged = (walk3, runs, scratch) => {
  let { groups, sources } = walk3, largest = 0;
  scratch.pathCount = 0, scratch.gainCount = 0, scratch.incidences = 0;
  for (let run16 = 0; run16 < runs.length; run16 += 3) {
    let start = runs[run16], end = runs[run16 + 1], value = runs[run16 + 2], first = firstSegment(sources, start);
    for (let index2 = first; index2 < sources.count && sources.starts[index2] < end; index2 += 1) {
      let last = closingSlot(sources, index2, first);
      scratch.incidences += sources.offsets[index2 + 1] - sources.offsets[index2];
      for (let slot = openingSlot(sources, index2, first); slot < last; slot += 1) {
        let group = memberAt(sources, index2, first, slot), amount = value * groups.multiplicities[group], source = groups.sources[group], target = groups.targets[group];
        if (groups.kinds[group] === SHIFT) {
          largest = Math.max(largest, amount), pushPath(
            scratch,
            groups.pieces[group],
            Math.max(start, source) + target - source,
            Math.min(end, source + groups.lengths[group]) + target - source,
            amount
          );
          continue;
        }
        if (groups.kinds[group] === MIRROR) {
          let axis = mirrorAxis(groups, group);
          largest = Math.max(largest, amount), pushPath(
            scratch,
            groups.pieces[group],
            axis - Math.min(end, source + groups.lengths[group]),
            axis - Math.max(start, source),
            amount
          );
          continue;
        }
        let reach3 = source + groups.lengths[group], total = amount * (Math.min(end, reach3) - Math.max(start, source));
        largest = Math.max(largest, total), pushPath(scratch, groups.pieces[group], target, target + 1, total);
      }
    }
  }
  return 2 * scratch.incidences * largest < EXACT_SUMS;
}, advanceSegments = (walk3, runs, scratch) => {
  let { groups, sources } = walk3;
  scratch.pathCount = 0, scratch.gainCount = 0;
  for (let run16 = 0; run16 < runs.length; run16 += 3) {
    let start = runs[run16], end = runs[run16 + 1], value = runs[run16 + 2];
    for (let index2 = firstSegment(sources, start); index2 < sources.count && sources.starts[index2] < end; index2 += 1) {
      let low = Math.max(start, sources.starts[index2]), high = Math.min(end, sources.ends[index2]);
      for (let slot = sources.offsets[index2]; slot < sources.offsets[index2 + 1]; slot += 1) {
        let group = sources.members[slot], amount = value * groups.multiplicities[group], target = groups.targets[group];
        if (groups.kinds[group] === SHIFT) {
          let offset = target - groups.sources[group];
          pushPath(
            scratch,
            groups.pieces[group],
            low + offset,
            high + offset,
            amount
          );
          continue;
        }
        if (groups.kinds[group] === MIRROR) {
          let axis = mirrorAxis(groups, group);
          pushPath(
            scratch,
            groups.pieces[group],
            axis - high,
            axis - low,
            amount
          );
          continue;
        }
        pushPath(
          scratch,
          groups.pieces[group],
          target,
          target + 1,
          amount * (high - low)
        );
      }
    }
  }
  scratch.incidences = scratch.pathCount;
}, advanceInto = (walk3, runs, scratch) => {
  advanceMerged(walk3, runs, scratch) || advanceSegments(walk3, runs, scratch);
};

// src/hooks/regex/amplification/vectors.ts
var emitRun = (runs, length, start, end, value) => length > 0 && runs[length - 2] === start && runs[length - 1] === value ? (runs[length - 2] = end, length) : (runs[length] = start, runs[length + 1] = end, runs[length + 2] = value, length + 3), firstRunAfter = (runs, size, position2) => {
  let low = 0, high = size / 3;
  for (; low < high; ) {
    let middle = low + high >> 1;
    runs[middle * 3 + 1] <= position2 ? low = middle + 1 : high = middle;
  }
  return low * 3;
}, raisesNothing = (runs, first, last, low, high) => first === last && runs[first] <= low && runs[first + 1] >= high, raiseSpan = (scratch, slot, size, low, high, peak) => {
  let current = scratch.runs[slot], out = scratch.spare, written = 0;
  for (let run16 = 0; run16 < size && current[run16] < low; run16 += 3)
    written = emitRun(
      out,
      written,
      current[run16],
      Math.min(current[run16 + 1], low),
      current[run16 + 2]
    );
  written = emitRun(out, written, low, high, peak);
  for (let run16 = firstRunAfter(current, size, high); run16 < size; run16 += 3)
    written = emitRun(
      out,
      written,
      Math.max(current[run16], high),
      current[run16 + 1],
      current[run16 + 2]
    );
  return scratch.spare = current, scratch.runs[slot] = out, written;
}, quietenSlot = (scratch, slot, length, quiet) => {
  let size = length;
  for (let range2 = 0; range2 < quiet.length; range2 += 2) {
    let start = quiet[range2], end = quiet[range2 + 1], current = scratch.runs[slot], first = firstRunAfter(current, size, start), last = first, peak = 0;
    for (let run16 = first; run16 < size && current[run16] < end; run16 += 3)
      peak = Math.max(peak, current[run16 + 2]), last = run16;
    !(peak > 0) || raisesNothing(current, first, last, start, end) || (size = raiseSpan(scratch, slot, size, start, end, peak));
  }
  return size;
}, meetsTwoRuns = (runs, size, ranges) => {
  if (size <= 3) return !1;
  let run16 = 0;
  for (let range2 = 0; range2 < ranges.length; range2 += 2) {
    let end = ranges[range2 + 1];
    for (; run16 < size && runs[run16 + 1] <= ranges[range2]; ) run16 += 3;
    if (run16 + 3 < size && runs[run16] < end && runs[run16 + 3] < end) return !0;
  }
  return !1;
}, orderedRanges = (ranges) => {
  let pairs = [];
  for (let range2 = 0; range2 < ranges.length; range2 += 2)
    pairs.push([ranges[range2], ranges[range2 + 1]]);
  return pairs.toSorted((left, right) => left[0] - right[0]).flat();
}, levelSlot = (scratch, slot, length, level, ordered) => {
  if (!meetsTwoRuns(scratch.runs[slot], length, ordered)) return length;
  let size = length;
  for (let range2 = 0; range2 < level.length; range2 += 2) {
    let start = level[range2], end = level[range2 + 1], current = scratch.runs[slot], first = firstRunAfter(current, size, start), last = first, high = start, peak = 0;
    for (let run16 = first; run16 < size && current[run16] < end; run16 += 3)
      high = Math.min(current[run16 + 1], end), peak = Math.max(peak, current[run16 + 2]), last = run16;
    if (!(peak > 0)) continue;
    let low = Math.max(current[first], start);
    raisesNothing(current, first, last, low, high) || (size = raiseSpan(scratch, slot, size, low, high, peak));
  }
  return size;
}, startValue = (layout, runs) => {
  let { startOrder } = layout, best = 0, run16 = 0;
  for (let state of startOrder) {
    for (; run16 < runs.length && runs[run16 + 1] <= state; ) run16 += 3;
    run16 < runs.length && runs[run16] <= state && (best = Math.max(best, runs[run16 + 2]));
  }
  return best;
}, totalOf = (runs) => {
  let total = 0;
  for (let run16 = 0; run16 < runs.length; run16 += 3)
    total += (runs[run16 + 1] - runs[run16]) * runs[run16 + 2];
  return total;
};

// src/hooks/regex/amplification/sweep.ts
var BOUNDARY_SLOTS = 2 ** 24, GENERATION_LIMIT = 2 ** 31 - 1, INSERTION_LIMIT = 24, DENSE_FACTOR = 8, MASK_WIDTH = 32, NO_PRIORS = new Int32Array(0), placeEvent = (scratch, event, position2, path, delta) => {
  scratch.eventPositions[event] = position2, scratch.eventPieces[event] = scratch.pathPieces[path], scratch.eventDeltas[event] = delta;
}, countingSortEvents = (scratch, low, high) => {
  let { pathStarts, pathEnds, pathValues } = scratch;
  scratch.positionSlots = grownInt32(scratch.positionSlots, high - low + 2);
  let slots = scratch.positionSlots;
  slots.fill(0, 0, high - low + 2);
  for (let path = 0; path < scratch.pathCount; path += 1)
    slots[pathStarts[path] - low + 1] += 1, slots[pathEnds[path] - low + 1] += 1;
  for (let position2 = 1; position2 <= high - low + 1; position2 += 1)
    slots[position2] += slots[position2 - 1];
  for (let path = 0; path < scratch.pathCount; path += 1)
    placeEvent(
      scratch,
      slots[pathStarts[path] - low],
      pathStarts[path],
      path,
      pathValues[path]
    ), slots[pathStarts[path] - low] += 1, placeEvent(
      scratch,
      slots[pathEnds[path] - low],
      pathEnds[path],
      path,
      -pathValues[path]
    ), slots[pathEnds[path] - low] += 1;
}, insertionSort = (keys, count) => {
  for (let index2 = 1; index2 < count; index2 += 1) {
    let key = keys[index2], cursor = index2 - 1;
    for (; cursor >= 0 && keys[cursor] > key; )
      keys[cursor + 1] = keys[cursor], cursor -= 1;
    keys[cursor + 1] = key;
  }
}, sortEvents = (scratch) => {
  let count = scratch.pathCount * 2;
  if (count > scratch.eventKeys.length && (scratch.eventKeys = grownFloat64(scratch.eventKeys, count), scratch.eventPieces = grownInt32(scratch.eventPieces, count), scratch.eventPositions = grownInt32(scratch.eventPositions, count), scratch.eventDeltas = grownFloat64(scratch.eventDeltas, count)), count === 0) return 0;
  let { eventKeys, pathStarts, pathEnds, pathValues } = scratch, low = pathStarts[0], high = pathEnds[0];
  for (let path = 1; path < scratch.pathCount; path += 1)
    low = Math.min(low, pathStarts[path]), high = Math.max(high, pathEnds[path]);
  if (count > INSERTION_LIMIT && high - low <= count * DENSE_FACTOR)
    return countingSortEvents(scratch, low, high), count;
  for (let path = 0; path < scratch.pathCount; path += 1)
    eventKeys[path * 2] = pathStarts[path] * BOUNDARY_SLOTS + path * 2, eventKeys[path * 2 + 1] = pathEnds[path] * BOUNDARY_SLOTS + path * 2 + 1;
  count <= INSERTION_LIMIT ? insertionSort(eventKeys, count) : eventKeys.subarray(0, count).sort();
  for (let event = 0; event < count; event += 1) {
    let position2 = Math.floor(eventKeys[event] / BOUNDARY_SLOTS), slot = eventKeys[event] - position2 * BOUNDARY_SLOTS, path = slot >> 1;
    placeEvent(
      scratch,
      event,
      position2,
      path,
      (slot & 1) === 0 ? pathValues[path] : -pathValues[path]
    );
  }
  return count;
}, reserveGenerations = (scratch, needed) => {
  scratch.generation + needed < GENERATION_LIMIT || (scratch.splitStamps.fill(0), scratch.touchedStamps.fill(0), scratch.classStamps.fill(0), scratch.generation = 0);
}, nextGeneration = (scratch) => (scratch.generation += 1, scratch.generation), baseLabels = (walk3, scratch, priors, offset, classCount) => {
  let { pieceCount, loopClasses, loopClassCount } = walk3, { labels } = scratch;
  if (classCount === 1) {
    for (let piece = 0; piece < pieceCount; piece += 1)
      labels[piece] = loopClasses[piece];
    return loopClassCount;
  }
  let span = loopClassCount * classCount;
  scratch.classStamps = grownInt32(scratch.classStamps, span), scratch.classLabels = grownInt32(scratch.classLabels, span);
  let generation = nextGeneration(scratch), count = 0;
  for (let piece = 0; piece < pieceCount; piece += 1) {
    let key = loopClasses[piece] * classCount + priors[offset + piece];
    scratch.classStamps[key] !== generation && (scratch.classStamps[key] = generation, scratch.classLabels[key] = count, count += 1), labels[piece] = scratch.classLabels[key];
  }
  return count;
}, splitBy = (walk3, scratch, pieces, next) => {
  let start = walk3.pieceOffsets[pieces], end = walk3.pieceOffsets[pieces + 1];
  scratch.splitStamps = grownInt32(scratch.splitStamps, next + end - start), scratch.splitTargets = grownInt32(scratch.splitTargets, next + end - start);
  let generation = nextGeneration(scratch), { labels, splitStamps, splitTargets } = scratch, fresh = next;
  for (let item = start; item < end; item += 1) {
    let piece = walk3.pieceItems[item], old = labels[piece];
    splitStamps[old] !== generation && (splitStamps[old] = generation, splitTargets[old] = fresh, fresh += 1), labels[piece] = splitTargets[old];
  }
  return fresh;
}, touchedInto = (walk3, scratch) => {
  scratch.touchedStamps = grownInt32(
    scratch.touchedStamps,
    walk3.pieceOffsets.length - 1
  );
  let { touched, touchedStamps } = scratch, stamp = nextGeneration(scratch), count = 0;
  for (let path = 0; path < scratch.pathCount; path += 1)
    touchedStamps[scratch.pathPieces[path]] !== stamp && (touchedStamps[scratch.pathPieces[path]] = stamp, touched[count] = scratch.pathPieces[path], count += 1);
  for (let gain = 0; gain < scratch.gainCount; gain += 1)
    touchedStamps[scratch.gainPieces[gain]] !== stamp && (touchedStamps[scratch.gainPieces[gain]] = stamp, touched[count] = scratch.gainPieces[gain], count += 1);
  for (let index2 = 1; index2 < count; index2 += 1) {
    let pieces = touched[index2], cursor = index2 - 1;
    for (; cursor >= 0 && touched[cursor] > pieces; )
      touched[cursor + 1] = touched[cursor], cursor -= 1;
    touched[cursor + 1] = pieces;
  }
  scratch.touchedCount = count;
}, masksOf = (walk3, scratch, pieces) => {
  let { pieceSets, pieceCount } = walk3, { touched, touchedCount } = scratch, masks = new Int32Array(
    Math.ceil(pieces.length / MASK_WIDTH) * touchedCount
  );
  for (let chunk = 0; chunk * MASK_WIDTH < pieces.length; chunk += 1)
    for (let index2 = 0; index2 < touchedCount; index2 += 1) {
      let row = touched[index2] * pieceCount, width = Math.min(MASK_WIDTH, pieces.length - chunk * MASK_WIDTH), mask = 0;
      for (let bit = 0; bit < width; bit += 1)
        pieceSets[row + pieces[chunk * MASK_WIDTH + bit]] === 1 && (mask |= 1 << bit);
      masks[chunk * touchedCount + index2] = mask;
    }
  return masks;
}, representativesInto = (walk3, scratch, priors, offset, classCount, klass) => {
  let { pieceCount } = walk3;
  reserveGenerations(scratch, scratch.pathCount + scratch.gainCount + 4), touchedInto(walk3, scratch);
  let { touched, touchedCount, choiceTable } = scratch, hash = hashRuns(klass, touched, touchedCount), known = findRuns(choiceTable, klass, touched, touchedCount, hash);
  if (known !== -1) return scratch.choices[known];
  scratch.labels = grownInt32(scratch.labels, pieceCount), scratch.representatives = grownInt32(scratch.representatives, pieceCount);
  let next = baseLabels(walk3, scratch, priors, offset, classCount);
  for (let index2 = 0; index2 < touchedCount; index2 += 1)
    next = splitBy(walk3, scratch, touched[index2], next);
  scratch.splitStamps = grownInt32(scratch.splitStamps, next);
  let generation = nextGeneration(scratch), { labels, splitStamps, representatives } = scratch, count = 0;
  for (let piece = 0; piece < pieceCount; piece += 1)
    splitStamps[labels[piece]] !== generation && (splitStamps[labels[piece]] = generation, representatives[count] = piece, count += 1);
  let pieces = representatives.slice(0, count), choice = {
    pieces,
    masks: masksOf(walk3, scratch, pieces)
  };
  return addRuns(choiceTable, klass, touched, touchedCount, hash), scratch.choices.push(choice), choice;
}, blindRepresentativesInto = (walk3, scratch) => representativesInto(walk3, scratch, NO_PRIORS, 0, 1, 0), resetSlots = (scratch, count) => {
  for (count > scratch.levels.length && (scratch.runLengths = grownInt32(scratch.runLengths, count), scratch.levels = grownFloat64(scratch.levels, count), scratch.previous = grownInt32(scratch.previous, count)); scratch.runs.length < count; ) scratch.runs.push([]);
  scratch.runLengths.fill(0, 0, count), scratch.levels.fill(0, 0, count);
}, addBoundary = (runs, runLengths, levels, previous2, slot, position2, delta, cap) => {
  let level = levels[slot];
  level > 0 && position2 !== previous2[slot] && (runLengths[slot] = emitRun(
    runs[slot],
    runLengths[slot],
    previous2[slot],
    position2,
    Math.min(level, cap)
  )), levels[slot] = level + delta, previous2[slot] = position2;
}, sweepPieces = (scratch, walk3, eventCount, choice, cap) => {
  let count = choice.pieces.length;
  resetSlots(scratch, count), scratch.readers = grownInt32(scratch.readers, walk3.pieceOffsets.length - 1);
  let { eventPieces, eventPositions, eventDeltas, readers } = scratch, { runs, runLengths, levels, previous: previous2, touched, touchedCount } = scratch;
  for (let chunk = 0; chunk * MASK_WIDTH < count; chunk += 1) {
    for (let index2 = 0; index2 < touchedCount; index2 += 1)
      readers[touched[index2]] = choice.masks[chunk * touchedCount + index2];
    for (let event = 0; event < eventCount; event += 1) {
      let position2 = eventPositions[event], delta = eventDeltas[event];
      for (let mask = readers[eventPieces[event]]; mask !== 0; mask &= mask - 1)
        addBoundary(
          runs,
          runLengths,
          levels,
          previous2,
          chunk * MASK_WIDTH + 31 - Math.clz32(mask & -mask),
          position2,
          delta,
          cap
        );
    }
  }
}, sweepEvery = (scratch, eventCount, cap) => {
  resetSlots(scratch, 1);
  let { runs, runLengths, levels, previous: previous2 } = scratch;
  for (let event = 0; event < eventCount; event += 1)
    addBoundary(
      runs,
      runLengths,
      levels,
      previous2,
      0,
      scratch.eventPositions[event],
      scratch.eventDeltas[event],
      cap
    );
}, gainsInto = (scratch, walk3, piece, cap, gains, offset) => {
  let { pieceSets, pieceCount, loopCount } = walk3;
  for (let loop = 0; loop < loopCount; loop += 1) gains[offset + loop] = 0;
  for (let gain = 0; gain < scratch.gainCount; gain += 1) {
    if (pieceSets[scratch.gainPieces[gain] * pieceCount + piece] === 0)
      continue;
    let slot = offset + scratch.gainLoops[gain];
    gains[slot] = Math.min(gains[slot] + scratch.gainValues[gain], cap);
  }
};

// src/hooks/regex/amplification/attempts.ts
var ATTEMPT_FRONTIERS = 2e4, HORIZON = 64, depthsOf = (moves, roots) => {
  let { targets } = moves, size = stateCountOf(moves), depth = new Int32Array(size).fill(-1), open = new Uint8Array(size), stackStates = new Int32Array(size), stackSlots = new Int32Array(size);
  for (let root of roots) {
    if (depth[root] !== -1) continue;
    let height = 1;
    for (stackStates[0] = root, stackSlots[0] = targetsStart(moves, root), open[root] = 1; height > 0; ) {
      let state = stackStates[height - 1], slot = stackSlots[height - 1];
      if (slot < targetsEnd(moves, state)) {
        let target = targets[slot];
        if (stackSlots[height - 1] = slot + 1, open[target]) return null;
        if (depth[target] !== -1) continue;
        open[target] = 1, stackStates[height] = target, stackSlots[height] = targetsStart(moves, target), height += 1;
        continue;
      }
      let deepest = 0;
      for (let edge = targetsStart(moves, state); edge < targetsEnd(moves, state); edge += 1)
        deepest = Math.max(deepest, depth[targets[edge]] + 1);
      depth[state] = deepest, open[state] = 0, height -= 1;
    }
  }
  return depth;
}, mergeTargets = (opening, piece, targets) => {
  opening.set(piece, [.../* @__PURE__ */ new Set([...opening.get(piece) ?? [], ...targets])]);
}, lifetimesOf = (layout, moves, firstStates, length, meter) => {
  let { entryOffsets, entryPieces, targetOffsets, targets } = moves, size = stateCountOf(moves), kinds = layout.alphabet.pieceKinds, entryMasks = new Uint8Array(size), entryCounts = new Uint8Array(size), entryKinds = new Uint8Array(size * 5), openings = /* @__PURE__ */ new Map();
  for (let entry2 = 0; entry2 < entryPieces.length; entry2 += 1)
    for (let item = targetOffsets[entry2]; item < targetOffsets[entry2 + 1]; item += 1) {
      let target = targets[item], kind = kinds[entryPieces[entry2]];
      (entryMasks[target] & 1 << kind) === 0 && (entryMasks[target] |= 1 << kind, entryKinds[target * 5 + entryCounts[target]] = kind, entryCounts[target] += 1);
    }
  for (let state of layout.loopStates)
    for (let loop = moves.loopOffsets[state]; loop < moves.loopOffsets[state + 1]; loop += 1) {
      let kind = kinds[moves.loopPieces[loop]], target = moves.loopTargets[loop], opening = openings.get(kind) ?? /* @__PURE__ */ new Map();
      for (let entry2 = entryOffsets[target]; entry2 < entryOffsets[target + 1]; entry2 += 1)
        mergeTargets(
          opening,
          entryPieces[entry2],
          targets.subarray(targetOffsets[entry2], targetOffsets[entry2 + 1])
        );
      openings.set(kind, opening);
    }
  let openingOf = (older) => {
    let opening = /* @__PURE__ */ new Map();
    for (let entry2 = 0; entry2 < entryCounts[older]; entry2 += 1)
      for (let [piece, targets2] of openings.get(
        entryKinds[older * 5 + entry2]
      ) ?? [])
        mergeTargets(opening, piece, targets2);
    return opening;
  }, pairs = createPairs(), longest = new Int32Array(size).fill(-1), lifetimes = new Int32Array(length), stamps = new Int32Array(size), layer = [...firstStates], next = [], longestFrom = (older) => {
    if (longest[older] !== -1) return longest[older];
    let best = 0;
    for (let [piece, youngTargets] of openingOf(older)) {
      let old = entryOf(moves, older, piece);
      if (old !== -1)
        for (let item = targetOffsets[old]; item < targetOffsets[old + 1]; item += 1)
          for (let youngTarget of youngTargets)
            best = Math.max(
              best,
              outlives(moves, pairs, targets[item], youngTarget, HORIZON, meter) ? HORIZON : livesOf(pairs, targets[item], youngTarget)
            );
    }
    return longest[older] = best, best;
  };
  for (let distance = 1; distance < length && layer.length > 0; distance += 1) {
    for (let older of layer)
      lifetimes[distance] = Math.max(lifetimes[distance], longestFrom(older));
    if (lifetimes[distance] === HORIZON) break;
    spend(meter, layer.length), next.length = 0;
    for (let state of layer)
      for (let edge = targetsStart(moves, state); edge < targetsEnd(moves, state); edge += 1)
        stamps[targets[edge]] !== distance && (stamps[targets[edge]] = distance, next.push(targets[edge]));
    let current = layer;
    layer = next, next = current;
  }
  return lifetimes;
}, packedAttempts = (lifetimes, length) => {
  let spacing = new Array(HORIZON + 1).fill(1 / 0);
  for (let distance = lifetimes.length - 1; distance > 0; distance -= 1)
    for (let shared = 1; shared <= lifetimes[distance]; shared += 1)
      spacing[shared] = distance;
  let attempts = 0;
  for (let depth = 1; depth <= length; depth += spacing[Math.min(depth, HORIZON)])
    attempts += 1;
  return attempts;
}, openFrontiers = (layout, walk3, cap, scratch, visit) => {
  let { groups } = walk3;
  if (scratch.gainCount = 0, layout.loopStates.length === 0) {
    scratch.pathCount = 0;
    for (let state of layout.startStates)
      pushPath(scratch, -1, state, state + 1, 1);
    sweepEvery(scratch, sortEvents(scratch), cap), visit(0, scratch.runLengths[0]);
    return;
  }
  for (let loop = 0; loop < layout.loopStates.length; loop += 1) {
    scratch.pathCount = 0;
    for (let group = 0; group < groups.count; group += 1)
      groups.kinds[group] === GAIN && groups.sources[group] === loop && pushPath(
        scratch,
        groups.pieces[group],
        groups.targets[group],
        groups.targets[group] + 1,
        groups.multiplicities[group]
      );
    let events = sortEvents(scratch), choice = blindRepresentativesInto(walk3, scratch);
    sweepPieces(scratch, walk3, events, choice, cap);
    for (let index2 = 0; index2 < choice.pieces.length; index2 += 1)
      visit(index2, scratch.runLengths[index2]);
  }
}, attemptPaths = (layout, walk3, cap, meter) => {
  let scratch = createScratch(), seen = createRunTable(), most = 0, visit = (slot, length) => {
    if (length === 0) return;
    let runs = scratch.runs[slot], hash = hashRuns(0, runs, length);
    findRuns(seen, 0, runs, length, hash) === -1 && (most = Math.max(
      most,
      totalOf(seen.runs[addRuns(seen, 0, runs, length, hash)])
    ));
  };
  openFrontiers(layout, walk3, cap, scratch, visit);
  for (let head = 0; head < seen.count && most < cap; head += 1) {
    if (seen.count > ATTEMPT_FRONTIERS) return 1 / 0;
    advanceInto(walk3, seen.runs[head], scratch), spend(meter, 1 + scratch.incidences);
    let events = sortEvents(scratch), choice = blindRepresentativesInto(walk3, scratch);
    sweepPieces(scratch, walk3, events, choice, cap);
    for (let index2 = 0; index2 < choice.pieces.length; index2 += 1)
      visit(index2, scratch.runLengths[index2]);
  }
  return Math.min(most, cap);
}, loosePaths = (layout, lookahead, cap, meter) => {
  let walk3 = walkOf(layout, lookahead, 0), quiet = chainRanges(walk3, () => !0), scratch = createScratch(), seen = createRunTable(), gains = new Int32Array(walk3.loopCount), most = 0, visit = (slot, length) => {
    let runs = scratch.runs[slot], hash = hashRuns(0, runs, length);
    findRuns(seen, 0, runs, length, hash) === -1 && (most = Math.max(
      most,
      startValue(layout, seen.runs[addRuns(seen, 0, runs, length, hash)])
    ));
  };
  resetSlots(scratch, 1), scratch.runs[0][0] = 0, scratch.runs[0][1] = layout.stateCount, scratch.runs[0][2] = 1, visit(0, quietenSlot(scratch, 0, 3, quiet));
  for (let head = 0; head < seen.count && most < cap; head += 1) {
    if (seen.count > ATTEMPT_FRONTIERS) return 1 / 0;
    spreadInto(walk3, seen.runs[head], scratch), spend(meter, 1 + scratch.incidences);
    let events = sortEvents(scratch), choice = blindRepresentativesInto(walk3, scratch);
    sweepPieces(scratch, walk3, events, choice, cap);
    for (let index2 = 0; index2 < choice.pieces.length; index2 += 1) {
      gainsInto(scratch, walk3, choice.pieces[index2], cap, gains, 0);
      for (let loop = 0; loop < walk3.loopCount; loop += 1)
        most = Math.max(most, gains[loop]);
      visit(
        index2,
        quietenSlot(scratch, index2, scratch.runLengths[index2], quiet)
      );
    }
  }
  return Math.min(most, cap);
}, firstStatesOf = (layout, moves) => {
  if (layout.loopStates.length === 0)
    return [...new Set(layout.ordered.starts)];
  let firstStates = /* @__PURE__ */ new Set();
  for (let state of layout.loopStates)
    for (let item = targetsStart(moves, state); item < targetsEnd(moves, state); item += 1)
      firstStates.add(moves.targets[item]);
  return [...firstStates];
}, attemptBound = (layout, lookahead, cap, meter) => {
  let moves = movesOf(layout, lookahead, 0), searching = layout.loopStates.length > 0, firstStates = firstStatesOf(layout, moves), depths = depthsOf(moves, firstStates);
  if (depths === null) return 1 / 0;
  let strict = attemptPaths(layout, walkOf(layout, lookahead, 0), cap, meter), paths = strict === 1 / 0 ? loosePaths(layout, lookahead, cap, meter) : strict;
  if (!searching) return paths;
  let deepest = 0;
  for (let state of firstStates) deepest = Math.max(deepest, depths[state]);
  return 1 + packedAttempts(
    lifetimesOf(layout, moves, firstStates, 1 + deepest, meter),
    1 + deepest
  ) * paths;
};

// src/hooks/regex/amplification/confirmation.ts
var countAlong = (layout, input, length, cap, meter) => {
  let { ordered } = layout, lookahead = lookaheadAlong(ordered, readerFor(layout), input, meter), blocked = [], frontier = new Map(ordered.starts.map((state) => [state, 1]));
  for (let index2 = 0; index2 < length; index2 += 1) {
    let next = /* @__PURE__ */ new Map();
    spend(meter, frontier.size + 1);
    for (let [state, count] of frontier) {
      blocked.length = 0;
      for (let event of ordered.states[state].events.get(input[index2]) ?? [])
        runsInOrder(event, lookahead, index2, index2 + 1, blocked) && next.set(
          event.target,
          Math.min((next.get(event.target) ?? 0) + count, cap)
        );
    }
    frontier = next;
  }
  let total = 0;
  for (let count of frontier.values()) total += count;
  return Math.min(total, cap);
}, confirms = (layout, witness, ceiling, meter) => {
  let kinds = layout.alphabet.pieceKinds;
  return [
    [],
    ...[...new Set(kinds)].map((kind) => [kinds.indexOf(kind)])
  ].some(
    (follower) => countAlong(
      layout,
      [...witness, ...follower],
      witness.length,
      ceiling + 1,
      meter
    ) > ceiling
  );
};

// src/hooks/regex/amplification/score.ts
var createNodes = (loops) => ({
  table: createRunTable(),
  parents: new Int32Array(64),
  pieces: new Int32Array(64),
  stepStarts: new Int32Array(64),
  stepEnds: new Int32Array(64),
  expanded: new Uint8Array(64),
  values: new Int32Array(64 * loops),
  via: new Int32Array(64 * loops * 3).fill(-1)
}), reserveNode = (nodes, loops) => {
  let size = nodes.table.count + 1;
  size <= nodes.parents.length || (nodes.parents = grownInt32(nodes.parents, size), nodes.pieces = grownInt32(nodes.pieces, size), nodes.stepStarts = grownInt32(nodes.stepStarts, size), nodes.stepEnds = grownInt32(nodes.stepEnds, size), nodes.expanded = grownUint8(nodes.expanded, size), nodes.values = grownInt32(nodes.values, nodes.parents.length * loops), nodes.via = grownInt32(nodes.via, nodes.parents.length * loops * 3, -1));
}, createSteps = (loops) => ({
  count: 0,
  targets: new Int32Array(256),
  pieces: new Int32Array(256),
  gains: new Int32Array(256 * loops)
}), reserveStep = (steps, loops) => {
  let step = steps.count;
  return step < steps.targets.length || (steps.targets = grownInt32(steps.targets, step + 1), steps.pieces = grownInt32(steps.pieces, step + 1), steps.gains = grownInt32(steps.gains, steps.targets.length * loops)), step;
}, scoreAt = (state, node2) => {
  let { layout, nodes, loops } = state, score = 0;
  for (let loop of layout.startLoops)
    score = Math.max(score, nodes.values[node2 * loops + loop]);
  return Math.max(score, startValue(layout, nodes.table.runs[node2]));
}, recordBest = (state, node2) => {
  let score = scoreAt(state, node2);
  score <= state.best || (state.best = score, state.bestNode = node2);
}, internNode = (state, klass, runs, length, parent, piece) => {
  let { nodes } = state, hash = hashRuns(klass, runs, length), known = findRuns(nodes.table, klass, runs, length, hash);
  if (known !== -1) return known;
  reserveNode(nodes, state.loops);
  let node2 = addRuns(nodes.table, klass, runs, length, hash);
  return nodes.parents[node2] = parent, nodes.pieces[node2] = piece, spend(state.meter, 1 + length), recordBest(state, node2), node2;
}, walkFor = (state, klass) => {
  let known = state.walks[klass];
  if (known !== void 0) return known;
  let walk3 = walkOf(state.layout, state.lookahead, klass);
  return spend(state.meter, state.layout.ordered.states.length), state.walks[klass] = walk3, walk3;
}, relax = (state, from, step, walk3) => {
  let { nodes, steps, loops, cap } = state, { values, via } = nodes, target = steps.targets[step], piece = steps.pieces[step], changed = !1;
  for (let loop = 0; loop < loops; loop += 1) {
    let next = walk3.loopNext[piece * loops + loop], carried = next === NO_LOOP ? 0 : values[from * loops + next], value = Math.min(steps.gains[step * loops + loop] + carried, cap), slot = target * loops + loop;
    value <= values[slot] || (values[slot] = value, via[slot * 3] = from, via[slot * 3 + 1] = next, via[slot * 3 + 2] = piece, changed = !0);
  }
  return changed;
}, propagate = (state, from, walk3) => {
  let { nodes, steps } = state, last = nodes.stepEnds[from];
  for (let step = nodes.stepStarts[from]; step < last; step += 1) {
    if (spend(state.meter, 1), !relax(state, from, step, walk3)) continue;
    let target = steps.targets[step];
    recordBest(state, target), nodes.expanded[target] === 1 && state.dirty.push(target);
  }
}, expand = (state, node2) => {
  let { lookahead, scratch, cap, loops, steps } = state, klass = state.nodes.table.klasses[node2], walk3 = walkFor(state, klass), priors = klass * lookahead.pieces;
  spreadInto(walk3, state.nodes.table.runs[node2], scratch), spend(state.meter, 1 + scratch.incidences);
  let events = sortEvents(scratch), choice = representativesInto(
    walk3,
    scratch,
    lookahead.back,
    priors,
    lookahead.classCount,
    klass
  );
  sweepPieces(scratch, walk3, events, choice, cap), state.nodes.stepStarts[node2] = steps.count;
  for (let index2 = 0; index2 < choice.pieces.length; index2 += 1) {
    let piece = choice.pieces[index2], step = reserveStep(steps, loops);
    gainsInto(scratch, walk3, piece, cap, steps.gains, step * loops);
    let length = levelSlot(
      scratch,
      index2,
      quietenSlot(scratch, index2, scratch.runLengths[index2], state.quiet),
      state.level,
      state.levelOrder
    ), target = internNode(
      state,
      lookahead.back[priors + piece],
      scratch.runs[index2],
      length,
      node2,
      piece
    );
    steps.targets[step] = target, steps.pieces[step] = piece, steps.count = step + 1;
  }
  state.nodes.stepEnds[node2] = steps.count, state.nodes.expanded[node2] = 1, propagate(state, node2, walk3);
}, witnessOf = (state, node2) => {
  let { nodes, loops, layout } = state, pieces = [], score = scoreAt(state, node2), loop = NO_LOOP, current = node2;
  for (let startLoop of layout.startLoops)
    if (nodes.values[node2 * loops + startLoop] === score) {
      loop = startLoop;
      break;
    }
  for (; pieces.length <= nodes.table.count; ) {
    let slot = (current * loops + loop) * 3, previous2 = loop === NO_LOOP ? nodes.parents[current] : nodes.via[slot];
    if (previous2 === -1) break;
    pieces.push(loop === NO_LOOP ? nodes.pieces[current] : nodes.via[slot + 2]), loop !== NO_LOOP && (loop = nodes.via[slot + 1]), current = previous2;
  }
  return pieces;
}, walkScore = (layout, lookahead, cap, meter, { limit, quiet, level }) => {
  let loops = layout.loopStates.length, state = {
    layout,
    lookahead,
    cap,
    meter,
    quiet,
    level,
    levelOrder: orderedRanges(level),
    loops,
    walks: Array.from({ length: lookahead.classCount }, () => {
    }),
    nodes: createNodes(loops),
    steps: createSteps(loops),
    scratch: createScratch(),
    dirty: [],
    best: 0,
    bestNode: 0
  }, full = layout.stateCount > 0 ? [0, layout.stateCount, 1] : [];
  for (let klass = 0; klass < lookahead.classCount; klass += 1) {
    let start = internNode(state, klass, full, full.length, -1, -1);
    state.nodes.values.fill(1, start * loops, (start + 1) * loops), recordBest(state, start);
  }
  for (let head = 0; head < state.nodes.table.count && state.best < cap; head += 1) {
    if (state.nodes.table.count > limit)
      return {
        score: state.best,
        complete: !1,
        witness: witnessOf(state, state.bestNode)
      };
    expand(state, head);
    for (let next = state.dirty.pop(); next !== void 0 && state.best < cap; next = state.dirty.pop())
      propagate(state, next, walkFor(state, state.nodes.table.klasses[next]));
  }
  return {
    score: Math.min(state.best, cap),
    complete: state.best < cap,
    witness: witnessOf(state, state.bestNode)
  };
};

// src/hooks/regex/amplification/amplification.ts
var EXACT_NODES = 2e4, LOOSE_NODES = 2e5, LEVEL_NODES = 7e5, pastCeiling = (layout, witness, ceiling, meter) => {
  if (confirms(layout, witness, ceiling, meter)) return ceiling + 1;
  let precise = walkScore(
    layout,
    lookaheadFrom(
      readerFor(layout),
      layout.ordered,
      layout.alphabet,
      consultedFor(layout),
      meter
    ),
    ceiling + 1,
    meter,
    { limit: EXACT_NODES, quiet: [], level: [] }
  );
  return precise.complete || precise.score > ceiling ? precise.score : reachCap();
}, walkBound = (layout, sure, room, meter) => {
  let walk3 = walkScore(layout, sure, room + 1, meter, {
    limit: LEVEL_NODES,
    quiet: [],
    level: steadyRanges(walkOf(layout, sure, 0))
  });
  return walk3.complete ? walk3.score : 1 / 0;
}, searchBound = (job, room) => {
  let layout = layoutOf(job), sure = sureOf(layout), bound = attemptBound(layout, sure, room + 1, job.meter);
  return bound <= room ? bound : walkBound(layout, sure, room, job.meter);
}, isBackreference = (node2) => node2.kind === "backreference", leveledBound = (job, layout, sure, ceiling) => {
  let { root } = job;
  if (root.kind !== "alternation" || someNode(root, isBackreference))
    return walkBound(layout, sure, ceiling, job.meter);
  let total = 0;
  for (let branch of root.branches)
    if (total += searchBound({ ...job, root: branch }, ceiling - total), total > ceiling) return total;
  return total;
}, amplifies = (job, ceiling) => {
  let cap = ceiling + 1, layout = layoutOf(job), sure = sureOf(layout);
  if (attemptBound(layout, sure, cap, job.meter) <= ceiling) return !1;
  let exact = walkScore(layout, sure, cap, job.meter, {
    limit: EXACT_NODES,
    quiet: [],
    level: []
  });
  if (exact.complete) return !1;
  if (exact.score > ceiling)
    return pastCeiling(layout, exact.witness, ceiling, job.meter) > ceiling;
  if (leveledBound(job, layout, sure, ceiling) <= ceiling) return !1;
  let loose = walkScore(layout, sure, cap, job.meter, {
    limit: LOOSE_NODES,
    quiet: quietRanges(walkOf(layout, sure, 0)),
    level: []
  });
  return loose.complete ? !1 : loose.score > ceiling ? pastCeiling(layout, loose.witness, ceiling, job.meter) > ceiling : reachCap();
};

// src/hooks/regex/growth/product.ts
var labelPiece = (product2, label) => Math.floor(label / (product2.wildcard + 1)), labelClass = (product2, label) => label % (product2.wildcard + 1), buildProduct = (ordered, lookahead, leadsToCycle, needsClass, meter) => {
  let wildcard = lookahead.classCount, stride = wildcard + 1, nodeIds = /* @__PURE__ */ new Map(), nodeState = [], nodeClass = [], sources = [], targets = [], labels = [], blocked = [], nodeOf = (state, klass) => {
    let key = state * stride + klass, known = nodeIds.get(key);
    return known !== void 0 ? known : (nodeIds.set(key, nodeState.length), nodeState.push(state), nodeClass.push(klass), spend(meter, 1), nodeState.length - 1);
  }, connect = (node2, events, piece, klass) => {
    let next = klass % wildcard, current = nodeClass[node2] % wildcard;
    blocked.length = 0;
    for (let event of events)
      runsInOrder(event, lookahead, current, next, blocked) && leadsToCycle[event.target] && (sources.push(node2), targets.push(
        nodeOf(event.target, needsClass[event.target] ? klass : wildcard)
      ), labels.push(piece * stride + klass), spend(meter, 1));
  };
  for (let start of ordered.starts)
    if (leadsToCycle[start]) {
      if (!needsClass[start]) {
        nodeOf(start, wildcard);
        continue;
      }
      for (let klass = 0; klass < wildcard; klass += 1) nodeOf(start, klass);
    }
  for (let node2 = 0; node2 < nodeState.length; node2 += 1) {
    let state = ordered.states[nodeState[node2]], klass = nodeClass[node2];
    for (let [piece, events] of state.events) {
      if (klass === wildcard) {
        connect(node2, events, piece, wildcard);
        continue;
      }
      for (let next of predecessorsOf(lookahead, klass, piece))
        connect(node2, events, piece, next);
    }
  }
  return {
    graph: toDigraph(nodeState.length, sources, targets, labels),
    wildcard
  };
};

// src/hooks/regex/growth/ambiguity.ts
var PAIRWISE_LIMIT = 16, DIAGONAL = 1, APART = 2, pairKey = (left, right, width) => left * width + right, tripleKey = (first, second, third, width) => (first * width + second) * width + third, forks = (targets) => targets.length > 1, nodeSteps = (product2, node2, keep2) => {
  let { offsets, targets, labels } = product2.graph, byPiece = /* @__PURE__ */ new Map();
  for (let edge = offsets[node2]; edge < offsets[node2 + 1]; edge += 1) {
    let target = targets[edge];
    if (!keep2(target)) continue;
    let piece = labelPiece(product2, labels[edge]), klass = labelClass(product2, labels[edge]), byClass = byPiece.get(piece);
    byClass === void 0 && (byClass = /* @__PURE__ */ new Map(), byPiece.set(piece, byClass));
    let classTargets = byClass.get(klass);
    classTargets === void 0 ? byClass.set(klass, [target]) : classTargets.push(target);
  }
  return byPiece;
}, stepsWithin = (product2, nodes, keep2) => {
  let steps = /* @__PURE__ */ new Map();
  for (let node2 of nodes) steps.set(node2, nodeSteps(product2, node2, keep2));
  return steps;
}, someTargets = (steps, predicate) => {
  for (let byPiece of steps.values())
    for (let byClass of byPiece.values())
      for (let targets of byClass.values())
        if (predicate(targets)) return !0;
  return !1;
}, repeats = (targets) => {
  if (targets.length > PAIRWISE_LIMIT)
    return new Set(targets).size !== targets.length;
  for (let index2 = 1; index2 < targets.length; index2 += 1)
    for (let earlier = 0; earlier < index2; earlier += 1)
      if (targets[earlier] === targets[index2]) return !0;
  return !1;
}, followPairs = (exploration, head, width, leftTargets, rightTargets) => {
  if (rightTargets !== void 0)
    for (let leftTarget of leftTargets)
      for (let rightTarget of rightTargets)
        follow(
          exploration,
          head,
          pairKey(leftTarget, rightTarget, width),
          leftTarget,
          rightTarget,
          0
        );
}, followTriples = (exploration, head, width, firstTargets, secondTargets, thirdTargets) => {
  if (thirdTargets !== void 0)
    for (let nextFirst of firstTargets)
      for (let nextSecond of secondTargets)
        for (let nextThird of thirdTargets)
          follow(
            exploration,
            head,
            tripleKey(nextFirst, nextSecond, nextThird, width),
            nextFirst,
            nextSecond,
            nextThird
          );
}, followThirds = (exploration, head, width, wildcard, joined, firstTargets, secondTargets, thirdByClass) => {
  if (secondTargets !== void 0) {
    if (joined === wildcard) {
      for (let thirdTargets of thirdByClass.values())
        followTriples(
          exploration,
          head,
          width,
          firstTargets,
          secondTargets,
          thirdTargets
        );
      return;
    }
    followTriples(
      exploration,
      head,
      width,
      firstTargets,
      secondTargets,
      thirdByClass.get(joined)
    ), followTriples(
      exploration,
      head,
      width,
      firstTargets,
      secondTargets,
      thirdByClass.get(wildcard)
    );
  }
}, createExploration = (meter) => ({
  index: createKeyIndex(),
  sources: new Int32Array(1024),
  targets: new Int32Array(1024),
  edges: 0,
  parts: new Int32Array(256 * 3),
  meter
}), reachKey = (exploration, key, first, second, third) => {
  let { index: index2 } = exploration, known = index2.count, entry2 = internKey(index2, key);
  return entry2 < known || (exploration.parts = grownInt32(exploration.parts, index2.keys.length * 3), exploration.parts[entry2 * 3] = first, exploration.parts[entry2 * 3 + 1] = second, exploration.parts[entry2 * 3 + 2] = third, spend(exploration.meter, 1)), entry2;
}, follow = (exploration, head, key, first, second, third) => {
  let edge = exploration.edges;
  edge === exploration.sources.length && (exploration.sources = grownInt32(exploration.sources, edge + 1), exploration.targets = grownInt32(exploration.targets, edge + 1)), exploration.sources[edge] = head, exploration.edges = edge + 1, exploration.targets[edge] = reachKey(exploration, key, first, second, third), spend(exploration.meter, 1);
}, groupsOf = (exploration) => stronglyConnected(
  toDigraph(
    exploration.index.count,
    exploration.sources.subarray(0, exploration.edges),
    exploration.targets.subarray(0, exploration.edges),
    new Int32Array(exploration.edges)
  ),
  !1
).component, firstOf = (exploration, node2) => exploration.parts[node2 * 3], secondOf = (exploration, node2) => exploration.parts[node2 * 3 + 1], thirdOf = (exploration, node2) => exploration.parts[node2 * 3 + 2], growsExponentially = (product2, steps, members, meter) => {
  if (someTargets(steps, repeats)) return !0;
  if (!someTargets(steps, forks)) return !1;
  let width = product2.graph.size, { wildcard } = product2, exploration = createExploration(meter);
  for (let node2 of members)
    reachKey(exploration, pairKey(node2, node2, width), node2, node2, 0);
  for (let head = 0; head < exploration.index.count; head += 1) {
    let leftSteps = steps.get(firstOf(exploration, head)), rightSteps = steps.get(secondOf(exploration, head));
    if (!(!leftSteps || !rightSteps))
      for (let [piece, leftByClass] of leftSteps) {
        let rightByClass = rightSteps.get(piece);
        if (rightByClass)
          for (let [leftClass, leftTargets] of leftByClass) {
            if (leftClass === wildcard) {
              for (let rightTargets of rightByClass.values())
                followPairs(exploration, head, width, leftTargets, rightTargets);
              continue;
            }
            followPairs(
              exploration,
              head,
              width,
              leftTargets,
              rightByClass.get(leftClass)
            ), followPairs(
              exploration,
              head,
              width,
              leftTargets,
              rightByClass.get(wildcard)
            );
          }
      }
  }
  let groups = groupsOf(exploration), sides = new Uint8Array(exploration.index.count);
  for (let node2 = 0; node2 < exploration.index.count; node2 += 1)
    sides[groups[node2]] |= firstOf(exploration, node2) === secondOf(exploration, node2) ? DIAGONAL : APART;
  return sides.includes(DIAGONAL | APART);
}, connectsTwoLoops = (product2, component, members, source, target, between, sourceSteps, targetSteps, meter) => {
  let width = product2.graph.size;
  width * width * width > Number.MAX_SAFE_INTEGER && reachCap();
  let { wildcard } = product2, bridge = /* @__PURE__ */ new Map(), exploration = createExploration(meter), inBetween = (node2) => between[component[node2]] === 1, bridgeOf = (node2) => {
    let known = bridge.get(node2);
    if (known !== void 0) return known;
    let steps = nodeSteps(product2, node2, inBetween);
    return bridge.set(node2, steps), steps;
  };
  for (let first of members[source])
    for (let third of members[target])
      reachKey(
        exploration,
        tripleKey(first, first, third, width),
        first,
        first,
        third
      );
  for (let head = 0; head < exploration.index.count; head += 1) {
    let first = firstOf(exploration, head), second = secondOf(exploration, head), third = thirdOf(exploration, head);
    second === third && component[second] === target && follow(
      exploration,
      head,
      tripleKey(first, first, second, width),
      first,
      first,
      second
    );
    let firstSteps = sourceSteps.get(first), secondSteps = bridgeOf(second), thirdSteps = targetSteps.get(third);
    if (!(!firstSteps || !secondSteps || !thirdSteps))
      for (let [piece, firstByClass] of firstSteps) {
        let secondByClass = secondSteps.get(piece), thirdByClass = thirdSteps.get(piece);
        if (!(!secondByClass || !thirdByClass))
          for (let [firstClass, firstTargets] of firstByClass) {
            if (firstClass === wildcard) {
              for (let [secondClass, secondTargets] of secondByClass)
                followThirds(
                  exploration,
                  head,
                  width,
                  wildcard,
                  secondClass,
                  firstTargets,
                  secondTargets,
                  thirdByClass
                );
              continue;
            }
            followThirds(
              exploration,
              head,
              width,
              wildcard,
              firstClass,
              firstTargets,
              secondByClass.get(firstClass),
              thirdByClass
            ), followThirds(
              exploration,
              head,
              width,
              wildcard,
              firstClass,
              firstTargets,
              secondByClass.get(wildcard),
              thirdByClass
            );
          }
      }
  }
  let { index: index2 } = exploration, groups = groupsOf(exploration);
  for (let node2 = 0; node2 < index2.count; node2 += 1) {
    let first = firstOf(exploration, node2), second = secondOf(exploration, node2), third = thirdOf(exploration, node2);
    if (component[third] !== target || first !== second) continue;
    let partner = keyOf(index2, tripleKey(first, third, third, width));
    if (partner !== -1 && groups[partner] === groups[node2]) return !0;
  }
  return !1;
}, reachableGroups = (start, links, meter) => (spend(meter, links.length), reach2(links.length, [start], (group, visit) => {
  for (let next of links[group]) visit(next);
})), pieceClassesOf = (steps) => {
  let pieces = /* @__PURE__ */ new Map();
  for (let byPiece of steps.values())
    for (let [piece, byClass] of byPiece) {
      let classes = pieces.get(piece) ?? /* @__PURE__ */ new Set();
      for (let klass of byClass.keys()) classes.add(klass);
      pieces.set(piece, classes);
    }
  return pieces;
}, sharesStep = (left, right, wildcard) => {
  for (let [piece, leftClasses] of left) {
    let rightClasses = right.get(piece);
    if (rightClasses) {
      if (leftClasses.has(wildcard) || rightClasses.has(wildcard)) return !0;
      for (let klass of leftClasses) if (rightClasses.has(klass)) return !0;
    }
  }
  return !1;
}, assessGrowth = (product2, meter) => {
  let { graph, wildcard } = product2, components = stronglyConnected(graph), { component, members } = components, count = members.length, atomic = members.map((group) => !isCyclic(graph, group)), selfSteps = new Array(count), stepsOf = (group) => selfSteps[group] ??= stepsWithin(
    product2,
    members[group],
    (target) => component[target] === group
  );
  for (let group = 0; group < count; group += 1)
    if (!atomic[group] && growsExponentially(product2, stepsOf(group), members[group], meter))
      return { exponential: !0, degree: 2 };
  let { forward, backward } = componentLinks(graph, components), pieceClasses = members.map(
    (_, group) => atomic[group] ? /* @__PURE__ */ new Map() : pieceClassesOf(stepsOf(group))
  ), degrees = new Int32Array(count), between = new Uint8Array(count);
  for (let group = 0; group < count; group += 1) {
    let deepest = 0;
    for (let next of forward[group])
      deepest = Math.max(deepest, degrees[next]);
    if (deepest === 0) {
      degrees[group] = atomic[group] ? 0 : 1;
      continue;
    }
    if (atomic[group]) {
      degrees[group] = deepest;
      continue;
    }
    let downstream = reachableGroups(group, forward, meter), chained = !1;
    for (let target = 0; target < count && !chained; target += 1) {
      if (target === group || !downstream[target] || atomic[target] || degrees[target] !== deepest || !sharesStep(pieceClasses[group], pieceClasses[target], wildcard))
        continue;
      let upstream = reachableGroups(target, backward, meter);
      for (let middle = 0; middle < count; middle += 1)
        between[middle] = downstream[middle] && upstream[middle] ? 1 : 0;
      chained = connectsTwoLoops(
        product2,
        component,
        members,
        group,
        target,
        between,
        stepsOf(group),
        stepsOf(target),
        meter
      );
    }
    degrees[group] = chained ? deepest + 1 : deepest;
  }
  return {
    exponential: !1,
    degree: degrees.reduce((highest, degree) => Math.max(highest, degree), 0)
  };
};

// src/hooks/regex/growth/growth.ts
var STEADY = { exponential: !1, degree: 0 }, lookCache = /* @__PURE__ */ new WeakMap(), grows = ({ exponential, degree }) => exponential || degree >= 2, outgrows = (left, right) => left.exponential === right.exponential ? left.degree > right.degree : left.exponential, groupChars = (graph, alphabet, group) => {
  let inside = new Set(group), chars = EMPTY_SET;
  for (let node2 of group)
    for (let edge = graph.offsets[node2]; edge < graph.offsets[node2 + 1]; edge += 1)
      inside.has(graph.targets[edge]) && (chars = union(chars, alphabet.pieceSets[graph.labels[edge]]));
  return chars;
}, cycleChars = (graph, alphabet, components, keep2) => components.members.filter(keep2).reduce(
  (chars, group) => union(chars, groupChars(graph, alphabet, group)),
  EMPTY_SET
), loopsBefore = (ordered, graph, components, cyclic, alphabet, look) => {
  let ancestors = ancestorsOf(
    graph,
    Uint8Array.from(
      ordered.states,
      (state) => state.marks.includes(look) ? 1 : 0
    )
  );
  return cycleChars(
    graph,
    alphabet,
    components,
    (group) => group.some((state) => cyclic[state] && ancestors[state])
  );
}, preciseGrowth = (job, ordered, alphabet, graph, ancestors) => {
  let relevant = consultedStates(ordered, (state) => ancestors[state] === 1), lookahead = lookaheadFrom(
    readerOf(ordered, alphabet, relevant),
    ordered,
    alphabet,
    relevant,
    job.meter
  );
  return assessGrowth(
    buildProduct(
      ordered,
      lookahead,
      ancestors,
      ancestorsOf(graph, decidingStates(ordered)),
      job.meter
    ),
    job.meter
  );
}, lookGrowth = (report, repeated) => report.exponential ? { exponential: !0, degree: report.degree } : repeated ? { exponential: !1, degree: report.degree + 1 } : grows(report) ? report : STEADY, judge = (job, { epsilon, alphabet, past }) => {
  let ordered = buildOrdered(epsilon, alphabet, past, job.meter), graph = orderedGraph(ordered), components = stronglyConnected(graph), cyclic = cyclicStates(graph, components), ancestors = ancestorsOf(graph, cyclic), coarse = assessGrowth(
    buildProduct(
      ordered,
      sureLookahead(alphabet.pieceKinds.length, /* @__PURE__ */ new Set()),
      ancestors,
      new Uint8Array(ordered.states.length),
      job.meter
    ),
    job.meter
  ), growth = grows(coarse) ? preciseGrowth(job, ordered, alphabet, graph, ancestors) : coarse, cyclicChars = job.scope === "submatch" ? cycleChars(
    graph,
    alphabet,
    components,
    (group) => group.some((state) => cyclic[state] === 1)
  ) : EMPTY_SET;
  if (growth.exponential) return { ...growth, cyclicChars };
  let strongest = epsilon.looks.reduce((current, look, index2) => {
    let report = analyzeLook(look, job), repeated = report.degree >= 1 && overlaps(
      loopsBefore(ordered, graph, components, cyclic, alphabet, index2),
      report.cyclicChars
    ), candidate = lookGrowth(report, repeated);
    return outgrows(candidate, current) ? candidate : current;
  }, growth);
  return {
    exponential: strongest.exponential,
    degree: strongest.degree,
    cyclicChars
  };
}, analyzeJob = (job) => {
  let coarse = judge(job, compile(job, !1));
  if (!grows(coarse)) return coarse;
  let recalled = compile(job, !0);
  return recalled.past.recalling ? judge(job, recalled) : coarse;
}, analyzeLook = (look, outer) => {
  let cached = lookCache.get(look.body);
  if (cached) return cached;
  let report = analyzeJob({
    root: look.body,
    captures: outer.captures,
    direction: look.direction,
    flags: outer.flags,
    scope: "submatch",
    meter: outer.meter
  });
  return lookCache.set(look.body, report), report;
};

// src/hooks/regex/syntax/backreferences.ts
var SPLIT_LIMIT = 8, CASE_LIMIT = 16, pointCount = (set) => {
  let count = 0;
  for (let index2 = 0; index2 < set.length; index2 += 2)
    count += set[index2 + 1] - set[index2];
  return count;
}, product = (left, right) => left.length * right.length > SPLIT_LIMIT ? null : left.flatMap((head) => right.map((tail) => [...head, ...tail])), smallLanguage = (node2) => {
  switch (node2.kind) {
    case "empty":
      return [[]];
    case "char":
      return pointCount(node2.set) <= SPLIT_LIMIT ? expandPoints(node2.set).map((point3) => [pointSet(point3)]) : null;
    case "sequence":
      return node2.items.reduce(
        (strings, item) => {
          let language = strings && smallLanguage(item);
          return strings && language ? product(strings, language) : null;
        },
        [[]]
      );
    case "alternation": {
      let languages = node2.branches.map(smallLanguage);
      if (languages.some((language) => language === null)) return null;
      let strings = languages.flatMap((language) => language ?? []);
      return strings.length <= SPLIT_LIMIT ? strings : null;
    }
    case "repeat": {
      if (!Number.isFinite(node2.max) || node2.max > SPLIT_LIMIT) return null;
      let body = smallLanguage(node2.body);
      if (!body) return null;
      let strings = [], power = [[]];
      for (let count = 0; count <= node2.max && power; count += 1)
        count >= node2.min && strings.push(...power), power = product(power, body);
      return strings.length <= SPLIT_LIMIT ? strings : null;
    }
    default:
      return null;
  }
}, literal = (string3, folded, unicode) => string3.length === 0 ? { kind: "empty" } : {
  kind: "sequence",
  items: string3.map(
    (set) => charNode(folded ? caseClosure(set, unicode) : set)
  )
}, replaceReferences = (node2, capture, replacement) => {
  switch (node2.kind) {
    case "backreference":
      return node2.captures.length === 1 && node2.captures[0] === capture ? replacement : node2;
    case "sequence":
      return {
        ...node2,
        items: node2.items.map(
          (item) => replaceReferences(item, capture, replacement)
        )
      };
    case "alternation":
      return {
        ...node2,
        branches: node2.branches.map(
          (branch) => replaceReferences(branch, capture, replacement)
        )
      };
    case "repeat":
    case "look":
    case "uncertain":
      return {
        ...node2,
        body: replaceReferences(node2.body, capture, replacement)
      };
    default:
      return node2;
  }
}, countReferences = (node2, capture) => {
  switch (node2.kind) {
    case "backreference":
      return node2.captures.includes(capture) ? 1 : 0;
    case "sequence":
      return node2.items.reduce(
        (total, item) => total + countReferences(item, capture),
        0
      );
    case "alternation":
      return node2.branches.reduce(
        (total, branch) => total + countReferences(branch, capture),
        0
      );
    case "repeat":
    case "look":
    case "uncertain":
      return countReferences(node2.body, capture);
    default:
      return 0;
  }
}, referencesAfter = (node2, capture, body) => {
  switch (node2.kind) {
    case "sequence": {
      let position2 = node2.items.indexOf(body);
      return node2.items.reduce((total, item, index2) => index2 === position2 ? total : position2 !== -1 && index2 > position2 ? total + countReferences(item, capture) : total + referencesAfter(item, capture, body), 0);
    }
    case "alternation":
      return node2.branches.reduce(
        (total, branch) => total + referencesAfter(branch, capture, body),
        0
      );
    case "repeat":
    case "look":
    case "uncertain":
      return referencesAfter(node2.body, capture, body);
    default:
      return 0;
  }
}, valueKey = (string3, pattern) => string3.map(
  (set) => setKey(
    pattern.flags.ignoreCase ? caseClosure(set, pattern.flags.unicode) : set
  )
).join("|"), isPrefixOf = (key, other) => key === "" || other.startsWith(`${key}|`), prefixFree = (keys) => keys.every(
  (key, index2) => keys.every(
    (other, otherIndex) => otherIndex === index2 || !isPrefixOf(key, other)
  )
), distribute = (node2, capture, body, values) => {
  switch (node2.kind) {
    case "sequence": {
      let position2 = node2.items.indexOf(body), items = node2.items.map(
        (item, index2) => position2 !== -1 && index2 >= position2 ? item : distribute(item, capture, body, values)
      );
      if (position2 === -1) return { ...node2, items };
      let rest = node2.items.slice(position2 + 1), branches = values.map((value) => ({
        kind: "sequence",
        items: [
          value,
          ...rest.map((item) => replaceReferences(item, capture, value))
        ]
      }));
      return {
        ...node2,
        items: [...items.slice(0, position2), { kind: "alternation", branches }]
      };
    }
    case "alternation":
      return {
        ...node2,
        branches: node2.branches.map(
          (branch) => distribute(branch, capture, body, values)
        )
      };
    case "repeat":
    case "look":
    case "uncertain":
      return { ...node2, body: distribute(node2.body, capture, body, values) };
    default:
      return node2;
  }
}, distributionValues = (root, capture, body, pattern) => {
  let total = countReferences(root, capture), strings = total === 0 ? null : smallLanguage(body), shared = someNode(
    root,
    (node2) => node2.kind === "backreference" && node2.captures.length > 1 && node2.captures.includes(capture)
  );
  if (strings === null || shared || referencesAfter(root, capture, body) !== total) return null;
  let unique = new Map(
    strings.map((string3) => [valueKey(string3, pattern), string3])
  );
  return prefixFree([...unique.keys()]) ? [...unique.values()].map(
    (string3) => literal(string3, pattern.flags.ignoreCase, pattern.flags.unicode)
  ) : null;
}, distributeCaptures = (pattern) => {
  let root = pattern.root, factor = 1;
  for (let [capture, body] of pattern.captures) {
    let values = distributionValues(root, capture, body, pattern);
    values === null || factor * values.length > CASE_LIMIT || (factor *= values.length, root = distribute(root, capture, body, values));
  }
  return { root, factor };
}, splitsOf = (root, captures) => {
  if (root.kind !== "sequence") return [];
  let items = root.items;
  return [...captures].flatMap(([capture, body]) => {
    let position2 = items.indexOf(body), referenced = items.slice(position2 + 1).some(
      (item) => someNode(
        item,
        (node2) => node2.kind === "backreference" && node2.captures.includes(capture)
      )
    ), strings = position2 === -1 || !referenced ? null : smallLanguage(body);
    return strings ? [{ capture, position: position2, strings }] : [];
  });
}, applySplit = (items, split, string3, pattern) => {
  let value = literal(
    string3,
    pattern.flags.ignoreCase,
    pattern.flags.unicode
  );
  return items.map((item, index2) => index2 === split.position ? value : index2 < split.position ? item : replaceReferences(item, split.capture, value));
}, backreferenceCases = (pattern) => {
  let { root, factor } = distributeCaptures(pattern), cases = [
    root.kind === "sequence" ? [...root.items] : [root]
  ];
  for (let split of splitsOf(root, pattern.captures)) {
    let unique = new Map(
      split.strings.map((string3) => [valueKey(string3, pattern), string3])
    );
    factor * cases.length * unique.size > CASE_LIMIT || (cases = cases.flatMap(
      (items) => [...unique.values()].map(
        (string3) => applySplit(items, split, string3, pattern)
      )
    ));
  }
  return cases.map(
    (items) => items.length === 1 && root.kind !== "sequence" ? items[0] : { kind: "sequence", items }
  );
};

// src/hooks/regex/syntax/narrowing.ts
var singleCharSet = (node2) => {
  if (node2.kind === "char") return node2.set;
  if (node2.kind === "sequence" && node2.items.length === 1)
    return singleCharSet(node2.items[0]);
  if (node2.kind !== "alternation") return null;
  let set = EMPTY_SET;
  for (let branch of node2.branches) {
    let branchSet = singleCharSet(branch);
    if (branchSet === null) return null;
    set = union(set, branchSet);
  }
  return set;
}, narrow = (look, next) => {
  let filter = look.behind ? null : singleCharSet(look.body);
  if (filter === null || next === void 0) return null;
  let restrict = (set) => look.negative ? subtract(set, filter) : intersect(set, filter);
  return next.kind === "char" ? charNode(restrict(next.set)) : next.kind !== "repeat" || next.min < 1 || next.body.kind !== "char" ? null : {
    kind: "sequence",
    items: [
      charNode(restrict(next.body.set)),
      { ...next, min: next.min - 1, max: next.max - 1 }
    ]
  };
}, foldLookaheads = (node2) => {
  switch (node2.kind) {
    case "sequence": {
      let items = [];
      for (let index2 = node2.items.length - 1; index2 >= 0; index2 -= 1) {
        let item = foldLookaheads(node2.items[index2]), narrowed = item.kind === "look" ? narrow(item, items[0]) : null;
        narrowed ? items[0] = narrowed : items.unshift(item);
      }
      return { ...node2, items };
    }
    case "alternation":
      return { ...node2, branches: node2.branches.map(foldLookaheads) };
    case "repeat":
    case "look":
    case "uncertain":
      return { ...node2, body: foldLookaheads(node2.body) };
    default:
      return node2;
  }
};

// src/hooks/regex/syntax/cursor.ts
var CONTROL_ESCAPES = {
  f: 12,
  n: 10,
  r: 13,
  t: 9,
  v: 11
}, isDigit = (char) => char !== void 0 && char >= "0" && char <= "9", isOctal = (char) => char !== void 0 && char >= "0" && char <= "7", isAsciiLetter = (char) => char !== void 0 && /^[A-Za-z]$/.test(char), isHex = (text3) => /^[0-9A-Fa-f]+$/.test(text3), peek = (cursor, offset = 0) => cursor.source[cursor.position + offset], startsWith = (cursor, text3) => cursor.source.startsWith(text3, cursor.position), readPoint = (cursor) => {
  let point3 = cursor.unicode ? cursor.source.codePointAt(cursor.position) ?? 0 : cursor.source.charCodeAt(cursor.position);
  return cursor.position += point3 > 65535 ? 2 : 1, point3;
}, readHex = (cursor, length) => {
  let text3 = cursor.source.slice(cursor.position, cursor.position + length);
  return text3.length !== length || !isHex(text3) ? null : (cursor.position += length, Number.parseInt(text3, 16));
}, readUnicodeEscape = (cursor) => {
  if (cursor.unicode && peek(cursor) === "{") {
    let close = cursor.source.indexOf("}", cursor.position), value = Number.parseInt(
      cursor.source.slice(cursor.position + 1, close),
      16
    );
    return cursor.position = close + 1, value;
  }
  let lead = readHex(cursor, 4);
  if (lead === null || !cursor.unicode || lead < 55296 || lead > 56319 || !startsWith(cursor, "\\u")) return lead;
  let save = cursor.position;
  cursor.position += 2;
  let trail = readHex(cursor, 4);
  return trail !== null && trail >= 56320 && trail <= 57343 ? 65536 + (lead - 55296) * 1024 + (trail - 56320) : (cursor.position = save, lead);
}, readOctal = (cursor) => {
  let limit = (peek(cursor) ?? "0") <= "3" ? 3 : 2, value = 0, count = 0;
  for (; count < limit && isOctal(peek(cursor)); )
    value = value * 8 + Number(peek(cursor)), cursor.position += 1, count += 1;
  return value;
}, readCharacterEscape = (cursor) => {
  let char = peek(cursor) ?? "", control = CONTROL_ESCAPES[char];
  if (control !== void 0)
    return cursor.position += 1, control;
  if (char === "c" && isAsciiLetter(peek(cursor, 1)))
    return cursor.position += 2, cursor.source.charCodeAt(cursor.position - 1) % 32;
  if (char === "0" && !isDigit(peek(cursor, 1)))
    return cursor.position += 1, 0;
  if (!cursor.unicode && isOctal(char)) return readOctal(cursor);
  if (char === "x") {
    cursor.position += 1;
    let value = readHex(cursor, 2);
    return value !== null ? value : 120;
  }
  if (char === "u") {
    cursor.position += 1;
    let value = readUnicodeEscape(cursor);
    return value !== null ? value : 117;
  }
  return readPoint(cursor);
};

// src/hooks/regex/syntax/classes.ts
var MAX_EMOJI_LENGTH = 16, closeOver2 = (set, mode, unicode) => mode.ignoreCase ? caseClosure(set, unicode) : set, closeOverInSets = (set, mode, cursor) => cursor.sets ? closeOver2(set, mode, !0) : set, escapeBase = (lower, mode, cursor) => lower === "d" ? DIGITS : lower === "s" ? spaceSet() : wordSet(mode.ignoreCase, cursor.unicode), escapeClassSet = (letter, mode, cursor) => {
  let lower = letter.toLowerCase(), folded = closeOverInSets(escapeBase(lower, mode, cursor), mode, cursor);
  return letter === lower ? folded : complement(folded, universeLimit(cursor.unicode));
}, readPropertyExpression = (cursor) => {
  let close = cursor.source.indexOf("}", cursor.position), expression = cursor.source.slice(cursor.position + 1, close);
  return cursor.position = close + 1, expression;
}, propertyValue = (negated, expression, mode, cursor) => {
  let singles = stringPropertySingles(expression);
  if (singles !== null)
    return { chars: singles, strings: [], approximate: !0 };
  let folded = closeOverInSets(propertySet(expression), mode, cursor);
  return {
    chars: negated ? complement(folded, universeLimit(!0)) : folded,
    strings: [],
    approximate: !1
  };
}, charValue = (chars) => ({
  chars,
  strings: [],
  approximate: !1
}), readAtomEscape = (cursor, mode, inClass) => {
  let char = peek(cursor, 1) ?? "";
  if (char === "c" && !isAsciiLetter(peek(cursor, 2))) {
    let controlled = inClass && !cursor.unicode && /^[0-9_]$/.test(peek(cursor, 2) ?? ""), point4 = controlled ? cursor.source.charCodeAt(cursor.position + 2) % 32 : 92;
    return cursor.position += controlled ? 3 : 1, { value: charValue(pointSet(point4)), point: point4 };
  }
  if ("dDsSwW".includes(char) && char !== "")
    return cursor.position += 2, {
      value: charValue(escapeClassSet(char, mode, cursor)),
      point: null
    };
  if ((char === "p" || char === "P") && cursor.unicode)
    return cursor.position += 2, {
      value: propertyValue(
        char === "P",
        readPropertyExpression(cursor),
        mode,
        cursor
      ),
      point: null
    };
  if (inClass && char === "b")
    return cursor.position += 2, { value: charValue(pointSet(8)), point: 8 };
  if (inClass && char === "-")
    return cursor.position += 2, { value: charValue(pointSet(45)), point: 45 };
  cursor.position += 1;
  let point3 = readCharacterEscape(cursor);
  return { value: charValue(pointSet(point3)), point: point3 };
}, readClassAtom = (cursor, mode) => {
  if (peek(cursor) === "\\") return readAtomEscape(cursor, mode, !0);
  let point3 = readPoint(cursor);
  return { value: charValue(pointSet(point3)), point: point3 };
}, parseLegacyClass = (cursor, mode) => {
  cursor.position += 1;
  let negated = peek(cursor) === "^", set = EMPTY_SET;
  for (negated && (cursor.position += 1); cursor.position < cursor.source.length && peek(cursor) !== "]"; ) {
    let left = readClassAtom(cursor, mode);
    if (!(peek(cursor) === "-" && peek(cursor, 1) !== "]" && peek(cursor, 1) !== void 0)) {
      set = union(set, left.value.chars);
      continue;
    }
    cursor.position += 1;
    let right = readClassAtom(cursor, mode);
    set = left.point !== null && right.point !== null ? union(set, rangeSet(left.point, right.point + 1)) : union(
      union(set, left.value.chars),
      union(pointSet(45), right.value.chars)
    );
  }
  cursor.position += 1;
  let closed = closeOver2(set, mode, cursor.unicode);
  return negated ? complement(closed, universeLimit(cursor.unicode)) : closed;
}, foldString = (points, mode) => mode.ignoreCase ? points.map((point3) => caseRepresentative(point3, !0)) : points, uniqueStrings = (strings) => {
  let seen = /* @__PURE__ */ new Map();
  for (let string3 of strings) seen.set(string3.join(","), string3);
  return [...seen.values()];
}, unionValues = (left, right) => ({
  chars: union(left.chars, right.chars),
  strings: uniqueStrings([...left.strings, ...right.strings]),
  approximate: left.approximate || right.approximate
}), intersectValues = (left, right) => {
  let rightKeys = new Set(right.strings.map((string3) => string3.join(",")));
  return {
    chars: intersect(left.chars, right.chars),
    strings: uniqueStrings([
      ...left.strings.filter(
        (string3) => right.approximate || rightKeys.has(string3.join(","))
      ),
      ...left.approximate ? right.strings : []
    ]),
    approximate: left.approximate && right.approximate
  };
}, subtractValues = (left, right) => {
  let rightKeys = new Set(right.strings.map((string3) => string3.join(",")));
  return {
    chars: subtract(left.chars, right.chars),
    strings: left.strings.filter((string3) => !rightKeys.has(string3.join(","))),
    approximate: left.approximate
  };
}, readSetCharacter = (cursor) => peek(cursor) !== "\\" ? readPoint(cursor) : (peek(cursor, 1) ?? "") === "b" ? (cursor.position += 2, 8) : (cursor.position += 1, readCharacterEscape(cursor)), readStringDisjunction = (cursor, mode) => {
  let strings = [], current = [];
  for (cursor.position += 3; cursor.position < cursor.source.length && peek(cursor) !== "}"; ) {
    if (peek(cursor) === "|") {
      strings.push(current), current = [], cursor.position += 1;
      continue;
    }
    current.push(readSetCharacter(cursor));
  }
  strings.push(current), cursor.position += 1;
  let singles = strings.filter((string3) => string3.length === 1);
  return {
    chars: closeOver2(
      fromPoints(singles.map(([point3]) => point3)),
      mode,
      !0
    ),
    strings: uniqueStrings(
      strings.filter((string3) => string3.length !== 1).map((string3) => foldString(string3, mode))
    ),
    approximate: !1
  };
}, parseSetOperand = (cursor, mode) => {
  if (peek(cursor) === "[") return parseSetClass(cursor, mode);
  if (startsWith(cursor, "\\q{")) return readStringDisjunction(cursor, mode);
  if (peek(cursor) === "\\" && "dDsSwWpP".includes(peek(cursor, 1) ?? " "))
    return readAtomEscape(cursor, mode, !0).value;
  let start = readSetCharacter(cursor);
  if (peek(cursor) !== "-" || peek(cursor, 1) === "-")
    return charValue(closeOver2(pointSet(start), mode, !0));
  cursor.position += 1;
  let end = readSetCharacter(cursor);
  return charValue(closeOver2(rangeSet(start, end + 1), mode, !0));
}, combineOperands = (cursor, mode, first, operator, combine2) => {
  let value = first;
  for (; startsWith(cursor, operator); )
    cursor.position += operator.length, value = combine2(value, parseSetOperand(cursor, mode));
  return value;
}, unionOperands = (cursor, mode, first) => {
  let value = first;
  for (; cursor.position < cursor.source.length && peek(cursor) !== "]"; )
    value = unionValues(value, parseSetOperand(cursor, mode));
  return value;
}, parseSetBody = (cursor, mode) => {
  if (peek(cursor) === "]") return charValue(EMPTY_SET);
  let first = parseSetOperand(cursor, mode);
  return startsWith(cursor, "&&") ? combineOperands(cursor, mode, first, "&&", intersectValues) : startsWith(cursor, "--") ? combineOperands(cursor, mode, first, "--", subtractValues) : unionOperands(cursor, mode, first);
}, parseSetClass = (cursor, mode) => {
  cursor.position += 1;
  let negated = peek(cursor) === "^";
  negated && (cursor.position += 1);
  let value = parseSetBody(cursor, mode);
  return cursor.position += 1, negated ? charValue(complement(value.chars, universeLimit(!0))) : value;
}, stringNode = (points, mode) => ({
  kind: "sequence",
  items: points.map(
    (point3) => charNode(closeOver2(pointSet(point3), mode, !0))
  )
}), valueNode = (value, mode) => {
  if (value.strings.length === 0 && !value.approximate)
    return charNode(value.chars);
  let longest = value.strings.filter((string3) => string3.length > 1).toSorted((left, right) => right.length - left.length), approximated = value.approximate ? [
    {
      kind: "uncertain",
      body: {
        kind: "repeat",
        body: charNode(emojiComponents()),
        min: 2,
        max: MAX_EMOJI_LENGTH,
        lazy: !1
      }
    }
  ] : [], chars = isEmptySet(value.chars) ? [] : [charNode(value.chars)], empty = value.strings.some((string3) => string3.length === 0) ? [EMPTY_NODE] : [], branches = [
    ...approximated,
    ...longest.map((string3) => stringNode(string3, mode)),
    ...chars,
    ...empty
  ];
  return alternationOf(branches);
};

// src/hooks/regex/syntax/syntax.ts
var NESTING_LIMIT = 512, SHORTHAND_BOUNDS = /* @__PURE__ */ new Map([
  ["*", [0, 1 / 0]],
  ["+", [1, 1 / 0]],
  ["?", [0, 1]]
]), decodeName = (raw) => raw.replace(
  /\\u\{([0-9A-Fa-f]+)\}|\\u([0-9A-Fa-f]{4})/g,
  (_, braced, plain) => braced ? String.fromCodePoint(Number.parseInt(braced, 16)) : String.fromCharCode(Number.parseInt(plain ?? "0", 16))
), skipClass = (source, open, sets) => {
  let depth = 0, index2 = open;
  for (; index2 < source.length; ) {
    let char = source[index2];
    if (char === "\\") {
      index2 += 2;
      continue;
    }
    if (index2 += 1, char === "[" && (sets || depth === 0)) {
      depth += 1, depth > NESTING_LIMIT && reachCap();
      continue;
    }
    if (char === "]" && (depth -= 1, depth === 0))
      return index2;
  }
  return index2;
}, prescan = (source, sets) => {
  let names = /* @__PURE__ */ new Map(), total = 0, depth = 0, index2 = 0;
  for (; index2 < source.length; ) {
    let char = source[index2];
    if (char === "\\") {
      index2 += 2;
      continue;
    }
    if (char === "[") {
      index2 = skipClass(source, index2, sets);
      continue;
    }
    if (char === "(" && (depth += 1), char === ")" && (depth -= 1), depth > NESTING_LIMIT && reachCap(), char === "(" && source[index2 + 1] !== "?" && (total += 1), char === "(" && source.startsWith("(?<", index2) && source[index2 + 3] !== "=" && source[index2 + 3] !== "!") {
      let close = source.indexOf(">", index2 + 3), name = decodeName(source.slice(index2 + 3, close));
      total += 1, names.set(name, [...names.get(name) ?? [], total]);
    }
    index2 += 1;
  }
  return { total, names };
}, dotSet = (mode, unicode) => {
  let all2 = rangeSet(0, universeLimit(unicode));
  return mode.dotAll ? all2 : subtract(all2, LINE_TERMINATORS);
}, readBracedBounds = (cursor) => {
  let braced = /^\{(\d+)(?:,(\d*))?\}/.exec(
    cursor.source.slice(cursor.position)
  );
  return braced ? (cursor.position += braced[0].length, [
    Number(braced[1]),
    braced[2] === "" ? 1 / 0 : Number(braced[2] ?? braced[1])
  ]) : null;
}, readBounds = (cursor) => {
  let shorthand = SHORTHAND_BOUNDS.get(peek(cursor) ?? "");
  return shorthand ? (cursor.position += 1, shorthand) : peek(cursor) === "{" ? readBracedBounds(cursor) : null;
}, readQuantifier = (cursor) => {
  let bounds = readBounds(cursor);
  if (!bounds) return null;
  let lazy = peek(cursor) === "?";
  return lazy && (cursor.position += 1), { min: bounds[0], max: bounds[1], lazy };
}, backreference = (cursor, indices) => {
  let captures = indices.filter((index2) => !cursor.open.includes(index2));
  return captures.length === 0 ? EMPTY_NODE : { kind: "backreference", captures };
}, readDecimalEscape = (cursor) => {
  let digits = /^[1-9]\d*/.exec(cursor.source.slice(cursor.position + 1));
  if (!digits) return null;
  let index2 = Number(digits[0]);
  return !cursor.unicode && index2 > cursor.captureTotal ? null : (cursor.position += 1 + digits[0].length, backreference(cursor, [index2]));
}, readNamedReference = (cursor) => {
  let close = cursor.source.indexOf(">", cursor.position), name = decodeName(cursor.source.slice(cursor.position + 3, close));
  return cursor.position = close + 1, backreference(cursor, cursor.names.get(name) ?? []);
}, parseEscape = (cursor, mode) => {
  let char = peek(cursor, 1);
  if (char === "b" || char === "B")
    return cursor.position += 2, {
      kind: "assertion",
      test: char === "b" ? "word" : "notWord",
      multiline: mode.multiline,
      unicodeWord: mode.ignoreCase && cursor.unicode
    };
  if (char === "k" && cursor.namedGroups) return readNamedReference(cursor);
  let reference = readDecimalEscape(cursor);
  if (reference) return reference;
  if (!cursor.unicode && (char === "8" || char === "9"))
    return cursor.position += 2, charNode(pointSet(char.charCodeAt(0)));
  let { value } = readAtomEscape(cursor, mode, !1);
  return valueNode(
    { ...value, chars: closeOver2(value.chars, mode, cursor.unicode) },
    mode
  );
}, readModifiers = (cursor, mode) => {
  let close = cursor.source.indexOf(":", cursor.position), [enable = "", disable2 = ""] = cursor.source.slice(cursor.position + 2, close).split("-"), flag = (letter, current) => enable.includes(letter) || current && !disable2.includes(letter);
  return cursor.position = close + 1, {
    ignoreCase: flag("i", mode.ignoreCase),
    multiline: flag("m", mode.multiline),
    dotAll: flag("s", mode.dotAll)
  };
}, parseGroupBody = (cursor, mode, capture) => {
  capture !== null && cursor.open.push(capture);
  let body = parseDisjunction(cursor, mode);
  return cursor.position += 1, capture === null || (cursor.open.pop(), cursor.captures.set(capture, body)), body;
}, parseParen = (cursor, mode) => {
  let lookaround = /^\(\?(<?)([=!])/.exec(
    cursor.source.slice(cursor.position, cursor.position + 4)
  );
  if (lookaround) {
    let behind = lookaround[1] === "<";
    return cursor.position += lookaround[0].length, {
      node: {
        kind: "look",
        behind,
        negative: lookaround[2] === "!",
        body: parseGroupBody(cursor, mode, null)
      },
      quantifiable: !behind && !cursor.unicode
    };
  }
  if (startsWith(cursor, "(?:"))
    return cursor.position += 3, { node: parseGroupBody(cursor, mode, null), quantifiable: !0 };
  if (startsWith(cursor, "(?<"))
    return cursor.position = cursor.source.indexOf(">", cursor.position) + 1, cursor.nextCapture += 1, {
      node: parseGroupBody(cursor, mode, cursor.nextCapture),
      quantifiable: !0
    };
  if (startsWith(cursor, "(?")) {
    let inner = readModifiers(cursor, mode);
    return { node: parseGroupBody(cursor, inner, null), quantifiable: !0 };
  }
  return cursor.position += 1, cursor.nextCapture += 1, {
    node: parseGroupBody(cursor, mode, cursor.nextCapture),
    quantifiable: !0
  };
}, parseAtom = (cursor, mode) => {
  let char = peek(cursor);
  if (char === "^" || char === "$")
    return cursor.position += 1, {
      node: {
        kind: "assertion",
        test: char === "^" ? "begin" : "end",
        multiline: mode.multiline,
        unicodeWord: !1
      },
      quantifiable: !1
    };
  if (char === "(") return parseParen(cursor, mode);
  if (char === ".")
    return cursor.position += 1, { node: charNode(dotSet(mode, cursor.unicode)), quantifiable: !0 };
  if (char === "[")
    return { node: cursor.sets ? valueNode(parseSetClass(cursor, mode), mode) : charNode(parseLegacyClass(cursor, mode)), quantifiable: !0 };
  if (char === "\\") {
    let node2 = parseEscape(cursor, mode);
    return { node: node2, quantifiable: node2.kind !== "assertion" };
  }
  return {
    node: charNode(
      closeOver2(pointSet(readPoint(cursor)), mode, cursor.unicode)
    ),
    quantifiable: !0
  };
}, parseTerm = (cursor, mode) => {
  let { node: node2, quantifiable } = parseAtom(cursor, mode);
  if (!quantifiable) return node2;
  let quantifier = readQuantifier(cursor);
  return quantifier ? (cursor.quantifiers += 1, { kind: "repeat", body: node2, ...quantifier }) : node2;
}, parseAlternative = (cursor, mode) => {
  let items = [];
  for (; cursor.position < cursor.source.length && peek(cursor) !== "|" && peek(cursor) !== ")"; )
    items.push(parseTerm(cursor, mode));
  return items.length === 0 ? EMPTY_NODE : items.length === 1 ? items[0] : { kind: "sequence", items };
}, parseDisjunction = (cursor, mode) => {
  let branches = [parseAlternative(cursor, mode)];
  for (; peek(cursor) === "|"; )
    cursor.position += 1, branches.push(parseAlternative(cursor, mode));
  return alternationOf(branches);
}, readFlags2 = (flags) => ({
  ignoreCase: flags.includes("i"),
  multiline: flags.includes("m"),
  dotAll: flags.includes("s"),
  unicode: flags.includes("u") || flags.includes("v"),
  sets: flags.includes("v"),
  sticky: flags.includes("y")
}), parsePattern = (source, flags) => {
  let patternFlags = readFlags2(flags), { total, names } = prescan(source, patternFlags.sets), cursor = {
    source,
    position: 0,
    unicode: patternFlags.unicode,
    sets: patternFlags.sets,
    namedGroups: patternFlags.unicode || names.size > 0,
    captureTotal: total,
    nextCapture: 0,
    names,
    open: [],
    captures: /* @__PURE__ */ new Map(),
    quantifiers: 0
  };
  return {
    root: parseDisjunction(cursor, {
      ignoreCase: patternFlags.ignoreCase,
      multiline: patternFlags.multiline,
      dotAll: patternFlags.dotAll
    }),
    captures: cursor.captures,
    flags: patternFlags,
    quantifiers: cursor.quantifiers
  };
};

// src/hooks/regex/regex.ts
var DEFAULT_REPETITION_LIMIT = 25, AMPLIFICATION_LIMIT = 200, WORK_CAP = 18e6, CAPPED = {
  verdict: "undetermined",
  reason: "work cap reached",
  scope: null
}, AMPLIFIED = {
  reason: `amplification score above ${AMPLIFICATION_LIMIT}`,
  rank: 1,
  scope: "search"
}, isValid = (source, flags) => {
  try {
    return compilePattern(source, flags), !0;
  } catch {
    return !1;
  }
}, parseWithinCap = (source, flags) => {
  try {
    return parsePattern(source, flags);
  } catch (error) {
    if (isCapReached(error)) return null;
    throw error;
  }
}, growthReason = (growth, scope) => growth.exponential ? { reason: "exponential", rank: 1 / 0, scope } : {
  reason: `polynomial of degree ${growth.degree}`,
  rank: growth.degree,
  scope
}, stronger = (current, candidate) => candidate !== null && (current === null || candidate.rank > current.rank) ? candidate : current, treeReason = (root, parsed, captures) => {
  let meter = createMeter(WORK_CAP), job = (scope) => ({
    root,
    captures,
    direction: "forward",
    flags: parsed.flags,
    scope,
    meter
  });
  if (repeatsUnbounded(root, captures)) {
    let search2 = analyzeJob(job("search"));
    if (search2.exponential) return growthReason(search2, "search");
    let whole = analyzeJob(job("whole match")), [growth, scope] = outgrows(whole, search2) ? [whole, "whole match"] : [search2, "search"];
    if (grows(growth)) return growthReason(growth, scope);
  }
  return amplifies(job("search"), AMPLIFICATION_LIMIT) ? AMPLIFIED : null;
}, foldedCaptures = (parsed) => new Map(
  [...parsed.captures].map(([index2, body]) => [index2, foldLookaheads(body)])
), assess = (source, options = /* @__PURE__ */ Object.create(null)) => {
  let flags = options.flags ?? "";
  if (!isValid(source, flags)) return { verdict: "invalid regex" };
  let parsed = parseWithinCap(source, flags);
  if (parsed === null) return CAPPED;
  let repetitionLimit = options.repetitionLimit ?? DEFAULT_REPETITION_LIMIT, captures = foldedCaptures(parsed), reason = parsed.quantifiers > repetitionLimit ? {
    reason: `more than ${repetitionLimit} quantifiers`,
    rank: 0,
    scope: null
  } : null, capped = !1;
  for (let root of backreferenceCases(parsed).map(foldLookaheads)) {
    try {
      reason = stronger(reason, treeReason(root, parsed, captures));
    } catch (error) {
      if (!isCapReached(error)) throw error;
      capped = !0;
    }
    if (reason?.rank === 1 / 0 && reason.scope === "search") break;
  }
  return reason !== null ? { verdict: "unsafe", reason: reason.reason, scope: reason.scope } : capped ? CAPPED : { verdict: "safe" };
}, check3 = (source, options) => assess(source, options).verdict;

// src/hooks/regex/scan.ts
import { readFile as readFile3 } from "node:fs/promises";
import { join as join13 } from "node:path";

// src/hooks/regex/pool.ts
import { once } from "node:events";
import { availableParallelism } from "node:os";
import { Worker } from "node:worker_threads";
var WORKER_LIMIT = 8, READINGS_PER_WORKER = 8, WORKER_OPTIONS = {
  resourceLimits: { maxYoungGenerationSizeMb: 12 }
}, workersFor = (readings) => Math.min(
  WORKER_LIMIT,
  Math.floor(availableParallelism() / 2),
  Math.floor(readings / READINGS_PER_WORKER)
), byLongestSource = ([, left], [, right]) => right.source.length - left.source.length, ask = async (worker, job, signal) => {
  worker.postMessage(job);
  let [assessment] = await once(worker, "message", {
    signal
  });
  return assessment;
}, drain = async (worker, queue, repetitionLimit) => {
  let exited = new AbortController(), judged = [];
  worker.once("exit", () => exited.abort());
  for (let [key, { source, flags }] of queue)
    judged.push([
      key,
      await ask(worker, { source, flags, repetitionLimit }, exited.signal)
    ]);
  return judged;
}, assessAcross = async (readings, repetitionLimit, workerCount) => {
  let entry2 = new URL(import.meta.resolve("./worker.js")), queue = [...readings].toSorted(byLongestSource).values(), workers = Array.from(
    { length: workerCount },
    () => new Worker(entry2, WORKER_OPTIONS)
  );
  try {
    let lanes = await Promise.all(
      workers.map((worker) => drain(worker, queue, repetitionLimit))
    );
    return new Map(lanes.flat());
  } finally {
    await Promise.all(workers.map((worker) => worker.terminate()));
  }
}, assessInline = (readings, repetitionLimit) => new Map(
  [...readings].map(([key, { source, flags }]) => [
    key,
    assess(source, { flags, repetitionLimit })
  ])
), assessReadings = async (readings, repetitionLimit, workers = workersFor(readings.size)) => workers < 2 ? assessInline(readings, repetitionLimit) : assessAcross(readings, repetitionLimit, workers);

// src/hooks/regex/usage.ts
var ARGUMENT_ENDS = /* @__PURE__ */ new Set([")", ",", "]"]), LITERAL_FORMS = [
  {
    languages: ["ruby", "crystal"],
    static: null,
    dynamic: /\/[^/\n]{0,500}#\{[^/\n]{0,500}\//
  },
  {
    languages: ["perl"],
    static: /(?:\bqr|\bm|=~\s{0,40}m?|\bs)\/[^/\n]{0,500}\//,
    dynamic: /(?:\bqr|\bm|=~\s{0,40}m?|\bs)\/[^/\n]{0,500}\$\w/
  },
  {
    languages: ["elixir"],
    static: /~r[/"{|]/,
    dynamic: /~r[/"{|][^\n]{0,500}#\{/
  },
  {
    languages: ["julia"],
    static: /\br"[^"\n]{0,500}"/,
    dynamic: null
  },
  {
    languages: ["clojure"],
    static: /#"[^"\n]{0,500}"/,
    dynamic: null
  },
  {
    languages: ["nim"],
    static: /\bre"[^"\n]{0,500}"/,
    dynamic: null
  },
  {
    languages: ["scala"],
    static: /"[^"\n]{0,500}"\.r\b/,
    dynamic: /\b[a-z]"[^"\n]{0,500}"\.r\b/
  },
  {
    languages: ["powershell"],
    static: null,
    dynamic: /-(?:match|replace)\s{1,40}\$/
  }
], argumentShape = (text3, start, language) => {
  let literal2 = staticLiteralAt(text3, start, language);
  if (literal2 === null) return "dynamic";
  let next = skipSpace(text3, literal2.next);
  return ARGUMENT_ENDS.has(text3[next]) || skipLabel(text3, next) !== next ? "static-literal" : "dynamic";
}, regexUsage = (text3, language) => {
  let dynamic = !1, staticWrap = !1;
  for (let call of callsOf(language)) {
    let shapes = new Set(
      patternArgumentStarts(text3, call).map(
        (start) => argumentShape(text3, start, language)
      )
    );
    shapes.has("dynamic") && (dynamic = !0), shapes.has("static-literal") && call.hasLiteralForm && (staticWrap = !0);
  }
  for (let form of LITERAL_FORMS)
    form.languages.includes(language) && (form.static && form.static.test(text3) && (staticWrap = !0), form.dynamic && form.dynamic.test(text3) && (dynamic = !0));
  return { dynamic, staticWrap };
};

// src/hooks/regex/scan.ts
var byReading = (left, right) => left.source.localeCompare(right.source) || left.flags.localeCompare(right.flags), extractFile = async (root, file) => {
  let language = languageOf(file);
  if (language === null) return null;
  let text3;
  try {
    text3 = await readFile3(join13(root, file), "utf8");
  } catch {
    return null;
  }
  return {
    file,
    candidates: extractPatterns(text3, language).toSorted(byReading),
    ...regexUsage(text3, language)
  };
}, isExtracted = (entry2) => entry2 !== null, distinctReadings = (extracted) => new Map(
  extracted.flatMap(
    ({ candidates }) => candidates.map((candidate) => [
      readingKey(candidate),
      candidate
    ])
  )
), findingsOf = (extracted, assessments, verdict) => extracted.flatMap(
  ({ file, candidates }) => candidates.flatMap((candidate) => {
    let assessment = assessments.get(readingKey(candidate));
    return assessment?.verdict === verdict ? [
      {
        file,
        source: candidate.source,
        flags: candidate.flags,
        reason: assessment.reason,
        scope: assessment.scope
      }
    ] : [];
  })
), filesWhere = (extracted, holds2) => extracted.filter(holds2).map(({ file }) => file).toSorted((left, right) => left.localeCompare(right)), scan = async (root, targets, repetitionLimit) => {
  let walked = await Promise.all(
    targets.map((target) => walk2(root, target, SOURCE_FILTER))
  ), files = [...new Set(walked.flat())], extracted = (await Promise.all(files.map((file) => extractFile(root, file)))).filter(isExtracted), assessments = await assessReadings(
    distinctReadings(extracted),
    repetitionLimit
  );
  return {
    unsafe: findingsOf(extracted, assessments, "unsafe"),
    undetermined: findingsOf(extracted, assessments, "undetermined"),
    dynamic: filesWhere(extracted, ({ dynamic }) => dynamic),
    staticWrap: filesWhere(extracted, ({ staticWrap }) => staticWrap)
  };
};

// src/hooks/regex/cli.ts
var OPTIONS9 = {
  pattern: { type: "string", short: "p", multiple: !0 },
  flags: { type: "string" },
  limit: { type: "string", short: "l" },
  dir: { type: "string", short: "d", multiple: !0 },
  file: { type: "string", short: "f", multiple: !0 }
}, parseLimit = (raw) => {
  if (raw !== void 0) {
    if (!/^\d+$/.test(raw))
      throw new Error(
        `repetition limit must be a non-negative integer, got "${raw}"`
      );
    return Number(raw);
  }
}, parseArgs4 = (args2) => {
  let { values } = parseNodeArgs9({ args: args2, options: OPTIONS9, strict: !0 }), patterns = values.pattern ?? [], targets = [...values.dir ?? [], ...values.file ?? []], repetitionLimit = parseLimit(values.limit);
  if (patterns.length > 0) {
    if (targets.length > 0)
      throw new Error(
        "-p checks a pattern and cannot be combined with -d or -f"
      );
    return {
      mode: "check",
      patterns,
      flags: values.flags ?? "",
      repetitionLimit
    };
  }
  if (values.flags !== void 0)
    throw new Error(
      "--flags applies to -p patterns, a scan reads each literal with its own flags"
    );
  return { mode: "scan", targets, repetitionLimit };
}, runCheck6 = (patterns, flags, repetitionLimit) => {
  let verdicts = patterns.map(
    (pattern) => check3(pattern, { repetitionLimit, flags })
  );
  return {
    output: verdicts.join(`
`) + `
`,
    hasFinding: verdicts.includes("unsafe")
  };
}, runScan6 = async (targets, repetitionLimit) => {
  let root = cwd7(), paths = await resolveTargets(root, targets), result = await scan(root, paths, repetitionLimit);
  return { output: format(result), hasFinding: result.unsafe.length > 0 };
}, run9 = async (args2) => {
  let request = parseArgs4(args2);
  return request.mode === "check" ? runCheck6(request.patterns, request.flags, request.repetitionLimit) : runScan6(request.targets, request.repetitionLimit);
};

// src/hooks/repair/cli.ts
import { cwd as cwd8 } from "node:process";

// src/core/tracking.ts
import { readFile as readFile4 } from "node:fs/promises";
import { join as join14 } from "node:path";
var TRACKING_DIR = ".lagune", TRACKING_PATH = ".lagune/tracking.json", emptyTrackingMap = () => ({ entries: [] }), samePaths = (left, right) => {
  if (left.length !== right.length) return !1;
  let sortedRight = right.toSorted();
  return left.toSorted().every((path, index2) => path === sortedRight[index2]);
}, matchItem = (observed, map) => {
  let existing = map.entries.find((entry2) => entry2.name === observed.name);
  if (existing) {
    let classification = samePaths(
      existing.paths,
      observed.paths
    ) ? "unchanged" : "moved";
    return {
      entry: { name: existing.name, paths: [...observed.paths] },
      classification: { name: existing.name, classification }
    };
  }
  return {
    entry: { name: observed.name, paths: [...observed.paths] },
    classification: { name: observed.name, classification: "new" }
  };
}, upsert = (entries, next) => entries.some((entry2) => entry2.name === next.name) ? entries.map((entry2) => entry2.name === next.name ? next : entry2) : [...entries, next], foldEntries = (map, observed) => observed.reduce(
  (state, item) => {
    let match = matchItem(item, state.map);
    return {
      map: { entries: upsert(state.map.entries, match.entry) },
      classifications: [...state.classifications, match.classification]
    };
  },
  { map, classifications: [] }
), removeEntries = (map, names) => {
  let wanted = new Set(names), kept = map.entries.filter((entry2) => !wanted.has(entry2.name)), removed = map.entries.filter((entry2) => wanted.has(entry2.name)).map((entry2) => entry2.name), notFound = names.filter(
    (name) => !map.entries.some((entry2) => entry2.name === name)
  );
  return {
    updatedMap: { entries: kept },
    removed,
    notFound
  };
}, isObservedEntry = (value) => typeof value == "object" && value !== null && typeof value.name == "string" && Array.isArray(value.paths) && value.paths.every((path) => typeof path == "string"), toObservedEntries = (value) => Array.isArray(value) ? value.filter(isObservedEntry).map((entry2) => ({ name: entry2.name, paths: [...entry2.paths] })) : [], parseObservedPayload = (raw) => {
  let parsed = JSON.parse(raw);
  return toObservedEntries(parsed.entries);
}, toNames = (value) => Array.isArray(value) ? value.filter((name) => typeof name == "string") : [], parseNamePayload = (raw) => {
  let parsed = JSON.parse(raw);
  return toNames(parsed.names);
}, normalizeEntry = (value) => {
  if (typeof value != "object" || value === null) return;
  let candidate = value, { name } = candidate, paths = Array.isArray(candidate.paths) ? candidate.paths.filter((path) => typeof path == "string") : [];
  if (typeof name == "string")
    return { name, paths };
}, parseTrackingMap = (raw) => {
  let parsed = JSON.parse(raw);
  return typeof parsed != "object" || parsed === null || !Array.isArray(parsed.entries) ? emptyTrackingMap() : { entries: parsed.entries.map(normalizeEntry).filter((entry2) => entry2 !== void 0) };
}, loadTrackingMap = async (targetDir) => {
  try {
    let raw = await readFile4(join14(targetDir, TRACKING_PATH), "utf8");
    return parseTrackingMap(raw);
  } catch {
    return emptyTrackingMap();
  }
}, serializeTrackingMap = (map) => `${JSON.stringify(map, null, 2)}
`, writeTrackingMap = async (targetDir, map) => {
  await ensureDir(join14(targetDir, TRACKING_DIR)), await writeFileOverwrite(
    join14(targetDir, TRACKING_PATH),
    serializeTrackingMap(map)
  );
};

// src/hooks/repair/repair.ts
var orphanReason = (entry2, observed) => observed.some(
  (item) => item.name !== entry2.name && samePaths(item.paths, entry2.paths)
) ? "renamed-candidate" : "orphan", repairEntries = (map, observed) => {
  let folded = foldEntries(map, observed), observedNames = new Set(observed.map((item) => item.name)), unresolved = map.entries.filter((entry2) => !observedNames.has(entry2.name)).map((entry2) => ({
    name: entry2.name,
    paths: [...entry2.paths],
    reason: orphanReason(entry2, observed)
  }));
  return {
    updatedMap: folded.map,
    classifications: folded.classifications,
    unresolved
  };
}, repair = async (targetDir, payload) => {
  let entries = parseObservedPayload(payload);
  if (entries.length === 0)
    throw new Error(
      "repair input needs `entries`, each an item with `name` and `paths`"
    );
  let map = await loadTrackingMap(targetDir), result = repairEntries(map, entries);
  return serializeTrackingMap(map) !== serializeTrackingMap(result.updatedMap) && await writeTrackingMap(targetDir, result.updatedMap), `${JSON.stringify(
    {
      classifications: result.classifications,
      unresolved: result.unresolved
    },
    null,
    2
  )}
`;
};

// src/hooks/repair/cli.ts
var run10 = (args2) => repair(cwd8(), args2[0] ?? "");

// src/hooks/secrets/cli.ts
import { cwd as cwd9 } from "node:process";
import { parseArgs as parseNodeArgs10 } from "node:util";

// src/hooks/secrets/patterns.ts
var SIGNATURES = [
  {
    regex: /\bAKIA[0-9A-Z]{16}\b/,
    detail: "AWS access key id (AKIA\u2026) committed in source"
  },
  {
    regex: /\bghp_[A-Za-z0-9]{36}\b/,
    detail: "GitHub personal access token (ghp_\u2026) committed in source"
  },
  {
    regex: /\bgithub_pat_[A-Za-z0-9_]{22,}\b/,
    detail: "GitHub fine-grained token (github_pat_\u2026) committed in source"
  },
  {
    regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
    detail: "Slack token (xox\u2026) committed in source"
  },
  {
    regex: /\bsk_live_[A-Za-z0-9]{16,}\b/,
    detail: "Stripe live secret key (sk_live_\u2026) committed in source"
  },
  {
    regex: /\bsk_test_[A-Za-z0-9]{16,}\b/,
    detail: "Stripe test secret key (sk_test_\u2026) committed in source"
  },
  {
    regex: /\bsk-proj-[A-Za-z0-9_-]{20,}\b/,
    detail: "OpenAI project secret key (sk-proj-\u2026) committed in source"
  },
  {
    regex: /\bsk-[A-Za-z0-9]{20,}\b/,
    detail: "OpenAI secret key (sk-\u2026) committed in source"
  },
  {
    regex: /\bglpat-[A-Za-z0-9_-]{20,}\b/,
    detail: "GitLab personal access token (glpat-\u2026) committed in source"
  },
  {
    regex: /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/,
    detail: "SendGrid API key (SG.\u2026) committed in source"
  },
  {
    regex: /\bAIza[A-Za-z0-9_-]{35}\b/,
    detail: "Google API key (AIza\u2026) committed in source"
  },
  {
    regex: /(?<![A-Za-z0-9_-])eyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/,
    detail: "JSON Web Token (eyJ\u2026) committed in source"
  },
  {
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?(?:ENCRYPTED )?PRIVATE KEY(?: BLOCK)?-----/,
    detail: "private key block (PEM) committed in source"
  }
], JVM_SINK = /System\.(?:out|err)\.(?:println|print|printf|format)\s{0,16}\(|\b(?:log|logger)\.(?:info|warn|error|debug|trace|fatal)\s{0,16}\(|\bprintln\s{0,16}\(|throw\s{1,16}new\s{1,16}\w{0,64}(?:Exception|Error)/, C_SINK = /\b(?:printf|fprintf|sprintf|snprintf|puts|fputs|perror)\s{0,16}\(/, SINKS = {
  javascript: /\b(?:console\.(?:log|info|warn|error|debug)|logger\.(?:info|warn|error|debug|trace)|res\.(?:send|json|write)|response\.(?:send|json)|throw\s{1,16}new\s{1,16}\w{0,64}Error|new\s{1,16}Error)\s{0,16}\(/,
  python: /\bprint\s{0,16}\(|\b(?:logging|logger)\.(?:info|warning|error|debug|critical|exception)\s{0,16}\(|\braise\s{1,16}\w{0,64}(?:Error|Exception)/,
  ruby: /(?:^|[;{(])\s{0,16}(?:puts|print|pp?)\b|(?:Rails\.)?logger\.(?:info|warn|error|debug|fatal)\s{0,16}\(|(?:^|[;{(])\s{0,16}raise\b/,
  php: /(?:^|[;{])\s{0,16}(?:echo|print)\b|\bprintf\s{0,16}\(|\bvar_dump\s{0,16}\(|\berror_log\s{0,16}\(|throw\s{1,16}new\s{1,16}\w{0,64}(?:Exception|Error)/,
  java: JVM_SINK,
  kotlin: JVM_SINK,
  go: /\bfmt\.(?:Print|Printf|Println|Sprint|Sprintf|Sprintln|Fprint\w{0,8})\s{0,16}\(|\blog\.(?:Print|Printf|Println|Fatal\w{0,8}|Panic\w{0,8})\s{0,16}\(|\bslog\.(?:Info|Warn|Error|Debug)\s{0,16}\(|\bpanic\s{0,16}\(/,
  rust: /\b(?:println|print|eprintln|eprint)\s{0,16}!|\b(?:log|tracing)::(?:info|warn|error|debug|trace)\s{0,16}!|\bpanic\s{0,16}!/,
  c: C_SINK,
  cpp: /\b(?:printf|fprintf|sprintf|snprintf|puts|fputs|perror)\s{0,16}\(|\b(?:std::)?(?:cout|cerr|clog)\b\s{0,16}<</,
  csharp: /\bConsole\.(?:Write|WriteLine)\s{0,16}\(|\bConsole\.Error\.(?:Write|WriteLine)\s{0,16}\(|\b_?[Ll]ogger\.(?:LogInformation|LogWarning|LogError|LogDebug|LogTrace|LogCritical)\s{0,16}\(|throw\s{1,16}new\s{1,16}\w{0,64}Exception/
}, ENV_FALLBACKS = {
  javascript: [
    /(?:process\.env\.\w{1,64}|import\.meta\.env\.\w{1,64})\s{0,16}(?:\?\?|\|\|)\s{0,16}(['"`])([^'"`]{8,512})\1/
  ],
  python: [
    /\bos\.(?:getenv|environ\.get)\s{0,16}\(\s{0,16}['"]\w{1,64}['"]\s{0,16},\s{0,16}(['"])([^'"]{8,512})\1/,
    /\bos\.(?:getenv\s{0,16}\([^)]{0,200}\)|environ\s{0,16}\[\s{0,16}['"]\w{1,64}['"]\s{0,16}\])\s{1,16}or\s{1,16}(['"])([^'"]{8,512})\1/
  ],
  ruby: [
    /\bENV\s{0,16}\[\s{0,16}['"]\w{1,64}['"]\s{0,16}\]\s{0,16}\|\|\s{0,16}(['"])([^'"]{8,512})\1/,
    /\bENV\.fetch\s{0,16}\(\s{0,16}['"]\w{1,64}['"]\s{0,16},\s{0,16}(['"])([^'"]{8,512})\1/
  ],
  php: [
    /\bgetenv\s{0,16}\(\s{0,16}['"]\w{1,64}['"]\s{0,16}\)\s{0,16}\?:\s{0,16}(['"])([^'"]{8,512})\1/,
    /\$_(?:ENV|SERVER)\s{0,16}\[\s{0,16}['"]\w{1,64}['"]\s{0,16}\]\s{0,16}\?\?\s{0,16}(['"])([^'"]{8,512})\1/
  ],
  java: [
    /System\.getenv\s{0,16}\([^)]{0,200}\)[^;\n]{0,120}\.orElse\s{0,16}\(\s{0,16}(['"])([^'"]{8,512})\1/
  ],
  kotlin: [
    /System\.getenv\s{0,16}\([^)]{0,200}\)\s{0,16}\?:\s{0,16}(['"])([^'"]{8,512})\1/,
    /System\.getenv\s{0,16}\([^)]{0,200}\)[^;\n]{0,120}\.orElse\s{0,16}\(\s{0,16}(['"])([^'"]{8,512})\1/
  ],
  go: [
    /\bcmp\.Or\s{0,16}\(\s{0,16}os\.Getenv\s{0,16}\([^)]{0,200}\)\s{0,16},\s{0,16}(['"])([^'"]{8,512})\1/
  ],
  rust: [
    /\benv::var\w{0,8}\s{0,16}\([^)]{0,200}\)[^;\n]{0,120}\.unwrap_or(?:_else)?\s{0,16}\([^"'\n]{0,40}(['"])([^'"]{8,512})\1/
  ],
  csharp: [
    /\bEnvironment\.GetEnvironmentVariable\s{0,16}\([^)]{0,200}\)\s{0,16}\?\?\s{0,16}(['"])([^'"]{8,512})\1/
  ]
}, SINK_LANGUAGES = Object.keys(
  SINKS
), sinkOf = (language) => SINKS[language] ?? null, envFallbacksOf = (language) => ENV_FALLBACKS[language] ?? [];

// src/hooks/secrets/secrets.ts
var ASSIGN = /(?:password|passwd|pwd|secret|api[_-]?key|apikey|access[_-]?key|auth[_-]?token|token|credential|private[_-]?key|client[_-]?secret)\s{0,16}[:=]\s{0,16}(['"`])([^'"`]{0,4096})\1/i, CONNECTION_STRING = /\b[a-z][a-z0-9+.-]{1,20}:\/\/[^\s:'"`@/]{0,64}:([^\s:'"`@/]{1,256})@[^\s'"`/]{1,256}/i, PLACEHOLDER = /^(?:changeme|changeit|change[-_]me|your[-_]?[\w-]+|example[\w-]*|sample[\w-]*|dummy[\w-]*|test[\w-]*|placeholder|redacted|todo|none|null|undefined|x{3,}|\*{3,}|\.{3,}|<.*>|\$\{.*\}|\{\{.*\}\})$/i, SECRET_REF = /\b(?:password|secret|api[_-]?key|apikey|token|credential|private[_-]?key|plaintext|decrypted\w{0,64})\b/i, SECRET_IDENTIFIER = /(?:password|passwd|pwd|secret|api[_-]?key|apikey|access[_-]?key|auth[_-]?token|token|credential|private[_-]?key|client[_-]?secret)/i, ENV_FALLBACK_DETAIL = "hardcoded fallback for an environment secret: remove the literal default", CONNECTION_DETAIL = "credential embedded in a connection/DSN string: move it to an environment variable or secret store", LITERAL_DETAIL = "literal bound to a secret-named identifier: confirm it is a real credential, and move any secret to an environment variable or secret store", SINK_DETAIL = "a secret-named value flows into a log/response/error sink: verify it is redacted", isPlaceholder = (value) => PLACEHOLDER.test(value), hasHardcodedLiteral = (line) => {
  let match = ASSIGN.exec(line);
  return match === null ? !1 : match[2].length >= 8 && !isPlaceholder(match[2]);
}, hasEnvFallback = (line, patterns) => patterns.some((pattern) => {
  let match = pattern.exec(line);
  if (match === null) return !1;
  let [, quote, defaultLiteral] = match;
  if (isPlaceholder(defaultLiteral)) return !1;
  let lookup2 = match[0].slice(
    0,
    -(quote.length + defaultLiteral.length + quote.length)
  );
  return SECRET_IDENTIFIER.test(lookup2);
}), hasConnectionCredential = (line) => {
  let match = CONNECTION_STRING.exec(line);
  if (match === null) return !1;
  let password = match[1];
  return !password.startsWith("$") && !isPlaceholder(password);
}, flagged = (lines, test) => lines.some(test), analyzeFor5 = (language, content3) => {
  let rawLines = content3.split(`
`), lines = codeLines(content3, language), envPatterns = language === null ? [] : envFallbacksOf(language), sink = language === null ? null : sinkOf(language), findings = SIGNATURES.filter(
    (rule2) => rawLines.some((line) => rule2.regex.test(line))
  ).map((rule2) => rule2.detail);
  envPatterns.length > 0 && flagged(lines, (line) => hasEnvFallback(line, envPatterns)) && findings.push(ENV_FALLBACK_DETAIL), flagged(rawLines, hasConnectionCredential) && findings.push(CONNECTION_DETAIL);
  let review = [];
  return flagged(lines, hasHardcodedLiteral) && review.push(LITERAL_DETAIL), sink !== null && flagged(lines, (line) => sink.test(line) && SECRET_REF.test(line)) && review.push(SINK_DETAIL), {
    findings: [...new Set(findings)],
    review: [...new Set(review)],
    advisory: []
  };
}, analyze7 = (file, content3) => analyzeFor5(languageOf(file), content3);

// src/hooks/secrets/cli.ts
var OPTIONS10 = {
  dir: { type: "string", short: "d", multiple: !0 },
  file: { type: "string", short: "f", multiple: !0 }
}, HEADINGS7 = {
  sentinel: `no hardcoded secrets found
`,
  findings: "Hardcoded secrets found:",
  review: "Secret handling to review manually:"
}, runScan7 = async (targets) => {
  let root = cwd9(), paths = await resolveTargets(root, targets), report = await scanReport(root, paths, SOURCE_FILTER, analyze7);
  return {
    output: formatReport(report, HEADINGS7),
    hasFinding: report.findings.length > 0
  };
}, run11 = async (args2) => {
  let { values } = parseNodeArgs10({ args: args2, options: OPTIONS10, strict: !0 }), targets = [...values.dir ?? [], ...values.file ?? []];
  return runScan7(targets);
};

// src/hooks/track/cli.ts
import { cwd as cwd10 } from "node:process";

// src/hooks/track/track.ts
var trackEntries = (map, observed) => {
  let folded = foldEntries(map, observed);
  return {
    updatedMap: folded.map,
    classifications: folded.classifications
  };
}, track = async (targetDir, payload) => {
  let entries = parseObservedPayload(payload);
  if (entries.length === 0)
    return `${JSON.stringify({ classifications: [] }, null, 2)}
`;
  let map = await loadTrackingMap(targetDir), result = trackEntries(map, entries);
  return serializeTrackingMap(map) !== serializeTrackingMap(result.updatedMap) && await writeTrackingMap(targetDir, result.updatedMap), `${JSON.stringify({ classifications: result.classifications }, null, 2)}
`;
};

// src/hooks/track/cli.ts
var run12 = (args2) => track(cwd10(), args2[0] ?? "");

// src/hooks/untrack/cli.ts
import { cwd as cwd11 } from "node:process";

// src/hooks/untrack/history.ts
import { readFile as readFile5 } from "node:fs/promises";
import { join as join15 } from "node:path";

// src/core/markdown/fields.ts
var BOLD_MARKS = ["**", "__"], DASH_SEPARATORS = ["\u2014", "\u2013"], spacesFrom = (line, index2) => {
  let cursor = index2;
  for (; line[cursor] === " "; ) cursor += 1;
  return cursor;
}, afterSeparator = (line, index2) => {
  let cursor = spacesFrom(line, index2);
  return line[cursor] === ":" || DASH_SEPARATORS.includes(line[cursor] ?? "") || line[cursor] === "-" && cursor > index2 && line[cursor + 1] === " " ? cursor + 1 : -1;
}, fieldValue = (line, field) => {
  let content3 = bulletText(line);
  if (content3 === null) return null;
  let boldMark = BOLD_MARKS.find((mark) => content3.startsWith(mark)), nameStart = boldMark?.length ?? 0, nameEnd = nameStart + field.length;
  if (content3.slice(nameStart, nameEnd).toLowerCase() !== field.toLowerCase())
    return null;
  let cursor = nameEnd, separated = !1, colon = spacesFrom(content3, cursor);
  if (content3[colon] === ":" && (cursor = colon + 1, separated = !0), boldMark !== void 0) {
    let close = spacesFrom(content3, cursor);
    if (!content3.startsWith(boldMark, close)) return null;
    cursor = close + boldMark.length;
  }
  return !separated && (cursor = afterSeparator(content3, cursor), cursor === -1) ? null : content3.slice(cursor).trim();
}, bulletField = (text3, field) => {
  for (let line of markdownLines(text3 ?? "")) {
    if (line.code) continue;
    let value = fieldValue(line.text, field);
    if (value !== null && value !== "") return value;
  }
  return null;
};

// src/core/markdown/sections.ts
function* withinSection(text3, matches2) {
  let inSection = !1;
  for (let line of markdownLines(text3 ?? "")) {
    if (!line.code && headingLevel(line.text) === 1) {
      inSection = !1;
      continue;
    }
    if (!line.code && line.text.startsWith("## ")) {
      inSection = matches2(line.text.slice(3));
      continue;
    }
    inSection && (yield line);
  }
}
var headingIs = (header2) => (heading2) => heading2.trim().toLowerCase() === header2.toLowerCase(), sectionBlocks = (text3, section) => {
  let blocks = [], current = null;
  for (let line of withinSection(text3, headingIs(section))) {
    if (!line.code && line.text.startsWith("### ")) {
      current && blocks.push(current), current = { name: line.text.slice(4).trim(), lines: [] };
      continue;
    }
    current && current.lines.push(line.text);
  }
  return current && blocks.push(current), blocks.map((block) => ({
    name: block.name,
    body: block.lines.join(`
`).trim()
  }));
}, sectionBullets = (text3, header2) => {
  let out = [];
  for (let line of withinSection(text3, headingIs(header2))) {
    if (line.code || headingLevel(line.text) > 0) continue;
    let bullet2 = bulletText(line.text);
    bullet2 !== null ? out.push(inlineText(bullet2)) : line.text.trim() && out.length > 0 && (out[out.length - 1] += ` ${line.text.trim()}`);
  }
  return out;
}, firstParagraph = (body) => {
  let out = [];
  for (let line of markdownLines(body ?? "")) {
    if (line.code || headingLevel(line.text) > 0) {
      if (out.length) break;
      continue;
    }
    if (bulletText(line.text) !== null) break;
    if (line.text.trim() === "") {
      if (out.length) break;
      continue;
    }
    out.push(line.text.trim());
  }
  return out.join(" ");
}, sectionIntro = (text3, header2) => {
  let out = [];
  for (let line of withinSection(text3, headingIs(header2)))
    if (!line.code) {
      if (headingLevel(line.text) > 0) break;
      line.text.trim() && out.push(line.text.trim());
    }
  return out.join(" ");
};

// src/hooks/untrack/history.ts
var HISTORY_DIR = ".lagune/memory", HISTORY_PATH = ".lagune/memory/history.md", HISTORY_SECTION = "Closed findings", HISTORY_HEADER = `# Lagune History

## ${HISTORY_SECTION}
`, UNRANKED = "Unranked", readMarkdown2 = async (path) => {
  try {
    return stripComments(await readFile5(path, "utf8"));
  } catch {
    return null;
  }
}, toIsoDate = (now) => now.toISOString().slice(0, 10), distill = (names, detect, plan, closed) => {
  let detected = sectionBlocks(detect, "Findings"), planned = sectionBlocks(plan, "Fixes"), wanted = new Set(names);
  return detected.filter((block) => wanted.has(block.name)).map((block) => {
    let fix = planned.find((entry2) => entry2.name === block.name);
    return {
      name: block.name,
      classification: inlineText(fix ? bulletField(fix.body, "Priority") : null) || UNRANKED,
      category: inlineText(fix ? bulletField(fix.body, "Category") : null),
      whatItIs: inlineText(bulletField(block.body, "What it is")),
      closed
    };
  });
}, renderEntry = (entry2) => [
  `### ${entry2.name}`,
  "",
  `- **Classification:** ${entry2.classification}`,
  ...entry2.category ? [`- **Category:** ${entry2.category}`] : [],
  `- **What it is:** ${entry2.whatItIs}`,
  `- **Closed:** ${entry2.closed}`
].join(`
`), withTrailingBlank = (text3) => text3.endsWith(`

`) ? text3 : text3.endsWith(`
`) ? `${text3}
` : `${text3}

`, appendClosedFindings = async (targetDir, names, now) => {
  let [detect, plan] = await Promise.all([
    readMarkdown2(join15(targetDir, ".lagune/memory/detect.md")),
    readMarkdown2(join15(targetDir, ".lagune/memory/plan.md"))
  ]), entries = distill(names, detect, plan, toIsoDate(now));
  if (entries.length === 0) return { file: HISTORY_PATH, recorded: [] };
  let path = join15(targetDir, HISTORY_PATH), existing = await readFile5(path, "utf8").catch(() => HISTORY_HEADER), block = entries.map(renderEntry).join(`

`);
  return await ensureDir(join15(targetDir, HISTORY_DIR)), await writeFileOverwrite(path, `${withTrailingBlank(existing)}${block}
`), { file: HISTORY_PATH, recorded: entries.map((entry2) => entry2.name) };
};

// src/hooks/untrack/prose.ts
import { readFile as readFile6 } from "node:fs/promises";
import { join as join16 } from "node:path";

// src/core/sections.ts
var HEADING_PREFIX = "### ", isBoundary = (line) => line.startsWith("### ") || line.startsWith("## "), isTargetHeading = (line, name) => line.startsWith(HEADING_PREFIX) && line.slice(HEADING_PREFIX.length).trimEnd() === name.trimEnd(), findSectionEnd = (lines, headingIndex) => {
  let after = lines.slice(headingIndex + 1).findIndex(isBoundary);
  return after === -1 ? lines.length : headingIndex + 1 + after;
}, tidy2 = (content3) => `${content3.replace(/\n{3,}/g, `

`).trimEnd()}
`, removeSection = (markdown, name) => {
  let lines = markdown.split(`
`), headingIndex = lines.findIndex((line) => isTargetHeading(line, name));
  if (headingIndex === -1) return { content: markdown, removed: !1 };
  let end = findSectionEnd(lines, headingIndex), kept = [...lines.slice(0, headingIndex), ...lines.slice(end)];
  return { content: tidy2(kept.join(`
`)), removed: !0 };
}, hasFindingSection = (markdown) => markdown.split(`
`).some((line) => line.startsWith(HEADING_PREFIX));

// src/hooks/untrack/prose.ts
var MEMORY_FILES = [
  ".lagune/memory/detect.md",
  ".lagune/memory/plan.md",
  ".lagune/memory/harden.md"
], readMarkdown3 = async (path) => {
  try {
    return await readFile6(path, "utf8");
  } catch {
    return;
  }
}, removeNamesFrom = (markdown, names) => names.reduce(
  (state, name) => {
    let result = removeSection(state.content, name);
    return result.removed ? { content: result.content, removedFrom: [...state.removedFrom, name] } : state;
  },
  { content: markdown, removedFrom: [] }
), findDanglingMentions = (content3, names) => content3.split(`
`).flatMap(
  (line, index2) => names.filter((name) => line.includes(name)).map((name) => ({ name, line: index2 + 1, text: line.trim() }))
), removeSectionsFromMemory = async (targetDir, names) => Promise.all(
  MEMORY_FILES.map(async (relativePath) => {
    let path = join16(targetDir, relativePath), original = await readMarkdown3(path);
    if (original === void 0)
      return {
        file: relativePath,
        status: "absent",
        removed: [],
        dangling: []
      };
    let { content: content3, removedFrom } = removeNamesFrom(original, names);
    return content3 === original ? {
      file: relativePath,
      status: "unchanged",
      removed: [],
      dangling: findDanglingMentions(content3, names)
    } : hasFindingSection(content3) ? (await writeFileOverwrite(path, content3), {
      file: relativePath,
      status: "edited",
      removed: removedFrom,
      dangling: findDanglingMentions(content3, names)
    }) : (await removeFileIfPresent(path), {
      file: relativePath,
      status: "removed",
      removed: removedFrom,
      dangling: []
    });
  })
);

// src/hooks/untrack/untrack.ts
var untrack = async (targetDir, payload, now) => {
  let names = parseNamePayload(payload);
  if (names.length === 0)
    throw new Error("untrack input needs `names`, a list of finding names");
  let history = await appendClosedFindings(targetDir, names, now), prose = await removeSectionsFromMemory(targetDir, names), map = await loadTrackingMap(targetDir), result = removeEntries(map, names);
  serializeTrackingMap(map) !== serializeTrackingMap(result.updatedMap) && await writeTrackingMap(targetDir, result.updatedMap);
  let summary = {
    removed: result.removed,
    notFound: result.notFound,
    prose,
    history
  };
  return `${JSON.stringify(summary, null, 2)}
`;
};

// src/hooks/untrack/cli.ts
var run13 = (args2) => untrack(cwd11(), args2[0] ?? "", /* @__PURE__ */ new Date());

// src/hooks/validate/cli.ts
import { cwd as cwd12 } from "node:process";

// src/hooks/validate/validate.ts
import { join as join17 } from "node:path";

// src/hooks/validate/shared.ts
var PLACEHOLDER_TOKEN = /\[[A-Z][A-Z0-9_]*\](?!\()/g, ISO_DATE = /^\d{4}-\d{2}-\d{2}$/, structuralLines = (text3) => markdownLines(text3).filter((line) => !line.code).map((line) => line.text), isIsoDate = (value) => ISO_DATE.test(value), placeholderProblems = (text3) => {
  let tokens = structuralLines(text3).flatMap(
    (line) => [...line.matchAll(PLACEHOLDER_TOKEN)].map((match) => match[0])
  );
  return [...new Set(tokens)].map(
    (token) => `the placeholder token ${token} was left unfilled`
  );
}, titleProblems = (text3, suffix) => structuralLines(text3).some(
  (line) => headingLevel(line) === 1 && line.trim().endsWith(suffix)
) ? [] : [`the "# <project name> ${suffix}" title heading is missing`], hasSection = (text3, header2) => structuralLines(text3).some(
  (line) => line.startsWith("## ") && line.slice(3).trim().toLowerCase() === header2.toLowerCase()
), missingFieldProblems = (text3, field) => bulletField(text3, field) === null ? [`the "${field}" line is missing or empty`] : [], dateProblems = (text3, field) => {
  let value = bulletField(text3, field);
  return value === null ? [`the "${field}" line is missing or empty`] : isIsoDate(value) ? [] : [`the "${field}" date "${value}" is not an ISO date (YYYY-MM-DD)`];
}, sectionBlockProblems = (text3, section, blocks, kind) => hasSection(text3, section) ? blocks.length === 0 ? [`the "${section}" section has no ${kind} block`] : [] : [`the "${section}" section is missing`], duplicateNameProblems = (kindPlural, blocks) => {
  let names = blocks.map((block) => block.name), repeated = names.filter((name, index2) => names.indexOf(name) !== index2);
  return [...new Set(repeated)].map(
    (name) => `two ${kindPlural} share the name "${name}", so the chain cannot tell them apart`
  );
}, requiredFieldProblems = (kind, block, fields) => fields.filter((field) => bulletField(block.body, field) === null).map(
  (field) => `the "${field}" line is missing or empty on the ${kind} "${block.name}"`
), allowedValueProblems = (kind, name, field, value, allowed) => value === null || allowed.includes(value) ? [] : [
  `the ${field} "${value}" on the ${kind} "${name}" is not one of ${oneOf(allowed)}`
];

// src/hooks/validate/charter.ts
var BASELINE_BLOCKS = [
  "Only the controls the project needs",
  "Prefer the simplest vetted control",
  "When a control seems skippable"
], VERSION_LABEL = "version", RATIFIED_LABEL = "ratified", principleProblems = (charter) => {
  let blocks = sectionBlocks(charter, "Principles"), shape = sectionBlockProblems(
    charter,
    "Principles",
    blocks,
    "principle"
  );
  return shape.length > 0 ? shape : [
    ...duplicateNameProblems("principles", blocks),
    ...blocks.flatMap((block) => [
      ...firstParagraph(block.body) === "" ? [`the principle "${block.name}" is missing its rule paragraph`] : [],
      ...requiredFieldProblems("principle", block, ["Why"])
    ])
  ];
}, baselineProblems = (charter) => {
  if (!hasSection(charter, "Baseline discipline"))
    return ['the "Baseline discipline" section is missing'];
  let present = new Set(
    sectionBlocks(charter, "Baseline discipline").map((block) => block.name)
  );
  return BASELINE_BLOCKS.filter((name) => !present.has(name)).map(
    (name) => `the "${name}" block is missing from the "Baseline discipline" section`
  );
}, labelValue = (line, label, from) => {
  let index2 = line.toLowerCase().indexOf(label, from);
  if (index2 === -1) return null;
  let cursor = afterSeparator(line, index2 + label.length);
  if (cursor === -1) return null;
  let value = line.slice(cursor).trim().split(" ")[0].split("|")[0];
  return value === "" ? null : value;
}, versionLineProblems = (charter) => {
  let line = structuralLines(charter).find(
    (text3) => text3.slice(0, VERSION_LABEL.length).toLowerCase() === VERSION_LABEL && afterSeparator(text3, VERSION_LABEL.length) !== -1
  );
  if (line === void 0)
    return [
      'the "Version: <version> | Ratified: <date>" line is missing from the "Governance" section'
    ];
  let ratified = labelValue(line, RATIFIED_LABEL, VERSION_LABEL.length);
  return ratified === null ? ['the version line carries no "Ratified:" date'] : isIsoDate(ratified) ? [] : [`the ratification date "${ratified}" is not an ISO date (YYYY-MM-DD)`];
}, governanceProblems = (charter) => hasSection(charter, "Governance") ? [
  ...sectionIntro(charter, "Governance") === "" ? ['the "Governance" section is empty'] : [],
  ...versionLineProblems(charter)
] : ['the "Governance" section is missing'], validateCharter = (charter) => [
  ...titleProblems(charter, "Security Charter"),
  ...placeholderProblems(charter),
  ...principleProblems(charter),
  ...baselineProblems(charter),
  ...governanceProblems(charter)
], PRINCIPLE_CEILING = 1024, WHY_CEILING = 512, charterWarnings = (charter) => sectionBlocks(charter, "Principles").flatMap((block) => {
  let why = bulletField(block.body, "Why");
  return [
    ...block.body.length > PRINCIPLE_CEILING ? [
      `the principle "${block.name}" runs ${block.body.length} characters where ${PRINCIPLE_CEILING} is already generous, so consider tightening its rule`
    ] : [],
    ...why !== null && why.length > WHY_CEILING ? [
      `the "Why" line on the principle "${block.name}" runs ${why.length} characters where ${WHY_CEILING} is already generous, so consider tightening the risk to one line`
    ] : []
  ];
});

// src/hooks/validate/configs.ts
var readableConfigs = (raw) => {
  try {
    return parseJsonObject(raw, CONFIGS_FILE);
  } catch {
    return null;
  }
}, configsWarnings = (raw) => {
  if (raw === null) return [];
  let configs = readableConfigs(raw);
  return configs === null || Object.hasOwn(configs, "$schema") ? [] : [
    `it names no schema: add "$schema": "${CONFIGS_SCHEMA}" as its first field`
  ];
};

// src/core/markdown/applied.ts
var APPLIED_HEADINGS = [
  "Applied specializations",
  "Applied sub-skills"
], LEGACY_SPECIALIZATION_PATH = ".lagune/skills/", LEGACY_EXTENSION = ".md", BOLD_MARKS2 = ["**", "__"], CODE_MARK = "`", dropPrefix = (text3, mark) => text3.startsWith(mark) ? text3.slice(mark.length) : text3, dropOpeningDecoration = (text3) => dropPrefix(BOLD_MARKS2.reduce(dropPrefix, text3), CODE_MARK), skipClosingDecoration = (text3, index2) => {
  let cursor = index2;
  text3.startsWith(CODE_MARK, cursor) && (cursor += CODE_MARK.length);
  for (let mark of BOLD_MARKS2)
    text3.startsWith(mark, cursor) && (cursor += mark.length);
  return cursor;
}, legacyName = (content3) => {
  if (!content3.startsWith(LEGACY_SPECIALIZATION_PATH)) return;
  let dot = content3.indexOf(
    LEGACY_EXTENSION,
    LEGACY_SPECIALIZATION_PATH.length
  );
  if (dot === -1) return;
  let name = content3.slice(LEGACY_SPECIALIZATION_PATH.length, dot);
  if (!(name === "" || name.includes(CODE_MARK) || name.includes("/")))
    return { name, end: dot + LEGACY_EXTENSION.length };
}, bareName = (content3) => {
  let end = leadingNameLength(content3);
  return end === 0 ? void 0 : { name: content3.slice(0, end), end };
}, appliedEntry = (bullet2) => {
  let content3 = dropOpeningDecoration(bullet2), named = legacyName(content3) ?? bareName(content3);
  if (named === void 0) return;
  let cursor = afterSeparator(
    content3,
    skipClosingDecoration(content3, named.end)
  );
  if (cursor === -1) return;
  let contribution = inlineText(content3.slice(cursor));
  return contribution === "" ? void 0 : { name: named.name, contribution };
};

// src/hooks/validate/detect.ts
var FINDING_FIELDS = ["What it is", "Why it matters", "Evidence"], findingProblems = (detect) => {
  let blocks = sectionBlocks(detect, "Findings"), shape = sectionBlockProblems(detect, "Findings", blocks, "finding");
  return shape.length > 0 ? shape : [
    ...duplicateNameProblems("findings", blocks),
    ...blocks.flatMap(
      (block) => requiredFieldProblems("finding", block, FINDING_FIELDS)
    )
  ];
}, namesSpecialization = (row) => row.includes(LEGACY_SPECIALIZATION_PATH) || appliedEntry(row) !== void 0, appliedProblems = (detect) => {
  let heading2 = APPLIED_HEADINGS.find((header2) => hasSection(detect, header2));
  return heading2 === void 0 ? [] : sectionBullets(detect, heading2).some(namesSpecialization) ? [] : [`the "${heading2}" section names no specialization`];
}, validateDetect = (detect) => [
  ...titleProblems(detect, "Detect Map"),
  ...placeholderProblems(detect),
  ...missingFieldProblems(detect, "Scope"),
  ...dateProblems(detect, "Mapped"),
  ...findingProblems(detect),
  ...appliedProblems(detect)
];

// src/hooks/validate/harden.ts
var APPLIED_FIELDS = ["Status", "What changed", "Where", "Verdict"], STATUS_VALUES = ["Applied", "Partial", "Blocked"], VERDICT_VALUES = ["Pending", "\u274C Reproved", "\u2753 Inconclusive"], REASONED_VERDICTS = ["\u274C Reproved", "\u2753 Inconclusive"], verdictProblems = (block) => {
  let verdict = bulletField(block.body, "Verdict"), reason = bulletField(block.body, "Reason");
  return [
    ...allowedValueProblems(
      "applied block",
      block.name,
      "Verdict",
      verdict,
      VERDICT_VALUES
    ),
    ...verdict !== null && REASONED_VERDICTS.includes(verdict) && reason === null ? [
      `the applied block "${block.name}" carries a "${verdict}" Verdict with no "Reason" line`
    ] : [],
    ...verdict === "Pending" && reason !== null ? [
      `the applied block "${block.name}" carries a "Reason" while its Verdict is Pending`
    ] : []
  ];
}, remainingProblems = (harden, blocks) => {
  let remaining = sectionBullets(harden, "Remaining");
  return blocks.flatMap((block) => {
    let status = bulletField(block.body, "Status");
    return status !== "Partial" && status !== "Blocked" ? [] : remaining.some((item) => item.includes(block.name)) ? [] : [
      `the applied block "${block.name}" is ${status} but no "Remaining" entry names it`
    ];
  });
}, traceProblems = (blocks, plan) => {
  if (plan === null)
    return [
      "the defense plan is absent, so no applied block can be traced back to a fix"
    ];
  let fixes = new Set(
    sectionBlocks(plan, "Fixes").map((block) => block.name)
  );
  return blocks.filter((block) => !fixes.has(block.name)).map(
    (block) => `the applied block "${block.name}" matches no fix in the defense plan`
  );
}, validateHarden = (harden, plan) => {
  let blocks = sectionBlocks(harden, "Applied"), shape = sectionBlockProblems(harden, "Applied", blocks, "applied");
  return [
    ...titleProblems(harden, "Hardening Record"),
    ...placeholderProblems(harden),
    ...missingFieldProblems(harden, "Scope"),
    ...dateProblems(harden, "Hardened"),
    ...shape.length > 0 ? shape : [
      ...duplicateNameProblems("applied blocks", blocks),
      ...blocks.flatMap((block) => [
        ...requiredFieldProblems("applied block", block, APPLIED_FIELDS),
        ...allowedValueProblems(
          "applied block",
          block.name,
          "Status",
          bulletField(block.body, "Status"),
          STATUS_VALUES
        ),
        ...verdictProblems(block)
      ]),
      ...remainingProblems(harden, blocks),
      ...traceProblems(blocks, plan)
    ]
  ];
};

// src/hooks/validate/plan.ts
var FIX_FIELDS = [
  "Category",
  "CVSS",
  "Priority",
  "Why this priority",
  "Upholds",
  "Fix"
], PRIORITY_BANDS = ["Critical", "High", "Medium", "Low"], detectNames = (detect) => detect === null ? [] : sectionBlocks(detect, "Findings").map((block) => block.name), unchecked = (problem) => ({
  problem,
  severity: null
}), checkRating = (name, cvss) => {
  if (!cvss.startsWith(CVSS_PREFIX))
    return unchecked(
      `the CVSS line on the fix "${name}" does not carry a ${CVSS_PREFIX} vector`
    );
  let written = readRatingLine(cvss);
  if (written === null)
    return unchecked(
      `the CVSS line on the fix "${name}" is not the vector followed by "(score, band)"`
    );
  let reading = parseVector(written.vector);
  if (isProblem(reading))
    return unchecked(
      `the CVSS line on the fix "${name}" carries an invalid vector: ${reading.problem}`
    );
  let { overall } = rateVector(reading.metrics);
  return overall.score !== written.score || overall.severity !== written.severity ? unchecked(
    `the CVSS line on the fix "${name}" reads (${formatScore(written)}), but its vector scores (${formatScore(overall)}): run the cvss hook and copy the score and band it prints`
  ) : { problem: null, severity: overall.severity };
}, priorityProblems = (name, priority, severity) => priority === null || severity === null || !PRIORITY_BANDS.includes(priority) ? [] : severity === "None" ? [
  `the CVSS line on the fix "${name}" scores (0.0, None), which fits no Priority band`
] : priority === severity ? [] : [
  `the Priority "${priority}" on the fix "${name}" is not the band "${severity}" its CVSS line scores`
], ratingProblems = (block) => {
  let cvss = bulletField(block.body, "CVSS"), priority = bulletField(block.body, "Priority"), check4 = cvss === null ? { problem: null, severity: null } : checkRating(block.name, cvss);
  return [
    ...check4.problem === null ? [] : [check4.problem],
    ...allowedValueProblems(
      "fix",
      block.name,
      "Priority",
      priority,
      PRIORITY_BANDS
    ),
    ...priorityProblems(block.name, priority, check4.severity)
  ];
}, traceProblems2 = (blocks, detect) => {
  if (detect === null)
    return [
      "the detect map is absent, so no fix can be traced back to a finding"
    ];
  let findings = new Set(detectNames(detect));
  return blocks.filter((block) => !findings.has(block.name)).map(
    (block) => `the fix "${block.name}" matches no finding in the detect map`
  );
}, loopsBack = (start, dependencies) => {
  let seen = /* @__PURE__ */ new Set(), current = dependencies.get(start) ?? null;
  for (; current !== null; ) {
    if (current === start) return !0;
    if (seen.has(current)) return !1;
    seen.add(current), current = dependencies.get(current) ?? null;
  }
  return !1;
}, dependencyProblems = (blocks, detect) => {
  let known = /* @__PURE__ */ new Set([
    ...blocks.map((block) => block.name),
    ...detectNames(detect)
  ]), dependencies = new Map(
    blocks.map((block) => [block.name, bulletField(block.body, "Depends on")])
  ), unknown = blocks.flatMap((block) => {
    let dependency = dependencies.get(block.name) ?? null;
    return dependency === null || known.has(dependency) ? [] : [
      `the dependency "${dependency}" on the fix "${block.name}" names no fix or detect finding`
    ];
  }), loops = blocks.filter((block) => loopsBack(block.name, dependencies)).map(
    (block) => `the dependency chain on the fix "${block.name}" loops back to itself`
  );
  return [...unknown, ...loops];
}, validatePlan = (plan, detect) => {
  let blocks = sectionBlocks(plan, "Fixes"), shape = sectionBlockProblems(plan, "Fixes", blocks, "fix");
  return [
    ...titleProblems(plan, "Defense Plan"),
    ...placeholderProblems(plan),
    ...missingFieldProblems(plan, "Scope"),
    ...dateProblems(plan, "Planned"),
    ...shape.length > 0 ? shape : [
      ...duplicateNameProblems("fixes", blocks),
      ...blocks.flatMap((block) => [
        ...requiredFieldProblems("fix", block, FIX_FIELDS),
        ...ratingProblems(block)
      ]),
      ...traceProblems2(blocks, detect),
      ...dependencyProblems(blocks, detect)
    ]
  ];
}, threatWarnings = (block) => {
  let cvss = bulletField(block.body, "CVSS"), reading = cvss === null ? null : parseVector(cvss.split(/\s+/)[0]);
  return reading === null || isProblem(reading) || !isDefined(reading.metrics.E) ? [] : [
    `the CVSS line on the fix "${block.name}" carries the Threat metric E, which the rating guide keeps out of scope`
  ];
}, planWarnings = (plan) => sectionBlocks(plan, "Fixes").flatMap(threatWarnings);

// src/hooks/validate/validate.ts
var MEMORY_FILES2 = {
  charter: ".lagune/memory/charter.md",
  detect: ".lagune/memory/detect.md",
  plan: ".lagune/memory/plan.md",
  harden: ".lagune/memory/harden.md"
}, TARGETS = ["charter", "detect", "plan", "harden"], RULES2 = {
  charter: (content3) => validateCharter(content3),
  detect: (content3) => validateDetect(content3),
  plan: (content3, memory) => validatePlan(content3, memory.detect),
  harden: (content3, memory) => validateHarden(content3, memory.plan)
}, WARNING_RULES = {
  charter: (content3) => charterWarnings(content3),
  detect: () => [],
  plan: (content3) => planWarnings(content3),
  harden: () => []
}, isTarget = (value) => TARGETS.some((target) => target === value), parseTargets = (raw) => {
  let requested = raw.trim();
  if (requested === "") return [...TARGETS];
  if (!isTarget(requested))
    throw new Error(
      "validate input needs one of charter, detect, plan, or harden, or no argument to validate every memory artifact"
    );
  return [requested];
}, strippedOf = (content3) => content3 === null ? null : stripComments(content3), commentWarnings = (content3) => {
  let count = commentSpans(content3).length;
  return count === 0 ? [] : [
    `the file carries ${count === 1 ? "one markdown comment" : `${count} markdown comments`}, likely leftover template guidance that nothing in the chain reads`
  ];
}, validateOne = (memory, stripped, target, required) => {
  let file = MEMORY_FILES2[target], content3 = memory[target], structural = stripped[target];
  if (content3 === null || structural === null)
    return {
      target,
      file,
      status: "absent",
      problems: required ? [
        `${file} is missing. Make sure the artifact was written at this exact path, moving it here if it was saved elsewhere, then rerun this hook.`
      ] : [],
      warnings: []
    };
  let problems = RULES2[target](structural, stripped);
  return {
    target,
    file,
    status: problems.length === 0 ? "valid" : "invalid",
    problems,
    warnings: [
      ...WARNING_RULES[target](structural),
      ...commentWarnings(content3)
    ]
  };
}, validateArtifacts = (memory, targets, required) => {
  let stripped = {
    charter: strippedOf(memory.charter),
    detect: strippedOf(memory.detect),
    plan: strippedOf(memory.plan),
    harden: strippedOf(memory.harden)
  };
  return targets.map(
    (target) => validateOne(memory, stripped, target, required)
  );
}, loadMemory = async (targetDir) => {
  let [charter, detect, plan, harden] = await Promise.all(
    TARGETS.map((target) => readText(join17(targetDir, MEMORY_FILES2[target])))
  );
  return { charter, detect, plan, harden };
}, ALL_CLEAR = `no template drift found
`, NOTHING_TO_VALIDATE = `no memory artifact exists under .lagune/memory/. Make sure the memories were written in that exact directory, moving them there if they were saved elsewhere, then rerun this hook.
`, INSTRUCTION = 'Fix each problem above, then rerun this hook until it prints "no template drift found".', problemsFound = (results) => results.some((result) => result.problems.length > 0), allAbsent = (results) => results.every((result) => result.status === "absent"), formatProblems = (result) => result.problems.length === 0 ? null : result.status === "absent" ? result.problems.join(`
`) : [
  `${result.file} drifted from its template:`,
  ...result.problems.map((problem) => `- ${problem}`)
].join(`
`), formatWarnings = (file, warnings) => warnings.length === 0 ? null : [
  `${file} deserves attention:`,
  ...warnings.map((warning) => `- ${warning}`)
].join(`
`), formatArtifacts = (results) => {
  let sections = results.flatMap((result) => [
    formatProblems(result),
    formatWarnings(result.file, result.warnings)
  ]).filter((section) => section !== null);
  if (sections.length === 0)
    return allAbsent(results) ? NOTHING_TO_VALIDATE : ALL_CLEAR;
  if (!problemsFound(results))
    return `${ALL_CLEAR}
${sections.join(`

`)}
`;
  let instruction = results.some((result) => result.status === "invalid") ? [INSTRUCTION] : [];
  return `${[...sections, ...instruction].join(`

`)}
`;
}, formatSummary = (summary) => {
  let artifacts = formatArtifacts(summary.results), configs = formatWarnings(CONFIGS_FILE, summary.configsWarnings);
  return configs === null ? artifacts : `${artifacts}
${configs}
`;
}, validate = async (targetDir, payload) => {
  let targets = parseTargets(payload), [memory, configs] = await Promise.all([
    loadMemory(targetDir),
    readText(join17(targetDir, CONFIGS_FILE))
  ]), summary = {
    results: validateArtifacts(memory, targets, payload.trim() !== ""),
    configsWarnings: configsWarnings(configs)
  };
  return {
    output: formatSummary(summary),
    hasFinding: problemsFound(summary.results) || allAbsent(summary.results)
  };
};

// src/hooks/validate/cli.ts
var run14 = (args2) => validate(cwd12(), args2[0] ?? "");

// src/bin/hooks.ts
var HOOKS = {
  agent: run,
  cors: run2,
  crypto: run3,
  cvss: run4,
  infra: run5,
  interpreter: run6,
  jwt: run7,
  network: run8,
  regex: run9,
  repair: run10,
  secrets: run11,
  track: run12,
  untrack: run13,
  validate: run14
}, isHookName = (value) => value !== void 0 && Object.hasOwn(HOOKS, value);

// src/bin/mcp.ts
import { resolve as resolve3 } from "node:path";
import { execPath as execPath2, stdin, stdout as stdout3 } from "node:process";

// src/core/version.ts
import { readFile as readFile7 } from "node:fs/promises";
var loadVersion = async (packageRoot2) => {
  let raw = await readFile7(new URL("package.json", packageRoot2), "utf8"), parsed = JSON.parse(raw);
  if (typeof parsed.version != "string")
    throw new Error("package.json is missing a string `version` field");
  return parsed.version;
};

// src/mcp/project.ts
import { stat as stat2 } from "node:fs/promises";
import { parse as parse2 } from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";
var FILE_SCHEME = "file:", isFolder = async (path) => {
  try {
    return (await stat2(path)).isDirectory();
  } catch {
    return !1;
  }
}, isOwnFolderOrRoot = async (folder, packageRoot2) => parse2(folder).root === folder || await existingWithin(fileURLToPath2(packageRoot2), folder) !== void 0, localFolderOf = (uri) => {
  if (typeof uri != "string" || !URL.canParse(uri)) return;
  let url = new URL(uri);
  if (url.protocol === FILE_SCHEME)
    try {
      return fileURLToPath2(url);
    } catch {
      return;
    }
}, projectFromRoots = async (answer2, packageRoot2) => {
  let roots = readField(answer2, "roots");
  if (!Array.isArray(roots) || roots.length !== 1) return;
  let folder = localFolderOf(readField(roots[0], "uri"));
  if (!(folder === void 0 || !await isFolder(folder)) && !await isOwnFolderOrRoot(folder, packageRoot2))
    return folder;
};

// src/mcp/server.ts
import { createInterface } from "node:readline";

// src/mcp/engine.ts
import { execFile } from "node:child_process";
var MAX_OUTPUT_BYTES = 64 * 1024 * 1024, runEngine = ({ runtime, entry: entry2, project }, args2) => new Promise((resolve5) => {
  execFile(
    runtime,
    [entry2, ...args2],
    {
      cwd: project,
      encoding: "utf8",
      maxBuffer: MAX_OUTPUT_BYTES,
      windowsHide: !0
    },
    (error, stdout10, stderr2) => {
      let interruption = error !== null && typeof error.code != "number" ? error.message : "", output = [stdout10, stderr2, interruption].map((text3) => text3.trimEnd()).filter((text3) => text3.length > 0).join(`
`);
      resolve5({ output, failed: error !== null });
    }
  );
});

// src/mcp/server.ts
var LATEST_PROTOCOL = "2025-11-25", PROTOCOLS = /* @__PURE__ */ new Set([
  LATEST_PROTOCOL,
  "2025-06-18",
  "2025-03-26",
  "2024-11-05"
]), PARSE_ERROR = -32700, INVALID_REQUEST = -32600, METHOD_NOT_FOUND = -32601, INVALID_PARAMS = -32602, INTERNAL_ERROR = -32603, isRequestId = (value) => typeof value == "string" || typeof value == "number", failure = (code, message) => ({
  error: { code, message }
}), toolResult = (text3, isError) => ({
  result: { content: [{ type: "text", text: text3 }], isError }
}), initialize = (params, session) => {
  let requested = readField(params, "protocolVersion");
  return session.rootsOffered = isRecord(
    readField(readField(params, "capabilities"), "roots")
  ), {
    result: {
      protocolVersion: typeof requested == "string" && PROTOCOLS.has(requested) ? requested : LATEST_PROTOCOL,
      capabilities: { tools: {} },
      serverInfo: { name: "lagune", version: session.server.version }
    }
  };
}, callTool = async (params, session) => {
  let name = readField(params, "name"), tool = findTool(name);
  if (tool === void 0)
    return failure(INVALID_PARAMS, `Unknown tool: ${String(name)}`);
  let project = await session.project;
  if (project === void 0) return toolResult(noServedProject(), !0);
  let { runtime, entry: entry2 } = session.server, run16 = await runTool(
    tool,
    readField(params, "arguments"),
    (args2) => runEngine({ runtime, entry: entry2, project }, args2)
  );
  return toolResult(run16.output, run16.failed);
}, askRoots = (session) => {
  if (session.server.project !== void 0 || !session.rootsOffered) return;
  session.requestsSent += 1;
  let id = `roots-${session.requestsSent}`;
  session.project = new Promise((resolve5) => {
    session.awaiting.set(
      id,
      (answer2) => resolve5(projectFromRoots(answer2, session.server.packageRoot))
    );
  }), session.send({ id, method: "roots/list" });
}, METHODS = {
  initialize,
  ping: () => ({ result: {} }),
  "tools/list": () => ({ result: { tools: ENGINE_TOOLS.map(describeTool) } }),
  "tools/call": callTool
}, NOTIFICATIONS = {
  "notifications/initialized": askRoots,
  "notifications/roots/list_changed": askRoots
}, envelope = (id, answer2) => JSON.stringify({ jsonrpc: "2.0", id, ...answer2 }), parse3 = (line) => {
  try {
    return JSON.parse(line);
  } catch {
    return;
  }
}, dispatch = async (method, params, session) => {
  if (!Object.hasOwn(METHODS, method))
    return failure(METHOD_NOT_FOUND, `Method not found: ${method}`);
  try {
    return await METHODS[method](params, session);
  } catch (error) {
    return failure(
      INTERNAL_ERROR,
      error instanceof Error ? error.message : String(error)
    );
  }
}, notify = (method, session) => {
  typeof method == "string" && Object.hasOwn(NOTIFICATIONS, method) && NOTIFICATIONS[method](session);
}, settle = (id, answer2, session) => {
  if (!isRequestId(id)) return;
  let resolve5 = session.awaiting.get(id);
  resolve5 !== void 0 && (session.awaiting.delete(id), resolve5(answer2));
}, respond = async (line, session) => {
  let message = parse3(line);
  if (message === void 0)
    return envelope(null, failure(PARSE_ERROR, "Parse error"));
  if (!isRecord(message))
    return envelope(null, failure(INVALID_REQUEST, "Invalid Request"));
  let { id, method, params, result } = message;
  if (method === void 0) {
    settle(id, result, session);
    return;
  }
  if (id === void 0) {
    notify(method, session);
    return;
  }
  return !isRequestId(id) || typeof method != "string" ? envelope(
    isRequestId(id) ? id : null,
    failure(INVALID_REQUEST, "Invalid Request")
  ) : envelope(id, await dispatch(method, params, session));
}, serveMcp = (server, input, output) => new Promise((resolve5) => {
  let lines = createInterface({ input, crlfDelay: 1 / 0 }), session = {
    server,
    send: (message) => output.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}
`),
    rootsOffered: !1,
    project: Promise.resolve(server.project),
    requestsSent: 0,
    awaiting: /* @__PURE__ */ new Map()
  };
  lines.on("line", (line) => {
    line.trim().length !== 0 && respond(line, session).then((reply) => {
      reply !== void 0 && output.write(`${reply}
`);
    });
  }), lines.on("close", () => resolve5());
});

// src/bin/mcp.ts
var UNEXPANDED_VARIABLE = /\$\{[^{}]*\}/, projectNamed = (requested) => requested === void 0 || UNEXPANDED_VARIABLE.test(requested) ? void 0 : requested, namedProject = async (project, packageRoot2) => {
  if (!await isFolder(project)) throw new Error(noProjectFolder(project));
  if (await isOwnFolderOrRoot(project, packageRoot2))
    throw new Error(notAProjectFolder(project));
  return project;
}, startingProject = async (cwd14, packageRoot2) => await isOwnFolderOrRoot(cwd14, packageRoot2) ? void 0 : cwd14, runMcp = async (requested, cwd14, packageRoot2, entry2) => {
  let named = projectNamed(requested), project = named === void 0 ? await startingProject(cwd14, packageRoot2) : await namedProject(resolve3(cwd14, named), packageRoot2);
  await serveMcp(
    {
      runtime: execPath2,
      entry: entry2,
      project,
      packageRoot: packageRoot2,
      version: await loadVersion(packageRoot2)
    },
    stdin,
    stdout3
  );
};

// src/bin/run.ts
import { stdout as stdout9 } from "node:process";

// src/cli/prompt.ts
import { stdin as stdin3 } from "node:process";

// src/cli/interactive-select.ts
import { stdin as stdin2, stdout as stdout4 } from "node:process";
import { emitKeypressEvents } from "node:readline";
import { stripVTControlCharacters } from "node:util";
var ESC = "\x1B", CURSOR_HIDE = `${ESC}[?25l`, CURSOR_SHOW = `${ESC}[?25h`, DEFAULT_MAX_VISIBLE = 10, FALLBACK_COLUMNS = 80, columns = () => stdout4.columns && stdout4.columns > 0 ? stdout4.columns : FALLBACK_COLUMNS, visualRows = (line) => {
  let width = stripVTControlCharacters(line).length;
  return Math.max(1, Math.ceil(width / columns()));
}, totalRows = (lines) => lines.reduce((sum2, line) => sum2 + visualRows(line), 0), matches = (option, query) => query ? `${option.label} ${option.keywords ?? ""}`.toLowerCase().includes(query.toLowerCase()) : !0, windowStart = (cursor, count, maxVisible) => {
  if (count <= maxVisible) return 0;
  let half = Math.floor(maxVisible / 2);
  return Math.max(0, Math.min(cursor - half, count - maxVisible));
}, isLocked = (entry2) => entry2?.option.locked === !0, firstSelectable = (visible) => {
  let index2 = visible.findIndex((entry2) => !isLocked(entry2));
  return index2 === -1 ? 0 : index2;
}, moveCursor = (visible, cursor, step) => {
  for (let next = cursor + step; next >= 0 && next < visible.length; next += step)
    if (!isLocked(visible[next])) return next;
  return cursor;
}, labelStyle = (option, isActive) => option.locked ? color.dim(option.label) : isActive ? color.blue(option.label) : option.label, pointerFor = (option, isActive) => isActive && !option.locked ? color.blue("\u203A") : " ", overflowLine = (hiddenBefore, hiddenAfter) => {
  if (hiddenBefore === 0 && hiddenAfter === 0) return;
  let parts = [];
  return hiddenBefore > 0 && parts.push(`\u2191 ${hiddenBefore} more`), hiddenAfter > 0 && parts.push(`\u2193 ${hiddenAfter} more`), color.dim(`   ${parts.join("   ")}`);
}, visibleRows = (visible, cursor, maxVisible, renderRow) => {
  let start = windowStart(cursor, visible.length, maxVisible), end = Math.min(visible.length, start + maxVisible), rows = [];
  for (let position2 = start; position2 < end; position2 += 1)
    rows.push(renderRow(visible[position2], position2 === cursor));
  let overflow = overflowLine(start, visible.length - end);
  return overflow ? [...rows, overflow] : rows;
}, createScreen = (buildLines, onKeypress) => {
  let lastHeight = 0, clear = () => {
    if (lastHeight !== 0) {
      stdout4.write(`${ESC}[${lastHeight}A`);
      for (let row = 0; row < lastHeight; row += 1)
        stdout4.write(`${ESC}[2K${ESC}[1B`);
      stdout4.write(`${ESC}[${lastHeight}A`);
    }
  }, render2 = () => {
    clear();
    let lines = buildLines();
    stdout4.write(`${lines.join(`
`)}
`), lastHeight = totalRows(lines);
  }, cleanup = () => {
    stdin2.off("keypress", handler), stdin2.isTTY && stdin2.setRawMode(!1), stdin2.pause(), stdout4.write(CURSOR_SHOW);
  }, writeFinal = (summary) => {
    clear(), stdout4.write(`${summary}
`), lastHeight = 0, cleanup();
  }, handler = (_str, key) => onKeypress(key);
  return stdout4.write(CURSOR_HIDE), emitKeypressEvents(stdin2), stdin2.isTTY && stdin2.setRawMode(!0), stdin2.resume(), stdin2.on("keypress", handler), { render: render2, writeFinal };
}, header = (config, query) => [
  color.bold(config.title),
  color.dim(config.hint),
  `${color.dim("Search:")} ${query}${color.blue("\u2588")}`,
  ""
], withFooter = (lines, footer2) => footer2 ? [...lines, "", color.dim(footer2)] : lines, isCancel = (key) => key?.name === "escape" || key?.ctrl === !0 && key?.name === "c", isTextInput = (key) => {
  let sequence = key?.sequence;
  return sequence !== void 0 && !key.ctrl && sequence.length === 1 && sequence >= " ";
}, interactiveSelect = (config) => {
  let {
    options,
    maxVisible = DEFAULT_MAX_VISIBLE,
    emptyLabel = "No matching options.",
    confirmLabel = "Choice:",
    footer: footer2
  } = config;
  return new Promise((resolve5) => {
    let query = "", filtered = () => options.map((option, index2) => ({ option, index: index2 })).filter(({ option }) => matches(option, query)), cursor = firstSelectable(filtered()), renderRow = ({ option }, isActive) => ` ${pointerFor(option, isActive)} ${labelStyle(option, isActive)}`, buildLines = () => {
      let visible = filtered();
      return visible.length === 0 ? withFooter(
        [...header(config, query), color.dim(`  ${emptyLabel}`)],
        footer2
      ) : withFooter(
        [
          ...header(config, query),
          ...visibleRows(visible, cursor, maxVisible, renderRow)
        ],
        footer2
      );
    }, finish = (result) => {
      let summary = result === void 0 ? color.dim("Cancelled") : `${color.green(confirmLabel)} ${options[result]?.label}`;
      screen.writeFinal(`${color.bold(config.title)}
${summary}`), resolve5(result);
    }, screen = createScreen(buildLines, (key) => {
      if (isCancel(key)) return finish(void 0);
      let visible = filtered();
      if (key?.name === "up")
        return cursor = moveCursor(visible, cursor, -1), screen.render();
      if (key?.name === "down")
        return cursor = moveCursor(visible, cursor, 1), screen.render();
      if (key?.name === "return" || key?.name === "enter") {
        let chosen = visible[cursor];
        chosen && !chosen.option.locked && finish(chosen.index);
        return;
      }
      if (key?.name === "backspace")
        return query = query.slice(0, -1), cursor = firstSelectable(filtered()), screen.render();
      isTextInput(key) && (query += key.sequence, cursor = firstSelectable(filtered()), screen.render());
    });
    screen.render();
  });
}, initialSelection = (options) => new Set(
  options.map((option, index2) => ({ option, index: index2 })).filter(({ option }) => option.selected || option.locked).map(({ index: index2 }) => index2)
), interactiveMultiSelect = (config) => {
  let { options, maxVisible = DEFAULT_MAX_VISIBLE, footer: footer2 } = config;
  return new Promise((resolve5) => {
    let query = "", selected = initialSelection(options), filtered = () => options.map((option, index2) => ({ option, index: index2 })).filter(({ option }) => matches(option, query)), cursor = firstSelectable(filtered()), renderRow = ({ option, index: index2 }, isActive) => {
      let box = option.locked ? color.dim("[x]") : selected.has(index2) ? color.green("[x]") : "[ ]";
      return ` ${pointerFor(option, isActive)} ${box} ${labelStyle(option, isActive)}`;
    }, buildLines = () => {
      let visible = filtered();
      return visible.length === 0 ? withFooter(
        [...header(config, query), color.dim("  No matching categories.")],
        footer2
      ) : withFooter(
        [
          ...header(config, query),
          ...visibleRows(visible, cursor, maxVisible, renderRow)
        ],
        footer2
      );
    }, finish = (result) => {
      let summary = result === void 0 ? color.dim("Cancelled") : result.length === 0 ? color.dim("Categories: none") : `${color.green("Categories:")} ${result.map((index2) => options[index2]?.label).join(", ")}`;
      screen.writeFinal(`${color.bold(config.title)}
${summary}`), resolve5(result);
    }, screen = createScreen(buildLines, (key) => {
      if (isCancel(key)) return finish(void 0);
      let visible = filtered();
      if (key?.name === "up")
        return cursor = moveCursor(visible, cursor, -1), screen.render();
      if (key?.name === "down")
        return cursor = moveCursor(visible, cursor, 1), screen.render();
      if (key?.name === "space") {
        let chosen = visible[cursor];
        chosen && !chosen.option.locked && (selected.has(chosen.index) ? selected.delete(chosen.index) : selected.add(chosen.index), screen.render());
        return;
      }
      if (key?.name === "return" || key?.name === "enter")
        return finish([...selected].sort((left, right) => left - right));
      if (key?.name === "backspace")
        return query = query.slice(0, -1), cursor = firstSelectable(filtered()), screen.render();
      isTextInput(key) && (query += key.sequence, cursor = firstSelectable(filtered()), screen.render());
    });
    screen.render();
  });
};

// src/cli/prompt.ts
var isInteractive = () => stdin3.isTTY === !0, lockedFirst = (items, isLocked2) => [
  ...items.filter((item) => isLocked2(item)),
  ...items.filter((item) => !isLocked2(item))
], LIST_TARGETS = [
  {
    value: "findings",
    label: "Findings: the security findings Lagune tracks"
  },
  {
    value: "categories",
    label: "Categories: the specialization categories and which this project uses"
  }
], promptForListTarget = async () => {
  let index2 = await interactiveSelect({
    title: listSelectTitle(),
    hint: listSelectHint(),
    options: LIST_TARGETS.map((target) => ({
      label: target.label,
      keywords: target.value
    })),
    confirmLabel: "List:",
    footer: selectFooter()
  });
  if (index2 !== void 0)
    return LIST_TARGETS[index2].value;
}, promptForCategories = async (categories, locked) => {
  let ordered = lockedFirst(
    categories,
    (category) => locked.includes(category.key)
  ), indexes = await interactiveMultiSelect({
    title: categoriesSelectTitle(),
    hint: categoriesSelectHint(),
    options: ordered.map((category) => ({
      label: `${category.label}: ${category.description}`,
      keywords: category.key,
      locked: locked.includes(category.key)
    })),
    footer: categoriesSelectFooter()
  });
  return indexes === void 0 ? [] : indexes.map((index2) => ordered[index2].key).filter((key) => !locked.includes(key));
};

// src/bin/catalog.ts
import { stdout as stdout5 } from "node:process";
var printSpecialization = async (name, cwd14, packageRoot2) => {
  if (!isSpecializationName(name))
    throw new Error(invalidSpecializationName(name));
  let text3 = await readSpecialization(cwd14, packageRoot2, name);
  if (text3 === void 0) throw new Error(noSpecialization(name));
  stdout5.write(text3);
}, runCatalog = async (names, cwd14, packageRoot2) => {
  if (names.length > 1) throw new Error(catalogUsage());
  let [name] = names;
  if (name !== void 0) return printSpecialization(name, cwd14, packageRoot2);
  stdout5.write(list2(await catalogEntries(cwd14)));
};

// src/bin/categories.ts
import { stdout as stdout6 } from "node:process";

// src/categories/categories.ts
var CATEGORIES = [
  {
    key: "owasp",
    label: "OWASP",
    description: "Harden against the application security risks OWASP tracks: injection, broken access control, auth, and crypto failures"
  },
  {
    key: "infra",
    label: "Infrastructure",
    description: "Harden container, workload, and serverless config: Dockerfile, Compose, Pod security, FaaS IAM and triggers"
  },
  {
    key: "ai",
    label: "AI / LLM",
    description: "Harden AI and LLM integrations against prompt injection and unsafe tool, agent, retrieval, and MCP wiring"
  },
  {
    key: "lovable",
    label: "Lovable",
    description: "Harden AI-generated Supabase apps (Lovable and similar): RLS gaps, leaked service_role keys, and insecure defaults"
  },
  {
    key: "javascript",
    label: "JavaScript",
    description: "Harden JavaScript and its runtimes against eval and child_process RCE, path traversal, and prototype pollution"
  },
  {
    key: "python",
    label: "Python",
    description: "Harden Python against pickle and YAML deserialization RCE, str.format string traversal, and class pollution"
  },
  {
    key: "rust",
    label: "Rust",
    description: "Harden Rust against unsound unsafe APIs, transmute misuse, integer overflow, and FFI boundary undefined behavior"
  },
  {
    key: "java",
    label: "Java",
    description: "Harden Java against ObjectInputStream deserialization gadget chains that culminate in remote code execution"
  },
  {
    key: "ruby",
    label: "Ruby",
    description: "Harden Ruby against Marshal.load and YAML deserialization gadget chains that reach remote code execution"
  },
  {
    key: "php",
    label: "PHP",
    description: "Harden PHP against type-juggling auth bypass, object injection gadget chains, and insecure configuration defaults"
  },
  {
    key: "go",
    label: "Go",
    description: "Harden Go against typed-nil interface bugs, goroutine data races, and unsafe concurrency on security paths"
  },
  {
    key: "c-cpp",
    label: "C / C++",
    description: "Harden C and C++ against format-string bugs, buffer overflows, and out-of-bounds writes that enable code execution"
  },
  {
    key: "dotnet",
    label: ".NET",
    description: "Harden .NET and C# against BinaryFormatter deserialization RCE and the encoder bypasses that reach XSS"
  }
], findCategory = (categories, key) => categories.find((category) => category.key === key), unknownCategoryKeys = (categories, keys) => keys.filter((key) => findCategory(categories, key) === void 0), unknownCategoriesMessage = (keys, availableKeys) => [
  `Unknown specialization ${keys.length === 1 ? "category" : "categories"}: ${keys.join(", ")}`,
  `Available categories: ${availableKeys.join(", ")}`
].join(`
`), assertKnownCategories = (categories, keys) => {
  let unknown = unknownCategoryKeys(categories, keys);
  if (unknown.length > 0)
    throw new Error(
      unknownCategoriesMessage(
        unknown,
        categories.map((category) => category.key)
      )
    );
}, addCategories = (current, requested) => {
  let keys = [...new Set(requested)], changed = keys.filter((key) => !current.includes(key));
  return {
    categories: [...current, ...changed],
    changed,
    unchanged: keys.filter((key) => current.includes(key))
  };
}, removeCategories = (current, requested) => {
  let keys = [...new Set(requested)];
  return {
    categories: current.filter((key) => !keys.includes(key)),
    changed: keys.filter((key) => current.includes(key)),
    unchanged: keys.filter((key) => !current.includes(key))
  };
};

// src/cli/select-categories.ts
var defaultDeps = {
  isInteractive,
  promptForCategories
}, allLocked = (input) => input.categories.every((category) => input.locked.includes(category.key)), selectCategories = async (input, deps = defaultDeps) => {
  if (input.requested.length > 0) return input.requested;
  if (deps.isInteractive())
    return allLocked(input) ? [] : deps.promptForCategories(input.categories, input.locked);
};

// src/bin/categories.ts
var CHANGES = {
  add: addCategories,
  remove: removeCategories
}, print = (lines) => {
  stdout6.write(`${lines.join(`
`)}
`);
}, choices = (action, used) => action === "add" ? { categories: CATEGORIES, locked: used } : {
  categories: used.map((key) => findCategory(CATEGORIES, key)).filter((category) => category !== void 0),
  locked: []
}, runCategoryChange = async (action, requested, cwd14) => {
  let used = usedCategories(await readProjectCategories(cwd14)), selected = await selectCategories({
    requested,
    ...choices(action, used)
  });
  if (selected === void 0) throw new Error(categoriesUsage(action));
  if (assertKnownCategories(CATEGORIES, selected), selected.length === 0) return print([banner(), "", nothingSelected()]);
  let change = CHANGES[action](used, selected);
  await recordCategories(cwd14, change.categories), print([banner(), "", categoriesRecorded(action, change)]);
}, categoriesReport = async (cwd14) => {
  let recorded = await readProjectCategories(cwd14);
  return categoryList(
    CATEGORIES,
    usedCategories(recorded),
    recorded !== void 0
  );
};

// src/bin/dashboard.ts
import { join as join22 } from "node:path";
import { fileURLToPath as fileURLToPath3 } from "node:url";

// src/dashboard/server/start.ts
import { pid } from "node:process";

// src/dashboard/server/config.ts
import { join as join18 } from "node:path";
var host = "127.0.0.1", defaultPort = 0, resolvePaths = (cwd14, distDir) => ({
  lagune: join18(cwd14, ".lagune"),
  dist: distDir
});

// src/dashboard/server/http-server.ts
import { createServer } from "node:http";
import { extname as extname3 } from "node:path";

// src/dashboard/server/actions.ts
var CATEGORY_KEYS = new Set(
  CATEGORIES.map((category) => category.key)
), CATEGORIES_FIELDS = /* @__PURE__ */ new Set(["categories"]), parseCategories = (value) => {
  if (!(!Array.isArray(value) || value.length > CATEGORIES.length || !value.every(
    (item) => typeof item == "string" && CATEGORY_KEYS.has(item)
  )))
    return [...new Set(value.filter((item) => typeof item == "string"))];
}, parseCategoriesRequest = (body) => {
  if (!isRecord(body)) return;
  let keys = Object.keys(body);
  if (keys.length > CATEGORIES_FIELDS.size || !keys.every((key) => CATEGORIES_FIELDS.has(key))) return;
  let categories = parseCategories(body.categories);
  return categories === void 0 ? void 0 : { categories };
}, INVALID_REQUEST2 = {
  status: 400,
  body: { ok: !1, error: "Invalid request" }
}, failed = (error) => {
  let oneLine = (error instanceof Error ? error.message : String(error)).replaceAll("\r", " ").replaceAll(`
`, " ");
  return process.stderr.write(`[dashboard] categories failed: ${oneLine}
`), {
    status: 500,
    body: { ok: !1, error: "Recording the categories failed" }
  };
}, handleCategories = async (body, context) => {
  let request = parseCategoriesRequest(body);
  if (request === void 0) return INVALID_REQUEST2;
  try {
    let used = usedCategories(await readProjectCategories(context.cwd)), removed = removeCategories(
      used,
      used.filter((key) => !request.categories.includes(key))
    ), added = addCategories(removed.categories, request.categories);
    return await recordCategories(context.cwd, added.categories), {
      status: 200,
      body: {
        ok: !0,
        added: added.changed.length,
        removed: removed.changed.length
      }
    };
  } catch (error) {
    return failed(error);
  }
}, ACTIONS = /* @__PURE__ */ new Map([
  ["/api/actions/categories", handleCategories]
]);

// src/dashboard/server/data/build/data.ts
import { join as join19, resolve as resolve4 } from "node:path";

// src/dashboard/server/data/tracking.ts
var toEntry = (value) => {
  if (typeof value != "object" || value === null || !("name" in value) || !("paths" in value)) return null;
  let { name, paths } = value;
  return typeof name != "string" || !isStringArray(paths) ? null : { name, paths };
}, parseTracking = (raw) => {
  if (!raw) return { entries: [] };
  try {
    let parsed = JSON.parse(raw);
    if (typeof parsed != "object" || parsed === null || !("entries" in parsed))
      return { entries: [] };
    let { entries } = parsed;
    return Array.isArray(entries) ? {
      entries: entries.map(toEntry).filter((entry2) => entry2 !== null)
    } : { entries: [] };
  } catch {
    return { entries: [] };
  }
}, pathsByName = (tracking) => Object.assign(
  /* @__PURE__ */ Object.create(null),
  Object.fromEntries(
    tracking.entries.map((entry2) => [entry2.name, entry2.paths])
  )
);

// src/dashboard/shared/specialization-meta.ts
var LABELS = {
  "access-control": "Access Control",
  "api-endpoint": "API Endpoint",
  browser: "Browser",
  "c-cpp": "C / C++",
  container: "Container",
  "credential-endpoint": "Credential Endpoint",
  crypto: "Crypto",
  csv: "CSV",
  dotnet: ".NET",
  federation: "Federation",
  go: "Go",
  "http-request": "HTTP Request",
  infra: "Infrastructure",
  interpreter: "Interpreter",
  java: "Java",
  javascript: "JavaScript",
  llm: "LLM",
  network: "Network",
  path: "Path",
  payment: "Payment",
  php: "PHP",
  python: "Python",
  regex: "Regex",
  ruby: "Ruby",
  rust: "Rust",
  secrets: "Secrets",
  serverless: "Serverless",
  sql: "SQL",
  supabase: "Supabase",
  transport: "Transport",
  upload: "Upload",
  xml: "XML"
};
var titleCase = (slug) => slug.split("-").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
var specializationLabel = (name) => LABELS[name] ?? titleCase(name);

// src/dashboard/server/data/parsers.ts
var isAppliedHeading = (heading2) => APPLIED_HEADINGS.some(
  (header2) => heading2.toLowerCase().includes(header2.toLowerCase())
), appliedRow = (line) => {
  let bullet2 = bulletText(line), entry2 = bullet2 === null ? void 0 : appliedEntry(bullet2);
  return entry2 === void 0 ? null : {
    name: entry2.name,
    label: specializationLabel(entry2.name),
    surfaced: entry2.contribution
  };
}, parseApplied = (text3) => {
  let out = [];
  for (let line of withinSection(text3, isAppliedHeading)) {
    if (line.code) continue;
    let row = appliedRow(line.text);
    row && out.push(row);
  }
  return out;
}, BASELINE_PHRASES = [
  "Prefer the simplest vetted control",
  "Only the controls the project needs"
], startsUphold = (text3) => /^[IVXLC]+\.\s/.test(text3) || BASELINE_PHRASES.some((phrase) => text3.startsWith(phrase)), splitUpholds = (raw) => {
  let [first, ...rest] = raw.split(","), parts = [first];
  for (let piece of rest)
    startsUphold(piece.trimStart()) ? parts.push(piece) : parts[parts.length - 1] += `,${piece}`;
  return parts;
}, parseUpholds = (raw) => !raw || /^none directly$/i.test(raw.trim()) ? [] : splitUpholds(raw).map((part) => part.trim()).filter(Boolean).map((text3) => {
  let numbered = text3.match(/^([IVXLC]+)\.\s*(\S.*)?$/);
  return numbered ? {
    baseline: !1,
    label: `${numbered[1]} \xB7 ${numbered[2] ?? ""}`,
    full: text3
  } : { baseline: !0, label: `Baseline \xB7 ${text3}`, full: text3 };
});

// src/dashboard/server/data/build/catalog.ts
var buildCatalog = (detect, entries) => {
  let inCatalog = new Set(entries.map((entry2) => entry2.name)), applied = parseApplied(detect).map((specialization) => ({
    ...specialization,
    applied: !0,
    inCatalog: inCatalog.has(specialization.name)
  })), appliedNames = new Set(applied.map((item) => item.name)), rest = entries.filter((entry2) => !appliedNames.has(entry2.name)).map((entry2) => ({
    name: entry2.name,
    label: specializationLabel(entry2.name),
    applied: !1,
    inCatalog: !0
  }));
  return [...applied, ...rest];
};

// src/dashboard/server/data/build/charter.ts
var buildCharter = (charter) => {
  let principles = sectionBlocks(charter, "Principles").map((block) => ({
    name: block.name,
    rule: inlineText(firstParagraph(block.body))
  })), items = sectionBlocks(charter, "Baseline discipline").map((block) => {
    let bullets = markdownLines(block.body).filter((line) => !line.code).map((line) => line.text.trim()).filter((line) => fieldValue(line, "Why") === null).map(bulletText).filter((content3) => content3 !== null).map(inlineText);
    return {
      name: block.name,
      rule: inlineText(firstParagraph(block.body)),
      bullets
    };
  });
  return {
    principles,
    baseline: { intro: sectionIntro(charter, "Baseline discipline"), items }
  };
};

// src/dashboard/shared/severity.ts
var SEVERITY_ORDER = [
  "Critical",
  "High",
  "Medium",
  "Low",
  "Unranked"
], severityRank = (severity) => {
  let index2 = SEVERITY_ORDER.indexOf(severity);
  return index2 === -1 ? SEVERITY_ORDER.length : index2;
}, toSeverity = (value) => SEVERITY_ORDER.find((severity) => severity === value) ?? "Unranked";

// src/dashboard/server/data/build/findings.ts
var buildFindings = (detect, plan, harden, filesByName) => {
  let detectBlocks = sectionBlocks(detect, "Findings"), planBlocks = sectionBlocks(plan, "Fixes"), hardenBlocks = sectionBlocks(harden, "Applied"), applied = parseApplied(detect);
  return detectBlocks.map((detected) => {
    let planned = planBlocks.find((block) => block.name === detected.name), hardened = hardenBlocks.find(
      (block) => block.name === detected.name
    ), dependency = planned ? bulletField(planned.body, "Depends on") : null;
    return {
      id: slugify(detected.name),
      name: detected.name,
      severity: toSeverity(
        planned ? bulletField(planned.body, "Priority") : null
      ),
      category: inlineText(
        planned ? bulletField(planned.body, "Category") : null
      ),
      cvss: inlineText(planned ? bulletField(planned.body, "CVSS") : null),
      whatItIs: inlineText(bulletField(detected.body, "What it is")),
      whyItMatters: inlineText(bulletField(detected.body, "Why it matters")),
      fix: inlineText(
        (hardened && bulletField(hardened.body, "What changed")) ?? (planned && bulletField(planned.body, "Fix")) ?? ""
      ),
      where: inlineText(hardened && bulletField(hardened.body, "Where")),
      planned: !!planned,
      status: (hardened && bulletField(hardened.body, "Status")) ?? "Not applied",
      verdict: (hardened && bulletField(hardened.body, "Verdict")) ?? null,
      reason: inlineText(hardened && bulletField(hardened.body, "Reason")),
      upholds: parseUpholds(
        planned ? bulletField(planned.body, "Upholds") : null
      ),
      dependsOn: dependency ? { id: slugify(dependency), name: dependency } : null,
      references: planned ? bulletField(planned.body, "References") ?? "" : "",
      specializations: applied.filter(
        (specialization) => specialization.surfaced.includes(detected.name)
      ),
      files: filesByName[detected.name] ?? []
    };
  }).sort(
    (left, right) => severityRank(left.severity) - severityRank(right.severity)
  );
};

// src/dashboard/server/data/build/history.ts
var buildHistory = (history) => sectionBlocks(history, "Closed findings").map((block) => ({
  name: block.name,
  classification: toSeverity(bulletField(block.body, "Classification")),
  category: inlineText(bulletField(block.body, "Category")),
  whatItIs: inlineText(bulletField(block.body, "What it is")),
  closed: inlineText(bulletField(block.body, "Closed"))
}));

// src/dashboard/server/data/build/meta.ts
var matchProject = (detect, charter) => structuralText(detect ?? charter ?? "").match(
  /^#[ \t]+(\S+(?:[ \t]+\S+)*?)[ \t]+(?:Detect Map|Security Charter)/m
)?.[1] ?? "Project", VERSION_LABEL2 = "version", matchVersion = (charter) => {
  for (let line of markdownLines(charter ?? "")) {
    if (line.code || line.text.slice(0, VERSION_LABEL2.length).toLowerCase() !== VERSION_LABEL2)
      continue;
    let cursor = afterSeparator(line.text, VERSION_LABEL2.length);
    if (cursor === -1) continue;
    let value = line.text.slice(cursor).trim().split(" ")[0].split("|")[0];
    if (value !== "") return value;
  }
  return "\u2014";
};

// src/dashboard/server/data/build/phases.ts
var buildPhases = (charter, detect, plan, harden, findings) => [
  { name: "Charter", state: charter ? "done" : "todo" },
  { name: "Detect", state: detect ? "done" : "todo" },
  { name: "Plan", state: plan ? "done" : "todo" },
  { name: "Harden", state: harden ? "done" : "todo" },
  {
    name: "Verify",
    state: findings.some(
      (finding) => finding.verdict && finding.verdict !== "Pending"
    ) ? "done" : "current"
  }
];

// src/dashboard/server/data/build/sidequests.ts
var buildSideQuests = (detect, plan, harden) => [
  ...sectionBullets(detect, "Not determined").map((text3) => ({
    phase: "Detect",
    text: text3
  })),
  ...sectionBullets(plan, "Open questions").map((text3) => ({
    phase: "Plan",
    text: text3
  })),
  ...sectionBullets(harden, "Remaining").map((text3) => ({
    phase: "Harden",
    text: text3
  }))
];

// src/dashboard/server/data/build/data.ts
var buildData = async (laguneDir) => {
  let projectRoot = resolve4(laguneDir, ".."), [detect, plan, harden, charter, history, tracking, categories, own3] = await Promise.all([
    readMarkdown(join19(laguneDir, "memory/detect.md")),
    readMarkdown(join19(laguneDir, "memory/plan.md")),
    readMarkdown(join19(laguneDir, "memory/harden.md")),
    readMarkdown(join19(laguneDir, "memory/charter.md")),
    readMarkdown(join19(laguneDir, "memory/history.md")),
    readText(join19(laguneDir, "tracking.json")),
    readProjectCategories(projectRoot).catch(() => {
    }),
    readOwnIndex(projectRoot).catch(() => [])
  ]), used = usedCategories(categories), entries = await resolveCatalog(projectRoot, used, own3), findings = buildFindings(
    detect,
    plan,
    harden,
    pathsByName(parseTracking(tracking))
  );
  return {
    project: matchProject(detect, charter),
    version: matchVersion(charter),
    tagline: "Read-only view of .lagune/ \xB7 live",
    scope: bulletField(detect, "Scope"),
    dates: {
      mapped: bulletField(detect, "Mapped"),
      planned: bulletField(plan, "Planned"),
      hardened: bulletField(harden, "Hardened")
    },
    phases: buildPhases(charter, detect, plan, harden, findings),
    findings,
    sidequests: buildSideQuests(detect, plan, harden),
    charter: buildCharter(charter),
    catalog: buildCatalog(detect, entries),
    categories: {
      used,
      recorded: categories !== void 0
    },
    history: buildHistory(history).reverse(),
    artifacts: [detect, plan, harden, charter, history].some(
      (artifact) => artifact !== null
    )
  };
};

// src/dashboard/server/guards.ts
var mediaTypeOf = (request) => (request.headers["content-type"] ?? "").split(";")[0].trim().toLowerCase(), readJsonBody = (request, maxBytes = 16384, timeoutMs = 5e3) => mediaTypeOf(request) !== "application/json" ? Promise.resolve({ kind: "unsupported-type" }) : new Promise((resolve5) => {
  let chunks = [], received = 0, settled = !1, settle2 = (result) => {
    settled || (settled = !0, clearTimeout(timer), resolve5(result));
  }, timer = setTimeout(() => {
    request.removeAllListeners("data"), request.pause(), settle2({ kind: "timeout" });
  }, timeoutMs);
  timer.unref?.(), request.on("data", (chunk) => {
    if (received += chunk.length, received > maxBytes) {
      request.removeAllListeners("data"), request.pause(), settle2({ kind: "too-large" });
      return;
    }
    chunks.push(chunk);
  }), request.on("end", () => {
    try {
      let value = JSON.parse(
        Buffer.concat(chunks).toString("utf8")
      );
      settle2({ kind: "ok", value });
    } catch {
      settle2({ kind: "malformed" });
    }
  }), request.on("error", () => settle2({ kind: "malformed" }));
}), crossSiteFetch = (request) => {
  let site = request.headers["sec-fetch-site"];
  return typeof site == "string" && site !== "same-origin" && site !== "none";
}, LOOPBACK_NAMES2 = ["127.0.0.1", "localhost", "[::1]"], loopbackHosts = (port) => LOOPBACK_NAMES2.map((name) => `${name}:${port ?? 0}`), createRequestGuards = (allowedOrigins) => {
  let devOrigins = new Set(allowedOrigins), devHosts = new Set(
    allowedOrigins.map((origin) => new URL(origin).host)
  );
  return { hostAllowed: (request) => {
    let requestHost = request.headers.host;
    return typeof requestHost != "string" ? !1 : loopbackHosts(request.socket.localPort).includes(requestHost) || devHosts.has(requestHost);
  }, originAllowed: (request) => {
    let requestOrigin = request.headers.origin;
    return typeof requestOrigin != "string" ? !1 : loopbackHosts(request.socket.localPort).map(
      (own3) => `http://${own3}`
    ).includes(requestOrigin) || devOrigins.has(requestOrigin);
  } };
};

// src/dashboard/server/live-reload.ts
import { watch } from "node:fs";
import { dirname as dirname4 } from "node:path";
var watchDir = (dir, onChange) => {
  try {
    return watch(dir, { recursive: !0 }, onChange);
  } catch {
    return watch(dir, onChange);
  }
}, createLiveReload = (dir) => {
  let clients = /* @__PURE__ */ new Set(), timer = null, notify2 = () => {
    timer && clearTimeout(timer), timer = setTimeout(() => {
      for (let client of clients)
        try {
          client.write(`data: reload

`);
        } catch {
          clients.delete(client);
        }
    }, 120);
  }, tryWatchTarget = () => {
    try {
      let target = watchDir(dir, notify2);
      return target.on("error", () => {
      }), target;
    } catch {
      return null;
    }
  }, watchParentUntilCreated = () => {
    let parent = watch(dirname4(dir), () => {
      let target = tryWatchTarget();
      target !== null && (parent.close(), watcher = target, notify2());
    });
    return parent.on("error", () => {
    }), parent;
  }, watcher = tryWatchTarget() ?? watchParentUntilCreated();
  return {
    add: (client) => {
      clients.add(client), client.write(`retry: 1000

`);
    },
    remove: (client) => {
      clients.delete(client);
    },
    close: () => {
      timer && clearTimeout(timer), watcher.close();
      for (let client of clients) client.end();
      clients.clear();
    }
  };
};

// src/dashboard/server/session.ts
import { randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir as mkdir2, writeFile as writeFile2 } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join as join20 } from "node:path";
var createSessionToken = () => randomBytes(32).toString("hex"), sessionDir = () => join20(tmpdir(), "lagune"), sessionTokenPath = (pid2) => join20(sessionDir(), `session-${pid2}.token`), persistSessionToken = async (token, pid2) => {
  let dir = sessionDir();
  await mkdir2(dir, { recursive: !0, mode: 448 });
  let path = sessionTokenPath(pid2);
  return await writeFile2(path, token, { encoding: "utf8", mode: 384 }), path;
}, tokenMatches = (expected, received) => {
  if (typeof received != "string") return !1;
  let expectedBytes = Buffer.from(expected), receivedBytes = Buffer.from(received);
  return expectedBytes.length !== receivedBytes.length ? !1 : timingSafeEqual(expectedBytes, receivedBytes);
};

// src/dashboard/server/static-files.ts
import { readFile as readFile8 } from "node:fs/promises";
import { extname as extname2, join as join21, normalize as normalize3, sep as sep3 } from "node:path";
var CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".png": "image/png"
}, resolveWithin = (root, urlPath) => {
  let base = normalize3(root).replace(/[/\\]+$/, ""), relative3 = normalize3(decodeURIComponent(urlPath)).replace(
    /^[/\\]+/,
    ""
  ), fullPath = join21(base, relative3 === "" ? "index.html" : relative3);
  return fullPath !== base && !fullPath.startsWith(base + sep3) ? null : fullPath;
}, serveStatic = async (root, urlPath) => {
  let fullPath = resolveWithin(root, urlPath);
  if (!fullPath)
    return {
      status: 403,
      type: "text/plain; charset=utf-8",
      body: "forbidden"
    };
  try {
    let body = await readFile8(fullPath);
    return {
      status: 200,
      type: CONTENT_TYPES[extname2(fullPath)] ?? "application/octet-stream",
      body
    };
  } catch {
    return {
      status: 404,
      type: "text/plain; charset=utf-8",
      body: "not found"
    };
  }
};

// src/dashboard/server/http-server.ts
var sendData = async (laguneDir) => {
  try {
    return {
      status: 200,
      body: JSON.stringify(await buildData(laguneDir))
    };
  } catch (error) {
    let message = error instanceof Error ? error.message : String(error);
    return { status: 500, body: JSON.stringify({ error: message }) };
  }
}, CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' https://lagune.ai data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'none'"
].join("; "), DISABLED_FEATURES = [
  "camera",
  "microphone",
  "geolocation",
  "browsing-topics"
], PERMISSIONS_POLICY = DISABLED_FEATURES.map(
  (feature) => `${feature}=()`
).join(", "), setDocumentSecurityHeaders = (res) => {
  res.setHeader("content-security-policy", CONTENT_SECURITY_POLICY), res.setHeader("x-frame-options", "DENY"), res.setHeader("referrer-policy", "no-referrer"), res.setHeader("permissions-policy", PERMISSIONS_POLICY);
}, sendJson = (res, status, body) => {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  }), res.end(body);
}, rejectCrossSite = (req, res) => crossSiteFetch(req) ? (sendJson(res, 403, JSON.stringify({ error: "Forbidden" })), !0) : !1, sendMethodNotAllowed = (res, allow) => {
  res.setHeader("allow", allow), sendJson(res, 405, JSON.stringify({ error: "Method not allowed" }));
}, rejectionFor = (body) => {
  if (body.kind === "unsupported-type")
    return {
      status: 415,
      response: { ok: !1, error: "Unsupported media type" }
    };
  if (body.kind === "too-large")
    return { status: 413, response: { ok: !1, error: "Request too large" } };
  if (body.kind === "timeout")
    return { status: 408, response: { ok: !1, error: "Request timed out" } };
  if (body.kind === "malformed")
    return { status: 400, response: { ok: !1, error: "Malformed request" } };
}, createDashboardServer = (options) => {
  let { paths, cwd: cwd14, packageRoot: packageRoot2, token } = options, live = createLiveReload(paths.lagune), guards = createRequestGuards(options.allowedOrigins), actionBusy = !1, runAction = async (req, res, handler) => {
    if (crossSiteFetch(req) || !guards.originAllowed(req) || !tokenMatches(token, req.headers["x-lagune-token"])) {
      sendJson(res, 403, JSON.stringify({ ok: !1, error: "Forbidden" }));
      return;
    }
    if (actionBusy) {
      sendJson(
        res,
        409,
        JSON.stringify({ ok: !1, error: "Another action is running" })
      );
      return;
    }
    actionBusy = !0;
    try {
      let body = await readJsonBody(req), rejection = rejectionFor(body);
      if (rejection !== void 0) {
        sendJson(res, rejection.status, JSON.stringify(rejection.response)), (body.kind === "too-large" || body.kind === "timeout") && res.once("finish", () => req.destroy());
        return;
      }
      let result = await handler(
        body.kind === "ok" ? body.value : void 0,
        { cwd: cwd14, packageRoot: packageRoot2 }
      );
      sendJson(res, result.status, JSON.stringify(result.body));
    } finally {
      actionBusy = !1;
    }
  };
  return { server: createServer(async (req, res) => {
    let url = (req.url ?? "/").split("?")[0], method = req.method ?? "GET";
    if (!guards.hostAllowed(req)) {
      sendJson(res, 403, JSON.stringify({ error: "Forbidden" }));
      return;
    }
    let handler = ACTIONS.get(url);
    if (handler !== void 0) {
      if (method !== "POST") {
        sendMethodNotAllowed(res, "POST");
        return;
      }
      await runAction(req, res, handler);
      return;
    }
    if (method !== "GET") {
      sendMethodNotAllowed(res, "GET");
      return;
    }
    if (url === "/api/session") {
      if (rejectCrossSite(req, res)) return;
      sendJson(res, 200, JSON.stringify({ token }));
      return;
    }
    if (url === "/api/data") {
      if (rejectCrossSite(req, res)) return;
      let { status, body } = await sendData(paths.lagune);
      sendJson(res, status, body);
      return;
    }
    if (url === "/events") {
      res.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
        connection: "keep-alive"
      }), live.add(res), req.on("close", () => live.remove(res)), res.on("error", () => live.remove(res));
      return;
    }
    let asset = await serveStatic(paths.dist, url), served = asset.status === 404 && extname3(url) === "" ? await serveStatic(paths.dist, "/index.html") : asset, cacheable = url.startsWith("/assets/");
    served.type.startsWith("text/html") && setDocumentSecurityHeaders(res), res.writeHead(served.status, {
      "content-type": served.type,
      "cache-control": cacheable ? "public, max-age=3600" : "no-store",
      "x-content-type-options": "nosniff"
    }), res.end(served.body);
  }), live };
};

// src/dashboard/server/open-browser.ts
import { spawn as spawn2 } from "node:child_process";
import { platform as platform2 } from "node:process";
var openerFor = (target) => platform2 === "darwin" ? { command: "open", args: [target] } : platform2 === "win32" ? { command: "cmd", args: ["/c", "start", "", target] } : { command: "xdg-open", args: [target] }, openBrowser = (target) => new Promise((resolve5) => {
  let { command, args: args2 } = openerFor(target), child = spawn2(command, args2, {
    stdio: "ignore",
    detached: !0,
    shell: !1
  });
  child.once("error", resolve5), child.unref(), resolve5();
});

// src/dashboard/server/start.ts
var announce = (url) => {
  process.stdout.write(`
  \u{1FABC} Lagune dashboard \u2192 ${url}
`), process.stdout.write(`
  Watching .lagune/: changes reload the browser.
`), process.stdout.write(`  Press Ctrl+C to stop.

`);
}, listen = (server, port, triesLeft) => new Promise((resolve5, reject) => {
  let onError = (error) => {
    if (error.code !== "EADDRINUSE" || triesLeft <= 0) return reject(error);
    listen(server, port + 1, triesLeft - 1).then(resolve5, reject);
  };
  server.once("error", onError), server.listen(port, host, () => {
    let address = server.address();
    server.removeListener("error", onError), resolve5(typeof address == "object" && address ? address.port : port);
  });
}), startDashboard = async (options) => {
  let paths = resolvePaths(options.cwd, options.distDir), token = createSessionToken();
  await persistSessionToken(token, pid);
  let { server, live } = createDashboardServer({
    paths,
    cwd: options.cwd,
    packageRoot: options.packageRoot,
    allowedOrigins: options.allowedOrigins ?? [],
    token
  }), port = await listen(server, options.port ?? defaultPort, 10), url = `http://${host}:${port}`;
  return announce(url), options.open !== !1 && await openBrowser(url), new Promise((resolve5) => {
    let shutdown = () => {
      live.close(), server.close(() => resolve5()), server.closeAllConnections();
    };
    process.once("SIGINT", shutdown), process.once("SIGTERM", shutdown);
  });
};

// src/bin/dashboard.ts
var runDashboard = async (cwd14, packageRoot2, port) => {
  let distDir = join22(fileURLToPath3(packageRoot2), "lib", "dashboard");
  await startDashboard({ cwd: cwd14, distDir, packageRoot: packageRoot2, port });
};

// src/bin/list.ts
import { stdout as stdout7 } from "node:process";
var TARGETS2 = ["findings", "categories"], REQUESTED = {
  findings: (args2) => args2.findingsRequested,
  categories: (args2) => args2.categoriesRequested
}, chosenTargets = async (args2) => {
  let requested = TARGETS2.filter((target) => REQUESTED[target](args2));
  if (requested.length > 0) return requested;
  if (!isInteractive()) throw new Error(listUsage());
  let chosen = await promptForListTarget();
  return chosen === void 0 ? [] : [chosen];
}, findingsBody = async (cwd14) => {
  let map = await loadTrackingMap(cwd14);
  return findingsReport(map.entries.map((entry2) => entry2.name));
}, REPORTS = {
  findings: findingsBody,
  categories: categoriesReport
}, runList = async (args2, cwd14) => {
  let targets = await chosenTargets(args2);
  if (targets.length === 0) return;
  let bodies = await Promise.all(
    targets.map((target) => REPORTS[target](cwd14))
  );
  stdout7.write(`${[banner(), "", bodies.join(`

`)].join(`
`)}
`);
};

// src/bin/migrate.ts
import { stdout as stdout8 } from "node:process";
var nothingMigrated = async (cwd14) => await hasBlueSpec(cwd14) ? migrateBlueSpecFirst(FROZEN_VERSION) : migrateNothing(), runMigrate = async (cwd14) => {
  let result = await performMigrate(cwd14), body = result.migrated ? migrateReport(result) : await nothingMigrated(cwd14);
  stdout8.write(`${[banner(), "", body].join(`
`)}
`);
};

// src/bin/run.ts
var print2 = (line) => {
  stdout9.write(`${line}
`);
}, printHelp = () => print2(helpText(ENGINE_TOOLS)), changeCategories = (action) => (args2, cwd14) => {
  if (!args2.categoriesRequested) throw new Error(categoriesUsage(action));
  return runCategoryChange(action, args2.values, cwd14);
}, moved = (command) => async () => {
  throw new Error(movedToSkills(command));
}, COMMANDS2 = {
  catalog: (args2, cwd14, packageRoot2) => runCatalog(args2.values, cwd14, packageRoot2),
  add: changeCategories("add"),
  remove: changeCategories("remove"),
  list: (args2, cwd14) => runList(args2, cwd14),
  dashboard: (args2, cwd14, packageRoot2) => runDashboard(cwd14, packageRoot2, args2.port),
  migrate: (_args, cwd14) => runMigrate(cwd14),
  init: moved("init"),
  pull: moved("pull"),
  update: moved("update")
}, run15 = async (args2, cwd14, packageRoot2) => {
  if (args2.version) return print2(await loadVersion(packageRoot2));
  if (args2.help) return printHelp();
  if (args2.unknown !== void 0) throw new Error(unknownCommand(args2.unknown));
  if (args2.command !== void 0)
    return COMMANDS2[args2.command](args2, cwd14, packageRoot2);
  if (args2.bare && isInteractive())
    return runDashboard(cwd14, packageRoot2, args2.port);
  printHelp();
};

// src/bin/index.ts
var entry = fileURLToPath4(import.meta.url), packageRoot = new URL("../../", import.meta.url), cwd13 = process3.cwd(), args = process3.argv.slice(2), [subcommand, ...subcommandArgs] = args, refuse = (command) => {
  process3.stderr.write(`${frozenRefusal(command)}
`), process3.exitCode = 1;
}, prefixedName = (tool, command) => runsCommand(tool, command) ? `${tool.prefix} ${command}` : tool.prefix, answerInstalled = async () => {
  let tool = toolBehind(subcommand);
  if (tool !== void 0) return refuse(prefixedName(tool, subcommandArgs[0]));
  if (isHookName(subcommand)) return refuse(subcommand);
  let parsed = parseCliArgs(args), route = installedRoute(parsed);
  if (route === "refused")
    return refuse(
      parsed.categoriesRequested ? `${parsed.command} --categories` : parsed.command ?? ""
    );
  if (route === "local") return run15(parsed, cwd13, packageRoot);
  let npx = await frozenNpx();
  process3.stderr.write(`${frozenHandoff(FROZEN_VERSION)}
`), process3.exitCode = await handOff(npx, args);
}, runBehind = async (tool, [command, ...values]) => {
  if (!runsCommand(tool, command))
    throw new Error(commandRefusal(tool, command, toolCommandLine));
  return isHookName(command) ? executeHook(HOOKS[command], values) : run15(parseCliArgs([command, ...values]), cwd13, packageRoot);
}, refuseUnprefixed = (name) => {
  if (name !== void 0 && toolFor(name) !== void 0)
    throw new Error(unprefixedCommand(name));
}, answer = async () => {
  if (subcommand === "mcp")
    return runMcp(subcommandArgs[0], cwd13, packageRoot, entry);
  if (await hasManifest(cwd13)) return answerInstalled();
  let tool = toolBehind(subcommand);
  if (tool !== void 0) return runBehind(tool, subcommandArgs);
  refuseUnprefixed(subcommand);
  let parsed = parseCliArgs(args);
  return refuseUnprefixed(parsed.command ?? parsed.unknown), run15(parsed, cwd13, packageRoot);
};
try {
  await answer();
} catch (error) {
  let message = error instanceof Error ? error.message : String(error);
  process3.stderr.write(`${message}
`), process3.exitCode = 1;
}
