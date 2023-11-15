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

it.skip("handles quotes around links", async () => {
  const file = await remark()
    .use(smartypants)
    .process('"wow". go to "[google](https://www.google.com/)" today.');
  expect(String(file)).toMatchInlineSnapshot(`
    "“wow”. go to “
    [google](https://www.google.com/)
    ” today.
    "
  `);
});
