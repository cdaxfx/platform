import { readFileSync } from 'fs';
import { join } from 'path';
import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import BaseEmail from '../../model/base-email';

interface BeneficiaryEmailContext {
    fullName: string;
    uuid: string;
    url: string;
    createdBy: {
        fullName: string;
        email: string;
        phone: string;
    };
    createdAt: string;
}

let logoImage: string;
if(process.env.NODE_ENV === 'development') {
    logoImage = readFileSync(join(__dirname, 'templates/emails/registration/request-access/logo.png')).toString('base64');
}
else {
    logoImage = readFileSync(join(__dirname, '../../templates/emails/registration/request-access/logo.png')).toString('base64');
}

export default class BeneficiaryCreatedEmail extends BaseEmail<BeneficiaryEmailContext> {
    constructor(to: string, context: BeneficiaryEmailContext) {
        super(
            `${process.env.BACKOFFICE_EMAIL ?? to}`,
            'CDAX Forex <noreply@cdax.forex>',
            'CDAX Forex Beneficiary created',
            'emails/operations/beneficiary-created/request',
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
