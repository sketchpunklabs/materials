import * as THREE       from 'three';
import ShapePointsMesh  from '../../lib/meshes/ShapePointsMesh.js';

export default function OrbitPointLight( scene, { radius=1, seconds=10, initPos=[0,0.5,0] } = {} ){
    // #region MAIN
    const target = initPos.slice();
    
    const pnt    = new ShapePointsMesh();
    pnt.add( [0,0,0], 0xffffff, 4 );
    scene.add( pnt );

    const lit    = new THREE.PointLight( 0xffffff, 1.0, 0, 2 );
    scene.add( lit );
    // #endregion
    
    // #region METHODS
    const setPos = p=>{
        pnt.position.fromArray( p );
        lit.position.fromArray( p );
    };

    const animate = et=>{
        const n      = et / seconds;
        const rad    = Math.PI * 2 * n;
        const radius = 1;
        target[ 0 ]  = radius * Math.cos( rad );
        target[ 2 ]  = radius * Math.sin( rad );
        setPos( target );
    };
    // #endregion
    return { setPos, animate };
}