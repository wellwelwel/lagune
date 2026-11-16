import libxmljs from 'libxmljs2';

export const importInvoice = (xml) => {
  const document = libxmljs.parseXml(xml, { noent: true, dtdload: true });

  return {
    number: document.get('//number')?.text(),
    customer: document.get('//customer')?.text(),
    total: Number(document.get('//total')?.text()),
  };
};
