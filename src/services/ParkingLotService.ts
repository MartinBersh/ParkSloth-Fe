// services/ParkingLotService.ts
import axios from 'axios';
import type { ParkingLotDto } from '@/models/models';

const API_URL = 'http://localhost:8080/ParkingLot';

export default {
    async getParkingLots(): Promise<ParkingLotDto[]> {
        try {
            const response = await axios.get<ParkingLotDto[]>(`${API_URL}/get`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createParkingLot(parkingLot: ParkingLotDto): Promise<string> {
        const response = await axios.post(`${API_URL}/create`, parkingLot);
        return response.data;
    },

    async updateParkingLot(parkingLot: ParkingLotDto): Promise<string> {
        const response = await axios.put(`${API_URL}/update`, parkingLot);
        return response.data;
    },

    async updateStatus(parkingLot: ParkingLotDto): Promise<ParkingLotDto> {
        const response = await axios.patch(`${API_URL}/status`, parkingLot);
        return response.data;
    },
    async getParkingLot(parkingLot: ParkingLotDto): Promise<string>{
        const response = await axios.post(`${API_URL}/get/${parkingLot.idParkingLot}`);
        return response.data;
    }
};