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

  .x-frame-vertical {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .x-frame-vertical > *:not(.x-frame-divider) {
    overflow-y: hidden;
    height: 100%;
    flex-shrink: 999999;
  }

  .x-frame-vertical .x-frame-divider {
    cursor: row-resize;
    width: 100%;
    height: 16px;
    margin-top: -7px;
    margin-bottom: -7px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: center;
    align-items: center;
  }

  .x-frame-vertical .x-frame-divider .x-frame-divider-inner {
    background-color: gray;
    width: 100%;
    height: 2px;
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
    class="x-frame x-frame-vertical">
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
  name: "x-frame-vertical",
  template,
  emits: ["resize", "resize-end", "resize-start"],

  props: {
    "is-locked": {
      type: Boolean,
      required: false,
      default: () => false,
    },

    "max-height": {
      type: Number,
      required: false,
      default: () => Infinity,
    },

    "min-height": {
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
      mouse: { y: 0 },
      observer: null,
      heights: [],
    }
  },

  methods: {
    onMouseDown(event, dividerIndex) {
      if (this.isLocked) return
      this.isBeingResized = true
      this.activeDividerIndex = dividerIndex
      this.$emit("resize-start")
    },

    onMouseMove(event) {
      if (!this.isLocked && this.isBeingResized) {
        const dy = event.pageY - this.mouse.y

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

        this.heights[this.activeDividerIndex] = child1Rect.height + dy
        this.heights[this.activeDividerIndex + 1] = child2Rect.height - dy

        if (this.heights[this.activeDividerIndex] < this.minHeight) {
          const delta = this.heights[this.activeDividerIndex] - this.minHeight
          this.heights[this.activeDividerIndex] -= delta
          this.heights[this.activeDividerIndex + 1] += delta
        }

        if (this.heights[this.activeDividerIndex] > this.maxHeight) {
          const delta = this.heights[this.activeDividerIndex] - this.maxHeight
          this.heights[this.activeDividerIndex] -= delta
          this.heights[this.activeDividerIndex + 1] += delta
        }

        if (this.heights[this.activeDividerIndex + 1] < this.minHeight) {
          const delta =
            this.heights[this.activeDividerIndex + 1] - this.minHeight

          this.heights[this.activeDividerIndex + 1] -= delta
          this.heights[this.activeDividerIndex] += delta
        }

        if (this.heights[this.activeDividerIndex + 1] > this.maxHeight) {
          const delta =
            this.heights[this.activeDividerIndex + 1] - this.maxHeight

          this.heights[this.activeDividerIndex + 1] -= delta
          this.heights[this.activeDividerIndex] += delta
        }

        this.updateStyles()
      }

      this.mouse.y = event.pageY

      if (!this.isLocked) {
        this.$emit("resize")
      }
    },

    onMouseUp() {
      if (this.isLocked) return
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

      const parentHeight =
        parentRect.height -
        sum(dividers.map(d => d.getBoundingClientRect().height))

      nonDividers.forEach((child, i) => {
        const height = this.heights[i] || parentHeight / nonDividers.length
        this.heights[i] = height
        child.style.height = `${height}px`
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

      this.heights = Array.from(this.$el.children)
        .filter(child => !child.classList.contains("x-frame-divider"))
        .map(child => child.getBoundingClientRect().height)

      this.updateStyles()
    })
  },

  unmounted() {
    this.observer.disconnect()
    window.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("mouseup", this.onMouseUp)
  },
})
