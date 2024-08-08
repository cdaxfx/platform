import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from '../../model/base-email';

interface WelcomeEmailContext {
    fullName: string;
}

let heroImage: string, helpCenterImage: string, icon1Image: string, termsDocument: string;
if(process.env.NODE_ENV === 'development') {
    heroImage = readFileSync(join(__dirname, 'templates/emails/registration/welcome/hero.gif')).toString('base64');
    helpCenterImage = readFileSync(join(__dirname, 'templates/emails/registration/welcome/help-centre-btn.gif')).toString('base64');
    icon1Image = readFileSync(join(__dirname, 'templates/emails/registration/welcome/icon-1.gif')).toString('base64');
    termsDocument = readFileSync(join(__dirname, 'templates/pdfs/terms_conditions.pdf')).toString('base64');
}
else {
    heroImage = readFileSync(join(__dirname, '../../templates/emails/registration/welcome/hero.gif')).toString('base64');
    helpCenterImage = readFileSync(join(__dirname, '../../templates/emails/registration/welcome/help-centre-btn.gif')).toString('base64');
    icon1Image = readFileSync(join(__dirname, '../../templates/emails/registration/welcome/icon-1.gif')).toString('base64');
    termsDocument = readFileSync(join(__dirname, '../../templates/pdfs/terms_conditions.pdf')).toString('base64');
}

export default class WelcomeEmail extends BaseEmail<WelcomeEmailContext> {
    constructor(to: string, context: WelcomeEmailContext) {
        super(
            to,
            'CDAX Forex <noreply@cdaxforex.com>',
            'Welcome to CDAX Forex',
            'emails/registration/welcome/welcome',
            context,
            undefined,
            'backoffice@cdaxforex.com'
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
                filename: 'help-center.gif',
                type: 'image/gif',
                content_id: 'help-center',
                content: helpCenterImage,
                disposition: 'inline'
            },
            {
                filename: 'icon-1.gif',
                type: 'image/gif',
                content_id: 'icon-1',
                content: icon1Image,
                disposition: 'inline'
            },
            {
                filename: 'terms and conditions.pdf',
                type: 'application/pdf',
                content_id: 'terms',
                content: termsDocument
            }
        ];
    }
}
