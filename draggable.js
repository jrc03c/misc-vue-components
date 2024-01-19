// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .x-draggable {
    position: absolute;
    left: 0;
    top: 0;
    border: 2px solid rgb(128, 255, 128);
  }

  .x-draggable.has-grab-cursor {
    cursor: grab;
  }

  .x-draggable.has-grab-cursor:active {
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
    :class="{ 'has-grab-cursor': !isLocked }"
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
  emits: ["drag-end", "drag-move", "drag-start"],

  props: {
    "is-locked": {
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
      if (this.isLocked) return
      this.mouse.x = event.screenX
      this.mouse.y = event.screenY
      this.isBeingDragged = true
      this.$emit("drag-start", this.$el.getBoundingClientRect())
    },

    onMouseMove(event) {
      if (this.isLocked) return

      if (this.isBeingDragged) {
        const dx = event.screenX - this.mouse.x
        const dy = event.screenY - this.mouse.y
        this.x_ += dx
        this.y_ += dy
        this.mouse.x = event.screenX
        this.mouse.y = event.screenY
        this.updateComputedStyle()
        this.$emit("drag-move", this.$el.getBoundingClientRect())
      }
    },

    onMouseUp() {
      if (this.isLocked) return
      this.isBeingDragged = false
      this.$emit("drag-end", this.$el.getBoundingClientRect())
    },

    updateComputedStyle() {
      this.$el.style.left = this.x_ + "px"
      this.$el.style.top = this.y_ + "px"
    },
  },

  mounted() {
    this.x_ = this.x
    this.y_ = this.y
    this.updateComputedStyle()
    window.addEventListener("mousemove", this.onMouseMove)
    window.addEventListener("mouseup", this.onMouseUp)
  },

  unmounted() {
    window.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("mouseup", this.onMouseUp)
  },
})
