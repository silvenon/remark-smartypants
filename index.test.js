import { remark } from "remark";
import smartypants from "./";

it("implements SmartyPants", async () => {
  const file = await remark()
    .use(smartypants)
    .process('# "Hello World!"');
  expect(String(file)).toMatchInlineSnapshot(`
    "# “Hello World!”
    "
  `);
});
