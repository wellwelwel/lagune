import type { EntityDecoderOptions } from 'fast-xml-parser';
import type { XmlElement, XmlList } from '../../types/hooks/dependency.js';
import { EntityDecoder } from '@nodable/entities';
import { XMLParser } from 'fast-xml-parser';
import { SyntaxValidator } from 'fast-xml-validator';
import { isPlainRecord, isString, readField } from '../../core/collections.js';
import { errorMessage } from '../../core/errors.js';
import { cannotJudge } from './text.js';

const TEXT = '#text';

const ATTRIBUTES = ':@';

/** Decodes the five entities XML predefines and numeric character references */
const PREDEFINED_DECODER = new EntityDecoder();

/** XML's own references alone: a document type, where every other entity is declared, is refused instead of read */
const ENTITY_DECODER: EntityDecoderOptions = {
  setExternalEntities: () => undefined,
  addInputEntities: () => {
    throw new Error('it declares a document type');
  },
  reset: () => {
    PREDEFINED_DECODER.reset();
  },
  decode: (text) => PREDEFINED_DECODER.decode(text),
  setXmlVersion: (version) => {
    PREDEFINED_DECODER.setXmlVersion(version);
  },
};

/** One root element, as XML requires, though the validator accepts several unless told otherwise */
const VALIDATOR = new SyntaxValidator({ multipleRoots: false });

/** Deeper than any dependency file nests its elements */
const NESTING_LIMIT = 100;

const PARSER = new XMLParser({
  preserveOrder: true,
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseTagValue: false,
  parseAttributeValue: false,
  ignoreDeclaration: true,
  ignorePiTags: true,
  entityDecoder: ENTITY_DECODER,
  maxNestedTags: NESTING_LIMIT,
});

const malformedTree = (file: string): Error =>
  cannotJudge(file, 'holds XML the checker reads in a shape it never expects');

const attributesOf = (
  file: string,
  value: unknown
): ReadonlyMap<string, string> => {
  if (value === undefined) return new Map();
  if (!isPlainRecord(value)) throw malformedTree(file);

  return new Map(
    Object.entries(value).map(([name, text]) => {
      if (isString(text)) return [name, text];

      throw malformedTree(file);
    })
  );
};

/** The elements of the parser's ordered output, each node an element named by its one key besides the attributes, or a run of text */
const elementsOf = (file: string, nodes: unknown): XmlElement[] => {
  if (!Array.isArray(nodes)) throw malformedTree(file);

  return nodes.flatMap((node: unknown): XmlElement[] => {
    if (!isPlainRecord(node)) throw malformedTree(file);

    const names = Object.keys(node).filter((key) => key !== ATTRIBUTES);

    if (names.length !== 1) throw malformedTree(file);

    const [name] = names;

    if (name === TEXT) return [];

    const content: unknown = node[name];

    if (!Array.isArray(content)) throw malformedTree(file);

    const text = content.flatMap((child: unknown) => {
      const value = isPlainRecord(child) ? child[TEXT] : undefined;

      return isString(value) ? [value] : [];
    });

    return [
      {
        name,
        attributes: attributesOf(file, node[ATTRIBUTES]),
        text: text.join(''),
        children: elementsOf(file, content),
      },
    ];
  });
};

/** Refuses XML that is not well-formed, naming where the validator stopped */
const validateXml = (file: string, content: string): void => {
  try {
    VALIDATOR.validate(content);
  } catch (error) {
    const line = readField(error, 'line');
    const column = readField(error, 'col');

    if (typeof line !== 'number' || typeof column !== 'number') throw error;

    throw cannotJudge(
      file,
      `is not well-formed XML at line ${line}, column ${column}`
    );
  }
};

/** The root element of an XML file, refusing one that is not well-formed or declares a document type */
export const xmlRootOf = (file: string, content: string): XmlElement => {
  validateXml(file, content);

  let parsed: unknown;

  try {
    parsed = PARSER.parse(content);
  } catch (error) {
    throw cannotJudge(
      file,
      `is XML the checker cannot read (${errorMessage(error)})`
    );
  }

  const [root, ...rest] = elementsOf(file, parsed);

  if (root === undefined || rest.length > 0) throw malformedTree(file);

  return root;
};

/** The entries of every list below an element, at any depth, such as each repository a repositories element holds */
export const listedElements = (
  element: XmlElement,
  names: XmlList
): XmlElement[] => {
  const [list, entry] = names;

  return element.children.flatMap((child) => [
    ...(element.name === list && child.name === entry ? [child] : []),
    ...listedElements(child, names),
  ]);
};

/** The text of an element's children of one name, such as a repository's url */
export const childTexts = (element: XmlElement, name: string): string[] =>
  element.children.flatMap((child) =>
    child.name === name ? [child.text.trim()] : []
  );
