import { auth } from './classes/sync'
import HalloweenVisualizer from './halloween_visualizer'

if (window.location.hash === '#start') {
  // const template = new Template()
  const visualizer = new HalloweenVisualizer()
} else {
  auth()
}