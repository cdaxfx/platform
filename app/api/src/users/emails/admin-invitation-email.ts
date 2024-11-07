import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import { readFileSync } from 'fs';
import { join } from 'path';
import BaseEmail from '../../model/base-email';
import { Invitation } from '@cdaxfx/tools-models';

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

interface InvitationEmailContext {
    invitationUrl: string;
    password: string;
    loginUrl: string;
}

export default class AdminInvitationEmail extends BaseEmail<InvitationEmailContext> {
    constructor(invitation: Invitation, secret: string, password: string) {
        super(
            invitation.email,
            'CDAX Forex <noreply@cdax.forex>',
            'Welcome to CDAX Forex',
            'emails/registration/invitation/admin',
            {
                invitationUrl: AdminInvitationEmail.getInvitationUrl(invitation, secret),
                password: password,
                loginUrl: AdminInvitationEmail.getLoginUrl()
            }
        );
    }

    private static getInvitationUrl(invitation: Invitation, secret: string): string {
        const url = new URL('/admin-invitation', process.env.FRONTEND_URL);
        url.search = `?invitation=${encodeURIComponent(invitation.uuid)}&code=${encodeURIComponent(secret)}`;
        return url.toString();
    }

    private static getLoginUrl(): string {
        const url = new URL('/login', process.env.FRONTEND_URL);
        return url.toString();
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
