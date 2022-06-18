export namespace SYNCROOMPlus {
  export type MemberType = {
    name: string;
    user_id: string;
    nsgm_member_id: string;
    entry_type: 'public' | 'temporary' | 'hidden';
    is_owner: boolean;
    icon_url: string;
    volume_mater_url: string;
  };

  export type TagType = string;

  export type RoomType = {
    srp_id: string;
    created_at: string;
    creator_mid: string;
    creator_name: string;
    description: string;
    end_at: string;
    is_password_required: boolean;
    members: MemberType[];
    members_count: number;
    name: string;
    national_flag_url: string;
    realm: 4;
    remaining_time: string;
    tags: TagType[];
  };

  export type AggregatedTagType = {
    count: number;
    name: string;
  };

  export type ServiceNotificationType = {
    title: string;
    description: string;
    start_at: string;
    end_at: string;
    notification_type: 'info' | 'success' | 'warning' | 'danger';
    closable: boolean;
    has_icon: boolean;
  };

  export type AdType = {
    uuid: string;
    image_src: string;
    link: string;
    start_at: string;
    end_at: string;
    name: string;
    version: number;
  };

  export type RoomAllResponseType = {
    public_room_count: number;
    private_room_count: null;
    public_locked_rooms_count: number;
    public_opend_rooms_count: number;
    aggregated_tags: AggregatedTagType[];
    locked_aggregated_tags: AggregatedTagType[];
    opend_aggregated_tags: AggregatedTagType[];
    test_room: RoomType;
    rooms: RoomType[];
    updated_at: string;
  };
}
