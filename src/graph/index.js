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
    <x-node :key="node.id" :node="node" v-for="node in graph.nodes"></x-node>
    <x-edge :key="edge.id" :edge="edge" v-for="edge in graph.edges"></x-edge>
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const Edge = require("./edge")
const Node = require("./node")

class GraphClass {
  edges = []
  nodes = []

  constructor(data) {
    data = data || {}
    this.edges = data.edges ? data.edges.map(e => new Edge.class(e)) : []
    this.nodes = data.nodes ? data.nodes.map(n => new Node.class(n)) : []
  }
}

const component = createVueComponentWithCSS({
  name: "x-graph",
  template,

  components: {
    "x-edge": Edge.component,
    "x-node": Node.component,
  },

  props: {
    graph: {
      type: GraphClass,
      required: true,
      default: () => null,
    },
  },

  data() {
    return {
      css,
    }
  },
})

module.exports = { class: GraphClass, component, Edge, Node }
