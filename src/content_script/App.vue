<template lang="pug">
#SYNCROOM_PLUS-wrapper
  Navbar

  #SYNCROOM_PLUS-main

    .level
      .level-left
      .level-right
        b-button(icon-left="cog", type="is-warning is-light", @click="openConfig")
          | 設定

    h2.SYNCROOM_PLUS-main__subtitle 公開ルーム一覧

    .filter-form
      .filter-form__field.custom--search-field
        b-input(
          placeholder='キーワードを入力',
          v-model='keyword',
          type='search',
          icon="search",
        )

      .filter-form__field
        b-field
          b-radio-button(v-model='roomFilter', native-value='all', type='is-info')
            | すべて ({{ rooms.length }})
          b-radio-button(v-model='roomFilter', native-value='only_unlocked', type='is-link')
            b-icon(icon='lock-open')
            | 鍵なし ({{ unlockedRoomCount }})
          b-radio-button(v-model='roomFilter', native-value='only_locked', type='is-dark')
            b-icon(icon='lock')
            | 鍵あり ({{ lockedRoomCount }})

      .filter-form__field
        b-button(type="is-info", tag="a", href="#testroom", icon-left="headphones-alt")
          | 接続テストルームはこちら

    .buttons.custom--taglist
      b-button(v-for="tag in tags", :key="`tag-${tag.name}`", size="is-small", @click="selectTag(tag.name)", :class="{'is-dark': (tag.name === selectedTag), 'is-light': (tag.name !== selectedTag)}")
        | {{ tag.name }} ({{ tag.count }})

    .SYNCROOM_PLUS-main__rooms
      RoomCard(
        v-for="room in filteredRooms",
        :key="`room-${room.creator_mid}`",
        :createTime="room.create_time",
        :iconlist="room.iconlist || []",
        :members="room.members",
        :needPasswd="room.need_passwd",
        :numMembers="room.num_members",
        :roomDesc="room.room_desc || ''",
        :roomName="room.room_name"
        :roomTags="room.room_tags || []"
      )

      template(v-if="filteredRooms.length === 0")
        template(v-if="keyword.length === 0")
          b-message(type="is-warning")
            | ルームがありません 😔
        template(v-else)
          b-message(type="is-warning")
            | ルームが見つかりませんでした 😔

    hr

    h2#testroom.SYNCROOM_PLUS-main__subtitle 接続テストルーム

    .SYNCROOM_PLUS-main__rooms
      RoomCard(
        v-if="testRoom",
        :createTime="testRoom.create_time",
        :iconlist="testRoom.iconlist || []",
        :members="testRoom.members",
        :needPasswd="testRoom.need_passwd",
        :numMembers="testRoom.num_members",
        roomDesc="SYNCROOMの公式テストルームです。入室すると、音声が3秒後に返ってきますので、通信の確認をすることができます。",
        :roomName="testRoom.room_name"
        :roomTags="testRoom.room_tags || []"
      )

  Footer
</template>

<script>
import axios from 'axios';
import RoomCard from './components/RoomCard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Config from './components/Config';
import optimizeSearchKeyword from '../lib/optimize_search_keyword';
import decryptionTags from '../lib/decryption_tags';

