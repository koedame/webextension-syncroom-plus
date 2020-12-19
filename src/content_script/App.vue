<template lang="pug">
#SYNCROOM_PLUS-wrapper
  Navbar

  #SYNCROOM_PLUS-main

    .level
      .level-left
      .level-right
        b-button(icon-left="cog", type="is-warning is-light", @click="openConfig")
          | 設定

    h2.SYNCROOM_PLUS-main__subtitle
      | 公開ルーム一覧
      template(v-if="!this.$store.getters['config/autoReload']")
        b-button.SYNCROOM_PLUS-main__subtitle__button(type="is-success is-light", @click="fetchRooms")
          b-icon.SYNCROOM_PLUS-main__subtitle__button__icon(v-if="isLoading", custom-class="fa-spin", icon="sync-alt", size="is-small")
          b-icon.SYNCROOM_PLUS-main__subtitle__button__icon(v-else, icon="sync-alt", size="is-small")
          | 更新

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
          b-radio-button(v-model='roomFilter', native-value='all', @click.native='onChangeRoomFilter', type='is-info')
            | すべて ({{ rooms.length }})
          b-radio-button(v-model='roomFilter', native-value='only_unlocked', @click.native='onChangeRoomFilter', type='is-link')
            b-icon(icon='lock-open')
            | 鍵なし ({{ unlockedRoomCount }})
          b-radio-button(v-model='roomFilter', native-value='only_locked', @click.native='onChangeRoomFilter', type='is-dark')
            b-icon(icon='lock')
            | 鍵あり ({{ lockedRoomCount }})

      .filter-form__field
        b-button(type="is-info", tag="a", href="#testroom", icon-left="headphones-alt")
          | 接続テストルームはこちら

    .buttons.custom--taglist
      template(v-for="tag in tags", v-if="roomFilter === 'all'")
        b-button(v-if="tag.name === selectedTag", :key="`tag-${tag.name}`", size="is-small", @click="selectedTag = ''", type="is-dark", icon-left="times")
          | {{ tag.name }} ({{ tag.count }})
        b-button(v-else, :key="`tag-${tag.name}`", size="is-small", @click="selectedTag = tag.name", type="is-light")
          | {{ tag.name }} ({{ tag.count }})
      template(v-for="tag in lockedRoomTags", v-if="roomFilter === 'only_locked'")
        b-button(v-if="tag.name === selectedTag", :key="`tag-${tag.name}`", size="is-small", @click="selectedTag = ''", type="is-dark", icon-left="times")
          | {{ tag.name }} ({{ tag.count }})
        b-button(v-else, :key="`tag-${tag.name}`", size="is-small", @click="selectedTag = tag.name", type="is-light")
          | {{ tag.name }} ({{ tag.count }})
      template(v-for="tag in unlockedRoomTags", v-if="roomFilter === 'only_unlocked'")
        b-button(v-if="tag.name === selectedTag", :key="`tag-${tag.name}`", size="is-small", @click="selectedTag = ''", type="is-dark", icon-left="times")
          | {{ tag.name }} ({{ tag.count }})
        b-button(v-else, :key="`tag-${tag.name}`", size="is-small", @click="selectedTag = tag.name", type="is-light")
          | {{ tag.name }} ({{ tag.count }})


    transition-group.SYNCROOM_PLUS-main__rooms(name="room-list", tag="div", v-if="$store.getters['config/animation']")
      RoomCard.room-list-item(
        v-for="room in filteredRooms",
        v-show="room.show",
        :key="`room-${room.create_time}-${room.room_name}`",
        :createTime="room.create_time",
        :iconlist="room.iconlist || []",
        :members="room.members",
        :needPasswd="room.need_passwd",
        :numMembers="room.num_members",
        :roomDesc="room.room_desc || ''",
        :roomName="room.room_name"
        :roomTags="room.room_tags || []"
      )
    .SYNCROOM_PLUS-main__rooms(name="room-list", tag="div", v-else)
      RoomCard.room-list-item(
        v-for="room in filteredRooms",
        v-show="room.show",
        :key="`room-${room.create_time}-${room.room_name}`",
        :createTime="room.create_time",
        :iconlist="room.iconlist || []",
        :members="room.members",
        :needPasswd="room.need_passwd",
        :numMembers="room.num_members",
        :roomDesc="room.room_desc || ''",
        :roomName="room.room_name"
        :roomTags="room.room_tags || []"
      )

    .SYNCROOM_PLUS-main__rooms(name="room-list")
      template(v-if="isEmptyFilteredRooms")
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

  b-button#form-button(type="is-warning", icon-left="exclamation-triangle", @click="openContactFrom")
    strong 要望・不具合報告はこちら

  Footer
