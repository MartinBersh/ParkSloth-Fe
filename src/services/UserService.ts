// services/UserService.ts
import axios from 'axios';
import type { UserDto } from '@/models/models';

const API_URL = 'http://localhost:8080/User';

export default {
    async getUsers(): Promise<UserDto[]> {
        try {
            const response = await axios.get<UserDto[]>(`${API_URL}/get`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createUser (user: UserDto): Promise<string> {
        const response = await axios.post(`${API_URL}/create`, user);
        return response.data;
    },

    async updateUser (user: UserDto): Promise<string> {
        const response = await axios.put(`${API_URL}/update`, user);
        return response.data;
    },

    async updateStatus(id: number, status: string): Promise<UserDto> {
        const response = await axios.patch(`${API_URL}/status/${id}`, { status });
        return response.data;
    }
};