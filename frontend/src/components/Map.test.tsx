import "@testing-library/jest-dom";
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Map from './Map';

vi.mock('react-leaflet', async () => {
  const actual = await vi.importActual('react-leaflet') as any;
  return {
    ...actual,
    MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Polyline: () => <div data-testid="polyline" />,
    Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
    Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
    useMap: () => ({
      setView: vi.fn(),
    }),
  };
});

describe('Map Component', () => {
  it('renders default center without points', () => {
    const { getByTestId, queryByTestId } = render(<Map routeGeojson={null} points={null} />);
    expect(getByTestId('map-container')).toBeInTheDocument();
    expect(getByTestId('tile-layer')).toBeInTheDocument();
    expect(queryByTestId('polyline')).not.toBeInTheDocument();
    expect(queryByTestId('marker')).not.toBeInTheDocument();
  });

  it('renders route and points', () => {
    const routeGeojson = {
      geometry: {
        coordinates: [[-74, 40], [-75, 41]]
      }
    };
    const points = {
      current: [40, -74] as [number, number],
      pickup: [41, -75] as [number, number],
      dropoff: [42, -76] as [number, number]
    };
    
    const { getByTestId, getAllByTestId } = render(<Map routeGeojson={routeGeojson} points={points} />);
    expect(getByTestId('polyline')).toBeInTheDocument();
    expect(getAllByTestId('marker')).toHaveLength(3);
  });
});
