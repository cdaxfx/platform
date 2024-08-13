import { Migration } from '@mikro-orm/migrations';

export class Migration20240813023742 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `client_metadata_temp` (`uuid` text not null, `created_at` datetime not null default current_timestamp, `updated_at` datetime not null default current_timestamp, `deleted_at` datetime null, `session` text not null, `detail` json not null, `client_id` text not null, primary key (`uuid`));');
  }

}
