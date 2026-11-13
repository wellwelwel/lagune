/** The part of the WebAssembly global Node.js provides that the engine uses, which TypeScript declares only beside the DOM */
declare global {
  namespace WebAssembly {
    type ImportValue = (...args: never[]) => unknown;

    type Imports = Record<string, Record<string, ImportValue>>;

    type ExportValue = ((...args: never[]) => unknown) | Memory;

    type Exports = Record<string, ExportValue>;

    class Module {
      constructor(bytes: Uint8Array);
    }

    class Instance {
      constructor(module: Module, imports: Imports);
      readonly exports: Exports;
    }

    class Memory {
      private constructor();
      readonly buffer: ArrayBuffer;
    }
  }
}

export {};
