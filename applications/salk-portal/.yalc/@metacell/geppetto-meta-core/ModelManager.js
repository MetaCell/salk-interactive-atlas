"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadModel = loadModel;
exports.addVariableToModel = addVariableToModel;
exports["default"] = void 0;

var _ModelFactory = _interopRequireDefault(require("./ModelFactory"));

var _Resources = _interopRequireDefault(require("./Resources"));

var _Instances = require("./Instances");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Client class use to handle Geppetto workflows
 *
 * @module Manager
 * @author Matteo Cantarelli
 */

/**
 *
 * @param payload
 */
function loadModel(model) {
  _ModelFactory["default"].cleanModel();

  console.timeEnd(_Resources["default"].PARSING_MODEL);
  console.time(_Resources["default"].CREATING_MODEL); // build Geppetto model here (once off operation when project is loaded)

  window.Model = _ModelFactory["default"].createGeppettoModel(model, true, true);
  console.timeEnd(_Resources["default"].CREATING_MODEL);
  console.time(_Resources["default"].CREATING_INSTANCES); // Initialize instances with static instances already present in the model

  if (window.Model.getCurrentWorld()) {
    window.Instances = window.Model.getCurrentWorld().getInstances();
    window.Instances.push.apply(window.Instances, _ModelFactory["default"].instantiateVariables(window.Model));
  } else {
    window.Instances = _ModelFactory["default"].instantiateVariables(window.Model);
  }

  (0, _Instances.augmentInstancesArray)(window.Instances);
  console.timeEnd(_Resources["default"].CREATING_INSTANCES);
  console.timeEnd(_Resources["default"].LOADING_PROJECT);
  return window.Model;
}
/**
 * Adds fetched variable to model
 *
 * @param rawModel
 */


function addVariableToModel(rawModel) {
  // STEP 1: merge model - expect a fully formed Geppetto model to be merged into current one
  var diffReport = _ModelFactory["default"].mergeModel(rawModel); // STEP 2: add new instances for new variables if any


  var newInstances = _ModelFactory["default"].createInstancesFromDiffReport(diffReport);

  return newInstances;
}

var _default = {
  loadModel: loadModel,
  addVariableToModel: addVariableToModel
};
exports["default"] = _default;
//# sourceMappingURL=ModelManager.js.map