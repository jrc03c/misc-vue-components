// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .x-context-menu {
    z-index: 999999999;
    background-color: rgb(235, 235, 235);
    position: absolute;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    font-size: 0.75rem;
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

  .x-context-menu .x-context-menu-item:hover,
  .x-context-menu .x-context-menu-item.has-expanded-children {
    background-color: rgb(255, 255, 255);
  }

  .x-context-menu .x-context-menu-item:active {
    background-color: rgb(205, 205, 205);
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
    <div class="x-context-menu-items" ref="itemsContainer">
      <div
        :class="{ 'has-expanded-children': hoveredItemWithChildren === item }"
        :key="item.label"
        @click="select(item)"
        @mouseenter="showChildren($event, item)"
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

    <x-context-menu
      :is-visible="true"
      :items="hoveredItemWithChildren.children"
      :x="hoveredItemWithChildrenX"
      :y="hoveredItemWithChildrenY"
      v-if="hoveredItemWithChildren">
    </x-context-menu>
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
      hoveredItemWithChildren: null,
      hoveredItemWithChildrenX: 0,
      hoveredItemWithChildrenY: 0,
      listenersHaveBeenAdded: false,
    }
  },

  computed: {
    isRoot() {
      return this.getRootContextMenu() === this.$el
    },
  },

  watch: {
    isVisible() {
      if (this.isVisible) {
        this.$emit("open")
      } else {
        this.$emit("close")
        this.hoveredItemWithChildren = null
        this.hoveredItemWithChildrenX = 0
        this.hoveredItemWithChildrenY = 0
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
    addListeners() {
      if (this.isRoot && !this.listenersHaveBeenAdded) {
        window.addEventListener("click", this.onClick)
        window.addEventListener("keydown", this.onKeyDown)
        this.listenersHaveBeenAdded = true
      }
    },

    getRootContextMenu() {
      let current = this.$el
      let root = this.$el

      while (current.parentElement) {
        if (current.parentElement.classList.contains("x-context-menu")) {
          root = current.parentElement
        }

        current = current.parentElement
      }

      return root
    },

    onClick() {
      this.$emit("cancel")
    },

    onKeyDown(event) {
      if (event.key === "Escape") {
        this.$emit("cancel")
      }
    },

    removeListeners() {
      if (this.listenersHaveBeenAdded) {
        window.removeEventListener("click", this.onClick)
        window.removeEventListener("keydown", this.onKeyDown)
        this.listenersHaveBeenAdded = false
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

    showChildren(event, item) {
      if (item.children) {
        this.hoveredItemWithChildren = item

        const rect = this.$refs.itemsContainer.getBoundingClientRect()
        const targetRect = event.target.getBoundingClientRect()
        this.hoveredItemWithChildrenX = rect.width
        this.hoveredItemWithChildrenY = targetRect.y - rect.y
      } else {
        this.hoveredItemWithChildren = null
        this.hoveredItemWithChildrenX = 0
        this.hoveredItemWithChildrenY = 0
      }
    },

    updateComputedStyle() {
      this.computedStyle = `
        left: ${this.x}px;
        top: ${this.y}px;
      `

      this.hoveredItemWithChildren = null
      this.hoveredItemWithChildrenX = 0
      this.hoveredItemWithChildrenY = 0
    },
  },

  mounted() {
    this.addListeners()
    this.updateComputedStyle()
  },

  unmounted() {
    this.removeListeners()
  },
})
