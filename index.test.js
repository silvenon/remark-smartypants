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
