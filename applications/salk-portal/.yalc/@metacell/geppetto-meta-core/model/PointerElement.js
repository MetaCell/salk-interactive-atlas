"use strict";

/**
 * Client class use to represent a pointer element.
 *
 * @module model/PointerElement
 * @author Giovanni Idili
 * @author Matteo Cantarelli
 */
function PointerElement(options) {
  this.wrappedObj = options.wrappedObj;
  this.variable = options.variable;
  this.type = options.type;
  this.index = options.index;
}

PointerElement.prototype = {
  constructor: PointerElement,

  /**
   * Gets the variable
   *
   * @command PointerElement.getVariable()
   *
   * @returns {Variable} - variable
   *
   */
  getVariable: function getVariable() {
    return this.variable;
  },

  /**
   * Gets the type
   *
   * @command PointerElement.getType()
   *
   * @returns {Type} - type
   *
   */
  getType: function getType() {
    return this.type;
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
   * Gets the index if it's pointing to an array element
   *
   * @command PointerElement.getIndex()
   *
   * @returns {Integer} - index in a given array
   *
   */
  getIndex: function getIndex() {
    return this.index;
  },

  /**
   * Get the path for this pointer element
   *
   * @command PointerElement.getPath()
   *
   * @returns {String} - path
   */
  getPath: function getPath(types) {
    if (types === undefined) {
      types = false;
    }

    var path = '';
    var element = this;
    var resolvedVar = element.getVariable();
    var resolvedType = element.getType();
    path += resolvedVar.getId();

    if (types) {
      path += "(" + resolvedType.getId() + ")";
    }

    if (element.getIndex() > -1) {
      path += "[" + element.getIndex() + "]";
    }

    return path;
  }
}; // Compatibility with new imports and old require syntax

PointerElement["default"] = PointerElement;
module.exports = PointerElement;
//# sourceMappingURL=PointerElement.js.map