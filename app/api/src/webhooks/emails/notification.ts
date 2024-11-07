import { readFileSync } from 'fs';
import { join } from 'path';
import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import BaseEmail from '../../model/base-email';

interface NotificationEmailContext {
    reference: string;
    event: string;
    createdAt: string;
}

let logoImage: string;
if(process.env.NODE_ENV === 'development') {
    logoImage = readFileSync(join(__dirname, 'templates/emails/operations/webhooks/logo.png')).toString('base64');
}
else {
    logoImage = readFileSync(join(__dirname, '../../templates/emails/operations/webhooks/logo.png')).toString('base64');
}

export default class NotificationEmail extends BaseEmail<NotificationEmailContext> {
    constructor(to, context: NotificationEmailContext) {
        super(
            to,
            'CDAX Forex <noreply@cdax.forex>',
            'Shufti Pro Notification',
            'emails/operations/webhooks/notification',
            context
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
