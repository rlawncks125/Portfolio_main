<template>
  <loding :isLoding="isLoading" />
  <div>My Room</div>

  <p>내가 접속중인 방</p>
  <div
    v-for="item in myJoinRoomLists"
    :key="item.id"
    class="flex flex-col border-2 mt-4"
  >
    <div class="room-info">
      <div class="room-marke">
        <div>
          <img
            :src="item.markeImageUrl ? item.markeImageUrl : baseRoomMarke"
            class="w-full h-full bg-cover bg-center"
          />
        </div>
      </div>
      <p class="room-name">{{ item.roomName }}</p>
      <p class="room-super-user">👑{{ item.superUser.username }}</p>
      <button
        class="text-pink-500 bg-slate-700 border-2"
        @click.prevent="goRoom(item.uuid)"
      >
        입장
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { getJoinRoomList, joinRoom } from "@/api/Room";
import { MyRoomsinfoDto } from "@/assets/swagger";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import baseImage from "@/assets/images/user-shape.png";

export default defineComponent({
  setup() {
    const router = useRouter();
    const baseRoomMarke = baseImage;

    const data = reactive({
      myJoinRoomLists: [] as Array<MyRoomsinfoDto>,
      isLoading: false,
    });

    const goRoom = async (uuid: string) => {
      console.log(`go ${uuid}`);
      const isExist = data.myJoinRoomLists.find((v) => v.uuid === uuid);
      if (isExist) {
        router.push({
          name: "foodChatRoomJoin",
          params: { uuid },
        });
      } else {
        console.log("수락 기달리기");
        data.isLoading = true;
        const { ok } = await joinRoom({ uuid });
        data.isLoading = false;
        if (ok) {
          router.push({
            name: "foodChatRoomJoin",
            params: { uuid },
          });
        }
      }
    };

    onMounted(async () => {
      data.isLoading = true;
      const { ok, myRooms } = await getJoinRoomList();
      console.log(myRooms);
      data.isLoading = false;
      if (ok) {
        data.myJoinRoomLists = myRooms;
      }
    });

    return {
      baseRoomMarke,
      ...toRefs(data),
      goRoom,
    };
  },
});
</script>

<style lang="scss">
.room-info {
  display: grid;
  gap: 0.5rem;

  width: 100%;
  height: 100%;
  align-content: center;

  grid-template:
    "makre name" 2rem
    "makre super" 2rem
    "makre joinBtn" 4rem
    / 16rem 2fr;

  @include mobile() {
    grid-template:
      "makre name" 1.5rem
      "makre super" 1.5rem
      "makre joinBtn" 3rem
      / 12rem 2fr;
  }

  .room-marke {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    grid-area: makre;

    div {
      width: 95%;
      height: 95%;
      margin: auto;
      border: 1px solid black;
      border-radius: 100%;
      overflow: hidden;
    }
  }

  .room-name {
    grid-area: name;
  }

  .room-super-user {
    grid-area: super;
  }
  button {
    grid-area: joinBtn;
  }
}
</style>
