/**
 * @typedef {Object} EmbeddableMetadata - data that does not change over the course of the embeddables life span.
 * @property {string} title
 * @property {string|undefined} editUrl
 * @property {IndexPattern} indexPattern
 */


export class Embeddable {
  /**
   *
   * @param {Object|undefined} config
   * @param {EmbeddableMetadata|undefined} config.metadata optional metadata
   * @param {function|undefined} config.render optional render method
   * @param {function|undefined} config.destroy optional destroy method
   * @param {function|undefined} config.onContainerStateChanged optional onContainerStateChanged method
   */
  constructor(config = {}) {
    /**
     * @type {EmbeddableMetadata}
     */
    this.metadata = config.metadata || {};

    if (config.render) {
      this.render = config.render;
    }

    if (config.destroy) {
      this.destroy = config.destroy;
    }

    if (config.onContainerStateChanged) {
      this.onContainerStateChanged = config.onContainerStateChanged;
    }
  }

  /**
   * @param {ContainerState} containerState
   */
  onContainerStateChanged(/*containerState*/) {}

  /**
   * @param {Element} domNode - the dom node to mount the rendered embeddable on
   */
  render(/*domNode*/) {}

  destroy() {}
}
