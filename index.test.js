const remark = require("remark");
const smartypants = require("./");

it("implements SmartyPants", () => {
  const file = remark()
    .use(smartypants)
    .processSync('# "Hello World!"');
  expect(String(file)).toMatchInlineSnapshot(`
    "# “Hello World!”
    "
  `);
});
