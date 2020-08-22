<template lang="pug">
.card(:class="{ 'card--no_vacancy': isNoVacancy, 'card--need_passwd': needPasswd }")
  .card__header
    .card__header__item
      RemainingTime(:create-time="createTime")
  .card__body
    h3.room_name {{ roomName }}

    p.room_tags
      b-taglist
        b-tag(v-for="tag in roomTags", :key="tag")
          | {{tag}}

    p.room_desc(:title="roomDesc") {{ roomDesc }}

    Members(:num-members="numMembers", :members="members", :iconlist="iconlist", :room-create-time="createTime")

    div(v-if="isNoVacancy")
      template(v-if="isNotificationVacancyRoom")
        b-button(type="is-link is-light", expanded, @click="onRemoveNotificationVacancyRoom")
          fa(:icon="['fas', 'bell']")
          |
          | 通知を解除
      template(v-else)
        b-button(type="is-link is-light", expanded, @click="onSetNotificationVacancyRoom")
          fa(:icon="['far', 'bell-slash']")
          |
          | 空きが出たら通知を受け取る

    .buttons(v-else)
      b-button(type="is-light" @click="onOpenTentativeSyncroom")
        | 仮入室

      b-button.card__body__buttons__entry-button(v-if="needPasswd", type="is-dark" @click="onOpenSyncroom", icon-left="lock")
        | ルームに入る
      b-button.card__body__buttons__entry-button(v-else, type="is-link" @click="onOpenSyncroom")
        | ルームに入る
</template>

<script>
import RemainingTime from './RemainingTime';
import Members from './Members';
import makeJoinUri from '../../lib/make_join_uri';

export default {
  props: {
    iconlist: {
      type: Array,
      required: true,
    },
    createTime: {
      type: String,
      required: true,
    },
    numMembers: {
      type: Number,
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
  },
  components: {
    RemainingTime,
    Members,
  },
  methods: {
    onSetNotificationVacancyRoom() {
      this.$store.dispatch('notificationVacancyRooms/setNotificationByUID', `${this.createTime}||${this.roomName}`);
    },

    onRemoveNotificationVacancyRoom() {
      this.$store.dispatch('notificationVacancyRooms/removeNotificationByUID', `${this.createTime}||${this.roomName}`);
    },

    onOpenSyncroom() {
      if (this.needPasswd) {
        const pwPrompt = window.prompt('ルームパスワードを入力してください', '');

        if (pwPrompt) {
          location.href = makeJoinUri(this.roomName, pwPrompt, 4, 2);
        }
      } else {
        location.href = makeJoinUri(this.roomName, '', 4, 2);
      }
    },

    onOpenTentativeSyncroom() {
      if (this.needPasswd) {
        const pwPrompt = window.prompt('ルームパスワードを入力してください', '');

        if (pwPrompt) {
          location.href = makeJoinUri(this.roomName, pwPrompt, 4, 3);
        }
      } else {
        location.href = makeJoinUri(this.roomName, '', 4, 3);
      }
    },

    makeJoinUri(room, pass, pid, mode) {
      var urienc = function (str) {
        return encodeURIComponent(str).replace(/[!*'()]/g, function (c) {
          return '%' + c.charCodeAt(0).toString(16);
        });
      };

      var str = 'joingroup?mode=' + urienc(mode) + '&pid=' + urienc(pid) + '&nickname=&groupname=' + urienc(room) + '&password=' + urienc(pass);
      var uri = 'syncroom:';
      var tbl = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      var len = str.length;
      var mod = len % 3;
      if (mod > 0) len -= mod;

      var i, t;
      for (i = 0; i < len; i += 3) {
        t = (str.charCodeAt(i + 0) << 16) | (str.charCodeAt(i + 1) << 8) | str.charCodeAt(i + 2);
        uri += tbl.charAt((t >> 18) & 0x3f);
        uri += tbl.charAt((t >> 12) & 0x3f);
        uri += tbl.charAt((t >> 6) & 0x3f);
        uri += tbl.charAt(t & 0x3f);
      }
      if (mod === 2) {
        t = (str.charCodeAt(i + 0) << 16) | (str.charCodeAt(i + 1) << 8);
        uri += tbl.charAt((t >> 18) & 0x3f);
        uri += tbl.charAt((t >> 12) & 0x3f);
        uri += tbl.charAt((t >> 6) & 0x3f);
        uri += '=';
      } else if (mod === 1) {
        t = str.charCodeAt(i + 0) << 16;
        uri += tbl.charAt((t >> 18) & 0x3f);
        uri += tbl.charAt((t >> 12) & 0x3f);
        uri += '=';
        uri += '=';
      }

      return uri;
    },
  },

  computed: {
    isNoVacancy() {
      return this.numMembers === 5;
    },
    isNotificationVacancyRoom() {
      return this.$store.getters['notificationVacancyRooms/rooms'].find((r) => r.uid === `${this.createTime}||${this.roomName}`);
    },
  },
};
</script>

<style lang="sass" scoped>
.card
  margin: 5px 5px 15px 5px
  width: 300px
  background: #D9E2FE
  border-radius: 5px
  overflow: hidden
  box-shadow: 0px 1px 8px -5px #20293a

  &__header
    background: #5073f5
    color: #fff
    font-weight: normal
    font-size: 15px
    line-height: 30px
    text-align: center

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

      display: -webkit-box
      overflow: hidden
      -webkit-line-clamp: 3
      -webkit-box-orient: vertical

      height: calc( 1.8em * 3 )
      line-height: 1.8em
      border-radius: 5px

    &__buttons
      &__entry-button
        width: 185px

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
