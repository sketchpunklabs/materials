import * as THREE from 'three';

export default class GridAlternative{

    static geometry( width=1, height=1, xCells=2, yCells=2, fromCenter=true ){
        const rtn = {
            vertices : [],
            indices  : [],
            texcoord : [],
            normals  : [],
        };

        this._genVertices( rtn.vertices, width, height, xCells, yCells, fromCenter );
        this._genAltIndices( rtn.indices, xCells+1, yCells+1, 0, true );
        this._genTexcoord( rtn.texcoord, xCells, yCells );
        this._repeatVec( rtn.normals, rtn.vertices.length / 3, 0, 1, 0 );

        return rtn;
    }

    static geometryBuffer( width=1, height=1, xCells=2, yCells=2, fromCenter=true ){
        const geo = this.geometry( width, height, xCells, yCells, fromCenter );
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const bGeo = new THREE.BufferGeometry();
        bGeo.setIndex( geo.indices );
        bGeo.setAttribute( 'position',  new THREE.BufferAttribute( new Float32Array( geo.vertices ), 3 ) );
        bGeo.setAttribute( 'normal',    new THREE.BufferAttribute( new Float32Array( geo.normals ), 3 ) );
        bGeo.setAttribute( 'uv',        new THREE.BufferAttribute( new Float32Array( geo.texcoord ), 2 ) );

        return bGeo;
    }

    static mesh( mat, width=1, height=1, xCells=2, yCells=2, fromCenter=true,wireFrame=false ){
        const bGeo = this.geometryBuffer( width, height, xCells, yCells, fromCenter );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        mat = mat || new THREE.MeshPhongMaterial( { color:0x009999 } ); // ,side:THREE.DoubleSide
        const mesh = new THREE.Mesh( bGeo, mat );

        if( wireFrame ){
            const mat  = new THREE.LineBasicMaterial({ color:0xffffff, opacity:0.6, transparent:true });
            const wGeo = new THREE.WireframeGeometry( bGeo );
            const grp  = new THREE.Group();
            grp.add( mesh );
            grp.add( new THREE.LineSegments( wGeo, mat ) )
            return grp;
        }else{
            return mesh;
        }
    }

    // #region GENERATION
    static _genVertices( out, width=1, height=1, xCells=2, yCells=2, useCenter=false ){
        const   x_inc   = width / xCells,
                y_inc   = height / yCells;
        let     ox      = 0,
                oz      = 0,
                x, z, xi, yi;
    
        if( useCenter ){
            ox = -width * 0.5;
            oz = -height * 0.5;
        }
    
        for( yi=0; yi <= yCells; yi++ ){
            z = yi * y_inc;
            for( xi=0; xi <= xCells; xi++ ){
                x = xi * x_inc;
                out.push( x+ox, 0.0, z+oz );
            }
        }
    }

    /** Alternating Triangle Pattern, Front/Back Slash */
    static _genAltIndices( out, row_size, row_cnt, start_idx=0, rev_quad=true ){
        const row_stop = row_cnt - 1;
        const col_stop = row_size - 1;
        let x, y, a, b, c, d, bit;

        for( y=0; y < row_stop; y++ ){
            bit = y & 1; // Alternate the starting Quad Layout for every row 
    
            for( x=0; x < col_stop; x++ ){
                a   = start_idx + y * row_size + x;
                b   = a + row_size;
                c   = b + 1
                d   = a + 1;

                // Alternate the Quad Layout for each cell
                if( rev_quad ){
                    if( ( x & 1 ) == bit )	out.push( d, a, b, b, c, d ); // Front Slash
                    else					out.push( a, b, c, c, d, a ); // Back Slash
                }else{
                    if( ( x & 1 ) == bit )	out.push( d, c, b, b, a, d ); // Front Slash
                    else					out.push( a, d, c, c, b, a ); // Back Slash
                }
            }
        }
    }

    static _genTexcoord( out, xLen, yLen ){
        let x, y, yt;
        for( y=0; y <= yLen; y++ ){
            yt = 1 - ( y / yLen );
            for( x=0; x <= xLen; x++ ) out.push( x / xLen, yt );
        }
    }

    static _repeatVec( out, cnt, x, y, z ){
        for( let i=0; i < cnt; i++ ) out.push( x, y, z );
    }
    // #endregion
}