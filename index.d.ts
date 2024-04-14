/**
 * remark plugin to implement SmartyPants.
 *
 * @type {import('unified').Plugin<[Options?], Root>}
 */
import type { Options } from "retext-smartypants";
import type { Transformer } from "unified";
import { Root } from "mdast";

export { Options };

/**
 * Applies SmartyPants transformation to a Markdown Abstract Syntax Tree (MDAST).
 *
 * @param {Options?} options - Configuration options for SmartyPants.
 * @returns {Transformer<Root, Root>?} - A transformer for the MDAST.
 */
export default function remarkSmartypants(
  options?: Options,
): Transformer<Root, Root> | undefined | void;
