import { jsPDF } from 'jspdf';

export const downloadPDFBundle = (images: string[]) => {
  if (!images || images.length === 0) {
    alert("No ELD log images to download.");
    return;
  }
  
  const doc = new jsPDF('landscape');
  images.forEach((img, index) => {
    if (index > 0) {
      doc.addPage();
    }
    // Assuming base64 starts with data:image/png;base64,...
    doc.addImage(img, 'PNG', 10, 10, 277, 190);
  });
  doc.save('eld_log_bundle.pdf');
};

export const exportInspectorBundle = (routeData: any, timeline: any) => {
  if (!routeData && !timeline) {
    alert("No active trip to export.");
    return;
  }
  const data = JSON.stringify({ route: routeData, timeline: timeline }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inspector_bundle.json";
  a.click();
  URL.revokeObjectURL(url);
};
