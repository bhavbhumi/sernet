import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, Plus, Trash2, FolderOpen, Folder } from 'lucide-react';
import { FieldInfoTooltip } from '@/components/admin/FieldInfoTooltip';

export interface CategoryNode {
  name: string;
  children?: CategoryNode[];
}

interface CategoryTreeNodeProps {
  node: CategoryNode;
  depth: number;
  selected: string;
  onSelect: (name: string) => void;
  onDelete: (path: string[]) => void;
  path: string[];
}

function CategoryTreeNode({ node, depth, selected, onSelect, onDelete, path }: CategoryTreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selected === node.name;
  const currentPath = [...path, node.name];

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer group transition-colors text-sm ${
          isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50 text-foreground'
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        <button
          type="button"
          className="flex items-center gap-1.5 flex-1 min-w-0"
          onClick={() => onSelect(node.name)}
        >
          {hasChildren ? (
            <span onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
              {expanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              )}
            </span>
          ) : (
            <span className="w-3.5 shrink-0" />
          )}
          {hasChildren ? (
            expanded ? <FolderOpen className="h-3.5 w-3.5 shrink-0" /> : <Folder className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <span className="h-3.5 w-3.5 shrink-0 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
            </span>
          )}
          <span className="truncate font-medium">{node.name}</span>
        </button>
        <button
          type="button"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-destructive"
          onClick={() => onDelete(currentPath)}
          title="Delete category"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <CategoryTreeNode
              key={child.name}
              node={child}
              depth={depth + 1}
              selected={selected}
              onSelect={onSelect}
              onDelete={onDelete}
              path={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryTreeManagerProps {
  categories: CategoryNode[];
  selected: string;
  onSelect: (name: string) => void;
  onChange: (cats: CategoryNode[]) => void;
}

export function CategoryTreeManager({ categories, selected, onSelect, onChange }: CategoryTreeManagerProps) {
  const [newCat, setNewCat] = useState('');
  const [newParent, setNewParent] = useState('');

  const allNames = collectAllNames(categories);

  function collectAllNames(nodes: CategoryNode[]): string[] {
    const names: string[] = [];
    for (const n of nodes) {
      names.push(n.name);
      if (n.children) names.push(...collectAllNames(n.children));
    }
    return names;
  }

  function insertNode(nodes: CategoryNode[], path: string[], newName: string): CategoryNode[] {
    if (path.length === 0) {
      return [...nodes, { name: newName, children: [] }];
    }
    return nodes.map(n => {
      if (n.name === path[0]) {
        return { ...n, children: insertNode(n.children ?? [], path.slice(1), newName) };
      }
      return n;
    });
  }

  function deleteNode(nodes: CategoryNode[], path: string[]): CategoryNode[] {
    if (path.length === 1) {
      return nodes.filter(n => n.name !== path[0]);
    }
    return nodes.map(n => {
      if (n.name === path[0]) {
        return { ...n, children: deleteNode(n.children ?? [], path.slice(1)) };
      }
      return n;
    });
  }

  const handleAdd = () => {
    const trimmed = newCat.trim();
    if (!trimmed || allNames.includes(trimmed)) return;
    const parentPath = newParent ? [newParent] : [];
    onChange(insertNode(categories, parentPath, trimmed));
    onSelect(trimmed);
    setNewCat('');
  };

  const handleDelete = (path: string[]) => {
    // Deselect if the deleted node was selected
    if (path[path.length - 1] === selected) {
      onSelect(categories[0]?.name ?? '');
    }
    onChange(deleteNode(categories, path));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm font-medium">Category</span>
        <FieldInfoTooltip tip="Select a category for this item. Categories are organised in a parent → sub-category hierarchy. You can also add new categories or sub-categories directly here." />
      </div>

      {/* Tree display */}
      <div className="border border-border rounded-lg bg-muted/20 p-1.5 max-h-44 overflow-y-auto">
        {categories.length === 0 ? (
          <p className="text-xs text-muted-foreground px-2 py-3 text-center">No categories yet. Add one below.</p>
        ) : (
          categories.map(node => (
            <CategoryTreeNode
              key={node.name}
              node={node}
              depth={0}
              selected={selected}
              onSelect={onSelect}
              onDelete={handleDelete}
              path={[]}
            />
          ))
        )}
      </div>

      {/* Selected badge */}
      {selected && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          Selected: <Badge variant="secondary" className="text-xs">{selected}</Badge>
        </div>
      )}

      {/* Add new category */}
      <div className="border border-border rounded-lg p-2.5 space-y-2 bg-background">
        <p className="text-xs font-medium text-muted-foreground">Add category / sub-category</p>
        <Input
          placeholder="New category name"
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          className="h-8 text-sm"
        />
        <div className="flex gap-2">
          <select
            className="flex-1 h-8 text-sm rounded-md border border-border bg-background px-2 text-muted-foreground"
            value={newParent}
            onChange={e => setNewParent(e.target.value)}
          >
            <option value="">Root level</option>
            {allNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <Button type="button" size="sm" className="h-8 px-3" onClick={handleAdd} disabled={!newCat.trim()}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
