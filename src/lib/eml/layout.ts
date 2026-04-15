import {
  hierarchy,
  tree as d3tree,
  type HierarchyPointNode,
} from 'd3-hierarchy';

import type { EMLTree } from './tree';

export type LaidOutNode = {
  readonly id: string;
  readonly kind: 'const' | 'var' | 'eml';
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly depth: number;
  readonly parentId: string | null;
  readonly tree: EMLTree;
};

export type LaidOutTree = {
  readonly nodes: readonly LaidOutNode[];
  readonly width: number;
  readonly height: number;
};

type Annotated = {
  readonly id: string;
  readonly tree: EMLTree;
  readonly children: readonly Annotated[];
};

const annotate = (tree: EMLTree, id: string): Annotated => {
  if (tree.kind !== 'eml') return { id, tree, children: [] };
  return {
    id,
    tree,
    children: [annotate(tree.left, id + 'L'), annotate(tree.right, id + 'R')],
  };
};

const labelOf = (tree: EMLTree): string =>
  tree.kind === 'const' ? '1' : tree.kind === 'var' ? tree.name : 'E';

// Reingold–Tilford tidy tree via d3-hierarchy. Node separation scales down
// slightly for siblings under the same parent, so deep chains stay narrow
// while fan-outs still breathe.
export const layoutTree = (tree: EMLTree): LaidOutTree => {
  const root = hierarchy<Annotated>(annotate(tree, '0'), (d) => [
    ...d.children,
  ]);
  // Tight horizontal spacing: siblings under the same parent sit 1 unit apart
  // and cousins only get a small extra gap. Vertical (y) is 0.8 so deep trees
  // stay compact; pad comes from the caller's viewBox.
  const layout = d3tree<Annotated>()
    .nodeSize([1, 0.8])
    .separation((a, b) => (a.parent === b.parent ? 1 : 1.1));
  layout(root);

  const points = root.descendants() as HierarchyPointNode<Annotated>[];
  let minX = Infinity;
  let maxX = -Infinity;
  let maxY = 0;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  const nodes: LaidOutNode[] = points.map((p) => ({
    id: p.data.id,
    kind: p.data.tree.kind,
    label: labelOf(p.data.tree),
    x: p.x - minX + 0.5,
    y: p.y,
    depth: p.depth,
    parentId: p.parent?.data.id ?? null,
    tree: p.data.tree,
  }));

  return { nodes, width: maxX - minX + 1, height: maxY + 1 };
};
