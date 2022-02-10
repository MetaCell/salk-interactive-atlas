"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Utils = require("../common/Utils");

var _ModelFactory = _interopRequireDefault(require("../ModelFactory"));

var _Resources = _interopRequireDefault(require("../Resources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Client class use to represent an instance object (instantiation of a variable).
 *
 * @module model/Instance
 * @author Giovanni Idili
 * @author Matteo Cantarelli
 */
var Instance = /*#__PURE__*/function () {
  function Instance(options) {
    _classCallCheck(this, Instance);

    this.id = options.id;
    this.name = options.name;
    this._metaType = options._metaType;
    this.variable = options.variable;
    this.parent = options.parent;
    this.children = options.children != undefined ? options.children : [];
    this.capabilities = [];
    this.connections = [];
  }
  /**
   * Get id
   *
   * @command Instance.getId()
   *
   * @returns {String} - Id
   *
   */


  _createClass(Instance, [{
    key: "getId",
    value: function getId() {
      return this.id;
    }
    /**
     * Get name
     *
     * @command Instance.getName()
     *
     * @returns {String} - Name
     *
     */

  }, {
    key: "getName",
    value: function getName() {
      return this.name;
    }
    /**
     * Get meta type
     *
     * @command Instance.getMetaType()
     *
     * @returns {String} - meta type
     *
     */

  }, {
    key: "getMetaType",
    value: function getMetaType() {
      return this._metaType;
    }
    /**
     * Get the type for this instance
     *
     * @command Instance.getTypes()
     *
     * @returns {List<Type>} - array of types
     *
     */

  }, {
    key: "getTypes",
    value: function getTypes() {
      return this.getVariable().getTypes();
    }
  }, {
    key: "getValues",
    value: function getValues() {
      return this.getVariable().getValues();
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
      var types = this.variable.getTypes();

      if (types.length == 1) {
        return types[0];
      } else {
        return types;
      }
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.getVariable().getValue();
    }
    /**
     *
     * @returns {*|Object}
     */

  }, {
    key: "getPosition",
    value: function getPosition() {
      return this.getVariable().getPosition();
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
      var hasVisual = false;
      var types = this.getTypes(); // check if any of types is VISUAL_TYPE_NODE or if types HAVE .visualType

      for (var i = 0; i < types.length; i++) {
        // could be pointing to an array variable if it's an exploded instance
        if (types[i].getMetaType() == _Resources["default"].ARRAY_TYPE_NODE) {
          // check it if is a visual type or has a visual type
          if (types[i].getType().getMetaType() == _Resources["default"].VISUAL_TYPE_NODE || types[i].getType().getMetaType() == _Resources["default"].COMPOSITE_VISUAL_TYPE_NODE || types[i].getType().getVisualType() != null) {
            hasVisual = true;
            break;
          }
        } else if (types[i].getMetaType() == _Resources["default"].VISUAL_TYPE_NODE || types[i].getMetaType() == _Resources["default"].COMPOSITE_VISUAL_TYPE_NODE || types[i].getVisualType() != null) {
          hasVisual = true;
          break;
        }
      }

      return hasVisual;
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
      var visualTypes = [];
      var types = this.getTypes(); // check if any of types is VISUAL_TYPE_NODE or if types HAVE .visualType

      for (var i = 0; i < types.length; i++) {
        // could be pointing to an array variable if it's an exploded instance
        if (types[i].getMetaType() == _Resources["default"].ARRAY_TYPE_NODE) {
          // check it if is a visual type or has a visual type
          if (types[i].getType().getMetaType() == _Resources["default"].VISUAL_TYPE_NODE || types[i].getType().getMetaType() == _Resources["default"].COMPOSITE_VISUAL_TYPE_NODE) {
            visualTypes.push(types[i].getType());
          } else if (types[i].getType().getVisualType() != null) {
            visualTypes.push(types[i].getType().getVisualType());
          }
        } else {
          // check it if is a visual type or has a visual type
          if (types[i].getMetaType() == _Resources["default"].VISUAL_TYPE_NODE || types[i].getMetaType() == _Resources["default"].COMPOSITE_VISUAL_TYPE_NODE) {
            visualTypes.push(types[i]);
          } else if (types[i].getVisualType() != null) {
            visualTypes.push(types[i].getVisualType());
          }
        }
      }

      if (visualTypes.length == 0) {
        return undefined;
      } else if (visualTypes.length == 1) {
        return visualTypes[0];
      } else {
        return visualTypes;
      }
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
    value: function getInstancePath(useType) {
      if (useType == undefined) {
        useType = false;
      }

      var parent = this.parent;
      var parentPath = "";

      if (parent != null && parent != undefined) {
        parentPath = parent.getInstancePath(useType);
      }

      var path = parentPath + "." + this.getId();

      if (useType) {
        path += "(" + this.getType().getId() + ")";
      }

      return parentPath != "" ? path : path.replace('.', '');
    }
    /**
     * Synonym of get instance path
     *
     * @command Instance.getPath()
     *
     * @returns {String} - Instance path
     *
     */

  }, {
    key: "getPath",
    value: function getPath() {
      return this.getInstancePath();
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
      var parent = this.parent;
      var parentPath = "";

      if (parent != null && parent != undefined) {
        parentPath = parent.getInstancePath();
      }

      return parentPath != "" ? parentPath + "." + this.getId() : this.getId();
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
      return this.parent;
    }
    /**
     * Get children instances
     *
     * @command Instance.addChild()
     */

  }, {
    key: "addChild",
    value: function addChild(child) {
      this.children.push(child);
    }
    /**
     * Extends with methods from another object
     *
     * @command Instance.extendApi(extensionObj)
     */

  }, {
    key: "extendApi",
    value: function extendApi(extensionObj) {
      (0, _Utils.extend)(this, extensionObj);
      this.capabilities.push(extensionObj.capabilityId);
    }
    /**
     * Checks if the instance has a given capability
     *
     * @command Instance.hasCapability(capabilityId)
     *
     * @returns {Boolean}
     */

  }, {
    key: "hasCapability",
    value: function hasCapability(capabilityId) {
      var hasCapability = false;
      var capabilities = this.capabilities;

      for (var i = 0; i < capabilities.length; i++) {
        if (capabilities[i] === capabilityId) {
          hasCapability = true;
        }
      }

      return hasCapability;
    }
    /**
     * Get instance capabilities
     *
     * @returns {Array}
     */

  }, {
    key: "getCapabilities",
    value: function getCapabilities() {
      return this.capabilities;
    }
    /**
     * Return connections, user Resources.INPUT / OUTPUT / INPUT_OUTPUT to filter
     *
     * @command Instance.getConnections(direction)
     *
     * @returns {List<Instance>}
     *
     */

  }, {
    key: "getConnections",
    value: function getConnections(direction) {
      _ModelFactory["default"].updateConnectionInstances(this);

      var connections = this.connections;

      if (direction === _Resources["default"].INPUT || direction === _Resources["default"].OUTPUT || direction === _Resources["default"].INPUT_OUTPUT) {
        var filteredConnections = [];

        for (var i = 0; i < connections.length; i++) {
          // get directionality
          var connectivity = connections[i].getVariable().getInitialValue().value.connectivity;

          if (connectivity == _Resources["default"].DIRECTIONAL) {
            var a = connections[i].getA();
            var b = connections[i].getB(); // if A is this then it's an output connection

            if (this.getInstancePath() == a.getPath() && direction === _Resources["default"].OUTPUT) {
              filteredConnections.push(connections[i]);
            } // if B is this then it's an input connection


            if (this.getInstancePath() == b.getPath() && direction === _Resources["default"].INPUT) {
              filteredConnections.push(connections[i]);
            }
          } else if (connectivity == _Resources["default"].BIDIRECTIONAL) {
            filteredConnections.push(connections[i]);
          }
        } // set return variable to filtered list


        connections = filteredConnections;
      }

      return connections;
    }
    /**
     * Get children instances
     *
     * @command Instance.addConnection()
     */

  }, {
    key: "addConnection",
    value: function addConnection(connection) {
      this.connections.push(connection);
    }
    /**
     * Deletes instance
     */

  }, {
    key: "delete",
    value: function _delete() {
      var children = [].concat(this.getChildren());

      for (var c = 0; c < children.length; c++) {
        children[c]["delete"]();
      }

      _ModelFactory["default"].deleteInstance(this);
    }
  }]);

  return Instance;
}();

var _default = Instance;
exports["default"] = _default;
//# sourceMappingURL=Instance.js.map