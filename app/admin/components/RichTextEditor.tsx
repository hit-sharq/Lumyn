"use client"

import { useRef, useState, useEffect } from "react"
import styles from "./manager.module.css"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [isUserEditing, setIsUserEditing] = useState(false)

  // Initialize content on mount
  useEffect(() => {
    if (editorRef.current && !isUserEditing && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value, isUserEditing])

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }

  const isFormatActive = (command: string): boolean => {
    return document.queryCommandState(command)
  }

  return (
    <div className={styles.richTextContainer}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={`${styles.toolbarBtn} ${isFormatActive("bold") ? styles.active : ""}`}
          onClick={() => applyFormat("bold")}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={`${styles.toolbarBtn} ${isFormatActive("italic") ? styles.active : ""}`}
          onClick={() => applyFormat("italic")}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={`${styles.toolbarBtn} ${isFormatActive("underline") ? styles.active : ""}`}
          onClick={() => applyFormat("underline")}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <div className={styles.toolbarSeparator} />
        <button
          type="button"
          className={styles.toolbarBtn}
          onClick={() => {
            const url = prompt("Enter URL:")
            if (url) applyFormat("createLink", url)
          }}
          title="Insert Link"
        >
          🔗
        </button>
        <button
          type="button"
          className={styles.toolbarBtn}
          onClick={() => applyFormat("removeFormat")}
          title="Clear Formatting"
        >
          ✕
        </button>
      </div>

      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => {
          setIsActive(true)
          setIsUserEditing(true)
        }}
        onBlur={() => {
          setIsActive(false)
          setIsUserEditing(false)
        }}
        data-placeholder={placeholder}
      />

      <div className={styles.charCount}>
        {value.replace(/<[^>]*>/g, "").length} characters
      </div>
    </div>
  )
}
