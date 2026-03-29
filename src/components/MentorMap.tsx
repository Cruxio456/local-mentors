import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MentorMapProps {
  mentors: {
    id: string;
    name: string;
    skills: string[] | null;
    rating: number | null;
    hourly_rate: number | null;
    location: string | null;
    is_available: boolean | null;
  }[];
}

// Approximate coordinates for Indian cities
const cityCoords: Record<string, [number, number]> = {
  delhi: [28.6139, 77.209],
  mumbai: [19.076, 72.8777],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  chennai: [13.0827, 80.2707],
  kolkata: [22.5726, 88.3639],
  hyderabad: [17.385, 78.4867],
  pune: [18.5204, 73.8567],
  jaipur: [26.9124, 75.7873],
  ahmedabad: [23.0225, 72.5714],
  kochi: [9.9312, 76.2673],
  lucknow: [26.8467, 80.9462],
  chandigarh: [30.7333, 76.7794],
  bhopal: [23.2599, 77.4126],
  indore: [22.7196, 75.8577],
  nagpur: [21.1458, 79.0882],
  patna: [25.6093, 85.1376],
  goa: [15.2993, 74.124],
  surat: [21.1702, 72.8311],
  visakhapatnam: [17.6868, 83.2185],
};

const getCoords = (location: string): [number, number] | null => {
  const lower = location.toLowerCase().trim();
  for (const [city, coords] of Object.entries(cityCoords)) {
    if (lower.includes(city)) return coords;
  }
  // Random offset around India center for unknown locations
  return [20.5 + Math.random() * 8, 73 + Math.random() * 10];
};

const MentorMap = ({ mentors }: MentorMapProps) => {
  const mappedMentors = mentors
    .filter((m) => m.location)
    .map((m) => ({
      ...m,
      coords: getCoords(m.location!),
    }))
    .filter((m) => m.coords !== null);

  return (
    <div className="rounded-xl overflow-hidden border border-border/50 shadow-card" style={{ height: 420 }}>
      <MapContainer
        center={[22.5, 78.9]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mappedMentors.map((m) => (
          <Marker key={m.id} position={m.coords!}>
            <Popup>
              <div className="text-sm min-w-[160px]">
                <Link to={`/mentor/${m.id}`} className="font-bold text-primary hover:underline block">
                  {m.name}
                </Link>
                <p className="text-muted-foreground text-xs">{m.skills?.[0] || "General"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    {m.rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="font-semibold">₹{m.hourly_rate || 0}/hr</span>
                </div>
                <span className={`text-xs mt-1 inline-block ${m.is_available ? "text-green-600" : "text-red-500"}`}>
                  {m.is_available ? "● Available" : "● Booked"}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MentorMap;
