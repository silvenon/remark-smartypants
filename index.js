import { retext } from 'retext'
import { visit } from 'unist-util-visit'
import smartypants from 'retext-smartypants'

const remarkSmartypants = options => {
  const processor = retext().use(smartypants, options)
  const transformer = tree => {
    visit(tree, 'text', node => {
      node.value = String(processor.processSync(node.value))
    })
  }
  return transformer
}

export default remarkSmartypants
