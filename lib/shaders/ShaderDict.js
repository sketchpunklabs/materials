const dict = new Map();

function get( pkgName, key ){
    const pkg = dict.get( pkgName );
    if( !pkg ){
        console.warn( 'Package name not found:', pkgName );
        return null;
    }

    let txt = '';
    if( key == '*' ){
        for( const k in pkg ) txt += '\n' + pkg[ k ] + '\n';
    }else{
        txt = pkg[ key ];
        if( !txt ){
            console.warn( 'Package item not found %s.%s', pkgName, key );
            return null;
        }
    }   
    return txt;
}

function add( packageName, struct ){ 
    dict.set( packageName, struct ); 
    return ShaderDict;
}

async function load( url ){
    const mod = await import( url );
    add( mod.default.packageName, mod.default.items );
}

async function bulk( ary ){
    const pAry = [];
    for( let i of ary ) pAry.push( import( i ) );

    const mods = await Promise.all( pAry );

    for( let mod of mods ){
        add( mod.default.packageName, mod.default.items );
    }
}

function parse( str ){
    const iter = str.matchAll( /\#(include) ([A-Za-z0-9_]+)(\.([A-Za-z0-9_\*]+))*/g );
    const iPkg = 2;
    const iKey = 4;
    
    let buf = '';
    let idx = 0;
    let i, txt, pkg, key;

    for( let itm of iter ){
        i = itm.index;

        // Copy text before include
        if( i != idx ) buf += str.substring( idx, i );

        // Find Include to add to buffer
        pkg = itm[ iPkg ];
        key = itm[ iKey ] || '*'; // If not incude a key, do wildcard to get everything
        if( (txt = get(pkg,key)) ) buf += ' ' + txt + ' ';
        
        // Index of the next check of text
        idx = i + itm[ 0 ].length;
    }

    // Append trailing text
    buf += str.substr( idx );
    return buf;
}

function ShaderDict( strings, ...values ){
    return parse( strings[ 0 ] );
}

ShaderDict.add   = add;
ShaderDict.load  = load;
ShaderDict.bulk  = bulk;
ShaderDict.get   = get;
ShaderDict.parse = parse;

export default ShaderDict;

