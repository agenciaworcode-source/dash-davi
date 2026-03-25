import { AgendorService } from './services/agendor.service.js';
import dotenv from 'dotenv';
dotenv.config();

async function dump() {
  try {
    const statuses = ['aberto', 'ganho', 'perdido'];
    for (const s of statuses) {
       console.log(`--- Status: ${s} ---`);
       const deals = await AgendorService.getDeals({ per_page: 5, status: s });
       console.log(`Encontrados: ${deals.length}`);
       if (deals.length > 0) {
         console.log(JSON.stringify(deals[0], null, 2));
       }
    }
  } catch (err) {
    console.error(err);
  }
}

dump();
