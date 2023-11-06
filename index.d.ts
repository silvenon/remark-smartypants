/**
 * Remark plugin to implement SmartyPants.
 *
 * @type {import('unified').Plugin<[Options?], Root>}
 */
import type { Options as SmartypantsOptions } from "retext-smartypants";
import type { Transformer } from "unified";
import { Root } from "mdast";

export { SmartypantsOptions };

/**
 * Applies SmartyPants transformation to a Markdown Abstract Syntax Tree (MDAST).
 *
 * @param {SmartypantsOptions?} options - Configuration options for SmartyPants.
 * @returns {Transformer<Root, Root>?} - A transformer for the MDAST.
 */
export default function remarkSmartypants(
  options?: SmartypantsOptions
): Transformer<Root, Root> | undefined;
