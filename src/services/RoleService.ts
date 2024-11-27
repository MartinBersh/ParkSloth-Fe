import { RoleDto } from "@/models/models";
import axios from "axios";


const API_URL = 'http://localhost:8080/Role';


export default {
    async getRole(): Promise<RoleDto[]>{
        try {
            const response = await axios.get<RoleDto[]>(`${API_URL}/get`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createRole(role: RoleDto): Promise<string> {
        const response = await axios.post(`${API_URL}/create`, role);
        return response.data;
    },

    async updateRole( role: RoleDto): Promise<string> {
        const response = await axios.put(`${API_URL}/update`, role);
        return response.data;
    },

    async updateStatus(role : RoleDto): Promise<string> {
        const response = await axios.patch(`${API_URL}/status`,role);
        return response.data;
    }
}