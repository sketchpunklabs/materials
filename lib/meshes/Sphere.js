import * as THREE from 'three';

export default function Sphere( props={ mat:null, pos:null, scl:null, radius:1 } ){
    const geo  = new THREE.SphereGeometry( props.radius, 24, 24 );
    const mesh = new THREE.Mesh( geo, props.mat || new THREE.MeshBasicMaterial( { color: 0xffff00, transparent:true, opacity:0.5 } ) );

    if( props.pos ) mesh.position.fromArray( props.pos );
    if( props.scl ) mesh.scale.fromArray( [ props.scl, props.scl, props.scl ] );

    return mesh;
}