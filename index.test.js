import { it, expect, describe } from "vitest";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import remarkSmartypants from "./";

const compiler = remark().use(remarkSmartypants);
const process = compiler.process.bind(compiler);

it("implements SmartyPants", async () => {
  const file = await process('# "Hello World!"');
  expect(String(file)).toMatchInlineSnapshot(`
    "# “Hello World!”
    "`);
});

it("handles quotes around links", async () => {
  const file = await process(
    `"wow". go to '[single](/foo)' today "[double](/bar)". . .`,
  );
  expect(file.value).toMatchInlineSnapshot(`
    "“wow”. go to ‘[single](/foo)’ today “[double](/bar)”…
    "`);
});

it("handles quotes around bold text", async () => {
  const file = await process(
    `foo '**Bolded -- \`\`part** of --- this quote' bar`,
  );
  expect(file.value).toMatchInlineSnapshot(`
    "foo ‘**Bolded — “part** of --- this quote’ bar
    "`);
});

describe("handles quotes around inline code", async () => {
  it("around inline code", async () => {
    const file = await process('"`code`"');
    expect(file.value).toMatchInlineSnapshot(`
      "“\`code\`”
      "`);
  });
  it("around inline code and text", async () => {
    const file = await process(`"\`single 'quote'. . .\` baz"`);
    expect(file.value).toMatchInlineSnapshot(`
      "“\`single 'quote'. . .\` baz”
      "`);
  });

  it("around inline code with single quote", async () => {
    const file = await process("'`singles'`'");
    expect(file.value).toMatchInlineSnapshot(`
      "‘\`singles'\`’
      "`);
  });

  it("around inline code with double quote", async () => {
    const file = await process('"`double"`"');
    expect(file.value).toMatchInlineSnapshot(`
      "“\`double"\`”
      "`);
  });
});

describe("should ignore parent nodes", () => {
  const mdxCompiler = remark().use(remarkMdx).use(remarkSmartypants);
  const process = mdxCompiler.process.bind(mdxCompiler);

  it("<style>", async () => {
    const mdxContent = `<style>html:after \\{ content: '""' }</style>`;
    const file = await process(mdxContent);
    expect(file.value.trimEnd()).toBe(mdxContent);
  });
  it("<script>", async () => {
    const mdxContent = '<script>console.log("foo")</script>';
    const file = await process(mdxContent);
    expect(file.value.trimEnd()).toBe(mdxContent);
  });
});
