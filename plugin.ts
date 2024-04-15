import { retext } from "retext";
import { visit } from "unist-util-visit";
import smartypants, { type Options } from "retext-smartypants";
import type { Plugin } from "unified";
import type { Test } from "unist-util-is";
import type { Node } from "unist";

const VISITED_NODES = new Set(["text", "inlineCode"]);

const IGNORED_HTML_ELEMENTS = new Set(["style", "script"]);

const check: Test = (node, index, parent) => {
  return (
    parent &&
    (parent.type !== "mdxJsxTextElement" ||
      ("name" in parent &&
        typeof parent.name === "string" &&
        !IGNORED_HTML_ELEMENTS.has(parent.name))) &&
    VISITED_NODES.has(node.type) &&
    isLiteral(node)
  );
};

/**
 * remark plugin to implement SmartyPants.
 */
const remarkSmartypants: Plugin<[Options?]> = (options) => {
  const processor = retext().use(smartypants, {
    ...options,
    // Do not replace ellipses, dashes, backticks because they change string
    // length, and we couldn't guarantee right splice of text in second visit of
    // tree
    ellipses: false,
    dashes: false,
    backticks: false,
  });

  const processor2 = retext().use(smartypants, {
    ...options,
    // Do not replace quotes because they are already replaced in the first
    // processor
    quotes: false,
  });

  return (tree) => {
    let allText = "";
    let startIndex = 0;
    const nodes: Literal[] = [];

    visit(tree, check, (node) => {
      if (!isLiteral(node)) return;
      allText +=
        node.type === "text" ? node.value : "A".repeat(node.value.length);
      nodes.push(node);
    });

    // Concat all text into one string, to properly replace quotes around links
    // and bold text
    allText = processor.processSync(allText).toString();

    for (const node of nodes) {
      const endIndex = startIndex + node.value.length;
      if (node.type === "text") {
        const processedText = allText.slice(startIndex, endIndex);
        node.value = processor2.processSync(processedText).toString();
      }
      startIndex = endIndex;
    }
  };
};

// the Literal interface from @types/unist has unknown value, we want string
interface Literal extends Node {
  value: string;
}

function isLiteral(node: Node): node is Literal {
  return "value" in node && typeof node.value === "string";
}

export default remarkSmartypants;
