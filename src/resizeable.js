// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .no-pointer-events,
  .no-pointer-events * {
    pointer-events: none;
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <x-draggable
    :class="{ 'no-pointer-events': shouldPreventInternalPointerEvents }"
    :is-locked="isDragLocked"
    :x="x_"
    :y="y_"
    @drag-end="onDragEnd"
    @drag-move="$emit('drag-move', $event)"
    @drag-start="$emit('drag-start', $event)"
    class="x-resizeable"
    ref="root">
    <slot></slot>
  </x-draggable>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const DraggableComponent = require("./draggable")

module.exports = createVueComponentWithCSS({
  name: "x-resizeable",
  template,

  emits: [
    "drag-end",
    "drag-move",
    "drag-start",
    "resize-end",
    "resize-start",
    "resize",
  ],

  components: {
    "x-draggable": DraggableComponent,
  },

  props: {
    height: {
      type: Number,
      required: false,
      default: () => 256,
    },

    "is-drag-locked": {
      type: Boolean,
      required: false,
      default: () => false,
    },

    "is-resize-locked": {
      type: Boolean,
      required: false,
      default: () => false,
    },

    "min-height": {
      type: Number,
      required: false,
      default: () => 8,
    },

    "min-width": {
      type: Number,
      required: false,
      default: () => 8,
    },

    width: {
      type: Number,
      required: false,
      default: () => 256,
    },

    x: {
      type: Number,
      required: false,
      default: () => 0,
    },

    y: {
      type: Number,
      required: false,
      default: () => 0,
    },
  },

  data() {
    return {
      anchoredLeftRightBorder: null,
      anchoredTopBottomBorder: null,
      borderWidth: 10,
      css,
      height_: 0,
      isBeingResizedHorizontally: false,
      isBeingResizedVertically: false,
      isHoveringOverBottomBorder: false,
      isHoveringOverLeftBorder: false,
      isHoveringOverRightBorder: false,
      isHoveringOverTopBorder: false,
      mouse: { x: 0, y: 0 },
      shouldPreventInternalPointerEvents: false,
      shouldScaleProportionally: false,
      width_: 0,
      x_: 0,
      y_: 0,
    }
  },

  watch: {
    height() {
      this.height_ = this.height
      this.updateComputedStyle()
    },

    width() {
      this.width_ = this.width
      this.updateComputedStyle()
    },

    x() {
      this.x_ = this.x
    },

    y() {
      this.y_ = this.y
    },
  },

  methods: {
    onDragEnd(rect) {
      const parentRect = this.$el.parentElement.getBoundingClientRect()

      const leftBorderWidth = parseFloat(
        getComputedStyle(this.$el.parentElement)
          .getPropertyValue("border-left")
          .split("px")[0],
      )

      const topBorderWidth = parseFloat(
        getComputedStyle(this.$el.parentElement)
          .getPropertyValue("border-top")
          .split("px")[0],
      )

      this.x_ = rect.x - parentRect.x - leftBorderWidth
      this.y_ = rect.y - parentRect.y - topBorderWidth
      this.$emit("drag-end", rect)
    },

    onKeyDown(event) {
      if (this.isResizeLocked) return

      if (event.key === "Shift") {
        this.shouldScaleProportionally = true
      }
    },

    onKeyUp(event) {
      if (this.isResizeLocked) return

      if (event.key === "Shift") {
        this.shouldScaleProportionally = false
      }
    },

    onMouseDown(event) {
      if (this.isResizeLocked) return

      let shouldCancelEvent = false

      if (this.isHoveringOverLeftBorder) {
        this.isBeingResizedHorizontally = true
        this.anchoredLeftRightBorder = "right"
        shouldCancelEvent = true
      }

      if (this.isHoveringOverRightBorder) {
        this.isBeingResizedHorizontally = true
        this.anchoredLeftRightBorder = "left"
        shouldCancelEvent = true
      }

      if (this.isHoveringOverTopBorder) {
        this.isBeingResizedVertically = true
        this.anchoredTopBottomBorder = "bottom"
        shouldCancelEvent = true
      }

      if (this.isHoveringOverBottomBorder) {
        this.isBeingResizedVertically = true
        this.anchoredTopBottomBorder = "top"
        shouldCancelEvent = true
      }

      if (shouldCancelEvent) {
        event.preventDefault()
        event.stopPropagation()
      }

      if (this.isBeingResizedHorizontally || this.isBeingResizedVertically) {
        this.$emit("resize-start", this.$el.getBoundingClientRect())
      }
    },

    onMouseMove(event) {
      if (this.isResizeLocked) return

      if (this.isBeingResizedHorizontally || this.isBeingResizedVertically) {
        const aspect = this.width_ / this.height_
        let mx = event.movementX
        let my = event.movementY

        if (
          this.shouldScaleProportionally &&
          this.isBeingResizedHorizontally &&
          this.isBeingResizedVertically
        ) {
          const isPrimarilyHorizontal = Math.abs(mx) > Math.abs(my)

          if (this.anchoredLeftRightBorder === "left") {
            if (this.anchoredTopBottomBorder === "top") {
              if (isPrimarilyHorizontal) {
                this.width_ += mx
                this.height_ = this.width_ / aspect
              } else {
                this.height_ += my
                this.width_ = this.height_ * aspect
              }

              if (this.width_ < this.minWidth) {
                this.width_ = this.minWidth
                this.height_ = this.width_ / aspect
              }

              if (this.height_ < this.minHeight) {
                this.height_ = this.minHeight
                this.width_ = this.height_ * aspect
              }
            } else {
              if (isPrimarilyHorizontal) {
                this.width_ += mx
                this.height_ = this.width_ / aspect
                this.y_ -= mx / aspect
              } else {
                this.height_ -= my
                this.y_ += my
                this.width_ = this.height_ * aspect
              }

              if (this.width_ < this.minWidth) {
                const dx = this.minWidth - this.width_
                this.width_ = this.minWidth
                this.height_ = this.width_ / aspect
                this.y_ -= dx / aspect
              }

              if (this.height_ < this.minHeight) {
                const dy = this.minHeight - this.height_
                this.height_ = this.minHeight
                this.y_ -= dy
                this.width_ = this.height_ * aspect
              }
            }
          } else {
            if (this.anchoredTopBottomBorder === "top") {
              if (isPrimarilyHorizontal) {
                this.width_ -= mx
                this.x_ += mx
                this.height_ = this.width_ / aspect
              } else {
                this.height_ += my
                this.width_ = this.height_ * aspect
                this.x_ -= my * aspect
              }

              if (this.width_ < this.minWidth) {
                const dx = this.minWidth - this.width_
                this.width_ = this.minWidth
                this.x_ -= dx
                this.height_ = this.width_ / aspect
              }

              if (this.height_ < this.minHeight) {
                const dy = this.minHeight - this.height_
                this.height_ = this.minHeight
                this.width_ = this.height_ * aspect
                this.x_ -= dy * aspect
              }
            } else {
              if (isPrimarilyHorizontal) {
                this.width_ -= mx
                this.x_ += mx
                this.height_ = this.width_ / aspect
                this.y_ += mx / aspect
              } else {
                this.height_ -= my
                this.y_ += my
                this.width_ = this.height_ * aspect
                this.x_ += my * aspect
              }

              if (this.width_ < this.minWidth) {
                const dx = this.minWidth - this.width_
                this.width_ = this.minWidth
                this.x_ -= dx
                this.height_ = this.width_ / aspect
                this.y_ -= dx / aspect
              }

              if (this.height_ < this.minHeight) {
                const dy = this.minHeight - this.height_
                this.height_ = this.minHeight
                this.y_ -= dy
                this.width_ = this.height_ * aspect
                this.x_ -= dy * aspect
              }
            }
          }
        } else {
          if (this.isBeingResizedHorizontally) {
            if (this.anchoredLeftRightBorder === "left") {
              this.width_ += mx
              this.width_ = Math.max(this.width_, this.minWidth)
            } else {
              this.width_ -= mx
              this.x_ += mx

              if (this.width_ < this.minWidth) {
                const dx = this.minWidth - this.width_
                this.width_ += dx
                this.x_ -= dx
              }
            }
          }

          if (this.isBeingResizedVertically) {
            if (this.anchoredTopBottomBorder === "top") {
              this.height_ += my
              this.height_ = Math.max(this.height_, this.minHeight)
            } else {
              this.height_ -= my
              this.y_ += my

              if (this.height_ < this.minHeight) {
                const dy = this.minHeight - this.height_
                this.height_ += dy
                this.y_ -= dy
              }
            }
          }
        }

        this.updateComputedStyle()
        event.preventDefault()
        event.stopPropagation()
        this.$emit("resize", this.$el.getBoundingClientRect())
      } else {
        this.isHoveringOverLeftBorder = false
        this.isHoveringOverRightBorder = false
        this.isHoveringOverTopBorder = false
        this.isHoveringOverBottomBorder = false
        this.shouldPreventInternalPointerEvents = false

        const rect = this.$el.getBoundingClientRect()
        const left = rect.x
        const right = rect.x + rect.width
        const top = rect.y
        const bottom = rect.y + rect.height
        let shouldCancelEvent = false

        if (
          Math.abs(event.clientX - left) < this.borderWidth &&
          event.clientY >= top - this.borderWidth &&
          event.clientY <= bottom + this.borderWidth
        ) {
          this.isHoveringOverLeftBorder = true
          this.shouldPreventInternalPointerEvents = true
          shouldCancelEvent = true
        }

        if (
          Math.abs(event.clientX - right) < this.borderWidth &&
          event.clientY >= top - this.borderWidth &&
          event.clientY <= bottom + this.borderWidth
        ) {
          this.isHoveringOverRightBorder = true
          this.shouldPreventInternalPointerEvents = true
          shouldCancelEvent = true
        }

        if (
          Math.abs(event.clientY - top) < this.borderWidth &&
          event.clientX >= left - this.borderWidth &&
          event.clientX <= right + this.borderWidth
        ) {
          this.isHoveringOverTopBorder = true
          this.shouldPreventInternalPointerEvents = true
          shouldCancelEvent = true
        }

        if (
          Math.abs(event.clientY - bottom) < this.borderWidth &&
          event.clientX >= left - this.borderWidth &&
          event.clientX <= right + this.borderWidth
        ) {
          this.isHoveringOverBottomBorder = true
          this.shouldPreventInternalPointerEvents = true
          shouldCancelEvent = true
        }

        if (shouldCancelEvent) {
          event.preventDefault()
          event.stopPropagation()
        }

        this.updateComputedStyle()
      }
    },

    onMouseUp() {
      if (this.isResizeLocked) return

      const wasBeingResized =
        this.isBeingResizedHorizontally || this.isBeingResizedVertically

      this.isBeingResizedHorizontally = false
      this.isBeingResizedVertically = false
      this.isHoveringOverBorder = false

      if (wasBeingResized) {
        this.$emit("resize-end", this.$el.getBoundingClientRect())
      }
    },

    updateComputedStyle() {
      document.body.style.cursor = "unset"

      if (this.isHoveringOverLeftBorder || this.isHoveringOverRightBorder) {
        document.body.style.cursor = "ew-resize"
      }

      if (this.isHoveringOverTopBorder || this.isHoveringOverBottomBorder) {
        document.body.style.cursor = "ns-resize"
      }

      if (this.isHoveringOverLeftBorder && this.isHoveringOverTopBorder) {
        document.body.style.cursor = "nwse-resize"
      }

      if (this.isHoveringOverLeftBorder && this.isHoveringOverBottomBorder) {
        document.body.style.cursor = "nesw-resize"
      }

      if (this.isHoveringOverRightBorder && this.isHoveringOverTopBorder) {
        document.body.style.cursor = "nesw-resize"
      }

      if (this.isHoveringOverRightBorder && this.isHoveringOverBottomBorder) {
        document.body.style.cursor = "nwse-resize"
      }

      this.$el.style.width = this.width_ + "px"
      this.$el.style.minWidth = this.width_ + "px"
      this.$el.style.maxWidth = this.width_ + "px"
      this.$el.style.height = this.height_ + "px"
      this.$el.style.minHeight = this.height_ + "px"
      this.$el.style.maxHeight = this.height_ + "px"
    },
  },

  mounted() {
    this.x_ = this.x
    this.y_ = this.y
    this.width_ = this.width
    this.height_ = this.height
    this.updateComputedStyle()
    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onKeyUp)
    window.addEventListener("mousedown", this.onMouseDown)
    window.addEventListener("mousemove", this.onMouseMove)
    window.addEventListener("mouseup", this.onMouseUp)
  },

  unmounted() {
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
    window.removeEventListener("mousedown", this.onMouseDown)
    window.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("mouseup", this.onMouseUp)
  },
})
