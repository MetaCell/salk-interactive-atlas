"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ObjectWrapper2 = _interopRequireDefault(require("./ObjectWrapper"));

var _Utils = require("../common/Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var ASimpleInstance = /*#__PURE__*/function (_ObjectWrapper) {
  _inherits(ASimpleInstance, _ObjectWrapper);

  var _super = _createSuper(ASimpleInstance);

  function ASimpleInstance(node) {
    var _this;

    _classCallCheck(this, ASimpleInstance);

    _this = _super.call(this, {
      wrappedObj: node
    }); // Value and type can be wrapped so let's keep separate from the visual value

    _this.value = node.value;
    _this.type = node.type;
    _this.capabilities = [];
    _this.connections = new Set();
    return _this;
  }

  _createClass(ASimpleInstance, [{
    key: "getTypes",
    value: function getTypes() {
      return [this.getType()];
    }
  }, {
    key: "getValues",
    value: function getValues() {
      return [this.getValue()];
    }
  }, {
    key: "getType",
    value: function getType() {
      return this.type;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.value;
    }
  }, {
    key: "getVisualValue",
    value: function getVisualValue() {
      return this.wrappedObj.visualValue;
    }
  }, {
    key: "hasVisualValue",
    value: function hasVisualValue() {
      return this.wrappedObj.visualValue;
    }
  }, {
    key: "getPosition",
    value: function getPosition() {
      return this.wrappedObj.position;
    }
  }, {
    key: "hasVisualType",
    value: function hasVisualType() {
      throw "Simple instances don't support visual type: use hasVisualValue instead";
    }
  }, {
    key: "getVisualType",
    value: function getVisualType() {
      throw "Simple instances don't support visual type: use getVisualValue instead";
    }
  }, {
    key: "getVariable",
    value: function getVariable() {
      throw "Simple instances don't support variables";
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      return [];
    }
  }, {
    key: "getInstancePath",
    value: function getInstancePath() {
      return this.wrappedObj.id;
    }
  }, {
    key: "getPath",
    value: function getPath() {
      return this.getInstancePath();
    }
  }, {
    key: "getRawInstancePath",
    value: function getRawInstancePath() {
      return this.getInstancePath();
    }
  }, {
    key: "getParent",
    value: function getParent() {
      return null;
    }
  }, {
    key: "addChild",
    value: function addChild() {
      throw "Simple instances don't have children";
    }
  }, {
    key: "extendApi",
    value: function extendApi(extensionObj) {
      (0, _Utils.extend)(this, extensionObj);
      this.capabilities.push(extensionObj.capabilityId);
    }
  }, {
    key: "hasCapability",
    value: function hasCapability(capabilityId) {
      return this.capabilities.findIndex(function (capability) {
        return capability === capabilityId;
      }) != -1;
    }
  }, {
    key: "getCapabilities",
    value: function getCapabilities() {
      return this.capabilities;
    }
  }, {
    key: "getConnections",
    value: function getConnections(direction) {
      if (direction) {
        console.error('getConnections with param `direction` is not yet implemented for simple instances');
      }

      return Array.from(this.connections);
    }
  }, {
    key: "addConnection",
    value: function addConnection(connection) {
      this.connections.add(connection);
    }
  }]);

  return ASimpleInstance;
}(_ObjectWrapper2["default"]);

exports["default"] = ASimpleInstance;
//# sourceMappingURL=ASimpleInstance.js.map