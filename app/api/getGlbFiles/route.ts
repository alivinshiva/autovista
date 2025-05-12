// app/api/getGlbFiles/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const glbDir = path.join(process.cwd(), 'public', 'assets', '3d');

  try {
    const files = await fs.promises.readdir(glbDir)
    const glbFiles = files.filter((file) => {
      const validFileNames = [
        'bmw_218i_gran_coupe_2021.glb',
        'suzuki_ciaz_2021.glb',
        'tata_safari_2021.glb',
        'mahindra_scorpio_n_2022.glb',
        'maruti_suzuki_swift_dzire_2022.glb',
        'chevrolet_groove_premier_2023.glb',
        'hyundai_creta_2023.glb',
        'audi_a8_custom_2018.glb',
        'honda_city_rs.glb',
        'tata_nano.glb',
        'tata_punch.glb',
        'tata_tiago.glb',
        'thar_4x4.glb',
        'toyota_fortuner_2021.glb',
      ]
      return validFileNames.includes(file)
    })
    return NextResponse.json({ files: glbFiles });
  } catch (err) {
    return NextResponse.json({ message: 'Error reading directory' }, { status: 500 });
  }
}
