// services/AddOnService.ts
import axios from 'axios';
import type { AddOnServiceDto } from '@/models/models';

const API_URL = 'http://localhost:8080/AddOnServices';

export default {
    async getAddOnServices(): Promise<AddOnServiceDto[]> {
        try {
            const response = await axios.get<AddOnServiceDto[]>(`${API_URL}/get`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createAddOnService(service: AddOnServiceDto): Promise<string> {
        const response = await axios.post(`${API_URL}/new`, service);
        return response.data;
    },

    async updateAddOnService(service: AddOnServiceDto): Promise<string> {
        const response = await axios.put(`${API_URL}/update`, service);
        return response.data;
    },

    async updateStatus(service: AddOnServiceDto): Promise<AddOnServiceDto> {
        const response = await axios.patch(`${API_URL}/status`,service);
        return response.data;
    }
};