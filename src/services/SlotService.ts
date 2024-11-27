// services/SlotService.ts
import axios from 'axios';
import type { SlotDto } from '@/models/models';

const API_URL = 'http://localhost:8080/Slot';

export default {
    async getSlots(): Promise<SlotDto[]> {
        try {
            const response = await axios.get<SlotDto[]>(`${API_URL}/get`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createSlot(slot: SlotDto): Promise<string> {
        const response = await axios.post(`${API_URL}/create`, slot);
        return response.data;
    },

    async updateSlot(slot: SlotDto): Promise<string> {
        const response = await axios.put(`${API_URL}/update`, slot);
        return response.data;
    },

    async updateStatus(slot: SlotDto): Promise<SlotDto> {
        const response = await axios.patch(`${API_URL}/status`, slot );
        return response.data;
    }
};