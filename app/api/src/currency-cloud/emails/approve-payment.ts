import { readFileSync } from 'fs';
import { join } from 'path';
import { AttachmentJSON } from '@sendgrid/helpers/classes/attachment';
import BaseEmail from '../../model/base-email';

interface ApprovePaymentEmailContext {
    reference: string;
    name: string;
    to: string;
    createdAt: string;
}

const templatedir = join(__dirname, process.env.TEMPLATE_PATH as string);
const logoImage = readFileSync(join(templatedir, 'templates/emails/operations/transactions/logo.png')).toString('base64');

export default class ApprovePaymentEmail extends BaseEmail<ApprovePaymentEmailContext> {
    constructor(context: ApprovePaymentEmailContext) {
        super(
            context.to,
            'CDAX Forex <noreply@cdaxforex.com>',
            'Transaction approved',
            'emails/operations/transactions/approved',
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
