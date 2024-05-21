// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .x-draggable {
    position: absolute;
    left: 0;
    top: 0;
  }

  .x-draggable.has-grab-cursor {
    cursor: grab;
  }

  .x-draggable.has-grab-cursor.is-being-dragged {
    cursor: grabbing;
  }

  .x-draggable:active,
  .x-draggable:active * {
    user-select: none;
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div
    :class="{
      'has-grab-cursor': !isHLocked || !isVLocked,
      'is-being-dragged': isBeingDragged,
    }"
    @mousedown="onMouseDown"
    class="x-draggable">
    <slot></slot>
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")

module.exports = createVueComponentWithCSS({
  name: "x-draggable",
  template,
  emits: ["drag-end", "drag-start", "drag"],

  props: {
    "is-h-locked": {
      type: Boolean,
      required: false,
      default: () => false,
    },

    "is-v-locked": {
      type: Boolean,
      required: false,
      default: () => false,
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
      css,
      isBeingDragged: false,
      mouse: { x: 0, y: 0 },
      x_: 0,
      y_: 0,
    }
  },

  watch: {
    x() {
      this.x_ = this.x
      this.updateComputedStyle()
    },

    y() {
      this.y_ = this.y
      this.updateComputedStyle()
    },
  },

  methods: {
    onMouseDown(event) {
      event.preventDefault()
      event.stopPropagation()

      if (this.isHLocked && this.isVLocked) {
        return
      }

      if (!this.isHLocked) {
        this.mouse.x = event.screenX
      }

      if (!this.isVLocked) {
        this.mouse.y = event.screenY
      }

      this.isBeingDragged = true
      this.$emit("drag-start", this.$el.getBoundingClientRect())
    },

    onMouseMove(event) {
      if (this.isHLocked && this.isVLocked) {
        return
      }

      if (this.isBeingDragged) {
        const dx = event.screenX - this.mouse.x
        const dy = event.screenY - this.mouse.y

        if (!this.isHLocked) {
          this.x_ += dx
          this.mouse.x = event.screenX
        }

        if (!this.isVLocked) {
          this.y_ += dy
          this.mouse.y = event.screenY
        }

        this.updateComputedStyle()
        this.$emit("drag", this.$el.getBoundingClientRect())
      }
    },

    onMouseUp() {
      if (this.isHLocked && this.isVLocked) {
        return
      }

      const wasBeingDragged = this.isBeingDragged
      this.isBeingDragged = false

      if (wasBeingDragged) {
        this.$emit("drag-end", this.$el.getBoundingClientRect())
      }
    },

    updateComputedStyle(shouldForceUpdate) {
      if (shouldForceUpdate || !this.isHLocked) {
        this.$el.style.left = this.x_ + "px"
      }

      if (shouldForceUpdate || !this.isVLocked) {
        this.$el.style.top = this.y_ + "px"
      }
    },
  },

  mounted() {
    this.x_ = this.x
    this.y_ = this.y
    this.updateComputedStyle(true)
    window.addEventListener("mousemove", this.onMouseMove)
    window.addEventListener("mouseup", this.onMouseUp)
  },

  unmounted() {
    window.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("mouseup", this.onMouseUp)
  },
})
