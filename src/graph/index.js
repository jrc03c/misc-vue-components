// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .x-graph {
    overflow: hidden;
    position: absolute;
    width: 50vw !important;
    height: 50vh !important;
  }

  .x-graph canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div class="x-graph">
    <x-node
      :id="node.id"
      :jacks="node.jacks"
      :key="node.id"
      :x="node.x"
      :y="node.y"
      @mousedown="$emit('move-node-to-top', node)"
      v-for="node in nodes">
    </x-node>
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createHighDPICanvas = require("@jrc03c/create-high-dpi-canvas")
const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const EdgeComponent = require("./edge")
const NodeComponent = require("./node")

module.exports = createVueComponentWithCSS({
  name: "x-graph",
  template,
  emits: ["move-node-to-top"],

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
      canvas: null,
      css,
      mouse: { x: 0, y: 0 },
      resizeObserver: null,
    }
  },

  methods: {
    drawEdges() {
      const { canvas } = this
      const { width, height } = canvas
      const context = canvas.getContext("2d")
      context.clearRect(0, 0, width, height)
      context.fillStyle = "red"
      context.beginPath()
      context.arc(this.mouse.x, this.mouse.y, 32, 0, Math.PI * 2)
      context.fill()
    },

    onMouseMove(event) {
      const { x, y } = this.$el.getBoundingClientRect()
      this.mouse.x = event.clientX - x
      this.mouse.y = event.clientY - y
      this.drawEdges()
    },

    onRootResize(entries) {
      const entry = entries[0]
      const width = entry.contentBoxSize[0].inlineSize
      const height = entry.contentBoxSize[0].blockSize
      const dpi = window.devicePixelRatio || 1
      this.canvas.width = Math.floor(width * dpi)
      this.canvas.height = Math.floor(height * dpi)
      this.canvas.style.width = `${width}px`
      this.canvas.style.height = `${height}px`
    },
  },

  mounted() {
    this.canvas = createHighDPICanvas(0, 0)
    this.$el.appendChild(this.canvas)
    this.resizeObserver = new ResizeObserver(this.onRootResize)
    this.resizeObserver.observe(this.$el)
    window.addEventListener("mousemove", this.onMouseMove)

    setTimeout(() => {
      const dpi = window.devicePixelRatio || 1
      const { width, height } = this.$el.getBoundingClientRect()
      this.canvas.width = Math.floor(width * dpi)
      this.canvas.height = Math.floor(height * dpi)
      this.canvas.style.width = `${Math.floor(width)}px`
      this.canvas.style.height = `${Math.floor(height)}px`
    }, 250)
  },

  unmounted() {
    this.resizeObserver.disconnect()
    window.removeEventListener("mousemove", this.onMouseMove)
  },
})
