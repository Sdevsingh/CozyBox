/**
 * JsonLd — renders a <script type="application/ld+json"> block.
 * React fully renders script tags via dangerouslySetInnerHTML, and Google
 * executes our JS, so this structured data is picked up for rich results.
 */
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
