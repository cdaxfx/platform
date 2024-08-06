import { join } from 'path';
import { defineConfig } from '@mikro-orm/sqlite';
import {
    BENEFICIARIES_REGISTERED_ENTITIES,
    BankMetadata,
    Broker,
    BusinessMetadata,
    DOCUMENTS_MANAGER_REGISTERED_ENTITIES,
    Director,
    FEES_REGISTERED_ENTITIES,
    IndividualMetadata,
    RiskAssessment,
    Shareholder,
    USER_REGISTERED_ENTITIES,
    TRANSACTION_REGISTERED_ENTITIES,
    USER_CLIENTS_REGISTERED_ENTITIES,
    CLIENTS_METADATA_TEMP_ENTITIES,
    CLIENTS_REGISTERED_ENTITIES,
    MAIL_CONTACT_REGISTERED_ENTITIES
} from '@cdaxfx/tools-models';
import { MobileVerificationEntity } from './src/auth/model/mobile-verification.entity';
import { Session } from './src/sessions/model/session.entity';

import * as dotenv from 'dotenv';

dotenv.config({ path: './.env.dev' });

const rootdir = join(__dirname, '../../../');
const databaseFilePath = join(rootdir, process.env.DATABASE_URL as string);

export default defineConfig({
    logger: console.log.bind(console),
    debug: true,
    forceUtcTimezone: true,
    migrations: {
        snapshot: true,
    },
    entities: [
        ...USER_REGISTERED_ENTITIES,
        ...BENEFICIARIES_REGISTERED_ENTITIES,
        ...DOCUMENTS_MANAGER_REGISTERED_ENTITIES,
        ...FEES_REGISTERED_ENTITIES,
        ...TRANSACTION_REGISTERED_ENTITIES,
        ...CLIENTS_REGISTERED_ENTITIES,
        ...USER_CLIENTS_REGISTERED_ENTITIES,
        ...MAIL_CONTACT_REGISTERED_ENTITIES,
        ...CLIENTS_METADATA_TEMP_ENTITIES,
        BankMetadata,
        IndividualMetadata,
        BusinessMetadata,
        Broker,
        RiskAssessment,
        Director,
        Shareholder,
        // TODO: migrate
        MobileVerificationEntity,
        Session
    ],
    dbName: databaseFilePath,
    driverOptions: {
        connection: {
            // ssl: {
            //   ca: fs.readFileSync('./rds-us-east-1-bundle.pem'),
            // },
        }
    },
    allowGlobalContext: true
});