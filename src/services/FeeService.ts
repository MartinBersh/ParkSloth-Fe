// services/FeeService.ts
import axios from 'axios';
import type { FeeDto } from '@/models/models';

const API_URL = 'http://localhost:8080/Fee';

export default {
    async getFees(): Promise<FeeDto[]> {
        try {
            const response = await axios.get<FeeDto[]>(`${API_URL}/get`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createFee(fee: FeeDto): Promise<string> {
        const response = await axios.post(`${API_URL}/new`, fee);
        return response.data;
    },

    async updateFee(fee: FeeDto): Promise<string> {
        const response = await axios.put(`${API_URL}/update`, fee);
        return response.data;
    },

    async updateStatus(id: number, status: string): Promise<FeeDto> {
        const response = await axios.patch(`${API_URL}/status`, status );
        return response.data;
    }
};