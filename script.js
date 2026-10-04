import * as THREE from "https://esm.sh/three@0.170.0";
import { OrbitControls } from "https://esm.sh/three@0.170.0/examples/jsm/controls/OrbitControls.js";

const host=document.getElementById("scene");
const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x07100b,0.055);
const camera=new THREE.PerspectiveCamera(42,host.clientWidth/host.clientHeight,.1,100);
camera.position.set(5.8,3.5,6.8);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(host.clientWidth,host.clientHeight);
renderer.shadowMap.enabled=true;
renderer.outputColorSpace=THREE.SRGBColorSpace;
host.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xc8f6d0,0x102016,2.4));
const key=new THREE.DirectionalLight(0xb7ff9c,4.5); key.position.set(4,7,5); key.castShadow=true; scene.add(key);
const rim=new THREE.PointLight(0x55ff88,18,16); rim.position.set(-4,2,-3); scene.add(rim);

const drone=new THREE.Group(); scene.add(drone);
const bodyMat=new THREE.MeshStandardMaterial({color:0x18231b,metalness:.72,roughness:.27});
const darkMat=new THREE.MeshStandardMaterial({color:0x0b120e,metalness:.55,roughness:.3});
const accentMat=new THREE.MeshStandardMaterial({color:0x8bea58,emissive:0x1b4b18,emissiveIntensity:1.35,metalness:.35,roughness:.25});
const glassMat=new THREE.MeshPhysicalMaterial({color:0x8edff0,transparent:true,opacity:.52,metalness:.15,roughness:.08,transmission:.2});
const tankMat=new THREE.MeshPhysicalMaterial({color:0x8bea58,transparent:true,opacity:.72,roughness:.18,metalness:.1});

function box(x,y,z,sx,sy,sz,mat=bodyMat){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat);m.position.set(x,y,z);m.castShadow=true;drone.add(m);return m}
function cyl(x,y,z,r,d,mat=bodyMat,rot=[0,0,0]){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d,32),mat);m.position.set(x,y,z);m.rotation.set(...rot);m.castShadow=true;drone.add(m);return m}

// Main agricultural-drone body
box(0,0,0,2.55,.5,1.45);
box(0,.27,0,1.55,.24,1.08,accentMat);
box(0,.43,0,1.05,.09,.76,glassMat);

// Central spray tank
const tank=new THREE.Mesh(new THREE.CylinderGeometry(.62,.72,.82,32),tankMat);
tank.position.set(0,-.48,0); tank.scale.z=.82; tank.castShadow=true; drone.add(tank);
cyl(0,-.06,0,.16,.12,darkMat);

// Front AI camera + gimbal
cyl(0,-.34,-.78,.29,.22,darkMat,[Math.PI/2,0,0]);
cyl(0,-.47,-.79,.15,.06,accentMat,[Math.PI/2,0,0]);
const lens=new THREE.Mesh(new THREE.SphereGeometry(.075,20,12),glassMat); lens.position.set(0,-.48,-.91); drone.add(lens);

// Four reinforced arms and motors
const propellers=[];
for(const x of [-1.72,1.72]){
  for(const z of [-.52,.52]){
    box(x,0,z,1.25,.22,.26,darkMat);
    cyl(x,.08,z,.28,.34,bodyMat);
    const prop=new THREE.Group(); prop.position.set(x,.36,z); drone.add(prop); propellers.push(prop);
    const p1=new THREE.Mesh(new THREE.BoxGeometry(1.18,.028,.09),accentMat); prop.add(p1);
    const p2=new THREE.Mesh(new THREE.BoxGeometry(1.18,.028,.09),accentMat); p2.rotation.y=Math.PI/2; prop.add(p2);
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.08,20),darkMat); cap.position.y=.02; prop.add(cap);
  }
}

// Spray boom and nozzles
box(0,-.82,0,3.55,.08,.1,accentMat);
for(const x of [-1.35,-.68,0,.68,1.35]){
  cyl(x,-.94,.03,.055,.18,accentMat);
  const nozzle=new THREE.Mesh(new THREE.ConeGeometry(.065,.16,20),darkMat); nozzle.position.set(x,-1.03,.03); nozzle.rotation.x=Math.PI; drone.add(nozzle);
}

// Landing gear
for(const x of [-.9,.9]){
  box(x,-.52,.48,.11,.7,.11,darkMat);
  box(x,-.85,0,.72,.08,.12,accentMat);
}

// Small status lights
for(const x of [-.82,.82]){const l=new THREE.Mesh(new THREE.SphereGeometry(.055,16,10),accentMat);l.position.set(x,.31,-.56);drone.add(l)}

const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.minDistance=4.2;
controls.maxDistance=9.5;
controls.target.set(0,-.15,0);
controls.autoRotate=true;
controls.autoRotateSpeed=1.25;

const floor=new THREE.Mesh(new THREE.CircleGeometry(4.5,64),new THREE.MeshBasicMaterial({color:0x0b1a10,transparent:true,opacity:.48}));
floor.rotation.x=-Math.PI/2; floor.position.y=-1.13; scene.add(floor);
const grid=new THREE.GridHelper(9,18,0x294e31,0x14291a);grid.position.y=-1.12;grid.material.transparent=true;grid.material.opacity=.35;scene.add(grid);

function resize(){const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}
addEventListener("resize",resize);

function animate(){
  requestAnimationFrame(animate);
  propellers.forEach(p=>p.rotation.y+=.13);
  controls.update();
  renderer.render(scene,camera);
}
animate();

const modal=document.getElementById("modal"), title=document.getElementById("modalTitle"), text=document.getElementById("modalText");
document.querySelectorAll(".card").forEach(card=>card.querySelector("button").onclick=()=>{title.textContent=card.dataset.title;text.textContent=card.dataset.text;modal.classList.add("show")});
document.getElementById("close").onclick=()=>modal.classList.remove("show");
modal.onclick=e=>{if(e.target===modal)modal.classList.remove("show")};
document.getElementById("infoBtn").onclick=()=>document.getElementById("features").scrollIntoView({behavior:"smooth"});
document.getElementById("scanBtn").onclick=()=>{const toast=document.getElementById("toast");toast.classList.add("show");drone.scale.set(1.08,1.08,1.08);setTimeout(()=>drone.scale.set(1,1,1),600);setTimeout(()=>toast.classList.remove("show"),3500)};
