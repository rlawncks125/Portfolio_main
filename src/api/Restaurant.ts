import {
  AddMessageByCommentIdInPutDto,
  AddMessageByCommentIdOutPutDto,
  AddRestaurantCommentByIdIdInputDto,
  AddRestaurantCommentByIdIdOutPutDto,
  CreateRestaurantInputDto,
  CreateRestaurantOutPutDto,
  EditCommentChildMessageInPutDto,
  EditCommentChildMessageOutPutDto,
  GetRestaurantByIdOutPutDto,
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

export const getRestaurantById = async (
  id: number
): Promise<GetRestaurantByIdOutPutDto> => {
  return axios
    .get(`/api/restaurant/${id}`, AuthHeaders)
    .then((res: any) => res.data as GetRestaurantByIdOutPutDto);
};

export const deleteRestaurant = async (
  id: number
): Promise<{ ok: boolean; err?: string }> => {
  return axios
    .delete(`/api/restaurant/${id}`, AuthHeaders)
    .then((res: any) => res.data as Promise<{ ok: boolean; err?: string }>);
};

export const addRestaurantCommentById = async (
  data: AddRestaurantCommentByIdIdInputDto
): Promise<AddRestaurantCommentByIdIdOutPutDto> => {
  return axios
    .post("/api/restaurant/comment", data, AuthHeaders)
    .then((res: any) => res.data as AddRestaurantCommentByIdIdOutPutDto);
};

// '레스토랑 댓글 변경 ( editCommentMessage )'

export const addMessageByCommentId = async (
  data: AddMessageByCommentIdInPutDto
): Promise<AddMessageByCommentIdOutPutDto> => {
  return axios
    .post(`/api/restaurant/comment/addMessage`, data, AuthHeaders)
    .then((res: any) => res.data as AddMessageByCommentIdOutPutDto);
};

export const editCommentChildMessage = async (
  data: EditCommentChildMessageInPutDto
) => {
  return axios
    .patch("/api/restaurant/comment/addMessage", data, AuthHeaders)
    .then((res: any) => res.data as EditCommentChildMessageOutPutDto);
};

// '댓글 정보 얻기 ( addMessageById 없어도 될듯? )'
export const deleteComment = async (id: number) => {
  return axios
    .delete(`api/restaurant/comment/${id}`, AuthHeaders)
    .then((res: any) => res.data as { ok: boolean; err?: string });
};
