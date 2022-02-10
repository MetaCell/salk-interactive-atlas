"use strict";

/**
 * Base class that provides wrapping functionality for a generic underlying object (with id and name).
 *
 * @module model/ObjectWrapper
 * @author Giovanni Idili
 */
function ObjectWrapper(options) {
  this.wrappedObj = options.wrappedObj;
  this.parent = options.parent;
}

ObjectWrapper.prototype = {
  constructor: ObjectWrapper,

  /**
   * Gets the name of the node
   *
   * @command Node.getName()
   * @returns {String} Name of the node
   *
   */
  getName: function getName() {
    return this.wrappedObj.name;
  },

  /**
   * Get the id associated with node
   *
   * @command Node.getId()
   * @returns {String} ID of node
   */
  getId: function getId() {
    return this.wrappedObj.id;
  },

  /**
   * Get the wrapped obj
   *
   * @command Node.getWrappedObj()
   * @returns {Object} - Wrapped object
   */
  getWrappedObj: function getWrappedObj() {
    return this.wrappedObj;
  },

  /**
   * Get meta type
   *
   * @command Instance.getMetaType()
   *
   * @returns {String} - meta type
   *
   */
  getMetaType: function getMetaType() {
    return this.wrappedObj.eClass;
  },

  /**
   * Get parent
   *
   * @command Type.getParent()
   *
   * @returns {Object} - Parent object
   *
   */
  getParent: function getParent() {
    return this.parent;
  },

  /**
   * Set parent
   *
   * @command Type.setParent()
   *
   * @returns {Object} - Current object
   *
   */
  setParent: function setParent(parent) {
    this.parent = parent;
    return this;
  },

  /**
   * Get path
   *
   * @command Type.getPath()
   *
   * @returns {String} - path
   *
   */
  getPath: function getPath() {
    if (this.parent) {
      return this.parent.getPath() + "." + this.getId();
    } else {
      return this.getId();
    }
  }
}; // Compatibility with new imports and old require syntax

ObjectWrapper["default"] = ObjectWrapper;
module.exports = ObjectWrapper;
//# sourceMappingURL=ObjectWrapper.js.map