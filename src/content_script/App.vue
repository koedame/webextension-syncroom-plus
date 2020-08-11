<template lang="pug">
#SYNCROOM_PLUS-main
  h2.SYNCROOM_PLUS-main__subtitle ルーム一覧

  .SYNCROOM_PLUS-main__rooms
    RoomCard(
      v-for="room in $store.state.rooms.data.rooms",
      :key="room.creator_nick",
      :createTime="room.create_time",
      :creatorIcon="room.creator_icon",
      :creatorMid="room.creator_mid",
      :creatorNick="room.creator_nick",
      :iconlist="room.iconlist",
      :index="room.index",
      :members="room.members",
      :needPasswd="room.need_passwd",
      :numMembers="room.num_members",
      :realm="room.realm",
      :roomDesc="room.room_desc || ''",
      :roomName="room.room_name"
    )
</template>

<script>
import RoomCard from './components/RoomCard';

export default {
  components: {
    RoomCard,
  },
  data() {
    return {};
  },
  async beforeCreate() {
    await this.$store.dispatch('rooms/fetch');
  },
};
</script>

<style lang="sass" scope>
#SYNCROOM_PLUS-main
  background: #F9FBFF !important
  padding: 20px

.SYNCROOM_PLUS-main__subtitle
  font-size: 1em
  font-weight: bold

.SYNCROOM_PLUS-main__rooms
  display: flex
  justify-content: flex-start
  flex-wrap: wrap
</style>
