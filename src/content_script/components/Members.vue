<template lang="pug">
.members(:style="`background-image: url(${backgroundLogoLink})`")
  .members__item(v-for="(member, i) in members2", :key="`${member.memberName}-${i}`")
    .members__item__left
      img.members__item__left__icon(:src="member.icon")
    .members__item__right
      .members__item__right__name(:class="{'members__item__right__name--favorite': $store.getters['favoriteMembers/members'].some(m => m.memberName === member.memberName)}")
        template(v-if="member.memberName.length === 0")
          | [ {{translate("temporary_entry")}} ]

        template(v-else)
          span.members__item__right__name__text
            span(v-html="twitterIdToLink(member.memberName)")

          b-tooltip(:label='translate("receive_notification_when_online_this_user")', position="is-top", type="is-light")
            a.members__item__right__name__add-notification(@click="$store.dispatch('notificationOnlineMembers/toggle', {memberName: member.memberName, roomCreateTime})")
              template(v-if="$store.getters['notificationOnlineMembers/members'].some(m => m.memberName === member.memberName)")
                b-icon.members__item__right__name__add-notification__on(icon='bell')
              template(v-else)
                b-icon(icon='bell-slash')

          b-tooltip(:label='translate("color_it_to_make_it_easier_to_find")', position="is-top", type="is-light")
            a.members__item__right__name__add-favorite(@click="$store.dispatch('favoriteMembers/toggleFavorite', member.memberName)")
              template(v-if="$store.getters['favoriteMembers/members'].some(m => m.memberName === member.memberName)")
                b-icon.members__item__right__name__add-favorite__on(icon='star')
              template(v-else)
                b-icon(icon='star')

      .members__item__right__volumes
        VolumeMeter

  .members__item(v-for="i in (unknownMemberNum)", :key="`unknownMember-${i}`")
    .members__item__left
      template(v-if="members2.length === 0")
        img.members__item__left__icon(v-if="isEvent", :src="eventIcons[i%eventIcons.length]")
      template(v-else)
        img.members__item__left__icon(v-if="isEvent", :src="eventIcons[(members2[0].memberName.length+i)%eventIcons.length]")
        img.members__item__left__icon(v-else, :src="unknownMemberIconLink")
    .members__item__right
      .members__item__right__name
        | [ {{translate("hidden_entry")}} ]
      .members__item__right__volumes
        VolumeMeter
  .members__item(v-for="i in (emptyNum)", :key="`empty-${i}`")
</template>

<script lang="ts">
import VolumeMeter from './VolumeMeter';
import { translate } from '../../lib/i18n';
import { defineComponent, computed } from '@vue/composition-api';
import { browser } from 'webextension-polyfill-ts';

const moment = require('moment');

// FIXME: APIのレスポンス的に型宣言が難しいので独自APIにすることを検討する
type Props = {
  iconlist: any;
  numMembers: number;
  members: any;
  roomCreateTime: string;
};

export default defineComponent({
  components: {
    VolumeMeter,
  },

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

  setup(props: Props) {
    const memberIconLinks = [
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
    ];

    let isEvent = false
    let eventIcons: string[] = []
    const currentYear = moment().year()

    if (moment().isBetween(`${currentYear}-04-01`, `${currentYear}-04-02`)){
      // エイプリルフール
      isEvent = true
      eventIcons = [
        browser.extension.getURL('/icons/aprilfool/0.png'),
        browser.extension.getURL('/icons/aprilfool/1.png'),
        browser.extension.getURL('/icons/aprilfool/2.png'),
        browser.extension.getURL('/icons/aprilfool/3.png'),
        browser.extension.getURL('/icons/aprilfool/4.png'),
        browser.extension.getURL('/icons/aprilfool/5.png'),
        browser.extension.getURL('/icons/aprilfool/6.png'),
        browser.extension.getURL('/icons/aprilfool/7.png'),
        browser.extension.getURL('/icons/aprilfool/8.png'),
      ];
    } else if (moment().isBetween(`${currentYear}-10-20`, `${currentYear}-11-02`)){
      // ハロウィーン
      isEvent = true
      eventIcons = [
        browser.extension.getURL('/icons/halloween/0.png'),
        browser.extension.getURL('/icons/halloween/1.png'),
        browser.extension.getURL('/icons/halloween/2.png'),
        browser.extension.getURL('/icons/halloween/3.png'),
        browser.extension.getURL('/icons/halloween/4.png'),
        browser.extension.getURL('/icons/halloween/5.png'),
        browser.extension.getURL('/icons/halloween/6.png'),
        browser.extension.getURL('/icons/halloween/7.png'),
        browser.extension.getURL('/icons/halloween/8.png'),
        browser.extension.getURL('/icons/halloween/9.png'),
        browser.extension.getURL('/icons/halloween/10.png'),
        browser.extension.getURL('/icons/halloween/11.png'),
        browser.extension.getURL('/icons/halloween/12.png'),
        browser.extension.getURL('/icons/halloween/13.png'),
      ];
    }

    const unknownMemberIconLink = browser.extension.getURL('/icons/member-icon-unknown.png');
    const backgroundLogoLink = browser.extension.getURL('/icons/icon-background-logo.png');

    const members2 = computed(() => {
      const d = [];
      for (const i in props.members) {
        let icon;
        if (props.members[i].length === 0) {
          icon = unknownMemberIconLink;
        } else if (typeof props.iconlist[i] === 'undefined') {
          icon = unknownMemberIconLink;
        } else if (props.iconlist[i].iconurl.length === 0) {
          icon = memberIconLinks[props.iconlist[i].icon];
        } else {
          icon = props.iconlist[i].iconurl.replace('http://', 'https://');
        }

        d.push({
          memberName: props.members[i],
          icon: icon,
        });
      }
      return d;
    });

    const unknownMemberNum = computed(() => {
      return props.numMembers - props.members.length;
    });

    const emptyNum = computed(() => {
      return 5 - props.numMembers;
    });

    const twitterIdToLink = (text: string) => {
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
    };

    return {
      translate,
      memberIconLinks,
      isEvent,
      eventIcons,
      unknownMemberIconLink,
      backgroundLogoLink,
      members2,
      unknownMemberNum,
      emptyNum,
      twitterIdToLink,
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
