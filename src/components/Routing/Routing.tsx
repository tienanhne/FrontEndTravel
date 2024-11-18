import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

interface RoutingProps {
  start: L.LatLngExpression;
  waypoints: L.LatLngExpression[];
  onComplete: () => void;
}

const Routing: React.FC<RoutingProps> = ({ start, waypoints, onComplete }) => {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (start && waypoints.length > 0) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      routingControlRef.current = L.Routing.control({
        waypoints: [L.latLng(start), ...waypoints.map(point => L.latLng(point))],
        routeWhileDragging: false,
        lineOptions: { styles: [{ color: '#FF6347', weight: 4 }] },
        createMarker: () => null, 
      }).addTo(map);

      routingControlRef.current.on('routesfound', (e) => {
        const route = e.routes[0];
        if (route) {
          const totalDistance = route.summary.totalDistance;
          console.log(`Total distance: ${totalDistance} meters`);
          onComplete(); 
        }
      });
    }

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [start, waypoints, map, onComplete]);

  return null;
};

export default Routing;

