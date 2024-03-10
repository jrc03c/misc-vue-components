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

  .x-frame .user-select-none,
  .x-frame .user-select-none * {
    user-select: none !important;
  }

  .x-frame-horizontal {
    flex-direction: row;
  }

  .x-frame-horizontal > * {
    overflow-x: hidden;
  }

  .x-frame-vertical {
    flex-direction: column;
  }

  .x-frame-vertical > * {
    overflow-y: hidden;
  }

  .x-frame-horizontal .x-frame-divider {
    cursor: col-resize;
    width: 2px;
    height: 100%;
    background-color: red;
  }

  .x-frame-vertical .x-frame-divider {
    cursor: row-resize;
    width: 100%;
    height: 2px;
    background-color: red;
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div
    :class="{
      'user-select-none': isBeingResized,
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

    orientation: {
      type: String,
      required: false,
      default: () => "horizontal",
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
    }
  },

  methods: {
    onMouseDown(event, dividerIndex) {
      this.isBeingResized = true
      this.activeDividerIndex = dividerIndex
      this.mouse.x = event.pageX
      this.mouse.y = event.pageY
      this.$emit("resize-start")
    },

    onMouseMove(event) {
      if (!this.isBeingResized) return

      if (this.orientation === "horizontal") {
        const dx = event.pageX - this.mouse.x

        const children = Array.from(this.$el.children).filter(
          child => !child.classList.contains("x-frame-divider"),
        )

        const child1 = children[this.activeDividerIndex]
        const child2 = children[this.activeDividerIndex + 1]

        const child1Rect = child1.getBoundingClientRect()
        const child2Rect = child2.getBoundingClientRect()

        child1.style.width = `${child1Rect.width + dx}px`
        child2.style.width = `${child2Rect.width - dx}px`

        this.mouse.x = event.pageX
      } else {
        // ...
      }

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
        this.isAddingDividers = false
      })
    },
  },

  mounted() {
    this.observer = new MutationObserver(this.onMutation)
    this.observer.observe(this.$el, { childList: true })
    this.onMutation()
    window.addEventListener("mousemove", this.onMouseMove)
    window.addEventListener("mouseup", this.onMouseUp)
  },

  unmounted() {
    this.observer.disconnect()
    window.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("mouseup", this.onMouseUp)
  },
})
