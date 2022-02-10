"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Client class use to represent an instance object (instantiation of a variable).
 *
 * @module model/AVisualCapability
 * @author Giovanni Idili
 */
var _default = {
  capabilityId: 'VisualCapability',
  visible: true,
  selected: false,

  /**
   * Hides the instance or class of instances
   *
   * @command AVisualCapability.hide()
   *
   */
  hide: function hide(nested) {
    console.warn("Deprecated api call");
    console.trace();
  },

  /**
   * Shows the instance or class of instances
   *
   * @command AVisualCapability.show()
   *
   */
  show: function show(nested) {
    console.warn("Deprecated api call");
    console.trace();
  },

  /**
   * Returns whether the object is visible or not
   *
   * @command AVisualCapability.isVisible()
   *
   */
  isVisible: function isVisible() {
    return this.visible;
  },

  /**
   * Returns whether the object is selected or not
   *
   * @command AVisualCapability.isSelected()
   *
   */
  isSelected: function isSelected() {
    return this.selected;
  },

  /**
   * Change the opacity of an instance or class of instances
   *
   * @command AVisualCapability.setOpacity(opacity)
   *
   */
  setOpacity: function setOpacity(opacity) {
    console.warn("Deprecated api call");
    console.trace();
  },

  /**
   *
   * @returns {*}
   */
  getColor: function getColor() {
    console.warn("Deprecated api call");
    console.trace();
  },

  /**
   * Change the color of an instance or class of instances
   *
   * @command AVisualCapability.setColor(color)
   *
   */
  setColor: function setColor(color) {
    console.warn("Deprecated api call");
    console.trace();
    return this;
  },

  /**
   * Select the instance or class of instances
   *
   * @command AVisualCapability.select()
   *
   */
  select: function select(nested, geometryIdentifier, point) {
    console.warn("Deprecated api call");
    console.trace();
    return message;
  },

  /**
   * Deselects the instance or class of instances
   *
   * @command AVisualCapability.deselect()
   *
   */
  deselect: function deselect(nested) {
    console.warn("Deprecated api call");
    console.trace();
  },

  /**
   * Zooms to instance or class of instances
   *
   * @command AVisualCapability.zoomTo()
   *
   */
  zoomTo: function zoomTo() {
    console.warn("Deprecated api call");
    console.trace();
  },

  /**
   * Set the type of geometry to be used for this aspect
   */
  setGeometryType: function setGeometryType(type, thickness) {
    console.warn("Deprecated api call");
    console.trace();
  },

  /**
   * Show connection lines for instances.
   * @param {boolean} mode - Show or hide connection lines
   */
  showConnectionLines: function showConnectionLines(mode) {
    console.warn("Deprecated api call");
    console.trace();
  }
};
exports["default"] = _default;
//# sourceMappingURL=AVisualCapability.js.map