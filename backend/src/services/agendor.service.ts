import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const AGENDOR_API_URL = 'https://api.agendor.com.br/v3';
const API_TOKEN = process.env.API_KEY_AGENDOR;

const agendorApi = axios.create({
  baseURL: AGENDOR_API_URL,
  headers: {
    'Authorization': `Token ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export class AgendorService {
  static async getFunnels() {
    const response = await agendorApi.get('/funnels');
    return response.data.data;
  }

  static async getStages(funnelId?: number) {
    const params = funnelId ? { funnel: funnelId } : {};
    const response = await agendorApi.get('/deal_stages', { params });
    return response.data.data;
  }

  static async getUsers() {
    const response = await agendorApi.get('/users');
    return response.data.data;
  }

  static async getDeals(params: any = {}) {
    const response = await agendorApi.get('/deals', { params });
    return response.data.data;
  }

  static async getMe() {
    const response = await agendorApi.get('/users/me');
    return response.data.data;
  }
}
