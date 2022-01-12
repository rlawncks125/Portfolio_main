import {
  EnumEventTriggerTypes,
  LoginOutPutDto,
  userCreateOutPutDto,
  UserOutPut,
} from "@/assets/swagger";
import { store } from "@/store";
import axios, { AxiosRequestConfig } from "axios";
import { computed, watch } from "vue";

// main.ts에 import 안할시
// 처음 호출되는곳에서 init
// console.log("auth 로드");

const token = computed(() => store.state.token);

export const AuthHeaders: AxiosRequestConfig = {
  headers: {
    "acces-token": token.value,
  },
};

watch(token, () => {
  console.log("wacth", AuthHeaders);
  AuthHeaders.headers!["acces-token"] = token.value;
});

interface IBasicAuth {
  username: string;
  password: string;
}

export const logIn = async (auth: IBasicAuth): Promise<LoginOutPutDto> => {
  return axios
    .get("api/user", { auth })
    .then((res: any) => {
      const result: LoginOutPutDto = res.data;
      const { ok, token, err, user } = result;

      // 토큰 vuex에 저장 처리
      if (ok) {
        token && store.commit("setToken", { token, userName: user.username });
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
  store.commit("setToken", { token: "", userName: "" });
};

// const triger = EnumEventTriggerTypes.LEAVEROOM;