</template>

<script>
import axios from 'axios';
import RoomCard from './components/RoomCard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Config from './components/Config';
import ContactForm from './components/ContactForm';
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
      lockedRoomTags: [],
      unlockedRoomTags: [],
      selectedTag: '',
      isLoading: false,
    };
  },

  mounted() {
    this.$store.dispatch('clock/fetch');
    this.fetchRooms();
    this.timer = setInterval(() => {
      this.$store.dispatch('clock/fetch');

      if (this.$store.getters['config/autoReload']) {
        this.fetchRooms();
      }
    }, 5000);
  },

  methods: {
    openConfig() {
      this.$buefy.modal.open({
        parent: this,
        component: Config,
        hasModalCard: true,
      });
    },
    async fetchRooms() {
      this.isLoading = true;
      await axios
        .get('https://webapi.syncroom.appservice.yamaha.com/ndroom/room_list.json?pagesize=500&realm=4')
        .then((res) => {
          this.rooms = res.data.rooms.filter((room) => room.room_name !== '接続テストルーム');

          let allTags = [];
          let lockedRoomTags = [];
          let unlockedRoomTags = [];

          // タグを復号
          for (let i = 0; i < this.rooms.length; i++) {
            const roomTags = decryptionTags(this.rooms[i]);
            this.rooms[i].room_tags = roomTags;
            allTags = allTags.concat(roomTags);

            if (this.rooms[i].need_passwd) {
              lockedRoomTags = lockedRoomTags.concat(roomTags);
            } else {
              unlockedRoomTags = unlockedRoomTags.concat(roomTags);
            }
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

          this.lockedRoomTags = lockedRoomTags.reduce((result, current) => {
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

          this.unlockedRoomTags = unlockedRoomTags.reduce((result, current) => {
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

      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },

    openContactFrom() {
      this.$buefy.modal.open({
        parent: this,
        component: ContactForm,
      });
    },

    onChangeRoomFilter(e) {
      // タグが選択しっぱなしで解除できなくなるのでリセットしておく
      this.selectedTag = '';
      // フォーカスされるとされると矢印キーで操作できてしまいUXが低下するのでフォーカスをはずす
      setTimeout(() => {
        document.activeElement.blur();
      }, 250);
    },
  },

  computed: {
    filteredRooms() {
      const displayRooms = this.rooms;

      for (const displayRoom of displayRooms) {
        displayRoom.show = true;

        // すべて/鍵あり/鍵なし
        if (this.roomFilter === 'only_unlocked') {
          if (displayRoom.need_passwd) {
            displayRoom.show = false;
          }
        } else if (this.roomFilter === 'only_locked') {
          if (!displayRoom.need_passwd) {
            displayRoom.show = false;
          }
        }

        // タグ選択
        if (this.selectedTag.length !== 0) {
          if (!displayRoom.room_tags.some((tag) => tag === this.selectedTag)) {
            displayRoom.show = false;
          }
        }

        if (this.keyword.length !== 0) {
          const keyword = optimizeSearchKeyword(this.keyword);

          if (!optimizeSearchKeyword(`${displayRoom.room_name}|${displayRoom.members.join('|')}|${displayRoom.room_tags.join('|')}|${displayRoom.room_desc}`).match(keyword)) {
            displayRoom.show = false;
          }
        }
      }

      return displayRooms;
    },
    isEmptyFilteredRooms() {
      return !this.filteredRooms.some((room) => room.show);
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
  &__button
    vertical-align: baseline
    margin-left: 20px
    &__icon
      margin-right: 5px !important
      vertical-align: bottom


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

.room-list-item
  transition: all 500ms
  // `.card` に `overflow: hidden` が設定されているので上書き
  overflow: visible

.room-list-enter
  opacity: 0
  transform: translateY(-500px)

// .room-list-enter-active

// .room-list-enter-to

.room-list-leave-active
  position: absolute

.room-list-leave-to
  opacity: 0
  transform: translateY(500px)

#form-button
  position: fixed
  bottom: 20px
  right: 12px
</style>
