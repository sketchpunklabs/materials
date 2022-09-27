import * as THREE from 'three';

export default function FloorPlane( props={ mat:null, w:1, h:1 } ){
    const geo = new THREE.PlaneGeometry( props.w, props.h );
    geo.rotateX( -Math.PI * 0.5 ); // Uses matrices, but also rotates normals
    
    // let y, z, ary = geo.attributes.position.array;
    // for( i=0; i < ary.length; i+=3 ){
    //     y = ary[ i+1 ];
    //     z = ary[ i+2 ];
    //     ary[ i+1 ] = z;
    //     ary[ i+2 ] = -y;
    // }

    return new THREE.Mesh( geo, props.mat || new THREE.MeshBasicMaterial() );
}