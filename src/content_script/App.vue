<template lang="pug">
#SYNCROOM_PLUS-main(v-if="rooms")
  h2.SYNCROOM_PLUS-main__subtitle 公開ルーム一覧

  .filter-form
    .filter-form__filter-switchs
      button.filter-form__filter-switchs__item(:class="{'filter-form__filter-switchs__item--active': (roomFilter === 'all')}", @click="roomFilter = 'all'")
        | すべて ({{ this.rooms.length }})
      button.filter-form__filter-switchs__item(:class="{'filter-form__filter-switchs__item--active': (roomFilter === 'only_unlocked')}", @click="roomFilter = 'only_unlocked'")
        | 鍵なし ({{ this.unlockedRooms.length }})
      button.filter-form__filter-switchs__item(:class="{'filter-form__filter-switchs__item--active': (roomFilter === 'only_locked')}", @click="roomFilter = 'only_locked'")
        | 鍵あり ({{ this.lockedRooms.length }})

    a.filter-form__testroom-link(href="#testroom") 接続テストルームはこちら

  .SYNCROOM_PLUS-main__rooms
    RoomCard(
      v-for="room in filteredRooms",
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

  h2#testroom.SYNCROOM_PLUS-main__subtitle 接続テストルーム

  .SYNCROOM_PLUS-main__rooms
    RoomCard(
      v-if="testRoom",
      :createTime="testRoom.create_time",
      :creatorIcon="testRoom.creator_icon",
      :creatorMid="testRoom.creator_mid",
      :creatorNick="testRoom.creator_nick",
      :iconlist="testRoom.iconlist",
      :index="testRoom.index",
      :members="testRoom.members",
      :needPasswd="testRoom.need_passwd",
      :numMembers="testRoom.num_members",
      :realm="testRoom.realm",
      roomDesc="SYNCROOMの公式テストルームです。入室すると、音声が3秒後に返ってきますので、通信の確認をすることができます。",
      :roomName="testRoom.room_name"
      :roomTags="testRoom | tagConvert"
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
      rooms: [],
      unlockedRooms: [],
      lockedRooms: [],
      totalPublishedRooms: null,
      testRoom: null,
      roomFilter: 'all',
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
        this.rooms = res.data.rooms.filter(room => room.room_name !== '接続テストルーム');
        this.lockedRooms = this.rooms.filter(room => room.need_passwd);
        this.unlockedRooms = this.rooms.filter(room => !room.need_passwd);
        this.testRoom = res.data.rooms.find(room => room.room_name === '接続テストルーム');
        this.totalPublishedRooms = res.data.total_published_rooms;
      });
    },
  },

  computed: {
    filteredRooms() {
      if (this.roomFilter === 'all') {
        return this.rooms;
      } else if (this.roomFilter === 'only_unlocked') {
        return this.unlockedRooms;
      } else if (this.roomFilter === 'only_locked') {
        return this.lockedRooms;
      }
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
  margin: 2em 0 1em 0

.SYNCROOM_PLUS-main__rooms
  display: flex
  justify-content: center
  flex-wrap: wrap

.filter-form
  text-align: center
  margin-bottom: 1em

  &__filter-switchs
    display: inline-block
    margin-right: 10px

    &__item
      outline: none
      border: solid 1px #ccc
      padding: 0 10px
      cursor: pointer

      &:first-child
        border-radius: 5px 0 0 5px
        border-right: none

      &:last-child
        border-radius: 0 5px 5px 0
        border-left: none

      &--active
        background: #5072f5
        color: #fff

  &__testroom-link
    background: #5072f5
    color: #fff
    padding: 0px 10px
    display: inline-block
    border-radius: 5px
</style>
