import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

// Fix default marker icons (Vite/webpack break the default asset paths)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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
  gurgaon: [28.4595, 77.0266],
  gurugram: [28.4595, 77.0266],
  noida: [28.5355, 77.391],
  faridabad: [28.4089, 77.3178],
  coimbatore: [11.0168, 76.9558],
};

// Stable pseudo-random offset based on id, so unknown locations keep their spot
const fallbackCoords = (seed: string): [number, number] => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const lat = 20.5 + ((Math.abs(h) % 800) / 100); // 20.5 - 28.5
  const lng = 73 + ((Math.abs(h >> 8) % 1200) / 100); // 73 - 85
  return [lat, lng];
};

const getCoords = (location: string, id: string): [number, number] => {
  const lower = location.toLowerCase().trim();
  for (const [city, coords] of Object.entries(cityCoords)) {
    if (lower.includes(city)) return coords;
  }
  return fallbackCoords(id);
};

// Forces Leaflet to recalculate size once the container is laid out.
// Critical when the map is inside a tab, suspense boundary, or any container
// that may have had zero height at mount time.
const InvalidateSize = () => {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(t);
  }, [map]);
  return null;
};

const MentorMap = ({ mentors }: MentorMapProps) => {
  const mappedMentors = mentors
    .filter((m) => m.location)
    .map((m) => ({ ...m, coords: getCoords(m.location!, m.id) }));

  return (
    <div
      className="rounded-xl overflow-hidden border border-border/50 shadow-card relative"
      style={{ height: 480 }}
    >
      {mappedMentors.length === 0 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-xs text-muted-foreground border border-border/50">
          No mentors with a location to plot
        </div>
      )}
      <MapContainer
        center={[22.5, 78.9]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <InvalidateSize />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {mappedMentors.map((m) => (
          <Marker key={m.id} position={m.coords}>
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
                <span
                  className={`text-xs mt-1 inline-block ${
                    m.is_available ? "text-green-600" : "text-red-500"
                  }`}
                >
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
