import React, { Component } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class ModelViewer extends Component {
  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    //ADD SCENE
    this.scene = new THREE.Scene()

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      35,
      width / height,
      0.1,
      10000
    )
    this.camera.position.z = 4

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#EAEAEA')
    this.renderer.setSize(width, height)

    //ADD CUBE
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    // const material = new THREE.MeshBasicMaterial({ color: '#B92C2C' })
    const material = new THREE.MeshLambertMaterial({ ambient: 0xFBB917, color: 0xFDD017 })
    this.cube = new THREE.Mesh(geometry, material)
    this.scene.add(this.cube)

    // ADD LIGHTS
    this.scene.add(new THREE.AmbientLight(0x736F6E, 0.5))
    this.light = new THREE.DirectionalLight(0xFFFFFF, 1)
    // this.light.position.set(this.camera.position)
    this.light.position.set(0,10,10)
    this.lightHolder = new THREE.Group()
    this.lightHolder.add(this.light)
    this.scene.add(this.lightHolder)


    // ADD CONTROL
    this.control = new OrbitControls( this.camera, this.renderer.domElement )

    this.mount.appendChild(this.renderer.domElement, )

    this.start()
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
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01
    this.frameId = window.requestAnimationFrame(this.animate)
    this.control.update()

    this.lightHolder.quaternion.copy(this.camera.quaternion)

    this.renderScene()
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return(
      <div
        style={{ width: '400px', height: '400px' }}
        ref={mount => {
          this.mount = mount
          }}
      />
    )
  }
}

export default ModelViewer