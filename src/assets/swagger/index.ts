/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */

/** Generate by swagger-axios-codegen */
/* eslint-disable */
// @ts-nocheck
import axiosStatic, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface IRequestOptions extends AxiosRequestConfig {}

export interface IRequestConfig {
  method?: any;
  headers?: any;
  url?: any;
  data?: any;
  params?: any;
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance;
}

// Add default options
export const serviceOptions: ServiceOptions = {};

// Instance selector
export function axios(
  configs: IRequestConfig,
  resolve: (p: any) => void,
  reject: (p: any) => void
): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  } else {
    throw new Error("please inject yourself instance like axios  ");
  }
}

export function getConfigs(
  method: string,
  contentType: string,
  url: string,
  options: any
): IRequestConfig {
  const configs: IRequestConfig = { ...options, method, url };
  configs.headers = {
    ...options.headers,
    "Content-Type": contentType,
  };
  return configs;
}

export const basePath = "";

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[];
}

export class ListResultDto<T> implements IListResult<T> {
  items?: T[];
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number;
  items?: T[];
}

export class PagedResultDto<T = any> implements IPagedResult<T> {
  totalCount?: number;
  items?: T[];
}

// customer definition
// empty

export class UserService {
  /**
   * 로그인 ( login )
   */
  static userControllerLogin(
    options: IRequestOptions = {}
  ): Promise<LoginOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user";

