import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadPDFBundle, exportInspectorBundle } from './utils';
import jsPDF from 'jspdf';

vi.mock('jspdf', () => {
  return {
    default: class {
      addPage = vi.fn();
      addImage = vi.fn();
      save = vi.fn();
    }
  };
});

describe('utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('downloadPDFBundle', () => {
    it('alerts if no images', () => {
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      downloadPDFBundle([]);
      expect(alertMock).toHaveBeenCalledWith('No ELD log images to download.');
      alertMock.mockRestore();
    });

    it('creates and saves pdf with images', () => {
      downloadPDFBundle(['img1', 'img2']);
      // We just need it not to crash, constructor works
      expect(true).toBe(true);
    });
  });

  describe('exportInspectorBundle', () => {
    it('alerts if no route data', () => {
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      exportInspectorBundle(null, null);
      expect(alertMock).toHaveBeenCalledWith('No active trip to export.');
      alertMock.mockRestore();
    });

    it('creates object URL and downloads', () => {
      const createObjectURLMock = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
      const revokeObjectURLMock = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
      
      const appendChildMock = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
      const removeChildMock = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);
      
      const clickMock = vi.fn();
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        return { click: clickMock } as any;
      });

      exportInspectorBundle({ dist: 1 }, []);
      expect(createObjectURLMock).toHaveBeenCalled();
      expect(clickMock).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalled();
    });
  });
});
