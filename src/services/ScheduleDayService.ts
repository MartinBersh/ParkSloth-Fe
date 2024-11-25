// services/ScheduleDayService.ts
import axios from 'axios';
import type { ScheduleDayDto } from '@/models/models';

const API_URL = 'http://localhost:8080/ScheduleDay';

export default {
    async getScheduleDays(): Promise<ScheduleDayDto[]> {
        try {
            const response = await axios.get<ScheduleDayDto[]>(`${API_URL}/get`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createScheduleDay(scheduleDay: ScheduleDayDto): Promise<string> {
        const response = await axios.post(`${API_URL}/create`, scheduleDay);
        return response.data;
    },

    async updateScheduleDay(scheduleDay: ScheduleDayDto): Promise<string> {
        const response = await axios.put(`${API_URL}/update`, scheduleDay);
        return response.data;
    },

    async updateStatus(id: number, status: string): Promise<ScheduleDayDto> {
        const response = await axios.patch(`${API_URL}/status/${id}`, { status });
        return response.data;
    }
};