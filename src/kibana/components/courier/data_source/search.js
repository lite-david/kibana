define(function (require) {
  var inherits = require('utils/inherits');
  var _ = require('lodash');

  require('./abstract');

  var module = require('modules').get('kibana/courier');

  module.factory('CouriersSearchSource', function (couriersErrors, CouriersSourceAbstract, Promise) {
    var FetchFailure = couriersErrors.FetchFailure;
    var RequestFailure = couriersErrors.RequestFailure;


    function SearchSource(courier, initialState) {
      CouriersSourceAbstract.call(this, courier, initialState);
    }
    inherits(SearchSource, CouriersSourceAbstract);

    /*****
     * PUBLIC API
     *****/

    /**
     * List of the editable state properties that turn into a
     * chainable API
     *
     * @type {Array}
     */
    SearchSource.prototype._methods = [
      'index',
      'indexInterval', // monthly, daily, etc
      'type',
      'query',
      'filter',
      'sort',
      'highlight',
      'aggs',
      'from',
      'size',
      'source'
    ];

    /**
     * Set a searchSource that this source should inherit from
     * @param  {SearchSource} searchSource - the parent searchSource
     * @return {this} - chainable
     */
    SearchSource.prototype.inherits = function (parent) {
      this._parent = parent;
      return this;
    };

    /**
     * Get the parent of this SearchSource
     * @return {SearchSource}
     */
    SearchSource.prototype.parent = function () {
      return this._parent;
    };


    /**
     * Get the mapping for the index of this SearchSource
     * @return {Promise}
     */
    SearchSource.prototype.getFields = function () {
      return this._courier._mapper.getFields(this);
    };

    /******
     * PRIVATE APIS
     ******/

    /**
     * Gets the type of the DataSource
     * @return {string}
     */
    SearchSource.prototype._getType = function () {
      return 'search';
    };

    /**
     * Used to merge properties into the state within ._flatten().
     * The state is passed in and modified by the function
     *
     * @param  {object} state - the current merged state
     * @param  {*} val - the value at `key`
     * @param  {*} key - The key of `val`
     * @return {undefined}
     */
    SearchSource.prototype._mergeProp = function (state, val, key) {
      if (typeof val === 'function') {
        var source = this;
        return Promise.cast(val(source)).then(function (res) {
          return source._mergeProp(state, res, key);
        });
      }

      if (val == null) return;

      switch (key) {
      case 'filter':
        state.filters = state.filters || [];
        state.filters.push(val);
        return;
      case 'index':
      case 'type':
      case 'id':
        if (key && state[key] == null) {
          state[key] = val;
        }
        return;
      case 'source':
        key = '_source';
        /* fall through */
      default:
        state.body = state.body || {};
        if (key && state.body[key] == null) {
          state.body[key] = val;
        }
      }
    };

    return SearchSource;
  });
});