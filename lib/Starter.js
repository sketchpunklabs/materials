import * as THREE        from 'three';
import { OrbitControls } from 'OrbitControls';

// #region STARTUP
const mod_path = import.meta.url.substring( 0, import.meta.url.lastIndexOf( '/' ) + 1 );
const css_path = mod_path + "Starter.css";

(function(){
    let link    = document.createElement( 'link' );
    link.rel	= 'stylesheet';
    link.type	= 'text/css';
    link.media	= 'all';
    link.href	= css_path;
    document.getElementsByTagName( 'head' )[0].appendChild( link );
})();
// #endregion

// Boiler Plate Starter for ThreeJS
class Starter{
    // #region MAIN
    scene			= null;
    camera			= null;
    renderer		= null;
    clock           = null;
    orbit			= null;
    renderBind		= this.render.bind( this );
    onRender		= null;
    onRenderPost    = null;
    useRequestFrame = true;

    /** 
    { 
        webgl2      : false,    // Use WebGL 2 instead of 1
        grid        : false,    // Put a Grid Floor in the scene
        lights      : true,
        container   : null,     // Put Generated Canvas in a Container Element
        canvas      : null,     // Use an existing canvas
        ortho       : null,     // Starting Orthographic worldspace box height, disables Perspective Projection if value != falsey
        orbit       : true,
        xr          : false,
    }
    */
    constructor( config={} ){ 
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // MAIN SETUPS
        this.initCore( config );
        this.initEnv( config );
        this.initUtil( config );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Have the canvas set as full screen or fill its container's space
        if( config.fullscreen != false ){
            window.addEventListener( 'resize', this.onWindowResize.bind( this ) );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }else{
            // Take the size of the parent element.
            let box = this.renderer.domElement.parentNode.getBoundingClientRect();
            this.renderer.setSize( box.width , box.height );

            // When changing the canvas size, need to update the Projection Aspect Ratio to render correctly.
            this.camera.aspect = box.width / box.height;
            this.camera.updateProjectionMatrix();
        }
    }

    initCore( config ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // RENDERER
        let options = { 
            antialias : true, 
            alpha     : true,
        };

        // THREE.JS can't handle loading into WebGL2 on its own
        // Need to create canvas & get the proper context, pass those 2 into 3js
        if( config.webgl2 ){
            let canvas      = ( config.canvas )? config.canvas : document.createElement( 'canvas' );
            options.canvas  = canvas;
            options.context = canvas.getContext( 'webgl2' );
        }else if( config.canvas ){
            options.canvas = config.canvas;
        }

        this.renderer = new THREE.WebGLRenderer( options );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor( 0x3a3a3a, 1 );

        if( config.xr == true ) this.renderer.xr.enabled = true;

        // where to add the cnavas object, in a container or in the body.
        if( !config.canvas ){
            if( config.container )	config.container.appendChild( this.renderer.domElement );
            else 					document.body.appendChild( this.renderer.domElement );
        }
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Camera
        const ratio = window.innerWidth / window.innerHeight;
        
        if( !config.ortho ){
            this.camera = new THREE.PerspectiveCamera( 45, ratio, 0.01, 1000 );
        }else{
            let height  = config.ortho / 2;
            let width   = config.ortho * ratio / 2;
            this.camera = new THREE.OrthographicCamera( -width, width, height, -height, -2500, 2500 );
        }

        this.camera.position.set( 0, 10, 20 );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Misc
        this.scene = new THREE.Scene();
    }

    initEnv( config ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // LIGHTING
        if( config.lights === undefined || config.lights === true ){
            let light = new THREE.DirectionalLight( 0xffffff, 0.8 );
            light.position.set( 4, 10, 1 );

            this.scene.add( light );
            this.scene.add( new THREE.AmbientLight( 0x404040 ) );
        }
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // MISC
        if( config.grid ) this.scene.add( new THREE.GridHelper( 20, 20, 0x0c610c, 0x444444 ) );
    }

    initUtil( config ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Camera Controller
        if( config.orbit || config.orbit == undefined ){
            this.orbit = new OrbitControls( this.camera, this.renderer.domElement );
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Clock
        this.clock = new THREE.Clock();
        this.clock.start();

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Need to watch the canvas's parent element for any change in size, since
        // the canvas needs it's size to be explicitly set then trigger updating
        // various threejs rendering data.
        // this.resizeObserver = new ResizeObserver( _ => {
        //     this.onResize();
        // });

        // this.resizeObserver.observe(this.renderer.domElement.parentNode);
    }
    // #endregion

    // #region EVENTS
    onWindowResize(){
        const W     = window.innerWidth;
        const H     = window.innerHeight;
        const DPR   = window.devicePixelRatio;
        const RATIO = W / H;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Update Camera
        this.camera.aspect = RATIO;
        this.camera.updateProjectionMatrix();

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Update Renderer
        this.renderer.setSize( W, H );
        this.render();
    }
    // #endregion

    // #region METHODS
    add( o ){ 
        for( let a of arguments ) this.scene.add( a );
        return this;
    }

    remove( o ){ this.scene.remove( o ); return this; }

    setCamera( lon, lat, radius, target=null ){
        let phi 	= ( 90 - lat ) * Math.PI / 180,
            theta 	= ( lon + 180 ) * Math.PI / 180;

        this.camera.position.set(
            -(radius * Math.sin( phi ) * Math.sin(theta)),
            radius * Math.cos( phi ),
            -(radius * Math.sin( phi ) * Math.cos(theta))
        );

        if( this.camera.isOrthographicCamera ){
            this.camera.zoom = radius;
            this.camera.updateProjectionMatrix();
        }

        if( target ) this.orbit.target.fromArray( target );

        if( this.orbit ) this.orbit.update();
        return this;
    }

    render( time, frame ){ // Time & Frame is only for XR Animation Loop
        if( this.useRequestFrame ) window.requestAnimationFrame( this.renderBind );

        const deltaTime     = this.clock.getDelta();
        const ellapseTime   = this.clock.getElapsedTime();

        if( this.onRender ) this.onRender( deltaTime, ellapseTime, frame, time );

        this.renderer.render( this.scene, this.camera );

        if( this.onRenderPost ) this.onRenderPost( deltaTime, ellapseTime );
    }

    getRendererSize(){ return this.renderer.getSize( new THREE.Vector2() ).toArray(); }

    startXRRender() {
        this.useRequestFrame = false;
        this.renderer.setAnimationLoop( this.renderBind );
    }
    // #endregion
}

export default Starter;
export { THREE };