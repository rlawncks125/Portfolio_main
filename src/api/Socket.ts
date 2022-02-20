import { computed } from "vue";
import { store } from "@/store/index";
import { io, Socket } from "socket.io-client";

const wsUrl = "wss://myapi.kimjuchan97.site";
const nameSpace = "foodMapChat";

const token = computed(() => store.state.token);

let socket: Socket;

export const init = () => {
  socket = io(`${wsUrl}/${nameSpace}`, {
    autoConnect: false,
    transports: ["websocket"],
    auth: {
      token: token.value,
    },
  });

  socket.connect();
  socket.emit("registration");
  socketBaseRead();
};

export const connect = () => {
  socket.connect();
};

export const close = () => {
  socket.emit("leaveRoom");
  socket.close();
};

export const joinRoom = (uuid: string) => {
  socket.emit("joinRoom", uuid);
};

export const leaveRoom = (uuid: string) => {
  socket.emit("leaveRoom", uuid);
};

type FuncJoinRoom = (uuid: string) => void;
export const catchJoinRoom = (catchWs: FuncJoinRoom) => {
  socket.off("joinRoom");
  socket.on("joinRoom", (uuid: string) => {
    catchWs(uuid);
  });
};

type FuncUpdateData = (data: any) => void;
export const catchUpdateRoom = (catchWs: FuncUpdateData) => {
  socket.off("updateRoom");
  socket.on("updateRoom", (data) => {
    catchWs(data);
  });
};

export const updateRestaurant = (data: {
  uuid: string;
  restaurantId: number;
}) => {
  socket.emit("updateRestaurant", data);
};

type FuncUpdateRestaurant = (data: {
  uuid: string;
  restaurantId: number;
}) => void;
export const catchUpdateRestaurant = (catchWs: FuncUpdateRestaurant) => {
  socket.off("updateRestaurant");
  socket.on(
    "updateRestaurant",
    (data: { uuid: string; restaurantId: number }) => {
      catchWs(data);
    }
  );
};

export const updateApprovaWait = (userId: number) => {
  socket.emit("ApprovaWait", userId);
};

export const catchApprovaWait = (catchWs: () => void) => {
  socket.off("updateApprovaWait");
  socket.on("updateApprovaWait", () => {
    catchWs();
  });
};

export const updateReqApprovaWait = (uuid: string) => {
  socket.emit("reqApprovaWait", uuid);
};

export const catchReqApprovaWait = (catchWs: () => void) => {
  socket.off("updateReqApprovaWait");
  socket.on("updateReqApprovaWait", () => {
    catchWs();
  });
};

const socketBaseRead = () => {
  socket.on("connect", () => {
    console.log("연결 되었습니다.");
  });

  socket.on("disconnect", () => {
    console.log("연결이 끊겼습니다.");
  });
  socket.on("error", (err) => {
    console.log("에러 발생 : ", err);
  });
};
