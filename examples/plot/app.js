/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import DeckGLOverlay from './deckgl-overlay.js';
import OrbitController from './orbit-controller';

const equation = (x, y) => {
  return Math.sin(x * x + y * y) * x / Math.PI;
};

class Root extends Component {

  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        lookAt: [0, 0, 0],
        distance: 3,
        rotationX: -30,
        rotationY: 30,
        fov: 50,
        minDistance: 1,
        maxDistance: 20,
        width: 500,
        height: 500
      }
    };

    this._resize = this._resize.bind(this);
    this._onChangeViewport = this._onChangeViewport.bind(this);
    this._onHover = this._onHover.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  _resize() {
    this._onChangeViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onChangeViewport(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _onHover(info) {
    const hoverInfo = info.sample ? info : null;
    if (hoverInfo !== this.state.hoverInfo) {
      this.setState({hoverInfo});
    }
  }

  render() {
    const {viewport, hoverInfo} = this.state;

    return (
      <OrbitController
        {...viewport}
        onChangeViewport={this._onChangeViewport} >
        <DeckGLOverlay
          viewport={viewport}
          equation={equation}
          resolution={200}
          showAxis={true}
          onHover={this._onHover} />

        {hoverInfo && <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}} >
          { hoverInfo.sample.map(x => x.toFixed(3)).join(', ') }
        </div>}

      </OrbitController>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
