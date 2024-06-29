// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .x-graph {
    overflow: hidden;
    position: absolute;
  }

  .x-graph,
  .x-graph * {
    user-select: none;
  }

  .x-graph canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .x-graph .x-node.is-selected {
    background-color: hsl(225deg, 100%, 85%);
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div class="x-graph" @click="selectedNodes = []">
    <x-node
      :class="{ 'is-selected': selectedNodes.includes(node) }"
      :id="node.id"
      :jacks="node.jacks"
      :key="node.id"
      :x="node.x"
      :y="node.y"
      @click.stop.prevent=""
      @jack-mouse-down="
        onJackMouseDown({ node, jack: $event.jack, rect: $event.rect })
      "
      @jack-mouse-enter="
        onJackMouseEnter({ node, jack: $event.jack, rect: $event.rect })
      "
      @jack-mouse-leave="
        onJackMouseLeave({ node, jack: $event.jack, rect: $event.rect })
      "
      @mousedown.stop.prevent="selectNode(node)"
      v-for="node in nodes">
    </x-node>
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createHighDPICanvas = require("@jrc03c/create-high-dpi-canvas")
const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const NodeComponent = require("./node")

class NewEdgeHelper {
  endPoint = { x: 0, y: 0 }
  firstJackType = null
  inputJack = null
  isBeingCreated = false
  outputJack = null
  startPoint = { x: 0, y: 0 }
}

module.exports = createVueComponentWithCSS({
  name: "x-graph",
  template,
  emits: ["create-new-edge", "move-node-to-top"],

  components: {
    "x-node": NodeComponent,
  },

  props: {
    "edge-draw-function": {
      type: "function",
      required: false,
      default: () => {
        return (context, p1, p2, isNewEdge) => {
          context.strokeStyle = isNewEdge ? "red" : "black"
          context.beginPath()
          context.moveTo(p1.x, p1.y)
          context.lineTo(p2.x, p2.y)
          context.stroke()
        }
      },
    },

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
      keys: {},
      mouse: { x: 0, y: 0 },
      newEdge: new NewEdgeHelper(),
      rect: { x: 0, y: 0, width: 0, height: 0 },
      resizeObserver: null,
      selectedNodes: [],
      shouldKeepDrawingEdges: true,
      shouldRecomputeRect: false,
    }
  },

  methods: {
    drawEdges() {
      const { canvas } = this
      const { width, height } = canvas
      const context = canvas.getContext("2d")
      context.clearRect(0, 0, width, height)
      context.strokeStyle = "black"
      context.lineWidth = 1

      const offset = this.$el.getBoundingClientRect()

      for (const edge of this.edges) {
        const j1 = this.$el
          .querySelector("#jack-" + edge.inputJack.id)
          .querySelector(".x-jack-hole")

        const j2 = this.$el
          .querySelector("#jack-" + edge.outputJack.id)
          .querySelector(".x-jack-hole")

        const j1Rect = j1.getBoundingClientRect()
        const j2Rect = j2.getBoundingClientRect()

        const p1 = {
          x: Math.round(j1Rect.x + j1Rect.width / 2 - offset.x),
          y: Math.round(j1Rect.y + j1Rect.height / 2 - offset.x),
        }

        const p2 = {
          x: Math.round(j2Rect.x + j2Rect.width / 2 - offset.x),
          y: Math.round(j2Rect.y + j2Rect.height / 2 - offset.x),
        }

        this.edgeDrawFunction(context, p1, p2)
      }

      context.strokeStyle = "red"

      if (this.newEdge.isBeingCreated) {
        const p1 = {
          x: this.newEdge.startPoint.x - offset.x,
          y: this.newEdge.startPoint.y - offset.y,
        }

        const p2 = {
          x: this.mouse.x,
          y: this.mouse.y,
        }

        this.edgeDrawFunction(context, p1, p2, true)
      }
    },

    onJackMouseDown(data) {
      this.newEdge.isBeingCreated = true

      if (data.jack.type === "input") {
        this.newEdge.outputJack = data.jack
        this.newEdge.firstJackType = "input"
      } else {
        this.newEdge.inputJack = data.jack
        this.newEdge.firstJackType = "output"
      }

      this.newEdge.startPoint = {
        x: data.rect.x + data.rect.width / 2,
        y: data.rect.y + data.rect.height / 2,
      }
    },

    onJackMouseEnter(data) {
      if (
        this.newEdge.isBeingCreated &&
        data.jack !== this.newEdge.inputJack &&
        data.jack !== this.newEdge.outputJack
      ) {
        if (this.newEdge.inputJack) {
          this.newEdge.outputJack = data.jack
        } else {
          this.newEdge.inputJack = data.jack
        }
      }
    },

    onJackMouseLeave() {
      if (this.newEdge.firstJackType === "input") {
        this.newEdge.inputJack = null
      } else {
        this.newEdge.outputJack = null
      }
    },

    onKeyDown(event) {
      this.keys[event.key] = true

      if (event.key === "Escape") {
        this.selectedNodes.splice(0, this.selectedNodes.length)
      }
    },

    onKeyUp(event) {
      delete this.keys[event.key]
    },

    onMouseMove(event) {
      let { x, y } = this.rect

      if (this.shouldRecomputeRect) {
        this.updateRect()
        x = this.rect.x
        y = this.rect.y
      }

      this.mouse.x = event.clientX - x
      this.mouse.y = event.clientY - y
    },

    onMouseUp() {
      if (
        this.newEdge.isBeingCreated &&
        this.newEdge.inputJack &&
        this.newEdge.outputJack &&
        !this.edges.find(
          e =>
            e.inputJack === this.newEdge.inputJack &&
            e.outputJack === this.newEdge.outputJack,
        )
      ) {
        const newEdge = {
          outputJack: this.newEdge.outputJack,
          inputJack: this.newEdge.inputJack,
        }

        this.$emit("create-new-edge", newEdge)
      }

      this.newEdge = new NewEdgeHelper()
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
      this.shouldRecomputeRect = true
    },

    selectNode(node) {
      if (!this.keys.Shift) {
        this.selectedNodes = []
      }

      if (!this.selectedNodes.includes(node)) {
        this.selectedNodes.push(node)
      }

      this.$emit("move-node-to-top", node)
    },

    updateRect() {
      this.rect = this.$el.getBoundingClientRect()
      this.shouldRecomputeRect = false
    },
  },

  mounted() {
    this.canvas = createHighDPICanvas(0, 0)
    this.$el.appendChild(this.canvas)
    this.resizeObserver = new ResizeObserver(this.onRootResize)
    this.resizeObserver.observe(this.$el)
    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onKeyUp)
    window.addEventListener("mousemove", this.onMouseMove)
    window.addEventListener("mouseup", this.onMouseUp)

    setTimeout(() => {
      const dpi = window.devicePixelRatio || 1
      const { width, height } = this.$el.getBoundingClientRect()
      this.canvas.width = Math.floor(width * dpi)
      this.canvas.height = Math.floor(height * dpi)
      this.canvas.style.width = `${Math.floor(width)}px`
      this.canvas.style.height = `${Math.floor(height)}px`
    }, 250)

    this.shouldKeepDrawingEdges = true

    const interval = setInterval(() => {
      if (!this.shouldKeepDrawingEdges) {
        return clearInterval(interval)
      }

      this.drawEdges()
    }, 1000 / 60)
  },

  unmounted() {
    this.shouldKeepDrawingEdges = false
    this.resizeObserver.disconnect()
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
    window.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("mouseup", this.onMouseUp)
  },
})
