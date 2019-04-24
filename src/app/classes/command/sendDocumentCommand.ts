import { BlockCommandService } from '../../services/block/command/block-command.service';
import { DocumentCommandService } from '../../services/document/command/document-command.service';
import { DocumentFactoryService } from '../../services/document/factory/document-factory.service';
import { SubmissionDocument } from '../document/submissionDocument';
import { EmailService } from '../../services/email/email.service';

export interface SendDocumentCommandInput {
  blockCommandService: BlockCommandService;
  documentCommandService: DocumentCommandService;
  docFactoryService: DocumentFactoryService;
  emailService: EmailService;
}

export class SendDocumentCommand {

  private blockCommandService: BlockCommandService;
  private documentCommandService: DocumentCommandService;
  private docFactoryService: DocumentFactoryService;
  private emailService: EmailService;

  constructor(input: SendDocumentCommandInput) {
    this.blockCommandService = input.blockCommandService;
    this.documentCommandService = input.documentCommandService;
    this.docFactoryService = input.docFactoryService;
  }

  async execute(documentId: string, email: string) {
    
    // First duplicate all blocks
    const blocks: Array<Block> = await Promise.all(
      this.blockIds.map(id => this.getCurrentBlock(id))
    );
    const duplicatedBlocks = await this.blockCommandService.duplicateBlocks(blocks);
    const duplicatedIds = duplicatedBlocks.map(block => block.id);

    // create a new SubmissionDocument, passing in the info + blocks
    const submission: SubmissionDocument = this.docFactoryService.createNewSubmission({
      ownerId: this.currentUser.id,
      recipientEmail: email,
      blockIds: duplicatedIds,
      title: this.docTitle
    });

    // call createDocument for the new document
    await this.documentCommandService.createDocument(submission);

    // update the list of submissionDocIds
    this.submissionDocIds.push(submission.id);

    // call to updateDocument for current document
    await this.documentCommandService.updateDocument({
      id: this.documentId,
      submissionDocIds: this.submissionDocIds,
      lastUpdatedBy: this.currentUser.id
    });

    // if all good, then send the email
    await this.emailService.sendInvitationEmail({
      email,
      documentId: submission.id,
      sender: this.currentUser
    });
  }
}
