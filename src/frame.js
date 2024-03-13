// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .x-frame {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-content: stretch;
    align-items: stretch;
    gap: 0;
  }

  .x-frame > *:not(.x-frame-divider) {
    box-sizing: border-box !important;
  }

  .x-frame.is-being-resized,
  .x-frame.is-being-resized * {
    user-select: none !important;
  }

  .x-frame-horizontal {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .x-frame-horizontal > *:not(.x-frame-divider) {
    overflow-x: hidden;
    width: 100%;
    flex-shrink: 999999;
  }

  .x-frame-vertical {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .x-frame-vertical > *:not(.x-frame-divider) {
    overflow-y: hidden;
    width: 100%;
    flex-shrink: 999999;
  }

  .x-frame-horizontal .x-frame-divider {
    cursor: col-resize;
    width: 16px;
    height: 100%;
    background-color: red;
  }

  .x-frame-vertical .x-frame-divider {
    cursor: row-resize;
    width: 100%;
    height: 16px;
    background-color: red;
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div
    :class="{
      'is-being-resized': isBeingResized,
      'x-frame-horizontal': orientation === 'horizontal',
      'x-frame-vertical': orientation === 'vertical'
    }"
    class="x-frame">
    <slot></slot>
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")

function clamp(x, a, b) {
  return x < a ? a : x > b ? b : x
}

function sum(x) {
  let s = 0
  x.forEach(v => (s += v))
  return s
}

function remap(x, a, b, c, d) {
  return ((d - c) * (x - a)) / (b - a) + c
}

module.exports = createVueComponentWithCSS({
  name: "x-frame",
  template,
  emits: ["resize", "resize-end", "resize-start"],

  props: {
    "is-locked": {
      type: Boolean,
      required: false,
      default: () => false,
    },

    "max-width": {
      type: Number,
      required: false,
      default: () => Infinity,
    },

    "min-width": {
      type: Number,
      required: false,
      default: () => 64,
    },

    orientation: {
      type: String,
      required: false,
      default: () => "horizontal",
    },

    "start-sizes": {
      type: Array,
      required: false,
      default: () => null,
    },
  },

  data() {
    return {
      activeDividerIndex: 0,
      css,
      isAddingDividers: false,
      isBeingResized: false,
      mouse: {
        x: 0,
        y: 0,
      },
      observer: null,
      widths: [],
    }
  },

  methods: {
    onMouseDown(event, dividerIndex) {
      this.isBeingResized = true
      this.activeDividerIndex = dividerIndex
      this.$emit("resize-start")
    },

    onMouseMove(event) {
      if (this.isBeingResized) {
        if (this.orientation === "horizontal") {
          const dx = event.pageX - this.mouse.x

          const dividers = []
          const nonDividers = []

          Array.from(this.$el.children).forEach(child => {
            if (child.classList.contains("x-frame-divider")) {
              dividers.push(child)
            } else {
              nonDividers.push(child)
            }
          })

          const child1 = nonDividers[this.activeDividerIndex]
          const child2 = nonDividers[this.activeDividerIndex + 1]

          const child1Rect = child1.getBoundingClientRect()
          const child2Rect = child2.getBoundingClientRect()

          this.widths[this.activeDividerIndex] = child1Rect.width + dx
          this.widths[this.activeDividerIndex + 1] = child2Rect.width - dx

          if (this.widths[this.activeDividerIndex] < this.minWidth) {
            const delta = this.widths[this.activeDividerIndex] - this.minWidth
            this.widths[this.activeDividerIndex] -= delta
            this.widths[this.activeDividerIndex + 1] += delta
          }

          if (this.widths[this.activeDividerIndex] > this.maxWidth) {
            const delta = this.widths[this.activeDividerIndex] - this.maxWidth
            this.widths[this.activeDividerIndex] -= delta
            this.widths[this.activeDividerIndex + 1] += delta
          }

          if (this.widths[this.activeDividerIndex + 1] < this.minWidth) {
            const delta =
              this.widths[this.activeDividerIndex + 1] - this.minWidth

            this.widths[this.activeDividerIndex + 1] -= delta
            this.widths[this.activeDividerIndex] += delta
          }

          if (this.widths[this.activeDividerIndex + 1] > this.maxWidth) {
            const delta =
              this.widths[this.activeDividerIndex + 1] - this.maxWidth

            this.widths[this.activeDividerIndex + 1] -= delta
            this.widths[this.activeDividerIndex] += delta
          }

          this.updateStyles()
        } else {
          // ...
        }
      }

      this.mouse.x = event.pageX
      this.mouse.y = event.pageY
      this.$emit("resize")
    },

    onMouseUp() {
      const wasBeingResized = this.isBeingResized
      this.isBeingResized = false

      if (wasBeingResized) {
        this.$emit("resize-end")
      }
    },

    onMutation() {
      if (this.isAddingDividers) return
      this.isAddingDividers = true

      Array.from(this.$el.children).forEach(child => {
        if (child.classList.contains("x-frame-divider")) {
          this.$el.removeChild(child)
        }
      })

      Array.from(this.$el.children)
        .slice(1)
        .forEach((child, i) => {
          const divider = document.createElement("div")
          divider.classList.add("x-frame-divider")
          this.$el.insertBefore(divider, child)

          divider.addEventListener("mousedown", event => {
            this.onMouseDown(event, i)
          })
        })

      this.$nextTick(() => {
        this.updateStyles()
        this.isAddingDividers = false
      })
    },

    updateStyles() {
      const parentRect = this.$el.getBoundingClientRect()
      const dividers = []
      const nonDividers = []

      Array.from(this.$el.children).forEach(child => {
        if (child.classList.contains("x-frame-divider")) {
          dividers.push(child)
        } else {
          nonDividers.push(child)
        }
      })

      const parentWidth =
        parentRect.width -
        sum(dividers.map(d => d.getBoundingClientRect().width))

      nonDividers.forEach((child, i) => {
        const width = this.widths[i] || parentWidth / nonDividers.length
        this.widths[i] = width
        child.style.width = `${width}px`
      })
    },
  },

  mounted() {
    this.observer = new MutationObserver(this.onMutation)
    this.observer.observe(this.$el, { childList: true })
    window.addEventListener("mousemove", this.onMouseMove)
    window.addEventListener("mouseup", this.onMouseUp)

    this.$nextTick(() => {
      if (this.startSizes) {
        const parentRect = this.$el.getBoundingClientRect()
        const startSizesArePercents = sum(this.startSizes) <= 1

        this.widths = this.startSizes.map(v => {
          if (startSizesArePercents) {
            return (
              v *
              (this.orientation === "horizontal"
                ? parentRect.width
                : parentRect.height)
            )
          } else {
            return v
          }
        })
      }

      this.onMutation()
    })

    const canvas = document.createElement("canvas")

    canvas.style = /* css */ `
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      height: 10vh;
    `

    const width = window.innerWidth
    const height = 0.1 * window.innerHeight
    canvas.width = width
    canvas.height = height
    document.body.appendChild(canvas)

    const context = canvas.getContext("2d")

    const loop = () => {
      context.clearRect(0, 0, width, height)

      const a = 360 / this.widths.length
      let x = 0
      const parentRect = this.$el.getBoundingClientRect()
      const parentWidth = parentRect.width

      this.widths.forEach((w, i) => {
        const tempWidth = remap(w, 0, parentWidth, 0, width)
        context.fillStyle = `hsl(${i * a}, 100%, 50%)`
        context.fillRect(x, 0, tempWidth, height)
        x += tempWidth
      })

      window.requestAnimationFrame(loop)
    }

    loop()
  },

  unmounted() {
    this.observer.disconnect()
    window.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("mouseup", this.onMouseUp)
  },
})
