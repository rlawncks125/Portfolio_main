<template>
  <div class="px-1">
    <p>갱신 : 2021-12-29</p>
    <select name="" id="" v-model="data.subWayType" @change="resetData">
      <template v-for="item in 호선" :key="item.id">
        <option :value="item">{{ item }}</option>
      </template>
    </select>
    <select name="" id="" v-model="selectdWeekd">
      <option value="DAY">평일</option>
      <option value="SAT">주말</option>
    </select>
    <br />

    <template v-for="items in subWayData" :key="items.id">
      <template v-if="data.subWayType === items.호선">
        <p>{{ items.호선 }}</p>

        <div class="flex justify-between">
          <select v-model="data.station" class="flex-1 w-0">
            <option value="" disabled hidden>출발할 역</option>
            <template v-for="(item, index) in items.station" :key="item.id">
              <option :value="index">{{ item }}</option>
            </template>
          </select>
          <select v-model="data.endStation" class="flex-1 w-0">
            <option value="" disabled hidden>도착할 역</option>
            <template v-for="(item, index) in items.station" :key="item.id">
              <option :value="index">{{ item }}</option>
            </template>
          </select>
          <select v-model="data.getTime" class="flex-initial w-20">
            <option value="" disabled hidden>찾을 시간</option>
            <template v-for="item in timeOptions" :key="item.id">
              <option :value="item">{{ item }}시</option>
            </template>
          </select>

          <button @click="getTiems" class="flex-initial w-20">찾기</button>
        </div>
        <!-- <div>
          <template v-for="(item, index) in items.station" :key="item.id">
            <p>{{ item }} {{ index }}</p>
          </template>
        </div> -->
      </template>
    </template>
    <!-- 필터 결과값 -->
    <div>
      <div
        class="between-line-white flex justify-around p-2 bg-gray-700 text-white text-center"
      >
        <p class="flex-1">열차도착시간</p>
        <p class="flex-1">열차출발시간</p>
        <p class="flex-1">역사명</p>
        <p class="flex-1">급행여부</p>
      </div>
      <div
        v-for="items in result"
        :key="items.id"
        class="between-line-black-helf flex justify-around text-center py-2 mx-2 border-b-2 border-black border-opacity-40"
        v-show="selectdWeekd === items['주중주말']"
      >
        <p class="flex-1">
          {{ items["열차도착시간"] }}
        </p>
        <p class="flex-1">
          {{ items["열차출발시간"] }}
        </p>
        <p class="flex-1">
          {{ items["역사명"] }}
        </p>

        <div class="flex-1">
          <p v-if="items['급행여부'] === 1" class="text-red-500">o</p>
          <p v-else>x</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  EnumGetSubWayScheduleInPutDtoStation1,
  EnumGetSubWayScheduleInPutDtoStation2,
  EnumGetSubWayScheduleInPutDtoStation3,
  EnumGetSubWayScheduleInPutDtoStation4,
  EnumGetSubWayScheduleInPutDtoStation5,
  EnumGetSubWayScheduleInPutDtoType,
  GetSubWayScheduleInPutDto,
} from "@/assets/swagger";
import axios from "axios";

import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  setup() {
    const result = ref<Array<any>>();
    const selectdWeekd = ref("DAY");
    const data = reactive({
      station: "",
      endStation: "",
      getTime: 0,
      subWayType: "인천 1호선",
    });

    const incheon1 = enumToObject(EnumGetSubWayScheduleInPutDtoStation1);
    const incheon2 = enumToObject(EnumGetSubWayScheduleInPutDtoStation2);
    const seoul1 = enumToObject(EnumGetSubWayScheduleInPutDtoStation3);
    const station7 = enumToObject(EnumGetSubWayScheduleInPutDtoStation4);
    const suin = enumToObject(EnumGetSubWayScheduleInPutDtoStation5);
    const timeOptions = new Array(24).fill("0").map((v, index) => index);
    const 호선 = {
      "인천 1호선": "인천 1호선",
      "인천 2호선": "인천 2호선",
      "수도권 1호선": "수도권 1호선",
      "7호선": "7호선",
      "수인 분당선": "수인 분당선",
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
      {
        호선: "7호선",
        station: station7,
      },
      {
        호선: "수인 분당선",
        station: suin,
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
        case "7호선":
          station = station7[+data.station];
          isDirectionUp
            ? (type = EnumGetSubWayScheduleInPutDtoType.station7up)
            : (type = EnumGetSubWayScheduleInPutDtoType.station7down);
          break;
        case "수인 분당선":
          station = suin[+data.station];
          isDirectionUp
            ? (type = EnumGetSubWayScheduleInPutDtoType.suinup)
            : (type = EnumGetSubWayScheduleInPutDtoType.suindown);
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

      result.value = filterGetTimes(res, data.getTime);
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
      result,
      selectdWeekd,
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
      const isArrival = v["열차도착시간"] || null;
      const isDeparture = v["열차출발시간"] || null;

      const arrival = isArrival //
        ? v["열차도착시간"].split(":")[0]
        : null;
      const departure = isDeparture
        ? v["열차출발시간"].split(":")[0] || null
        : null;

      if (isArrival) return +arrival === time;
      else if (isDeparture) return +departure === time;
      return false;
    })
    .sort((a: any, b: any) => {
      const isArrival = b["열차도착시간"] || null;
      const isDeparture = b["열차출발시간"] || null;

      if (isArrival)
        return (
          +a["열차도착시간"].split(":")[1] - +b["열차도착시간"].split(":")[1]
        );
      else if (isDeparture)
        return (
          +a["열차출발시간"].split(":")[1] - +b["열차출발시간"].split(":")[1]
        );
      return 0;
    });
};
</script>

<style scoped lang="scss">
.between-line-white {
  * ~ * {
    border-left: solid white 1px;
  }
}
.between-line-black-helf {
  * ~ * {
    border-left: solid rgba(black, 0.5) 1px;
  }
}
.flex-all-flex-1 {
  * {
    flex: 1 1 0%;
    width: 0;
  }
}
</style>
