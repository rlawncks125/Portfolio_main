import {
  CreateRestaurantInputDto,
  CreateRestaurantOutPutDto,
} from "@/assets/swagger";
import axios from "axios";
import { AuthHeaders } from "./auth";

export const createRestaurant = async (
  data: CreateRestaurantInputDto
): Promise<CreateRestaurantOutPutDto> => {
  return axios
    .post("/api/restaurant", data, AuthHeaders)
    .then((res: any) => res.data as CreateRestaurantOutPutDto);
};

export const deleteRestaurant = async (
  id: number
): Promise<{ ok: boolean; err?: string }> => {
  return axios
    .delete(`/api/restaurant/${id}`, AuthHeaders)
    .then((res: any) => res.data as Promise<{ ok: boolean; err?: string }>);
};
