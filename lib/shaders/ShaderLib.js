/*
// USING TAGGED LITERAL REQUIRES PRELOADING PACKAGES
await ShaderLib.LoadPackages( [ 'Noice.goldNoise', 'Noice.test' ] );

const v = 1;
const s = ShaderLib`Testing One ${v} Two
#include Noice.test
#include Noice.goldNoise
Three`;

// USING ASYNC FUNCTION LOADS THINGS IN REAL TIME
ShaderLib.Async(`
    SomeText
    #include Noice.goldNoise.*
    #include Noice.test.key2
    ExtraText
`).then( str=>console.log( str ) );
*/

// #region GLOBAL VALUES
const CACHE       = new Map();
const INCLUDE_RX  = /\#(include) ([A-Za-z0-9_]+)\.?([A-Za-z0-9_]+)*\.?([A-Za-z0-9_\*]+)*/g;
const IPKG        = 2;
const IFILE       = 3;
const IKEY        = 4;
let   PKG_PATH    = import.meta.url.substring( 0, import.meta.url.lastIndexOf( '/' ) + 1 ) + 'pkg/';
// #endregion

// #region MAIN
// TAG FUNCTION
function ShaderLib( strings, ...values ){
    // console.log( 'Springs', strings );
    // console.log( 'Values', values );

    if( typeof strings === 'string' ) return parse( string );

    return parse( ( values.length > 0 )? merge( strings, values ): strings[ 0 ] );
}

ShaderLib.Async = ( str )=>{
    return new Promise( async ( resolve, reject )=>{
        const result = await parseAsync( str );
        resolve( result );
    });
};
// #endregion

// #region HELPERS
function merge( strings, values ){
    let i   = 0;
    let str = '';
    
    for( i; i < values.length; i++ ){
        str += strings[ i ] + values[ i ]
    }

    if( strings.length >= i ) str += strings[ i ];
    return str;
}
// #endregion

// #region PARSERS

// Parser used for Async creation
async function parseAsync( str ){
    const iter = str.matchAll( INCLUDE_RX );
    let buf    = '';
    let idx    = 0;
    let res;
    for( let itm of iter ){
        // Copy text before include
        if( itm.index != idx ) buf += str.substring( idx, itm.index );

        // console.log( itm );
        res = await getPackageResource( itm[IPKG], itm[IFILE], itm[IKEY] || '*' );
        if( res !== null ){
            buf += '' + res + ' ';
        }else{
            console.log( "Error getting package resource", itm[iPkg], itm[iFile], itm[iKey] || '*' );
        }

        // Index of the next chunk of text
        idx = itm.index + itm[ 0 ].length;
    }

    // Append trailing text
    buf += str.substr( idx );

    return buf;
}

// Parser used for Tagged Literals
function parse( str ){
    const iter = str.matchAll( INCLUDE_RX );
    let buf    = '';
    let idx    = 0;
    let pkg;
    let obj;
    let res;
    for( let itm of iter ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Copy text before include
        if( itm.index != idx ) buf += str.substring( idx, itm.index );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Get loaded data
        pkg = CACHE.get( itm[IPKG] );
        if( pkg ){
            obj = pkg[ itm[IFILE] ];
            if( obj ){
                res = getKeyResource( obj, itm[IKEY] || '*' );
                if( res !== null ){
                    buf += '\n' + res + '\n';
                }else{
                    console.log( 'Package file key not found', itm[iPkg], itm[iFile], itm[iKey] || '*' );
                }
            }else{
                console.log( 'Package file not loaded', itm[iPkg], itm[iFile] );
            }
        }else{
            console.log( 'Package not loaded', itm[iPkg] );
        }
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Index of the next chunk of text
        idx = itm.index + itm[ 0 ].length;
    }

    // Append trailing text
    buf += str.substr( idx );

    return buf;
}
// #endregion

// #region RESOURCE HANDLING

// Preload package files
ShaderLib.LoadPackages = async ( ary )=>{
    let url;
    let mod;
    let p;
    let failedPackages = '';

    for( const i of ary ){
        const [ pkg, file ] = i.split( '.' );

        p = CACHE.get( pkg );
        if( p && p.hasOwnProperty( file ) ) continue;

        url = PKG_PATH +  pkg + '/' + file + '.js';
        try{
            mod = await import( url );
            if( !p ) CACHE.set( pkg, p = {} );

            p[ file ] = mod.default;
        }catch( e ){
            failedPackages += url + '\n';
            // console.error( 'Error loading package: ', url, e.message );
        }
    }

    if( failedPackages ) throw( 'Error loading packages:\n' + failedPackages );
};

// Async load resource
async function getPackageResource( pkgName, fileName, resKey ){
    const file = fileName || 'root';
    const key  = resKey || '*';
    let   pkg  = CACHE.get( pkgName );

    if( pkg ){
        if( pkg.hasOwnProperty( file ) ){
            return getKeyResource( pkg[ file ], key ) ;
        }
    }

    console.log( pkgName, fileName, resKey );

    const path = PKG_PATH + pkgName + (( fileName )? '/' + fileName : '') + '.js';
    const mod  = await import( path );

    if( !pkg ){
        pkg = {};
        CACHE.set( pkgName, pkg );
    }

    pkg[ file ] = mod.default;

    const str = getKeyResource( pkg[ file ], key );
    return str;
}

// Determine which resource to get from a key
function getKeyResource( obj, key='*' ){
    if( typeof obj === 'string' ) return obj;

    if( key === '*' ){
        let buf = '';
        for( const v of Object.values( obj ) ){
            buf += '\n' + v;
        }
        return buf;
    }else{
        if( obj.hasOwnProperty( key ) ) return obj[ key ];
    }

    return null;
}

// #endregion

export default ShaderLib;