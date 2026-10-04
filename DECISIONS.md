# DECISIONS.md

## Project
AgriVision X1 — AI Smart Agriculture Drone

## 1. 3D approach
I used Three.js to create the product model from basic geometries instead of requiring a large external `.glb` model. This keeps the project lightweight, portable and easy to deploy on GitHub Pages.

## 2. Interaction
OrbitControls provides drag-to-rotate and scroll-to-zoom. Auto-rotation is enabled so the product remains visually active when the user is not interacting.

## 3. Performance decision
The renderer caps device pixel ratio at 2. This avoids unnecessarily expensive rendering on high-DPI mobile screens while keeping the 3D model sharp.

## 4. UI
The page uses a dark agricultural-tech visual language with green accents to communicate sustainability and AI. The four feature cards open a reusable modal rather than requiring separate pages.

## 5. Deployment
The project is static HTML/CSS/JavaScript and can be hosted directly with GitHub Pages.
