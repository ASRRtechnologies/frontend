/**
 * Converts WGS84 (latitude, longitude) to RD (Rijksdriehoek) coordinates.
 * RD is the Dutch national coordinate system used for mapping in the Netherlands.
 *
 * @param lat - Latitude in WGS84 decimal degrees
 * @param lon - Longitude in WGS84 decimal degrees
 * @returns Object with x (easting) and y (northing) in RD meters
 * @see https://github.com/Screaming-In-Tongues/RD-to-WGS84-conversion/blob/master/RD_WGS84.js
 */
export function wgs84ToRD(lat: number, lon: number): { x: number; y: number } {
	const dLat = 0.36 * (lat - 52.155174405);
	const dLon = 0.36 * (lon - 5.38720621);

	const x =
		155000 +
		190094.945 * dLon -
		11832.228 * dLat * dLon -
		114.221 * dLat * dLat * dLon +
		32.391 * dLon * dLon * dLon -
		0.033 * dLat * dLat * dLat * dLon -
		0.705 * dLat * dLon * dLon * dLon -
		2.34 * dLat * dLat * dLat * dLat * dLon -
		0.608 * dLat * dLat * dLon * dLon * dLon +
		0.192 * dLon * dLon * dLon * dLon * dLon +
		0.633 * dLat * dLat * dLat * dLat * dLat * dLon;
	const y =
		463000 +
		309056.544 * dLat +
		3638.893 * dLon * dLon +
		73.077 * dLat * dLat * dLat -
		157.984 * dLat * dLon * dLon +
		59.788 * dLat * dLat * dLat * dLat * dLat +
		0.433 * dLon * dLon * dLon * dLon +
		6.439 * dLat * dLat * dLon * dLon -
		0.032 * dLat * dLat * dLat * dLon * dLon +
		0.007 * dLon * dLon * dLon * dLon * dLat;

	return { x, y };
}
