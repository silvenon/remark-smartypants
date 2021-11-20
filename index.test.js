import { remark } from "remark";
import smartypants from "./";

it("implements SmartyPants", () => {
  const file = remark()
    .use(smartypants)
    .processSync('# "Hello World!"');
  expect(String(file)).toMatchInlineSnapshot(`
    "# “Hello World!”
    "
  `);
});
