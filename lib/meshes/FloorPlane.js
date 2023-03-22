import * as THREE from 'three';

export default function FloorPlane( props ){
    props = Object.assign( { mat:null, size:1, w:0, h:0, y:0 }, props );

    const geo = new THREE.PlaneGeometry( props.w || props.size, props.h || props.size );
    geo.rotateX( -Math.PI * 0.5 ); // Uses matrices, but also rotates normals
    
    // let y, z, ary = geo.attributes.position.array;
    // for( i=0; i < ary.length; i+=3 ){
    //     y = ary[ i+1 ];
    //     z = ary[ i+2 ];
    //     ary[ i+1 ] = z;
    //     ary[ i+2 ] = -y;
    // }

    const mesh = new THREE.Mesh( geo, props.mat || new THREE.MeshBasicMaterial() );
    if( props.y ) mesh.position.y =  props.y;
    
    return mesh;
}