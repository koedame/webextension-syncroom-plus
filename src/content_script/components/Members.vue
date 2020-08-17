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
</template>

<script>
import VolumeMeter from './VolumeMeter';

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
        &__text
          display: inline-block
          width: 200px
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
</style>
