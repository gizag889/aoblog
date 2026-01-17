import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

export async function processHtml(html: string): Promise<string> {
  const file = await unified()
    .use(rehypeParse, { fragment: true }) // Parse HTML fragment
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeStringify) // Serialize back to HTML
    .process(html);

  return String(file);
}
