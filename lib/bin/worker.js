// src/hooks/regex/worker.ts
import { parentPort } from "node:worker_threads";

// src/core/collections.ts
var isRecord = (value) => typeof value == "object" && value !== null && !Array.isArray(value);
var isPlainContainer = (value) => {
  if (Array.isArray(value)) return !0;
  if (!isRecord(value)) return !1;
  let prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}, deepFreeze = (value) => {
  if (!isPlainContainer(value) || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (let child of Object.values(value)) deepFreeze(child);
  return value;
};

// src/core/dynamic-regex.ts
var compilePattern = (source, flags) => new RegExp(source, flags), propertyRun = (expression) => new RegExp(`\\p{${expression}}+`, "gu");

// src/hooks/regex/budget.ts
var CAP_REACHED = new Error("the analysis reached its work cap"), reachCap = () => {
  throw CAP_REACHED;
}, isCapReached = (error) => error === CAP_REACHED, createMeter = (cap) => ({ cap, spent: 0 }), spend = (meter, steps) => {
  meter.spent += steps, meter.spent > meter.cap && reachCap();
}, ensureAffordable = (meter, steps) => {
  meter.spent + steps > meter.cap && reachCap();
};

// src/hooks/regex/automaton/graph.ts
var toDigraph = (size, sources, targets, labels) => {
  let offsets = new Int32Array(size + 1);
  for (let edge = 0; edge < sources.length; edge += 1)
    offsets[sources[edge] + 1] += 1;
  for (let node = 0; node < size; node += 1) offsets[node + 1] += offsets[node];
  let cursor = offsets.slice(0, size), packedTargets = new Int32Array(sources.length), packedLabels = new Int32Array(sources.length);
  for (let edge = 0; edge < sources.length; edge += 1) {
    let slot = cursor[sources[edge]];
    packedTargets[slot] = targets[edge], packedLabels[slot] = labels[edge], cursor[sources[edge]] += 1;
  }
  return { size, offsets, targets: packedTargets, labels: packedLabels };
}, stronglyConnected = (graph, listed = !0) => {
  let { size, offsets, targets } = graph, order = new Int32Array(size).fill(-1), low = new Int32Array(size), onStack = new Uint8Array(size), component = new Int32Array(size).fill(-1), members = [], stack = new Int32Array(size), callNodes = new Int32Array(size), callEdges = new Int32Array(size), stackTop = 0, callTop = 0, counter = 0, count = 0, open = (node) => {
    order[node] = counter, low[node] = counter, counter += 1, stack[stackTop] = node, stackTop += 1, onStack[node] = 1, callNodes[callTop] = node, callEdges[callTop] = offsets[node], callTop += 1;
  };
  for (let root = 0; root < size; root += 1)
    if (order[root] === -1)
      for (open(root); callTop > 0; ) {
        let node = callNodes[callTop - 1], edge = callEdges[callTop - 1];
        if (edge < offsets[node + 1]) {
          let next = targets[edge];
          callEdges[callTop - 1] = edge + 1, order[next] === -1 ? open(next) : onStack[next] && (low[node] = Math.min(low[node], order[next]));
          continue;
        }
        if (callTop -= 1, callTop > 0) {
          let parent = callNodes[callTop - 1];
          low[parent] = Math.min(low[parent], low[node]);
        }
        if (low[node] === order[node]) {
          for (listed && members.push([]); ; ) {
            stackTop -= 1;
            let member = stack[stackTop];
            if (onStack[member] = 0, component[member] = count, listed && members[count].push(member), member === node) break;
          }
          count += 1;
        }
      }
  return { component, members };
}, hasSelfLoop = (graph, node) => {
  for (let edge = graph.offsets[node]; edge < graph.offsets[node + 1]; edge += 1)
    if (graph.targets[edge] === node) return !0;
  return !1;
}, reach = (size, seeds, neighbors) => {
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
  for (let node = 0; node < graph.size; node += 1)
    for (let edge = graph.offsets[node]; edge < graph.offsets[node + 1]; edge += 1)
      sources.push(graph.targets[edge]), targets.push(node), labels.push(graph.labels[edge]);
  return toDigraph(graph.size, sources, targets, labels);
}, isCyclic = (graph, group) => group.length > 1 || hasSelfLoop(graph, group[0]), cyclicStates = (graph, { members }) => {
  let cyclic = new Uint8Array(graph.size);
  for (let group of members)
    if (isCyclic(graph, group)) for (let member of group) cyclic[member] = 1;
  return cyclic;
}, ancestorsOf = (graph, marked) => {
  let reversed = reverseDigraph(graph), seeds = [...marked.keys()].filter((node) => marked[node] === 1);
  return reach(graph.size, seeds, (node, visit) => {
    for (let edge = reversed.offsets[node]; edge < reversed.offsets[node + 1]; edge += 1)
      visit(reversed.targets[edge]);
  });
}, componentLinks = (graph, { component, members }) => {
  let count = members.length, forward = Array.from({ length: count }, () => []), backward = Array.from({ length: count }, () => []), stamps = new Int32Array(count).fill(-1), { offsets, targets } = graph;
  return members.forEach((group, from) => {
    for (let node of group)
      for (let edge = offsets[node]; edge < offsets[node + 1]; edge += 1) {
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
  for (let index = 0; index < length; index += 1)
    hash = Math.imul(hash ^ runs[index], 2246822507), hash ^= hash >>> 13;
  return hash;
}, sameRuns = (stored, runs, length) => {
  if (stored.length !== length) return !1;
  for (let index = 0; index < length; index += 1)
    if (stored[index] !== runs[index]) return !1;
  return !0;
}, findRuns = (table, klass, runs, length, hash) => {
  let mask = table.slots.length - 1;
  for (let slot = hash & mask; ; slot = slot + 1 & mask) {
    let entry = table.slots[slot];
    if (entry === 0) return -1;
    let id = entry - 1;
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
}, growKeys = (index) => {
  let keys = new Float64Array(index.keys.length * 2), slots = new Float64Array(index.slots.length * 2);
  keys.set(index.keys);
  for (let entry = 0; entry < index.count; entry += 1) {
    let slot = slotOf(slots, keys[entry]);
    slots[slot * 2] = keys[entry], slots[slot * 2 + 1] = entry + 1;
  }
  index.keys = keys, index.slots = slots;
}, keyOf = (index, key) => index.slots[slotOf(index.slots, key) * 2 + 1] - 1, internKey = (index, key) => {
  let slot = slotOf(index.slots, key);
  if (index.slots[slot * 2 + 1] !== 0) return index.slots[slot * 2 + 1] - 1;
  index.count === index.keys.length && (growKeys(index), slot = slotOf(index.slots, key));
  let entry = index.count;
  return index.keys[entry] = key, index.count = entry + 1, index.slots[slot * 2] = key, index.slots[slot * 2 + 1] = entry + 1, entry;
};

// src/hooks/regex/automaton/kinds.ts
var BOUNDARY = 0, LINE = 1, WORD = 2, EXTRA_WORD = 3, OTHER = 4, KIND_COUNT = 5, KINDS = deepFreeze(
  Array.from({ length: KIND_COUNT }, (_, kind) => kind)
), ALL_KINDS = (1 << KIND_COUNT) - 1, maskOf = (kind) => 1 << kind, isLineTest = (test) => test === "begin" || test === "end", wordMask = (unicodeWord) => maskOf(WORD) | (unicodeWord ? maskOf(EXTRA_WORD) : 0), allowedAfter = (test, multiline, unicodeWord, previous) => {
  if (test === "begin")
    return previous === BOUNDARY || multiline && previous === LINE ? ALL_KINDS : 0;
  if (test === "end") return maskOf(BOUNDARY) | (multiline ? maskOf(LINE) : 0);
  let words = wordMask(unicodeWord), afterWord = (words & maskOf(previous)) !== 0, sameSide = afterWord ? words : ALL_KINDS & ~words, otherSide = afterWord ? ALL_KINDS & ~words : words;
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
  for (let [piece, list] of events)
    for (let event of list)
      event.type === "move" && event.certain && event.context === context && visit(piece, event.target, event.gates);
  for (let exit of exits)
    alphabet.pieceKinds.forEach((kind, piece) => {
      (exit.kinds & maskOf(kind)) !== 0 && visit(piece, sink, exit.gates);
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
  let boundary = maskOf(BOUNDARY), sink = ordered.states.length, plain = /* @__PURE__ */ new Set([sink]);
  ordered.states.forEach((state, id) => {
    if (included[id])
      for (let exit of state.exits)
        (exit.kinds & boundary) !== 0 && exit.gates.length === 0 && plain.add(id);
  });
  let gatedExits = ordered.states.flatMap(
    (state, id) => included[id] ? state.exits.filter(
      (exit) => (exit.kinds & boundary) !== 0 && exit.gates.length > 0
    ).map((exit) => ({
      id,
      gates: exit.gates,
      depth: depthOf(exit.gates)
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
  let sink = ordered.states.length, included = reach(
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
  for (let index = input.length - 1; index >= 0; index -= 1) {
    let current = accepting[accepting.length - 1];
    spend(meter, current.length + 1), accepting.push(
      stepBack(current, plain[input[index]], gated[input[index]], scratch)
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
var EMPTY_NODE = deepFreeze({ kind: "empty" }), reversedCache = /* @__PURE__ */ new WeakMap(), charNode = (set) => ({ kind: "char", set }), alternationOf = (branches) => branches.length === 1 ? branches[0] : { kind: "alternation", branches }, reverseFresh = (node) => {
  switch (node.kind) {
    case "sequence":
      return { ...node, items: node.items.map(reverseNode).toReversed() };
    case "alternation":
      return { ...node, branches: node.branches.map(reverseNode) };
    case "repeat":
    case "look":
    case "uncertain":
      return { ...node, body: reverseNode(node.body) };
    case "assertion":
      return node.test === "begin" ? { ...node, test: "end" } : node.test === "end" ? { ...node, test: "begin" } : node;
    default:
      return node;
  }
}, reverseNode = (node) => {
  let cached = reversedCache.get(node);
  if (cached) return cached;
  let reversed = reverseFresh(node);
  return reversedCache.set(node, reversed), reversed;
}, canMatchEmpty = (node) => {
  switch (node.kind) {
    case "char":
      return !1;
    case "sequence":
      return node.items.every(canMatchEmpty);
    case "alternation":
      return node.branches.some(canMatchEmpty);
    case "repeat":
      return node.min === 0 || canMatchEmpty(node.body);
    case "uncertain":
      return canMatchEmpty(node.body);
    default:
      return !0;
  }
}, someNode = (node, predicate) => {
  if (predicate(node)) return !0;
  switch (node.kind) {
    case "sequence":
      return node.items.some((item) => someNode(item, predicate));
    case "alternation":
      return node.branches.some((branch) => someNode(branch, predicate));
    case "repeat":
    case "look":
    case "uncertain":
      return someNode(node.body, predicate);
    default:
      return !1;
  }
}, repeatsUnbounded = (node, captures, visiting = []) => someNode(node, (inner) => inner.kind === "repeat" ? inner.max === 1 / 0 : inner.kind !== "backreference" ? !1 : inner.captures.some(
  (index) => visiting.includes(index) || repeatsUnbounded(captures.get(index) ?? EMPTY_NODE, captures, [
    ...visiting,
    index
  ])
));

// src/hooks/regex/syntax/codeset.ts
var EMPTY_SET = deepFreeze([]), LEGACY_LIMIT = 65536, UNICODE_LIMIT = 1114112, toggle = (boundaries, point) => {
  boundaries.at(-1) === point ? boundaries.pop() : boundaries.push(point);
}, combine = (left, right, keep) => {
  let boundaries = [], leftIndex = 0, rightIndex = 0, inLeft = !1, inRight = !1;
  for (; leftIndex < left.length || rightIndex < right.length; ) {
    let point = Math.min(
      left[leftIndex] ?? 1 / 0,
      right[rightIndex] ?? 1 / 0
    );
    left[leftIndex] === point && (inLeft = !inLeft, leftIndex += 1), right[rightIndex] === point && (inRight = !inRight, rightIndex += 1), keep(inLeft, inRight) !== (boundaries.length % 2 === 1) && toggle(boundaries, point);
  }
  return boundaries;
}, rangeSet = (start, end) => start < end ? [start, end] : EMPTY_SET, pointSet = (point) => [point, point + 1], union = (left, right) => combine(left, right, (inLeft, inRight) => inLeft || inRight), intersect = (left, right) => combine(left, right, (inLeft, inRight) => inLeft && inRight), subtract = (left, right) => combine(left, right, (inLeft, inRight) => inLeft && !inRight), complement = (set, limit) => subtract(rangeSet(0, limit), set), fromPoints = (points) => {
  let sorted = [...new Set(points)].toSorted((left, right) => left - right), boundaries = [];
  for (let point of sorted)
    toggle(boundaries, point), boundaries.push(point + 1);
  return boundaries;
}, fromRanges = (ranges) => ranges.map(([start, end]) => rangeSet(start, end)).reduce(union, EMPTY_SET), isEmptySet = (set) => set.length === 0, overlaps = (left, right) => !isEmptySet(intersect(left, right)), setKey = (set) => set.join(","), expandPoints = (set) => {
  let points = [];
  for (let index = 0; index < set.length; index += 2)
    for (let point = set[index]; point < set[index + 1]; point += 1)
      points.push(point);
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
  for (let index = 0; index < set.length; index += 2)
    for (let position = lowerBound(sortedPoints, set[index]); position < sortedPoints.length && sortedPoints[position] < set[index + 1]; position += 1)
      found.push(sortedPoints[position]);
  return found;
};

// src/hooks/regex/syntax/unicode.ts
var CHUNK = 4096, UNICODE_SEGMENTS = [
  [0, 55296, 1],
  [55296, 56320, 1],
  [56320, 57344, 1],
  [57344, 65536, 1],
  [65536, UNICODE_LIMIT, 2]
], FOLDING_PAIRS = [
  [8147, 912],
  [8163, 944],
  [64261, 64262]
], LINE_TERMINATORS = deepFreeze(
  fromRanges([
    [10, 11],
    [13, 14],
    [8232, 8234]
  ])
), DIGITS = deepFreeze(rangeSet(48, 58)), BASIC_WORD = deepFreeze(
  fromRanges([
    [48, 58],
    [65, 91],
    [95, 96],
    [97, 123]
  ])
), CASE_CHANGING_RUN = /[\p{Changes_When_Casemapped}\p{Changes_When_Casefolded}]+/gu, SPACE_RUN = /\s+/gu, CASELESS_WORD_RUN = /\w+/giu, EMOJI_RUN = /[\p{Emoji}\p{Emoji_Component}\p{Extended_Pictographic}]+/gu, EMOJI_COMPONENT_RUN = /[\p{Emoji}\p{Emoji_Component}\p{Extended_Pictographic}\u200d\ufe0f\u20e3\u{e0020}-\u{e007f}]+/gu, CASELESS_REPEAT = /^(.)\1$/isu, STRING_PROPERTY_MATCHERS = /* @__PURE__ */ new Map([
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
    for (let point = chunk; point < last; point += 1)
      point < 65536 ? units.push(point) : units.push(
        55296 + (point - 65536 >> 10),
        56320 + (point - 65536 & 1023)
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
      ({ start, width, text }) => Array.from(text.matchAll(matcher), (match) => [
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
  for (let unit = 0; unit < LEGACY_LIMIT; unit += 1) {
    let canonical = legacyCanonical(unit), members = groups.get(canonical) ?? [];
    members.push(unit), groups.set(canonical, members);
  }
  return tableFromGroups(groups);
}, findRoot = (parents, point) => {
  let root = point;
  for (; (parents.get(root) ?? root) !== root; ) root = parents.get(root) ?? root;
  return parents.set(point, root), root;
}, singlePoint = (text) => {
  let point = text.codePointAt(0);
  return point !== void 0 && String.fromCodePoint(point) === text ? point : null;
}, foldsTogether = (left, right) => CASELESS_REPEAT.test(String.fromCodePoint(left, right)), unicodeLinks = (point) => {
  let text = String.fromCodePoint(point);
  return [singlePoint(text.toLowerCase()), singlePoint(text.toUpperCase())].filter((other) => other !== null && other !== point).filter((other) => foldsTogether(point, other));
}, unicodeTable = () => {
  let parents = /* @__PURE__ */ new Map(), links = [
    ...expandPoints(nativeSet(CASE_CHANGING_RUN)).flatMap(
      (point) => unicodeLinks(point).map((other) => [point, other])
    ),
    ...FOLDING_PAIRS.filter(([left, right]) => foldsTogether(left, right))
  ];
  for (let [left, right] of links)
    parents.set(findRoot(parents, left), findRoot(parents, right));
  let groups = /* @__PURE__ */ new Map();
  for (let point of parents.keys()) {
    let root = findRoot(parents, point), members = groups.get(root) ?? [];
    members.push(point), groups.set(root, members);
  }
  return tableFromGroups(groups);
}, caseTable = (unicode) => {
  let cached = caseCache.get(unicode);
  if (cached) return cached;
  let table = unicode ? unicodeTable() : legacyTable();
  return caseCache.set(unicode, table), table;
}, caseClosure = (set, unicode) => {
  let table = caseTable(unicode), extra = pointsWithin(set, table.points).flatMap(
    (point) => table.classes.get(point) ?? []
  );
  return extra.length === 0 ? set : union(set, fromPoints(extra));
}, caseRepresentative = (point, unicode) => caseTable(unicode).classes.get(point)?.[0] ?? point, spaceSet = () => nativeSet(SPACE_RUN), wordSet = (ignoreCase, unicode) => ignoreCase && unicode ? nativeSet(CASELESS_WORD_RUN) : BASIC_WORD, propertySet = (expression) => nativeSet(propertyRun(expression)), stringPropertySingles = (expression) => {
  let matcher = STRING_PROPERTY_MATCHERS.get(expression);
  return matcher === void 0 ? null : fromPoints(
    expandPoints(nativeSet(EMOJI_RUN)).filter(
      (point) => matcher.test(String.fromCodePoint(point))
    )
  );
}, emojiComponents = () => nativeSet(EMOJI_COMPONENT_RUN), universeLimit = (unicode) => unicode ? UNICODE_LIMIT : LEGACY_LIMIT;

// src/hooks/regex/automaton/alphabet.ts
var kindSets = (automaton) => {
  let sets = [], uses = (kind) => (automaton.kinds & maskOf(kind)) !== 0;
  return uses(LINE) && sets.push([LINE_TERMINATORS, LINE]), uses(EXTRA_WORD) && sets.push([subtract(wordSet(!0, !0), BASIC_WORD), EXTRA_WORD]), uses(WORD) && sets.push([BASIC_WORD, WORD]), sets;
}, partitionAlphabet = (automaton) => {
  let kinds = kindSets(automaton), sets = [...automaton.sets, ...kinds.map(([set]) => set)], boundaries = [
    .../* @__PURE__ */ new Set([0, automaton.universe[1], ...sets.flat()])
  ].toSorted((left, right) => left - right), members = Array.from(
    { length: boundaries.length - 1 },
    () => []
  );
  sets.forEach((set, index) => {
    for (let range = 0; range < set.length; range += 2) {
      let last = lowerBound(boundaries, set[range + 1]);
      for (let segment = lowerBound(boundaries, set[range]); segment < last; segment += 1)
        members[segment].push(index);
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
      kindOwner === void 0 ? OTHER : kinds[kindOwner - automaton.sets.length][1]
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
var isLineAssertion = (node) => node.kind === "assertion" && isLineTest(node.test), lineAssertionInMiddle = (node, isBegin, isEnd) => {
  switch (node.kind) {
    case "alternation":
      return node.branches.some(
        (branch) => lineAssertionInMiddle(branch, isBegin, isEnd)
      );
    case "sequence":
      return node.items.some(
        (item, index) => lineAssertionInMiddle(
          item,
          isBegin && index === 0,
          isEnd && index === node.items.length - 1
        )
      );
    case "repeat":
    case "look":
    case "uncertain":
      return lineAssertionInMiddle(node.body, !1, !1);
    case "assertion":
      return node.test === "begin" ? !isBegin : node.test === "end" ? !isEnd : !1;
    default:
      return !1;
  }
}, everyEdge = (node, atStart, predicate) => {
  switch (node.kind) {
    case "alternation":
      return node.branches.every(
        (branch) => everyEdge(branch, atStart, predicate)
      );
    case "sequence":
      return node.items.length > 0 && everyEdge(
        node.items[atStart ? 0 : node.items.length - 1],
        atStart,
        predicate
      );
    case "empty":
      return !1;
    default:
      return predicate(node);
  }
}, strictLine = (test) => (node) => node.kind === "assertion" && node.test === test && !node.multiline, anyLine = (test) => (node) => node.kind === "assertion" && node.test === test, notLine = (test) => (node) => !(node.kind === "assertion" && node.test === test), anchoring = (root, sticky) => {
  let searches = !sticky && !everyEdge(root, !0, strictLine("begin")), trails = !everyEdge(root, !1, strictLine("end")), multilineAnchor = someNode(
    root,
    (node) => isLineAssertion(node) && node.multiline
  ), anyAnchor = someNode(root, isLineAssertion), ragged = !everyEdge(root, !0, anyLine("begin")) && !everyEdge(root, !0, notLine("begin")) || !everyEdge(root, !1, anyLine("end")) && !everyEdge(root, !1, notLine("end")), keepsLines = sticky || multilineAnchor || anyAnchor && (lineAssertionInMiddle(root, !0, !0) || ragged);
  return { searches, trails, keepsLines };
}, SUBMATCH_SHAPE = deepFreeze({
  searches: !1,
  trails: !0,
  keepsLines: !0
}), shapeOf = (job) => job.scope === "submatch" ? SUBMATCH_SHAPE : job.scope === "search" ? anchoring(job.root, job.flags.sticky) : { ...anchoring(job.root, !1), searches: !1, trails: !1 };

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
  for (let index = 1; index < fragments.length; index += 1)
    link(builder, fragments[index - 1][1], {
      type: "split",
      targets: [fragments[index][0]]
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
  let [bodyStart, bodyEnd] = buildNode(builder, body, scope), loop = builder.loops, start = addState(builder), entry = addState(builder), leave = addState(builder), end = addState(builder);
  return builder.loops += 1, link(builder, start, {
    type: "split",
    targets: lazy ? [leave, entry] : [entry, leave]
  }), link(builder, entry, { type: "enter", loop, target: bodyStart }), link(builder, bodyEnd, { type: "split", targets: [start] }), link(builder, leave, { type: "exit", loop, target: end }), [start, end];
}, plusFragment = (builder, body, lazy, scope) => {
  let [bodyStart, bodyEnd] = buildNode(builder, body, scope), loop = builder.loops, again = addState(builder), leave = addState(builder), end = addState(builder);
  return builder.loops += 1, link(builder, bodyEnd, {
    type: "split",
    targets: lazy ? [leave, again] : [again, leave]
  }), link(builder, again, { type: "enter", loop, target: bodyStart }), link(builder, leave, { type: "exit", loop, target: end }), [bodyStart, end];
}, optionalIteration = (builder, [bodyStart, bodyEnd], next, end, lazy) => {
  let loop = builder.loops, start = addState(builder), entry = addState(builder);
  return builder.loops += 1, link(builder, start, {
    type: "split",
    targets: lazy ? [end, entry] : [entry, end]
  }), link(builder, entry, { type: "enter", loop, target: bodyStart }), link(builder, bodyEnd, { type: "exit", loop, target: next }), start;
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
}, repeatFragment = (builder, node, scope) => {
  let { body, min, max, lazy } = node;
  if (max === 0) return emptyFragment(builder);
  if (min === 0 && max === 1 / 0)
    return starFragment(builder, body, lazy, scope);
  if (min === 1 && max === 1 / 0)
    return plusFragment(builder, body, lazy, scope);
  ensureAffordable(builder.meter, max === 1 / 0 ? min : max);
  let required = Array.from(
    { length: min },
    () => buildNode(builder, body, scope)
  );
  if (min === max) return chain(builder, required);
  let rest = max === 1 / 0 ? starFragment(builder, body, lazy, scope) : nestedOptional(builder, body, max - min, lazy, scope);
  return chain(builder, [...required, rest]);
}, assertionFragment = (builder, node) => {
  if (isLineTest(node.test) && !builder.keepsLines) return emptyFragment(builder);
  let start = addState(builder), end = addState(builder);
  return link(builder, start, {
    type: "assert",
    test: node.test,
    multiline: node.multiline,
    unicodeWord: node.unicodeWord,
    target: end
  }), [start, end];
}, isPlain = (node) => !someNode(
  node,
  (inner) => inner.kind === "backreference" || inner.kind === "uncertain" || inner.kind === "look"
), isInline = (builder, node) => node.behind === (builder.direction === "backward"), isRecalled = (builder, node) => builder.recalling && isPlain(node.body), isRegular = (builder, node) => !someNode(
  node,
  (inner) => inner.kind === "backreference" || inner.kind === "uncertain" || inner.kind === "look" && !isInline(builder, inner) && !isRecalled(builder, inner)
), recallFragment = (builder, node, [start, end]) => {
  let look = builder.looks.length;
  if (builder.looks.push({
    body: reverseNode(node.body),
    direction: node.behind ? "backward" : "forward"
  }), !isRecalled(builder, node))
    return link(builder, start, { type: "invoke", look, target: end }), [start, end];
  let tracked = builder.recalls.length, [bodyStart, bodyEnd] = buildNode(builder, node.body, {
    context: 0,
    certain: !0
  });
  return builder.recalls.push(bodyStart), link(builder, bodyEnd, { type: "recalled", tracked }), link(builder, start, {
    type: "recall",
    look,
    tracked,
    negative: node.negative,
    target: end
  }), [start, end];
}, lookFragment = (builder, node, scope) => {
  let start = addState(builder), end = addState(builder);
  if (!isInline(builder, node))
    return recallFragment(builder, node, [start, end]);
  builder.contexts += 1;
  let context = builder.contexts, nested = builder.gates.length, [bodyStart, bodyEnd] = buildNode(builder, node.body, {
    context,
    certain: scope.certain
  }), resume = addState(builder);
  if (link(builder, bodyEnd, { type: "success", context }), link(builder, start, { type: "split", targets: [bodyStart, resume] }), !isRegular(builder, node.body))
    return link(builder, resume, { type: "doubt", target: end }), [start, end];
  let depth = 1 + builder.gates.slice(nested).reduce((deepest, gate) => Math.max(deepest, gate.depth), 0);
  return link(builder, resume, {
    type: "gate",
    look: builder.gates.length,
    negative: node.negative,
    target: end
  }), builder.gates.push({ start: bodyStart, context, depth }), [start, end];
}, uncertainFragment = (builder, body, scope) => {
  let start = addState(builder), [bodyStart, bodyEnd] = buildNode(builder, body, {
    ...scope,
    certain: !1
  });
  return link(builder, start, { type: "doubt", target: bodyStart }), [start, bodyEnd];
}, orient = (builder, body) => builder.direction === "forward" ? body : reverseNode(body), backreferenceFragment = (builder, captures, scope) => {
  if (captures.some((index) => builder.copying.includes(index)))
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
    (index) => orient(builder, builder.captures.get(index) ?? EMPTY_NODE)
  ), copy = alternationOf(bodies), guarded = canMatchEmpty(copy) ? copy : { kind: "alternation", branches: [copy, EMPTY_NODE] };
  builder.copying.push(...captures);
  let fragment = uncertainFragment(builder, guarded, scope);
  return builder.copying.length -= captures.length, fragment;
}, buildNode = (builder, node, scope) => {
  switch (node.kind) {
    case "empty":
      return emptyFragment(builder);
    case "char":
      return consumeFragment(builder, node.set, scope);
    case "sequence":
      return sequenceFragment(builder, node.items, scope);
    case "alternation":
      return alternationFragment(builder, node.branches, scope);
    case "repeat":
      return repeatFragment(builder, node, scope);
    case "assertion":
      return assertionFragment(builder, node);
    case "look":
      return lookFragment(builder, node, scope);
    case "backreference":
      return backreferenceFragment(builder, node.captures, scope);
    case "uncertain":
      return uncertainFragment(builder, node.body, scope);
  }
}, searchLoop = (builder, bodyStart) => {
  let loop = builder.loops, start = addState(builder), entry = addState(builder), step = addState(builder), leave = addState(builder);
  return builder.loops += 1, link(builder, start, { type: "split", targets: [leave, entry] }), link(builder, entry, { type: "enter", loop, target: step }), link(builder, step, {
    type: "consume",
    set: setId(builder, builder.universe),
    target: start,
    context: 0,
    certain: !0,
    prefix: !0
  }), link(builder, leave, { type: "exit", loop, target: bodyStart }), start;
}, kindsInUse = (transitions) => {
  let mask = maskOf(BOUNDARY) | maskOf(OTHER);
  for (let transition of transitions) {
    if (transition.type !== "assert") continue;
    let lineAnchor = isLineTest(transition.test);
    lineAnchor && transition.multiline && (mask |= maskOf(LINE)), lineAnchor || (mask |= maskOf(WORD)), !lineAnchor && transition.unicodeWord && (mask |= maskOf(EXTRA_WORD));
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
  let start = shape.searches ? searchLoop(builder, bodyStart) : bodyStart, kinds = kindsInUse(builder.transitions), startKinds = startsAnywhere(job) ? KINDS.filter((kind) => (kinds & maskOf(kind)) !== 0) : [BOUNDARY];
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
var PAST_LIMIT = 256, startsAtBeginning = (automaton) => automaton.startKinds.length === 1 && automaton.startKinds[0] === BOUNDARY, closeOver = (automaton, seeds, kind) => {
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
    kinds: KINDS,
    next: Int32Array.from(KINDS.flatMap(() => alphabet.pieceKinds)),
    pieces,
    holds: KINDS.map(() => []),
    starts: automaton.startKinds,
    forgotten: 0
  };
}, forget = (past, state) => state >= past.forgotten ? state : past.forgotten + past.kinds[state], recallPast = (automaton, alphabet) => {
  let pieces = alphabet.pieceKinds.length, members = alphabet.setPieces.map((list) => new Set(list)), restarts = automaton.recalls.map((state) => ({
    state,
    allowed: ALL_KINDS
  })), ids = /* @__PURE__ */ new Map(), kinds = [], itemSets = [], holds2 = [], next = [], intern = (kind, seeds) => {
    let closed = closeOver(automaton, [...seeds, ...restarts], kind), listed = closed.items.map(({ state, allowed }) => state * (ALL_KINDS + 1) + allowed).toSorted((left, right) => left - right), key = `${kind}|${closed.holds.join(",")}|${listed.join(",")}`, known = ids.get(key);
    return known !== void 0 ? known : kinds.length >= PAST_LIMIT ? null : (ids.set(key, kinds.length), kinds.push(kind), itemSets.push(closed.items), holds2.push(closed.holds), kinds.length - 1);
  }, advance = (items, piece) => items.flatMap(({ state, allowed }) => {
    let transition = automaton.transitions[state];
    return transition.type === "consume" && (allowed & maskOf(alphabet.pieceKinds[piece])) !== 0 && members[transition.set].has(piece) ? [{ state: transition.target, allowed: ALL_KINDS }] : [];
  });
  intern(BOUNDARY, []);
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
    kinds: [...kinds, ...KINDS],
    next: Int32Array.from([
      ...next,
      ...KINDS.flatMap(
        () => alphabet.pieceKinds.map((kind) => forgotten + kind)
      )
    ]),
    pieces,
    holds: [...holds2, ...KINDS.map(() => automaton.recalls.map(() => 0))],
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
      return (path.allowed & maskOf(BOUNDARY)) !== 0 && out.push({ type: "accept", certain: path.certain, gates: path.gates }), [];
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
    for (let index = next.length - 1; index >= 0; index -= 1)
      pending.push(next[index]);
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
  }), reach(automaton.transitions.length, recalls, (state, visit) => {
    for (let source of predecessors[state]) visit(source);
  });
}, pushEvent = (events, piece, event) => {
  let list = events.get(piece);
  list ? list.push(event) : events.set(piece, [event]);
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
    ), text = items.map(itemKey).join(";"), signature = signatureIds.get(text) ?? signatureIds.size;
    return signatureIds.set(text, signature), closureIds.set(key, closureItems.length), closureItems.push(items), closureSignatures.push(signature), closureItems.length - 1;
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
  }, resolve = (gates) => gates.map((gate) => ({
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
        let gates2 = resolve(item.gates);
        if (item.type === "accept") {
          state.context === 0 && state.exits.push({ kinds: maskOf(BOUNDARY), gates: gates2 });
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
      let gates = resolve(item.gates);
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
    for (let index = events.length - 1; index >= 0; index -= 1) {
      let event = events[index];
      event.type === "move" && (event.certain && laterContexts.has(event.context) && visit(source, event.target), laterContexts.add(event.context));
    }
  }
}), shadowingTargets = (ordered, keep) => {
  let shadowing = /* @__PURE__ */ new Set();
  return forEachShadow(ordered, (source, target) => {
    keep(source) && shadowing.add(target);
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
    maskOf(BOUNDARY)
  );
  return new Set(
    ordered.states.flatMap(
      (state, id) => state.exits.some(
        (exit) => exit.gates.length === 0 && (exit.kinds & following) === following
      ) ? [id] : []
    )
  );
}, gateStates = (ordered, keep) => {
  let gated = /* @__PURE__ */ new Set();
  return ordered.states.forEach((state, id) => {
    if (keep(id)) {
      for (let exit of state.exits)
        for (let gate of exit.gates) gated.add(gate.state);
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
}, consultedStates = (ordered, keep) => /* @__PURE__ */ new Set([...shadowingTargets(ordered, keep), ...gateStates(ordered, keep)]);

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
      let list = targets[stackStates[depth - 1]], index = stackIndices[depth - 1];
      if (index === list.length) {
        depth -= 1;
        continue;
      }
      stackIndices[depth - 1] = index + 1, claim(list[index]) && (stackStates[depth] = list[index], stackIndices[depth] = 0, depth += 1);
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
  return states.forEach((state, index) => {
    for (let [piece, events] of state.events) {
      let current = lookahead.back[klass * lookahead.pieces + piece], first = targets.length, loop = NO_LOOP;
      blocked.length = 0;
      for (let event of events)
        runsInOrder(event, lookahead, current, klass, blocked) && (event.prefix ? loop === NO_LOOP && (loop = event.target) : targets.push(event.target));
      targets.length > first && (entryPieces.push(piece), targetOffsets.push(targets.length)), loop !== NO_LOOP && (loopPieces.push(piece), loopTargets.push(loop));
    }
    entryOffsets[index + 1] = entryPieces.length, loopOffsets[index + 1] = loopPieces.length;
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
  for (let entry = moves.entryOffsets[state]; entry < moves.entryOffsets[state + 1]; entry += 1)
    if (moves.entryPieces[entry] === piece) return entry;
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
    for (let entry = entryOffsets[state]; entry < entryOffsets[state + 1]; entry += 1) {
      let piece = entryPieces[entry];
      generation += 1, distinct.length = 0;
      for (let item = targetOffsets[entry]; item < targetOffsets[entry + 1]; item += 1) {
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
  for (let index = 0; index < sorted.length; index += 1)
    index > 0 && continues(sorted[index - 1], sorted[index]) ? lengths[lengths.length - 1] += 1 : lengths.push(1);
  return lengths;
}, streaksBy = (bundles, pieceIds, edges, keys, step) => {
  let { sources, targets, multiplicities } = bundles, sorted = edges.toSorted(
    (left, right) => pieceIds[left] - pieceIds[right] || multiplicities[left] - multiplicities[right] || keys[left] - keys[right] || sources[left] - sources[right]
  ), lengths = streakLengths(
    sorted,
    (previous, edge) => pieceIds[previous] === pieceIds[edge] && multiplicities[previous] === multiplicities[edge] && sources[edge] === sources[previous] + 1 && targets[edge] === targets[previous] + step
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
  members.forEach((member, index) => {
    endpoints[index * 2] = spanStarts[member], endpoints[index * 2 + 1] = spanEnds[member];
  }), endpoints.sort();
  let boundCount = 0;
  for (let index = 0; index < endpoints.length; index += 1)
    (boundCount === 0 || endpoints[boundCount - 1] !== endpoints[index]) && (endpoints[boundCount] = endpoints[index], boundCount += 1);
  let bounds = endpoints.subarray(0, boundCount), covered = new Int32Array(boundCount), segmentOf = new Int32Array(boundCount);
  for (let member of members)
    for (let index = lowerBound(bounds, spanStarts[member]); index < boundCount && bounds[index] < spanEnds[member]; index += 1)
      covered[index] += 1;
  let count = 0;
  for (let index = 0; index < boundCount; index += 1)
    segmentOf[index] = covered[index] > 0 ? count : -1, count += covered[index] > 0 ? 1 : 0;
  let segments2 = {
    count,
    starts: new Int32Array(count),
    ends: new Int32Array(count),
    offsets: new Int32Array(count + 1),
    members: new Int32Array(0),
    openOffsets: new Int32Array(count + 1),
    openMembers: new Int32Array(members.length)
  };
  for (let index = 0; index < boundCount; index += 1) {
    let segment = segmentOf[index];
    segment !== -1 && (segments2.starts[segment] = bounds[index], segments2.ends[segment] = bounds[index + 1], segments2.offsets[segment + 1] = segments2.offsets[segment] + covered[index]);
  }
  let cursor = segments2.offsets.slice(0, count);
  segments2.members = new Int32Array(segments2.offsets[count]);
  for (let member of members)
    for (let index = lowerBound(bounds, spanStarts[member]); index < boundCount && bounds[index] < spanEnds[member]; index += 1)
      segments2.members[cursor[segmentOf[index]]] = member, cursor[segmentOf[index]] += 1;
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
    for (let entry = moves.loopOffsets[state]; entry < moves.loopOffsets[state + 1]; entry += 1)
      loopNext[moves.loopPieces[entry] * loopCount + loop] = loopIndex[moves.loopTargets[entry]];
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
var isChain = (groups, group) => groups.kinds[group] === SHIFT && groups.targets[group] === groups.sources[group] + 1, sharesPiece = (walk, left, right) => {
  let { pieceSets, pieceCount } = walk;
  for (let piece = 0; piece < pieceCount; piece += 1)
    if (pieceSets[left * pieceCount + piece] === 1 && pieceSets[right * pieceCount + piece] === 1)
      return !0;
  return !1;
}, startsAttempt = (walk, pieces) => {
  let { groups } = walk;
  for (let group = 0; group < groups.count; group += 1)
    if (groups.kinds[group] === GAIN && sharesPiece(walk, groups.pieces[group], pieces))
      return !0;
  return !1;
}, splitsChain = (walk, chain2) => {
  let { groups } = walk, first = groups.sources[chain2], last = first + groups.lengths[chain2];
  for (let group = 0; group < groups.count; group += 1)
    if (group !== chain2 && groups.kinds[group] !== GAIN && groups.sources[group] <= last && sourceEnd(groups, group) > first && sharesPiece(walk, groups.pieces[group], groups.pieces[chain2]))
      return !0;
  return !1;
}, chainRanges = (walk, keep) => {
  let { groups } = walk, ranges = [];
  for (let group = 0; group < groups.count; group += 1)
    isChain(groups, group) && keep(group) && ranges.push(
      groups.sources[group],
      groups.sources[group] + groups.lengths[group] + 1
    );
  return ranges;
}, quietRanges = (walk) => chainRanges(walk, (group) => !startsAttempt(walk, walk.groups.pieces[group])), steadyRanges = (walk) => chainRanges(walk, (group) => !splitsChain(walk, group));

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
    let entry = pairs.slots[slot];
    if (entry === 0) return -1;
    if (pairs.olders[entry - 1] === older && pairs.youngers[entry - 1] === younger)
      return entry - 1;
  }
}, placePair = (pairs, entry) => {
  let mask = pairs.slots.length - 1, slot = pairHash(pairs.olders[entry], pairs.youngers[entry]) & mask;
  for (; pairs.slots[slot] !== 0; ) slot = slot + 1 & mask;
  pairs.slots[slot] = entry + 1;
}, pairOf = (pairs, older, younger) => {
  let known = findPair(pairs, older, younger);
  if (known !== -1) return known;
  let entry = pairs.count;
  if (pairs.olders = grownInt32(pairs.olders, entry + 1), pairs.youngers = grownInt32(pairs.youngers, entry + 1), pairs.lives = grownInt32(pairs.lives, entry + 1), pairs.settled = grownUint8(pairs.settled, entry + 1), pairs.olders[entry] = older, pairs.youngers[entry] = younger, pairs.lives[entry] = 1, pairs.count = entry + 1, pairs.count * 2 <= pairs.slots.length)
    return placePair(pairs, entry), entry;
  pairs.slots = new Int32Array(pairs.slots.length * 2);
  for (let known2 = 0; known2 < pairs.count; known2 += 1) placePair(pairs, known2);
  return entry;
}, livesOf = (pairs, older, younger) => {
  let entry = findPair(pairs, older, younger);
  return entry === -1 ? 1 : pairs.lives[entry];
}, outlives = (moves, pairs, older, younger, required, meter) => {
  let entry = findPair(pairs, older, younger);
  if (entry !== -1 && pairs.lives[entry] >= required || entry === -1 && required <= 1) return !0;
  if (entry !== -1 && pairs.settled[entry] === 1) return !1;
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
}, firstSegment = (segments2, position) => {
  let low = 0, high = segments2.count;
  for (; low < high; ) {
    let middle = low + high >> 1;
    segments2.ends[middle] <= position ? low = middle + 1 : high = middle;
  }
  return low;
}, openingSlot = (segments2, index, first) => index === first ? segments2.offsets[index] : segments2.openOffsets[index], closingSlot = (segments2, index, first) => index === first ? segments2.offsets[index + 1] : segments2.openOffsets[index + 1], memberAt = (segments2, index, first, slot) => index === first ? segments2.members[slot] : segments2.openMembers[slot], spreadMerged = (walk, runs, scratch) => {
  let { segments: segments2 } = walk, { kinds, sources, targets, multiplicities, pieces, lengths } = walk.groups, largest = 0, incidences = 0;
  scratch.pathCount = 0, scratch.gainCount = 0;
  for (let run = 0; run < runs.length; run += 3) {
    let start = runs[run], end = runs[run + 1], value = runs[run + 2], first = firstSegment(segments2, start);
    for (let index = first; index < segments2.count && segments2.starts[index] < end; index += 1) {
      let last = closingSlot(segments2, index, first), opening = openingSlot(segments2, index, first);
      incidences += segments2.offsets[index + 1] - segments2.offsets[index], reservePaths(scratch, last - opening);
      let { pathPieces, pathStarts, pathEnds, pathValues } = scratch, path = scratch.pathCount;
      for (let slot = opening; slot < last; slot += 1) {
        let group = memberAt(segments2, index, first, slot), amount = value * multiplicities[group], source = sources[group];
        if (kinds[group] === GAIN) {
          pushGain(scratch, pieces[group], source, amount);
          continue;
        }
        switch (largest = Math.max(largest, amount), pathPieces[path] = pieces[group], pathValues[path] = amount, kinds[group]) {
          case SHIFT:
            pathStarts[path] = Math.max(start, targets[group]) + source - targets[group], pathEnds[path] = Math.min(end, targets[group] + lengths[group]) + source - targets[group];
            break;
          case MIRROR: {
            let axis = mirrorAxis(walk.groups, group);
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
}, spreadSegments = (walk, runs, scratch) => {
  let { groups, segments: segments2 } = walk;
  scratch.pathCount = 0, scratch.gainCount = 0;
  for (let run = 0; run < runs.length; run += 3) {
    let start = runs[run], end = runs[run + 1], value = runs[run + 2];
    for (let index = firstSegment(segments2, start); index < segments2.count && segments2.starts[index] < end; index += 1) {
      let low = Math.max(start, segments2.starts[index]), high = Math.min(end, segments2.ends[index]);
      for (let slot = segments2.offsets[index]; slot < segments2.offsets[index + 1]; slot += 1) {
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
}, spreadInto = (walk, runs, scratch) => {
  spreadMerged(walk, runs, scratch) || spreadSegments(walk, runs, scratch);
}, advanceMerged = (walk, runs, scratch) => {
  let { groups, sources } = walk, largest = 0;
  scratch.pathCount = 0, scratch.gainCount = 0, scratch.incidences = 0;
  for (let run = 0; run < runs.length; run += 3) {
    let start = runs[run], end = runs[run + 1], value = runs[run + 2], first = firstSegment(sources, start);
    for (let index = first; index < sources.count && sources.starts[index] < end; index += 1) {
      let last = closingSlot(sources, index, first);
      scratch.incidences += sources.offsets[index + 1] - sources.offsets[index];
      for (let slot = openingSlot(sources, index, first); slot < last; slot += 1) {
        let group = memberAt(sources, index, first, slot), amount = value * groups.multiplicities[group], source = groups.sources[group], target = groups.targets[group];
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
        let reach2 = source + groups.lengths[group], total = amount * (Math.min(end, reach2) - Math.max(start, source));
        largest = Math.max(largest, total), pushPath(scratch, groups.pieces[group], target, target + 1, total);
      }
    }
  }
  return 2 * scratch.incidences * largest < EXACT_SUMS;
}, advanceSegments = (walk, runs, scratch) => {
  let { groups, sources } = walk;
  scratch.pathCount = 0, scratch.gainCount = 0;
  for (let run = 0; run < runs.length; run += 3) {
    let start = runs[run], end = runs[run + 1], value = runs[run + 2];
    for (let index = firstSegment(sources, start); index < sources.count && sources.starts[index] < end; index += 1) {
      let low = Math.max(start, sources.starts[index]), high = Math.min(end, sources.ends[index]);
      for (let slot = sources.offsets[index]; slot < sources.offsets[index + 1]; slot += 1) {
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
}, advanceInto = (walk, runs, scratch) => {
  advanceMerged(walk, runs, scratch) || advanceSegments(walk, runs, scratch);
};

// src/hooks/regex/amplification/vectors.ts
var emitRun = (runs, length, start, end, value) => length > 0 && runs[length - 2] === start && runs[length - 1] === value ? (runs[length - 2] = end, length) : (runs[length] = start, runs[length + 1] = end, runs[length + 2] = value, length + 3), firstRunAfter = (runs, size, position) => {
  let low = 0, high = size / 3;
  for (; low < high; ) {
    let middle = low + high >> 1;
    runs[middle * 3 + 1] <= position ? low = middle + 1 : high = middle;
  }
  return low * 3;
}, raisesNothing = (runs, first, last, low, high) => first === last && runs[first] <= low && runs[first + 1] >= high, raiseSpan = (scratch, slot, size, low, high, peak) => {
  let current = scratch.runs[slot], out = scratch.spare, written = 0;
  for (let run = 0; run < size && current[run] < low; run += 3)
    written = emitRun(
      out,
      written,
      current[run],
      Math.min(current[run + 1], low),
      current[run + 2]
    );
  written = emitRun(out, written, low, high, peak);
  for (let run = firstRunAfter(current, size, high); run < size; run += 3)
    written = emitRun(
      out,
      written,
      Math.max(current[run], high),
      current[run + 1],
      current[run + 2]
    );
  return scratch.spare = current, scratch.runs[slot] = out, written;
}, quietenSlot = (scratch, slot, length, quiet) => {
  let size = length;
  for (let range = 0; range < quiet.length; range += 2) {
    let start = quiet[range], end = quiet[range + 1], current = scratch.runs[slot], first = firstRunAfter(current, size, start), last = first, peak = 0;
    for (let run = first; run < size && current[run] < end; run += 3)
      peak = Math.max(peak, current[run + 2]), last = run;
    !(peak > 0) || raisesNothing(current, first, last, start, end) || (size = raiseSpan(scratch, slot, size, start, end, peak));
  }
  return size;
}, meetsTwoRuns = (runs, size, ranges) => {
  if (size <= 3) return !1;
  let run = 0;
  for (let range = 0; range < ranges.length; range += 2) {
    let end = ranges[range + 1];
    for (; run < size && runs[run + 1] <= ranges[range]; ) run += 3;
    if (run + 3 < size && runs[run] < end && runs[run + 3] < end) return !0;
  }
  return !1;
}, orderedRanges = (ranges) => {
  let pairs = [];
  for (let range = 0; range < ranges.length; range += 2)
    pairs.push([ranges[range], ranges[range + 1]]);
  return pairs.toSorted((left, right) => left[0] - right[0]).flat();
}, levelSlot = (scratch, slot, length, level, ordered) => {
  if (!meetsTwoRuns(scratch.runs[slot], length, ordered)) return length;
  let size = length;
  for (let range = 0; range < level.length; range += 2) {
    let start = level[range], end = level[range + 1], current = scratch.runs[slot], first = firstRunAfter(current, size, start), last = first, high = start, peak = 0;
    for (let run = first; run < size && current[run] < end; run += 3)
      high = Math.min(current[run + 1], end), peak = Math.max(peak, current[run + 2]), last = run;
    if (!(peak > 0)) continue;
    let low = Math.max(current[first], start);
    raisesNothing(current, first, last, low, high) || (size = raiseSpan(scratch, slot, size, low, high, peak));
  }
  return size;
}, startValue = (layout, runs) => {
  let { startOrder } = layout, best = 0, run = 0;
  for (let state of startOrder) {
    for (; run < runs.length && runs[run + 1] <= state; ) run += 3;
    run < runs.length && runs[run] <= state && (best = Math.max(best, runs[run + 2]));
  }
  return best;
}, totalOf = (runs) => {
  let total = 0;
  for (let run = 0; run < runs.length; run += 3)
    total += (runs[run + 1] - runs[run]) * runs[run + 2];
  return total;
};

// src/hooks/regex/amplification/sweep.ts
var BOUNDARY_SLOTS = 2 ** 24, GENERATION_LIMIT = 2 ** 31 - 1, INSERTION_LIMIT = 24, DENSE_FACTOR = 8, MASK_WIDTH = 32, NO_PRIORS = new Int32Array(0), placeEvent = (scratch, event, position, path, delta) => {
  scratch.eventPositions[event] = position, scratch.eventPieces[event] = scratch.pathPieces[path], scratch.eventDeltas[event] = delta;
}, countingSortEvents = (scratch, low, high) => {
  let { pathStarts, pathEnds, pathValues } = scratch;
  scratch.positionSlots = grownInt32(scratch.positionSlots, high - low + 2);
  let slots = scratch.positionSlots;
  slots.fill(0, 0, high - low + 2);
  for (let path = 0; path < scratch.pathCount; path += 1)
    slots[pathStarts[path] - low + 1] += 1, slots[pathEnds[path] - low + 1] += 1;
  for (let position = 1; position <= high - low + 1; position += 1)
    slots[position] += slots[position - 1];
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
  for (let index = 1; index < count; index += 1) {
    let key = keys[index], cursor = index - 1;
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
    let position = Math.floor(eventKeys[event] / BOUNDARY_SLOTS), slot = eventKeys[event] - position * BOUNDARY_SLOTS, path = slot >> 1;
    placeEvent(
      scratch,
      event,
      position,
      path,
      (slot & 1) === 0 ? pathValues[path] : -pathValues[path]
    );
  }
  return count;
}, reserveGenerations = (scratch, needed) => {
  scratch.generation + needed < GENERATION_LIMIT || (scratch.splitStamps.fill(0), scratch.touchedStamps.fill(0), scratch.classStamps.fill(0), scratch.generation = 0);
}, nextGeneration = (scratch) => (scratch.generation += 1, scratch.generation), baseLabels = (walk, scratch, priors, offset, classCount) => {
  let { pieceCount, loopClasses, loopClassCount } = walk, { labels } = scratch;
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
}, splitBy = (walk, scratch, pieces, next) => {
  let start = walk.pieceOffsets[pieces], end = walk.pieceOffsets[pieces + 1];
  scratch.splitStamps = grownInt32(scratch.splitStamps, next + end - start), scratch.splitTargets = grownInt32(scratch.splitTargets, next + end - start);
  let generation = nextGeneration(scratch), { labels, splitStamps, splitTargets } = scratch, fresh = next;
  for (let item = start; item < end; item += 1) {
    let piece = walk.pieceItems[item], old = labels[piece];
    splitStamps[old] !== generation && (splitStamps[old] = generation, splitTargets[old] = fresh, fresh += 1), labels[piece] = splitTargets[old];
  }
  return fresh;
}, touchedInto = (walk, scratch) => {
  scratch.touchedStamps = grownInt32(
    scratch.touchedStamps,
    walk.pieceOffsets.length - 1
  );
  let { touched, touchedStamps } = scratch, stamp = nextGeneration(scratch), count = 0;
  for (let path = 0; path < scratch.pathCount; path += 1)
    touchedStamps[scratch.pathPieces[path]] !== stamp && (touchedStamps[scratch.pathPieces[path]] = stamp, touched[count] = scratch.pathPieces[path], count += 1);
  for (let gain = 0; gain < scratch.gainCount; gain += 1)
    touchedStamps[scratch.gainPieces[gain]] !== stamp && (touchedStamps[scratch.gainPieces[gain]] = stamp, touched[count] = scratch.gainPieces[gain], count += 1);
  for (let index = 1; index < count; index += 1) {
    let pieces = touched[index], cursor = index - 1;
    for (; cursor >= 0 && touched[cursor] > pieces; )
      touched[cursor + 1] = touched[cursor], cursor -= 1;
    touched[cursor + 1] = pieces;
  }
  scratch.touchedCount = count;
}, masksOf = (walk, scratch, pieces) => {
  let { pieceSets, pieceCount } = walk, { touched, touchedCount } = scratch, masks = new Int32Array(
    Math.ceil(pieces.length / MASK_WIDTH) * touchedCount
  );
  for (let chunk = 0; chunk * MASK_WIDTH < pieces.length; chunk += 1)
    for (let index = 0; index < touchedCount; index += 1) {
      let row = touched[index] * pieceCount, width = Math.min(MASK_WIDTH, pieces.length - chunk * MASK_WIDTH), mask = 0;
      for (let bit = 0; bit < width; bit += 1)
        pieceSets[row + pieces[chunk * MASK_WIDTH + bit]] === 1 && (mask |= 1 << bit);
      masks[chunk * touchedCount + index] = mask;
    }
  return masks;
}, representativesInto = (walk, scratch, priors, offset, classCount, klass) => {
  let { pieceCount } = walk;
  reserveGenerations(scratch, scratch.pathCount + scratch.gainCount + 4), touchedInto(walk, scratch);
  let { touched, touchedCount, choiceTable } = scratch, hash = hashRuns(klass, touched, touchedCount), known = findRuns(choiceTable, klass, touched, touchedCount, hash);
  if (known !== -1) return scratch.choices[known];
  scratch.labels = grownInt32(scratch.labels, pieceCount), scratch.representatives = grownInt32(scratch.representatives, pieceCount);
  let next = baseLabels(walk, scratch, priors, offset, classCount);
  for (let index = 0; index < touchedCount; index += 1)
    next = splitBy(walk, scratch, touched[index], next);
  scratch.splitStamps = grownInt32(scratch.splitStamps, next);
  let generation = nextGeneration(scratch), { labels, splitStamps, representatives } = scratch, count = 0;
  for (let piece = 0; piece < pieceCount; piece += 1)
    splitStamps[labels[piece]] !== generation && (splitStamps[labels[piece]] = generation, representatives[count] = piece, count += 1);
  let pieces = representatives.slice(0, count), choice = {
    pieces,
    masks: masksOf(walk, scratch, pieces)
  };
  return addRuns(choiceTable, klass, touched, touchedCount, hash), scratch.choices.push(choice), choice;
}, blindRepresentativesInto = (walk, scratch) => representativesInto(walk, scratch, NO_PRIORS, 0, 1, 0), resetSlots = (scratch, count) => {
  for (count > scratch.levels.length && (scratch.runLengths = grownInt32(scratch.runLengths, count), scratch.levels = grownFloat64(scratch.levels, count), scratch.previous = grownInt32(scratch.previous, count)); scratch.runs.length < count; ) scratch.runs.push([]);
  scratch.runLengths.fill(0, 0, count), scratch.levels.fill(0, 0, count);
}, addBoundary = (runs, runLengths, levels, previous, slot, position, delta, cap) => {
  let level = levels[slot];
  level > 0 && position !== previous[slot] && (runLengths[slot] = emitRun(
    runs[slot],
    runLengths[slot],
    previous[slot],
    position,
    Math.min(level, cap)
  )), levels[slot] = level + delta, previous[slot] = position;
}, sweepPieces = (scratch, walk, eventCount, choice, cap) => {
  let count = choice.pieces.length;
  resetSlots(scratch, count), scratch.readers = grownInt32(scratch.readers, walk.pieceOffsets.length - 1);
  let { eventPieces, eventPositions, eventDeltas, readers } = scratch, { runs, runLengths, levels, previous, touched, touchedCount } = scratch;
  for (let chunk = 0; chunk * MASK_WIDTH < count; chunk += 1) {
    for (let index = 0; index < touchedCount; index += 1)
      readers[touched[index]] = choice.masks[chunk * touchedCount + index];
    for (let event = 0; event < eventCount; event += 1) {
      let position = eventPositions[event], delta = eventDeltas[event];
      for (let mask = readers[eventPieces[event]]; mask !== 0; mask &= mask - 1)
        addBoundary(
          runs,
          runLengths,
          levels,
          previous,
          chunk * MASK_WIDTH + 31 - Math.clz32(mask & -mask),
          position,
          delta,
          cap
        );
    }
  }
}, sweepEvery = (scratch, eventCount, cap) => {
  resetSlots(scratch, 1);
  let { runs, runLengths, levels, previous } = scratch;
  for (let event = 0; event < eventCount; event += 1)
    addBoundary(
      runs,
      runLengths,
      levels,
      previous,
      0,
      scratch.eventPositions[event],
      scratch.eventDeltas[event],
      cap
    );
}, gainsInto = (scratch, walk, piece, cap, gains, offset) => {
  let { pieceSets, pieceCount, loopCount } = walk;
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
  let { entryOffsets, entryPieces, targetOffsets, targets } = moves, size = stateCountOf(moves), kinds = layout.alphabet.pieceKinds, entryMasks = new Uint8Array(size), entryCounts = new Uint8Array(size), entryKinds = new Uint8Array(size * KIND_COUNT), openings = /* @__PURE__ */ new Map();
  for (let entry = 0; entry < entryPieces.length; entry += 1)
    for (let item = targetOffsets[entry]; item < targetOffsets[entry + 1]; item += 1) {
      let target = targets[item], kind = kinds[entryPieces[entry]];
      (entryMasks[target] & 1 << kind) === 0 && (entryMasks[target] |= 1 << kind, entryKinds[target * KIND_COUNT + entryCounts[target]] = kind, entryCounts[target] += 1);
    }
  for (let state of layout.loopStates)
    for (let loop = moves.loopOffsets[state]; loop < moves.loopOffsets[state + 1]; loop += 1) {
      let kind = kinds[moves.loopPieces[loop]], target = moves.loopTargets[loop], opening = openings.get(kind) ?? /* @__PURE__ */ new Map();
      for (let entry = entryOffsets[target]; entry < entryOffsets[target + 1]; entry += 1)
        mergeTargets(
          opening,
          entryPieces[entry],
          targets.subarray(targetOffsets[entry], targetOffsets[entry + 1])
        );
      openings.set(kind, opening);
    }
  let openingOf = (older) => {
    let opening = /* @__PURE__ */ new Map();
    for (let entry = 0; entry < entryCounts[older]; entry += 1)
      for (let [piece, targets2] of openings.get(
        entryKinds[older * KIND_COUNT + entry]
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
}, openFrontiers = (layout, walk, cap, scratch, visit) => {
  let { groups } = walk;
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
    let events = sortEvents(scratch), choice = blindRepresentativesInto(walk, scratch);
    sweepPieces(scratch, walk, events, choice, cap);
    for (let index = 0; index < choice.pieces.length; index += 1)
      visit(index, scratch.runLengths[index]);
  }
}, attemptPaths = (layout, walk, cap, meter) => {
  let scratch = createScratch(), seen = createRunTable(), most = 0, visit = (slot, length) => {
    if (length === 0) return;
    let runs = scratch.runs[slot], hash = hashRuns(0, runs, length);
    findRuns(seen, 0, runs, length, hash) === -1 && (most = Math.max(
      most,
      totalOf(seen.runs[addRuns(seen, 0, runs, length, hash)])
    ));
  };
  openFrontiers(layout, walk, cap, scratch, visit);
  for (let head = 0; head < seen.count && most < cap; head += 1) {
    if (seen.count > ATTEMPT_FRONTIERS) return 1 / 0;
    advanceInto(walk, seen.runs[head], scratch), spend(meter, 1 + scratch.incidences);
    let events = sortEvents(scratch), choice = blindRepresentativesInto(walk, scratch);
    sweepPieces(scratch, walk, events, choice, cap);
    for (let index = 0; index < choice.pieces.length; index += 1)
      visit(index, scratch.runLengths[index]);
  }
  return Math.min(most, cap);
}, loosePaths = (layout, lookahead, cap, meter) => {
  let walk = walkOf(layout, lookahead, 0), quiet = chainRanges(walk, () => !0), scratch = createScratch(), seen = createRunTable(), gains = new Int32Array(walk.loopCount), most = 0, visit = (slot, length) => {
    let runs = scratch.runs[slot], hash = hashRuns(0, runs, length);
    findRuns(seen, 0, runs, length, hash) === -1 && (most = Math.max(
      most,
      startValue(layout, seen.runs[addRuns(seen, 0, runs, length, hash)])
    ));
  };
  resetSlots(scratch, 1), scratch.runs[0][0] = 0, scratch.runs[0][1] = layout.stateCount, scratch.runs[0][2] = 1, visit(0, quietenSlot(scratch, 0, 3, quiet));
  for (let head = 0; head < seen.count && most < cap; head += 1) {
    if (seen.count > ATTEMPT_FRONTIERS) return 1 / 0;
    spreadInto(walk, seen.runs[head], scratch), spend(meter, 1 + scratch.incidences);
    let events = sortEvents(scratch), choice = blindRepresentativesInto(walk, scratch);
    sweepPieces(scratch, walk, events, choice, cap);
    for (let index = 0; index < choice.pieces.length; index += 1) {
      gainsInto(scratch, walk, choice.pieces[index], cap, gains, 0);
      for (let loop = 0; loop < walk.loopCount; loop += 1)
        most = Math.max(most, gains[loop]);
      visit(
        index,
        quietenSlot(scratch, index, scratch.runLengths[index], quiet)
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
  for (let index = 0; index < length; index += 1) {
    let next = /* @__PURE__ */ new Map();
    spend(meter, frontier.size + 1);
    for (let [state, count] of frontier) {
      blocked.length = 0;
      for (let event of ordered.states[state].events.get(input[index]) ?? [])
        runsInOrder(event, lookahead, index, index + 1, blocked) && next.set(
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
}, scoreAt = (state, node) => {
  let { layout, nodes, loops } = state, score = 0;
  for (let loop of layout.startLoops)
    score = Math.max(score, nodes.values[node * loops + loop]);
  return Math.max(score, startValue(layout, nodes.table.runs[node]));
}, recordBest = (state, node) => {
  let score = scoreAt(state, node);
  score <= state.best || (state.best = score, state.bestNode = node);
}, internNode = (state, klass, runs, length, parent, piece) => {
  let { nodes } = state, hash = hashRuns(klass, runs, length), known = findRuns(nodes.table, klass, runs, length, hash);
  if (known !== -1) return known;
  reserveNode(nodes, state.loops);
  let node = addRuns(nodes.table, klass, runs, length, hash);
  return nodes.parents[node] = parent, nodes.pieces[node] = piece, spend(state.meter, 1 + length), recordBest(state, node), node;
}, walkFor = (state, klass) => {
  let known = state.walks[klass];
  if (known !== void 0) return known;
  let walk = walkOf(state.layout, state.lookahead, klass);
  return spend(state.meter, state.layout.ordered.states.length), state.walks[klass] = walk, walk;
}, relax = (state, from, step, walk) => {
  let { nodes, steps, loops, cap } = state, { values, via } = nodes, target = steps.targets[step], piece = steps.pieces[step], changed = !1;
  for (let loop = 0; loop < loops; loop += 1) {
    let next = walk.loopNext[piece * loops + loop], carried = next === NO_LOOP ? 0 : values[from * loops + next], value = Math.min(steps.gains[step * loops + loop] + carried, cap), slot = target * loops + loop;
    value <= values[slot] || (values[slot] = value, via[slot * 3] = from, via[slot * 3 + 1] = next, via[slot * 3 + 2] = piece, changed = !0);
  }
  return changed;
}, propagate = (state, from, walk) => {
  let { nodes, steps } = state, last = nodes.stepEnds[from];
  for (let step = nodes.stepStarts[from]; step < last; step += 1) {
    if (spend(state.meter, 1), !relax(state, from, step, walk)) continue;
    let target = steps.targets[step];
    recordBest(state, target), nodes.expanded[target] === 1 && state.dirty.push(target);
  }
}, expand = (state, node) => {
  let { lookahead, scratch, cap, loops, steps } = state, klass = state.nodes.table.klasses[node], walk = walkFor(state, klass), priors = klass * lookahead.pieces;
  spreadInto(walk, state.nodes.table.runs[node], scratch), spend(state.meter, 1 + scratch.incidences);
  let events = sortEvents(scratch), choice = representativesInto(
    walk,
    scratch,
    lookahead.back,
    priors,
    lookahead.classCount,
    klass
  );
  sweepPieces(scratch, walk, events, choice, cap), state.nodes.stepStarts[node] = steps.count;
  for (let index = 0; index < choice.pieces.length; index += 1) {
    let piece = choice.pieces[index], step = reserveStep(steps, loops);
    gainsInto(scratch, walk, piece, cap, steps.gains, step * loops);
    let length = levelSlot(
      scratch,
      index,
      quietenSlot(scratch, index, scratch.runLengths[index], state.quiet),
      state.level,
      state.levelOrder
    ), target = internNode(
      state,
      lookahead.back[priors + piece],
      scratch.runs[index],
      length,
      node,
      piece
    );
    steps.targets[step] = target, steps.pieces[step] = piece, steps.count = step + 1;
  }
  state.nodes.stepEnds[node] = steps.count, state.nodes.expanded[node] = 1, propagate(state, node, walk);
}, witnessOf = (state, node) => {
  let { nodes, loops, layout } = state, pieces = [], score = scoreAt(state, node), loop = NO_LOOP, current = node;
  for (let startLoop of layout.startLoops)
    if (nodes.values[node * loops + startLoop] === score) {
      loop = startLoop;
      break;
    }
  for (; pieces.length <= nodes.table.count; ) {
    let slot = (current * loops + loop) * 3, previous = loop === NO_LOOP ? nodes.parents[current] : nodes.via[slot];
    if (previous === -1) break;
    pieces.push(loop === NO_LOOP ? nodes.pieces[current] : nodes.via[slot + 2]), loop !== NO_LOOP && (loop = nodes.via[slot + 1]), current = previous;
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
  let walk = walkScore(layout, sure, room + 1, meter, {
    limit: LEVEL_NODES,
    quiet: [],
    level: steadyRanges(walkOf(layout, sure, 0))
  });
  return walk.complete ? walk.score : 1 / 0;
}, searchBound = (job, room) => {
  let layout = layoutOf(job), sure = sureOf(layout), bound = attemptBound(layout, sure, room + 1, job.meter);
  return bound <= room ? bound : walkBound(layout, sure, room, job.meter);
}, isBackreference = (node) => node.kind === "backreference", leveledBound = (job, layout, sure, ceiling) => {
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
  }, connect = (node, events, piece, klass) => {
    let next = klass % wildcard, current = nodeClass[node] % wildcard;
    blocked.length = 0;
    for (let event of events)
      runsInOrder(event, lookahead, current, next, blocked) && leadsToCycle[event.target] && (sources.push(node), targets.push(
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
  for (let node = 0; node < nodeState.length; node += 1) {
    let state = ordered.states[nodeState[node]], klass = nodeClass[node];
    for (let [piece, events] of state.events) {
      if (klass === wildcard) {
        connect(node, events, piece, wildcard);
        continue;
      }
      for (let next of predecessorsOf(lookahead, klass, piece))
        connect(node, events, piece, next);
    }
  }
  return {
    graph: toDigraph(nodeState.length, sources, targets, labels),
    wildcard
  };
};

// src/hooks/regex/growth/ambiguity.ts
var PAIRWISE_LIMIT = 16, DIAGONAL = 1, APART = 2, pairKey = (left, right, width) => left * width + right, tripleKey = (first, second, third, width) => (first * width + second) * width + third, forks = (targets) => targets.length > 1, nodeSteps = (product2, node, keep) => {
  let { offsets, targets, labels } = product2.graph, byPiece = /* @__PURE__ */ new Map();
  for (let edge = offsets[node]; edge < offsets[node + 1]; edge += 1) {
    let target = targets[edge];
    if (!keep(target)) continue;
    let piece = labelPiece(product2, labels[edge]), klass = labelClass(product2, labels[edge]), byClass = byPiece.get(piece);
    byClass === void 0 && (byClass = /* @__PURE__ */ new Map(), byPiece.set(piece, byClass));
    let classTargets = byClass.get(klass);
    classTargets === void 0 ? byClass.set(klass, [target]) : classTargets.push(target);
  }
  return byPiece;
}, stepsWithin = (product2, nodes, keep) => {
  let steps = /* @__PURE__ */ new Map();
  for (let node of nodes) steps.set(node, nodeSteps(product2, node, keep));
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
  for (let index = 1; index < targets.length; index += 1)
    for (let earlier = 0; earlier < index; earlier += 1)
      if (targets[earlier] === targets[index]) return !0;
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
  let { index } = exploration, known = index.count, entry = internKey(index, key);
  return entry < known || (exploration.parts = grownInt32(exploration.parts, index.keys.length * 3), exploration.parts[entry * 3] = first, exploration.parts[entry * 3 + 1] = second, exploration.parts[entry * 3 + 2] = third, spend(exploration.meter, 1)), entry;
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
).component, firstOf = (exploration, node) => exploration.parts[node * 3], secondOf = (exploration, node) => exploration.parts[node * 3 + 1], thirdOf = (exploration, node) => exploration.parts[node * 3 + 2], growsExponentially = (product2, steps, members, meter) => {
  if (someTargets(steps, repeats)) return !0;
  if (!someTargets(steps, forks)) return !1;
  let width = product2.graph.size, { wildcard } = product2, exploration = createExploration(meter);
  for (let node of members)
    reachKey(exploration, pairKey(node, node, width), node, node, 0);
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
  for (let node = 0; node < exploration.index.count; node += 1)
    sides[groups[node]] |= firstOf(exploration, node) === secondOf(exploration, node) ? DIAGONAL : APART;
  return sides.includes(DIAGONAL | APART);
}, connectsTwoLoops = (product2, component, members, source, target, between, sourceSteps, targetSteps, meter) => {
  let width = product2.graph.size;
  width * width * width > Number.MAX_SAFE_INTEGER && reachCap();
  let { wildcard } = product2, bridge = /* @__PURE__ */ new Map(), exploration = createExploration(meter), inBetween = (node) => between[component[node]] === 1, bridgeOf = (node) => {
    let known = bridge.get(node);
    if (known !== void 0) return known;
    let steps = nodeSteps(product2, node, inBetween);
    return bridge.set(node, steps), steps;
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
  let { index } = exploration, groups = groupsOf(exploration);
  for (let node = 0; node < index.count; node += 1) {
    let first = firstOf(exploration, node), second = secondOf(exploration, node), third = thirdOf(exploration, node);
    if (component[third] !== target || first !== second) continue;
    let partner = keyOf(index, tripleKey(first, third, third, width));
    if (partner !== -1 && groups[partner] === groups[node]) return !0;
  }
  return !1;
}, reachableGroups = (start, links, meter) => (spend(meter, links.length), reach(links.length, [start], (group, visit) => {
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
var STEADY = deepFreeze({ exponential: !1, degree: 0 }), lookCache = /* @__PURE__ */ new WeakMap(), grows = ({ exponential, degree }) => exponential || degree >= 2, outgrows = (left, right) => left.exponential === right.exponential ? left.degree > right.degree : left.exponential, groupChars = (graph, alphabet, group) => {
  let inside = new Set(group), chars = EMPTY_SET;
  for (let node of group)
    for (let edge = graph.offsets[node]; edge < graph.offsets[node + 1]; edge += 1)
      inside.has(graph.targets[edge]) && (chars = union(chars, alphabet.pieceSets[graph.labels[edge]]));
  return chars;
}, cycleChars = (graph, alphabet, components, keep) => components.members.filter(keep).reduce(
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
  let strongest = epsilon.looks.reduce((current, look, index) => {
    let report = analyzeLook(look, job), repeated = report.degree >= 1 && overlaps(
      loopsBefore(ordered, graph, components, cyclic, alphabet, index),
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
  for (let index = 0; index < set.length; index += 2)
    count += set[index + 1] - set[index];
  return count;
}, product = (left, right) => left.length * right.length > SPLIT_LIMIT ? null : left.flatMap((head) => right.map((tail) => [...head, ...tail])), smallLanguage = (node) => {
  switch (node.kind) {
    case "empty":
      return [[]];
    case "char":
      return pointCount(node.set) <= SPLIT_LIMIT ? expandPoints(node.set).map((point) => [pointSet(point)]) : null;
    case "sequence":
      return node.items.reduce(
        (strings, item) => {
          let language = strings && smallLanguage(item);
          return strings && language ? product(strings, language) : null;
        },
        [[]]
      );
    case "alternation": {
      let languages = node.branches.map(smallLanguage);
      if (languages.some((language) => language === null)) return null;
      let strings = languages.flatMap((language) => language ?? []);
      return strings.length <= SPLIT_LIMIT ? strings : null;
    }
    case "repeat": {
      if (!Number.isFinite(node.max) || node.max > SPLIT_LIMIT) return null;
      let body = smallLanguage(node.body);
      if (!body) return null;
      let strings = [], power = [[]];
      for (let count = 0; count <= node.max && power; count += 1)
        count >= node.min && strings.push(...power), power = product(power, body);
      return strings.length <= SPLIT_LIMIT ? strings : null;
    }
    default:
      return null;
  }
}, literal = (string, folded, unicode) => string.length === 0 ? { kind: "empty" } : {
  kind: "sequence",
  items: string.map(
    (set) => charNode(folded ? caseClosure(set, unicode) : set)
  )
}, replaceReferences = (node, capture, replacement) => {
  switch (node.kind) {
    case "backreference":
      return node.captures.length === 1 && node.captures[0] === capture ? replacement : node;
    case "sequence":
      return {
        ...node,
        items: node.items.map(
          (item) => replaceReferences(item, capture, replacement)
        )
      };
    case "alternation":
      return {
        ...node,
        branches: node.branches.map(
          (branch) => replaceReferences(branch, capture, replacement)
        )
      };
    case "repeat":
    case "look":
    case "uncertain":
      return {
        ...node,
        body: replaceReferences(node.body, capture, replacement)
      };
    default:
      return node;
  }
}, countReferences = (node, capture) => {
  switch (node.kind) {
    case "backreference":
      return node.captures.includes(capture) ? 1 : 0;
    case "sequence":
      return node.items.reduce(
        (total, item) => total + countReferences(item, capture),
        0
      );
    case "alternation":
      return node.branches.reduce(
        (total, branch) => total + countReferences(branch, capture),
        0
      );
    case "repeat":
    case "look":
    case "uncertain":
      return countReferences(node.body, capture);
    default:
      return 0;
  }
}, referencesAfter = (node, capture, body) => {
  switch (node.kind) {
    case "sequence": {
      let position = node.items.indexOf(body);
      return node.items.reduce((total, item, index) => index === position ? total : position !== -1 && index > position ? total + countReferences(item, capture) : total + referencesAfter(item, capture, body), 0);
    }
    case "alternation":
      return node.branches.reduce(
        (total, branch) => total + referencesAfter(branch, capture, body),
        0
      );
    case "repeat":
    case "look":
    case "uncertain":
      return referencesAfter(node.body, capture, body);
    default:
      return 0;
  }
}, valueKey = (string, pattern) => string.map(
  (set) => setKey(
    pattern.flags.ignoreCase ? caseClosure(set, pattern.flags.unicode) : set
  )
).join("|"), isPrefixOf = (key, other) => key === "" || other.startsWith(`${key}|`), prefixFree = (keys) => keys.every(
  (key, index) => keys.every(
    (other, otherIndex) => otherIndex === index || !isPrefixOf(key, other)
  )
), distribute = (node, capture, body, values) => {
  switch (node.kind) {
    case "sequence": {
      let position = node.items.indexOf(body), items = node.items.map(
        (item, index) => position !== -1 && index >= position ? item : distribute(item, capture, body, values)
      );
      if (position === -1) return { ...node, items };
      let rest = node.items.slice(position + 1), branches = values.map((value) => ({
        kind: "sequence",
        items: [
          value,
          ...rest.map((item) => replaceReferences(item, capture, value))
        ]
      }));
      return {
        ...node,
        items: [...items.slice(0, position), { kind: "alternation", branches }]
      };
    }
    case "alternation":
      return {
        ...node,
        branches: node.branches.map(
          (branch) => distribute(branch, capture, body, values)
        )
      };
    case "repeat":
    case "look":
    case "uncertain":
      return { ...node, body: distribute(node.body, capture, body, values) };
    default:
      return node;
  }
}, distributionValues = (root, capture, body, pattern) => {
  let total = countReferences(root, capture), strings = total === 0 ? null : smallLanguage(body), shared = someNode(
    root,
    (node) => node.kind === "backreference" && node.captures.length > 1 && node.captures.includes(capture)
  );
  if (strings === null || shared || referencesAfter(root, capture, body) !== total) return null;
  let unique = new Map(
    strings.map((string) => [valueKey(string, pattern), string])
  );
  return prefixFree([...unique.keys()]) ? [...unique.values()].map(
    (string) => literal(string, pattern.flags.ignoreCase, pattern.flags.unicode)
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
    let position = items.indexOf(body), referenced = items.slice(position + 1).some(
      (item) => someNode(
        item,
        (node) => node.kind === "backreference" && node.captures.includes(capture)
      )
    ), strings = position === -1 || !referenced ? null : smallLanguage(body);
    return strings ? [{ capture, position, strings }] : [];
  });
}, applySplit = (items, split, string, pattern) => {
  let value = literal(
    string,
    pattern.flags.ignoreCase,
    pattern.flags.unicode
  );
  return items.map((item, index) => index === split.position ? value : index < split.position ? item : replaceReferences(item, split.capture, value));
}, backreferenceCases = (pattern) => {
  let { root, factor } = distributeCaptures(pattern), cases = [
    root.kind === "sequence" ? [...root.items] : [root]
  ];
  for (let split of splitsOf(root, pattern.captures)) {
    let unique = new Map(
      split.strings.map((string) => [valueKey(string, pattern), string])
    );
    factor * cases.length * unique.size > CASE_LIMIT || (cases = cases.flatMap(
      (items) => [...unique.values()].map(
        (string) => applySplit(items, split, string, pattern)
      )
    ));
  }
  return cases.map(
    (items) => items.length === 1 && root.kind !== "sequence" ? items[0] : { kind: "sequence", items }
  );
};

// src/hooks/regex/syntax/narrowing.ts
var singleCharSet = (node) => {
  if (node.kind === "char") return node.set;
  if (node.kind === "sequence" && node.items.length === 1)
    return singleCharSet(node.items[0]);
  if (node.kind !== "alternation") return null;
  let set = EMPTY_SET;
  for (let branch of node.branches) {
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
}, foldLookaheads = (node) => {
  switch (node.kind) {
    case "sequence": {
      let items = [];
      for (let index = node.items.length - 1; index >= 0; index -= 1) {
        let item = foldLookaheads(node.items[index]), narrowed = item.kind === "look" ? narrow(item, items[0]) : null;
        narrowed ? items[0] = narrowed : items.unshift(item);
      }
      return { ...node, items };
    }
    case "alternation":
      return { ...node, branches: node.branches.map(foldLookaheads) };
    case "repeat":
    case "look":
    case "uncertain":
      return { ...node, body: foldLookaheads(node.body) };
    default:
      return node;
  }
};

// src/hooks/regex/syntax/cursor.ts
var CONTROL_ESCAPES = {
  f: 12,
  n: 10,
  r: 13,
  t: 9,
  v: 11
}, isDigit = (char) => char !== void 0 && char >= "0" && char <= "9", isOctal = (char) => char !== void 0 && char >= "0" && char <= "7", isAsciiLetter = (char) => char !== void 0 && /^[A-Za-z]$/.test(char), isHex = (text) => /^[0-9A-Fa-f]+$/.test(text), peek = (cursor, offset = 0) => cursor.source[cursor.position + offset], startsWith = (cursor, text) => cursor.source.startsWith(text, cursor.position), readPoint = (cursor) => {
  let point = cursor.unicode ? cursor.source.codePointAt(cursor.position) ?? 0 : cursor.source.charCodeAt(cursor.position);
  return cursor.position += point > 65535 ? 2 : 1, point;
}, readHex = (cursor, length) => {
  let text = cursor.source.slice(cursor.position, cursor.position + length);
  return text.length !== length || !isHex(text) ? null : (cursor.position += length, Number.parseInt(text, 16));
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
    let controlled = inClass && !cursor.unicode && /^[0-9_]$/.test(peek(cursor, 2) ?? ""), point2 = controlled ? cursor.source.charCodeAt(cursor.position + 2) % 32 : 92;
    return cursor.position += controlled ? 3 : 1, { value: charValue(pointSet(point2)), point: point2 };
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
  let point = readCharacterEscape(cursor);
  return { value: charValue(pointSet(point)), point };
}, readClassAtom = (cursor, mode) => {
  if (peek(cursor) === "\\") return readAtomEscape(cursor, mode, !0);
  let point = readPoint(cursor);
  return { value: charValue(pointSet(point)), point };
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
}, foldString = (points, mode) => mode.ignoreCase ? points.map((point) => caseRepresentative(point, !0)) : points, uniqueStrings = (strings) => {
  let seen = /* @__PURE__ */ new Map();
  for (let string of strings) seen.set(string.join(","), string);
  return [...seen.values()];
}, unionValues = (left, right) => ({
  chars: union(left.chars, right.chars),
  strings: uniqueStrings([...left.strings, ...right.strings]),
  approximate: left.approximate || right.approximate
}), intersectValues = (left, right) => {
  let rightKeys = new Set(right.strings.map((string) => string.join(",")));
  return {
    chars: intersect(left.chars, right.chars),
    strings: uniqueStrings([
      ...left.strings.filter(
        (string) => right.approximate || rightKeys.has(string.join(","))
      ),
      ...left.approximate ? right.strings : []
    ]),
    approximate: left.approximate && right.approximate
  };
}, subtractValues = (left, right) => {
  let rightKeys = new Set(right.strings.map((string) => string.join(",")));
  return {
    chars: subtract(left.chars, right.chars),
    strings: left.strings.filter((string) => !rightKeys.has(string.join(","))),
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
  let singles = strings.filter((string) => string.length === 1);
  return {
    chars: closeOver2(
      fromPoints(singles.map(([point]) => point)),
      mode,
      !0
    ),
    strings: uniqueStrings(
      strings.filter((string) => string.length !== 1).map((string) => foldString(string, mode))
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
    (point) => charNode(closeOver2(pointSet(point), mode, !0))
  )
}), valueNode = (value, mode) => {
  if (value.strings.length === 0 && !value.approximate)
    return charNode(value.chars);
  let longest = value.strings.filter((string) => string.length > 1).toSorted((left, right) => right.length - left.length), approximated = value.approximate ? [
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
  ] : [], chars = isEmptySet(value.chars) ? [] : [charNode(value.chars)], empty = value.strings.some((string) => string.length === 0) ? [EMPTY_NODE] : [], branches = [
    ...approximated,
    ...longest.map((string) => stringNode(string, mode)),
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
  let depth = 0, index = open;
  for (; index < source.length; ) {
    let char = source[index];
    if (char === "\\") {
      index += 2;
      continue;
    }
    if (index += 1, char === "[" && (sets || depth === 0)) {
      depth += 1, depth > NESTING_LIMIT && reachCap();
      continue;
    }
    if (char === "]" && (depth -= 1, depth === 0))
      return index;
  }
  return index;
}, prescan = (source, sets) => {
  let names = /* @__PURE__ */ new Map(), total = 0, depth = 0, index = 0;
  for (; index < source.length; ) {
    let char = source[index];
    if (char === "\\") {
      index += 2;
      continue;
    }
    if (char === "[") {
      index = skipClass(source, index, sets);
      continue;
    }
    if (char === "(" && (depth += 1), char === ")" && (depth -= 1), depth > NESTING_LIMIT && reachCap(), char === "(" && source[index + 1] !== "?" && (total += 1), char === "(" && source.startsWith("(?<", index) && source[index + 3] !== "=" && source[index + 3] !== "!") {
      let close = source.indexOf(">", index + 3), name = decodeName(source.slice(index + 3, close));
      total += 1, names.set(name, [...names.get(name) ?? [], total]);
    }
    index += 1;
  }
  return { total, names };
}, dotSet = (mode, unicode) => {
  let all = rangeSet(0, universeLimit(unicode));
  return mode.dotAll ? all : subtract(all, LINE_TERMINATORS);
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
  let captures = indices.filter((index) => !cursor.open.includes(index));
  return captures.length === 0 ? EMPTY_NODE : { kind: "backreference", captures };
}, readDecimalEscape = (cursor) => {
  let digits = /^[1-9]\d*/.exec(cursor.source.slice(cursor.position + 1));
  if (!digits) return null;
  let index = Number(digits[0]);
  return !cursor.unicode && index > cursor.captureTotal ? null : (cursor.position += 1 + digits[0].length, backreference(cursor, [index]));
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
  let close = cursor.source.indexOf(":", cursor.position), [enable = "", disable = ""] = cursor.source.slice(cursor.position + 2, close).split("-"), flag = (letter, current) => enable.includes(letter) || current && !disable.includes(letter);
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
    let node = parseEscape(cursor, mode);
    return { node, quantifiable: node.kind !== "assertion" };
  }
  return {
    node: charNode(
      closeOver2(pointSet(readPoint(cursor)), mode, cursor.unicode)
    ),
    quantifiable: !0
  };
}, parseTerm = (cursor, mode) => {
  let { node, quantifiable } = parseAtom(cursor, mode);
  if (!quantifiable) return node;
  let quantifier = readQuantifier(cursor);
  return quantifier ? (cursor.quantifiers += 1, { kind: "repeat", body: node, ...quantifier }) : node;
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
}, readFlags = (flags) => ({
  ignoreCase: flags.includes("i"),
  multiline: flags.includes("m"),
  dotAll: flags.includes("s"),
  unicode: flags.includes("u") || flags.includes("v"),
  sets: flags.includes("v"),
  sticky: flags.includes("y")
}), parsePattern = (source, flags) => {
  let patternFlags = readFlags(flags), { total, names } = prescan(source, patternFlags.sets), cursor = {
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
var DEFAULT_REPETITION_LIMIT = 25, AMPLIFICATION_LIMIT = 200, WORK_CAP = 18e6, CAPPED = deepFreeze({
  verdict: "undetermined",
  reason: "work cap reached",
  scope: null
}), AMPLIFIED = {
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
    let search = analyzeJob(job("search"));
    if (search.exponential) return growthReason(search, "search");
    let whole = analyzeJob(job("whole match")), [growth, scope] = outgrows(whole, search) ? [whole, "whole match"] : [search, "search"];
    if (grows(growth)) return growthReason(growth, scope);
  }
  return amplifies(job("search"), AMPLIFICATION_LIMIT) ? AMPLIFIED : null;
}, foldedCaptures = (parsed) => new Map(
  [...parsed.captures].map(([index, body]) => [index, foldLookaheads(body)])
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
};

// src/hooks/regex/worker.ts
var serve = (port) => {
  port.on(
    "message",
    ({ source, flags, repetitionLimit }) => port.postMessage(assess(source, { flags, repetitionLimit }))
  );
};
parentPort && serve(parentPort);
