<template lang="pug">
#SYNCROOM_PLUS-wrapper
  Navbar

  #SYNCROOM_PLUS-main

    .level
      .level-left
      .level-right
        b-button(icon-left="cog", type="is-warning is-light", @click="openConfig")
          | 設定

    h2.SYNCROOM_PLUS-main__subtitle 公開ルーム一覧

    .filter-form
      .filter-form__field.custom--search-field
        b-input(
          placeholder='キーワードを入力',
          v-model='keyword',
          type='search',
          icon="search",
        )

      .filter-form__field
        b-field
          b-radio-button(v-model='roomFilter', native-value='all', type='is-info')
            | すべて ({{ rooms.length }})
          b-radio-button(v-model='roomFilter', native-value='only_unlocked', type='is-link')
            b-icon(icon='lock-open')
            | 鍵なし ({{ unlockedRoomCount }})
          b-radio-button(v-model='roomFilter', native-value='only_locked', type='is-dark')
            b-icon(icon='lock')
            | 鍵あり ({{ lockedRoomCount }})

      .filter-form__field
        b-button(type="is-info", tag="a", href="#testroom", icon-left="headphones-alt")
          | 接続テストルームはこちら

    .SYNCROOM_PLUS-main__rooms
      RoomCard(
        v-for="room in filteredRooms",
        :key="`room-${room.creator_mid}`",
        :createTime="room.create_time",
        :iconlist="room.iconlist || []",
        :members="room.members",
        :needPasswd="room.need_passwd",
        :numMembers="room.num_members",
        :roomDesc="room.room_desc || ''",
        :roomName="room.room_name"
        :roomTags="room.room_tags || []"
      )

      template(v-if="filteredRooms.length === 0")
        template(v-if="keyword.length === 0")
          b-message(type="is-warning")
            | ルームがありません 😔
        template(v-else)
          b-message(type="is-warning")
            | ルームが見つかりませんでした 😔

    hr

    h2#testroom.SYNCROOM_PLUS-main__subtitle 接続テストルーム

    .SYNCROOM_PLUS-main__rooms
      RoomCard(
        v-if="testRoom",
        :createTime="testRoom.create_time",
        :iconlist="testRoom.iconlist || []",
        :members="testRoom.members",
        :needPasswd="testRoom.need_passwd",
        :numMembers="testRoom.num_members",
        roomDesc="SYNCROOMの公式テストルームです。入室すると、音声が3秒後に返ってきますので、通信の確認をすることができます。",
        :roomName="testRoom.room_name"
        :roomTags="testRoom.room_tags || []"
      )

  Footer
</template>

<script>
import axios from 'axios';
import RoomCard from './components/RoomCard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Config from './components/Config';

