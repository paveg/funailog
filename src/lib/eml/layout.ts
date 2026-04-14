import type { EMLTree } from './tree';

export type LaidOutNode = {
  readonly id: string; // path-based unique key, e.g. "0L", "0LR"
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

// Node and layout constants in abstract grid units.
const X_STEP = 1;
const Y_STEP = 1;

type Placed = {
  readonly node: LaidOutNode;
  readonly width: number;
};

// Simple bottom-up layout: x = center of subtree, subtree width = sum of
// children widths (leaf width = 1). Deterministic and dependency-free.
// Good enough for binary trees up to a few hundred nodes.
const layoutRec = (
  tree: EMLTree,
  depth: number,
  xOffset: number,
  id: string,
  parentId: string | null,
  out: LaidOutNode[],
): Placed => {
  if (tree.kind !== 'eml') {
    const label = tree.kind === 'const' ? '1' : tree.name;
    const node: LaidOutNode = {
      id,
      kind: tree.kind,
      label,
      x: xOffset + X_STEP / 2,
      y: depth * Y_STEP,
      depth,
      parentId,
      tree,
    };
    out.push(node);
    return { node, width: X_STEP };
  }

  const left = layoutRec(tree.left, depth + 1, xOffset, id + 'L', id, out);
  const right = layoutRec(
    tree.right,
    depth + 1,
    xOffset + left.width,
    id + 'R',
    id,
    out,
  );
  const width = left.width + right.width;
  const node: LaidOutNode = {
    id,
    kind: 'eml',
    label: 'E',
    x: xOffset + width / 2,
    y: depth * Y_STEP,
    depth,
    parentId,
    tree,
  };
  out.push(node);
  return { node, width };
};

export const layoutTree = (tree: EMLTree): LaidOutTree => {
  const nodes: LaidOutNode[] = [];
  const { width } = layoutRec(tree, 0, 0, '0', null, nodes);
  let maxDepth = 0;
  for (const n of nodes) if (n.depth > maxDepth) maxDepth = n.depth;
  return { nodes, width, height: (maxDepth + 1) * Y_STEP };
};
