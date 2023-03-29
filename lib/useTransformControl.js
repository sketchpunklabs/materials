import { AxesHelper }        from 'three';
import { TransformControls } from './thirdparty/TransformControls.js';

export default function useTransformControl( tjs ){
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const gizmo = new TransformControls( tjs.camera, tjs.renderer.domElement );
    gizmo.setSpace( 'local' );
    tjs.scene.add( gizmo );

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const self  = {
        o        : gizmo,
        onRotate : null,
        onMove   : null,
        onStart  : null,
        onStop   : null,

        attach      : o=>gizmo.attach( o ),
        detach      : ()=>gizmo.attach( null ),

        toTranslate : ()=>gizmo.setMode( 'translate' ),
        toRotate    : ()=>gizmo.setMode( 'rotate' ),

        setPos      : p=>{
            if( gizmo.object ) gizmo.object.position.fromArray( p );
            return this;
        },

        useAxes     : ()=>{
            const axes = new AxesHelper();
            axes.scale.setScalar( 0.5 );
            tjs.scene.add( axes );
            gizmo.attach( axes );
            return self;
        },
    };

    const onDragChange = e=>{
        tjs.camCtrl.enabled = !e.value;

        if( e.value && self.onStart )      self.onStart();
        else if( !e.value && self.onStop ) self.onStop();
    };

    const onChange = ()=>{
        const o = gizmo.object;
        if(! (o && gizmo.dragging) ) return;
        
        switch( gizmo.mode ){
            case 'translate':
                if( self.onMove )   self.onMove( o.position.toArray() );
                break;

            case 'rotate':
                if( self.onRotate ) self.onRotate( o.quaternion.toArray() );
                break;
        }
    };

    gizmo.addEventListener( 'dragging-changed', onDragChange );
    gizmo.addEventListener( 'change', onChange );

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return self;
}