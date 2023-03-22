import { Scene, Mesh, PlaneGeometry, WebGLRenderTarget, OrthographicCamera } from 'three';

export default class TexturePass{
    constructor( mat, w=256, h=256 ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // use 2u so verts are in the -1 to 1 range this allows 
        // not needing to use projections in the vertex shader 
        // as the values are the same as NDC
        const geo  = new PlaneGeometry( 2, 2 ); 
        const quad = new Mesh( geo, mat );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Setup render scene
        this.fbo    = new WebGLRenderTarget( w, h );                // Frame Buffer to render to
        this.camera = new OrthographicCamera( -1, 1, 1, -1, 0, 1 ); // not needed but 3JS requires camera to render
        this.scene  = new Scene();
        this.scene.add( quad );        
    }

    get texture(){ return this.fbo.texture; }

    render( renderer ){
        renderer.setRenderTarget( this.fbo );
        renderer.render( this.scene, this.camera );
        renderer.setRenderTarget( null );
        return this;
    }
}