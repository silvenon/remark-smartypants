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
  const processor = retext().use(smartypants, {
    ...options,
    // Do not replace ellipses and dashes and backticks because they change
    // string length, and we couldn't guarantee right splice of text in second
    // visit of tree
    ellipses: false,
    dashes: false,
    backticks: false,
  });

  const processor2 = retext().use(smartypants, {
    ...options,
    // Do not replace quotes because they are already replaced in the first
    quotes: false,
  });

  return (tree) => {
    let allText = "";
    let startIndex = 0;

    visit(tree, "text", (node) => {
      allText += node.value;
    });

    // Concat all text into one string, to properly replace quotes around links
    // and bold text
    allText = processor.processSync(allText).value;

    visit(tree, "text", (node) => {
      const endIndex = startIndex + node.value.length;
      const processedText = allText.slice(startIndex, endIndex);
      node.value = processor2.processSync(processedText).value;
      startIndex = endIndex;
    });
  };
}
