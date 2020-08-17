<template lang="pug">
.card(:class="{ 'card--no_vacancy': isNoVacancy, 'card--need_passwd': needPasswd }")
  .card__header
    span.card__header__item
    span.card__header__item.card__header__item--timer
      RemainingTime(:create-time="createTime")
    span.card__header__item
  .card__body
    h3.room_name {{ roomName }}

    p.room_tags
      span.room_tags__item(v-for="tag in roomTags", :key="tag")
        | {{tag}}

    p.room_desc(:title="roomDesc") {{ roomDesc }}

    .members(:style="`background-image: url(${backgroundLogoLink})`")
      .members__item(v-for="(member, i) in members", :key="`${member}-${i}`")
        .members__item__left
          img.members__item__left__icon(
            v-if="iconlist && iconlist[i] && (iconlist[i].iconurl || iconlist[i].icon)",
            :src="iconlist[i].iconurl.replace('http:', 'https:') || memberIconLinks[iconlist[i].icon]"
          )
          .members__item__left__icon(v-else)
        .members__item__right
          .members__item__right__name(:class="{'members__item__right__name--favorite': $store.state.favoriteMembers.members.some(m => m.memberName === member)}")
            //- FIXME: メンバー名が長いとお気に入りボタンが表示されないのでスタイルを修正する
            | {{ member }}
            button.members__item__right__name__add-favorite(type="button", @click="$store.dispatch('favoriteMembers/toggleFavorite', member)")
              template(v-if="$store.state.favoriteMembers.members.some(m => m.memberName === member)")
                fa(:icon="['fas', 'star']")
              template(v-else)
                fa(:icon="['far', 'star']")
          .members__item__right__volumes
            VolumeMeter
      .members__item(v-for="i in (unknownMemberNum)", :key="`unknownMember-${i}`")
        .members__item__left
          .members__item__left__icon.members__item__left__icon--unknown
        .members__item__right
          .members__item__right__name
            | ?????
          .members__item__right__volumes
            VolumeMeter
      .members__item(v-for="i in (emptyNum)", :key="`empty-${i}`")

    .card__body__buttons--no_vacancy(v-if="isNoVacancy")
      template(v-if="isNotificationVacancyRoom")
        button.card__body__buttons__button(type="button", @click="onRemoveNotificationVacancyRoom")
          fa(:icon="['fas', 'bell-slash']")
          |
          | 通知を解除
      template(v-else)
        button.card__body__buttons__button(type="button", @click="onSetNotificationVacancyRoom")
          fa(:icon="['fas', 'bell']")
          |
          | 空きが出たら通知を受け取る

    .card__body__buttons(v-else)
      button.card__body__buttons__button.card__body__buttons__button--tentative(type="button" @click="onOpenTentativeSyncroom")
        | 仮入室
      button.card__body__buttons__button(type="button" @click="onOpenSyncroom")
        fa.card__body__buttons__button__icon(icon="lock", v-if="needPasswd")
        | ルームに入る
</template>

<script>
import VolumeMeter from './VolumeMeter';
import RemainingTime from './RemainingTime';

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
    VolumeMeter,
    RemainingTime,
  },
  data() {
    return {
      timer: null,
      endAt: null,
      memberIconLinks: [
        browser.extension.getURL('/icons/member-icon-0.png'),
        browser.extension.getURL('/icons/member-icon-1.png'),
        browser.extension.getURL('/icons/member-icon-2.png'),
        browser.extension.getURL('/icons/member-icon-3.png'),
        browser.extension.getURL('/icons/member-icon-4.png'),
        browser.extension.getURL('/icons/member-icon-5.png'),
        browser.extension.getURL('/icons/member-icon-6.png'),
        browser.extension.getURL('/icons/member-icon-7.png'),
        browser.extension.getURL('/icons/member-icon-8.png'),
        browser.extension.getURL('/icons/member-icon-9.png'),
        browser.extension.getURL('/icons/member-icon-10.png'),
        browser.extension.getURL('/icons/member-icon-11.png'),
        browser.extension.getURL('/icons/member-icon-12.png'),
        browser.extension.getURL('/icons/member-icon-13.png'),
      ],
      backgroundLogoLink: browser.extension.getURL('/icons/icon-background-logo.png'),
      iconLockLink: browser.extension.getURL('/icons/icon-lock.png'),
    };
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
  },

  computed: {
    isNoVacancy() {
      return this.numMembers === 5;
    },
    isNotificationVacancyRoom() {
      return this.$store.getters['notificationVacancyRooms/rooms'].find(r => r.uid === `${this.createTime}||${this.roomName}`);
    },
    unknownMemberNum() {
      return this.numMembers - this.members.length;
    },
    emptyNum() {
      return 5 - this.numMembers;
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

    .room_tags
      margin-bottom: 10px
      overflow: hidden
      height: 22px
      &__item
        background: #ccc
        padding: 0px 6px
        display: inline-block
        font-size: 11px
        border-radius: 3px
        margin-right: 5px

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

    .members
      margin-bottom: 1em
      background: #F9FCFF
      background-color: #F9FCFF
      background-repeat: no-repeat
      background-size: contain
      overflow: hidden
      border-radius: 5px

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
            border-radius: 4px
            background: #888

        &__right
          width: 230px
          height: 35px
          &__name
            height: 24px
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            &--favorite
              background: #ffff80

            &__add-favorite
              float: right
              border: none
              outline: none
              cursor: pointer

          &__volumes
            border-radius: 2px
            overflow: hidden

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
        border-radius: 5px

        &:hover
          opacity: 0.7

        &:focus
          outline: none

        &__icon
          margin-right: 0.5em

        &--tentative
          display: inline-block
          width: calc(30% - 5px)
          border: none
          background: #D2D3DD
          color: #3E3E3E

.card.card--need_passwd
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

        &:hover
          opacity: 1
</style>
