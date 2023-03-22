import * as THREE from 'three';

export default function Cylinder( props={ mat:null, pos:null, scl:null, radius:1, height:1 } ){
    const geo  = new THREE.CylinderGeometry( props.radius, props.radius, props.height, 32 );
    const mesh = new THREE.Mesh( geo, props.mat || new THREE.MeshBasicMaterial( { color: 0xffff00, transparent:true, opacity:0.5 } ) );

    if( props.pos ) mesh.position.fromArray( props.pos );
    if( props.scl ) mesh.scale.fromArray( [ props.scl, props.scl, props.scl ] );

    return mesh;
}