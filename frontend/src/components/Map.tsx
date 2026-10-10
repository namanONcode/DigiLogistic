import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create custom icons for different points
const createIcon = (color: string, iconStr: string) => {
  const html = `
    <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
      <span class="material-symbols-outlined" style="font-size: 18px;">${iconStr}</span>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const currentIcon = createIcon('#0051d5', 'my_location');
const pickupIcon = createIcon('#188ace', 'warehouse');
const dropoffIcon = createIcon('#ba1a1a', 'location_on');

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
      <MapContainer center={center} zoom={points ? 5 : 4} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={center} zoom={points ? 5 : 4} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {routeCoordinates.length > 0 && (
          <Polyline positions={routeCoordinates} color="#0051d5" weight={5} opacity={0.8} />
        )}

        {points && (
          <>
            <Marker position={points.current} icon={currentIcon}>
              <Popup><strong>Current Location</strong></Popup>
            </Marker>
            <Marker position={points.pickup} icon={pickupIcon}>
              <Popup><strong>Pickup Location</strong></Popup>
            </Marker>
            <Marker position={points.dropoff} icon={dropoffIcon}>
              <Popup><strong>Dropoff Location</strong></Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
