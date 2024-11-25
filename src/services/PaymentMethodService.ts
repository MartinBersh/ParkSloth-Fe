// services/PaymentTypeService.ts
import { PaymentMethodDto } from '@/models/models';
import axios from 'axios';

const API_URL = 'http://localhost:8080/PaymentMethod';

export default {
    async getPaymentMethod(): Promise<PaymentMethodDto[]> {
        try {
            const response = await axios.get<PaymentMethodDto[]>(`${API_URL}/get`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createPaymentMethod(paymentMethod: PaymentMethodDto): Promise<string> {
        const response = await axios.post(`${API_URL}/create`, paymentMethod);
        return response.data;
    },

    async updatePaymentMethod( paymentMethod: PaymentMethodDto): Promise<string> {
        const response = await axios.put(`${API_URL}/update`, paymentMethod);
        return response.data;
    },

    async updateStatus(paymentMethod : PaymentMethodDto): Promise<string> {
        const response = await axios.patch(`${API_URL}/status`,paymentMethod);
        return response.data;
    }
};