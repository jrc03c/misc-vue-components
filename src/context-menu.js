// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .x-context-menu {
    z-index: 999999999;
    background-color: rgb(235, 235, 235);
    position: fixed;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .x-context-menu .x-context-menu-item {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: flex-start;
    align-items: flex-start;
    gap: 1rem;
    cursor: pointer;
    padding: 0.5rem;
    user-select: none;
  }

  .x-context-menu .x-context-menu-item:hover {
    background-color: rgb(245, 245, 245);
  }

  .x-context-menu .x-context-menu-item:active {
    background-color: rgb(215, 215, 215);
  }

  .x-context-menu .context-menu-item-label  {
    width: 100%;
    flex-shrink: 999999;
  }

  .x-context-menu .x-context-menu-item-label-expand-arrow::after {
    content: "❯";
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <div
    :style="computedStyle"
    @click.stop.prevent="() => {}"
    class="x-context-menu"
    v-if="isVisible">
    <div
      :key="item.label"
      @click="select(item)"
      @mouseenter="showChildren(item)"
      @mouseleave="hideChildren(item)"
      class="x-context-menu-item"
      v-for="item in items">
      <span class="x-context-menu-item-label">
        {{ item.label }}
      </span>

      <span
        class="x-context-menu-item-label-expand-arrow"
        v-if="item.children">
      </span>
    </div>
  </div>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")

module.exports = createVueComponentWithCSS({
  name: "x-context-menu",
  template,
  emits: ["cancel", "close", "open", "select"],

  props: {
    "is-visible": {
      type: Boolean,
      required: true,
      default: () => false,
    },

    // `items` should be an array of objects, where each object has these
    // properties:
    // - label (string, required)
    // - action (function, required if !children)
    // - children (array of objects like this, required if !action)
    items: {
      type: Array,
      required: true,
      default: () => [],
    },

    x: {
      type: Number,
      required: true,
      default: () => 0,
    },

    y: {
      type: Number,
      required: true,
      default: () => 0,
    },
  },

  data() {
    return {
      computedStyle: "",
      css,
      visibleChildren: {},
    }
  },

  watch: {
    isVisible() {
      if (this.isVisible) {
        this.$emit("open")
      } else {
        this.$emit("close")
      }
    },

    x() {
      this.updateComputedStyle()
    },

    y() {
      this.updateComputedStyle()
    },
  },

  methods: {
    hideChildren(item) {
      this.visibleChildren[item.label] = false
    },

    onClick() {
      this.$emit("cancel")
    },

    onKeyDown(event) {
      if (event.key === "Escape") {
        this.$emit("cancel")
      }
    },

    select(item) {
      if (item.children) {
        return
      }

      if (item.action) {
        item.action()
      }

      this.$emit("select", item)
    },

    showChildren(item) {
      this.visibleChildren[item.label] = true
    },

    updateComputedStyle() {
      this.computedStyle = `
        left: ${this.x}px;
        top: ${this.y}px;
      `
    },
  },

  mounted() {
    window.addEventListener("click", this.onClick)
    window.addEventListener("keydown", this.onKeyDown)
  },

  unmounted() {
    window.removeEventListener("click", this.onClick)
    window.removeEventListener("keydown", this.onKeyDown)
  },
})
