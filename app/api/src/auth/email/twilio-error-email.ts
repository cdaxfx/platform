import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from '../../model/base-email';

interface EmailContext {
    title: string;
    message: string;
}

let heroImage: string, icon1Image: string;
if(process.env.NODE_ENV === 'development') {
    heroImage = readFileSync(join(__dirname, 'templates/emails/alert/twilio/hero.gif')).toString('base64');
    icon1Image = readFileSync(join(__dirname, 'templates/emails/registration/welcome/icon-1.gif')).toString('base64');
}
else {
    heroImage = readFileSync(join(__dirname, '../../templates/emails/alert/twilio/hero.gif')).toString('base64');
    icon1Image = readFileSync(join(__dirname, '../../templates/emails/registration/welcome/icon-1.gif')).toString('base64');
}

export default class TwilioErrorEmail extends BaseEmail<EmailContext> {
    constructor(to: string, context: EmailContext) {
        super(
            to,
            'CDAX Forex <noreply@cdax.forex>',
            context.title,
            'emails/alert/twilio/twilio',
            context,
            undefined,
            'backoffice@cdax.forex'
        );
    }

    getAttachments(): AttachmentJSON[] {
        return [
            {
                filename: 'hero.gif',
                type: 'image/gif',
                content_id: 'hero',
                content: heroImage,
                disposition: 'inline'
            },
            {
                filename: 'icon-1.gif',
                type: 'image/gif',
                content_id: 'icon-1',
                content: icon1Image,
                disposition: 'inline'
            }
        ];
    }
}
