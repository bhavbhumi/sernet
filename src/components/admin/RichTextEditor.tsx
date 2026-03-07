import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  Link as LinkIcon, Table as TableIcon, Undo, Redo, Code, Minus,
  Indent, Outdent
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const ToolbarButton = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
  <Toggle size="sm" pressed={active} onPressedChange={() => onClick()} aria-label={title} title={title} className="h-7 w-7 p-0 data-[state=on]:bg-primary/15 data-[state=on]:text-primary">
    {children}
  </Toggle>
);

const editorStyles = `
  .tiptap-editor .ProseMirror {
    min-height: 200px;
    padding: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.6;
    outline: none;
    color: hsl(var(--foreground));
  }
  .tiptap-editor .ProseMirror > * + * { margin-top: 0.4em; }
  .tiptap-editor .ProseMirror p { margin: 0.25em 0; }
  .tiptap-editor .ProseMirror h1 { font-size: 1.5em; font-weight: 700; margin: 0.6em 0 0.3em; }
  .tiptap-editor .ProseMirror h2 { font-size: 1.25em; font-weight: 600; margin: 0.5em 0 0.25em; }
  .tiptap-editor .ProseMirror h3 { font-size: 1.1em; font-weight: 600; margin: 0.4em 0 0.2em; }
  .tiptap-editor .ProseMirror strong { font-weight: 700; }

  /* Lists */
  .tiptap-editor .ProseMirror ul {
    list-style-type: disc !important;
    padding-left: 1.5em !important;
    margin: 0.4em 0 !important;
  }
  .tiptap-editor .ProseMirror ol {
    list-style-type: decimal !important;
    padding-left: 1.5em !important;
    margin: 0.4em 0 !important;
  }
  .tiptap-editor .ProseMirror li {
    display: list-item !important;
    margin: 0.1em 0;
  }
  .tiptap-editor .ProseMirror li > p {
    margin: 0;
  }
  /* Nested lists */
  .tiptap-editor .ProseMirror ul ul { list-style-type: circle !important; margin: 0.15em 0 !important; }
  .tiptap-editor .ProseMirror ul ul ul { list-style-type: square !important; }
  .tiptap-editor .ProseMirror ol ol { list-style-type: lower-alpha !important; margin: 0.15em 0 !important; }
  .tiptap-editor .ProseMirror ol ol ol { list-style-type: lower-roman !important; }

  /* Blockquote */
  .tiptap-editor .ProseMirror blockquote {
    border-left: 3px solid hsl(var(--border));
    padding-left: 1em;
    margin: 0.5em 0;
    color: hsl(var(--muted-foreground));
  }
  /* Code */
  .tiptap-editor .ProseMirror pre {
    background: hsl(var(--muted));
    border-radius: 0.375rem;
    padding: 0.75em 1em;
    font-family: monospace;
    font-size: 0.85em;
    overflow-x: auto;
  }
  .tiptap-editor .ProseMirror code {
    background: hsl(var(--muted));
    border-radius: 0.25rem;
    padding: 0.15em 0.3em;
    font-size: 0.85em;
  }
  /* HR */
  .tiptap-editor .ProseMirror hr {
    border: none;
    border-top: 1px solid hsl(var(--border));
    margin: 1em 0;
  }
  /* Table */
  .tiptap-editor .ProseMirror table { border-collapse: collapse; width: 100%; margin: 0.5em 0; }
  .tiptap-editor .ProseMirror td,
  .tiptap-editor .ProseMirror th {
    border: 1px solid hsl(var(--border));
    padding: 0.4em 0.6em;
    text-align: left;
  }
  .tiptap-editor .ProseMirror th { font-weight: 600; background: hsl(var(--muted) / 0.5); }
  /* Link */
  .tiptap-editor .ProseMirror a { color: hsl(var(--primary)); text-decoration: underline; }
`;

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        listItem: {
          HTMLAttributes: {},
        },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'max-w-none focus:outline-none',
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Tab') {
          const ed = editor;
          if (ed && ed.isActive('listItem')) {
            event.preventDefault();
            event.stopPropagation();
            if (event.shiftKey) {
              ed.chain().focus().liftListItem('listItem').run();
            } else {
              ed.chain().focus().sinkListItem('listItem').run();
            }
            return true;
          }
        }
        return false;
      },
    },
  });


  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      <style>{editorStyles}</style>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToolbarButton active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List">
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()} title="Indent (Tab)">
          <Indent className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().liftListItem('listItem').run()} title="Outdent (Shift+Tab)">
          <Outdent className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToolbarButton active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code Block">
          <Code className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToolbarButton active={editor.isActive('link')} onClick={addLink} title="Insert Link">
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={addTable} title="Insert Table">
          <TableIcon className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="tiptap-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
