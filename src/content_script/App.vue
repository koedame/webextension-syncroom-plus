<template lang="pug">
#SYNCROOM_PLUS-wrapper
  Navbar

  #SYNCROOM_PLUS-main
    Message

    .filter-form
      .filter-form__field.mr-5(v-if="!$store.getters['config/autoReload']")
        b-button.SYNCROOM_PLUS-main__subtitle__button(type="is-success is-light", @click="fetchRooms")
          b-icon.SYNCROOM_PLUS-main__subtitle__button__icon(v-if="isLoading", custom-class="fa-spin", icon="sync-alt", size="is-small")
          b-icon.SYNCROOM_PLUS-main__subtitle__button__icon(v-else, icon="sync-alt", size="is-small")
          | {{translate("reload")}}

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
        .skeleton_tag.button.is-light.is-small(:key="`tag-${n}`")

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
      .skeleten_room_card.room-list-item.has-background-light(v-for="n in 8", :key="`skeleton-${n}`")

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
        :nationalFlagUrl="room.national_flag_url",
        :remainingTime="room.remaining_time"
      )

    .SYNCROOM_PLUS-main__rooms(name="room-list")
      template(v-if="isEmptyFilteredRooms && !isSkeleton")
        template(v-if="keyword.length === 0")
          b-message(type="is-warning")
            | {{translate("no_room")}} 😔
        template(v-else)
          b-message(type="is-warning")
            | {{translate("room_not_found")}} 😔

    h2#testroom.SYNCROOM_PLUS-main__subtitle.mt-6
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

      .skeleten_room_card.room-list-item.has-background-light(v-if="isSkeleton")

  b-button#form-button(type="is-warning", icon-left="exclamation-triangle", @click="openContactFrom")
    strong
      | {{translate("reports")}}

  Footer
</template>

<script lang="ts">
import axiosClient from '../lib/axios';
import { defineComponent, computed, onBeforeUnmount, ref } from '@vue/composition-api';
import store from '../store';
import RoomCard from './components/RoomCard';
import Message from './components/Message';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';
import optimizeSearchKeyword from '../lib/optimize_search_keyword';
import { translate } from '../lib/i18n';
import { ModalProgrammatic as Modal } from 'buefy';

export default defineComponent({
  components: {
    RoomCard,
    Navbar,
    Footer,
    Message,
  },

  setup() {
    const rooms = ref([]);
    const testRoom = ref(null);
    const roomFilter = ref('all');
    const keyword = ref('');
    const publicRoomCount = ref(0);
    const unlockedRoomCount = ref(0);
    const lockedRoomCount = ref(0);
    const tags = ref([]);
    const lockedRoomTags = ref([]);
    const unlockedRoomTags = ref([]);
    const selectedTag = ref('');
    const isLoading = ref(false);
    const isAnimationable = ref(false);
    const isSkeleton = ref(true);
    const timer = ref(null);

    const fetchRooms = () => {
      isLoading.value = true;
      axiosClient.get('/api/v1/rooms/all').then((res) => {
        rooms.value = res.data.rooms;
        tags.value = res.data.aggregated_tags;
        lockedRoomTags.value = res.data.locked_aggregated_tags;
        unlockedRoomTags.value = res.data.opend_aggregated_tags;
        publicRoomCount.value = res.data.public_room_count;
        lockedRoomCount.value = res.data.public_locked_rooms_count;
        unlockedRoomCount.value = res.data.public_opend_rooms_count;
        testRoom.value = res.data.test_room;

        // 選択しているタグが存在しない場合表示の辻褄が合わなくなるのでリセットしておく
        if (selectedTag.value.length !== 0 && !res.data.aggregated_tags.some((tag: any) => tag.name === selectedTag.value)) {
          selectedTag.value = '';
        }

        isSkeleton.value = false;
        isAnimationable.value = true;

        setTimeout(() => {
          isLoading.value = false;
        }, 1000);
      });
    };

    fetchRooms();

    const roomComponent = computed(() => {
      if (isAnimationable.value && store.getters['config/animation']) {
        return 'transition-group';
      } else {
        return 'div';
      }
    });

    const filteredRooms = computed(() => {
      const displayRooms = rooms.value;

      for (const displayRoom of displayRooms) {
        displayRoom.show = true;

        if (roomFilter.value === 'only_unlocked') {
          if (displayRoom.is_password_required) {
            displayRoom.show = false;
          }
        } else if (roomFilter.value === 'only_locked') {
          if (!displayRoom.is_password_required) {
            displayRoom.show = false;
          }
        }

        // タグ選択
        if (selectedTag.value.length !== 0) {
          if (!displayRoom.tags.some((tag: any) => tag === selectedTag.value)) {
            displayRoom.show = false;
          }
        }

        if (keyword.value.length !== 0) {
          const k = optimizeSearchKeyword(keyword.value);

          if (
            !optimizeSearchKeyword(
              `${displayRoom.name}|${displayRoom.members
                .map((m: any) => {
                  return m.name;
                })
                .join('|')}|${displayRoom.tags.join('|')}|${displayRoom.description}`
            ).match(k)
          ) {
            displayRoom.show = false;
          }
        }
      }

      return displayRooms;
    });

    const openContactFrom = () => {
      Modal.open({
        component: ContactForm,
      });
    };

    const isEmptyFilteredRooms = computed(() => {
      return !filteredRooms.value.some((room) => room.show);
    });

    const onChangeRoomFilter = () => {
      // タグが選択しっぱなしで解除できなくなるのでリセットしておく
      selectedTag.value = '';
      // フォーカスされるとされると矢印キーで操作できてしまいUXが低下するのでフォーカスをはずす
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 250);
    };

    timer.value = setInterval(() => {
      if (store.getters['config/autoReload']) {
        fetchRooms();
      }
    }, 5000);

    onBeforeUnmount(() => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });

    return {
      fetchRooms,
      rooms,
      testRoom,
      roomFilter,
      keyword,
      publicRoomCount,
      unlockedRoomCount,
      lockedRoomCount,
      tags,
      lockedRoomTags,
      unlockedRoomTags,
      selectedTag,
      isLoading,
      isAnimationable,
      isSkeleton,
      translate,
      roomComponent,
      filteredRooms,
      isEmptyFilteredRooms,
      openContactFrom,
      onChangeRoomFilter,
    };
  },
});
</script>

<style lang="sass">
@import "~bulma/sass/utilities/_all"

@import "~bulma"
@import "~buefy/src/scss/buefy"

#SYNCROOM_PLUS-main
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

html,body
  overscroll-behavior: none

.skeleten_room_card
  width: 300px
  height: 500px
  border-radius: 5px
  margin: 5px 5px 15px 5px

.skeleton_tag
  width: 100px
</style>
