(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/@jrc03c/vue-component-with-css/src/index.js
  var require_src = __commonJS({
    "node_modules/@jrc03c/vue-component-with-css/src/index.js"(exports, module) {
      function createVueComponentWithCSS(component) {
        let count = 0;
        let styleElement;
        component = component || {};
        const data = component.data ? component.data : function() {
        };
        const mounted = component.mounted ? component.mounted : function() {
        };
        const unmounted = component.unmounted ? component.unmounted : function() {
        };
        if (!data.css)
          data.css = "";
        component.data = function() {
          return data.bind(this)();
        };
        component.mounted = function() {
          mounted.bind(this)();
          count++;
          let root = this.$root.$el.getRootNode();
          if (root === document) {
            root = root.body;
          }
          if (!styleElement) {
            styleElement = document.createElement("style");
            root.appendChild(styleElement);
            styleElement.innerHTML = this.css;
          }
        };
        component.unmounted = function() {
          unmounted.bind(this)();
          count--;
          let root = this.$root.$el.getRootNode();
          if (root === document) {
            root = root.body;
          }
          if (count < 1) {
            if (styleElement) {
              try {
                root.removeChild(styleElement);
              } catch (e) {
                try {
                  styleElement.parentElement.removeChild(styleElement);
                } catch (e2) {
                }
              }
            }
            styleElement = null;
          }
        };
        return component;
      }
      if (typeof module !== "undefined") {
        module.exports = createVueComponentWithCSS;
      }
      if (typeof window !== "undefined") {
        window.createVueComponentWithCSS = createVueComponentWithCSS;
      }
    }
  });

  // src/draggable.js
  var require_draggable = __commonJS({
    "src/draggable.js"(exports, module) {
      var css = (
        /* css */
        `
  .x-draggable {
    position: absolute;
    left: 0;
    top: 0;
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
      );
      var template = (
        /* html */
        `
  <div
    :class="{ 'has-grab-cursor': !isLocked }"
    @mousedown="onMouseDown"
    class="x-draggable">
    <slot></slot>
  </div>
`
      );
      var createVueComponentWithCSS = require_src();
      module.exports = createVueComponentWithCSS({
        name: "x-draggable",
        template,
        emits: ["drag-end", "drag-start", "drag"],
        props: {
          "is-locked": {
            type: Boolean,
            required: false,
            default: () => false
          },
          x: {
            type: Number,
            required: false,
            default: () => 0
          },
          y: {
            type: Number,
            required: false,
            default: () => 0
          }
        },
        data() {
          return {
            css,
            isBeingDragged: false,
            mouse: { x: 0, y: 0 },
            x_: 0,
            y_: 0
          };
        },
        watch: {
          x() {
            this.x_ = this.x;
            this.updateComputedStyle();
          },
          y() {
            this.y_ = this.y;
            this.updateComputedStyle();
          }
        },
        methods: {
          onMouseDown(event) {
            event.preventDefault();
            event.stopPropagation();
            if (this.isLocked)
              return;
            this.mouse.x = event.screenX;
            this.mouse.y = event.screenY;
            this.isBeingDragged = true;
            this.$emit("drag-start", this.$el.getBoundingClientRect());
          },
          onMouseMove(event) {
            if (this.isLocked)
              return;
            if (this.isBeingDragged) {
              const dx = event.screenX - this.mouse.x;
              const dy = event.screenY - this.mouse.y;
              this.x_ += dx;
              this.y_ += dy;
              this.mouse.x = event.screenX;
              this.mouse.y = event.screenY;
              this.updateComputedStyle();
              this.$emit("drag", this.$el.getBoundingClientRect());
            }
          },
          onMouseUp() {
            if (this.isLocked)
              return;
            const wasBeingDragged = this.isBeingDragged;
            this.isBeingDragged = false;
            if (wasBeingDragged) {
              this.$emit("drag-end", this.$el.getBoundingClientRect());
            }
          },
          updateComputedStyle() {
            this.$el.style.left = this.x_ + "px";
            this.$el.style.top = this.y_ + "px";
          }
        },
        mounted() {
          this.x_ = this.x;
          this.y_ = this.y;
          this.updateComputedStyle();
          window.addEventListener("mousemove", this.onMouseMove);
          window.addEventListener("mouseup", this.onMouseUp);
        },
        unmounted() {
          window.removeEventListener("mousemove", this.onMouseMove);
          window.removeEventListener("mouseup", this.onMouseUp);
        }
      });
    }
  });

  // src/resizeable.js
  var require_resizeable = __commonJS({
    "src/resizeable.js"(exports, module) {
      var css = (
        /* css */
        `
  .no-pointer-events,
  .no-pointer-events * {
    pointer-events: none;
  }
`
      );
      var template = (
        /* html */
        `
  <x-draggable
    :class="{ 'no-pointer-events': shouldPreventInternalPointerEvents }"
    :is-locked="isDragLocked"
    :x="x_"
    :y="y_"
    @drag-end="onDragEnd"
    @drag-start="$emit('drag-start', $event)"
    @drag="$emit('drag', $event)"
    class="x-resizeable"
    ref="root">
    <slot></slot>
  </x-draggable>
`
      );
      var createVueComponentWithCSS = require_src();
      var DraggableComponent = require_draggable();
      module.exports = createVueComponentWithCSS({
        name: "x-resizeable",
        template,
        emits: [
          "drag-end",
          "drag-start",
          "drag",
          "resize-end",
          "resize-start",
          "resize"
        ],
        components: {
          "x-draggable": DraggableComponent
        },
        props: {
          height: {
            type: Number,
            required: false,
            default: () => 256
          },
          "is-drag-locked": {
            type: Boolean,
            required: false,
            default: () => false
          },
          "is-resize-locked": {
            type: Boolean,
            required: false,
            default: () => false
          },
          "min-height": {
            type: Number,
            required: false,
            default: () => 8
          },
          "min-width": {
            type: Number,
            required: false,
            default: () => 8
          },
          width: {
            type: Number,
            required: false,
            default: () => 256
          },
          x: {
            type: Number,
            required: false,
            default: () => 0
          },
          y: {
            type: Number,
            required: false,
            default: () => 0
          }
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
            y_: 0
          };
        },
        watch: {
          height() {
            this.height_ = this.height;
            this.updateComputedStyle();
          },
          width() {
            this.width_ = this.width;
            this.updateComputedStyle();
          },
          x() {
            this.x_ = this.x;
          },
          y() {
            this.y_ = this.y;
          }
        },
        methods: {
          onDragEnd(rect) {
            const parentRect = this.$el.parentElement.getBoundingClientRect();
            const leftBorderWidth = parseFloat(
              getComputedStyle(this.$el.parentElement).getPropertyValue("border-left").split("px")[0]
            );
            const topBorderWidth = parseFloat(
              getComputedStyle(this.$el.parentElement).getPropertyValue("border-top").split("px")[0]
            );
            this.x_ = rect.x - parentRect.x - leftBorderWidth;
            this.y_ = rect.y - parentRect.y - topBorderWidth;
            this.$emit("drag-end", rect);
          },
          onKeyDown(event) {
            if (this.isResizeLocked)
              return;
            if (event.key === "Shift") {
              this.shouldScaleProportionally = true;
            }
          },
          onKeyUp(event) {
            if (this.isResizeLocked)
              return;
            if (event.key === "Shift") {
              this.shouldScaleProportionally = false;
            }
          },
          onMouseDown(event) {
            if (this.isResizeLocked)
              return;
            let shouldCancelEvent = false;
            if (this.isHoveringOverLeftBorder) {
              this.isBeingResizedHorizontally = true;
              this.anchoredLeftRightBorder = "right";
              shouldCancelEvent = true;
            }
            if (this.isHoveringOverRightBorder) {
              this.isBeingResizedHorizontally = true;
              this.anchoredLeftRightBorder = "left";
              shouldCancelEvent = true;
            }
            if (this.isHoveringOverTopBorder) {
              this.isBeingResizedVertically = true;
              this.anchoredTopBottomBorder = "bottom";
              shouldCancelEvent = true;
            }
            if (this.isHoveringOverBottomBorder) {
              this.isBeingResizedVertically = true;
              this.anchoredTopBottomBorder = "top";
              shouldCancelEvent = true;
            }
            if (shouldCancelEvent) {
              event.preventDefault();
              event.stopPropagation();
            }
            if (this.isBeingResizedHorizontally || this.isBeingResizedVertically) {
              this.$emit("resize-start", this.$el.getBoundingClientRect());
            }
          },
          onMouseMove(event) {
            if (this.isResizeLocked)
              return;
            if (this.isBeingResizedHorizontally || this.isBeingResizedVertically) {
              const aspect = this.width_ / this.height_;
              let mx = event.movementX;
              let my = event.movementY;
              if (this.shouldScaleProportionally && this.isBeingResizedHorizontally && this.isBeingResizedVertically) {
                const isPrimarilyHorizontal = Math.abs(mx) > Math.abs(my);
                if (this.anchoredLeftRightBorder === "left") {
                  if (this.anchoredTopBottomBorder === "top") {
                    if (isPrimarilyHorizontal) {
                      this.width_ += mx;
                      this.height_ = this.width_ / aspect;
                    } else {
                      this.height_ += my;
                      this.width_ = this.height_ * aspect;
                    }
                    if (this.width_ < this.minWidth) {
                      this.width_ = this.minWidth;
                      this.height_ = this.width_ / aspect;
                    }
                    if (this.height_ < this.minHeight) {
                      this.height_ = this.minHeight;
                      this.width_ = this.height_ * aspect;
                    }
                  } else {
                    if (isPrimarilyHorizontal) {
                      this.width_ += mx;
                      this.height_ = this.width_ / aspect;
                      this.y_ -= mx / aspect;
                    } else {
                      this.height_ -= my;
                      this.y_ += my;
                      this.width_ = this.height_ * aspect;
                    }
                    if (this.width_ < this.minWidth) {
                      const dx = this.minWidth - this.width_;
                      this.width_ = this.minWidth;
                      this.height_ = this.width_ / aspect;
                      this.y_ -= dx / aspect;
                    }
                    if (this.height_ < this.minHeight) {
                      const dy = this.minHeight - this.height_;
                      this.height_ = this.minHeight;
                      this.y_ -= dy;
                      this.width_ = this.height_ * aspect;
                    }
                  }
                } else {
                  if (this.anchoredTopBottomBorder === "top") {
                    if (isPrimarilyHorizontal) {
                      this.width_ -= mx;
                      this.x_ += mx;
                      this.height_ = this.width_ / aspect;
                    } else {
                      this.height_ += my;
                      this.width_ = this.height_ * aspect;
                      this.x_ -= my * aspect;
                    }
                    if (this.width_ < this.minWidth) {
                      const dx = this.minWidth - this.width_;
                      this.width_ = this.minWidth;
                      this.x_ -= dx;
                      this.height_ = this.width_ / aspect;
                    }
                    if (this.height_ < this.minHeight) {
                      const dy = this.minHeight - this.height_;
                      this.height_ = this.minHeight;
                      this.width_ = this.height_ * aspect;
                      this.x_ -= dy * aspect;
                    }
                  } else {
                    if (isPrimarilyHorizontal) {
                      this.width_ -= mx;
                      this.x_ += mx;
                      this.height_ = this.width_ / aspect;
                      this.y_ += mx / aspect;
                    } else {
                      this.height_ -= my;
                      this.y_ += my;
                      this.width_ = this.height_ * aspect;
                      this.x_ += my * aspect;
                    }
                    if (this.width_ < this.minWidth) {
                      const dx = this.minWidth - this.width_;
                      this.width_ = this.minWidth;
                      this.x_ -= dx;
                      this.height_ = this.width_ / aspect;
                      this.y_ -= dx / aspect;
                    }
                    if (this.height_ < this.minHeight) {
                      const dy = this.minHeight - this.height_;
                      this.height_ = this.minHeight;
                      this.y_ -= dy;
                      this.width_ = this.height_ * aspect;
                      this.x_ -= dy * aspect;
                    }
                  }
                }
              } else {
                if (this.isBeingResizedHorizontally) {
                  if (this.anchoredLeftRightBorder === "left") {
                    this.width_ += mx;
                    this.width_ = Math.max(this.width_, this.minWidth);
                  } else {
                    this.width_ -= mx;
                    this.x_ += mx;
                    if (this.width_ < this.minWidth) {
                      const dx = this.minWidth - this.width_;
                      this.width_ += dx;
                      this.x_ -= dx;
                    }
                  }
                }
                if (this.isBeingResizedVertically) {
                  if (this.anchoredTopBottomBorder === "top") {
                    this.height_ += my;
                    this.height_ = Math.max(this.height_, this.minHeight);
                  } else {
                    this.height_ -= my;
                    this.y_ += my;
                    if (this.height_ < this.minHeight) {
                      const dy = this.minHeight - this.height_;
                      this.height_ += dy;
                      this.y_ -= dy;
                    }
                  }
                }
              }
              this.updateComputedStyle();
              event.preventDefault();
              event.stopPropagation();
              this.$emit("resize", this.$el.getBoundingClientRect());
            } else {
              this.isHoveringOverLeftBorder = false;
              this.isHoveringOverRightBorder = false;
              this.isHoveringOverTopBorder = false;
              this.isHoveringOverBottomBorder = false;
              this.shouldPreventInternalPointerEvents = false;
              const rect = this.$el.getBoundingClientRect();
              const left = rect.x;
              const right = rect.x + rect.width;
              const top = rect.y;
              const bottom = rect.y + rect.height;
              let shouldCancelEvent = false;
              if (Math.abs(event.clientX - left) < this.borderWidth && event.clientY >= top - this.borderWidth && event.clientY <= bottom + this.borderWidth) {
                this.isHoveringOverLeftBorder = true;
                this.shouldPreventInternalPointerEvents = true;
                shouldCancelEvent = true;
              }
              if (Math.abs(event.clientX - right) < this.borderWidth && event.clientY >= top - this.borderWidth && event.clientY <= bottom + this.borderWidth) {
                this.isHoveringOverRightBorder = true;
                this.shouldPreventInternalPointerEvents = true;
                shouldCancelEvent = true;
              }
              if (Math.abs(event.clientY - top) < this.borderWidth && event.clientX >= left - this.borderWidth && event.clientX <= right + this.borderWidth) {
                this.isHoveringOverTopBorder = true;
                this.shouldPreventInternalPointerEvents = true;
                shouldCancelEvent = true;
              }
              if (Math.abs(event.clientY - bottom) < this.borderWidth && event.clientX >= left - this.borderWidth && event.clientX <= right + this.borderWidth) {
                this.isHoveringOverBottomBorder = true;
                this.shouldPreventInternalPointerEvents = true;
                shouldCancelEvent = true;
              }
              if (shouldCancelEvent) {
                event.preventDefault();
                event.stopPropagation();
              }
              this.updateComputedStyle();
            }
          },
          onMouseUp() {
            if (this.isResizeLocked)
              return;
            const wasBeingResized = this.isBeingResizedHorizontally || this.isBeingResizedVertically;
            this.isBeingResizedHorizontally = false;
            this.isBeingResizedVertically = false;
            this.isHoveringOverBorder = false;
            if (wasBeingResized) {
              this.$emit("resize-end", this.$el.getBoundingClientRect());
            }
          },
          updateComputedStyle() {
            document.body.style.cursor = "unset";
            if (this.isHoveringOverLeftBorder || this.isHoveringOverRightBorder) {
              document.body.style.cursor = "ew-resize";
            }
            if (this.isHoveringOverTopBorder || this.isHoveringOverBottomBorder) {
              document.body.style.cursor = "ns-resize";
            }
            if (this.isHoveringOverLeftBorder && this.isHoveringOverTopBorder) {
              document.body.style.cursor = "nwse-resize";
            }
            if (this.isHoveringOverLeftBorder && this.isHoveringOverBottomBorder) {
              document.body.style.cursor = "nesw-resize";
            }
            if (this.isHoveringOverRightBorder && this.isHoveringOverTopBorder) {
              document.body.style.cursor = "nesw-resize";
            }
            if (this.isHoveringOverRightBorder && this.isHoveringOverBottomBorder) {
              document.body.style.cursor = "nwse-resize";
            }
            this.$el.style.width = this.width_ + "px";
            this.$el.style.minWidth = this.width_ + "px";
            this.$el.style.maxWidth = this.width_ + "px";
            this.$el.style.height = this.height_ + "px";
            this.$el.style.minHeight = this.height_ + "px";
            this.$el.style.maxHeight = this.height_ + "px";
          }
        },
        mounted() {
          this.x_ = this.x;
          this.y_ = this.y;
          this.width_ = this.width;
          this.height_ = this.height;
          this.updateComputedStyle();
          window.addEventListener("keydown", this.onKeyDown);
          window.addEventListener("keyup", this.onKeyUp);
          window.addEventListener("mousedown", this.onMouseDown);
          window.addEventListener("mousemove", this.onMouseMove);
          window.addEventListener("mouseup", this.onMouseUp);
        },
        unmounted() {
          window.removeEventListener("keydown", this.onKeyDown);
          window.removeEventListener("keyup", this.onKeyUp);
          window.removeEventListener("mousedown", this.onMouseDown);
          window.removeEventListener("mousemove", this.onMouseMove);
          window.removeEventListener("mouseup", this.onMouseUp);
        }
      });
    }
  });

  // src/index.js
  var require_src2 = __commonJS({
    "src/index.js"(exports, module) {
      var MiscVueComponents = {
        Draggable: require_draggable(),
        Resizeable: require_resizeable()
      };
      if (typeof module !== "undefined") {
        module.exports = MiscVueComponents;
      }
      if (typeof window !== "undefined") {
        window.MiscVueComponents = MiscVueComponents;
      }
    }
  });
  require_src2();
})();
