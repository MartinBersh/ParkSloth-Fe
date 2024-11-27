// services/ReservationService.ts
import axios from 'axios';
import type { ReservationDto } from '@/models/models';

const API_URL = 'http://localhost:8080/Reservation';

export default {
    async getReservations(): Promise<ReservationDto[]> {
        try {
            const response = await axios.get<ReservationDto[]>(`${API_URL}/get`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createReservation(reservation: ReservationDto): Promise<string> {
        const response = await axios.post(`${API_URL}/create`, reservation);
        return response.data;
    },

    async updateReservation(reservation: ReservationDto): Promise<string> {
        const response = await axios.put(`${API_URL}/update`, reservation);
        return response.data;
    },

    async updateStatus(reservation: ReservationDto): Promise<ReservationDto> {
        const response = await axios.patch(`${API_URL}/status`,  reservation );
        return response.data;
    }
};