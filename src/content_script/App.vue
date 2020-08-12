<template lang="pug">
#SYNCROOM_PLUS-main(v-if="rooms")
  h2.SYNCROOM_PLUS-main__subtitle 公開ルーム一覧（{{totalPublishedRooms}}）

  transition-group.SYNCROOM_PLUS-main__rooms(name="room-list")
    RoomCard(
      v-for="room in rooms",
      :key="`room-${room.creator_mid}`",
      :createTime="room.create_time",
      :creatorIcon="room.creator_icon",
      :creatorMid="room.creator_mid",
      :creatorNick="room.creator_nick",
      :iconlist="room.iconlist",
      :index="room.index",
      :members="room.members",
      :needPasswd="room.need_passwd",
      :numMembers="room.num_members",
      :realm="room.realm",
      :roomDesc="room.room_desc || ''",
      :roomName="room.room_name"
    )
</template>

<script>
import axios from 'axios';
import RoomCard from './components/RoomCard';

export default {
  components: {
    RoomCard,
  },
  data() {
    return {
      timer: null,
      rooms: null,
      totalPublishedRooms: null,
    };
  },
  mounted() {
    this.fetchRooms();
    this.timer = setInterval(() => {
      this.fetchRooms();
    }, 5000);
  },

  methods: {
    fetchRooms() {
      axios.get('https://webapi.syncroom.appservice.yamaha.com/ndroom/room_list.json?pagesize=500&realm=4').then(res => {
        this.rooms = res.data.rooms;
        this.totalPublishedRooms = res.data.total_published_rooms;
      });
    },
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style lang="sass" scope>
#SYNCROOM_PLUS-main
  background: #F9FBFF !important

.SYNCROOM_PLUS-main__subtitle
  font-size: 20px
  font-weight: bold
  text-align: center
  margin: 1em 0

.SYNCROOM_PLUS-main__rooms
  display: flex
  justify-content: center
  flex-wrap: wrap

.room-list-enter-active, .room-list-leave-active
  transition: all 500ms

.room-list-enter, .room-list-leave-to
  opacity: 0

.room-list-leave-active
  // 移動のトランジションをさせる場合は非表示アニメーション中は position: absoluteを指定しないと正しく動作しない
  position: absolute

.room-list-move
  transition: all 500ms
</style>
