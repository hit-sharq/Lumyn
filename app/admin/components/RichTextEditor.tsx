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
  const [activeFormats, setActiveFormats] = useState<{
    bold: boolean
    italic: boolean
    underline: boolean
  }>({ bold: false, italic: false, underline: false })

  useEffect(() => {
    if (editorRef.current) {
      const cleanValue = cleanHtml(value)
      if (!isUserEditing && cleanValue !== cleanHtml(editorRef.current.innerHTML)) {
        editorRef.current.innerHTML = cleanValue || ""
      }
    }
  }, [value, isUserEditing])

  useEffect(() => {
    if (!isActive) {
      setActiveFormats({ bold: false, italic: false, underline: false })
      return
    }

    const updateActiveFormats = () => {
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
      })
    }

    document.addEventListener("selectionchange", updateActiveFormats)
    updateActiveFormats()
    return () => document.removeEventListener("selectionchange", updateActiveFormats)
  }, [isActive])

  const applyFormat = (command: string, value?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
  }

  const cleanHtml = (html: string): string => {
    const trimmed = html.trim()
    if (!trimmed || /^(<br\s*\/?>|<div>\s*<br\s*\/?>\s*<\/div>|<div>\s*<\/div>)$/i.test(trimmed)) return ""
    const unwrapped = trimmed.replace(/^<div[^>]*>([\s\S]*)<\/div>$/, "$1")
    return unwrapped.trim()
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(cleanHtml(editorRef.current.innerHTML))
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault()
          applyFormat("bold")
          break
        case "i":
          e.preventDefault()
          applyFormat("italic")
          break
        case "u":
          e.preventDefault()
          applyFormat("underline")
          break
      }
    }
  }

  return (
    <div className={styles.richTextContainer}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={`${styles.toolbarBtn} ${activeFormats.bold ? styles.active : ""}`}
          onClick={() => applyFormat("bold")}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={`${styles.toolbarBtn} ${activeFormats.italic ? styles.active : ""}`}
          onClick={() => applyFormat("italic")}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={`${styles.toolbarBtn} ${activeFormats.underline ? styles.active : ""}`}
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
        onKeyDown={handleKeyDown}
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
