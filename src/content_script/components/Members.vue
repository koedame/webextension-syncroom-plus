<template lang="pug">
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
        span.members__item__right__name__text
          template(v-if="member.length === 0")
            | [仮入室]
          template(v-else)
            span(v-html="twitterIdToLink(member)")
        b-tooltip(label='オンライン時に通知を受け取れます', position="is-top", type="is-light")
          a.members__item__right__name__add-notification(@click="$store.dispatch('notificationOnlineMembers/toggle', {memberName: member, roomCreateTime})")
            template(v-if="$store.state.notificationOnlineMembers.members.some(m => m.memberName === member)")
              b-icon.members__item__right__name__add-notification__on(icon='bell')
            template(v-else)
              b-icon(icon='bell-slash')
        b-tooltip(label='見つけやすいように表示を目立たせます', position="is-top", type="is-light")
          a.members__item__right__name__add-favorite(@click="$store.dispatch('favoriteMembers/toggleFavorite', member)")
            template(v-if="$store.state.favoriteMembers.members.some(m => m.memberName === member)")
              b-icon.members__item__right__name__add-favorite__on(icon='star')
            template(v-else)
              b-icon(icon='star')
      .members__item__right__volumes
        VolumeMeter
  .members__item(v-for="i in (unknownMemberNum)", :key="`unknownMember-${i}`")
    .members__item__left
      .members__item__left__icon.members__item__left__icon--unknown
    .members__item__right
      .members__item__right__name
        | [非公開入室]
      .members__item__right__volumes
        VolumeMeter
  .members__item(v-for="i in (emptyNum)", :key="`empty-${i}`")
</template>

<script>
import VolumeMeter from './VolumeMeter';
const browser = require('webextension-polyfill');

export default {
  props: {
    iconlist: {
      type: Array,
      required: true,
    },
    numMembers: {
      type: Number,
      required: true,
    },
    members: {
      type: Array,
      required: true,
    },
    roomCreateTime: {
      type: String,
      required: true,
    },
  },
  components: {
    VolumeMeter,
  },
  data() {
    return {
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
    };
  },

  methods: {
    twitterIdToLink(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/((@|＠)[0-9a-zA-Z_]{1,15})/g, (twitterID) => {
          const noAtTwitterID = twitterID.replace(/@|＠/g, '');
          return `<a href='https://twitter.com/${noAtTwitterID}' target='_blank' rel='noopener noreferrer'>${twitterID}</a>`;
        });
    },
  },
  computed: {
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
.members
  margin-bottom: 1em
  background: #F9FCFF
  background-color: #F9FCFF
  background-repeat: no-repeat
  background-size: contain
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
        &__text
          display: inline-block
          width: 175px
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          line-height: 22px
        &--favorite
          background: #ffff80

        &__add-favorite
          border: none
          outline: none
          cursor: pointer
          display: inline-block
          vertical-align: super
          color: #949494

          &__on
            color: #ffa90a

        &__add-notification
          border: none
          outline: none
          cursor: pointer
          display: inline-block
          vertical-align: super
          color: #949494

          &__on
            color: #ffa90a

      &__volumes
        border-radius: 2px
        overflow: hidden
</style>
