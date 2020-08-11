<template lang="pug">
.card(:class="{ 'card--no_vacancy': isNoVacancy, 'card--need_passwd': needPasswd }")
  .card__header
    span.card__header__item {{ numMembers }}
    span.card__header__item.card__header__item--timer {{ remainingTime }}
    span.card__header__item ☆
  .card__body
    h3.room_name {{ roomName }}

    p.room_desc {{ roomDesc }}

    .members
      .members__item(v-for="(member, i) in members", :key="member")
        .members__item__left
          img.members__item__left__icon(:src="iconlist[i].iconurl || getMemberIconLink(iconlist[i].icon)")
        .members__item__right
          .members__item__right__name
            | {{ member }}
          .members__item__right__volumes
            VolumeMeter
      .members__item(v-for="i in (unknownMemberNum)", :key="`unknownMember-${i}`")
        .members__item__left
          img.members__item__left__icon(:src="getMemberIconLink(0)")
        .members__item__right
          .members__item__right__name
            | ?????
          .members__item__right__volumes
            VolumeMeter
      .members__item(v-for="i in (emptyNum)", :key="`empty-${i}`")

    .card__body__buttons--no_vacancy(v-if="isNoVacancy")
      button.card__body__buttons__button(type="button") 満室

    .card__body__buttons(v-else)
      button.card__body__buttons__button.card__body__buttons__button--tentative(type="button" @click="onOpenTentativeSyncroom") 仮入室
      button.card__body__buttons__button(type="button" @click="onOpenSyncroom") ルームに入る
</template>

<script>
import moment from 'moment';
import VolumeMeter from '../components/VolumeMeter';
require('moment-timezone');

export default {
  props: {
    realm: {
      type: Number,
      required: true,
    },
    iconlist: {
      type: Array,
      required: true,
    },
    creatorIcon: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    creatorMid: {
      type: String,
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
    creatorNick: {
      type: String,
      required: true,
    },
    needPasswd: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    VolumeMeter,
  },
  data() {
    return { timer: null, remainingTime: '' };
  },
  methods: {
    getMemberIconLink(i) {
      // FIXME: Firefox対応
      return browser.extension.getURL('/icons/member-icon-' + i + '.png');
    },
    onOpenSyncroom() {
      if (this.needPasswd) {
        const pwPrompt = window.prompt('ルームパスワードを入力してください', '');

        if (pwPrompt) {
          location.href = this.makeJoinUri(this.roomName, pwPrompt, 4, 2);
        }
      } else {
        location.href = this.makeJoinUri(this.roomName, '', 4, 2);
      }
    },

    onOpenTentativeSyncroom() {
      if (this.needPasswd) {
        const pwPrompt = window.prompt('ルームパスワードを入力してください', '');

        if (pwPrompt) {
          location.href = this.makeJoinUri(this.roomName, pwPrompt, 4, 3);
        }
      } else {
        location.href = this.makeJoinUri(this.roomName, '', 4, 3);
      }
    },

    makeJoinUri(room, pass, pid, mode) {
      var urienc = function(str) {
        return encodeURIComponent(str).replace(/[!*'()]/g, function(c) {
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

    updateRemainingTime() {
      const currentTime = moment();
      const endAt = moment(this.createTime).add(6, 'h');
      const remainingTime = endAt.diff(currentTime);

      this.remainingTime = moment.tz(remainingTime, 'UTC').format('hh:mm:ss');
    },
  },

  created() {
    this.timer = setInterval(() => {
      this.updateRemainingTime();
    }, 500);
  },

  computed: {
    isNoVacancy() {
      return this.numMembers === 5;
    },
    unknownMemberNum() {
      return this.numMembers - this.members.length;
    },
    emptyNum() {
      return 5 - this.numMembers;
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
.card
  margin: 5px 5px 15px 5px
  width: 300px
  border: solid 2px #000074
  background: #D9E2FE

  &__header
    background: #000074
    color: #fff
    font-weight: normal
    font-size: 15px
    display: flex
    justify-content: space-between

    &__item
      &--timer
        padding: 0 1em

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

    .members
      margin-bottom: 1em
      background: #fff
      overflow: hidden

      &__item
        display: flex
        justify-content: space-between
        padding: 5px
        border-bottom: solid 2px #9090B0
        height: 47px

        &:last-child
          border-bottom: none

        &__left
          width: 35px
          &__icon
            width: 35px
            height: 35px
        &__right
          margin-left: 5px
          width: calc(100% - 10px)
          &__name

          &__volumes


    &__buttons
      display: flex
      justify-content: space-between

      &__button
        display: inline-block
        width: calc(70% - 5px)
        background: #1300C3
        border: none
        color: #fff
        cursor: pointer
        line-height: 3em
        font-size: 13px

        &:hover
          opacity: 0.7

        &:focus
          outline: none

        &--tentative
          display: inline-block
          width: calc(30% - 5px)
          border: none
          background: #D2D3DD
          color: #3E3E3E

.card.card--need_passwd
  border: solid 2px #272727
  background: #eaeaea

  .card__header
    background: #272727
    &__item
      &--timer

  .card__body
    &__buttons
      &__button
        background: #272727
        &--tentative
          background: #D2D3DD
          color: #3E3E3E
        &:hover

.card.card--no_vacancy
  border: solid 2px #A3A3A3
  background: #E6E6E6

  .card__header
    background: #A3A3A3
    &__item
      &--timer
        background: none

  .card__body
    color: #808080
    &__buttons
      &__button
        display: block
        width: 100%
        background: #818181
        cursor: not-allowed

        &:hover
          opacity: 1
</style>
