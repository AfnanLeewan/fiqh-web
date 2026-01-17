"use client";

import { forwardRef, useImperativeHandle } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Box } from "@mui/material";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  height?: number;
}

export interface RichTextEditorRef {
  focus: () => void;
  blur: () => void;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  (
    { value, onChange, placeholder = "Enter content...", height = 300 },
    ref,
  ) => {
    useImperativeHandle(ref, () => ({
      focus: () => {},
      blur: () => {},
    }));

    return (
      <Box
        sx={{
          "& .tox-tinymce": {
            border: "1px solid #ccc",
            borderRadius: "4px",
          },
          "& .tox-toolbar": {
            borderBottom: "1px solid #ccc",
          },
        }}
      >
        <Editor
  tinymceScriptSrc="/fiqh/tinymce/tinymce.min.js"
  licenseKey="gpl"
  value={value}
  onEditorChange={onChange}
  init={{

    menubar: false,
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "code",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "help",
      "wordcount",
      "directionality",
      "autoresize",
    ],
    toolbar:
      "undo redo | blocks | " +
      "bold italic forecolor | alignleft aligncenter " +
      "alignright alignjustify | ltr rtl | bullist numlist outdent indent | " +
      "removeformat | help",
    min_height: height,
    autoresize_bottom_margin: 20,
    content_style: `
      body { 
        font-family: Helvetica, Arial, sans-serif; 
        font-size: 14px;
      }
      *[dir='RTL'], *[dir='rtl'] {
        direction: rtl !important;
      }
      *[dir='LTR'], *[dir='ltr'] {
        direction: ltr !important;
      }
      p:has(span[dir='RTL']), p:has(span[dir='rtl']) {
        direction: rtl;
        text-align: right;
      }
    `,
    placeholder: placeholder,
    branding: false,
    statusbar: false,
    resize: false,
  }}
/>
      </Box>
    );
  },
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;