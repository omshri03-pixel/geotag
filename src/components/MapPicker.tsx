"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  location: { lat: number; lng: number } | null;
  setLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>;
}

export default function MapPicker({ location, setLocation }: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [coords, setCoords] = useState({ lat: 40.7128, lng: -74.006 }); // New York Default

  // Reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&email=geotaggerpro@example.com`);
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  // Sync coords from external location prop
  useEffect(() => {
    if (location) {
      setCoords({ lat: location.lat, lng: location.lng });
    }
  }, [location]);

  // Handle Lat/Lng manual input changes with proper bounding validation (-90 to 90 & -180 to 180)
  const handleLatChange = (val: string) => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) return;
    const clamped = Math.min(Math.max(parsed, -90), 90);
    setLocation(prev => ({
      lat: clamped,
      lng: prev?.lng ?? 0
    }));
  };

  const handleLngChange = (val: string) => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) return;
    const clamped = Math.min(Math.max(parsed, -180), 180);
    setLocation(prev => ({
      lat: prev?.lat ?? 0,
      lng: clamped
    }));
  };

  const handleSearch = async () => {
    if (!address.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&email=geotaggerpro@example.com`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setLocation({ lat, lng });
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error(err);
      alert("Error searching for location.");
    } finally {
      setIsSearching(false);
    }
  };

  // Initialize Leaflet Map safely on Client side (SSR prevention)
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // Scrub any stale Leaflet container ID from a previous mount (Strict Mode / HMR)
    const container = mapContainerRef.current as any;
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    let L: any;
    import("leaflet").then((leaflet) => {
      L = leaflet;

      // Guard: if the container was already initialized (e.g. double-effect in Strict Mode), skip
      if (!mapContainerRef.current || mapRef.current) return;

      // Fix missing Leaflet Default Marker icon assets issue
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });

      const map = L.map(mapContainerRef.current).setView([coords.lat, coords.lng], 13);
      
      // Add completely free CartoDB Dark Matter tile layer for an beautiful sleek SaaS visual style
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);

      const marker = L.marker([coords.lat, coords.lng], { draggable: true }).addTo(map);

      // Marker drag handler
      marker.on("dragend", () => {
        const newLatLng = marker.getLatLng();
        setLocation({ lat: newLatLng.lat, lng: newLatLng.lng });
        reverseGeocode(newLatLng.lat, newLatLng.lng);
      });

      // Click map handler
      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
      // Clear stale container ID so next mount doesn't see a "used" container
      if (mapContainerRef.current) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }
    };
  }, []);

  // Sync leaflet view and marker whenever coords state is updated
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const center = mapRef.current.getCenter();
      if (center.lat !== coords.lat || center.lng !== coords.lng) {
        mapRef.current.setView([coords.lat, coords.lng], mapRef.current.getZoom());
        markerRef.current.setLatLng([coords.lat, coords.lng]);
      }
    }
  }, [coords]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input 
          type="text" 
          value={address}
          onChange={e => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full bg-bg-panel border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand transition-colors text-text-main"
          placeholder="Search location or paste address..."
        />
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white text-xs px-2 py-1 rounded transition-colors"
        >
          {isSearching ? "..." : "Search"}
        </button>
      </div>

      {/* Free Interactive Leaflet Map Container */}
      <div className="h-64 w-full bg-bg-panel border border-border rounded-xl overflow-hidden relative z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Coordinate Input Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-bg-panel border border-border rounded-lg px-3 py-2 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <span>Manual Input:</span>
          <div className="flex gap-2">
            <input 
              type="number"
              placeholder="Lat"
              value={location?.lat ?? ""}
              onChange={e => handleLatChange(e.target.value)}
              className="w-20 bg-bg border border-border rounded px-2 py-1 text-[10px] text-text-main focus:outline-none focus:border-brand"
            />
            <input 
              type="number"
              placeholder="Lng"
              value={location?.lng ?? ""}
              onChange={e => handleLngChange(e.target.value)}
              className="w-20 bg-bg border border-border rounded px-2 py-1 text-[10px] text-text-main focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>Selected Coords:</span>
          {location ? (
            <span className="font-mono text-brand font-semibold bg-brand/5 px-2 py-0.5 rounded border border-brand/20">
              {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
            </span>
          ) : (
            <span>None</span>
          )}
        </div>
      </div>
    </div>
  );
}
