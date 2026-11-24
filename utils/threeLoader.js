// ES Module bridge loading Three.js, OrbitControls, RoomEnvironment, GLTFExporter, and STLExporter

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';

window.ThreeKit = {
  THREE,
  OrbitControls,
  RoomEnvironment,
  GLTFExporter,
  STLExporter,
};

window.dispatchEvent(new CustomEvent('threekit-ready'));
