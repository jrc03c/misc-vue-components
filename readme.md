# Intro

This library contains a few Vue components I've found to be useful in various projects.

# Installation

```bash
npm install --save @jrc03c/misc-vue-components
```

# Usage

## Import

**With bundlers:**

```js
const { Draggable, Resizeable } = require("@jrc03c/misc-vue-components")
```

**Without bundlers:**

Add the script to your HTML:

```html
<script src="path/to/dist/misc-vue-components.js"></script>
```

And then in your JS:

```js
const { Draggable, Resizeable } = MiscVueComponents
```

## Add to a Vue app or component

```js
const MyComponent = {
  name: "x-my-component",

  components: {
    "x-draggable": Draggable,
    "x-resizeable": Resizeable,
  },
}
```

# API

## `Draggable`

### Props

#### `is-locked`

(Optional) A boolean indicating whether or not the element is locked to its current position. In other words, if set to `true`, then the element cannot be dragged. The default is `false`.

#### `x`

(Optional) A number representing the x-coordinate in pixels of the top-left corner of the element relative to its closest manually-positioned ancestor (i.e., an ancestor whose "position" CSS property has been given a value like "relative", "absolute", or "fixed"). The default is `0`.

#### `y`

(Optional) A number representing the y-coordinate in pixels of the top-left corner of the element relative to its closest manually-positioned ancestor (i.e., an ancestor whose "position" CSS property has been given a value like "relative", "absolute", or "fixed"). The default is `0`.

### Events

#### `"drag-end"`

Is emitted when the user stops dragging the element. (Is emitted when the user releases their mouse button or lifts their touch from the screen, not merely when the element is stationary.) Is passed a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) representing the bounding box of the element.

#### `drag-start`

Is emitted when a drag is initiated. Is passed a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) representing the bounding box of the element.

#### `"drag"`

Is emitted when the element is dragged. (Note: Movement must occur for this event to be emitted; i.e., it is not emitted while the element is stationary, even if the user has already initiated a drag.) Is passed a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) representing the bounding box of the element.

## `Resizeable`

Note that a `Resizeable` is built on top of a `Draggable`; so almost all of the `Draggable` API also applies to `Resizeable`. Any differences are noted below.

Note also that the "Shift" key can be held down during resizing diagonally to maintain aspect ratio.

### Props

#### `height`

(Optional) A number representing the height in pixels of the element's bounding box. The default is `256`.

#### `is-drag-locked`

Same as the `Draggable` `is-locked` prop (but renamed to remove ambiguity in the context of this component).

#### `is-resize-locked`

(Optional) A boolean indicating whether or not the element is locked to its current size. In other words, if set to `true`, then the element cannot be resized. The default is `false`.

#### `min-height`

(Optional) A number representing the minimum allowable height in pixels of the element's bounding box. The default is `8`.

#### `min-width`

(Optional) A number representing the minimum allowable width in pixels of the element's bounding box. The default is `8`.

#### `width`

(Optional) A number representing the width in pixels of the element's bounding box. The default is `256`.

#### `x`

Same as the `Draggable` `x` prop.

#### `y`

Same as the `Draggable` `y` prop.

### Events

#### `"drag-end"`

Same as the `Draggable` `"drag-end"` event.

#### `"drag-start"`

Same as the `Draggable` `"drag-start"` event.

#### `"drag"`

Same as the `Draggable` `"drag"` event.

#### `"resize-end"`

Is emitted when the user stops resizing the element. (Is emitted when the user releases their mouse button or lifts their touch from the screen, not merely when the mouse or touch is stationary while in the process of resizing.) Is passed a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) representing the bounding box of the element.

#### `"resize-start"`

Is emitted when resizing is initiated. Is passed a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) representing the bounding box of the element.

#### `"resize"`

Is emitted when the element is resized. (Note: Size change must occur for this event to be emitted; i.e., it is not emitted while the element is not changing size, even if the user has already initiated the resizing process.) Is passed a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) representing the bounding box of the element.
