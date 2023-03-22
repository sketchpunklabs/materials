export default {
// rgb( 0x0000ff )
'rgb':`
vec3 rgb( int c ){
    return vec3(
        float( ( c >> 16 ) & 0xff ) * 0.00392156863,
        float( ( c >> 8 ) & 0xff ) * 0.00392156863,
        float( c & 0xff ) * 0.00392156863
    );
}`,

/*
vec3	ramp_col[8] = vec3[]( rgb(0x6b541d), rgb(0x00fdf2), rgb(0xdbb976), rgb(0x17e45d), rgb(0xd0d0d0), rgb(0xffffff), rgb(0xffffff) , rgb(0xffffff) );
float	ramp_wgt[8] = float[]( 0.0, 0.2, 0.5, .7, .95, 1.0, 1.0, 1.0 );
vec3 base_color     = colorStepRamp( ramp_col, ramp_wgt, t, 0.1, 4 );
*/
'colorStepRamp':`
vec3 colorStepRamp( vec3[8] color, float[8] wgt, float t, float feather, int i ){
    for( i; i > 0; i-- ){
        //if( ( wgt[ i ] - feather ) <= t ){
        if( t >= ( wgt[ i ] - feather ) ){
            return mix( 
                color[ i-1 ], 
                color[ i ],
                smoothstep( wgt[ i ] - feather, wgt[ i ] + feather, t )
            );
        }
    }
    return color[ 0 ];
}`,

/*
vec3  ramp_col[8] = vec3[]( rgb(0x2971E6),rgb(0x4BD6CD),rgb(0xFFD3B4),rgb(0xBDD2B6),rgb(0x545E53),rgb(0xFFFFFF), vec3(0.0),vec3(0.0) );
float ramp_wgt[8] = float[]( 0.0, 0.15, 0.3, 0.45, 0.6, 1.0, 1.0, 1.0 );
float t = clamp( max( MIN_HEIGHT, fragWPos.y ) / RNG_HEIGHT, 0.0, 1.0 );
vec3 color       = colorLerpRamp( ramp_col, ramp_wgt, t, 6 );
*/
'colorLerpRamp':`
vec3 colorLerpRamp( vec3[8] color, float[8] wgt, float t, int cnt ){
    for( int i=1; i < cnt; i++ ){
        if( t <= wgt[ i ] ){
            return mix( 
                color[ i-1 ], 
                color[ i ],
                //smoothstep( wgt[ i-1 ], wgt[ i ] , t )
                ( t - wgt[ i-1 ] ) / ( wgt[ i ] - wgt[ i -1] )
            );
        }
    }
    return color[ cnt-1 ];
}`,

};





/*
	float ramp_step( float grad, float[4] ramp, float[4] ramp_pos, int cnt ){
		if( grad >= ramp_pos[ cnt-1 ] ) return ramp[ cnt-1 ]; // Greater ten final check.

		for( int i=1; i < cnt; i++ ){
			if( ramp_pos[ i ] > grad ) return ramp[ i-1 ];
		}
		return ramp[ 0 ];
    }

void color_dot_ramp2( vec3[5] color, float[5] wgt, float t, float feather, int i, out DotRamp dr ){
	for( i; i > 0; i-- ){
		if( ( wgt[ i ] ) <= t ){
			dr.color_a	= color[ i-1 ];
			dr.color_b	= color[ i ];
			dr.t		= clamp( ( t - wgt[i] ) / feather, 0.0, 1.0 );
			return;
		}
	}
	dr.color_a	= color[ 0 ];
	dr.color_b	= color[ 0 ];
	dr.t		= 0.0;
}

*/