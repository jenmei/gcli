/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define(function(require, exports, module) {
var cliView = exports;


var dom = require('gcli/util').dom;
var console = require('gcli/util').console;

var ArgFetcher = require('gcli/browser/arg_fetch').ArgFetcher;
var Menu = require('gcli/browser/menu').Menu;

var hinterCss = require('text!gcli/browser/hinter.css');

/**
 * We only want to import hinterCss once so this tracks whether or not we have
 * done it. Note technically it's only once per document, so perhaps we should
 * have a list of documents into which we've imported the CSS?
 */
var hinterCssImported = false;

/**
 * A container to show either an ArgFetcher or a Menu depending on the state
 * of the requisition.
 */
function Hinter(options) {
  options = options || {};

  this.doc = options.document;
  this.requ = options.requisition;

  if (!hinterCssImported) {
    dom.importCssString(hinterCss, this.doc);
    hinterCssImported = true;
  }

  this.element = dom.createElement('div', null, this.doc);
  this.element.className = 'gcliHintParent';

  this.hinter = dom.createElement('div', null, this.doc);
  this.hinter.className = 'gcliHints';
  this.element.appendChild(this.hinter);

  this.menu = options.menu || new Menu(this.doc, this.requ);
  this.hinter.appendChild(this.menu.element);

  this.argFetcher = options.argFetcher || new ArgFetcher(this.doc, this.requ);
  this.hinter.appendChild(this.argFetcher.element);

  this.requ.commandChange.add(this.onCommandChange, this);
  this.onCommandChange();
}

Hinter.prototype.setHeight = function(height) {
  this.element.style.maxHeight = height + 'px';
};

/**
 * Update the various hint components to reflect the changed command
 */
Hinter.prototype.onCommandChange = function(ev) {
  // We could decrease the cohesion between these components by having them
  // all register separate listeners. This method has the benefit of working
  // now, and being less complex from an ordering point of view
  var command = this.requ.commandAssignment.getValue();
  if (!command || !command.exec) {
    this.menu.show();
  }
  else {
    if (ev && ev.oldValue === ev.newValue) {
      return; // Just the text has changed
    }

    this.menu.hide();
  }
};

cliView.Hinter = Hinter;


});