"use client";

import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import {
  Bold,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  MoreHorizontal,
  Underline as UnderlineIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const Figcaption = Node.create({
  name: "figcaption",
  content: "inline*",
  parseHTML() {
    return [{ tag: "figcaption" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["figcaption", mergeAttributes(HTMLAttributes), 0];
  },
});

const Figure = Node.create({
  name: "figure",
  group: "block",
  content: "image figcaption?",
  isolating: true,
  parseHTML() {
    return [{ tag: "figure" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["figure", mergeAttributes(HTMLAttributes), 0];
  },
});

function escapeAttr(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type RichTextEditorProps = {
  value: string;
  onChange: (html: string, json: unknown) => void;
};

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      className={cn("cms-editor-btn", active && "is-active")}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [linkQuery, setLinkQuery] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [linkResults, setLinkResults] = useState<
    Array<{ label: string; href: string; group: string }>
  >([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing your article...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: { class: "blog-inline-image" },
      }),
      Figcaption,
      Figure,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML(), current.getJSON());
    },
    editorProps: {
      attributes: {
        class: "cms-editor-content prose-blog",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current && !editor.isFocused) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  const searchLinks = useCallback(async (q: string) => {
    try {
      const result = await api.linkSearch(q);
      setLinkResults([
        ...result.blogs.map((item) => ({ ...item, group: "Blogs" })),
        ...result.routes.map((item) => ({ ...item, group: "Routes" })),
        ...result.services.map((item) => ({ ...item, group: "Services" })),
        ...result.pages.map((item) => ({ ...item, group: "Pages" })),
      ]);
    } catch {
      setLinkResults([]);
    }
  }, []);

  useEffect(() => {
    if (!linkOpen) return;
    const timer = setTimeout(() => {
      void searchLinks(linkQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [linkOpen, linkQuery, searchLinks]);

  if (!editor) return null;
  const current = editor;

  function insertImage() {
    const src = window.prompt("Image URL");
    if (!src) return;
    const alt = window.prompt("Alt text (required for accessibility)") || "";
    const title = window.prompt("Image title (optional)") || undefined;
    const caption = window.prompt("Caption (optional)") || "";
    if (caption) {
      current
        .chain()
        .focus()
        .insertContent(
          `<figure><img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${title ? ` title="${escapeAttr(title)}"` : ""} /><figcaption>${escapeAttr(caption)}</figcaption></figure>`,
        )
        .run();
      return;
    }
    current.chain().focus().setImage({ src, alt, title }).run();
  }

  function insertExternalLink() {
    const previous = current.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return;
    if (url === "") {
      current.chain().focus().unsetLink().run();
      return;
    }
    current.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function applyInternalLink(href: string) {
    current.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setLinkOpen(false);
    setLinkQuery("");
  }

  return (
    <div className="cms-editor">
      <div className="cms-editor-toolbar">
        <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton title="Link" active={editor.isActive("link")} onClick={insertExternalLink}>
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton title="Image" onClick={insertImage}>
          <ImageIcon size={16} />
        </ToolbarButton>
        <div className="cms-editor-more">
          <ToolbarButton title="More" active={moreOpen} onClick={() => setMoreOpen((v) => !v)}>
            <MoreHorizontal size={16} />
          </ToolbarButton>
          {moreOpen ? (
            <div className="cms-editor-more-panel">
              <ToolbarButton title="H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
              <ToolbarButton title="H4" active={editor.isActive("heading", { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>H4</ToolbarButton>
              <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</ToolbarButton>
              <ToolbarButton title="Code" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</ToolbarButton>
              <ToolbarButton title="Table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</ToolbarButton>
              <ToolbarButton title="Internal link" onClick={() => { setMoreOpen(false); setLinkOpen(true); }}>Internal</ToolbarButton>
              <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>Undo</ToolbarButton>
              <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>Redo</ToolbarButton>
            </div>
          ) : null}
        </div>
      </div>

      {linkOpen ? (
        <div className="cms-link-picker">
          <input
            className="cms-input"
            placeholder="Search blogs, routes, services, pages…"
            value={linkQuery}
            onChange={(e) => setLinkQuery(e.target.value)}
          />
          <div className="cms-link-results">
            {linkResults.length === 0 ? (
              <p className="cms-hint">No matches yet.</p>
            ) : (
              linkResults.map((item) => (
                <button
                  key={`${item.group}-${item.href}`}
                  type="button"
                  className="cms-link-result"
                  onClick={() => applyInternalLink(item.href)}
                >
                  <span>{item.label}</span>
                  <span className="cms-hint">
                    {item.group} · {item.href}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}

      <EditorContent editor={editor} />
    </div>
  );
}
