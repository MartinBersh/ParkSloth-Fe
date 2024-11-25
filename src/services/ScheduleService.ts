// services/ScheduleService.ts
import axios from 'axios';
import type { ScheduleDto } from '@/models/models';

const API_URL = 'http://localhost:8080/Schedule';

export default {
    async getSchedules(): Promise<ScheduleDto[]> {
        try {
            const response = await axios.get<ScheduleDto[]>(`${API_URL}/get`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createSchedule(schedule: ScheduleDto): Promise<string> {
        const response = await axios.post(`${API_URL}/create`, schedule);
        return response.data;
    },

    async updateSchedule( schedule: ScheduleDto): Promise<string> {
        const response = await axios.put(`${API_URL}/update`, schedule);
        return response.data;
    },

    async updateStatus(id: number, status: string): Promise<ScheduleDto> {
        const response = await axios.patch(`${API_URL}/status/${id}`, { status });
        return response.data;
    }
};