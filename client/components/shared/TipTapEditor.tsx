"use client";

import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Toolbar from "./Toolbar";

const TipTapEditor = ({ onChange, content }: any) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none",
      },
    },
    content, // Initialize editor with initial content
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    // Add the `immediatelyRender` option and set it to `false`
    immediatelyRender: typeof window !== 'undefined',
  });

  const prevContentRef = useRef<string | null>(null);

  useEffect(() => {
    if (editor && content !== prevContentRef.current) {
      prevContentRef.current = content;
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="w-full">
      <Toolbar editor={editor} content={content} />
      <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
    </div>
  );
};

export default TipTapEditor;