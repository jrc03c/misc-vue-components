// -----------------------------------------------------------------------------
// CSS
// -----------------------------------------------------------------------------

const css = /* css */ `
  .x-node {
    width: 192px;
    border: 1px solid black;
    background-color: rgb(235, 235, 235);
  }

  .x-node-title-bar {
    padding: 0.5em;
    background-color: rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid black;
  }

  .x-node-body {
    padding: 0.5em;
  }

  .x-node-jacks {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: flex-start;
    align-items: flex-start;
    border-top: 1px solid black;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .x-node-jacks-inputs,
  .x-node-jacks-outputs {
    width: 50%;
  }
`

// -----------------------------------------------------------------------------
// HTML
// -----------------------------------------------------------------------------

const template = /* html */ `
  <x-draggable
    :id="'node-' + id"
    :is-h-locked="isHLocked"
    :is-v-locked="isVLocked"
    :x="x"
    :y="y"
    @drag-end="$emit('drag-end', $event)"
    @drag-start="$emit('drag-start', $event)"
    @drag="$emit('drag', $event)"
    class="x-node">
    <div class="x-node-title-bar">
      <div class="x-node-title">
        {{ title }}
      </div>
    </div>

    <div class="x-node-body">
      This is a node!
      <slot></slot>
    </div>

    <div class="x-node-jacks" v-if="jacks.length > 0">
      <div class="x-node-jacks-inputs">
        <x-jack
          :id="jack.id"
          :key="jack.id"
          :title="jack.title"
          :type="jack.type"
          @jack-hole-mouse-down="
            $emit('jack-mouse-down', { jack, rect: $event })
          "
          @jack-hole-mouse-enter="
            $emit('jack-mouse-enter', { jack, rect: $event })
          "
          @jack-hole-mouse-leave="
            $emit('jack-mouse-leave', { jack, rect: $event })
          "
          v-for="jack in inputJacks">
        </x-jack>
      </div>

      <div class="x-node-jacks-outputs">
        <x-jack
          :id="jack.id"
          :key="jack.id"
          :title="jack.title"
          :type="jack.type"
          @jack-hole-mouse-down="
            $emit('jack-mouse-down', { jack, rect: $event })
          "
          @jack-hole-mouse-enter="
            $emit('jack-mouse-enter', { jack, rect: $event })
          "
          @jack-hole-mouse-leave="
            $emit('jack-mouse-leave', { jack, rect: $event })
          "
          v-for="jack in outputJacks">
        </x-jack>
      </div>
    </div>
  </x-draggable>
`

// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

const createVueComponentWithCSS = require("@jrc03c/vue-component-with-css")
const DraggableComponent = require("../draggable")
const JackComponent = require("./jack")
const makeKey = require("@jrc03c/make-key")

module.exports = createVueComponentWithCSS({
  name: "x-node",
  template,

  emits: [
    ...DraggableComponent.emits,
    "jack-mouse-down",
    "jack-mouse-enter",
    "jack-mouse-leave",
  ],

  components: {
    "x-draggable": DraggableComponent,
    "x-jack": JackComponent,
  },

  props: {
    ...DraggableComponent.props,

    id: {
      type: String,
      required: false,
      default: () => makeKey(8),
    },

    jacks: {
      type: Array,
      required: false,
      default: () => [],
    },

    title: {
      type: String,
      required: false,
      default: () => "Node",
    },
  },

  data() {
    return {
      css,
    }
  },

  computed: {
    inputJacks() {
      return this.jacks.filter(jack => jack.type === "input")
    },

    outputJacks() {
      return this.jacks.filter(jack => jack.type === "output")
    },
  },
})
