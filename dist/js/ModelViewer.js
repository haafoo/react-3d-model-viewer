"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var THREE = _interopRequireWildcard(require("three"));

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls");

var _STLLoader = require("three/examples/jsm/loaders/STLLoader");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import testSTL from '../../examples/Torus_knot_1.stl'
// import testSTL from '../../examples/n2.stl'
var ModelViewer =
/*#__PURE__*/
function (_Component) {
  _inherits(ModelViewer, _Component);

  function ModelViewer(props) {
    var _this;

    _classCallCheck(this, ModelViewer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ModelViewer).call(this, props)); //ADD SCENE

    _defineProperty(_assertThisInitialized(_this), "start", function () {
      if (!_this.frameId) {
        _this.frameId = requestAnimationFrame(_this.animate);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "stop", function () {
      cancelAnimationFrame(_this.frameId);
    });

    _defineProperty(_assertThisInitialized(_this), "updateCanvasSize", function () {
      var canvas = _this.renderer.domElement;
      canvas.width = _this.mount.clientWidth;
      canvas.height = _this.mount.clientHeight;

      _this.renderer.setSize(_this.mount.clientWidth, _this.mount.clientHeight);

      _this.camera.aspect = _this.mount.clientWidth / _this.mount.clientHeight; // this.camera.fov = Math.atan(window.innerHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG
      // this.camera.fov = Math.atan(this.mount.clientHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG

      _this.camera.updateProjectionMatrix();
    });

    _defineProperty(_assertThisInitialized(_this), "animate", function () {
      _this.frameId = window.requestAnimationFrame(_this.animate);

      _this.control.update();

      _this.renderScene();
    });

    _defineProperty(_assertThisInitialized(_this), "renderScene", function () {
      // this.updateCanvasSize()
      if (_this.props.rotate) {
        _this.mesh.rotation.x += _this.props.rotationSpeeds[0];
        _this.mesh.rotation.y += _this.props.rotationSpeeds[1];
        _this.mesh.rotation.z += _this.props.rotationSpeeds[2];
      }

      _this.lightHolder.quaternion.copy(_this.camera.quaternion);

      _this.renderer.render(_this.scene, _this.camera);
    });

    _this.scene = new THREE.Scene();
    return _this;
  }

  _createClass(ModelViewer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      //ADD RENDERER
      this.renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("canvas"),
        // canvas: this.mount,
        antialias: true
      });
      this.renderer.setClearColor(this.props.backgroundColor);
      this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight); //ADD CAMERA

      this.camera = new THREE.PerspectiveCamera(35, this.mount.clientWidth / this.mount.clientHeight, 0.1, 10000); // ADD LIGHTS

      this.scene.add(new THREE.AmbientLight(0x736F6E, 0.5));
      this.light = new THREE.DirectionalLight(0xFFFFFF, 1);
      this.light.position.set(0, 10, 10);
      this.lightHolder = new THREE.Group();
      this.lightHolder.add(this.light);
      this.scene.add(this.lightHolder); // ADD CONTROL

      this.control = new _OrbitControls.OrbitControls(this.camera, this.renderer.domElement);
      this.control.rotateLeft(this.props.initControlPosition[0]);
      this.control.rotateUp(this.props.initControlPosition[1]);
      this.control.dollyOut(this.props.initControlPosition[2]);
      this.mount.appendChild(this.renderer.domElement); // ADD GEOMETRY

      var context = this;
      this.loader = new _STLLoader.STLLoader();
      this.loader.load(this.props.url, function (geometry) {
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.center();
        context.mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
          color: _this2.props.color
        }));
        var xDims = context.mesh.geometry.boundingBox.max.x - context.mesh.geometry.boundingBox.min.x;
        var yDims = context.mesh.geometry.boundingBox.max.y - context.mesh.geometry.boundingBox.min.y;
        var zDims = context.mesh.geometry.boundingBox.max.z - context.mesh.geometry.boundingBox.min.z;
        context.camera.position.set(0, 0, Math.max(xDims * 3, yDims * 3, zDims * 3));
        context.scene.add(context.mesh);
        context.start();
      }, null, function (err) {
        console.warn("Unable to load file ".concat(_this2.props.url, ":").concat(err));
        console.warn(err); // ADD CUBE

        _this2.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({
          color: _this2.props.color
        }));

        _this2.camera.position.set(0, 0, 3);

        _this2.scene.add(_this2.mesh);

        _this2.start();
      });
      window.addEventListener('resize', this.updateCanvasSize, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.updateCanvasSize, false);
      this.stop();
      this.mount.removeChild(this.renderer.domElement);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return _react.default.createElement("div", {
        style: {
          position: 'relative',
          width: this.props.width,
          // maxWidth: this.props.maxWidth,
          paddingBottom: this.props.aspectRatio
        }
      }, _react.default.createElement("div", {
        ref: function ref(mount) {
          _this3.mount = mount;
        },
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }
      }, _react.default.createElement("canvas", {
        style: {
          width: '100%',
          height: '100%'
        },
        width: '100%',
        height: '100%'
      })));
    }
  }]);

  return ModelViewer;
}(_react.Component);

ModelViewer.defaultProps = {
  // url: './Torus_knot_1.stl', // binary - https://commons.wikimedia.org/wiki/File:Torus_knot_1.stl
  // url: 'n2.stl', // ascii - http://pub.ist.ac.at/~edels/Tubes/
  url: './test_model.stl',
  width: '100%',
  // maxWidth: '42rem',
  aspectRatio: '56.125%',
  color: '#FDD017',
  backgroundColor: '#EAEAEA',
  rotate: true,
  rotationSpeeds: [0.01, 0.01, 0],
  initControlPosition: [0, 0, 1.0]
};
var _default = ModelViewer;
exports.default = _default;