export default {
  components: {
    RoomCard,
    Navbar,
    Footer,
  },
  data() {
    return {
      rooms: [],
      testRoom: null,
      roomFilter: 'all',
      keyword: '',
      unlockedRoomCount: 0,
      lockedRoomCount: 0,
    };
  },

  mounted() {
    this.$store.dispatch('clock/fetch');
    this.fetchRooms();
    this.timer = setInterval(() => {
      this.$store.dispatch('clock/fetch');
      this.fetchRooms();
    }, 1000);
  },

  methods: {
    openConfig() {
      this.$buefy.modal.open({
        parent: this,
        component: Config,
        hasModalCard: true,
      });
    },
    fetchRooms() {
      axios.get('https://webapi.syncroom.appservice.yamaha.com/ndroom/room_list.json?pagesize=500&realm=4').then((res) => {
        this.rooms = res.data.rooms.filter((room) => room.room_name !== '接続テストルーム');
        // タグを復号
        for (let i = 0; i < this.rooms.length; i++) {
          this.rooms[i].room_tags = this.tagConvert(this.rooms[i]);
        }

        this.lockedRoomCount = this.rooms.filter((room) => room.need_passwd).length;
        this.unlockedRoomCount = this.rooms.filter((room) => !room.need_passwd).length;

        this.testRoom = res.data.rooms.find((room) => room.room_name === '接続テストルーム');
      });
    },
    tagConvert(room) {
      var m;
      var i;
      var result = [];

      const tags = [
        '練習中',
        'おしゃべり',
        '初心者OK',
        '配信中',
        '録音中',
        'Classic',
        'Country / Folk',
        'Club Music / EDM',
        'Hip Hop / Rap',
        'R&B / Soul',
        'Jazz',
        'Fusion',
        'Rock',
        'HR / HM',
        '洋楽',
        'J-Pop',
        'アイドル',
        'アニメ・ゲーム・ボカロ',
        'World',
      ];

      if (room.tag_orig) {
        result.push(room.tag_orig);
      }

      if (room.tag_mask) {
        m = (room.tag_mask ^ 0xffffffff) >>> 0;
        for (i = 0; i < tags.length; i++) {
          var tm = Math.pow(2, i);
          if (((m ^ 0xffffffff) & tm) === tm) {
            result.push(tags[i]);
          }
        }
      }

      return result;
    },
    convertSearchKeyword(keyword) {
      let result = keyword;

      // 記号を削除
      /* eslint-disable no-useless-escape */
      result = result.replace(/[\~\!\@\#\$\%\^\&\*\(\)\_\+\`\-\=\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?\']/g, '');

      // 英数字をすべて半角に統一
      result = result.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
      });

      // ひらがなをカタカナに統一
      result = result.replace(/[\u3041-\u3096]/g, (ch) => {
        return String.fromCharCode(ch.charCodeAt(0) + 0x60);
      });

      // 半角カタカナを全角に統一
      const kanaMap = {
        ｶﾞ: 'ガ',
        ｷﾞ: 'ギ',
        ｸﾞ: 'グ',
        ｹﾞ: 'ゲ',
        ｺﾞ: 'ゴ',
        ｻﾞ: 'ザ',
        ｼﾞ: 'ジ',
        ｽﾞ: 'ズ',
        ｾﾞ: 'ゼ',
        ｿﾞ: 'ゾ',
        ﾀﾞ: 'ダ',
        ﾁﾞ: 'ヂ',
        ﾂﾞ: 'ヅ',
        ﾃﾞ: 'デ',
        ﾄﾞ: 'ド',
        ﾊﾞ: 'バ',
        ﾋﾞ: 'ビ',
        ﾌﾞ: 'ブ',
        ﾍﾞ: 'ベ',
        ﾎﾞ: 'ボ',
        ﾊﾟ: 'パ',
        ﾋﾟ: 'ピ',
        ﾌﾟ: 'プ',
        ﾍﾟ: 'ペ',
        ﾎﾟ: 'ポ',
        ｳﾞ: 'ヴ',
        ﾜﾞ: 'ヷ',
        ｦﾞ: 'ヺ',
        ｱ: 'ア',
        ｲ: 'イ',
        ｳ: 'ウ',
        ｴ: 'エ',
        ｵ: 'オ',
        ｶ: 'カ',
        ｷ: 'キ',
        ｸ: 'ク',
        ｹ: 'ケ',
        ｺ: 'コ',
        ｻ: 'サ',
        ｼ: 'シ',
        ｽ: 'ス',
        ｾ: 'セ',
        ｿ: 'ソ',
        ﾀ: 'タ',
        ﾁ: 'チ',
        ﾂ: 'ツ',
        ﾃ: 'テ',
        ﾄ: 'ト',
        ﾅ: 'ナ',
        ﾆ: 'ニ',
        ﾇ: 'ヌ',
        ﾈ: 'ネ',
        ﾉ: 'ノ',
        ﾊ: 'ハ',
        ﾋ: 'ヒ',
        ﾌ: 'フ',
        ﾍ: 'ヘ',
        ﾎ: 'ホ',
        ﾏ: 'マ',
        ﾐ: 'ミ',
        ﾑ: 'ム',
        ﾒ: 'メ',
        ﾓ: 'モ',
        ﾔ: 'ヤ',
        ﾕ: 'ユ',
        ﾖ: 'ヨ',
        ﾗ: 'ラ',
        ﾘ: 'リ',
        ﾙ: 'ル',
        ﾚ: 'レ',
        ﾛ: 'ロ',
        ﾜ: 'ワ',
        ｦ: 'ヲ',
        ﾝ: 'ン',
        ｧ: 'ァ',
        ｨ: 'ィ',
        ｩ: 'ゥ',
        ｪ: 'ェ',
        ｫ: 'ォ',
        ｯ: 'ッ',
        ｬ: 'ャ',
        ｭ: 'ュ',
        ｮ: 'ョ',
        '｡': '。',
        '､': '、',
        ｰ: 'ー',
        '｢': '「',
        '｣': '」',
        '･': '・',
      };

      const reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
      result = result
        .replace(reg, (match) => {
          return kanaMap[match];
        })
        .replace(/ﾞ/g, '゛')
        .replace(/ﾟ/g, '゜');

      // アルファベットをすべて小文字に統一
      result = result.toLowerCase();
      return result;
    },
  },

  computed: {
    filteredRooms() {
      let displayRooms = this.rooms;

      // すべて/鍵あり/鍵なし
      if (this.roomFilter === 'all') {
      } else if (this.roomFilter === 'only_unlocked') {
        displayRooms = displayRooms.filter((room) => !room.need_passwd);
      } else if (this.roomFilter === 'only_locked') {
        displayRooms = displayRooms.filter((room) => room.need_passwd);
      }

      if (this.keyword.length !== 0) {
        const keyword = this.convertSearchKeyword(this.keyword);

        displayRooms = displayRooms.filter((room) => {
          return this.convertSearchKeyword(`${room.room_name}|${room.members.join('|')}|${room.room_tags.join('|')}|${room.room_desc}`).match(keyword);
        });
      }

      return displayRooms;
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

// // Set your colors
// $primary: #8c67ef;
// $primary-invert: findColorInvert($primary);
// $twitter: #4099FF;
// $twitter-invert: findColorInvert($twitter);

// // Setup $colors to use as bulma classes (e.g. 'is-twitter')
// $colors: (
//     "white": ($white, $black),
//     "black": ($black, $white),
//     "light": ($light, $light-invert),
//     "dark": ($dark, $dark-invert),
//     "primary": ($primary, $primary-invert),
//     "info": ($info, $info-invert),
//     "success": ($success, $success-invert),
//     "warning": ($warning, $warning-invert),
//     "danger": ($danger, $danger-invert),
//     "twitter": ($twitter, $twitter-invert)
// );

// // Links
// $link: $primary;
// $link-invert: $primary-invert;
// $link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma"
@import "~buefy/src/scss/buefy"

#SYNCROOM_PLUS-main
  background: #F9FBFF !important
  overflow: hidden

.SYNCROOM_PLUS-main__subtitle
  font-size: 20px
  font-weight: bold
  text-align: center
  margin: 0 0 1em 0

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
</style>
