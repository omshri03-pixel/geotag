"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  location: { lat: number; lng: number } | null;
  setLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>;
  scatterRadius?: number;
  scatterEnabled?: boolean;
}

export default function MapPicker({ location, setLocation, scatterRadius, scatterEnabled }: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const leafletModuleRef = useRef<any>(null);
  const geocodeTimerRef = useRef<any>(null);
  
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [coords, setCoords] = useState({ lat: 40.7128, lng: -74.006 }); // New York Default
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'streets'>('dark');

  // Change tile layer between Dark, Satellite, and Streets (100% Free, Zero Watermarks, Zero API Key)
  const updateTileLayer = (style: 'dark' | 'satellite' | 'streets', mapInstance?: any, L?: any) => {
    const targetMap = mapInstance || mapRef.current;
    const targetL = L || leafletModuleRef.current;
    if (!targetMap || !targetL) return;

    if (tileLayerRef.current) {
      targetMap.removeLayer(tileLayerRef.current);
    }

    let layer: any;
    if (style === 'satellite') {
      layer = targetL.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: '&copy; Esri World Imagery'
      });
    } else if (style === 'streets') {
      layer = targetL.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'
      });
    } else {
      // Default: Clean Dark Inverted OpenStreetMap (Zero watermarks, Zero API key)
      layer = targetL.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        className: 'dark-map-tiles',
        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'
      });
    }

    layer.addTo(targetMap);
    tileLayerRef.current = layer;
    setMapStyle(style);
  };

  // Debounced reverse geocoding function (prevents OSM 429 rate limit)
  const debouncedReverseGeocode = (lat: number, lng: number) => {
    if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    geocodeTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&email=geotaggerpro@example.com`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
        }
      } catch (err) {
        console.warn("Reverse geocoding suppressed:", err);
      }
    }, 600);
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
      leafletModuleRef.current = L;
      
      // Load free tile layer without watermarks
      updateTileLayer('dark', map, L);

      const marker = L.marker([coords.lat, coords.lng], { draggable: true }).addTo(map);

      // Marker drag handler
      marker.on("dragend", () => {
        const newLatLng = marker.getLatLng();
        setLocation({ lat: newLatLng.lat, lng: newLatLng.lng });
        debouncedReverseGeocode(newLatLng.lat, newLatLng.lng);
      });

      // Click map handler
      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
        debouncedReverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
    });

    return () => {
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
      if (circleRef.current && mapRef.current) {
        mapRef.current.removeLayer(circleRef.current);
      }
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

  // Sync leaflet view, marker, and scatter circle whenever coords or scatter settings change
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const center = mapRef.current.getCenter();
      if (center.lat !== coords.lat || center.lng !== coords.lng) {
        mapRef.current.setView([coords.lat, coords.lng], mapRef.current.getZoom());
        markerRef.current.setLatLng([coords.lat, coords.lng]);
      }

      // Update Scatter Radius Circle Visualization
      import("leaflet").then((L) => {
        if (!mapRef.current) return;
        if (circleRef.current) {
          mapRef.current.removeLayer(circleRef.current);
          circleRef.current = null;
        }

        if (scatterEnabled && scatterRadius && scatterRadius > 0) {
          circleRef.current = L.circle([coords.lat, coords.lng], {
            radius: scatterRadius,
            color: "#FF5500",
            fillColor: "#FF5500",
            fillOpacity: 0.12,
            weight: 1.5,
            dashArray: "4, 4"
          }).addTo(mapRef.current);
        }
      });
    }
  }, [coords, scatterRadius, scatterEnabled]);

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
        {/* Layer style switcher overlay */}
        <div className="absolute top-2 right-2 z-[400] flex gap-1 bg-black/80 backdrop-blur-md p-1 rounded-lg border border-border/80 shadow-md">
          <button
            type="button"
            onClick={() => updateTileLayer('dark')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer ${
              mapStyle === 'dark' ? 'bg-brand text-black' : 'text-text-muted hover:text-white'
            }`}
          >
            🌙 Dark
          </button>
          <button
            type="button"
            onClick={() => updateTileLayer('satellite')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer ${
              mapStyle === 'satellite' ? 'bg-brand text-black' : 'text-text-muted hover:text-white'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            type="button"
            onClick={() => updateTileLayer('streets')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer ${
              mapStyle === 'streets' ? 'bg-brand text-black' : 'text-text-muted hover:text-white'
            }`}
          >
            🗺️ Street
          </button>
        </div>

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
