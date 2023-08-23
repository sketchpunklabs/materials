import * as THREE from 'three';

export default function usePostRender( tjs ){
    tjs.renderer.outputColorSpace   = THREE.SRGBColorSpace;
    tjs.renderer.autoClearColor     = false;
    tjs.renderer.autoClearDepth     = false;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Core
    const scene  = new THREE.Scene();
    const camera = tjs.camera; // new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    const fbo    = fboColorDepthSRGB( tjs.getBufferSize() );
    const tri    = ndcTriangle( postColorMaterial( fbo.texture ) );

    scene.add( tri );

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // METHODS
    let self; // Need to declare before methods for it to be useable

    const render = ( onPreRender=null, onPostRender=null )=>{
        // Render scene to texture
        tjs.renderer.setRenderTarget( fbo );
        tjs.renderer.clearColor(); 
        tjs.renderer.clearDepth();
        tjs.render( onPreRender, onPostRender );
        
        // Render textures to screen
        tjs.renderer.setRenderTarget( null );
        tjs.renderer.clearColor(); 
        tjs.renderer.clearDepth();
        tjs.renderer.render( scene, camera );
        return self;
    };

    const renderLoop = ()=>{
        window.requestAnimationFrame( renderLoop );
        render();
        return self;
    };

    const createRenderLoop = ( fnPreRender=null, fnPostRender=null )=>{
        let   reqId = 0;
        const rLoop = {
            stop        : ()=>window.cancelAnimationFrame( reqId ),
            start       : ()=>rLoop.onRender(),
            onRender    : ()=>{
                render( fnPreRender, fnPostRender );
                reqId = window.requestAnimationFrame( rLoop.onRender );
            },
        };
        return rLoop;
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Build return object
    self = {
        scene,
        camera,
        render,
        renderLoop,
        createRenderLoop,
    };

    Object.defineProperty( self, 'colorTexture', { get(){ return fbo.texture; } });
    Object.defineProperty( self, 'depthTexture', { get(){ return fbo.depthTexture; } });
    Object.defineProperty( self, 'postMaterial', { set( mat ){ tri.material = mat; } });

    return self;
}


// #region HELPER FUNCTIONS
function ndcTriangle( mat ){
    const geo = new THREE.BufferGeometry();
    geo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array([ -1.0, -1.0, 3.0, -1.0, -1.0, 3.0 ]), 2 ) );
    geo.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array([0, 0, 2, 0, 0, 2]), 2 ) );

    const mesh = new THREE.Mesh( geo, mat );
    mesh.frustumCulled = false;
    return mesh;
}

function fboColorDepthSRGB( rendSize, isMultiSamples=true ){
    // const dpr  = window.devicePixelRatio;
    const fbo = new THREE.WebGLRenderTarget(
        rendSize[ 0 ], // * dpr,
        rendSize[ 1 ], // * dpr,
        {
            type         : THREE.UnsignedByteType,
            minFilter    : THREE.NearestFilter,
            magFilter    : THREE.NearestFilter,
            depthBuffer  : true,
            depthTexture : new THREE.DepthTexture(
                rendSize[ 0 ], // * dpr,
                rendSize[ 1 ], // * dpr,
                THREE.UnsignedIntType, 
                THREE.UVMapping,
            )
        }
    );

    if( isMultiSamples )         fbo.samples = 4;

    if( fbo.texture.colorSpace ) fbo.texture.colorSpace = THREE.SRGBColorSpace;  // rev > 152
    else                         fbo.texture.encoding   = THREE.sRGBEncoding;

    fbo.texture.name        = 'texColor';
    fbo.depthTexture.name   = 'texDepth';
    return fbo;
}

export function postColorMaterial( tex ){
    return new THREE.RawShaderMaterial({
        name            : 'PostMaterial',
        depthTest       : false,
        transparent 	: false,
        alphaToCoverage : false,
        uniforms        : { 
            texColor : { type:'sampler2D', value: tex },
        },
    
        vertexShader    : `#version 300 es
        in vec2 position;
		in vec2 uv;

        // uniform mat4 viewMatrix;
        // uniform mediump mat4 projectionMatrix;

        out vec2 fragUV;

        void main(){            
            fragUV      = uv;
            // gl_Position = projectionMatrix * viewMatrix * vec4( position, 0.0, 1.0 );
            gl_Position = vec4( position, 0.0, 1.0 );
        }`,

        fragmentShader  : `#version 300 es
        precision mediump float;
        
        uniform sampler2D texColor;
        
        in   vec2 fragUV;
        out  vec4 outColor;

        void main(){
            vec4 color = texture( texColor, fragUV );
            outColor   = color;
        }`,
    });
}
// #endregion