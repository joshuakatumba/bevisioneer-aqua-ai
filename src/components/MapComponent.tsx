import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { type ReportData, subscribeToReports } from '../lib/waterReportService';
import L from 'leaflet';

// Fix Leaflet's default icon path issues with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const createIcon = (color: string) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const RedIcon = createIcon('red');
const GreenIcon = createIcon('green');
const OrangeIcon = createIcon('orange');
const BlueIcon = createIcon('blue'); // User location

const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
};

export default function MapComponent() {
    const [reports, setReports] = useState<ReportData[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        // 1. Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Fallback location (e.g., Kampala, Uganda for demo context)
                    setUserLocation({ lat: 0.3476, lng: 32.5825 });
                }
            );
        } else {
            setUserLocation({ lat: 0.3476, lng: 32.5825 });
        }

        // 2. Subscribe to Reports
        const unsubscribe = subscribeToReports((data) => {
            setReports(data);
        });

        return () => unsubscribe();
    }, []);

    if (!userLocation) {
        return <div className="flex items-center justify-center h-full text-slate-500">Locating...</div>;
    }

    return (
        <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />

            {/* User Location */}
            <Marker position={[userLocation.lat, userLocation.lng]} icon={BlueIcon}>
                <Popup>You are here</Popup>
            </Marker>

            {/* Reports */}
            {reports.map((report, idx) => {
                let icon = GreenIcon;
                if (report.status === 'Unsafe') icon = RedIcon;
                if (report.status === 'Caution') icon = OrangeIcon;

                return (
                    <Marker key={report.id || idx} position={[report.coordinates.lat, report.coordinates.lng]} icon={icon}>
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-sm">{report.sourceName}</h3>
                                <div className={`text-xs font-semibold ${report.status === 'Unsafe' ? 'text-red-600' : report.status === 'Safe' ? 'text-green-600' : 'text-orange-600'}`}>
                                    {report.status.toUpperCase()}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Turbidity: {report.turbidity} NTU</p>
                                <p className="text-[10px] text-slate-400">{new Date(report.reportedAt).toLocaleDateString()}</p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
