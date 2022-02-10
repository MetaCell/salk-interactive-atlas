"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Instance = require('./Instance')["default"];
/**
 * Client class use to represent an instance object (instantiation of a variable)
 * 
 * @module model/Instance
 * @author Giovanni Idili
 * @author Matteo Cantarelli
 */


var ExternalInstance = /*#__PURE__*/function (_Instance) {
  _inherits(ExternalInstance, _Instance);

  var _super = _createSuper(ExternalInstance);

  function ExternalInstance(options) {
    var _this;

    _classCallCheck(this, ExternalInstance);

    _this = _super.call(this, options);
    _this.path = options.path;
    _this.projectId = options.projectId;
    return _this;
  }
  /**
   * Get the type for this instance
   *
   * @command Instance.getTypes()
   *
   * @returns {List<Type>} - array of types
   *
   */


  _createClass(ExternalInstance, [{
    key: "getTypes",
    value: function getTypes() {
      throw "Invalid operation with ExternalInstance";
    }
  }, {
    key: "getValues",
    value: function getValues() {
      throw "Invalid operation with ExternalInstance";
    }
    /**
     * Get the type of this variable, return a list if it has more than one
     *
     * @command Variable.getType()
     *
     * @returns List<Type>} - array of types
     *
     */

  }, {
    key: "getType",
    value: function getType() {
      throw "Invalid operation with ExternalInstance";
    }
  }, {
    key: "getValue",
    value: function getValue() {
      throw "Invalid operation with ExternalInstance";
    }
    /**
     *
     * @returns {*|Object}
     */

  }, {
    key: "getPosition",
    value: function getPosition() {
      throw "Invalid operation with ExternalInstance";
    }
    /**
     * Checks if this instance has a visual type
     *
     * @command Instance.hasVisualType()
     *
     * @returns {Boolean}
     *
     */

  }, {
    key: "hasVisualType",
    value: function hasVisualType() {
      return false;
    }
    /**
     * Gets visual types for the instance if any
     *
     * @command Instance.getVisualType()
     *
     * @returns {*} - Type or list of Types if more than one is found
     */

  }, {
    key: "getVisualType",
    value: function getVisualType() {
      return undefined;
    }
    /**
     * Get the variable for this instance
     *
     * @command Instance.getVariable()
     *
     * @returns {Variable} - Variable object for this instance
     *
     */

  }, {
    key: "getVariable",
    value: function getVariable() {
      return this.variable;
    }
    /**
     * Get children instances
     *
     * @command Instance.getChildren()
     *
     * @returns {List<Instance>} - List of instances
     *
     */

  }, {
    key: "getChildren",
    value: function getChildren() {
      return this.children;
    }
    /**
     * Get instance path
     *
     * @command Instance.getInstancePath()
     *
     * @returns {String} - Instance path
     *
     */

  }, {
    key: "getInstancePath",
    value: function getInstancePath() {
      return this.path;
    }
    /**
     * Get raw instance path (without array shortening)
     *
     * @command Instance.getRawInstancePath()
     *
     * @returns {String} - Instance path
     *
     */

  }, {
    key: "getRawInstancePath",
    value: function getRawInstancePath() {
      throw "Invalid operation with ExternalInstance";
    }
    /**
     * Get parent
     *
     * @command Instance.getParent()
     *
     * @returns {Instance} - Parent instance
     *
     */

  }, {
    key: "getParent",
    value: function getParent() {
      throw "Invalid operation with ExternalInstance";
    }
    /**
     * Get children instances
     *
     * @command Instance.addChild()
     */

  }, {
    key: "addChild",
    value: function addChild(child) {
      throw "Invalid operation with ExternalInstance";
    }
    /**
     * Return connections, user Resources.INPUT / OUTPUT /
     * INPUT_OUTPUT to filter
     *
     * @command Instance.getConnections(direction)
     *
     * @returns {List<Instance>}
     *
     */

  }, {
    key: "getConnections",
    value: function getConnections(direction) {
      return this.connections;
    }
    /**
     * Deletes instance
     */

  }, {
    key: "delete",
    value: function _delete() {
      throw "Invalid operation with ExternalInstance";
    }
  }]);

  return ExternalInstance;
}(Instance); // Compatibility with new imports and old require syntax


ExternalInstance["default"] = ExternalInstance;
module.exports = ExternalInstance;
//# sourceMappingURL=ExternalInstance.js.map