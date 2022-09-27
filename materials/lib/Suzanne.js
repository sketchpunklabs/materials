
import { UtilGltf2, Gltf2 } from '../../lib/loaders/UtilGltf2.js';

const prepend = ( document.location.hostname.indexOf( 'localhost' ) === -1 )? '/materials' : '';

export default async function suzanne( mat, pos=[0,0.6,0] ){
    const gltf = await Gltf2.fetch( prepend + '/assets/suzanne/suzanne_hpoly.gltf' );
    const mesh = UtilGltf2.loadMesh( gltf, null, mat );
    mesh.position.fromArray( pos );
    return mesh;
}