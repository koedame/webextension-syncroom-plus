<template lang="pug">
.members
  .members__item(v-for="(member, i) in members", :key="`${member.name}-${i}`")
    .members__item__left
      img.members__item__left__icon(:src="member.icon_url")
    .members__item__right
      .members__item__right__name(:class="{'members__item__right__name--favorite': $store.getters['favoriteMembers/members'].some(m => m.memberName === member.name)}")
        template(v-if="member.entry_type === 'tempolary'")
          | [ {{translate("temporary_entry")}} ]

        template(v-else-if="member.entry_type === 'hidden'")
          | [ {{translate("hidden_entry")}} ]

        template(v-else)
          span.members__item__right__name__text
            span(v-html="memberHTML(member.name)")

          b-tooltip(:label='translate("receive_notification_when_online_this_user")', position="is-top", type="is-light")
            a.members__item__right__name__add-notification(@click="$store.dispatch('notificationOnlineMembers/toggle', {memberName: member.name, roomCreateTime})")
              template(v-if="$store.getters['notificationOnlineMembers/members'].some(m => m.memberName === member.name)")
                b-icon.members__item__right__name__add-notification__on(icon='bell')
              template(v-else)
                b-icon(icon='bell-slash')

          b-tooltip(:label='translate("color_it_to_make_it_easier_to_find")', position="is-top", type="is-light")
            a.members__item__right__name__add-favorite(@click="$store.dispatch('favoriteMembers/toggleFavorite', member.name)")
              template(v-if="$store.getters['favoriteMembers/members'].some(m => m.memberName === member.name)")
                b-icon.members__item__right__name__add-favorite__on(icon='star')
              template(v-else)
                b-icon(icon='star')

      .members__item__right__volumes
        VolumeMeter(:volume-mater-url="member.volume_mater_url")

  .members__item(v-for="i in (emptyNum)", :key="`empty-${i}`")
</template>

<script lang="ts">
import VolumeMeter from './VolumeMeter';
import { translate } from '../../lib/i18n';
import { defineComponent, computed } from '@vue/composition-api';
// @ts-ignore
import twemoji from 'twemoji';

type Props = {
  members: any;
  roomCreateTime: string;
};

export default defineComponent({
  components: {
    VolumeMeter,
  },

  props: {
    members: {
      type: Array,
      required: true,
    },
    roomCreateTime: {
      type: String,
      required: true,
    },
  },

  setup(props: Props) {
    const emptyNum = computed(() => {
      return 5 - props.members.length;
    });

    const memberHTML = (text: string) => {
      const linkedText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/((@|＠)[0-9a-zA-Z_]{1,15})/g, (twitterID) => {
          const noAtTwitterID = twitterID.replace(/@|＠/g, '');
          return `<a href='https://twitter.com/${noAtTwitterID}' target='_blank' rel='noopener noreferrer'>${twitterID}</a>`;
        });
      const result = twemoji.parse(linkedText);
      return result;
    };

    return {
      translate,
      emptyNum,
      memberHTML,
    };
  },
});
</script>

<style lang="sass" scoped>
.members
  margin-bottom: 1em
  background: #F9FCFF
  background-color: #F9FCFF
  background-repeat: no-repeat
  background-size: contain
  border-radius: 5px
  background-image: url("https://syncroomplus.koeda.me/images/background-logo.png")

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
