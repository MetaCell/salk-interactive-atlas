"use strict";

/**
 * The parent node from where all other nodes extend
 *
 * @module model/Node
 * @author Jesus R. Martinez (jesus@metacell.us)
 */
define(['jquery', 'underscore', 'backbone' // Add requirement for Backbone-associations module
], function (require) {
  return {
    Model: Backbone.Model.extend({
      name: "",
      instancePath: "",
      id: "",
      domainType: "",
      _metaType: "",
      aspectNode: null,
      parent: null,
      tags: null,

      /**
       * Gets the instance path of the node
       *
       * @command Node.getInstancePath()
       * @returns {String} Instance path of this node
       *
       */
      getInstancePath: function getInstancePath() {
        return this.instancePath;
      },

      /**
       * Gets the name of the node
       *
       * @command Node.getName()
       * @returns {String} Name of the node
       *
       */
      getName: function getName() {
        return this.name;
      },
      getAspectNode: function getAspectNode() {
        return this.aspectNode;
      },

      /**
       * Sets the name of the node
       *
       * @command Node.setName()
       *
       */
      setName: function setName(newname) {
        this.name = newname;
      },

      /**
       * Get the id associated with node
       *
       * @command Node.getId()
       * @returns {String} ID of node
       */
      getId: function getId() {
        return this.id;
      },
      getDomainType: function getDomainType() {
        return this.domainType;
      },
      setDomainType: function setDomainType(newDomainType) {
        this.domainType = newDomainType;
      },
      setParent: function setParent(parent) {
        this.parent = parent;
      },
      getParent: function getParent() {
        return this.parent;
      },
      _all: function _all(predicate, matches) {
        if (typeof matches === 'undefined') {
          var matches = [];
        }

        if (predicate(this)) {
          matches.push(this);
        }

        if (typeof this.getChildren === "function") {
          var children = this.getChildren();

          for (var ci in children) {
            this._all.call(children[ci], predicate, matches);
          }
        }

        return matches;
      },

      /**
       * Search inside a node for all the nodes of a specific domain type.
       *
       * @param {String}
       *            domainType - Domain type
       * @returns {Array} List of Nodes
       *
       */
      getSubNodesOfDomainType: function getSubNodesOfDomainType(domainType) {
        return this._all(function (n) {
          return n.domainType === domainType;
        });
      },

      /**
       * Search inside a node for all the nodes of a specific meta type.
       *
       * @param {String}
       *            metaType - Meta Type
       * @returns {Array} List of Nodes
       *
       */
      getSubNodesOfMetaType: function getSubNodesOfMetaType(metaType) {
        return this._all(function (n) {
          return n._metaType === metaType;
        });
      }
    })
  };
});
//# sourceMappingURL=Node.js.map