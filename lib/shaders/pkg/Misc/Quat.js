
https://github.com/pmbittner/OptimisedCentresOfRotationSkinning/blob/master/shader/quaternion.glsl

mat3 quat_toRotationMatrix(vec4 quat)
{
	float twiceXY  = 2 * quat.x * quat.y;
	float twiceXZ  = 2 * quat.x * quat.z;
	float twiceYZ  = 2 * quat.y * quat.z;
	float twiceWX  = 2 * quat.w * quat.x;
	float twiceWY  = 2 * quat.w * quat.y;
	float twiceWZ  = 2 * quat.w * quat.z;

	float wSqrd = quat.w * quat.w;
	float xSqrd = quat.x * quat.x;
	float ySqrd = quat.y * quat.y;
	float zSqrd = quat.z * quat.z;

	return mat3(
		// first column
		vec3(
			1.0f - 2*(ySqrd + zSqrd),
			twiceXY + twiceWZ,
			twiceXZ - twiceWY),

		// second column
		vec3(
			twiceXY - twiceWZ,
			1.0f - 2*(xSqrd + zSqrd),
			twiceYZ + twiceWX),

		// third column
		vec3(
			twiceXZ + twiceWY,
			twiceYZ - twiceWX,
			1.0f - 2*(xSqrd + ySqrd))
	);
}

vec4 quat_from_axis_angle(vec3 axis, float angle)
{ 
  vec4 qr;
  float half_angle = (angle * 0.5) * 3.14159 / 180.0;
  qr.x = axis.x * sin(half_angle);
  qr.y = axis.y * sin(half_angle);
  qr.z = axis.z * sin(half_angle);
  qr.w = cos(half_angle);
  return qr;
}

vec4 quat_from_axis_angle_rad(vec3 axis, float angle)
{ 
  vec4 qr;
  float half_angle = (angle * 0.5);
  qr.x = axis.x * sin(half_angle);
  qr.y = axis.y * sin(half_angle);
  qr.z = axis.z * sin(half_angle);
  qr.w = cos(half_angle);
  return qr;
}

vec4 quat_mult(vec4 q1, vec4 q2)
{ 
  vec4 qr;
  qr.x = (q1.w * q2.x) + (q1.x * q2.w) + (q1.y * q2.z) - (q1.z * q2.y);
  qr.y = (q1.w * q2.y) - (q1.x * q2.z) + (q1.y * q2.w) + (q1.z * q2.x);
  qr.z = (q1.w * q2.z) + (q1.x * q2.y) - (q1.y * q2.x) + (q1.z * q2.w);
  qr.w = (q1.w * q2.w) - (q1.x * q2.x) - (q1.y * q2.y) - (q1.z * q2.z);
  return qr;
}

// function from https://twistedpairdevelopment.wordpress.com/2013/02/11/rotating-a-vector-by-a-quaternion-in-glsl/
vec4 multQuat(vec4 q1, vec4 q2)
{
	return vec4(
	q1.w * q2.x + q1.x * q2.w + q1.z * q2.y - q1.y * q2.z,
	q1.w * q2.y + q1.y * q2.w + q1.x * q2.z - q1.z * q2.x,
	q1.w * q2.z + q1.z * q2.w + q1.y * q2.x - q1.x * q2.y,
	q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z
	);
}

vec4 quat_add_oriented(vec4 q1, vec4 q2)
{
	if (dot(q1, q2) >= 0) {
		return q1 + q2;
	} else {
		return q1 - q2;
	}
}

vec4 quat_from_two_vectors(vec3 u, vec3 v)
{
	vec3 unorm = normalize(u);
	vec3 vnorm = normalize(v);
    float cos_theta = dot(unorm, vnorm);
    float angle = acos(cos_theta);
    vec3 w = normalize(cross(u, v));
    return quat_from_axis_angle_rad(w, angle);
}