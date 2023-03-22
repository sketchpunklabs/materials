export default {

'floatLinearRamp':`
float floatLinearRamp( float[8] val, float[8] wgt, float w, int size ){
    if( w <= wgt[ 0 ] )      return val[ 0 ];
    if( w >= wgt[ size-1 ] ) return val[ size-1 ];

    for( int i=1; i < size; i++ ){
        if( w <= wgt[ i ] ){
            // Remap W between two Weights, then get the Remapped value.
            return mix( 
                val[ i-1 ], 
                val[ i ],
                ( w - wgt[ i-1 ] ) / ( wgt[ i ] - wgt[ i-1 ] ) 
            );
        }
    }
    return 1.0;
}`,
    
};