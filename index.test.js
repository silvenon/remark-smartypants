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

it.todo("handles quotes around links", async () => {
  const file = await process(
    '"wow". go to "[google](https://www.google.com/)" today.',
  );
  expect(String(file)).toMatchInlineSnapshot(`
    "“wow”. go to “
    [google](https://www.google.com/)
    ” today.
    "
  `);
});