      const configs: IRequestConfig = getConfigs(
        "get",
        "application/json",
        url,
        options
      );

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 회원가입
   */
  static userControllerUserCreate(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user";

      const configs: IRequestConfig = getConfigs(
        "post",
        "application/json",
        url,
        options
      );

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 정보 변경 ( userUpdate )
   */
  static userControllerUserUpdate(
    params: {
      /** requestBody */
      body?: UserUpdateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user";

      const configs: IRequestConfig = getConfigs(
        "patch",
        "application/json",
        url,
        options
      );

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 삭제
   */
  static userControllerUseDelete(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user";

      const configs: IRequestConfig = getConfigs(
        "delete",
        "application/json",
        url,
        options
      );

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class WebScoketChatService {
  /**
   * 이벤트 타입
   */
  static wsControllerFoodMapChat(
    params: {
      /** requestBody */
      body?: EventTrigger;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/WebScoket/chat";

      const configs: IRequestConfig = getConfigs(
        "get",
        "application/json",
        url,
        options
      );

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class RoomService {
  /**
   * 내가 들어간방들 정보 ( myRoomsInfo )
   */
  static roomControllerMyRoomsInfo(
    options: IRequestOptions = {}
  ): Promise<MyRoomsOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/room";

      const configs: IRequestConfig = getConfigs(
        "get",
        "application/json",
        url,
        options
      );

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 방 만들기 ( createRoom )
   */
  static roomControllerCreateRoom(
    params: {
      /** requestBody */
      body?: CreateRoomInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CreateRoomOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/room";

      const configs: IRequestConfig = getConfigs(
        "post",
        "application/json",
        url,
        options
      );

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 방 삭제하기 ( removeRoom )
   */
  static roomControllerRemoveRoom(
    params: {
      /** requestBody */
      body?: RemoveRoomInPutDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/room";

      const configs: IRequestConfig = getConfigs(
        "delete",
        "application/json",
        url,
        options
      );

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 방 목록 ( myRooms )
   */
  static roomControllerRoomList(
    options: IRequestOptions = {}
  ): Promise<roomListOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/room/list";

      const configs: IRequestConfig = getConfigs(
        "get",
        "application/json",
        url,
        options
      );

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 내가 방장인 방들 조회 ( mySuperRooms )
   */
  static roomControllerMySuperRooms(
    options: IRequestOptions = {}
  ): Promise<MyCreateRoomsOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/room/mySuperRooms";

      const configs: IRequestConfig = getConfigs(
        "get",
        "application/json",
        url,
        options
      );

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 방 참여하기 ( joinRoom )
   */
  static roomControllerJoinRoom(
    params: {
      /** requestBody */
      body?: JoinRoomInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<JoinRoomOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/room/join";

      const configs: IRequestConfig = getConfigs(
        "post",
        "application/json",
        url,
        options
      );

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 방 내의 정보들( roomInfo )
   */
  static roomControllerRoomInfo(
    params: {
      /** requestBody */
      body?: RoomInfoInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<RoomInfoOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/room/info";

      const configs: IRequestConfig = getConfigs(
        "get",
        "application/json",
        url,
        options
      );

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 방나가기 ( leaveRoom )
   */
  static roomControllerLeaveRoom(
    params: {
      /** requestBody */
      body?: LeaveRoomInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<LeaveRoomOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/room/leave";

      const configs: IRequestConfig = getConfigs(
        "post",
        "application/json",
        url,
        options
      );

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class RestaurantService {
  /**
   * 레스토랑 정보 조회 ( getRestaurantById )
   */
  static restaurantControllerGetRestaurantById(
    options: IRequestOptions = {}
  ): Promise<GetRestaurantByIdOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/restaurant/{id}";

      const configs: IRequestConfig = getConfigs(
        "get",
        "application/json",
        url,
        options
      );

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 레스토랑 삭제 ( removeRestaurant )
   */
  static restaurantControllerRemoveRestaurant(
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/restaurant/{id}";

      const configs: IRequestConfig = getConfigs(
        "delete",
        "application/json",
        url,
        options
      );

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 레스토랑 만들기 ( createRestaurant )
   */
  static restaurantControllerCreateRestaurant(
    params: {
      /** requestBody */
      body?: CreateRestaurantInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CreateRestaurantOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/restaurant";

      const configs: IRequestConfig = getConfigs(
        "post",
        "application/json",
        url,
        options
      );

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 레스토랑 댓글 추가 ( addRestaurantCommentById )
   */
  static restaurantControllerAddRestaurantCommentById(
    params: {
      /** requestBody */
      body?: AddRestaurantCommentByIdIdInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AddRestaurantCommentByIdIdOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/restaurant/comment";

      const configs: IRequestConfig = getConfigs(
        "post",
        "application/json",
        url,
        options
      );

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 레스토랑 댓글 변경 ( editCommentMessage )
   */
  static restaurantControllerEditCommentMessage(
    params: {
      /** requestBody */
      body?: EditCommentMessageInPutDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EditCommentMessageOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/restaurant/comment";

      const configs: IRequestConfig = getConfigs(
        "patch",
        "application/json",
        url,
        options
      );

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 레스토랑 댓글에 추가댓글 추가 ( addMessageByCommentId )
   */
  static restaurantControllerAddMessageByCommentId(
    params: {
      /** requestBody */
      body?: AddMessageByCommentIdInPutDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AddMessageByCommentIdOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/restaurant/comment/addMessage";

      const configs: IRequestConfig = getConfigs(
        "post",
        "application/json",
        url,
        options
      );

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 레스토랑 대댓글 변경 ( editCommentMessage )
   */
  static restaurantControllerEditCommentChildMessage(
    params: {
      /** requestBody */
      body?: EditCommentChildMessageInPutDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EditCommentChildMessageOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/restaurant/comment/addMessage";

      const configs: IRequestConfig = getConfigs(
        "patch",
        "application/json",
        url,
        options
      );

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 댓글 정보 얻기 ( addMessageById 없어도 될듯? )
   */
  static restaurantControllerAddMessageById(
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/restaurant/comment/{id}";

      const configs: IRequestConfig = getConfigs(
        "get",
        "application/json",
        url,
        options
      );

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * 댓글 삭제 ( removeMessageById )
   */
  static restaurantControllerRemoveMessageById(
    options: IRequestOptions = {}
  ): Promise<RemoveMessageByIdOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/restaurant/comment/{id}";

      const configs: IRequestConfig = getConfigs(
        "delete",
        "application/json",
        url,
        options
      );

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export interface UserOutPut {
  /** 유저 이름입니다. */
  username?: string;

  /** 내용물 */
  dsc?: string;
}

export interface LoginOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;

  /** 토큰 입니다. */
  token?: string;

  /**  */
  user: UserOutPut;
}

export interface UserUpdateDto {
  /** password */
  password?: string;

  /** 내용물 */
  dsc?: string;
}

export interface EventTrigger {
  /**  */
  Types: EnumEventTriggerTypes;
}

export interface Lating {
  /** Lating_X */
  X: number;

  /** Lating_Y */
  Y: number;
}

export interface SuperUserDto {
  /** 유저 아이디 */
  id: number;

  /** 유저 닉네임 */
  nickName: string;
}

export interface MyRoomsRestaurantInfoDto {
  /** id */
  id: number;

  /** 소유자 */
  resturantSuperUser: CombinedResturantSuperUserTypes;

  /** 음식점 이름입니다. */
  restaurantName: string;

  /** 음식점 이미지 url 입니다 */
  restaurantImageUrl: string;

  /** 위치한 지역입니다. */
  location: string;

  /** 좌표입니다. */
  lating: CombinedLatingTypes;
}

export interface MyRoomsJoinUserInfoDto {
  /** id */
  id: number;

  /** 유저 이름입니다. */
  username: string;
}

export interface MyRoomsinfoDto {
  /** id */
  id: number;

  /** 방고유아이디입니다. */
  uuid: string;

  /** 방 이름입니다.. */
  roomName: string;

  /** 방 시작 좌표입니다. */
  lating: CombinedLatingTypes;

  /** 레스토랑 정보 */
  restaurantInfo: MyRoomsRestaurantInfoDto[];

  /** 방 내의 유저 정보들 */
  joinUsersInfo: MyRoomsJoinUserInfoDto[];
}

export interface MyRoomsOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;

  /** 방 정보들 */
  myRooms: MyRoomsinfoDto[];
}

export interface superUserInfoDto {
  /** 유저 이름입니다. */
  username: string;
}

export interface roomInfoDto {
  /** 방고유아이디입니다. */
  uuid: string;

  /** 방 이름입니다.. */
  roomName: string;

  /** 방장 유저 정보 */
  superUserinfo: CombinedSuperUserinfoTypes;
}

export interface roomListOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;

  /** 방장 정보들 */
  roomList: roomInfoDto[];
}

export interface CreateRoomInputDto {
  /** 방 이름입니다.. */
  roomName: string;

  /** 방 시작 좌표입니다. */
  lating: CombinedLatingTypes;
}

export interface User {
  /** id */
  id: number;

  /** password */
  password: string;

  /** 유저 이름입니다. */
  username: string;

  /** 내용물 */
  dsc: string;

  /** 권한 있는 방들 */
  superRooms: string[];
}

export interface RoomOutPutDto {
  /** id */
  id: number;

  /** 방고유아이디입니다. */
  uuid: string;

  /** 방 이름입니다.. */
  roomName: string;

  /** 방 시작 좌표입니다. */
  lating: CombinedLatingTypes;

  /** 방장 입니다. */
  superUser: CombinedSuperUserTypes;
}

export interface CreateRoomOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;

  /** 방정보입니다. */
  room?: CombinedRoomTypes;
}

export interface RemoveRoomInPutDto {
  /** 방고유아이디입니다. */
  uuid: string;
}

export interface MyCreateRoomsOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;

  /** 룸정보 */
  myRooms: MyRoomsinfoDto[];
}

export interface JoinRoomInputDto {
  /** 방고유아이디입니다. */
  uuid: string;
}

export interface JoinRoomOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;
}

export interface RoomInfoInputDto {
  /** 방고유아이디입니다. */
  uuid: string;
}

export interface RoomUsersDto {
  /** id */
  id: number;

  /** 유저 이름입니다. */
  username: string;
}

export interface RoominfoDto {
  /** 방 이름입니다.. */
  roomName: string;

  /** 방 시작 좌표입니다. */
  lating: CombinedLatingTypes;

  /** 방장 정보 */
  superUserInfo: CombinedSuperUserInfoTypes;
}

export interface Room {
  /** id */
  id: number;

  /** 방고유아이디입니다. */
  uuid: string;

  /** 방 이름입니다.. */
  roomName: string;

  /** 방 시작 좌표입니다. */
  lating: CombinedLatingTypes;

  /** 방장 입니다. */
  superUser: CombinedSuperUserTypes;

  /** 참가한 유저들입니다. */
  joinUsers: User[];

  /** 레스토랑 정보들 */
  restaurants: Restaurant[];
}

export interface Restaurant {
  /** id */
  id: number;

  /** 소유자 */
  resturantSuperUser: CombinedResturantSuperUserTypes;

  /** 음식점 이름입니다. */
  restaurantName: string;

  /** 음식점 이미지 url 입니다 */
  restaurantImageUrl: string;

  /** 위치한 지역입니다. */
  location: string;

  /** 댓글들 입니다. */
  comments: Comment[];

  /** 평균 별점 */
  avgStar: number;

  /** 좌표입니다. */
  lating: CombinedLatingTypes;

  /** 소속한 방정보입니다. */
  parentRoom: CombinedParentRoomTypes;
}

export interface UserCommentInfo {
  /** 닉네임 */
  nickName: string;

  /** 유저 or 익명 확인 */
  role: EnumUserCommentInfoRole;
}

export interface messageType {
  /** 댓글 작성 시간 */
  CreateTime: Date;

  /** user정보 */
  userInfo: CombinedUserInfoTypes;

  /** 댓글 내용 */
  message: string;
}

export interface Comment {
  /** id */
  id: number;

  /** 부모 테이블 */
  parentRestaurant: CombinedParentRestaurantTypes;

  /** 별점입니다. */
  star: number;

  /** 메세지 */
  message: CombinedMessageTypes;

  /** 추가 댓글들 */
  childMessages: messageType[];
}

export interface RestaurantInfoDto {
  /** id */
  id: number;

  /** 소유자 */
  resturantSuperUser: CombinedResturantSuperUserTypes;

  /** 음식점 이름입니다. */
  restaurantName: string;

  /** 음식점 이미지 url 입니다 */
  restaurantImageUrl: string;

  /** 위치한 지역입니다. */
  location: string;

  /** 댓글들 입니다. */
  comments: Comment[];

  /** 평균 별점 */
  avgStar: number;

  /** 좌표입니다. */
  lating: CombinedLatingTypes;
}

export interface RoomInfoOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;

  /** 방 정보 */
  roomInfo: RoominfoDto[];

  /** 방안에 유저들 */
  users: RoomUsersDto[];

  /** 레스토랑 정보들 */
  RestaurantInfo: RestaurantInfoDto[];
}

export interface LeaveRoomInputDto {
  /** 방고유아이디입니다. */
  uuid: string;
}

export interface LeaveRoomOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;
}

export interface GetRestaurantByIdOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;

  /**  */
  "레스토랑 정보": CombinedTypes;
}

export interface CreateRestaurantInputDto {
  /** 방고유아이디입니다. */
  uuid: string;

  /** 음식점 이름입니다. */
  restaurantName: string;

  /** 음식점 이미지 url 입니다 */
  restaurantImageUrl: string;

  /** 위치한 지역입니다. */
  location: string;

  /** 좌표입니다. */
  lating: CombinedLatingTypes;
}

export interface CreateRestaurantOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;

  /** 만들어진레스토랑 정보입니다. */
  restaurant?: CombinedRestaurantTypes;
}

export interface AddRestaurantCommentByIdIdInputDto {
  /** 레스토랑 아이디 */
  restaurantId: number;

  /** 유저 유형 */
  role: EnumAddRestaurantCommentByIdIdInputDtoRole;

  /** 메세지 */
  message: string;

  /** 별점 */
  star: number;
}

export interface AddRestaurantCommentByIdIdOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;
}

export interface EditCommentMessageInPutDto {
  /** 댓글 id */
  id: number;

  /** 변경할 내용 */
  message: string;
}

export interface EditCommentMessageOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;
}

export interface AddMessageByCommentIdInPutDto {
  /** 코멘트 아이디 */
  commentId: number;

  /** 유저 유형 */
  role: EnumAddMessageByCommentIdInPutDtoRole;

  /** 메세지 */
  message: string;
}

export interface AddMessageByCommentIdOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;
}

export interface EditCommentChildMessageInPutDto {
  /** 댓글 아이디 */
  id: number;

  /** 변경할 메세지 생성 시간 */
  createTime: Date;

  /** 변경할 내용 */
  message: string;
}

export interface EditCommentChildMessageOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;
}

export interface RemoveMessageByIdOutPutDto {
  /** 성공 여부입니다. */
  ok: boolean;

  /** 에러 메세지입니다. */
  err?: string;
}
export enum EnumEventTriggerTypes {
  "CREATEROOM" = "CREATEROOM",
  "JOINUSER" = "JOINUSER",
  "LEAVEROOM" = "LEAVEROOM",
}
export type CombinedResturantSuperUserTypes = SuperUserDto;
export type CombinedLatingTypes = Lating;
export type CombinedSuperUserinfoTypes = superUserInfoDto;
export type CombinedSuperUserTypes = User;
export type CombinedRoomTypes = RoomOutPutDto;
export type CombinedSuperUserInfoTypes = RoomUsersDto;
export type CombinedParentRoomTypes = Room;
export enum EnumUserCommentInfoRole {
  "User" = "User",
  "Anonymous" = "Anonymous",
}
export type CombinedUserInfoTypes = UserCommentInfo;
export type CombinedParentRestaurantTypes = Restaurant;
export type CombinedMessageTypes = messageType;
export type CombinedTypes = RestaurantInfoDto;
export type CombinedRestaurantTypes = Restaurant;
export enum EnumAddRestaurantCommentByIdIdInputDtoRole {
  "User" = "User",
  "Anonymous" = "Anonymous",
}
export enum EnumAddMessageByCommentIdInPutDtoRole {
  "User" = "User",
  "Anonymous" = "Anonymous",
}
