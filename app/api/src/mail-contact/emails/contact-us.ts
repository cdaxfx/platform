import { readFileSync } from 'fs';
import { join } from 'path';
import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import BaseEmail from '../../model/base-email';

interface ContactUsEmailContext {
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

let logoImage: string;
if(process.env.NODE_ENV === 'development') {
    logoImage = readFileSync(join(__dirname, 'templates/emails/operations/contact/logo.png')).toString('base64');
}
else {
    logoImage = readFileSync(join(__dirname, '../../templates/emails/operations/contact/logo.png')).toString('base64');
}

export default class ContactUsEmail extends BaseEmail<ContactUsEmailContext> {
    constructor(to, context: ContactUsEmailContext) {
        super(
            to,
            'CDAX Forex <noreply@cdax.forex>',
            'Contact Us',
            'emails/operations/contact/us',
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
