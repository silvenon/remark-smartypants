import { it, expect } from "vitest";
import { remark } from "remark";
import smartypants from "./";

it("implements SmartyPants", async () => {
  const file = await remark().use(smartypants).process('# "Hello World!"');
  expect(String(file)).toMatchInlineSnapshot(`
    "# “Hello World!”
    "
  `);
});

it("handles quotes around links", async () => {
  const file = await remark()
    .use(smartypants)
    .process(`"wow". go to '[single](/foo)' today "[double](/bar)". . .`);
  expect(file.value).toMatchInlineSnapshot(`
    "“wow”. go to ‘[single](/foo)’ today “[double](/bar)”…
    "
  `);
});

it("handles quotes around bold text", async () => {
  const file = await remark()
    .use(smartypants)
    .process(`foo '**Bolded -- \`\`part** of --- this quote' bar`);
  expect(file.value).toMatchInlineSnapshot(`
    "foo ‘**Bolded — “part** of --- this quote’ bar
    "
  `);
});
