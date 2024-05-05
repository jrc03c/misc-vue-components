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
const {
  ContextMenu,
  Draggable,
  Frame,
  Resizeable,
} = require("@jrc03c/misc-vue-components")
```

**Without bundlers:**

Add the script to your HTML:

```html
<script src="path/to/dist/misc-vue-components.js"></script>
```

And then in your JS:

```js
const { ContextMenu, Draggable, Frame, Resizeable } = MiscVueComponents
```

## Add to a Vue app or component

```js
const MyComponent = {
  name: "x-my-component",

  components: {
    "x-context-menu": ContextMenu,
    "x-draggable": Draggable,
    "x-frame": Frame,
    "x-resizeable": Resizeable,
  },
}
```

# API

## `ContextMenu`

![](https://i.ibb.co/nwTX61v/context-menu.gif)

### Props

#### `is-visible`

(Required) A boolean indicating whether or not the menu should be visible.

#### `items`

(Required) An array of objects, each of which has the following properties:

- `"label"` = the text label of the context menu item (e.g., "Copy", "Paste", "Undo", etc.)
- `"action"` = a callback function to be called when the context menu item is selected; this value is required if `"children"` is not defined
- `"children"` = an array of menu items with this same interface; required if `"action"` is not defined

#### `x`

(Required) A number representing the x-coordinate in pixels of the top-left corner of the context menu; note that this only applies to the "root" menu; descendant menus are dynamically placed relative to viewport edges

#### `y`

(Required) A number representing the y-coordinate in pixels of the top-left corner of the context menu; note that this only applies to the "root" menu; descendant menus are dynamically placed relative to viewport edges

### Events

#### `"cancel"`

Is emitted when the user does not select a menu item and indicates that they want the menu to close.

#### `"close"`

Is emitted when the menu closes.

#### `"open"`

Is emitted when the menu opens (i.e., when it becomes visible).

#### `"select"`

Is emitted when a particular menu item has been selected. The particular menu item that was selected will be passed to event handlers.

## `Draggable`

![](https://i.ibb.co/94Vyy11/draggable.gif)

### Props

#### `is-h-locked`

(Optional) A boolean indicating whether or not the element is locked to its current horizontal position. In other words, if set to `true`, then the element cannot be dragged left or right. The default is `false`.

#### `is-v-locked`

(Optional) A boolean indicating whether or not the element is locked to its current vertical position. In other words, if set to `true`, then the element cannot be dragged up or down. The default is `false`.

#### `x`

(Optional) A number representing the x-coordinate in pixels of the top-left corner of the element relative to its closest manually-positioned ancestor (i.e., an ancestor whose "position" CSS property has been given a value like "relative", "absolute", or "fixed"). The default is `0`.

#### `y`

(Optional) A number representing the y-coordinate in pixels of the top-left corner of the element relative to its closest manually-positioned ancestor (i.e., an ancestor whose "position" CSS property has been given a value like "relative", "absolute", or "fixed"). The default is `0`.

### Events

#### `"drag"`

Is emitted when the element is dragged. (Note: Movement must occur for this event to be emitted; i.e., it is not emitted while the element is stationary, even if the user has already initiated a drag.) Is passed a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) representing the bounding box of the element.

#### `"drag-end"`

Is emitted when the user stops dragging the element. (Is emitted when the user releases their mouse button or lifts their touch from the screen, not merely when the element is stationary.) Is passed a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) representing the bounding box of the element.

#### `"drag-start"`

Is emitted when a drag is initiated. Is passed a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) representing the bounding box of the element.

## `Frame`

![](https://i.ibb.co/P9vjT8q/frame.gif)

### Props

#### `is-locked`

(Optional) A boolean indicating whether or not the frame is locked against pane resizing. In other words, if set to `true`, then the panes within the frame cannot be resized. The default is `false`.

#### `max-size`

(Optional) A number indicating the maximum possible pane size along the primary axis (i.e., the maximum width of each pane in the case of horizontal frames and the maximum height of each pane in the case of vertical frames). The default is `Infinity`.

#### `min-size`

(Optional) A number indicating the minimum possible pane size along the primary axis (i.e., the minimum width of each pane in the case of horizontal frames and the minimum height of each pane in the case of vertical frames). The default is `64`.

#### `orientation`

(Optional) A string representing which way the panes in the frame will be stacked against each other. Must be `"horizontal"` or `"vertical"`. Horizontal frames will contain panes sitting side-by-side. Vertical frames will contain panes sitting on top of one another.

### Events

#### `"resize"`

Is emitted when a pane is resized. (Note: Size change must occur for this event to be emitted; i.e., it is not emitted while a pane is not changing size, even if the user has already initiated the resizing process.) Is passed an array containing the two panes (as `HTMLElement` instances) being resized.

#### `"resize-end"`

Is emitted when the user stops resizing the pane. (Is emitted when the user releases their mouse button or lifts their touch from the screen, not merely when the mouse or touch is stationary while in the process of resizing.) Is passed an array containing the two panes (as `HTMLElement` instances) that were being resized.

#### `"resize-start"`

Is emitted when pane resizing is initiated. Is passed an array containing the two panes (as `HTMLElement` instances) being resized.

## `Resizeable`

![](https://i.ibb.co/HgvC0jP/resizeable.gif)

Note that a `Resizeable` is built on top of a `Draggable`; so almost all of the `Draggable` API also applies to `Resizeable`. Any differences are noted below.

Note also that the "Shift" key can be held down during resizing diagonally to maintain aspect ratio.

### Props

#### `height`

(Optional) A number representing the height in pixels of the element's bounding box. The default is `256`.

#### `is-drag-h-locked`

(Optional) Is passed as the internal `Draggable` `is-h-locked` prop. The default is `false`.

#### `is-drag-v-locked`

(Optional) Is passed as the internal `Draggable` `is-v-locked` prop. The default is `false`.

#### `is-resize-bottom-locked`

(Optional) A boolean indicating whether or not the element's bottom border is locked against resizing. In other words, if set to `true`, then the element cannot be resized by dragging its bottom border up or down. The default is `false`.

#### `is-resize-left-locked`

(Optional) A boolean indicating whether or not the element's left border is locked against resizing. In other words, if set to `true`, then the element cannot be resized by dragging its left border to the left or right. The default is `false`.

#### `is-resize-right-locked`

(Optional) A boolean indicating whether or not the element's right border is locked against resizing. In other words, if set to `true`, then the element cannot be resized by dragging its right border to the left or right. The default is `false`.

#### `is-resize-top-locked`

(Optional) A boolean indicating whether or not the element's top border is locked against resizing. In other words, if set to `true`, then the element cannot be resized by dragging its top border up or down. The default is `false`.

#### `min-height`

(Optional) A number representing the minimum allowable height in pixels of the element's bounding box. The default is `8`.

#### `min-width`

(Optional) A number representing the minimum allowable width in pixels of the element's bounding box. The default is `8`.

#### `width`

(Optional) A number representing the width in pixels of the element's bounding box. The default is `256`.

#### `x`

(Optional) Is passed as the `Draggable` `x` prop. The default is `0`.

#### `y`

(Optional) Is passed as the `Draggable` `y` prop. The default is `0`.

### Events

#### `"drag"`

Same as the `Draggable` `"drag"` event.

#### `"drag-end"`

Same as the `Draggable` `"drag-end"` event.

#### `"drag-start"`

Same as the `Draggable` `"drag-start"` event.

#### `"resize"`

Is emitted when the element is resized. (Note: Size change must occur for this event to be emitted; i.e., it is not emitted while the element is not changing size, even if the user has already initiated the resizing process.) Is passed a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) representing the bounding box of the element.

#### `"resize-end"`

Is emitted when the user stops resizing the element. (Is emitted when the user releases their mouse button or lifts their touch from the screen, not merely when the mouse or touch is stationary while in the process of resizing.) Is passed a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) representing the bounding box of the element.

#### `"resize-start"`

Is emitted when resizing is initiated. Is passed a [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) representing the bounding box of the element.
