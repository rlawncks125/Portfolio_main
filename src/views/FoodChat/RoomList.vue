<template>
  <button @click="getRoomLists">Loom List 얻기</button>

  <div
    v-for="item in roomLists"
    :key="item.key"
    class="grid grid-cols-1 gap-y-2 border-2"
  >
    <p>uuid : {{ item.uuid }}</p>
    <p>roomName : {{ item.roomName }}</p>
    <p>방장유저 : {{ item.superUserinfo.username }}</p>
    <button
      class="text-pink-500 bg-slate-700 border-2 w-3/6 mx-auto"
      @click.prevent="goRoom(item.uuid)"
    >
      입장
    </button>
  </div>
</template>

<script lang="ts">
import { roomInfoDto } from "@/assets/swagger";
import { defineComponent, reactive, toRefs } from "vue";
import { getRoomList } from "@/api/Room";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    const data = reactive({
      roomLists: [] as Array<roomInfoDto>,
    });

    const getRoomLists = async () => {
      const { ok, err, roomList } = await getRoomList();

      if (ok) {
        data.roomLists = roomList;
      }
    };
    const goRoom = (uuid: string) => {
      console.log(`go ${uuid}`);
      router.push({
        name: "foodChatRoomJoin",
        params: { uuid },
      });
    };

    return { ...toRefs(data), getRoomLists, goRoom };
  },
});
</script>

<style></style>
