# to do

- change draggable to work only with left mouse button (and touchpad)
- fix context menu font size
- make sure draggable cursor is "grabbing" when dragging

# notes

- one design goal is for these components to be "self-sufficient" in the sense that they shouldn't require micromanagement from the outside. for example, the `draggable` component can optionally receive positional information via props, but it should still do its own thing regardless of whether or not that information exists. i'm setting this as a design goal because it's irritating to me when components require micromanagement. if, for example, the `draggable` component didn't keep its own state but needed to send movement data out via events and wait for new positional information to come in via props, then the user of the component has to write a ton of simplistic boilerplate logic just to reroute that information from the event back to the props. i'll still strive to offer the _option_ to micromanage, which may be desirable in some cases, but i'll generally shoot for complete self-containment. oh, and one final note: this design goal really only applies to public-facing apis; components that are used _only_ internally may not necessarily conform to this pattern.
