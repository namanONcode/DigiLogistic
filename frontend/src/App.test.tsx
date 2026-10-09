import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

vi.mock('./utils', () => ({
  downloadPDFBundle: vi.fn(),
  exportInspectorBundle: vi.fn()
}));
import * as utils from './utils';


vi.mock('axios');
const mockedAxios = axios as any;

vi.mock('./components/Map', () => {
  return {
    default: ({ routeGeojson, points }: any) => (
      <div data-testid="mock-map">
        {routeGeojson && <div data-testid="has-route">Has Route</div>}
        {points && <div data-testid="has-points">Has Points</div>}
      </div>
    )
  };
});

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
  });

  it('renders correctly', () => {
    render(<App />);
    expect(screen.getByText('ELD Enterprise')).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        route: { distance: 160934.4, duration: 3600 },
        timeline: [
          { status: 'Driving', start_time: '2026-10-08T00:00', end_time: '2026-10-08T01:00', duration_hours: 1, location: 'NY', description: 'Driving' },
          { status: 'Off Duty', start_time: '2026-10-08T01:00', end_time: '2026-10-08T01:30', duration_hours: 0.5, location: 'NY', description: 'Break' },
          { status: 'Sleeper Berth', start_time: '2026-10-08T01:30', end_time: '2026-10-08T11:30', duration_hours: 10, location: 'NY', description: 'Sleep' },
          { status: 'On Duty', start_time: '2026-10-08T11:30', end_time: '2026-10-08T12:30', duration_hours: 1, location: 'NY', description: 'Duty' },
          { status: 'Other', start_time: '2026-10-08T12:30', end_time: '2026-10-08T13:30', duration_hours: 1, location: 'NY', description: 'Other' }
        ],
        images: ['base64image'],
        points: { current: [40, -74], pickup: [41, -75], dropoff: [42, -76] }
      }
    });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('e.g. New York, NY'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Philadelphia, PA'), { target: { value: 'PA' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Washington, DC'), { target: { value: 'DC' } });

    fireEvent.click(screen.getByText('Calculate Route & Logs'));

    await waitFor(() => {
      expect(screen.getByText('100.0')).toBeInTheDocument(); // Distance
    });

    expect(screen.getAllByText((content, element) => element?.textContent === '1h 0m')[0]).toBeInTheDocument(); // Duration
    expect(screen.getAllByText(/Driving/)[0]).toBeInTheDocument();
    expect(screen.getByTestId('has-route')).toBeInTheDocument();
  });

  it('handles API error with explicit error message', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { error: 'Geocoding failed' } }
    });

    render(<App />);
    
    fireEvent.change(screen.getByPlaceholderText('e.g. New York, NY'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Philadelphia, PA'), { target: { value: 'PA' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Washington, DC'), { target: { value: 'DC' } });
    
    fireEvent.click(screen.getByText('Calculate Route & Logs'));

    await waitFor(() => {
      expect(screen.getByText('Geocoding failed')).toBeInTheDocument();
    });
  });

  it('handles default error message', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('e.g. New York, NY'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Philadelphia, PA'), { target: { value: 'PA' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Washington, DC'), { target: { value: 'DC' } });
    
    fireEvent.click(screen.getByText('Calculate Route & Logs'));

    await waitFor(() => {
      expect(screen.getByText('Failed to calculate route')).toBeInTheDocument();
    });
  });
  
  it('handles cycle used input', () => {
    render(<App />);
    const inputs = screen.getAllByRole('spinbutton');
    const input = inputs[0]; 
    fireEvent.change(input, { target: { value: '25.5' } });
    expect(input).toHaveValue(25.5);
  });

  it('handles response without images', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        route: { distance: 100, duration: 100 },
        timeline: [],
        images: null,
        points: { current: [40, -74], pickup: [41, -75], dropoff: [42, -76] }
      }
    });
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('e.g. New York, NY'), { target: { value: 'NY' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Philadelphia, PA'), { target: { value: 'PA' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Washington, DC'), { target: { value: 'DC' } });
    fireEvent.click(screen.getByText('Calculate Route & Logs'));
    await waitFor(() => {
      expect(screen.getByText('Active Dispatch Route')).toBeInTheDocument();
    });
  });

  it('handles UI button interactions correctly', () => {
    // Mock global functions
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const printMock = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(<App />);

    // Top nav buttons
    // Location crosshair button
    const locationBtn = screen.getByText('near_me');
    fireEvent.click(locationBtn);
    expect(screen.getByPlaceholderText('e.g. New York, NY')).toHaveValue('41.8781° N, 87.6298° W');

    // Map toggle buttons
    fireEvent.click(screen.getByText('Satellite'));
    expect(screen.getByText('Satellite').className).toContain('font-semibold');

    fireEvent.click(screen.getByText('Terrain Profile'));
    expect(screen.getByText('Terrain Profile').className).toContain('font-semibold');

    fireEvent.click(screen.getByText('Fleet Vector'));
    expect(screen.getByText('Fleet Vector').className).toContain('font-semibold');

    fireEvent.click(screen.getByText('fullscreen'));
    expect(alertMock).toHaveBeenCalledWith('Fullscreen toggled');

    // Bottom print/download buttons
    fireEvent.click(screen.getByText('Print Formats'));
    expect(printMock).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Download PDF Bundle'));
    expect(utils.downloadPDFBundle).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Export Inspector Bundle'));
    expect(utils.exportInspectorBundle).toHaveBeenCalled();

    // New Trip button
    fireEvent.change(screen.getByPlaceholderText('e.g. New York, NY'), { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('New Trip'));
    expect(screen.getByPlaceholderText('e.g. New York, NY')).toHaveValue('');

    alertMock.mockRestore();
    printMock.mockRestore();
  });

  
});
