"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, AlertTriangle, Wifi } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LocationData {
  lat: number
  lng: number
  city: string
  country: string
  region: string
  isp: string
  threat_level: "low" | "medium" | "high" | "critical"
  timestamp: string
  accuracy: number
}

interface GoogleMapsTrackerProps {
  ipAddress?: string
  deviceId?: string
  className?: string
}

export function GoogleMapsTracker({ ipAddress, deviceId, className }: GoogleMapsTrackerProps) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const loadGoogleMaps = useCallback(async () => {
    if (typeof window !== "undefined" && !window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true

      return new Promise<void>((resolve, reject) => {
        script.onload = () => {
          setMapLoaded(true)
          resolve()
        }
        script.onerror = () => reject(new Error("Failed to load Google Maps"))
        document.head.appendChild(script)
      })
    } else if (window.google) {
      setMapLoaded(true)
    }
  }, [])

  const trackLocation = useCallback(async () => {
    if (!ipAddress && !deviceId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/geolocation/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ipAddress, deviceId }),
      })

      if (!response.ok) throw new Error("Failed to track location")

      const data = await response.json()
      setLocation(data.location)

      // Initialize map after getting location
      if (mapLoaded && data.location) {
        initializeMap(data.location)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Location tracking failed")
    } finally {
      setIsLoading(false)
    }
  }, [ipAddress, deviceId, mapLoaded])

  const initializeMap = useCallback((locationData: LocationData) => {
    if (!window.google || !locationData) return

    const mapElement = document.getElementById("google-map")
    if (!mapElement) return

    const map = new window.google.maps.Map(mapElement, {
      center: { lat: locationData.lat, lng: locationData.lng },
      zoom: 12,
      styles: [
        {
          featureType: "all",
          elementType: "geometry.fill",
          stylers: [{ color: "#f5f5f5" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }],
        },
      ],
    })

    // Add marker
    const marker = new window.google.maps.Marker({
      position: { lat: locationData.lat, lng: locationData.lng },
      map: map,
      title: `${locationData.city}, ${locationData.country}`,
      icon: {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#f97316" stroke="#fff" strokeWidth="2"/>
            <circle cx="16" cy="16" r="4" fill="#fff"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32),
      },
    })

    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <h3 class="font-semibold">${locationData.city}, ${locationData.country}</h3>
          <p class="text-sm text-gray-600">ISP: ${locationData.isp}</p>
          <p class="text-sm text-gray-600">Accuracy: ${locationData.accuracy}m</p>
          <span class="inline-block px-2 py-1 text-xs rounded ${
            locationData.threat_level === "high" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }">
            ${locationData.threat_level.toUpperCase()} RISK
          </span>
        </div>
      `,
    })

    marker.addListener("click", () => {
      infoWindow.open(map, marker)
    })

    // Add accuracy circle
    new window.google.maps.Circle({
      strokeColor: "#f97316",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#f97316",
      fillOpacity: 0.15,
      map: map,
      center: { lat: locationData.lat, lng: locationData.lng },
      radius: locationData.accuracy,
    })
  }, [])

  useEffect(() => {
    loadGoogleMaps()
  }, [loadGoogleMaps])

  useEffect(() => {
    if (mapLoaded && (ipAddress || deviceId)) {
      trackLocation()
    }
  }, [mapLoaded, trackLocation])

  const getThreatColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            <span>Real-time Location Tracker</span>
          </div>
          <div className="flex items-center space-x-2">
            {isLoading && <LoadingSpinner size="sm" />}
            <Badge className="bg-green-100 text-green-800">
              <Wifi className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Google Map */}
        <div className="relative">
          <div id="google-map" className="w-full h-64 bg-gray-100 rounded-lg" style={{ minHeight: "256px" }} />
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
              <LoadingSpinner text="Loading map..." />
            </div>
          )}
        </div>

        {/* Location Details */}
        {location && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-gray-500">Location</label>
              <p>
                {location.city}, {location.region}
              </p>
              <p className="text-gray-600">{location.country}</p>
            </div>
            <div>
              <label className="font-medium text-gray-500">ISP</label>
              <p>{location.isp}</p>
            </div>
            <div>
              <label className="font-medium text-gray-500">Coordinates</label>
              <p className="font-mono text-xs">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
            <div>
              <label className="font-medium text-gray-500">Threat Level</label>
              <Badge className={getThreatColor(location.threat_level)}>{location.threat_level.toUpperCase()}</Badge>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={trackLocation}
            disabled={isLoading}
            className="flex items-center space-x-1"
          >
            <Navigation className="h-3 w-3" />
            <span>Refresh Location</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(`https://maps.google.com/?q=${location?.lat},${location?.lng}`, "_blank")}
            disabled={!location}
          >
            Open in Google Maps
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
