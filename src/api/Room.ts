import {
  CreateRoomInputDto,
  CreateRoomOutPutDto,
  LeaveRoomInputDto,
  JoinRoomOutPutDto,
  MyRoomsOutPutDto,
  roomInfoDto,
  RoomInfoInputDto,
  RoomInfoOutPutDto,
  RoomOutPutDto,
  JoinRoomInputDto,
  LeaveRoomOutPutDto,
  MyCreateRoomsOutPutDto,
  RoomListInputDto,
  RoomListOutPutDto,
} from "@/assets/swagger";
import axios from "axios";
import { AuthHeaders } from "./auth";

export const createRoom = async (
  data: CreateRoomInputDto
): Promise<CreateRoomOutPutDto> => {
  return axios.post("api/room", data, AuthHeaders).then((res: any) => {
    return res.data as CreateRoomOutPutDto;
  });
};

export const getRoomList = async (
  data: RoomListInputDto
): Promise<RoomListOutPutDto> => {
  return axios.post("api/room/list", data, AuthHeaders).then((res: any) => {
    return res.data! as RoomListOutPutDto;
  });
};

export const getRoomInfo = async ({
  uuid,
}: RoomInfoInputDto): Promise<RoomInfoOutPutDto> => {
  return axios
    .post("api/room/info", { uuid } as RoomInfoInputDto, AuthHeaders)
    .then((res: any) => {
      return res.data! as RoomInfoOutPutDto;
    });
};
export const getMySuperRooms = async (): Promise<MyCreateRoomsOutPutDto> => {
  return axios.get("api/room/mySuperRooms", AuthHeaders).then((res: any) => {
    return res.data! as MyCreateRoomsOutPutDto;
  });
};

export const getJoinRoomList = async (): Promise<MyRoomsOutPutDto> => {
  return axios.get("/api/room", AuthHeaders).then((res: any) => {
    return res.data as MyRoomsOutPutDto;
  });
};

export const joinRoom = async (
  data: JoinRoomInputDto
): Promise<JoinRoomOutPutDto> => {
  return axios.post("/api/room/join", data, AuthHeaders).then((res: any) => {
    return res.data as JoinRoomOutPutDto;
  });
};

export const leaveRoom = async (
  data: LeaveRoomInputDto
): Promise<LeaveRoomOutPutDto> => {
  return axios.post("/api/room/leave", data, AuthHeaders).then((res: any) => {
    return res.data as LeaveRoomOutPutDto;
  });
};

export const deleteRoom = async (
  uuid: string
): Promise<{ ok: boolean; err?: string }> => {
  return axios.delete(`/api/room/${uuid}`, AuthHeaders).then((res: any) => {
    return res.data as { ok: boolean; err?: string };
  });
};
