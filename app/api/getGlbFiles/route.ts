// app/api/getGlbFiles/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  // List of public paths for the GLB files
  const glbFiles = [
    '/assets/3d/bmw_218i_gran_coupe_2021.glb',
    '/assets/3d/suzuki_ciaz_2021.glb',
    '/assets/3d/tata_safari_2021.glb',
    '/assets/3d/mahindra_scorpio_n_2022.glb',
    '/assets/3d/maruti_suzuki_swift_dzire_2022.glb',
    '/assets/3d/chevrolet_groove_premier_2023.glb',
    '/assets/3d/hyundai_creta_2023.glb',
    '/assets/3d/audi_a8_custom_2018.glb',
    '/assets/3d/honda_city_rs.glb',
    '/assets/3d/tata_nano.glb',
    '/assets/3d/tata_punch.glb',
    '/assets/3d/tata_tiago.glb',
    '/assets/3d/thar_4x4.glb',
    '/assets/3d/toyota_fortuner_2021.glb',
  ];

  try {
    return NextResponse.json({ files: glbFiles });
  } catch (err) {
    // This catch block is less likely to be hit now, but kept for robustness
    return NextResponse.json({ message: 'Error generating file list' }, { status: 500 });
  }
}
