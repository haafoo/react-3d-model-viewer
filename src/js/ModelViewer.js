import React, { Component } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader'
import { kMaxLength } from 'buffer'

// the following is a work-around for the way the three.js 3MFLoader uses jszip
// if this changes in the future, can also get rid of the requirement for the expose-loader module
require("expose-loader?JSZip!jszip")

class ModelViewer extends Component {
  constructor(props) {
    super(props)

    //ADD SCENE
    this.scene = new THREE.Scene()
  }

  componentDidMount() {
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("canvas"),
      // canvas: this.mount,
      antialias: true
    })
    this.renderer.setClearColor(this.props.backgroundColor)
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight)

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      35,
      this.mount.clientWidth / this.mount.clientHeight,
      0.1,
      10000
    )

    // ADD LIGHTS
    this.scene.add(new THREE.AmbientLight(0x736F6E, 0.5))
    this.light = new THREE.DirectionalLight(0xFFFFFF, 1)
    this.light.position.set(0,10,10)
    this.lightHolder = new THREE.Group()
    this.lightHolder.name = 'lightHolder'
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
    const re_ext = /(?:\.([^.]+))?$/i
    const fileType = re_ext.exec(this.props.url)[1]
    if (fileType == 'stl') {
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

          // context.axes = new THREE.AxesHelper(24)
          // context.box = new THREE.BoxHelper(context.mesh, 0xff0000)
          context.modelGroup = new THREE.Group()
          context.modelGroup.name = 'modelGroup'
          context.modelGroup.add(context.mesh)

          var xDims = context.mesh.geometry.boundingBox.max.x - context.mesh.geometry.boundingBox.min.x 
          var yDims = context.mesh.geometry.boundingBox.max.y - context.mesh.geometry.boundingBox.min.y 
          var zDims = context.mesh.geometry.boundingBox.max.z - context.mesh.geometry.boundingBox.min.z 

          context.camera.position.set(0, 0, Math.max(xDims*3, yDims*3, zDims*3))

          context.scene.add(context.modelGroup)
          // context.scene.add(context.box)
          // context.scene.add(context.axes)
          context.start()
        },
        null,
        () => cubeModel(context)
      )

    } else if (re_ext.exec(this.props.url)[1] == '3mf') {
      this.loader = new ThreeMFLoader()

      this.loader.load(
        this.props.url,
        object => {

          object.children[0].children[0].geometry.center()
          const mesh = object.children[0].children[0]

          const xDims = mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x 
          const yDims = mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y 
          const zDims = mesh.geometry.boundingBox.max.z - mesh.geometry.boundingBox.min.z 

          //mesh.geometry.translate(0,0,zDims/-2)

          mesh.material.color = new THREE.Color(this.props.color)
          mesh.material.shininess = 0

          context.camera.position.set(0, 0, Math.max(xDims*3, yDims*3, zDims*3))
          context.modelGroup = object
          context.modelGroup.name = 'modelGroup'

          // context.axes = new THREE.AxesHelper(24)
          // context.box = new THREE.BoxHelper(mesh, 0xff0000)

          context.scene.add(object)
          // context.scene.add(context.box)
          // context.scene.add(context.axes)
          context.start()
        },
        null,
        () => cubeModel(context)
      )
    } else {
      const err = new TypeError(`Unknown 3d file type: ${this.props.url}`)
      console.error(err)
      cubeModel(context)
    }

    function cubeModel(context) {
      // ADD CUBE
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshLambertMaterial({
          // context: this.props.color 
        })
      )

      // context.box = new THREE.BoxHelper(mesh, 0xff0000)

      context.modelGroup = new THREE.Group()
      context.modelGroup.name = 'modelGroup'
      context.modelGroup.add(mesh)

      context.camera.position.set(0, 0, 3)
      context.scene.add(context.modelGroup)
      // context.scene.add(context.box)
      context.start()
    }

    window.addEventListener('resize', this.updateCanvasSize, false)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateCanvasSize, false)
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

  updateCanvasSize = () => {
    const canvas = this.renderer.domElement
    canvas.width = this.mount.clientWidth
    canvas.height = this.mount.clientHeight
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight)
    this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight
    // this.camera.fov = Math.atan(window.innerHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG
    // this.camera.fov = Math.atan(this.mount.clientHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG
    this.camera.updateProjectionMatrix()
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate)
    this.control.update()
    this.renderScene()
  }

  renderScene = () => {
    // this.updateCanvasSize()
    if (this.props.rotate) {
      this.modelGroup.rotation.x += this.props.rotationSpeeds[0]
      this.modelGroup.rotation.y += this.props.rotationSpeeds[1]
      this.modelGroup.rotation.z += this.props.rotationSpeeds[2]
    }
    // this.box.update()
    this.lightHolder.quaternion.copy(this.camera.quaternion)
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return(
      <div style={{
        position: 'relative',
        width: this.props.width,
        // maxWidth: this.props.maxWidth,
        paddingBottom: this.props.aspectRatio
      }}>
      <div
        ref={mount => {
          this.mount = mount
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height:'100%' 
        }}
      >
        <canvas
        style={{
          width: '100%',
          height:'100%' 
        }}
          width={'100%'}
          height={'100%'}
        >
        </canvas>
      </div>
      </div>
    )
  }
}

/*
 *  When running project with dev server put the model files in /dist (as opposed to /examples/dist)
 */
ModelViewer.defaultProps = {
  // url: './Torus_knot_1.stl', // binary - https://commons.wikimedia.org/wiki/File:Torus_knot_1.stl
  // url: './n2.stl', // ascii - http://pub.ist.ac.at/~edels/Tubes/
  // url: './test_model.stl', // torus_knot
  url: './test_model.3mf', // torus
  // width: '100%',
  // maxWidth: '42rem',
  aspectRatio: '56.125%',
  color: '#FDD017',
  backgroundColor: '#EAEAEA',
  rotate: true,
  rotationSpeeds: [0.01,0.01,0],
  initControlPosition: [0, 0, 1.0]
}

export default ModelViewer