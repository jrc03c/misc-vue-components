// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ ``

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div class="x-graph">
    <p>This is a graph!</p>

    <x-node
      :id="node.id"
      :jacks="node.jacks"
      :key="node.id"
      :x="node.x"
      :y="node.y"
      v-for="node in nodes">
    </x-node>
    
    <x-edge
      :id="edge.id"
      :input-jack="edge.inputJack"
      :key="edge.id"
      :output-jack="edge.outputJack"
      v-for="edge in edges">
    </x-edge>
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const EdgeComponent = require("./edge")
const NodeComponent = require("./node")

module.exports = createVueComponentWithCSS({
  name: "x-graph",
  template,

  components: {
    "x-edge": EdgeComponent,
    "x-node": NodeComponent,
  },

  props: {
    edges: {
      type: Array,
      required: false,
      default: () => [],
    },

    nodes: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      css,
    }
  },
})
