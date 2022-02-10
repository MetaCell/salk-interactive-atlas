"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _ModelFactory = _interopRequireDefault(require("../ModelFactory"));

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

var Instance = require('./Instance')["default"];
/**
 * Client class use to represent an array element instance.
 *
 * @module model/ArrayElementInstance
 * @author Giovanni Idili
 */


var ArrayElementInstance = /*#__PURE__*/function (_Instance) {
  _inherits(ArrayElementInstance, _Instance);

  var _super = _createSuper(ArrayElementInstance);

  function ArrayElementInstance(options) {
    var _this;

    _classCallCheck(this, ArrayElementInstance);

    _this = _super.call(this, options);
    _this.index = options.index;
    return _this;
  }

  _createClass(ArrayElementInstance, [{
    key: "getIndex",
    value: function getIndex() {
      return this.index;
    }
  }, {
    key: "delete",
    value: function _delete() {
      var children = [].concat(this.getChildren());

      for (var c = 0; c < children.length; c++) {
        children[c]["delete"]();
      }

      _ModelFactory["default"].deleteInstance(this);
    }
  }, {
    key: "getInstancePath",
    value: function getInstancePath() {
      var parent = this.getParent();
      var parentPath = "";
      var parentId = "";

      if (parent != null && parent != undefined) {
        parentPath = parent.getInstancePath();
        parentId = parent.getId();
      }

      var path = parentPath.replace(parentId, this.getId());
      return parentPath != "" ? path : this.getId();
    }
  }, {
    key: "getPosition",
    value: function getPosition() {
      if (this.getVariable().getType().getDefaultValue().elements != undefined && this.getVariable().getType().getDefaultValue().elements[this.getIndex()] != undefined) {
        return this.getVariable().getType().getDefaultValue().elements[this.getIndex()].position;
      }
    }
  }, {
    key: "getTypes",
    value: function getTypes() {
      return [this.getVariable().getType().getType()];
    }
  }, {
    key: "getType",
    value: function getType() {
      var types = this.getTypes();

      if (types.length == 1) {
        return types[0];
      } else {
        return types;
      }
    }
  }]);

  return ArrayElementInstance;
}(Instance);

ArrayElementInstance["default"] = ArrayElementInstance;
module.exports = ArrayElementInstance;
//# sourceMappingURL=ArrayElementInstance.js.map