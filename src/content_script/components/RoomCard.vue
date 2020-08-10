<template>
  <div class="card">
    <div class="card__header">
      <span>{{ numMembers }}</span>
      <span>{{ createTime }}</span>
      <span>☆</span>
    </div>
    <div class="card__body">
      <h3>{{ roomName }}</h3>

      <button type="button" @click="onOpenTentativeSyncroom">仮入室</button>
      <button type="button" @click="onOpenSyncroom">ルームに入る</button>
    </div>
  </div>
</template>

<script>
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
  methods: {
    onOpenSyncroom() {
      if (this.needPasswd){
        const pwPrompt = window.prompt('ルームパスワードを入力してください', '');

        if (pwPrompt) {
          location.href = this.makeJoinUri(this.roomName, pwPrompt, 4, 2);
        }
      }else{
        location.href = this.makeJoinUri(this.roomName, '', 4, 2);
      }
    },

    onOpenTentativeSyncroom() {
      if (this.needPasswd){
        const pwPrompt = window.prompt('ルームパスワードを入力してください', '');

        if (pwPrompt) {
          location.href = this.makeJoinUri(this.roomName, pwPrompt, 4, 3);
        }
      }else{
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
};
</script>

<style lang="sass" scoped>
.card
  margin: 5px
  width: 275px
  border: solid 2px #000074
  background: #D9E2FE

  &__header
    background: #000074
    color: #fff
    font-weight: normal
    font-size: 16px

  &__body
    padding: 10px
    font-size: 12px
</style>
