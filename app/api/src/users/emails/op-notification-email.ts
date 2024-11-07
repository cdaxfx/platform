import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from '../../model/base-email';

interface OPNotificationEmailContext {
    transactionData: any;
    keys: any[];
}

let logoImage: string;
if(process.env.NODE_ENV === 'development') {
    logoImage = readFileSync(join(__dirname, 'templates/emails/operations/openpayd/logo.gif')).toString('base64');
}
else {
    logoImage = readFileSync(join(__dirname, '../../templates/emails/operations/openpayd/logo.gif')).toString('base64');
}

export default class OPNotificationEmail extends BaseEmail<OPNotificationEmailContext> {
    constructor(context: OPNotificationEmailContext) {
        super(
            'backoffice@cdax.forex',
            'CDAX Forex <noreply@cdax.forex>',
            'OpenPayd Transaction',
            'emails/operations/openpayd/notification',
            context,
            undefined,
            undefined
        );
    }

    getAttachments(): AttachmentJSON[] {
        return [
            {
                filename: 'logo.png',
                type: 'image/png',
                content_id: 'logo',
                content: logoImage,
                disposition: 'inline'
            }
        ];
    }
}
