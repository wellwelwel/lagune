import type {
  ComponentLinks,
  Components,
  Digraph,
} from '../../../types/hooks/regex.js';

/** Packs an edge list into adjacency arrays, keeping parallel edges and their labels */
export const toDigraph = (
  size: number,
  sources: ArrayLike<number>,
  targets: ArrayLike<number>,
  labels: ArrayLike<number>
): Digraph => {
  const offsets = new Int32Array(size + 1);

  for (let edge = 0; edge < sources.length; edge += 1)
    offsets[sources[edge] + 1] += 1;
  for (let node = 0; node < size; node += 1) offsets[node + 1] += offsets[node];

  const cursor = offsets.slice(0, size);
  const packedTargets = new Int32Array(sources.length);
  const packedLabels = new Int32Array(sources.length);

  for (let edge = 0; edge < sources.length; edge += 1) {
    const slot = cursor[sources[edge]];

    packedTargets[slot] = targets[edge];
    packedLabels[slot] = labels[edge];
    cursor[sources[edge]] += 1;
  }

  return { size, offsets, targets: packedTargets, labels: packedLabels };
};

/** Splits a graph into strongly connected components, numbered sinks first, listing each one's members when asked */
export const stronglyConnected = (
  graph: Digraph,
  listed = true
): Components => {
  const { size, offsets, targets } = graph;
  const order = new Int32Array(size).fill(-1);
  const low = new Int32Array(size);
  const onStack = new Uint8Array(size);
  const component = new Int32Array(size).fill(-1);
  const members: number[][] = [];
  const stack = new Int32Array(size);
  const callNodes = new Int32Array(size);
  const callEdges = new Int32Array(size);
  let stackTop = 0;
  let callTop = 0;
  let counter = 0;
  let count = 0;

  const open = (node: number): void => {
    order[node] = counter;
    low[node] = counter;
    counter += 1;
    stack[stackTop] = node;
    stackTop += 1;
    onStack[node] = 1;
    callNodes[callTop] = node;
    callEdges[callTop] = offsets[node];
    callTop += 1;
  };

  for (let root = 0; root < size; root += 1) {
    if (order[root] !== -1) continue;

    open(root);

    while (callTop > 0) {
      const node = callNodes[callTop - 1];
      const edge = callEdges[callTop - 1];

      if (edge < offsets[node + 1]) {
        const next = targets[edge];

        callEdges[callTop - 1] = edge + 1;

        if (order[next] === -1) open(next);
        else if (onStack[next]) low[node] = Math.min(low[node], order[next]);

        continue;
      }

      callTop -= 1;

      if (callTop > 0) {
        const parent = callNodes[callTop - 1];

        low[parent] = Math.min(low[parent], low[node]);
      }

      if (low[node] !== order[node]) continue;

      if (listed) members.push([]);

      for (;;) {
        stackTop -= 1;

        const member = stack[stackTop];

        onStack[member] = 0;
        component[member] = count;

        if (listed) members[count].push(member);
        if (member === node) break;
      }

      count += 1;
    }
  }

  return { component, members };
};

const hasSelfLoop = (graph: Digraph, node: number): boolean => {
  for (
    let edge = graph.offsets[node];
    edge < graph.offsets[node + 1];
    edge += 1
  )
    if (graph.targets[edge] === node) return true;

  return false;
};

/** Marks every node reachable from the seeds by following the given adjacency */
export const reach = (
  size: number,
  seeds: Iterable<number>,
  neighbors: (node: number, visit: (next: number) => void) => void
): Uint8Array => {
  const seen = new Uint8Array(size);
  const queue: number[] = [];

  for (const seed of seeds) {
    if (seen[seed]) continue;

    seen[seed] = 1;
    queue.push(seed);
  }

  const visit = (next: number): void => {
    if (seen[next]) return;

    seen[next] = 1;
    queue.push(next);
  };

  for (let head = 0; head < queue.length; head += 1)
    neighbors(queue[head], visit);

  return seen;
};

const reverseDigraph = (graph: Digraph): Digraph => {
  const sources: number[] = [];
  const targets: number[] = [];
  const labels: number[] = [];

  for (let node = 0; node < graph.size; node += 1)
    for (
      let edge = graph.offsets[node];
      edge < graph.offsets[node + 1];
      edge += 1
    ) {
      sources.push(graph.targets[edge]);
      targets.push(node);
      labels.push(graph.labels[edge]);
    }

  return toDigraph(graph.size, sources, targets, labels);
};

/** Tells whether a strongly connected group of nodes holds a cycle */
export const isCyclic = (graph: Digraph, group: readonly number[]): boolean =>
  group.length > 1 || hasSelfLoop(graph, group[0]);

/** Marks the nodes that sit on a cycle */
export const cyclicStates = (
  graph: Digraph,
  { members }: Components
): Uint8Array => {
  const cyclic = new Uint8Array(graph.size);

  for (const group of members)
    if (isCyclic(graph, group)) for (const member of group) cyclic[member] = 1;

  return cyclic;
};

/** Marks the nodes from which some marked node can still be reached */
export const ancestorsOf = (graph: Digraph, marked: Uint8Array): Uint8Array => {
  const reversed = reverseDigraph(graph);
  const seeds = [...marked.keys()].filter((node) => marked[node] === 1);

  return reach(graph.size, seeds, (node, visit) => {
    for (
      let edge = reversed.offsets[node];
      edge < reversed.offsets[node + 1];
      edge += 1
    )
      visit(reversed.targets[edge]);
  });
};

/** Lists, without repeats, the components each component steps into and the components that step into it */
export const componentLinks = (
  graph: Digraph,
  { component, members }: Components
): ComponentLinks => {
  const count = members.length;
  const forward: number[][] = Array.from({ length: count }, () => []);
  const backward: number[][] = Array.from({ length: count }, () => []);
  const stamps = new Int32Array(count).fill(-1);
  const { offsets, targets } = graph;

  members.forEach((group, from) => {
    for (const node of group)
      for (let edge = offsets[node]; edge < offsets[node + 1]; edge += 1) {
        const to = component[targets[edge]];

        if (to === from || stamps[to] === from) continue;

        stamps[to] = from;
        forward[from].push(to);
        backward[to].push(from);
      }
  });

  return { forward, backward };
};
