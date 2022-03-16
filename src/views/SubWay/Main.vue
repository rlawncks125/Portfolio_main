<template>
  <div>
    <select name="" id="" v-model="data.subWayType" @change="resetData">
      <template v-for="item in 호선" :key="item.id">
        <option :value="item">{{ item }}</option>
      </template>
    </select>
    <br />

    <template v-for="items in subWayData" :key="items.id">
      <template v-if="data.subWayType === items.호선">
        <p>{{ items.호선 }}</p>

        <select v-model="data.station">
          <option value="" disabled hidden>출발할 역</option>
          <template v-for="(item, index) in items.station" :key="item.id">
            <option :value="index">{{ item }}</option>
          </template>
        </select>
        <select v-model="data.endStation">
          <option value="" disabled hidden>도착할 역</option>
          <template v-for="(item, index) in items.station" :key="item.id">
            <option :value="index">{{ item }}</option>
          </template>
        </select>
        <select v-model="data.getTime">
          <option value="" disabled hidden>찾을 시간</option>
          <template v-for="item in timeOptions" :key="item.id">
            <option :value="item">{{ item }}시</option>
          </template>
        </select>

        <button @click="getTiems">찾기</button>
        <div>
          <template v-for="(item, index) in items.station" :key="item.id">
            <p>{{ item }} {{ index }}</p>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import {
  EnumGetSubWayScheduleInPutDtoStation1,
  EnumGetSubWayScheduleInPutDtoStation2,
  EnumGetSubWayScheduleInPutDtoStation3,
  EnumGetSubWayScheduleInPutDtoType,
  GetSubWayScheduleInPutDto,
} from "@/assets/swagger";
import axios from "axios";
import { isNumber } from "cypress/types/lodash";

import { defineComponent, reactive } from "vue";

export default defineComponent({
  setup() {
    const data = reactive({
      station: "",
      endStation: "",
      getTime: 0,
      subWayType: "인천 1호선",
    });

    const incheon1 = enumToObject(EnumGetSubWayScheduleInPutDtoStation1);
    const incheon2 = enumToObject(EnumGetSubWayScheduleInPutDtoStation2);
    const seoul1 = enumToObject(EnumGetSubWayScheduleInPutDtoStation3);
    const timeOptions = new Array(24).fill("0").map((v, index) => index);
    const 호선 = {
      "인천 1호선": "인천 1호선",
      "인천 2호선": "인천 2호선",
      "수도권 1호선": "수도권 1호선",
    };

    const subWayData = [
      {
        호선: "인천 1호선",
        station: incheon1,
      },
      {
        호선: "인천 2호선",
        station: incheon2,
      },
      {
        호선: "수도권 1호선",
        station: seoul1,
      },
    ];

    const resetData = () => {
      data.station = "";
      data.endStation = "";
      data.getTime = 0;
    };

    const getTiems = async () => {
      if (data.station === "" || data.endStation === "") return;
      // ture : 상선 , false : 하선
      const isDirectionUp = +data.endStation - +data.station > 0 ? true : false;
      let station;
      let type;

      switch (data.subWayType) {
        case "인천 1호선":
          station = incheon1[+data.station];
          isDirectionUp
            ? (type = EnumGetSubWayScheduleInPutDtoType.incheon1up)
            : (type = EnumGetSubWayScheduleInPutDtoType.incheon1down);
          break;
        case "인천 2호선":
          station = incheon2[+data.station];
          isDirectionUp
            ? (type = EnumGetSubWayScheduleInPutDtoType.incheon2up)
            : (type = EnumGetSubWayScheduleInPutDtoType.incheon2down);
          break;
        case "수도권 1호선":
          station = seoul1[+data.station];

          isDirectionUp
            ? (type = EnumGetSubWayScheduleInPutDtoType.seoul1up)
            : (type = EnumGetSubWayScheduleInPutDtoType.seoul1down);
          break;

        default:
          break;
      }

      console.log(data.subWayType, station, isDirectionUp, type, data.getTime);

      const postData = {
        type,
        station,
      } as GetSubWayScheduleInPutDto;

      const res = await axios.post("api/subway", postData).then((res: any) => {
        return res.data;
      });

      const result = filterGetTimes(res, data.getTime);
      console.log(result);
    };

    return {
      incheon1,
      incheon2,
      timeOptions,
      호선,
      data,
      getTiems,
      subWayData,
      resetData,
    };
  },
});

const enumToObject = (enumme: any) => {
  // enum 순서값(키index값) 을 제외한 값을 추출
  return Object.keys(enumme).map((key) => enumme[key]);
};

const filterGetTimes = (data: [], time: number) => {
  return data
    .filter((v: any) => {
      const arrival = v["열차도착시간"].split(":")[0] || null;
      const departure = v["열차출발시간"].split(":")[0] || null;

      if (arrival) return +arrival === time;
      else if (departure) return +departure === time;
      return false;
    })
    .sort((a: any, b: any) => {
      const arrival = b["열차도착시간"] || null;
      const departure = b["열차출발시간"] || null;

      if (arrival)
        return (
          +a["열차도착시간"].split(":")[1] - +b["열차도착시간"].split(":")[1]
        );
      else if (departure)
        return (
          +a["열차출발시간"].split(":")[1] - +b["열차출발시간"].split(":")[1]
        );
      return 0;
    });
};
</script>

<style scoped></style>
