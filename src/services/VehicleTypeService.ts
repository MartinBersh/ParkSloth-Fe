
import axios from "axios";
import { VehicleTypeDto } from "@/models/models";


const API_URL = 'http://localhost:8080/VehicleType';


export default {
    async getVehicleType(): Promise<VehicleTypeDto[]>{
        try {
            const response = await axios.get<VehicleTypeDto[]>(`${API_URL}/get`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createVehicleType(vehicleType: VehicleTypeDto): Promise<string> {
        const response = await axios.post(`${API_URL}/create`, vehicleType);
        return response.data;
    },

    async updateVehicleType( vehicleType: VehicleTypeDto): Promise<string> {
        const response = await axios.put(`${API_URL}/update`, vehicleType);
        return response.data;
    },

    async updateStatus(vehicleType : VehicleTypeDto): Promise<string> {
        const response = await axios.patch(`${API_URL}/status`,vehicleType);
        return response.data;
    }
}