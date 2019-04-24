import { BlockCommandService } from '../../../services/block/command/block-command.service';
import { DocumentCommandService, UUID } from '../../../services/document/command/document-command.service';
import { DocumentFactoryService } from '../../../services/document/factory/document-factory.service';
import { EmailService } from '../../../services/email/email.service';
import { SubmissionDocument } from '../../document/submissionDocument';
import { BlockQueryService } from '../../../services/block/query/block-query.service';
import { Block, BlockId } from '../../block/block';
import { DocumentQueryService } from '../../../services/document/query/document-query.service';
import { take } from 'rxjs/operators';
import { Document } from '../../document/document';

export interface SendDocumentCommandInput {
  blockCommandService: BlockCommandService;
  blockQueryService: BlockQueryService;
  documentCommandService: DocumentCommandService;
  documentQueryService: DocumentQueryService;
  documentFactoryService: DocumentFactoryService;
  emailService: EmailService;
}

export class SendDocumentCommand {

  private blockCommandService: BlockCommandService;
  private blockQueryService: BlockQueryService;
  private documentCommandService: DocumentCommandService;
  private documentQueryService: DocumentQueryService;
  private documentFactoryService: DocumentFactoryService;
  private emailService: EmailService;

  constructor(input: SendDocumentCommandInput) {
    this.blockCommandService = input.blockCommandService;
    this.blockQueryService = input.blockQueryService;
    this.documentCommandService = input.documentCommandService;
    this.documentQueryService = input.documentQueryService;
    this.documentFactoryService = input.documentFactoryService;
    this.emailService = input.emailService;
  }

  async execute(documentId: string, email: string) {
    // First duplicate all blocks
    const blocks: Array<Block> = await this.getBlocks(documentId);
    const duplicatedBlocks = await this.blockCommandService.duplicateBlocks(blocks);
    const duplicatedIds = duplicatedBlocks.map(block => block.id);

    // Create a new SubmissionDocument, passing in the info + blocks

    // call createDocument for the new document

    // update the list of submissionDocIds

    // call to updateDocument for current document

    // if all good, then send the email

  }

  /**
   * Retrieve the current block objects for the given document id
   *
   * @param documentId the document to get the blocks from
   */
  private async getBlocks(documentId: UUID): Promise<Array<Block>> {
    const document: Document = await this.getFirstDocument(documentId);

    const blocks: Array<Block> = await Promise.all(
      document.blockIds.map(id => this.getCurrentBlock(id))
    );

    return blocks;
  }

  /**
   * Retrieve the first document stored with the given id
   *
   * @param id the id of the document
   */
  private async getFirstDocument(id: UUID): Promise<Document> {
    return new Promise((resolve, reject) => {
      this.documentQueryService.getDocument$(id)
        .pipe(take(1))
        .subscribe(resolve, reject);
    });
  }

  /**
   * Retrieve the first stored block with the given id
   *
   * @param id the id of the block
   */
  private async getCurrentBlock(id: BlockId): Promise<Block> {
    return new Promise((resolve, reject) => {
      this.blockQueryService.getBlock$(id)
        .pipe(take(1))
        .subscribe(resolve, reject);
    });
  }

  // async TEST(documentId: string, email: string) {

  //   //

  //   // First duplicate all blocks
  //   const blocks: Array<Block> = await Promise.all(
  //     this.blockIds.map(id => this.getCurrentBlock(id))
  //   );
  //   const duplicatedBlocks = await this.blockCommandService.duplicateBlocks(blocks);
  //   const duplicatedIds = duplicatedBlocks.map(block => block.id);

  //   // create a new SubmissionDocument, passing in the info + blocks
  //   const submission: SubmissionDocument = this.docFactoryService.createNewSubmission({
  //     ownerId: this.currentUser.id,
  //     recipientEmail: email,
  //     blockIds: duplicatedIds,
  //     title: this.docTitle
  //   });

  //   // call createDocument for the new document
  //   await this.documentCommandService.createDocument(submission);

  //   // update the list of submissionDocIds
  //   this.submissionDocIds.push(submission.id);

  //   // call to updateDocument for current document
  //   await this.documentCommandService.updateDocument({
  //     id: this.documentId,
  //     submissionDocIds: this.submissionDocIds,
  //     lastUpdatedBy: this.currentUser.id
  //   });

  //   // if all good, then send the email
  //   await this.emailService.sendInvitationEmail({
  //     email,
  //     documentId: submission.id,
  //     sender: this.currentUser
  //   });
  // }
}
