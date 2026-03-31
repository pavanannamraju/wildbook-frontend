import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import icon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import type { MapsDataDocument } from "../api/mapsData";
import { useMapsData } from "../hooks/useMapsData";

type LatLng = readonly [number, number];

const DEFAULT_CENTER: LatLng = [20.5937, 78.9629]; // India
const DEFAULT_ZOOM = 5;
const PAGE_SIZE = 25;

function asLatLng(doc: MapsDataDocument): LatLng {
  const [lng, lat] = doc.geometry.coordinates;
  return [lat, lng];
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 8, { animate: true });
      return;
    }
    map.fitBounds(points as L.LatLngBoundsExpression, { padding: [24, 24], animate: true });
  }, [map, points]);

  return null;
}

export function MapSection() {
  useEffect(() => {
    // Ensure marker icons resolve correctly in bundlers.
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: icon2xUrl,
      iconUrl,
      shadowUrl,
    });
  }, []);

  const { status, data, error, stats } = useMapsData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const allDocs = data ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const doc of allDocs) set.add(doc.category);
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [allDocs]);

  const filteredDocs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = allDocs.filter((doc) => {
      if (category !== "All" && doc.category !== category) return false;
      if (!q) return true;
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.state.toLowerCase().includes(q) ||
        doc.district.toLowerCase().includes(q)
      );
    });
    return filtered;
  }, [allDocs, category, query]);

  useEffect(() => {
    setPage(1);
  }, [query, category]);

  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageDocs = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredDocs.slice(start, start + PAGE_SIZE);
  }, [filteredDocs, safePage]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return allDocs.find((d) => d._id.$oid === selectedId) ?? null;
  }, [allDocs, selectedId]);

  const points = useMemo(() => filteredDocs.map(asLatLng), [filteredDocs]);

  return (
    <section className="mt-20 mx-auto max-w-[1920px] page-px">
      <div className="flex flex-col gap-3">
        <h2 className="font-['Cocogoose_Pro'] text-2xl md:text-3xl text-wildbook-text">
          Explore on the map
        </h2>
        <p className="text-wildbook-muted max-w-2xl">
          Showing {stats.total} sites loaded from the Wildbook API.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 overflow-hidden rounded-2xl border border-black/10 bg-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="h-[420px] w-full">
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={DEFAULT_ZOOM}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <FitBounds points={points} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {status === "success" && (
                <MarkerClusterGroup chunkedLoading showCoverageOnHover={false}>
                  {filteredDocs.map((doc) => {
                    const position = asLatLng(doc);
                    return (
                      <Marker
                        key={doc._id.$oid}
                        position={position}
                        eventHandlers={{
                          click: () => setSelectedId(doc._id.$oid),
                        }}
                      >
                        <Popup>
                          <div className="min-w-[240px]">
                            <div className="font-semibold text-wildbook-text">{doc.name}</div>
                            <div className="text-sm text-wildbook-muted">
                              {doc.category} · {doc.district}, {doc.state}
                            </div>
                            <div className="text-sm text-wildbook-muted mt-1">
                              {doc.area_display} · Best time: {doc.year_visit}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MarkerClusterGroup>
              )}
            </MapContainer>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl border border-black/10 bg-white/30 p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-end gap-3">
                <label className="flex-1">
                  <div className="text-xs font-semibold text-wildbook-muted">Search</div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Name, state, district…"
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-wildbook-teal/30"
                  />
                </label>
                <label className="w-[190px]">
                  <div className="text-xs font-semibold text-wildbook-muted">Category</div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-wildbook-teal/30"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-wildbook-muted">
                  Showing <span className="font-semibold text-wildbook-text">{formatNumber(filteredDocs.length)}</span>{" "}
                  results
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                  className="text-sm text-wildbook-teal hover:underline"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/30 p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-wildbook-text">Selected site</div>
              {selected && (
                <button
                  type="button"
                  className="text-sm text-wildbook-teal hover:underline"
                  onClick={() => setSelectedId(null)}
                >
                  Clear
                </button>
              )}
            </div>

            {!selected ? (
              <div className="mt-2 text-sm text-wildbook-muted">
                Click a cluster marker to zoom, or click a pin to see details.
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                <div className="text-lg font-semibold text-wildbook-text leading-snug">
                  {selected.name}
                </div>
                <div className="text-sm text-wildbook-muted">
                  {selected.category} · {selected.district}, {selected.state}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div className="rounded-xl bg-white/40 border border-black/10 p-3">
                    <div className="text-xs font-semibold text-wildbook-muted">Area</div>
                    <div className="mt-1 text-wildbook-text">{selected.area_display}</div>
                  </div>
                  <div className="rounded-xl bg-white/40 border border-black/10 p-3">
                    <div className="text-xs font-semibold text-wildbook-muted">Best time</div>
                    <div className="mt-1 text-wildbook-text">{selected.year_visit}</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-wildbook-muted">
                  <span className="font-semibold text-wildbook-text">Habitat:</span> {selected.habitat}
                </div>
                <div className="text-sm text-wildbook-muted">
                  <span className="font-semibold text-wildbook-text">Bio zone:</span> {selected.bio_zone}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        {status === "loading" && (
          <div className="rounded-2xl border border-black/10 bg-white/30 px-4 py-3 text-wildbook-muted">
            Loading sites…
          </div>
        )}
        {status === "error" && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-900">
            {error}
          </div>
        )}
        {status === "success" && (
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/30">
            <div className="px-4 py-3 flex items-center justify-between gap-4 border-b border-black/10">
              <div className="text-sm text-wildbook-muted">
                Page <span className="font-semibold text-wildbook-text">{safePage}</span> of{" "}
                <span className="font-semibold text-wildbook-text">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl border border-black/10 bg-white/50 px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl border border-black/10 bg-white/50 px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-left text-sm">
                <thead className="bg-black/5 text-wildbook-text">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">State</th>
                    <th className="px-4 py-3 font-semibold">District</th>
                    <th className="px-4 py-3 font-semibold">Area</th>
                    <th className="px-4 py-3 font-semibold">Best time</th>
                  </tr>
                </thead>
                <tbody>
                  {pageDocs.map((doc) => (
                    <tr
                      key={doc._id.$oid}
                      className="border-t border-black/10 hover:bg-black/5 cursor-pointer"
                      onClick={() => setSelectedId(doc._id.$oid)}
                    >
                      <td className="px-4 py-3 text-wildbook-text font-medium">{doc.name}</td>
                      <td className="px-4 py-3 text-wildbook-muted">{doc.category}</td>
                      <td className="px-4 py-3 text-wildbook-muted">{doc.state}</td>
                      <td className="px-4 py-3 text-wildbook-muted">{doc.district}</td>
                      <td className="px-4 py-3 text-wildbook-muted">{doc.area_display}</td>
                      <td className="px-4 py-3 text-wildbook-muted">{doc.year_visit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

