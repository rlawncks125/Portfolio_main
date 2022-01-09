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

// '레스토랑 정보 조회 ( getRestaurantById )'

// '레스토랑 댓글 추가 ( addRestaurantCommentById )'
// '레스토랑 댓글 변경 ( editCommentMessage )'
// '레스토랑 댓글에 추가댓글 추가 ( addMessageByCommentId )'
// '레스토랑 대댓글 변경 ( editCommentMessage )'

// '댓글 정보 얻기 ( addMessageById 없어도 될듯? )'
// '댓글 삭제 ( removeMessageById ) '
