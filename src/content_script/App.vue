<template lang="pug">
#SYNCROOM_PLUS-main(v-if="rooms")
  h2.SYNCROOM_PLUS-main__subtitle 公開ルーム一覧

  .filter-form
    .filter-form__filter-keyword
      label
        fa.filter-form__filter-keyword__search-icon(:icon="['fas', 'search']")
        input.filter-form__filter-keyword__input(v-model="keyword", placeholder="キーワードを入力")
      fa.filter-form__filter-keyword__clear-icon(:icon="['fas', 'times-circle']", v-if="keyword", @click="keyword = ''")
    .filter-form__filter-switchs
      button.filter-form__filter-switchs__item(:class="{'filter-form__filter-switchs__item--active': (roomFilter === 'all')}", @click="roomFilter = 'all'")
        | すべて ({{ this.rooms.length }})
      button.filter-form__filter-switchs__item(:class="{'filter-form__filter-switchs__item--active': (roomFilter === 'only_unlocked')}", @click="roomFilter = 'only_unlocked'")
        fa(:icon="['fas', 'unlock']")
        |
        | 鍵なし ({{ this.unlockedRoomCount }})
      button.filter-form__filter-switchs__item(:class="{'filter-form__filter-switchs__item--active': (roomFilter === 'only_locked')}", @click="roomFilter = 'only_locked'")
        fa(:icon="['fas', 'lock']")
        |
        | 鍵あり ({{ this.lockedRoomCount }})

    a.filter-form__testroom-link(href="#testroom")
      fa(:icon="['fas', 'headphones-alt']")
      |
      | 接続テストルームはこちら

  .SYNCROOM_PLUS-main__rooms
    RoomCard(
      v-for="room in filteredRooms",
      :key="`room-${room.creator_mid}`",
      :createTime="room.create_time",
      :creatorMid="room.creator_mid",
      :creatorNick="room.creator_nick",
      :iconlist="room.iconlist || []",
      :index="room.index",
      :members="room.members",
      :needPasswd="room.need_passwd",
      :numMembers="room.num_members",
      :realm="room.realm",
      :roomDesc="room.room_desc || ''",
      :roomName="room.room_name"
      :roomTags="room.room_tags || []"
    )

  h2#testroom.SYNCROOM_PLUS-main__subtitle 接続テストルーム

  .SYNCROOM_PLUS-main__rooms
    RoomCard(
      v-if="testRoom",
      :createTime="testRoom.create_time",
      :creatorMid="testRoom.creator_mid",
      :creatorNick="testRoom.creator_nick",
      :iconlist="testRoom.iconlist || []",
      :index="testRoom.index",
      :members="testRoom.members",
      :needPasswd="testRoom.need_passwd",
      :numMembers="testRoom.num_members",
      :realm="testRoom.realm",
      roomDesc="SYNCROOMの公式テストルームです。入室すると、音声が3秒後に返ってきますので、通信の確認をすることができます。",
      :roomName="testRoom.room_name"
      :roomTags="testRoom.room_tags || []"
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
      testRoom: null,
      roomFilter: 'all',
      keyword: '',
      unlockedRoomCount: 0,
      lockedRoomCount: 0,
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
        // タグを復号
        for (let i = 0; i < this.rooms.length; i++) {
          this.rooms[i]['room_tags'] = this.tagConvert(this.rooms[i]);
        }

        // 検索用文字列を追加
        for (let i = 0; i < this.rooms.length; i++) {
          this.rooms[i]['for_search'] = this.convertSearchKeyword(
            `${this.rooms[i].room_name}|${this.rooms[i].members.join('|')}|${this.rooms[i].room_tags.join('|')}|${this.rooms[i].room_desc}`
          );
        }

        this.lockedRoomCount = this.rooms.filter(room => room.need_passwd).length;
        this.unlockedRoomCount = this.rooms.filter(room => !room.need_passwd).length;

        this.testRoom = res.data.rooms.find(room => room.room_name === '接続テストルーム');
      });
    },
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
    convertSearchKeyword(keyword) {
      let result = keyword;

      // 英数字をすべて半角に統一
      result = result.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
      });

      // ひらがなをカタカナに統一
      result = result.replace(/[\u3041-\u3096]/g, ch => {
        return String.fromCharCode(ch.charCodeAt(0) + 0x60);
      });

      // アルファベットをすべて小文字に統一
      result = result.toLowerCase();
      return result;
    },
  },

  computed: {
    filteredRooms() {
      let displayRooms = this.rooms;
      if (this.roomFilter === 'all') {
      } else if (this.roomFilter === 'only_unlocked') {
        displayRooms = displayRooms.filter(room => !room.need_passwd);
      } else if (this.roomFilter === 'only_locked') {
        displayRooms = displayRooms.filter(room => room.need_passwd);
      }

      if (this.keyword.length !== 0) {
        let keyword = this.convertSearchKeyword(this.keyword);
        displayRooms = displayRooms.filter(room => room.for_search.match(keyword));
      }

      return displayRooms;
    },
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style lang="sass" scoped>
#SYNCROOM_PLUS-main
  background: #F9FBFF !important
  overflow: hidden

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

  &__filter-keyword
    display: inline-block
    margin-right: 10px
    position: relative
    &__search-icon
      position: absolute
      left: 7px
      top: 7px
      color: #949494
    &__input
      border: solid 1px #ccc
      border-radius: 5px
      padding: 0 26px
    &__clear-icon
      position: absolute
      right: 8px
      top: 8px
      cursor: pointer

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
