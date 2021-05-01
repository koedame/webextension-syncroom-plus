<template lang="pug">
#SYNCROOM_PLUS-wrapper
  Navbar

  #SYNCROOM_PLUS-main
    h2.SYNCROOM_PLUS-main__subtitle
      | {{ translate('public_rooms') }}

      template(v-if="!this.$store.getters['config/autoReload']")
        b-button.SYNCROOM_PLUS-main__subtitle__button(type="is-success is-light", @click="fetchRooms")
          b-icon.SYNCROOM_PLUS-main__subtitle__button__icon(v-if="isLoading", custom-class="fa-spin", icon="sync-alt", size="is-small")
          b-icon.SYNCROOM_PLUS-main__subtitle__button__icon(v-else, icon="sync-alt", size="is-small")
          | {{translate("reload")}}

    .filter-form
      .filter-form__field.custom--search-field
        b-input(
          :placeholder='translate("type_keywords")',
          v-model='keyword',
          type='search',
          icon="search",
        )

      .filter-form__field
        b-field
          b-radio-button(v-model='roomFilter', native-value='all', @click.native='onChangeRoomFilter', type='is-info')
            | {{translate("all")}} ({{ publicRoomCount }})
          b-radio-button(v-model='roomFilter', native-value='only_unlocked', @click.native='onChangeRoomFilter', type='is-link')
            b-icon(icon='lock-open')
            | {{translate("unlocked")}} ({{ unlockedRoomCount }})
          b-radio-button(v-model='roomFilter', native-value='only_locked', @click.native='onChangeRoomFilter', type='is-dark')
            b-icon(icon='lock')
            | {{translate("locked")}} ({{ lockedRoomCount }})

      .filter-form__field
        b-button(type="is-info", tag="a", href="#testroom", icon-left="headphones-alt")
          | {{translate("test_room")}}

    .buttons.custom--taglist
      template(v-for="n in 5", v-if="isSkeleton")
        b-button(:key="`tag-${n}`", size="is-small", type="is-light")
          | {{"　　　　　　　　"}}

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

    .SYNCROOM_PLUS-main__rooms(name="room-list", v-if="isSkeleton")
      .skeleten_room_card.room-list-item.has-background-light(v-for="n in 8")

    .SYNCROOM_PLUS-main__rooms(name="room-list", :is="roomComponent")
      RoomCard.room-list-item(
        v-for="room in filteredRooms",
        v-show="room.show",
        :key="`room-${room.created_at}-${room.name}`",
        :createTime="room.created_at",
        :members="room.members",
        :needPasswd="room.is_password_required",
        :roomDesc="room.description",
        :roomName="room.name",
        :roomTags="room.tags",
        :remainingTime="room.remaining_time"
      )

    .SYNCROOM_PLUS-main__rooms(name="room-list")
      template(v-if="isEmptyFilteredRooms")
        template(v-if="keyword.length === 0")
          b-message(type="is-warning")
            | {{translate("no_room")}} 😔
        template(v-else)
          b-message(type="is-warning")
            | {{translate("room_not_found")}} 😔

    hr

    h2#testroom.SYNCROOM_PLUS-main__subtitle
      | {{translate("test_room")}}

    .SYNCROOM_PLUS-main__rooms
      RoomCard(
        v-if="testRoom",
        :createTime="testRoom.created_at",
        :members="testRoom.members",
        :needPasswd="testRoom.is_password_required",
        :roomDesc="translate('test_room_description')",
        roomName="接続テストルーム",
        :roomTags="testRoom.tags",
        :remainingTime="testRoom.remaining_time"
      )

  b-button#form-button(type="is-warning", icon-left="exclamation-triangle", @click="openContactFrom")
    strong
      | {{translate("reports")}}

  Footer
</template>

<script>
import axios from 'axios';
import RoomCard from './components/RoomCard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';
import optimizeSearchKeyword from '../lib/optimize_search_keyword';
import { translate } from '../lib/i18n';
import { ModalProgrammatic as Modal } from 'buefy';

export default {
  components: {
    RoomCard,
    Navbar,
    Footer,
  },
  data() {
    return {
      rooms: [],
      public_locked_rooms: [],
      public_opend_rooms: [],
      testRoom: null,
      roomFilter: 'all',
      keyword: '',
      publicRoomCount: 0,
      unlockedRoomCount: 0,
      lockedRoomCount: 0,
      tags: [],
      lockedRoomTags: [],
      unlockedRoomTags: [],
      selectedTag: '',
      isLoading: false,
      translate,
      isAnimationable: false,
      isSkeleton: true
    };
  },

  mounted() {
    this.fetchRooms();
    this.timer = setInterval(() => {
      if (this.$store.getters['config/autoReload']) {
        this.fetchRooms();
      }
    }, 5000);
  },

  methods: {
    async fetchRooms() {
      this.isLoading = true;
      // const res = await axios.get('http://localhost:8080/api/v1/rooms/all');
      const res = await axios.get('https://syncroomplus.koeda.me/api/v1/rooms/all');

      this.rooms = res.data.rooms;
      this.tags = res.data.aggregated_tags;
      this.lockedRoomTags = res.data.locked_aggregated_tags;
      this.unlockedRoomTags = res.data.opend_aggregated_tags;
      this.publicRoomCount = res.data.public_room_count;
      this.lockedRoomCount = res.data.public_locked_rooms_count;
      this.unlockedRoomCount = res.data.public_opend_rooms_count;
      this.testRoom = res.data.test_room;

      // 選択しているタグが存在しない場合表示の辻褄が合わなくなるのでリセットしておく
      if (this.selectedTag.length !== 0 && !res.data.aggregated_tags.some((tag) => tag.name === this.selectedTag)) {
        this.selectedTag = '';
      }

      this.isSkeleton = false
      this.isAnimationable = true
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },

    openContactFrom() {
      Modal.open({
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
    roomComponent(){
      if (this.isAnimationable && this.$store.getters['config/animation']) {
        return 'transition-group'
      } else {
        return 'div'
      }
    },
    filteredRooms() {
      const displayRooms = this.rooms;

      for (const displayRoom of displayRooms) {
        displayRoom.show = true;

        if (this.roomFilter === 'only_unlocked') {
          if (displayRoom.is_password_required) {
            displayRoom.show = false;
          } else {
            displayRoom.show = true;
          }
        } else if (this.roomFilter === 'only_locked') {
          if (displayRoom.is_password_required) {
            displayRoom.show = true;
          } else {
            displayRoom.show = false;
          }
        }

        // タグ選択
        if (this.selectedTag.length !== 0) {
          if (!displayRoom.tags.some((tag) => tag === this.selectedTag)) {
            displayRoom.show = false;
          }
        }

        if (this.keyword.length !== 0) {
          const keyword = optimizeSearchKeyword(this.keyword);

          if (
            !optimizeSearchKeyword(
              `${displayRoom.name}|${displayRoom.members
                .map((m) => {
                  return m.name;
                })
                .join('|')}|${displayRoom.tags.join('|')}|${displayRoom.description}`
            ).match(keyword)
          ) {
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
  overflow: hidden
  padding: 3em 0

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

html,body
  overscroll-behavior: none

.skeleten_room_card
  width: 300px
  height: 500px
  border-radius: 5px
  margin: 5px 5px 15px 5px
</style>
