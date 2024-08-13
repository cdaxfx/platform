import { Migration } from '@mikro-orm/migrations';

export class Migration20240813023805 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "client_metadata_temp" ("uuid" varchar(36) not null, "created_at" timestamptz not null default current_timestamp, "updated_at" timestamptz not null default current_timestamp, "deleted_at" timestamptz null, "session" varchar(255) not null, "detail" jsonb not null, "client_id" varchar(255) not null, constraint "client_metadata_temp_pkey" primary key ("uuid"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "client_metadata_temp" cascade;');
  }

}
