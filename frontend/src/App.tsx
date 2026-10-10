import React, { useState } from 'react';
import axios from 'axios';
import Map from './components/Map';
import { downloadPDFBundle, exportInspectorBundle } from './utils';

function App() {
  const [current, setCurrent] = useState('');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [cycleUsed, setCycleUsed] = useState<number>(0);
  
  const [routeData, setRouteData] = useState<any>(null);
  const [responseTimeline, setResponseTimeline] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [points, setPoints] = useState<any>(null);
  const [resolvedNames, setResolvedNames] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapType, setMapType] = useState('Fleet Vector');
  
  const handleReset = () => {
    setCurrent('');
    setPickup('');
    setDropoff('');
    setCycleUsed(0);
    setRouteData(null);
    setResponseTimeline(null);
    setImages([]);
    setPoints(null);
    setResolvedNames(null);
    setError('');
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/calculate/', {
        current,
        pickup,
        dropoff,
        cycle_used: cycleUsed
      });
      setRouteData(response.data.route);
      setResponseTimeline(response.data.timeline);
      setImages(response.data.images || []);
      setPoints(response.data.points);
      setResolvedNames(response.data.resolved_names);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to calculate route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen">
      <header className="fixed top-0 left-0 w-full h-16 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="w-full h-full px-gutter-desktop flex items-center justify-between gap-space-lg"><div className="flex items-center gap-space-lg"><div className="flex items-center gap-space-sm"><div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm"><span className="material-symbols-outlined text-[20px]">local_shipping</span></div><div className="flex flex-col"><span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-bold leading-none">DigiLogistic</span><span className="font-code-data-sm text-code-data-sm text-on-surface-variant tracking-wider uppercase leading-none mt-1">ELD Enterprise</span></div></div></div></div></header>
      <main className="w-full min-h-screen pt-16 px-gutter-desktop pb-space-xl bg-surface"><div className="flex flex-col w-full gap-space-lg pb-space-xl">
{/*  Status & Quick Broadcast Bar  */}
<div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md p-space-md bg-surface-container-lowest rounded-xl shadow-sm">
<div className="flex items-center gap-space-md">
<div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></div>
<div className="flex flex-col">
<div className="flex items-center gap-space-sm">
<span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">Route &amp; Log Dispatch Planner</span>
<span className="font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-semibold">FMCSA § 395.20 AUTOMATED</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Real-time telematics dispatch routing, continuous shift projection, and CFR compliance auditing.</p>
</div>
</div>
<div className="flex items-center gap-space-sm self-stretch lg:self-auto justify-end">
<button onClick={() => exportInspectorBundle(routeData, responseTimeline)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-on-secondary shadow-sm hover:bg-secondary-container transition-all font-label-lg text-label-lg font-semibold" id="exportEldBtn" type="button">
<span className="material-symbols-outlined text-[18px]">file_download</span>
<span>Export Inspector Bundle</span>
</button>
</div>
</div>
{/*  Primary Workspace: Split Layout  */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
{/*  LEFT PANEL: Trip & Dispatch Planner Card  */}
<div className="xl:col-span-4 flex flex-col gap-space-lg">
<div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
{/*  Panel Header  */}
<div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[20px]">alt_route</span>
<span className="font-title-md text-title-md text-on-surface font-semibold">Dispatch Parameters</span>
</div>
<span className="font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">SOLO 70H/8D</span>
</div>
<form className="p-space-lg flex flex-col gap-space-md" id="dispatchForm" onSubmit={handleCalculate}>
{/*  Current / Origin  */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-lg text-label-lg text-on-surface font-medium flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-secondary">my_location</span>
                Current Location (Terminal / Rest)
              </label>
</div>
<div className="relative flex items-center">
<input className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 shadow-sm transition-all" id="inputCurrent" type="text" placeholder="e.g. New York, NY" value={current} onChange={(e) => setCurrent(e.target.value)} required />
<button onClick={() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrent(`${position.coords.latitude}, ${position.coords.longitude}`);
      },
      () => {
        alert('Unable to retrieve your location');
      }
    );
  } else {
    alert('Geolocation is not supported by your browser');
  }
}} className="absolute right-2.5 text-on-surface-variant hover:text-secondary" type="button" title="Use my current location">
<span className="material-symbols-outlined text-[18px]">near_me</span>
</button>
</div>
</div>
{/*  Pickup Location  */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-lg text-label-lg text-on-surface font-medium flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-on-tertiary-container">warehouse</span>
                Pickup Facility
              </label>
</div>
<div className="relative flex items-center">
<input className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 shadow-sm transition-all" id="inputPickup" type="text" placeholder="e.g. Philadelphia, PA" value={pickup} onChange={(e) => setPickup(e.target.value)} required />
<span className="material-symbols-outlined absolute right-2.5 text-on-surface-variant text-[18px]">check_circle</span>
</div>
</div>
{/*  Dropoff Location  */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-lg text-label-lg text-on-surface font-medium flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-error">flag</span>
                Final Dropoff Location
              </label>
</div>
<div className="relative flex items-center">
<input className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 shadow-sm transition-all" id="inputDropoff" type="text" placeholder="e.g. Washington, DC" value={dropoff} onChange={(e) => setDropoff(e.target.value)} required />
<span className="material-symbols-outlined absolute right-2.5 text-on-surface-variant text-[18px]">pin_drop</span>
</div>
</div>
<div className="h-px bg-surface-container-high my-1"></div>
{/*  Cycle Used  */}
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">schedule</span>
                Cycle Used (70h)
              </label>
<div className="relative flex items-center">
<input className="w-full h-9 pl-3 pr-2 rounded-lg bg-surface-container-low text-on-surface font-code-data text-code-data focus:outline-none focus:ring-1 focus:ring-secondary shadow-sm" id="cycleUsedInput" type="number" min="0" max="70" step="0.5" value={cycleUsed} onChange={(e) => setCycleUsed(parseFloat(e.target.value))} required />
</div>
</div>

{/*  Submit Button  */}
{error && <div className="text-error bg-error-container p-3 rounded-lg text-sm mt-4 font-semibold">{error}</div>}
<button className="w-full mt-2 h-11 rounded-lg bg-primary text-on-primary flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container transition-all group" id="btnCalculate" type="submit" disabled={loading}>
<span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-45">sync</span>
<span className="font-title-md text-title-md font-semibold">{loading ? "Calculating..." : "Calculate Route & Logs"}</span>
<span className="hidden w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" id="calcSpinner"></span>
</button>
<button type="button" onClick={handleReset} className="w-full mt-2 h-11 rounded-lg bg-surface-container-low text-on-surface flex items-center justify-center gap-2 shadow-sm hover:bg-surface-container-high transition-all group">
<span className="material-symbols-outlined text-[20px]">refresh</span>
<span className="font-title-md text-title-md font-semibold">New Trip</span>
</button>
</form>
</div>

</div>
{/*  RIGHT/MAIN PANEL: Map, Timeline & ELD Grids  */}
<div className="xl:col-span-8 flex flex-col gap-space-lg">
{/*  1. Top Metric KPI Cards  */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
{/*  KPI 1  */}
<div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Distance</span>
<div className="w-7 h-7 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
<span className="material-symbols-outlined text-[16px]">local_shipping</span>
</div>
</div>
<div className="my-2">
<div className="flex items-baseline gap-1">
<span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">{routeData ? (routeData.distance * 0.000621371).toFixed(1) : "0.0"}</span>
<span className="font-code-data text-code-data text-on-surface-variant font-medium">mi</span>
</div>
</div>
</div>
{/*  KPI 2  */}
<div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Est. Driving Time</span>
<div className="w-7 h-7 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
<span className="material-symbols-outlined text-[16px]">schedule</span>
</div>
</div>
<div className="my-2">
<div className="flex items-baseline gap-1">
<span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">{routeData ? Math.floor(routeData.duration / 3600) : 0}<span className="text-title-md font-semibold text-on-surface-variant">h</span> {routeData ? Math.floor((routeData.duration % 3600) / 60) : 0}<span className="text-title-md font-semibold text-on-surface-variant">m</span></span>
</div>
</div>
</div>
{/*  KPI 3  */}
<div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Mandatory Rests</span>
<div className="w-7 h-7 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
<span className="material-symbols-outlined text-[16px]">hotel</span>
</div>
</div>
<div className="my-2">
<div className="flex items-baseline gap-1">
<span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">{responseTimeline ? responseTimeline.filter((t: any) => t.status === "10-Hour Sleeper Berth" || t.status === "Sleeper Berth").length : 0}</span>
<span className="font-title-sm text-title-sm text-on-surface-variant font-medium">10-Hr Breaks</span>
</div>
</div>
</div>
{/*  KPI 4  */}
<div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">HOS Status</span>
<div className="w-7 h-7 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
<span className="material-symbols-outlined text-[16px]">verified</span>
</div>
</div>
<div className="my-2">
<div className="flex items-center gap-1.5">
<span className="font-title-md text-title-md text-secondary font-bold">100% Compliant</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface font-medium">70hr / 8-Day Rule</span>
</div>
</div>
</div>
{/*  2. Interactive Map Container  */}
<div className="relative w-full rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm">
{/*  Map Header Toolbar  */}
<div className="p-space-md bg-surface-container-lowest flex flex-wrap items-center justify-between gap-space-sm z-10">
<div className="flex items-center gap-space-sm">
<div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low">
<span className="material-symbols-outlined text-secondary text-[16px]">explore</span>
<span className="font-title-sm text-title-sm text-on-surface font-semibold">Active Dispatch Route</span>
</div>
</div>
<div className="flex items-center gap-2">
<div className="flex rounded-lg bg-surface-container-low p-0.5">
<button onClick={() => setMapType('Fleet Vector')} className={`px-2.5 py-1 rounded-md font-label-md text-label-md ${mapType === 'Fleet Vector' ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Fleet Vector</button>
<button onClick={() => setMapType('Satellite')} className={`px-2.5 py-1 rounded-md font-label-md text-label-md ${mapType === 'Satellite' ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Satellite</button>
<button onClick={() => setMapType('Terrain Profile')} className={`px-2.5 py-1 rounded-md font-label-md text-label-md ${mapType === 'Terrain Profile' ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Terrain Profile</button>
</div>
<button onClick={() => alert('Fullscreen toggled')} className="p-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[18px]">fullscreen</span>
</button>
</div>
</div>
{/*  Simulated Interactive Map Canvas  */}
<div className="relative w-full h-80 bg-surface-container-high overflow-hidden">
{/*  Stylized SVG Map Graphics Overlay  */}
<Map routeGeojson={routeData} points={points} resolvedNames={resolvedNames} />
</div>
</div>
{/*  3. Trip Timeline & Duty Segments  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Planned Duty Cycles &amp; Shift Segments</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Automated regulatory split matching FMCSA 49 CFR § 395.3 property-carrying limits.</p>
</div>
<div className="flex items-center gap-2">
<span className="font-code-data-sm text-code-data-sm px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-bold">14h Window Compliant</span>
</div>
</div>
{/*  Vertical Continuous Timeline  */}
<div className="relative pl-6 sm:pl-8 flex flex-col gap-space-md mt-2">
{/*  Continuous colored timeline stem  */}
<div className="absolute left-2.5 sm:left-3.5 top-3 bottom-4 w-0.5 bg-surface-container-highest"></div>

{responseTimeline && responseTimeline.length > 0 ? (
  responseTimeline.map((ev: any, idx: number) => {
    let dotColor = "bg-secondary";
    let pillColor = "bg-surface-container-high text-on-surface";
    let bgHover = "hover:bg-surface-container-low bg-surface";
    let label = ev.status.toUpperCase();
    
    if (ev.status === "Driving") {
      dotColor = "bg-secondary-container";
      pillColor = "bg-secondary-fixed text-on-secondary-fixed";
      bgHover = "hover:bg-surface-container-low bg-surface";
    } else if (ev.status === "Off Duty") {
      dotColor = "bg-amber-500";
      pillColor = "bg-amber-100 text-amber-800";
      bgHover = "bg-surface-container-high/40 hover:bg-surface-container-high";
    } else if (ev.status === "Sleeper Berth") {
      dotColor = "bg-slate-900";
      pillColor = "bg-primary-container text-on-primary";
      bgHover = "bg-surface-container-low hover:bg-surface-container-high";
    } else if (ev.status === "On Duty") {
      label = "ON DUTY (NOT DRIVING)";
    }
    
    const startTime = new Date(ev.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const endTime = new Date(ev.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // format duration
    const hrs = Math.floor(ev.duration_hours);
    const mins = Math.round((ev.duration_hours - hrs) * 60);

    return (
      <div key={idx} className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg transition-colors ${bgHover}`}>
        <div className={`absolute -left-6 sm:-left-8 top-4 w-3 h-3 rounded-full ring-4 ring-surface-container-lowest ${dotColor}`}></div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full font-bold ${pillColor}`}>{label}</span>
            <span className="font-title-sm text-title-sm text-on-surface font-semibold">{ev.description}</span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{ev.location}</span>
        </div>
        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center">
          <span className="font-code-data text-code-data text-on-surface font-bold">{startTime} - {endTime}</span>
          <span className={`font-code-data-sm text-code-data-sm ${ev.status === 'Driving' ? 'text-secondary font-semibold' : 'text-on-surface-variant'}`}>{hrs}h {mins}m</span>
        </div>
      </div>
    );
  })
) : (
  <div className="p-4 text-center text-on-surface-variant font-body-sm">
    No timeline available. Calculate a route to view segments.
  </div>
)}
</div>
</div>

{/*  4. FMCSA Electronic Log Device (ELD) Grid Sheet Gallery  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
<div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[22px]">fact_check</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">FMCSA 24-Hour ELD Driver Log Sheets</h2>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">Generated standard electronic record of duty status (RODS) sheets per 49 CFR Part 395 Subpart B.</p>
</div>
<div className="flex items-center gap-2">
<button onClick={() => window.print()} className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors">
<span className="material-symbols-outlined text-[16px]">print</span>
<span>Print Formats</span>
</button>
<button onClick={() => downloadPDFBundle(images)} className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md flex items-center gap-1.5 transition-colors">
<span className="material-symbols-outlined text-[16px]">download</span>
<span>Download PDF Bundle</span>
</button>
</div>
</div>
{/*  Sheet Preview Cards Gallery  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-2">
{images && images.map((imgBase64: string, idx: number) => (
<div key={idx} className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between pb-2 bg-surface-container-high/40 p-2.5 rounded-lg">
<div className="flex flex-col">
<span className="font-title-sm text-title-sm text-on-surface font-bold">Day {idx + 1} Log</span>
</div>
<span className="font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">VERIFIED LOG</span>
</div>
<div className="w-full bg-surface-container-lowest p-2 rounded-lg flex flex-col gap-1">
<img src={imgBase64} alt={`ELD Log Day ${idx + 1}`} className="w-full h-auto object-contain" />
</div>
</div>
))}
</div>
</div>
</div>
</div>
</div>
</main>
    </div>
  );
}

export default App;
