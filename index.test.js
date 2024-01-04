import { it, expect, describe } from "vitest";
import { remark } from "remark";
import smartypants from "./";

const { process } = remark().use(smartypants);

it("implements SmartyPants", async () => {
  const file = await process('# "Hello World!"');
  expect(String(file)).toMatchInlineSnapshot(`
    "# “Hello World!”
    "
  `);
});

it("handles quotes around links", async () => {
  const file = await process(
    `"wow". go to '[single](/foo)' today "[double](/bar)". . .`,
  );
  expect(file.value).toMatchInlineSnapshot(`
    "“wow”. go to ‘[single](/foo)’ today “[double](/bar)”…
    "
  `);
});

it("handles quotes around bold text", async () => {
  const file = await process(
    `foo '**Bolded -- \`\`part** of --- this quote' bar`,
  );
  expect(file.value).toMatchInlineSnapshot(`
    "foo ‘**Bolded — “part** of --- this quote’ bar
    "
  `);
});

describe("handles quotes around inline code", async () => {
  it("around inline code", async () => {
    const file = await process('"`code`"');
    expect(file.value).toMatchInlineSnapshot(`
      "“\`code\`”
      "
    `);
  });
  it("around inline code and text", async () => {
    const file = await process(`"\`single 'quote'. . .\` baz"`);
    expect(file.value).toMatchInlineSnapshot(
      `
      "“\`single 'quote'. . .\` baz”
      "
    `,
    );
  });

  it("around inline code with single quote", async () => {
    const file = await process("'`singles'`'");
    expect(file.value).toMatchInlineSnapshot(
      `
      "‘\`singles'\`’
      "
    `,
    );
  });

  it("around inline code with double quote", async () => {
    const file = await process('"`double"`"');
    expect(file.value).toMatchInlineSnapshot(
      `
      "“\`double\\"\`”
      "
    `,
    );
  });
});
