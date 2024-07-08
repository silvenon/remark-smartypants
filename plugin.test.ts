import { it, expect, describe } from "vitest";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import remarkSmartypants from "./plugin.ts";

const compiler = remark().use(remarkSmartypants);
const process = compiler.process.bind(compiler);

it("implements SmartyPants", async () => {
  const file = await process('# "Hello World!"');
  expect(String(file.toString())).toMatchInlineSnapshot(`
    "# “Hello World!”
    "`);
});

it("handles quotes around links", async () => {
  const file = await process(
    `"wow". go to '[single](/foo)' today "[double](/bar)". . .`,
  );
  expect(file.toString()).toMatchInlineSnapshot(`
    "“wow”. go to ‘[single](/foo)’ today “[double](/bar)”…
    "`);
});

it("handles quotes around bold text", async () => {
  const file = await process(
    `foo '**Bolded -- \`\`part** of --- this quote' bar`,
  );
  expect(file.toString()).toMatchInlineSnapshot(`
    "foo ‘**Bolded — “part** of --- this quote’ bar
    "`);
});

describe("handles quotes around inline code", async () => {
  it("around inline code", async () => {
    const file = await process('"`code`"');
    expect(file.toString()).toMatchInlineSnapshot(`
      "“\`code\`”
      "`);
  });
  it("around inline code and text", async () => {
    const file = await process(`"\`single 'quote'. . .\` baz"`);
    expect(file.toString()).toMatchInlineSnapshot(`
      "“\`single 'quote'. . .\` baz”
      "`);
  });

  it("around inline code with single quote", async () => {
    const file = await process("'`singles'`'");
    expect(file.toString()).toMatchInlineSnapshot(`
      "‘\`singles'\`’
      "`);
  });

  it("around inline code with double quote", async () => {
    const file = await process('"`double"`"');
    expect(file.toString()).toMatchInlineSnapshot(`
      "“\`double"\`”
      "`);
  });
});

describe("handles quotes at the start of a paragraph", () => {
  it("after paragraphs", async () => {
    const file = await process('paragraph\n\n"after paragraph"');
    expect(file.toString()).toMatchInlineSnapshot(`
      "paragraph\n\n“after paragraph”
      "`);
  });

  it("after a blockquote", async () => {
    const file = await process('> blockquote\n\n"after blockquote"');
    expect(file.toString()).toMatchInlineSnapshot(`
      "> blockquote\n\n“after blockquote”
      "`);
  });

  it("within a blockquote", async () => {
    const file = await process('> blockquote\n>\n> "within blockquote"');
    expect(file.toString()).toMatchInlineSnapshot(`
      "> blockquote\n>\n> “within blockquote”
      "`);
  });
});

describe("should ignore parent nodes", () => {
  const mdxCompiler = remark().use(remarkMdx).use(remarkSmartypants);
  const process = mdxCompiler.process.bind(mdxCompiler);

  it("<style>", async () => {
    const mdxContent = `<style>html:after \\{ content: '""' }</style>`;
    const file = await process(mdxContent);
    expect(file.toString().trimEnd()).toBe(mdxContent);
  });
  it("<script>", async () => {
    const mdxContent = '<script>console.log("foo")</script>';
    const file = await process(mdxContent);
    expect(file.toString().trimEnd()).toBe(mdxContent);
  });
});
