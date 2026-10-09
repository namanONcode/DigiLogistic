import re

with open('frontend/src/App.tsx', 'r') as f:
    content = f.read()

# We want to replace everything from `{/*  Segment 1: Pre-trip & Departure  */}` 
# up to `{/*  4. FMCSA Electronic Log Device (ELD) Grid Sheet Gallery  */}` (exclusive)

new_timeline_code = """
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
"""

# Find the start of segment 1 and the start of FMCSA Gallery
start_marker = "{/*  Segment 1: Pre-trip & Departure  */}"
end_marker = "{/*  4. FMCSA Electronic Log Device (ELD) Grid Sheet Gallery  */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    # Need to keep the </div> </div> before the end marker that close the timeline container
    # wait, my new code already includes `</div> </div>` at the end
    content = content[:start_idx] + new_timeline_code + "\n" + content[end_idx:]
    with open('frontend/src/App.tsx', 'w') as f:
        f.write(content)
    print("Timeline replaced successfully")
else:
    print("Markers not found!")
