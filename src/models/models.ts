// models/UserDto.ts
export class UserDto {
    idUser ?: number;
    username?: string;
    password?: string;
    name?: string;
    phoneNumber?: string;
    identification?: string;
    email?: string;
    role?: { id: number }; 
    status?: string;
}

export class PaymentMethodDto{
    idPaymentMethod?:number;
    name?: string;
    status?: string;
}

// models/RoleDto.ts
export class RoleDto {
    idRole?: number;
    name?: string;
    status?: string;
}

// models/AddOnServiceDto.ts
export class AddOnServiceDto {
    idAddOnService?: number;
    name?: string;
    price?: number;
    parkingLot?: { idParkingLot: number }; 
    status?: string;
}

// models/FeeDto.ts
export class FeeDto {
    idFee?: number;
    name?: string;
    price?: number;
    parkingLot?: { idParkingLot: number }; 
    vehicleType?: { idVehicleType: number }; 
    status?: string;
}

// models/ParkingLotDto.ts
export class ParkingLotDto {
    idParkingLot?: number;
    name?: string;
    address?: string;
    phoneNumber?: string;
    nit?: string;
    coordX?: string;
    coordY?: string;
    user?: { id: number }; 
    status?: string;
}

// models/ReservationDto.ts
export class ReservationDto {
    idReservation?: number;
    reservationDate?: Date; 
    paymentDate?: Date;
    startDate?: Date;
    endDate?: Date;
    user?: { id: number }; 
    paymentMethod?: { idPaymentMethod: number }; 
    slot?: { idSlot: number }; 
    fee?: { idFee: number }; 
    status?: string;
}

// models/ScheduleDto.ts
export class ScheduleDto {
    idSchedule?: number;
    startSchedule?: number;
    endSchedule?: number;
    status?: string;
}

// models/ScheduleDayDto.ts
export class ScheduleDayDto {
    scheduleDayId?: { 
        schedule: { idSchedule: number }; 
        weekDay: { idWeekDay: number }; 
        parkingLot: { idParkingLot: number }; 
    };
    status?: string;
}

// models/SlotDto.ts
export class SlotDto {
    idSlot?: number;
    slotNumber?: number;
    parkingLot?: { idParkingLot: number }; 
    vehicleType?: { idVehicleType: number }; 
    status?: string;
}

// models/VehicleTypeDto.ts
export class VehicleTypeDto {
    idVehicleType?: number;
    name?: string;
    status?: string;
}

// models/WeekDayDto.ts
export class WeekDayDto {
    idWeekDay?: number;
    dayNumber?: number;
    dayName?: string;
    status?: string;
}