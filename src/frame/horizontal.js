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

  .x-frame-horizontal .x-frame-divider {
    cursor: col-resize;
    width: 16px;
    height: 100%;
    margin-left: -7px;
    margin-right: -7px;
  }

  .x-frame-horizontal .x-frame-divider .x-frame-divider-inner {
    background-color: gray;
    width: 2px;
    height: 100%;
    margin: 0 auto;
  }

  .x-frame.is-locked .x-frame-divider {
    cursor: unset;
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div
    :class="{
      'is-being-resized': isBeingResized,
      'is-locked': isLocked,
    }"
    class="x-frame x-frame-horizontal">
    <slot></slot>
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")

function sum(x) {
  let s = 0
  x.forEach(v => (s += v))
  return s
}

module.exports = createVueComponentWithCSS({
  name: "x-frame-horizontal",
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
  },

  data() {
    return {
      activeDividerIndex: 0,
      css,
      isAddingDividers: false,
      isBeingResized: false,
      mouse: { x: 0 },
      observer: null,
      widths: [],
    }
  },

  methods: {
    onMouseDown(event, dividerIndex) {
      if (this.isLocked) return
      this.isBeingResized = true
      this.activeDividerIndex = dividerIndex

      const nonDividers = Array.from(this.$el.children).filter(
        child => !child.classList.contains("x-frame-divider"),
      )

      const left = nonDividers[this.activeDividerIndex]
      const right = nonDividers[this.activeDividerIndex + 1]

      this.$emit("resize-start", [left, right])
    },

    onMouseMove(event) {
      let left, right

      if (!this.isLocked && this.isBeingResized) {
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
        left = child1
        right = child2

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
          const delta = this.widths[this.activeDividerIndex + 1] - this.minWidth

          this.widths[this.activeDividerIndex + 1] -= delta
          this.widths[this.activeDividerIndex] += delta
        }

        if (this.widths[this.activeDividerIndex + 1] > this.maxWidth) {
          const delta = this.widths[this.activeDividerIndex + 1] - this.maxWidth

          this.widths[this.activeDividerIndex + 1] -= delta
          this.widths[this.activeDividerIndex] += delta
        }

        this.updateStyles()
      }

      this.mouse.x = event.pageX

      if (!this.isLocked) {
        this.$emit("resize", [left, right])
      }
    },

    onMouseUp() {
      if (this.isLocked) return
      const wasBeingResized = this.isBeingResized
      this.isBeingResized = false

      if (wasBeingResized) {
        const nonDividers = Array.from(this.$el.children).filter(
          child => !child.classList.contains("x-frame-divider"),
        )

        const left = nonDividers[this.activeDividerIndex]
        const right = nonDividers[this.activeDividerIndex + 1]

        this.$emit("resize-end", [left, right])
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

          const dividerInner = document.createElement("div")
          dividerInner.classList.add("x-frame-divider-inner")
          divider.appendChild(dividerInner)

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
      this.onMutation()

      this.widths = Array.from(this.$el.children)
        .filter(child => !child.classList.contains("x-frame-divider"))
        .map(child => child.getBoundingClientRect().width)

      this.updateStyles()
    })
  },

  unmounted() {
    this.observer.disconnect()
    window.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("mouseup", this.onMouseUp)
  },
})
