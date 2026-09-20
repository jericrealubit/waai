/**
 * Renders a structured-data block.
 *
 * `dangerouslySetInnerHTML` is the documented way to do this in the App Router
 * — React would otherwise escape the JSON's quotes and produce markup no
 * parser can read. The input is built by lib/jsonld.ts from our own content
 * files, never from user input, and `JSON.stringify` cannot emit a `</script>`
 * sequence from those values.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escaping `<` defends the one case stringify won't: a literal "</script>"
      // arriving inside a content string some day.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
