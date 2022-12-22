import * as THREE from 'three';

// Create a cube with its origin at the bottom left back corner
export default class Cube{
    static mesh( props = {mat:null, pos:null, scl:null, size:[1,1,1], offset:[-0.5,-0.5,-0.5]} ){
        const geo  = this.get( props.size, props.offset );
        const bGeo = new THREE.BufferGeometry();
        bGeo.setIndex( new THREE.BufferAttribute( geo.indices, 1 ) );
        bGeo.setAttribute( 'position',  new THREE.BufferAttribute( geo.vertices, 3 ) );
        bGeo.setAttribute( 'normal',    new THREE.BufferAttribute( geo.normals,  3 ) );
        bGeo.setAttribute( 'uv',        new THREE.BufferAttribute( geo.texcoord, 2 ) );

        const mesh = new THREE.Mesh( bGeo, props.mat || new THREE.MeshPhongMaterial( { color:0x009999 } ) );
        if( props.pos )			mesh.position.fromArray( props.pos );
        if( props.scl != null )	mesh.scale.set( props.scl, props.scl, props.scl );
    
        return mesh; 
    }

    static lineMesh( props = {mat:null, pos:null, scl:null, size:[1,1,1], offset:[-0.5,-0.5,-0.5]} ){
        const geo  = this.getLine( props.size, props.offset );
        const bGeo = new THREE.BufferGeometry();
        bGeo.setIndex( new THREE.BufferAttribute( geo.indices, 1 ) );
        bGeo.setAttribute( 'position',  new THREE.BufferAttribute( geo.vertices, 3 ) );

        const mesh = new THREE.LineSegments( bGeo, props.mat || new THREE.LineBasicMaterial( { color: 0x00ffff } ) );
        if( props.pos )			mesh.position.fromArray( props.pos );
        if( props.scl != null )	mesh.scale.set( props.scl, props.scl, props.scl );
        return mesh; 
    }

    static corner( props={mat:null, pos:null, scl:null, isLine:false } ){
        props.size   = [1,1,1];
        props.offset = [0,0,0];
        return ( props.isLine )? this.lineMesh( props ) : this.mesh( props );
    }

    static floor( props={mat:null, pos:null, scl:null, isLine:false } ){
        props.size   = [1,1,1];
        props.offset = [-0.5,0,-0.5];
        return ( props.isLine )? this.lineMesh( props ) : this.mesh( props );
    }
    
    static get( size=[1,1,1], offset=[-0.5,-0.5,-0.5] ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const x1 = size[0] + offset[ 0 ], 
              y1 = size[1] + offset[ 1 ], 
              z1 = size[2] + offset[ 2 ],
              x0 = offset[ 0 ], 
              y0 = offset[ 1 ],  
              z0 = offset[ 2 ];

        // Starting bottom left corner, then working counter clockwise to create the front face.
        // Backface is the first face but in reverse (3,2,1,0)
        // keep each quad face built the same way to make index and uv easier to assign
        const vert = [
            x0, y1, z1, 	//0 Front
            x0, y0, z1, 	//1
            x1, y0, z1, 	//2
            x1, y1, z1, 	//3 

            x1, y1, z0, 	//4 Back
            x1, y0, z0, 	//5
            x0, y0, z0, 	//6
            x0, y1, z0, 	//7 

            x1, y1, z1, 	//3 Right
            x1, y0, z1, 	//2 
            x1, y0, z0, 	//5
            x1, y1, z0, 	//4

            x0, y0, z1, 	//1 Bottom
            x0, y0, z0, 	//6
            x1, y0, z0, 	//5
            x1, y0, z1, 	//2

            x0, y1, z0, 	//7 Left
            x0, y0, z0, 	//6
            x0, y0, z1, 	//1
            x0, y1, z1, 	//0

            x0, y1, z0, 	//7 Top
            x0, y1, z1, 	//0
            x1, y1, z1, 	//3
            x1, y1, z0, 	//4
        ];

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //Build the index of each quad [0,1,2, 2,3,0]
        let i;
        const idx = [];
        for( i=0; i < vert.length / 3; i+=2) idx.push( i, i+1, ( Math.floor( i / 4 ) * 4 ) + ( ( i + 2 ) % 4 ) );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //Build UV data for each vertex
        const uv = [];
        for( i=0; i < 6; i++) uv.push( 0,0,	 0,1,  1,1,  1,0 );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return { 
            vertices    : new Float32Array( vert ),
            indices     : new Uint16Array( idx ),
            texcoord    : new Float32Array( uv ), 
            normals     : new Float32Array( [ // Left/Right have their xNormal flipped to render correctly in 3JS, Why does normals need to be mirrored on X?
                0, 0, 1,	 0, 0, 1,	 0, 0, 1,	 0, 0, 1,		//Front
                0, 0,-1,	 0, 0,-1,	 0, 0,-1,	 0, 0,-1,		//Back
                1, 0, 0,	 1, 0, 0,	 1, 0, 0,	 1, 0, 0,		//Left
                0,-1, 0,	 0,-1, 0,	 0,-1, 0,	 0,-1, 0,		//Bottom
                -1, 0, 0,	 -1, 0, 0,	 -1, 0, 0,	 -1, 0, 0,		//Right
                0, 1, 0,	 0, 1, 0,	 0, 1, 0,	 0, 1, 0		//Top
            ] ),
        };
    }

    static getLine( size=[1,1,1], offset=[-0.5,-0.5,-0.5] ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const x1 = size[0] + offset[ 0 ], 
              y1 = size[1] + offset[ 1 ], 
              z1 = size[2] + offset[ 2 ],
              x0 = offset[ 0 ], 
              y0 = offset[ 1 ],  
              z0 = offset[ 2 ];

        // Starting bottom left corner, then working counter clockwise to create the front face.
        // Backface is the first face but in reverse (3,2,1,0)
        // keep each quad face built the same way to make index and uv easier to assign

        return { 
            vertices    : new Float32Array( [
                x0, y1, z1, 	//0 Front
                x0, y0, z1, 	//1
                x1, y0, z1, 	//2
                x1, y1, z1, 	//3 
    
                x1, y1, z0, 	//4 Back
                x1, y0, z0, 	//5
                x0, y0, z0, 	//6
                x0, y1, z0, 	//7 
            ] ),

            indices     : new Uint16Array( [
                0,1, 1,2, 2,3, 3,0,
                4,5, 5,6, 6,7, 7,4,
                0,7, 1,6, 2,5, 3,4,
            ] ),
        };
    }
}