import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from '../../model/base-email';

interface AccountEmailContext {
    fullName: string;
    loginUrl: string;
}

let heroImage: string, helpCenterImage: string, icon1Image: string;
if(process.env.NODE_ENV === 'development') {
    heroImage = readFileSync(join(__dirname, 'templates/emails/operations/account/hero.gif')).toString('base64');
    helpCenterImage = readFileSync(join(__dirname, 'templates/emails/operations/account/help-centre-btn.gif')).toString('base64');
    icon1Image = readFileSync(join(__dirname, 'templates/emails/operations/account/icon-1.gif')).toString('base64');
}
else {
    heroImage = readFileSync(join(__dirname, '../../templates/emails/operations/account/hero.gif')).toString('base64');
    helpCenterImage = readFileSync(join(__dirname, '../../templates/emails/operations/account/help-centre-btn.gif')).toString('base64');
    icon1Image = readFileSync(join(__dirname, '../../templates/emails/operations/account/icon-1.gif')).toString('base64');
}

export default class AccountEmail extends BaseEmail<AccountEmailContext> {
    constructor(to: string, context: AccountEmailContext) {
        super(to, 'CDAX Forex <noreply@cdax.forex>', 'CDAX Forex - Account Approved', 'emails/operations/account/approve', context, undefined, 'backoffice@cdax.forex');
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
            }
        ];
    }
}
