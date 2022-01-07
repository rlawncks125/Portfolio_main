import {
  CreateRoomOutPutDto,
  roomInfoDto,
  RoomInfoInputDto,
  RoomInfoOutPutDto,
  roomListOutPutDto,
  RoomOutPutDto,
} from "@/assets/swagger";
import axios from "axios";
import { AuthHeaders } from "./auth";

export const createRoom = async (): Promise<CreateRoomOutPutDto> => {
  return axios.post("api/room", AuthHeaders).then((res: any) => {
    return res.data! as CreateRoomOutPutDto;
  });
};

export const getRoomList = async (): Promise<roomListOutPutDto> => {
  return axios.get("api/room/list", AuthHeaders).then((res: any) => {
    return res.data! as roomListOutPutDto;
  });
};

export const getRoomInfo = async ({
  uuid,
}: RoomInfoInputDto): Promise<RoomInfoOutPutDto> => {
  return (
    axios
      .post("api/room/info", { uuid } as RoomInfoInputDto, AuthHeaders)
      // .post("api/room/info", {
      //   data: { uuid },
      // ...{ ...AuthHeaders },
      // })
      .then((res: any) => {
        return res.data! as RoomInfoOutPutDto;
      })
  );
};
