import * as THREE from 'three';

export default function Plane( props ){
    props = Object.assign( { mat:null, w:1, h:1, c:1, r:1, ground:false, pos:null }, props );

    const geo  = new THREE.PlaneGeometry( props.w, props.h, props.c, props.r );
    if( props.ground ) geo.rotateX( Math.PI * -0.5 );

    const mesh = new THREE.Mesh( geo, props.mat || 
        new THREE.MeshBasicMaterial({ 
            color       : 0xffff00, 
            transparent : true, 
            opacity     : 0.5, 
            side        : THREE.DoubleSide,
        })    
    );

    if( props.pos ) mesh.position.fromArray( props.pos );
    // mesh.frustumCulled = false;
    // mesh.renderOrder   = -900;

    return mesh;
}