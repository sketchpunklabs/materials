// in the future can prob do : <script type="importmap" src="/import-map.json"></script>
const prepend = ( document.location.hostname.indexOf( 'localhost' ) === -1 )? '/materials' : '';

document.body.appendChild(Object.assign(document.createElement('script'), {
type		: 'importmap',
innerHTML	: `
    {"imports":{
        "three"             : "${prepend}/lib/thirdparty/three.module.min.js",
        "OrbitControls"	    : "${prepend}/lib/thirdparty/OrbitControls.js",
        "gl-matrix"         : "${prepend}/lib/thirdparty/gl-matrix/index.js",
        "postprocess/"      : "${prepend}/lib/thirdparty/threePostProcess/",
        "tp/"               : "${prepend}/lib/thirdparty/"
    }}
`}));