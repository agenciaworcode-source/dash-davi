import { AgendorService } from './src/services/agendor.service.js';
import dotenv from 'dotenv';

dotenv.config();

async function testAgendor() {
  console.log('--- Testando Conexão Agendor ---');
  console.log('Token:', process.env.API_KEY_AGENDOR?.substring(0, 5) + '...');
  
  try {
    const me = await AgendorService.getMe();
    console.log('Autenticado como:', me.name);
    
    const funnels = await AgendorService.getFunnels();
    console.log('Funis encontrados:', funnels.length);
    funnels.forEach((f: any) => console.log(`- ${f.name} (ID: ${f.id})`));
    
    const users = await AgendorService.getUsers();
    console.log('Usuários encontrados:', users.length);
    
  } catch (error: any) {
    console.error('Erro no teste:', error.response?.data || error.message);
  }
}

testAgendor();
