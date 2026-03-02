'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { LocationSuggestion } from '../../types/weather';
import { fetchLocationSuggestions } from '../../services/api';

interface LocationExplorerProps {
  onSelectLocation: (lat: number, lon: number) => void;
  currentLabel?: string | null;
}

interface SavedLocation {
  id: string;
  name: string;
  country: string;
  state: string | null;
  lat: number;
  lon: number;
}

const FAVORITES_KEY = 'aerosphere:favorites:v1';
const RECENTS_KEY = 'aerosphere:recents:v1';

function toSavedLocation(location: LocationSuggestion): SavedLocation {
  return {
    id: `${location.name}-${location.country}-${location.lat.toFixed(3)}-${location.lon.toFixed(3)}`,
    ...location,
  };
}

function formatLocationLabel(location: Pick<SavedLocation, 'name' | 'state' | 'country'>): string {
  const parts = [location.name];
  if (location.state) parts.push(location.state);
  parts.push(location.country);
  return parts.join(', ');
}

export default function LocationExplorer({ onSelectLocation, currentLabel }: LocationExplorerProps) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [favorites, setFavorites] = useState<SavedLocation[]>([]);
  const [recents, setRecents] = useState<SavedLocation[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    try {
      const rawFavorites = localStorage.getItem(FAVORITES_KEY);
      const rawRecents = localStorage.getItem(RECENTS_KEY);

      if (rawFavorites) setFavorites(JSON.parse(rawFavorites));
      if (rawRecents) setRecents(JSON.parse(rawRecents));
    } catch {
      // Ignore malformed local storage payloads.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
  }, [recents]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);

      try {
        const data = await fetchLocationSuggestions(trimmed, 7);
        setSuggestions(data);
      } catch {
        setSuggestions([]);
        setSearchError('Unable to load locations right now');
      } finally {
        setSearching(false);
      }
    }, 260);

    return () => clearTimeout(timer);
  }, [query]);

  const favoritesById = useMemo(() => new Set(favorites.map((item) => item.id)), [favorites]);

  const addRecent = (location: SavedLocation) => {
    setRecents((prev) => [location, ...prev.filter((item) => item.id !== location.id)].slice(0, 6));
  };

  const selectLocation = (location: SavedLocation, shouldClearSearch = true) => {
    onSelectLocation(location.lat, location.lon);
    addRecent(location);
    if (shouldClearSearch) {
      setQuery('');
      setSuggestions([]);
      setSearchError(null);
    }
  };

  const toggleFavorite = (location: SavedLocation) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === location.id)) {
        return prev.filter((item) => item.id !== location.id);
      }
      return [location, ...prev].slice(0, 8);
    });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setSearchError('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: SavedLocation = {
          id: `my-location-${position.coords.latitude.toFixed(3)}-${position.coords.longitude.toFixed(3)}`,
          name: 'My Location',
          country: 'Current',
          state: null,
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setGeoLoading(false);
        selectLocation(location);
      },
      () => {
        setGeoLoading(false);
        setSearchError('Unable to access your location');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="relative z-20 px-4 lg:px-8 pb-4">
      <motion.section
        className="relative overflow-visible rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-4 lg:p-5 shadow-2xl shadow-cyan-900/10"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <div className="flex flex-col xl:flex-row gap-3 xl:items-center">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any city (e.g. Delhi, London, Tokyo)"
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/40"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
              {searching ? 'Searching...' : 'City Search'}
            </div>

            <AnimatePresence>
              {(suggestions.length > 0 || searchError) && query.trim().length >= 2 && (
                <motion.div
                  className="absolute mt-2 w-full rounded-xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-xl overflow-hidden"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {searchError && (
                    <p className="px-4 py-3 text-xs text-rose-300">{searchError}</p>
                  )}
                  {!searchError &&
                    suggestions.map((location) => {
                      const saved = toSavedLocation(location);
                      const isFavorite = favoritesById.has(saved.id);

                      return (
                        <div
                          key={saved.id}
                          className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/5 last:border-b-0"
                        >
                          <button
                            className="text-left flex-1 text-sm text-slate-200 hover:text-cyan-300 transition-colors"
                            onClick={() => selectLocation(saved)}
                          >
                            {formatLocationLabel(saved)}
                          </button>
                          <button
                            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                              isFavorite
                                ? 'text-amber-200 border-amber-400/40 bg-amber-500/10'
                                : 'text-slate-400 border-white/10 hover:text-amber-200 hover:border-amber-300/40'
                            }`}
                            onClick={() => toggleFavorite(saved)}
                          >
                            {isFavorite ? 'Saved' : 'Save'}
                          </button>
                        </div>
                      );
                    })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={useMyLocation}
            className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200 hover:bg-cyan-500/20 transition-colors"
          >
            {geoLoading ? 'Locating...' : 'Use My Location'}
          </button>
        </div>

        <div className="mt-4 flex flex-col lg:flex-row gap-3">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-2">Favorites</p>
            <div className="flex flex-wrap gap-2 min-h-7">
              {favorites.length === 0 && (
                <span className="text-xs text-slate-500">Save locations from search results for one-click access.</span>
              )}
              {favorites.map((location) => (
                <button
                  key={location.id}
                  className="rounded-lg border border-amber-300/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-100 hover:bg-amber-500/20 transition-colors"
                  onClick={() => selectLocation(location, false)}
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-2">Recent Picks</p>
            <div className="flex flex-wrap gap-2 min-h-7">
              {recents.length === 0 && (
                <span className="text-xs text-slate-500">Your latest visited locations will appear here.</span>
              )}
              {recents.map((location) => (
                <button
                  key={location.id}
                  className="rounded-lg border border-white/15 bg-slate-800/60 px-2.5 py-1 text-xs text-slate-200 hover:border-cyan-400/40 hover:text-cyan-200 transition-colors"
                  onClick={() => selectLocation(location, false)}
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {currentLabel && (
          <p className="mt-3 text-xs text-slate-400">
            Currently viewing: <span className="text-cyan-300">{currentLabel}</span>
          </p>
        )}
      </motion.section>
    </div>
  );
}
