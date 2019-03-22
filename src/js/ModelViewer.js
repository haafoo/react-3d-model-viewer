import React, { Component } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
// import testSTL from '../../examples/Torus_knot_1.stl'
// import testSTL from '../../examples/n2.stl'

class ModelViewer extends Component {
  constructor(props) {
    super(props)

    //ADD SCENE
    this.scene = new THREE.Scene()
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      35,
      width / height,
      0.1,
      10000
    )

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor(this.props.backgroundColor)
    this.renderer.setSize(width, height)

    // ADD LIGHTS
    this.scene.add(new THREE.AmbientLight(0x736F6E, 0.5))
    this.light = new THREE.DirectionalLight(0xFFFFFF, 1)
    this.light.position.set(0,10,10)
    this.lightHolder = new THREE.Group()
    this.lightHolder.add(this.light)
    this.scene.add(this.lightHolder)

    // ADD CONTROL
    this.control = new OrbitControls( this.camera, this.renderer.domElement )
    this.control.rotateLeft(this.props.initControlPosition[0])
    this.control.rotateUp(this.props.initControlPosition[1])
    this.control.dollyOut(this.props.initControlPosition[2])

    this.mount.appendChild(this.renderer.domElement)

    // ADD GEOMETRY
    var context = this
    this.loader = new STLLoader()
    this.loader.load(
      this.props.url,
      geometry => {
        geometry.computeFaceNormals()
        geometry.computeVertexNormals()
        geometry.center()

        context.mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshLambertMaterial({
            color: this.props.color
          })
        )

        var xDims = context.mesh.geometry.boundingBox.max.x - context.mesh.geometry.boundingBox.min.x 
        var yDims = context.mesh.geometry.boundingBox.max.y - context.mesh.geometry.boundingBox.min.y 
        var zDims = context.mesh.geometry.boundingBox.max.z - context.mesh.geometry.boundingBox.min.z 

        context.camera.position.set(0, 0, Math.max(xDims*3, yDims*3, zDims*3))

        context.scene.add(context.mesh)
        context.start()
      },
      null,
      err => {
        console.warn(`Unable to laod file ${this.props.url}:${err}`)
        console.warn(err)
        // ADD CUBE
        this.mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshLambertMaterial({
            color: this.props.color 
          })
        )
        this.camera.position.set(0, 0, 3)
        this.scene.add(this.mesh)
        this.start()
      }
    )
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate)
    this.control.update()

    this.renderScene()
  }

  renderScene = () => {
    if (this.props.rotate) {
      this.mesh.rotation.x += this.props.rotationSpeeds[0]
      this.mesh.rotation.y += this.props.rotationSpeeds[1]
      this.mesh.rotation.z += this.props.rotationSpeeds[2]
    }
    this.lightHolder.quaternion.copy(this.camera.quaternion)
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return(
      <div
        style={{ width: this.props.width, height: this.props.height }}
        ref={mount => {
          this.mount = mount
          }}
      />
    )
  }
}

ModelViewer.defaultProps = {
  // url: './Torus_knot_1.stl', // binary - https://commons.wikimedia.org/wiki/File:Torus_knot_1.stl
  // url: 'n2.stl', // ascii - http://pub.ist.ac.at/~edels/Tubes/
  url: './test_model.stl',
  width: '400px',
  height: '400px',
  color: '#FDD017',
  backgroundColor: '#EAEAEA',
  rotate: true,
  rotationSpeeds: [0.01,0.01,0],
  initControlPosition: [0, 0, 1.0]
}

export default ModelViewer