import sanitizeHtml from 'sanitize-html'

export function markdownToHtml(text: string) {
  return sanitizeHtml(text || '', {
    allowedTags: ['strong', 'em', 'u', 'a', 'p', 'br', 'div'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
  })
}
