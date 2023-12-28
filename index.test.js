import { it, expect } from "vitest";
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

it("handles quotes around code", async () => {
  const file = await process(`foo "\`code\`" bar "\`single 'quote'. . .\` baz"`);
  expect(file.value).toMatchInlineSnapshot(`
    "foo “\`code\`” bar “\`single 'quote'. . .\` baz”
    "
  `);
});
