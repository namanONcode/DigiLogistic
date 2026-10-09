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
<button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors font-label-lg text-label-lg" type="button">
<span className="material-symbols-outlined text-[18px]">history</span>
<span>Preset Lanes</span>
</button>
<button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors font-label-lg text-label-lg" type="button">
<span className="material-symbols-outlined text-[18px]">share_location</span>
<span>ELD Webhook</span>
</button>
<div className="h-6 w-px bg-outline-variant/30 hidden sm:block"></div>
<button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-on-secondary shadow-sm hover:bg-secondary-container transition-all font-label-lg text-label-lg font-semibold" id="exportEldBtn" type="button">
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
<form className="p-space-lg flex flex-col gap-space-md" id="dispatchForm" onsubmit="event.preventDefault(); triggerRecalculate();">
{/*  Current / Origin  */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-lg text-label-lg text-on-surface font-medium flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-secondary">my_location</span>
                Current Location (Terminal / Rest)
              </label>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">GPS Latched</span>
</div>
<div className="relative flex items-center">
<input className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 shadow-sm transition-all" id="inputCurrent" type="text" value="Chicago Logistics Terminal, IL (Yard #4)"/>
<button className="absolute right-2.5 text-on-surface-variant hover:text-secondary" type="button">
<span className="material-symbols-outlined text-[18px]">near_me</span>
</button>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">41.8781° N, 87.6298° W • Tractor UNIT-9021</span>
</div>
{/*  Pickup Location  */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-lg text-label-lg text-on-surface font-medium flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-on-tertiary-container">warehouse</span>
                Pickup Facility
              </label>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">BOL #774-8839</span>
</div>
<div className="relative flex items-center">
<input className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 shadow-sm transition-all" id="inputPickup" type="text" value="Des Moines Distribution Hub, IA"/>
<span className="material-symbols-outlined absolute right-2.5 text-on-surface-variant text-[18px]">check_circle</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">Dock Appointment: Oct 28, 08:30 CDT (Firm)</span>
</div>
{/*  Dropoff Location  */}
<div className="flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<label className="font-label-lg text-label-lg text-on-surface font-medium flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-error">flag</span>
                Final Dropoff Location
              </label>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">Salt Lake City Port</span>
</div>
<div className="relative flex items-center">
<input className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/40 shadow-sm transition-all" id="inputDropoff" type="text" value="Salt Lake Logistics Park, UT (Gate 3)"/>
<span className="material-symbols-outlined absolute right-2.5 text-on-surface-variant text-[18px]">pin_drop</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">Unload Target: Oct 30, 14:00 MDT</span>
</div>
<div className="h-px bg-surface-container-high my-1"></div>
{/*  Cycle Used & Driver Roster  */}
<div className="grid grid-cols-2 gap-space-sm">
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">schedule</span>
                Cycle Used (70h)
              </label>
<div className="relative flex items-center">
<input className="w-full h-9 pl-3 pr-2 rounded-lg bg-surface-container-low text-on-surface font-code-data text-code-data focus:outline-none focus:ring-1 focus:ring-secondary shadow-sm" id="cycleUsedInput" type="text" value="38h 15m"/>
</div>
<span className="font-code-data-sm text-code-data-sm text-secondary">31h 45m left</span>
</div>
<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">timer</span>
                Driving Left (11h)
              </label>
<div className="relative flex items-center">
<input className="w-full h-9 pl-3 pr-2 rounded-lg bg-surface-container-low text-on-surface font-code-data text-code-data focus:outline-none focus:ring-1 focus:ring-secondary shadow-sm" type="text" value="09h 10m"/>
</div>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">14h shift resets 07:00</span>
</div>
</div>
{/*  Driver Profile Snippet  */}
<div className="p-3 rounded-lg bg-surface-container flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-title-sm text-title-sm font-bold">
                DR
              </div>
<div className="flex flex-col">
<span className="font-title-sm text-title-sm text-on-surface font-semibold">David Ramirez</span>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">CDL-A #IL-8849204 • Kenworth T680</span>
</div>
</div>
<span className="font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full bg-surface-container-lowest text-secondary font-semibold">ELITE 99.8%</span>
</div>
{/*  Routing Constraints Toggle Checkboxes  */}
<div className="flex flex-col gap-2 pt-1">
<label className="flex items-center gap-2 cursor-pointer text-on-surface font-body-sm text-body-sm">
<input checked="" className="w-4 h-4 rounded text-secondary focus:ring-secondary" type="checkbox"/>
<span>Auto-insert 30-min break after 8 cumulative driving hours</span>
</label>
<label className="flex items-center gap-2 cursor-pointer text-on-surface font-body-sm text-body-sm">
<input checked="" className="w-4 h-4 rounded text-secondary focus:ring-secondary" type="checkbox"/>
<span>Schedule 10-hour sleeper split at certified Love's / Pilot hubs</span>
</label>
<label className="flex items-center gap-2 cursor-pointer text-on-surface font-body-sm text-body-sm">
<input className="w-4 h-4 rounded text-secondary focus:ring-secondary" type="checkbox"/>
<span>Prioritize Toll-Free Interstate Bypass routes</span>
</label>
</div>
{/*  Submit Button  */}
<button className="w-full mt-2 h-11 rounded-lg bg-primary text-on-primary flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container transition-all group" id="btnCalculate" type="submit">
<span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-45">sync</span>
<span className="font-title-md text-title-md font-semibold">Calculate Route &amp; Logs</span>
<span className="hidden w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" id="calcSpinner"></span>
</button>
</form>
</div>
{/*  Live Dispatch Insights Box  */}
<div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-sm shadow-sm">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Auditor Safety Matrix</span>
<span className="font-code-data-sm text-code-data-sm text-secondary font-bold">FMCSA Part 395 Verified</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
          Predicted lane crosses 3 State POE weigh-scales (Iowa, Nebraska, Wyoming). Electronic pre-pass clearance active for vehicle unit <span className="font-code-data text-code-data font-semibold">#9021</span>.
        </p>
<div className="grid grid-cols-2 gap-2 pt-2">
<div className="p-2.5 rounded-lg bg-surface-container-lowest flex flex-col">
<span className="font-label-md text-label-md text-on-surface-variant uppercase">Weather Alert</span>
<span className="font-title-sm text-title-sm text-on-surface font-semibold">I-80 Elk Mtn Pass</span>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">Wind 34 mph • Dry</span>
</div>
<div className="p-2.5 rounded-lg bg-surface-container-lowest flex flex-col">
<span className="font-label-md text-label-md text-on-surface-variant uppercase">Fuel Optimization</span>
<span className="font-title-sm text-title-sm text-on-surface font-semibold">Stop: North Platte</span>
<span className="font-code-data-sm text-code-data-sm text-secondary font-semibold">$3.74/gal (-$0.28)</span>
</div>
</div>
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
<span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">1,482.6</span>
<span className="font-code-data text-code-data text-on-surface-variant font-medium">mi</span>
</div>
</div>
<div className="flex items-center gap-1.5 pt-1">
<span className="font-code-data-sm text-code-data-sm px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-semibold">+18.2 mi</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">vs toll-free path</span>
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
<span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">22<span className="text-title-md font-semibold text-on-surface-variant">h</span> 45<span className="text-title-md font-semibold text-on-surface-variant">m</span></span>
</div>
</div>
<div className="flex items-center gap-1.5 pt-1">
<span className="material-symbols-outlined text-secondary text-[14px]">timelapse</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">2 Driver Duty Shifts</span>
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
<span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">2</span>
<span className="font-title-sm text-title-sm text-on-surface-variant font-medium">10-Hr Breaks</span>
</div>
</div>
<div className="flex items-center gap-1.5 pt-1">
<span className="font-code-data-sm text-code-data-sm px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-medium">+ 2x 30m Breaks</span>
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
<div className="flex items-center gap-1 pt-1">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Zero Infractions Predicted</span>
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
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant hidden md:inline">I-80 WEST CORRIDOR (IL &gt; IA &gt; NE &gt; WY &gt; UT)</span>
</div>
<div className="flex items-center gap-2">
<div className="flex rounded-lg bg-surface-container-low p-0.5">
<button className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-on-surface font-label-md text-label-md font-semibold shadow-sm">Fleet Vector</button>
<button className="px-2.5 py-1 rounded-md text-on-surface-variant hover:text-on-surface font-label-md text-label-md">Satellite</button>
<button className="px-2.5 py-1 rounded-md text-on-surface-variant hover:text-on-surface font-label-md text-label-md">Terrain Profile</button>
</div>
<button className="p-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[18px]">fullscreen</span>
</button>
</div>
</div>
{/*  Simulated Interactive Map Canvas  */}
<div className="relative w-full h-80 bg-surface-container-high overflow-hidden" data-location="United States Interstate 80 corridor Chicago to Salt Lake City" style="">
{/*  Stylized SVG Map Graphics Overlay  */}
<svg className="absolute inset-0 w-full h-full text-secondary" fill="none" preserveaspectratio="none" viewbox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
<defs>
<lineargradient id="routeGradient" x1="0%" x2="100%" y1="0%" y2="0%" />
<stop offset="0%" stop-color="#0051d5"></stop>
<stop offset="35%" stop-color="#188ace"></stop>
<stop offset="70%" stop-color="#0051d5"></stop>
<stop offset="100%" stop-color="#131a33"></stop>
</lineargradient>
<filter height="140%" id="glow" width="140%" x="-20%" y="-20%">
<fegaussianblur result="glow" stddeviation="3"></fegaussianblur>
<fecomposite in="SourceGraphic" in2="glow" operator="over"></fecomposite>
</filter>
</defs>
{/*  Interstate Road Background Network  */}
<path d="M40 240 Q 200 230 380 200 T 760 110" opacity="0.6" stroke="#cce5ff" stroke-linecap="round" stroke-width="8" /></path>
<path d="M40 240 Q 200 230 380 200 T 760 110" stroke="#bec5e5" stroke-linecap="round" stroke-width="4" /></path>
<path d="M120 40 L 220 300 M 340 50 L 410 290 M 560 30 L 600 280" opacity="0.4" stroke="#cbdbf5" stroke-dasharray="4 4" stroke-width="1.5" /></path>
{/*  Active Calculated Primary Route  */}
<path d="M 80 210 C 180 210, 240 185, 330 180 C 440 175, 520 150, 620 145 C 680 140, 710 130, 730 120" filter="url(#glow)" stroke="url(#routeGradient)" stroke-linecap="round" stroke-width="5" /></path>
{/*  Nodes along the route  */}
{/*  Chicago Origin  */}
<circle cx="80" cy="210" fill="#0051d5" r="7" stroke="#ffffff" stroke-width="2.5" /></circle>
{/*  Des Moines Pickup  */}
<circle cx="210" cy="192" fill="#131a33" r="5" stroke="#ffffff" stroke-width="2" /></circle>
{/*  30m Rest Break #1  */}
<circle cx="360" cy="178" fill="#f59e0b" r="5" stroke="#ffffff" stroke-width="2" /></circle>
{/*  10h Sleeper Berth #1  */}
<circle cx="480" cy="162" fill="#1e293b" r="6" stroke="#ffffff" stroke-width="2" /></circle>
{/*  10h Sleeper Berth #2  */}
<circle cx="640" cy="138" fill="#1e293b" r="6" stroke="#ffffff" stroke-width="2" /></circle>
{/*  Salt Lake City Dropoff  */}
<circle cx="730" cy="120" fill="#000000" r="7" stroke="#ffffff" stroke-width="2.5" /></circle>
</svg>
{/*  Floating Glass Telemetry HUD overlay  */}
<div className="absolute top-4 left-4 p-3 rounded-lg bg-surface/90 backdrop-blur-md shadow-md flex flex-col gap-2 max-w-xs">
<div className="flex items-center justify-between gap-4">
<span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">Telemetry Stream</span>
<span className="font-code-data-sm text-code-data-sm text-secondary font-semibold">UNIT #9021</span>
</div>
<div className="grid grid-cols-3 gap-2 text-center">
<div className="p-1.5 rounded bg-surface-container-low">
<span className="block font-code-data text-code-data font-bold text-on-surface">62</span>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">mph avg</span>
</div>
<div className="p-1.5 rounded bg-surface-container-low">
<span className="block font-code-data text-code-data font-bold text-on-surface">4</span>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">Waypoints</span>
</div>
<div className="p-1.5 rounded bg-surface-container-low">
<span className="block font-code-data text-code-data font-bold text-secondary">Optimal</span>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">Fuel Pace</span>
</div>
</div>
</div>
{/*  Bottom floating legend  */}
<div className="absolute bottom-4 right-4 p-2.5 rounded-lg bg-surface/90 backdrop-blur-md shadow-md flex items-center gap-space-md">
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
<span className="font-code-data-sm text-code-data-sm text-on-surface font-medium">Driving Route</span>
</div>
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
<span className="font-code-data-sm text-code-data-sm text-on-surface font-medium">30m Break</span>
</div>
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
<span className="font-code-data-sm text-code-data-sm text-on-surface font-medium">10h Sleeper</span>
</div>
</div>
</div>
{/*  Telemetry Strip below map  */}
<div className="px-space-md py-2.5 bg-surface-container-low flex flex-wrap items-center justify-between text-on-surface-variant font-code-data-sm text-code-data-sm gap-2">
<span>ORIGIN: CHICAGO YARD #4 → WAYPOINTS: DES MOINES • NORTH PLATTE • CHEYENNE • EVANSTON → DEST: SALT LAKE CITY</span>
<span className="text-secondary font-semibold">EST. ARRIVAL: OCT 30 • 13:42 MDT</span>
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
<span className="font-code-data-sm text-code-data-sm px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-semibold">Total Stops: 5</span>
<span className="font-code-data-sm text-code-data-sm px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-bold">14h Window Compliant</span>
</div>
</div>
{/*  Vertical Continuous Timeline  */}
<div className="relative pl-6 sm:pl-8 flex flex-col gap-space-md mt-2">
{/*  Continuous colored timeline stem  */}
<div className="absolute left-2.5 sm:left-3.5 top-3 bottom-4 w-0.5 bg-surface-container-highest"></div>
{/*  Segment 1: Pre-trip & Departure  */}
<div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-surface hover:bg-surface-container-low transition-colors">
<div className="absolute -left-6 sm:-left-8 top-4 w-3 h-3 rounded-full bg-secondary ring-4 ring-surface-container-lowest"></div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold">ON DUTY (NOT DRIVING)</span>
<span className="font-title-sm text-title-sm text-on-surface font-semibold">Pre-Trip Inspection &amp; Chicago Yard Departure</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Pre-trip PTI completed • Odometer: 142,800.0 mi • Terminal Check-out</span>
</div>
<div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center">
<span className="font-code-data text-code-data text-on-surface font-bold">06:00 - 06:30 CDT</span>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">0h 30m • 0.0 mi</span>
</div>
</div>
{/*  Segment 2: Driving to Pickup  */}
<div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-surface hover:bg-surface-container-low transition-colors">
<div className="absolute -left-6 sm:-left-8 top-4 w-3 h-3 rounded-full bg-secondary-container ring-4 ring-surface-container-lowest"></div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">DRIVING</span>
<span className="font-title-sm text-title-sm text-on-surface font-semibold">Transit Leg 1: Chicago, IL → Des Moines, IA</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Interstate 88 W to I-80 W corridor • Clear asphalt conditions</span>
</div>
<div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center">
<span className="font-code-data text-code-data text-on-surface font-bold">06:30 - 11:45 CDT</span>
<span className="font-code-data-sm text-code-data-sm text-secondary font-semibold">5h 15m • 332.8 mi</span>
</div>
</div>
{/*  Segment 3: Live Load & 30m Rest Break  */}
<div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-surface-container-high/40 hover:bg-surface-container-high transition-colors">
<div className="absolute -left-6 sm:-left-8 top-4 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-surface-container-lowest"></div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">30-MIN MANDATORY REST</span>
<span className="font-title-sm text-title-sm text-on-surface font-semibold">Des Moines DC • Live Load &amp; DOT Rest Satisfied</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Shipper Seal #88192 lensed • 8-hr driving pause rule cleared</span>
</div>
<div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center">
<span className="font-code-data text-code-data text-on-surface font-bold">11:45 - 12:45 CDT</span>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">1h 00m • Dock Idle</span>
</div>
</div>
{/*  Segment 4: Driving Leg 2  */}
<div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-surface hover:bg-surface-container-low transition-colors">
<div className="absolute -left-6 sm:-left-8 top-4 w-3 h-3 rounded-full bg-secondary-container ring-4 ring-surface-container-lowest"></div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">DRIVING</span>
<span className="font-title-sm text-title-sm text-on-surface font-semibold">Transit Leg 2: Des Moines, IA → North Platte, NE</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Passing Omaha Weigh Station • Scale Pass Verified Green</span>
</div>
<div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center">
<span className="font-code-data text-code-data text-on-surface font-bold">12:45 - 18:30 CDT</span>
<span className="font-code-data-sm text-code-data-sm text-secondary font-semibold">5h 45m • 372.4 mi</span>
</div>
</div>
{/*  Segment 5: Mandatory 10-Hour Sleeper Berth #1  */}
<div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors">
<div className="absolute -left-6 sm:-left-8 top-4 w-3 h-3 rounded-full bg-slate-900 ring-4 ring-surface-container-lowest"></div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-bold">10-HOUR SLEEPER BERTH</span>
<span className="font-title-sm text-title-sm text-on-surface font-semibold">Pilot Travel Center #412 • North Platte, NE</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Full 10h statutory off-duty reset • Fuel stop &amp; DEF refill logged</span>
</div>
<div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center">
<span className="font-code-data text-code-data text-on-surface font-bold">18:30 - 04:30 CDT</span>
<span className="font-code-data-sm text-code-data-sm text-on-surface font-bold">10h 00m • Resets 11h/14h</span>
</div>
</div>
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
<button className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors">
<span className="material-symbols-outlined text-[16px]">print</span>
<span>Print Formats</span>
</button>
<button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md flex items-center gap-1.5 transition-colors">
<span className="material-symbols-outlined text-[16px]">download</span>
<span>Download PDF Bundle</span>
</button>
</div>
</div>
{/*  Sheet Preview Cards Gallery  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-2">
{/*  DAY 1 LOG SHEET CARD  */}
<div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between pb-2 bg-surface-container-high/40 p-2.5 rounded-lg">
<div className="flex flex-col">
<span className="font-title-sm text-title-sm text-on-surface font-bold">Day 1 Log • Oct 28, 2024</span>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">Sheet #ELD-20241028-01 • 705.2 Mi</span>
</div>
<span className="font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">VERIFIED LOG</span>
</div>
{/*  Standard 24-Hour Driver Duty Grid Mockup  */}
<div className="w-full bg-surface-container-lowest p-2 rounded-lg flex flex-col gap-1">
{/*  Grid Header Hours (0 - 24)  */}
<div className="flex items-center text-[10px] font-mono text-on-surface-variant px-1 justify-between select-none">
<span>M</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span><span>N</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span><span>M</span>
</div>
{/*  SVG 4-line standard FMCSA duty grid  */}
<svg className="w-full h-24" preserveaspectratio="none" viewbox="0 0 480 80">
{/*  Background lines for 4 states: Off, Sleeper, Driving, OnDuty  */}
<line stroke="#c6c6ce" stroke-width="1" x1="0" x2="480" y1="10" y2="10" /></line>
<line stroke="#c6c6ce" stroke-width="1" x1="0" x2="480" y1="30" y2="30" /></line>
<line stroke="#c6c6ce" stroke-width="1" x1="0" x2="480" y1="50" y2="50" /></line>
<line stroke="#c6c6ce" stroke-width="1" x1="0" x2="480" y1="70" y2="70" /></line>
{/*  24 vertical hour subdivision tick marks  */}
{/*  Every 20px = 1 hour  */}
<g stroke="#e2e8f0" stroke-width="1">
<line x1="40" x2="40" y1="0" y2="80" /></line>
<line x1="80" x2="80" y1="0" y2="80" /></line>
<line x1="120" x2="120" y1="0" y2="80" /></line>
<line x1="160" x2="160" y1="0" y2="80" /></line>
<line x1="200" x2="200" y1="0" y2="80" /></line>
<line x1="240" x2="240" y1="0" y2="80" /></line>
<line x1="280" x2="280" y1="0" y2="80" /></line>
<line x1="320" x2="320" y1="0" y2="80" /></line>
<line x1="360" x2="360" y1="0" y2="80" /></line>
<line x1="400" x2="400" y1="0" y2="80" /></line>
<line x1="440" x2="440" y1="0" y2="80" /></line>
</g>
{/*  Active Step Polyline: Graphing Duty Status  */}
{/*  Line 1: Off Duty (Y=10), Line 2: Sleeper (Y=30), Line 3: Driving (Y=50), Line 4: On Duty (Y=70)  */}
{/*  00:00 - 06:00: Off Duty (0 to 120px) -> Y=10  */}
{/*  06:00 - 06:30: On Duty (120 to 130px) -> Y=70  */}
{/*  06:30 - 11:45: Driving (130 to 235px) -> Y=50  */}
{/*  11:45 - 12:45: Off/Rest (235 to 255px) -> Y=10  */}
{/*  12:45 - 18:30: Driving (255 to 370px) -> Y=50  */}
{/*  18:30 - 24:00: Sleeper Berth (370 to 480px) -> Y=30  */}
<path d="M 0 10 L 120 10 L 120 70 L 130 70 L 130 50 L 235 50 L 235 10 L 255 10 L 255 50 L 370 50 L 370 30 L 480 30" fill="none" stroke="#0051d5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" /></path>
</svg>
{/*  State Label Annotations  */}
<div className="grid grid-cols-4 text-center font-code-data-sm text-code-data-sm pt-1 text-on-surface-variant">
<span>OFF: 7h 00m</span>
<span>SB: 5h 30m</span>
<span className="text-secondary font-semibold">D: 11h 00m</span>
<span>ON: 0h 30m</span>
</div>
</div>
{/*  Footer Details & Sign-off snippet  */}
<div className="flex items-center justify-between text-on-surface-variant font-code-data-sm text-code-data-sm pt-1">
<span>Carrier: Prime Haulage Logistics LLC</span>
<span className="text-on-surface font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
                Certified by David Ramirez
              </span>
</div>
</div>
{/*  DAY 2 LOG SHEET CARD  */}
<div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm shadow-sm hover:shadow-md transition-shadow">
<div className="flex items-center justify-between pb-2 bg-surface-container-high/40 p-2.5 rounded-lg">
<div className="flex flex-col">
<span className="font-title-sm text-title-sm text-on-surface font-bold">Day 2 Log • Oct 29, 2024</span>
<span className="font-code-data-sm text-code-data-sm text-on-surface-variant">Sheet #ELD-20241029-02 • 648.0 Mi</span>
</div>
<span className="font-code-data-sm text-code-data-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-semibold">PRE-DISPATCHED</span>
</div>
{/*  Standard 24-Hour Driver Duty Grid Mockup  */}
<div className="w-full bg-surface-container-lowest p-2 rounded-lg flex flex-col gap-1">
{/*  Grid Header Hours (0 - 24)  */}
<div className="flex items-center text-[10px] font-mono text-on-surface-variant px-1 justify-between select-none">
<span>M</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span><span>N</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span><span>M</span>
</div>
{/*  SVG 4-line standard FMCSA duty grid  */}
<svg className="w-full h-24" preserveaspectratio="none" viewbox="0 0 480 80">
{/*  Background lines for 4 states  */}
<line stroke="#c6c6ce" stroke-width="1" x1="0" x2="480" y1="10" y2="10" /></line>
<line stroke="#c6c6ce" stroke-width="1" x1="0" x2="480" y1="30" y2="30" /></line>
<line stroke="#c6c6ce" stroke-width="1" x1="0" x2="480" y1="50" y2="50" /></line>
<line stroke="#c6c6ce" stroke-width="1" x1="0" x2="480" y1="70" y2="70" /></line>
<g stroke="#e2e8f0" stroke-width="1">
<line x1="40" x2="40" y1="0" y2="80" /></line>
<line x1="80" x2="80" y1="0" y2="80" /></line>
<line x1="120" x2="120" y1="0" y2="80" /></line>
<line x1="160" x2="160" y1="0" y2="80" /></line>
<line x1="200" x2="200" y1="0" y2="80" /></line>
<line x1="240" x2="240" y1="0" y2="80" /></line>
<line x1="280" x2="280" y1="0" y2="80" /></line>
<line x1="320" x2="320" y1="0" y2="80" /></line>
<line x1="360" x2="360" y1="0" y2="80" /></line>
<line x1="400" x2="400" y1="0" y2="80" /></line>
<line x1="440" x2="440" y1="0" y2="80" /></line>
</g>
{/*  Active Step Polyline for Day 2  */}
{/*  00:00 - 04:30: Sleeper Berth (0 to 90px) -> Y=30  */}
{/*  04:30 - 05:00: On Duty PTI (90 to 100px) -> Y=70  */}
{/*  05:00 - 10:30: Driving (100 to 210px) -> Y=50  */}
{/*  10:30 - 11:15: 45m Rest (210 to 225px) -> Y=10  */}
{/*  11:15 - 16:30: Driving (225 to 330px) -> Y=50  */}
{/*  16:30 - 24:00: Sleeper Berth (330 to 480px) -> Y=30  */}
<path d="M 0 30 L 90 30 L 90 70 L 100 70 L 100 50 L 210 50 L 210 10 L 225 10 L 225 50 L 330 50 L 330 30 L 480 30" fill="none" stroke="#0051d5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" /></path>
</svg>
{/*  State Label Annotations  */}
<div className="grid grid-cols-4 text-center font-code-data-sm text-code-data-sm pt-1 text-on-surface-variant">
<span>OFF: 0h 45m</span>
<span>SB: 12h 00m</span>
<span className="text-secondary font-semibold">D: 10h 45m</span>
<span>ON: 0h 30m</span>
</div>
</div>
{/*  Footer Details & Sign-off snippet  */}
<div className="flex items-center justify-between text-on-surface-variant font-code-data-sm text-code-data-sm pt-1">
<span>Co-Driver: Unassigned (Single Operation)</span>
<span className="text-on-surface font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-[14px] text-secondary">fingerprint</span>
                ELD Hash: 8bfa92301
              </span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>