<template lang="pug">
#SYNCROOM_PLUS-main(v-if="rooms")
  h2.SYNCROOM_PLUS-main__subtitle 公開ルーム一覧（{{totalPublishedRooms}}）

  transition-group.SYNCROOM_PLUS-main__rooms(name="room-list", tag="div")
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
      :roomTags="room | tagConvert"
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
    this.$store.dispatch('clock/fetch');
    this.fetchRooms();
    this.timer = setInterval(() => {
      this.$store.dispatch('clock/fetch');
      this.fetchRooms();
    }, 1000);
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
  filters: {
    tagConvert(room) {
      var m;
      var i;
      var result = [];

      const tags = [
        '練習中',
        'おしゃべり',
        '初心者OK',
        '配信中',
        '録音中',
        'Classic',
        'Country / Folk',
        'Club Music / EDM',
        'Hip Hop / Rap',
        'R&B / Soul',
        'Jazz',
        'Fusion',
        'Rock',
        'HR / HM',
        '洋楽',
        'J-Pop',
        'アイドル',
        'アニメ・ゲーム・ボカロ',
        'World',
      ];

      if (room.tag_orig) {
        result.push(room.tag_orig);
      }

      if (room.tag_mask) {
        m = (room.tag_mask ^ 0xffffffff) >>> 0;
        for (i = 0; i < tags.length; i++) {
          var tm = Math.pow(2, i);
          if (((m ^ 0xffffffff) & tm) === tm) {
            result.push(tags[i]);
          }
        }
      }

      return result;
    },
  },
};
</script>

<style lang="sass" scoped>
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
  transition: all 0.5s

.room-list-enter, .room-list-leave-to, .list-leave-active
  opacity: 0

.room-list-move
  transition: transform 0.5s
</style>
