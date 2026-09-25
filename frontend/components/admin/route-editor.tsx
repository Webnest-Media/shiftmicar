"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  MapPin,
  Navigation,
  Plus,
  Trash2,
  Compass,
  ArrowRight,
  Globe,
} from "lucide-react";
import {
  AdminCard,
  AdminField,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/admin-ui";
import { CmsFilePicker, CmsSelect } from "@/components/admin/cms-controls";
import { SeoComposer, type SeoComposerData } from "@/components/admin/seo-composer";
import { api } from "@/lib/api";
import type { RouteItem } from "@/lib/blog-types";
import { toSlug } from "@/lib/blog-utils";

const quickCityPresets = [
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Guwahati", lat: 26.1445, lng: 91.7362 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Surat", lat: 21.1702, lng: 72.8311 },
  { name: "Vapi", lat: 20.3893, lng: 72.9106 },
  { name: "Gurgaon", lat: 28.4595, lng: 77.0266 },
  { name: "Kochi", lat: 9.9312, lng: 76.2673 },
  { name: "Malappuram", lat: 11.051, lng: 76.0711 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "India Center", lat: 22.3511, lng: 78.6677 },
];

type RouteEditorProps = {
  mode: "create" | "edit";
  initialRoute?: RouteItem;
};

export function RouteEditor({ mode, initialRoute }: RouteEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  // Core Route identity fields
  const [origin, setOrigin] = useState(initialRoute?.origin || initialRoute?.fromCity || "Delhi");
  const [destination, setDestination] = useState(initialRoute?.destination || initialRoute?.toCity || "Bangalore");
  const [number, setNumber] = useState(initialRoute?.number || "01");
  const [title, setTitle] = useState(initialRoute?.title || (initialRoute?.origin ? `${initialRoute.origin} to ${initialRoute.destination}` : "Delhi to Bangalore"));
  const [slug, setSlug] = useState(initialRoute?.slug || "delhi-to-bangalore");
  const [isPanIndia, setIsPanIndia] = useState<boolean>(initialRoute?.isPanIndia ?? false);
  const [featured, setFeatured] = useState<boolean>(initialRoute?.featured ?? false);

  // Distance & Transit
  const [distanceKm, setDistanceKm] = useState<number>(initialRoute?.distanceKm ?? 2150);
  const [transitDays, setTransitDays] = useState(initialRoute?.transitDays || "3-5 Days");

  // Detailed Narratives
  const [description, setDescription] = useState(
    initialRoute?.description || `Car transportation from ${origin} to ${destination}.`
  );
  const [detailDescription, setDetailDescription] = useState(
    initialRoute?.detailDescription ||
      initialRoute?.content ||
      `Move your car between ${origin} and ${destination} with a transportation service designed around reliable handling, flexible transport options, and a seamless delivery experience.`
  );

  // Media
  const [image, setImage] = useState(initialRoute?.image || "/assets/routes/route-01.jpg");
  const [alt, setAlt] = useState(
    initialRoute?.alt || `Vehicle transportation on route between ${origin} and ${destination}`
  );

  // Interactive Map Coordinates
  const [originLat, setOriginLat] = useState<string>(
    initialRoute?.originLat != null
      ? String(initialRoute.originLat)
      : initialRoute?.fromLat != null
      ? String(initialRoute.fromLat)
      : "28.6139"
  );
  const [originLng, setOriginLng] = useState<string>(
    initialRoute?.originLng != null
      ? String(initialRoute.originLng)
      : initialRoute?.fromLng != null
      ? String(initialRoute.fromLng)
      : "77.2090"
  );
  const [destinationLat, setDestinationLat] = useState<string>(
    initialRoute?.destinationLat != null
      ? String(initialRoute.destinationLat)
      : initialRoute?.toLat != null
      ? String(initialRoute.toLat)
      : "12.9716"
  );
  const [destinationLng, setDestinationLng] = useState<string>(
    initialRoute?.destinationLng != null
      ? String(initialRoute.destinationLng)
      : initialRoute?.toLng != null
      ? String(initialRoute.toLng)
      : "77.5946"
  );

  // Route Highlights (bullet points shown under Route Information)
  const [highlights, setHighlights] = useState<string[]>(
    initialRoute?.highlights && initialRoute.highlights.length > 0
      ? initialRoute.highlights
      : [
          "Professional vehicle handling throughout the journey",
          "Flexible transport options to suit your move",
          "Clear coordination from pickup through to delivery",
        ]
  );

  const [order, setOrder] = useState<number>(initialRoute?.order ?? 0);
  const [isActive, setIsActive] = useState<boolean>(initialRoute?.isActive ?? true);

  // SEO fields
  const [seo, setSeo] = useState<SeoComposerData>({
    focusKeyword: initialRoute?.focusKeyword || `${origin} to ${destination} car transport`,
    secondaryKeywords: (initialRoute?.secondaryKeywords || []).join(", "),
    metaTitle: initialRoute?.metaTitle || `${title || `${origin} to ${destination}`} | Shift My Car`,
    metaDescription: initialRoute?.metaDescription || detailDescription || "",
    canonicalUrl: initialRoute?.canonicalUrl || "",
    robotsIndex: initialRoute?.robotsIndex ?? true,
    robotsFollow: initialRoute?.robotsFollow ?? true,
    ogTitle: initialRoute?.ogTitle || "",
    ogDescription: initialRoute?.ogDescription || "",
    ogImage: initialRoute?.ogImage || image || "",
    twitterTitle: initialRoute?.twitterTitle || "",
    twitterDescription: initialRoute?.twitterDescription || "",
    twitterImage: initialRoute?.twitterImage || image || "",
    faqItems: initialRoute?.faqItems || [
      {
        question: `How many days does it take to ship a car from ${origin} to ${destination}?`,
        answer: `Car transport between ${origin} and ${destination} typically takes ${transitDays || "3-5 Days"} with live transit tracking.`,
      },
      {
        question: `Is insurance included for the ${origin} to ${destination} corridor?`,
        answer: "Yes, full comprehensive transit insurance with pre-dispatch condition inspection is included.",
      },
    ],
  });

  function handleSeoChange<K extends keyof SeoComposerData>(field: K, value: SeoComposerData[K]) {
    setSeo((prev) => ({ ...prev, [field]: value }));
  }

  function handleOriginChange(val: string) {
    setOrigin(val);
    if (!slugTouched) {
      const generated = toSlug(`${val}-to-${destination}`);
      setSlug(generated);
      setTitle(`${val} to ${destination}`);
    }
  }

  function handleDestinationChange(val: string) {
    setDestination(val);
    if (!slugTouched) {
      const generated = toSlug(`${origin}-to-${val}`);
      setSlug(generated);
      setTitle(`${origin} to ${val}`);
    }
  }

  // Quick preset helper
  function applyCityCoords(city: (typeof quickCityPresets)[number], target: "origin" | "destination") {
    if (target === "origin") {
      setOrigin(city.name);
      setOriginLat(String(city.lat));
      setOriginLng(String(city.lng));
      if (!slugTouched) {
        setSlug(toSlug(`${city.name}-to-${destination}`));
        setTitle(`${city.name} to ${destination}`);
      }
    } else {
      setDestination(city.name);
      setDestinationLat(String(city.lat));
      setDestinationLng(String(city.lng));
      if (!slugTouched) {
        setSlug(toSlug(`${origin}-to-${city.name}`));
        setTitle(`${origin} to ${city.name}`);
      }
    }
  }

  // Highlights handlers
  function addHighlight() {
    setHighlights([...highlights, ""]);
  }

  function updateHighlight(idx: number, text: string) {
    const next = [...highlights];
    next[idx] = text;
    setHighlights(next);
  }

  function removeHighlight(idx: number) {
    setHighlights(highlights.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      setError("Please specify both origin and destination cities.");
      return;
    }
    const finalSlug = slug.trim() || toSlug(`${origin}-to-${destination}`);

    setSaving(true);
    setError("");

    const parsedOriginLat = parseFloat(originLat) || 28.6139;
    const parsedOriginLng = parseFloat(originLng) || 77.2090;
    const parsedDestLat = destinationLat ? parseFloat(destinationLat) : null;
    const parsedDestLng = destinationLng ? parseFloat(destinationLng) : null;

    const payload = {
      origin: origin.trim(),
      destination: destination.trim(),
      fromCity: origin.trim(),
      toCity: destination.trim(),
      number: number.trim() || "01",
      title: title.trim() || `${origin.trim()} to ${destination.trim()}`,
      slug: finalSlug,
      description: description.trim() || `Car transportation from ${origin.trim()} to ${destination.trim()}.`,
      detailDescription: detailDescription.trim(),
      image: image.trim() || "/assets/routes/route-01.jpg",
      alt: alt.trim() || `Car transport from ${origin.trim()} to ${destination.trim()}`,
      originLat: parsedOriginLat,
      originLng: parsedOriginLng,
      destinationLat: parsedDestLat,
      destinationLng: parsedDestLng,
      fromLat: parsedOriginLat,
      fromLng: parsedOriginLng,
      toLat: parsedDestLat,
      toLng: parsedDestLng,
      distanceKm: Number(distanceKm) || 0,
      transitDays: transitDays.trim() || "3-5 Days",
      highlights: highlights.map((h) => h.trim()).filter(Boolean),
      isPanIndia,
      featured,
      order: Number(order) || 0,
      isActive,
      focusKeyword: seo.focusKeyword.trim() || null,
      secondaryKeywords: seo.secondaryKeywords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      metaTitle: seo.metaTitle.trim() || null,
      metaDescription: seo.metaDescription.trim() || null,
      canonicalUrl: seo.canonicalUrl.trim() || null,
      robotsIndex: seo.robotsIndex,
      robotsFollow: seo.robotsFollow,
      ogTitle: seo.ogTitle.trim() || null,
      ogDescription: seo.ogDescription.trim() || null,
      ogImage: seo.ogImage.trim() || image.trim() || null,
      twitterTitle: seo.twitterTitle.trim() || null,
      twitterDescription: seo.twitterDescription.trim() || null,
      twitterImage: seo.twitterImage.trim() || image.trim() || null,
      faqItems: seo.faqItems.filter((f) => f.question.trim() && f.answer.trim()),
    };

    try {
      if (mode === "create") {
        await api.createRoute(payload);
      } else if (initialRoute?.id) {
        await api.updateRoute(initialRoute.id, payload);
      }
      router.push("/admin/routes");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save route");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto pb-16 text-zinc-900">
      {/* Top sticky action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 bg-white/95 backdrop-blur-md py-3 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/routes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition"
          >
            <ArrowLeft size={16} /> All Routes
          </Link>
          <span className="text-zinc-300">/</span>
          <h1 className="text-lg font-bold text-zinc-900">
            {mode === "create" ? "Add New Route" : `Edit Route: ${title || `${origin} to ${destination}`}`}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={adminBtnSecondary}
            onClick={() => router.push("/admin/routes")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`${adminBtnPrimary} flex items-center gap-2`}
          >
            {saving ? "Saving…" : mode === "create" ? "Create Route" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Corridor & Identity */}
          <AdminCard>
            <h2 className="text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-indigo-600" />
              Route Corridor & Identity
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminField label="Origin City" hint="Starting point (e.g. Delhi, Gurugram)">
                  <input
                    required
                    className={adminInputClass}
                    placeholder="e.g. Delhi"
                    value={origin}
                    onChange={(e) => handleOriginChange(e.target.value)}
                  />
                </AdminField>

                <AdminField label="Destination City" hint="Arrival point (e.g. Bangalore, Guwahati)">
                  <input
                    required
                    className={adminInputClass}
                    placeholder="e.g. Bangalore"
                    value={destination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                  />
                </AdminField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <AdminField label="Route Title / Heading" hint="Rendered as main headline on the page">
                    <input
                      required
                      className={adminInputClass}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </AdminField>
                </div>

                <div>
                  <AdminField label="Route Index / Number" hint="e.g. 01, 02, 10">
                    <input
                      required
                      className={adminInputClass}
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </AdminField>
                </div>
              </div>

              <AdminField label="URL Slug" hint="Unique address: /routes/[slug]">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-2 text-xs font-mono text-zinc-500 bg-zinc-100 border border-r-0 border-zinc-200 rounded-l-lg">
                    /routes/
                  </span>
                  <input
                    required
                    className={`${adminInputClass} rounded-l-none font-mono text-xs`}
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(toSlug(e.target.value));
                    }}
                  />
                </div>
              </AdminField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminField label="Distance (Kilometers)" hint="e.g. 2150">
                  <input
                    type="number"
                    className={adminInputClass}
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                  />
                </AdminField>

                <AdminField label="Estimated Transit Time" hint="e.g. 3-5 Days">
                  <input
                    className={adminInputClass}
                    value={transitDays}
                    onChange={(e) => setTransitDays(e.target.value)}
                  />
                </AdminField>
              </div>
            </div>
          </AdminCard>

          {/* Detailed Narratives */}
          <AdminCard>
            <h2 className="text-base font-bold text-zinc-900 mb-4">
              Page Narratives & Descriptions
            </h2>

            <div className="space-y-4">
              <AdminField label="Short Summary" hint="Appears on route cards in route lists">
                <input
                  className={adminInputClass}
                  placeholder={`Car transportation from ${origin} to ${destination}.`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </AdminField>

              <AdminField
                label="Detailed Narrative (Hero Overview)"
                hint="Displayed in the hero banner beside the quote button"
              >
                <textarea
                  rows={4}
                  required
                  className={adminTextareaClass}
                  placeholder="Move your car with a transportation service designed around reliable handling, flexible transport options, and a seamless delivery experience..."
                  value={detailDescription}
                  onChange={(e) => setDetailDescription(e.target.value)}
                />
              </AdminField>
            </div>
          </AdminCard>

          {/* Interactive Map Section (Leaflet / OpenStreetMap - No API Key Needed) */}
          <AdminCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-indigo-600" />
                  Interactive Map & GPS Coordinates
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                  Directly controls the interactive map and road path visualization on the route page.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check size={13} /> OpenStreetMap Active (No API Key Required)
              </div>
            </div>

            {/* Quick City Presets Dropdown / Buttons */}
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 mb-5">
              <span className="text-xs font-bold text-indigo-900 block mb-2">
                Quick Indian City Coordinate Presets:
              </span>
              <p className="text-xs text-indigo-700/80 mb-3">
                Click any city to instantly fill coordinates for Origin or Destination:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickCityPresets.map((city) => (
                  <div key={city.name} className="inline-flex items-center rounded-lg border border-indigo-200 bg-white text-xs font-medium text-zinc-700 overflow-hidden shadow-xs">
                    <span className="px-2 py-1 font-semibold">{city.name}</span>
                    <button
                      type="button"
                      onClick={() => applyCityCoords(city, "origin")}
                      className="px-1.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white transition text-[10px] font-bold border-l border-indigo-100"
                      title={`Set ${city.name} as Origin`}
                    >
                      As Origin
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCityCoords(city, "destination")}
                      className="px-1.5 py-1 bg-purple-50 hover:bg-purple-600 hover:text-white transition text-[10px] font-bold border-l border-indigo-100"
                      title={`Set ${city.name} as Destination`}
                    >
                      As Dest
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Coordinate inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Origin coords */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-600" /> Origin: {origin}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Departure</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <AdminField label="Latitude">
                    <input
                      className={`${adminInputClass} font-mono text-xs`}
                      placeholder="28.6139"
                      value={originLat}
                      onChange={(e) => setOriginLat(e.target.value)}
                    />
                  </AdminField>
                  <AdminField label="Longitude">
                    <input
                      className={`${adminInputClass} font-mono text-xs`}
                      placeholder="77.2090"
                      value={originLng}
                      onChange={(e) => setOriginLng(e.target.value)}
                    />
                  </AdminField>
                </div>
              </div>

              {/* Destination coords */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <MapPin size={14} className="text-indigo-600" /> Destination: {destination}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Arrival</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <AdminField label="Latitude">
                    <input
                      className={`${adminInputClass} font-mono text-xs`}
                      placeholder="12.9716"
                      value={destinationLat}
                      onChange={(e) => setDestinationLat(e.target.value)}
                    />
                  </AdminField>
                  <AdminField label="Longitude">
                    <input
                      className={`${adminInputClass} font-mono text-xs`}
                      placeholder="77.5946"
                      value={destinationLng}
                      onChange={(e) => setDestinationLng(e.target.value)}
                    />
                  </AdminField>
                </div>
              </div>
            </div>

            {/* Map visual indicator badge */}
            <div className="mt-4 p-3 rounded-xl border border-zinc-200 bg-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
                <span className="font-bold text-emerald-700">[{originLat || "0"}, {originLng || "0"}]</span>
                <ArrowRight size={14} className="text-zinc-400" />
                <span className="font-bold text-indigo-700">[{destinationLat || "0"}, {destinationLng || "0"}]</span>
              </div>
              <div className="text-xs text-zinc-500 font-medium">
                Leaflet map centers automatically around these points.
              </div>
            </div>
          </AdminCard>

          {/* Route Highlights Builder ("Route Information") */}
          <AdminCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900">
                  Route Highlights ("Route Information" section)
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                  Bullet points displayed prominently on the public route page.
                </p>
              </div>
              <button
                type="button"
                className={adminBtnSecondary}
                onClick={addHighlight}
              >
                <Plus size={14} className="mr-1 inline" /> Add Bullet Point
              </button>
            </div>

            <div className="space-y-3">
              {highlights.map((h, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-center p-2.5 rounded-lg border border-zinc-200 bg-zinc-50"
                >
                  <span className="size-2 rounded-full bg-indigo-600 shrink-0 ml-1" />
                  <input
                    className={`${adminInputClass} flex-1`}
                    placeholder="Highlight detail..."
                    value={h}
                    onChange={(e) => updateHighlight(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    className="text-zinc-400 hover:text-red-600 transition p-1.5"
                    aria-label="Remove bullet point"
                    onClick={() => removeHighlight(idx)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Detailed SEO Studio Section */}
          <SeoComposer
            data={seo}
            onChange={handleSeoChange}
            context={{
              title,
              slug,
              urlPath: `/routes/${slug || "route-slug"}`,
              content: detailDescription,
              excerpt: description,
              image,
            }}
          />
        </div>

        {/* Right 1 Col: Publishing Settings & Media */}
        <div className="space-y-6">
          <AdminCard>
            <h3 className="text-sm font-bold text-zinc-900 mb-4">
              Publishing & Route Flags
            </h3>
            <div className="space-y-4">
              <AdminField label="Visibility">
                <CmsSelect
                  value={isActive ? "active" : "inactive"}
                  onChange={(val) => setIsActive(val === "active")}
                  options={[
                    { value: "active", label: "Active & Published" },
                    { value: "inactive", label: "Draft / Hidden" },
                  ]}
                />
              </AdminField>

              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50">
                <div>
                  <span className="text-xs font-bold text-zinc-900 block">
                    Featured Route
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Highlighted on the homepage & route grid
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded text-indigo-600 border-zinc-300"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50">
                <div>
                  <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <Globe size={13} className="text-indigo-600" /> Pan-India Hub Route
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Displays nationwide coverage map instead of point-to-point line
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isPanIndia}
                  onChange={(e) => setIsPanIndia(e.target.checked)}
                  className="h-4 w-4 rounded text-indigo-600 border-zinc-300"
                />
              </div>

              <AdminField label="Sort Order" hint="Lower numbers appear first">
                <input
                  type="number"
                  className={adminInputClass}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                />
              </AdminField>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-sm font-bold text-zinc-900 mb-4">
              Hero Cover Image
            </h3>
            <div className="space-y-4">
              <AdminField label="Image URL">
                <input
                  className={adminInputClass}
                  placeholder="/assets/routes/route-01.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </AdminField>

              <AdminField label="Alt Text" hint="Descriptive text for accessibility & Google Image SEO">
                <input
                  className={adminInputClass}
                  placeholder="e.g. Car carrier on highway"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                />
              </AdminField>

              <AdminField label="Or Upload New Image">
                <CmsFilePicker
                  accept="image/*"
                  label="Upload Route Image"
                  onChange={async (file) => {
                    if (file) {
                      try {
                        const media = await api.uploadMedia(file);
                        setImage(media.url);
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Upload failed");
                      }
                    }
                  }}
                />
              </AdminField>

              {image && (
                <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={alt || "Route preview"} className="w-full h-44 object-cover" />
                </div>
              )}
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-sm font-bold text-zinc-900 mb-2">
              Live Public URL
            </h3>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-700 break-all">
              /routes/{slug || "slug"}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mt-3">
              <Check size={14} /> Real-time Leaflet Map rendering enabled
            </div>
          </AdminCard>
        </div>
      </div>
    </form>
  );
}
