import React from 'react';
import VehicleDetailClient from './VehicleDetailClient';

export function generateStaticParams() {
  return [
    { vehicleId: 'rev-001' },
    { vehicleId: 'rev-002' },
    { vehicleId: 'rev-003' },
    { vehicleId: 'rev-004' },
    { vehicleId: 'rev-005' },
    { vehicleId: 'rev-006' },
    { vehicleId: 'rev-007' },
    { vehicleId: 'rev-008' },
    { vehicleId: 'rev-009' },
    { vehicleId: 'rev-010' },
  ];
}

export default function VehicleDetailPage() {
  return <VehicleDetailClient />;
}
