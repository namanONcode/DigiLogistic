import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue with React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  routeGeojson: any;
  points: {
    current: [number, number];
    pickup: [number, number];
    dropoff: [number, number];
  } | null;
}

const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const Map: React.FC<MapProps> = ({ routeGeojson, points }) => {
  const defaultCenter: [number, number] = [39.8283, -98.5795]; // Center of US
  const center = points ? points.current : defaultCenter;
  
  let routeCoordinates: [number, number][] = [];
  if (routeGeojson && routeGeojson.geometry && routeGeojson.geometry.coordinates) {
     routeCoordinates = routeGeojson.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
  }

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer center={center} zoom={points ? 6 : 4} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={center} zoom={points ? 6 : 4} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {routeCoordinates.length > 0 && (
          <Polyline positions={routeCoordinates} color="blue" weight={5} opacity={0.7} />
        )}

        {points && (
          <>
            <Marker position={points.current}>
              <Popup>Current Location</Popup>
            </Marker>
            <Marker position={points.pickup}>
              <Popup>Pickup Location</Popup>
            </Marker>
            <Marker position={points.dropoff}>
              <Popup>Dropoff Location</Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