export default {
  components: {
    RoomCard,
    Navbar,
    Footer,
  },
  data() {
    return {
      rooms: [],
      testRoom: null,
      roomFilter: 'all',
      keyword: '',
      unlockedRoomCount: 0,
      lockedRoomCount: 0,
      tags: [],
      selectedTag: '',
    };
  },

  mounted() {
    this.$store.dispatch('clock/fetch');
    this.fetchRooms();
    this.timer = setInterval(() => {
      this.$store.dispatch('clock/fetch');
      this.fetchRooms();
    }, 5000);
  },

  methods: {
    selectTag(tagName) {
      if (this.selectedTag === tagName) {
        this.selectedTag = '';
      } else {
        this.selectedTag = tagName;
      }
    },
    openConfig() {
      this.$buefy.modal.open({
        parent: this,
        component: Config,
        hasModalCard: true,
      });
    },
    fetchRooms() {
      axios
        .get('https://webapi.syncroom.appservice.yamaha.com/ndroom/room_list.json?pagesize=500&realm=4')
        .then((res) => {
          this.rooms = res.data.rooms.filter((room) => room.room_name !== '接続テストルーム');

          let allTags = [];

          // タグを復号
          for (let i = 0; i < this.rooms.length; i++) {
            const roomTags = decryptionTags(this.rooms[i]);
            this.rooms[i].room_tags = decryptionTags(this.rooms[i]);
            allTags = allTags.concat(roomTags);
          }

          // 選択しているタグが存在しない場合表示の辻褄が合わなくなるのでリセットしておく
          if (this.selectedTag.length !== 0 && !allTags.some((tag) => tag === this.selectedTag)) {
            this.selectedTag = '';
          }

          this.tags = allTags.reduce((result, current) => {
            const element = result.find((value) => value.name === current);
            if (element) {
              element.count++;
            } else {
              result.push({
                name: current,
                count: 1,
              });
            }
            return result;
          }, []);

          this.lockedRoomCount = this.rooms.filter((room) => room.need_passwd).length;
          this.unlockedRoomCount = this.rooms.filter((room) => !room.need_passwd).length;

          this.testRoom = res.data.rooms.find((room) => room.room_name === '接続テストルーム');
        })
        .catch((e) => {});
    },
  },

  computed: {
    filteredRooms() {
      let displayRooms = this.rooms;

      // すべて/鍵あり/鍵なし
      if (this.roomFilter === 'all') {
      } else if (this.roomFilter === 'only_unlocked') {
        displayRooms = displayRooms.filter((room) => !room.need_passwd);
      } else if (this.roomFilter === 'only_locked') {
        displayRooms = displayRooms.filter((room) => room.need_passwd);
      }

      // タグ選択
      if (this.selectedTag.length !== 0) {
        displayRooms = displayRooms.filter((room) => room.room_tags.some((tag) => tag === this.selectedTag));
      }

      if (this.keyword.length !== 0) {
        const keyword = optimizeSearchKeyword(this.keyword);

        displayRooms = displayRooms.filter((room) => {
          return optimizeSearchKeyword(`${room.room_name}|${room.members.join('|')}|${room.room_tags.join('|')}|${room.room_desc}`).match(keyword);
        });
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

<style lang="sass">
// Import Bulma's core
@import "~bulma/sass/utilities/_all"

// // Set your colors
// $primary: #8c67ef;
// $primary-invert: findColorInvert($primary);
// $twitter: #4099FF;
// $twitter-invert: findColorInvert($twitter);

// // Setup $colors to use as bulma classes (e.g. 'is-twitter')
// $colors: (
//     "white": ($white, $black),
//     "black": ($black, $white),
//     "light": ($light, $light-invert),
//     "dark": ($dark, $dark-invert),
//     "primary": ($primary, $primary-invert),
//     "info": ($info, $info-invert),
//     "success": ($success, $success-invert),
//     "warning": ($warning, $warning-invert),
//     "danger": ($danger, $danger-invert),
//     "twitter": ($twitter, $twitter-invert)
// );

// // Links
// $link: $primary;
// $link-invert: $primary-invert;
// $link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma"
@import "~buefy/src/scss/buefy"

#SYNCROOM_PLUS-main
  background: #F9FBFF !important
  overflow: hidden

.SYNCROOM_PLUS-main__subtitle
  font-size: 20px
  font-weight: bold
  text-align: center
  margin: 0 0 1em 0

.SYNCROOM_PLUS-main__rooms
  display: flex
  justify-content: center
  flex-wrap: wrap

.filter-form
  margin: 30px 0
  text-align: center

  &__field
    display: inline-block
    overflow: hidden

  .control
    margin-right: 25px

  .custom--search-field
    width: 300px

.custom--taglist
  justify-content: center
</style>
