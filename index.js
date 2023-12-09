/**
 * @typedef {import("mdast").Root} Root
 * @typedef {import("retext-smartypants").Options} Options
 */

import { retext } from "retext";
import { visit } from "unist-util-visit";
import smartypants from "retext-smartypants";

/**
 * Remark plugin to implement SmartyPants.
 *
 * @type {import("unified").Plugin<[Options?] | void[], Root>}
 */
export default function remarkSmartypants(options) {
  const processor = retext().use(smartypants, options);

  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      node.value = processor.processSync(node.value).value;

      const prevNode = parent.children[index - 1];
      const beforePrevNode = parent.children[index - 2];

      // Check for quotes between links
      if (
        prevNode &&
        prevNode.type === "link" &&
        beforePrevNode &&
        beforePrevNode.type === "text"
      ) {
        const SINGLE_QUOTE = ["‘", "’"];
        const DOUBLE_QUOTE = ["“", "”"];

        for (const [startQuote, endQuote] of [SINGLE_QUOTE, DOUBLE_QUOTE]) {
          const beforePrevText = beforePrevNode.value;

          if (node.value[0] === endQuote && beforePrevText.endsWith(endQuote)) {
            beforePrevNode.value = beforePrevText.slice(0, -1) + startQuote;
            break; // replaced, skip other checks
          }
        }
      }
    });
  };
}
