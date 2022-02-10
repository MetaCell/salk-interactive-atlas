"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Client class use to augment a model with connection capabilities
 *
 * @module model/AConnectionCapability
 * @author Matteo Cantarelli
 */
var _default = {
  capabilityId: 'ConnectionCapability',
  A: null,
  B: null,

  /**
   * Get A
   */
  getA: function getA() {
    return this.A;
  },

  /**
   * Get B
   */
  getB: function getB() {
    return this.B;
  },

  /**
   * Set A
   */
  setA: function setA(a) {
    this.A = a;
  },

  /**
   * Set B
   */
  setB: function setB(b) {
    this.B = b;
  }
};
exports["default"] = _default;
//# sourceMappingURL=AConnectionCapability.js.map