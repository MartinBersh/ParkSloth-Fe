// services/PaymentTypeService.ts
import { WeekDayDto } from '@/models/models';
import axios from 'axios';

const API_URL = 'http://localhost:8080/WeekDays';

export default {
    async getWeekDay(): Promise<WeekDayDto[]> {
        try {
            const response = await axios.get<WeekDayDto[]>(`${API_URL}/get`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createWeekDay(weekDay: WeekDayDto): Promise<string> {
        const response = await axios.post(`${API_URL}/create`, weekDay);
        return response.data;
    },

    async updateWeekDay( weekDay: WeekDayDto): Promise<string> {
        const response = await axios.put(`${API_URL}/update`, weekDay);
        return response.data;
    },

    async updateStatus(weekDay : WeekDayDto): Promise<string> {
        const response = await axios.patch(`${API_URL}/status`,weekDay);
        return response.data;
    }
};