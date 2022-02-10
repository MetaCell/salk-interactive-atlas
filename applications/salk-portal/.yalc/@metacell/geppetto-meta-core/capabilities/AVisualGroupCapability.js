"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Client class use to augment a model with visual group capabilities
 *
 * @module model/AVisualGroupCapability
 * @author Giovanni Idili
 */
var _default = {
  capabilityId: 'VisualGroupCapability',
  visualGroups: [],

  /**
   * Get VisualGroups
   */
  getVisualGroups: function getVisualGroups() {
    return this.visualGroups;
  },
  applyVisualGroup: function applyVisualGroup(visualGroup, mode) {
    visualGroup.show(mode, [this]);
  },

  /**
   * Get VisualGroups
   */
  setVisualGroups: function setVisualGroups(visualGroups) {
    this.visualGroups = visualGroups;
  }
};
exports["default"] = _default;
//# sourceMappingURL=AVisualGroupCapability.js.map