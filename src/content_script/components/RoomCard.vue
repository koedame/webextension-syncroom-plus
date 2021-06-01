<template lang="pug">
.card(:class="{ 'card--no_vacancy': isNoVacancy, 'card--need_passwd': needPasswd }")
  .card__header
    .card__header__item
      img.card__header__item__flag(v-if="nationalFlagUrl" :src="nationalFlagUrl")
    .card__header__item
      span.card__header__item__remaining_time
        | {{remainingTime}}
    .card__header__item
  .card__body
    h3.room_name(v-html="roomNameHTML")

    p.room_tags
      b-taglist
        b-tag(v-for="tag in roomTags", :key="tag")
          span(v-html="twemoji.parse(tag)")

    p.room_desc(v-html="roomDescHTML")

    Members(:members="members", :room-create-time="createTime")

    div(v-if="isNoVacancy")
      template(v-if="isNotificationVacancyRoom")
        b-button(type="is-link is-light", expanded, @click="onRemoveNotificationVacancyRoom", icon-left="bell")
          | {{translate("cancel_notification")}}
      template(v-else)
        b-button(type="is-link is-light", expanded, @click="onSetNotificationVacancyRoom", icon-left="bell-slash")
          | {{translate("notification_when_joinable")}}

    div(v-else)
      .level
        .level-left
          b-button(type="is-light" @click="onOpenTentativeSyncroom")
            | {{translate("temporary_entry")}}

        .level-right
          b-button.card__body__buttons__entry-button(v-if="needPasswd", type="is-dark" @click="onOpenSyncroom", icon-left="lock")
            | {{translate("join")}}
          b-button.card__body__buttons__entry-button(v-else, type="is-link" @click="onOpenSyncroom")
            | {{translate("join")}}
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

// @ts-ignore
import twemoji from 'twemoji';

import Members from './Members';
import PasswordPrompt from './PasswordPrompt';
import store from '../../store';

import makeJoinUri from '../../lib/make_join_uri';
import { translate } from '../../lib/i18n';
import { ModalProgrammatic as Modal } from 'buefy';

type Props = {
  createTime: string;
  roomDesc: string;
  roomName: string;
  members: any;
  needPasswd: boolean;
  roomTags: string[];
  remainingTime: string;
  nationalFlagUrl: string | null;
};

export default defineComponent({
  props: {
    createTime: {
      type: String,
      required: true,
    },
    roomDesc: {
      type: String,
      required: true,
    },
    roomName: {
      type: String,
      required: true,
    },
    members: {
      type: Array,
      required: true,
    },
    needPasswd: {
      type: Boolean,
      required: true,
    },
    roomTags: {
      type: Array,
      required: true,
    },
    remainingTime: {
      type: String,
      required: true,
    },
    nationalFlagUrl: {
      type: String,
      required: false,
    },
  },

  components: {
    Members,
  },

  setup(props: Props) {
    const onSetNotificationVacancyRoom = () => {
      store.dispatch('notificationVacancyRooms/setNotificationByUID', `${props.createTime}||${props.roomName}`);
    };

    const onRemoveNotificationVacancyRoom = () => {
      store.dispatch('notificationVacancyRooms/removeNotificationByUID', `${props.createTime}||${props.roomName}`);
    };

    const onOpenSyncroom = () => {
      if (props.needPasswd) {
        Modal.open({
          component: PasswordPrompt,
          props: {
            roomName: props.roomName,
            temporaly: false,
          },
          hasModalCard: true,
        });
      } else {
        location.href = makeJoinUri(props.roomName, '', false);
      }
    };

    const onOpenTentativeSyncroom = () => {
      if (props.needPasswd) {
        Modal.open({
          component: PasswordPrompt,
          props: {
            roomName: props.roomName,
            temporaly: true,
          },
          hasModalCard: true,
        });
      } else {
        location.href = makeJoinUri(props.roomName, '', true);
      }
    };

    const roomDescHTML = computed(() => {
      const linkedHTML = props.roomDesc
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br />')
        .replace(/(\b(https|http):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi, (link: string) => {
          return `<a href='${link}' target='_blank' rel='noopener noreferrer'>${link}</a>`;
        })
        .replace(/((@|＠)[0-9a-zA-Z_]{1,15})/g, (twitterID: string) => {
          const noAtTwitterID = twitterID.replace(/@|＠/g, '');
          return `<a href='https://twitter.com/${noAtTwitterID}' target='_blank' rel='noopener noreferrer'>${twitterID}</a>`;
        });
      const result = twemoji.parse(linkedHTML);
      return result;
    });

    const isNoVacancy = computed(() => {
      return props.members.length === 5;
    });

    const isNotificationVacancyRoom = computed(() => {
      return store.getters['notificationVacancyRooms/rooms'].find((r: any) => r.uid === `${props.createTime}||${props.roomName}`);
    });

    const roomNameHTML = computed(() => {
      return twemoji.parse(props.roomName);
    });

    return {
      translate,
      onSetNotificationVacancyRoom,
      onRemoveNotificationVacancyRoom,
      onOpenSyncroom,
      onOpenTentativeSyncroom,
      roomDescHTML,
      isNoVacancy,
      isNotificationVacancyRoom,
      roomNameHTML,
      twemoji,
    };
  },
});
</script>

<style lang="sass" scoped>
.card
  margin: 5px 5px 15px 5px
  width: 300px
  background: #D9E2FE
  border-radius: 5px
  box-shadow: 0px 1px 8px -5px #20293a

  &__header
    border-radius: 5px 5px 0 0
    background: #5073f5
    color: #fff
    font-weight: normal
    font-size: 15px
    line-height: 30px
    text-align: center

    display: flex
    justify-content: space-between

    &__item
      display: inline-block
      min-width: 37px
      &__flag
        vertical-align: top
        width: auto
        height: 14px
        margin: 8px
        border-radius: 2px
      // &__remaining_time

  &__body
    padding: 10px
    font-size: 12px

    .room_name
      font-size: 15px
      font-weight: bold
      margin-bottom: 0.5em

      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis

    .room_tags
      margin-bottom: 10px
      overflow: hidden
      height: 24px

    .room_desc
      font-size: 12px
      background: #F9FCFF
      padding: 0em 0.5em
      margin-bottom: 1em

      overflow-y: auto
      word-break: break-word

      height: calc( 1.8em * 4 )
      line-height: 1.8em
      border-radius: 5px

.card.card--need_passwd
  background: #eaeaea

  .card__header
    background: #272727

.card.card--no_vacancy
  background: #E6E6E6

  .card__header
    background: #A3A3A3

  .card__body
    color: #808080
</style>
