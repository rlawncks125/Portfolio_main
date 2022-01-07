import {
  EnumEventTriggerTypes,
  LoginOutPutDto,
  userCreateOutPutDto,
} from "@/assets/swagger";
import { store } from "@/store";
import axios, { AxiosRequestConfig } from "axios";

export const AuthHeaders: AxiosRequestConfig = {
  headers: {
    "acces-token": store.state.token || " ",
  },
  timeout: 500,
};

interface IBasicAuth {
  username: string;
  password: string;
}

export const logIn = async (auth: IBasicAuth): Promise<LoginOutPutDto> => {
  return axios
    .get("api/user", { auth })
    .then((res: any) => {
      const result: LoginOutPutDto = res.data;
      const { ok, token, err } = result;

      // 토큰 vuex에 저장 처리
      if (ok) {
        token && setToken(token);
      } else {
        console.log(err);
      }

      return result;
    })
    .catch((e) => e);
};

export const createUser = async (
  auth: IBasicAuth
): Promise<userCreateOutPutDto> => {
  return axios.post("api/user", {}, { auth }).then((res: any) => {
    return res.data;
  });
};

export const editUser = async (dsc: string): Promise<any> => {
  return await axios
    .patch("api/user", { dsc }, AuthHeaders)
    .then((res: any) => {
      return res.data;
    });
};

export const logOut = () => {
  restToken();
};

const setToken = (token: string) => {
  AuthHeaders.headers!["acces-token"] = token;

  // localstorge 저장
  store.commit("setToken", { token });
};

const restToken = () => {
  AuthHeaders.headers!["acces-token"] = "";
  store.commit("setToken", { token: "" });
};

const triger = EnumEventTriggerTypes.LEAVEROOM;
