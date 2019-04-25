import { BlockCommandService } from '../../../services/block/command/block-command.service';
import { DocumentCommandService, UUID } from '../../../services/document/command/document-command.service';
import { DocumentFactoryService } from '../../../services/document/factory/document-factory.service';
import { EmailService } from '../../../services/email/email.service';
import { BlockQueryService } from '../../../services/block/query/block-query.service';
import { Block, BlockId } from '../../block/block';
import { DocumentQueryService } from '../../../services/document/query/document-query.service';
import { take } from 'rxjs/operators';
import { Document } from '../../document/document';
import { AccountService } from '../../../services/account/account.service';
import { SubmissionDocument } from '../../document/submissionDocument';
import { User } from '../../user';

export interface SendDocumentCommandInput {
  accountService: AccountService;
  blockCommandService: BlockCommandService;
  blockQueryService: BlockQueryService;
  documentCommandService: DocumentCommandService;
  documentQueryService: DocumentQueryService;
  documentFactoryService: DocumentFactoryService;
  emailService: EmailService;
}

export class SendDocumentCommand {

  private accountService: AccountService;
  private blockCommandService: BlockCommandService;
  private blockQueryService: BlockQueryService;
  private documentCommandService: DocumentCommandService;
  private documentQueryService: DocumentQueryService;
  private documentFactoryService: DocumentFactoryService;
  private emailService: EmailService;

  // Properties for the execute() method
  private email: string;
  private document: Document;
  private duplicatedBlockIds: Array<UUID>;
  private submission: SubmissionDocument;

  constructor(input: SendDocumentCommandInput) {
    this.accountService = input.accountService;
    this.blockCommandService = input.blockCommandService;
    this.blockQueryService = input.blockQueryService;
    this.documentCommandService = input.documentCommandService;
    this.documentQueryService = input.documentQueryService;
    this.documentFactoryService = input.documentFactoryService;
    this.emailService = input.emailService;
  }

  async execute(documentId: string, email: string) {
    // store the email to be used by other methods
    this.email = email;

    // 1. Retrieve the stored document
    await this.getDocument(documentId);

    // 2. Duplicate all blocks in that document
    await this.duplicateBlocks();

    // 3. Create a submission document
    await this.createSubmission();

    // call createDocument for the new document

    // update the list of submissionDocIds

    // call to updateDocument for current document

    // if all good, then send the email

  }

  /**
   * Retrieve the document object with the given id
   *
   * @param id the id of the document to be retrieved
   */
  private async getDocument(id: UUID) {
    return new Promise((resolve, reject) => {
      this.documentQueryService.getDocument$(id)
        .pipe(take(1))
        .subscribe(document => {
          this.document = document;
          resolve();
        }, reject);
    });
  }

  /**
   * Duplicate all blocks for the given document. The duplicated block IDs
   * will be stored in this.duplicatedBlockIds
   *
   * @param documentId the document to get blocks from
   */
  private async duplicateBlocks() {
    const blocks: Array<Block> = await this.getBlocks();
    const duplicatedBlocks = await this.blockCommandService.duplicateBlocks(blocks);

    this.duplicatedBlockIds = duplicatedBlocks.map(block => block.id);
  }

  /**
   * Retrieve the current block objects for the given document id
   *
   * @param documentId the document to get the blocks from
   */
  private async getBlocks(): Promise<Array<Block>> {
    const blocks: Array<Block> = await Promise.all(
      this.document.blockIds.map(id => this.getCurrentBlock(id))
    );

    return blocks;
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

  /**
   * Create a new SubmissionDocument based on the original one. Store the
   * created document in `this.submission`
   */
  private async createSubmission() {
    const user = await this.getCurrentUser();
    const blockIds = this.duplicatedBlockIds;

    this.submission = this.documentFactoryService.createNewSubmission({
      ownerId: user.id,
      recipientEmail: this.email,
      blockIds,
      title: this.document.title
    });
  }

  private async getCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.accountService.getUser$()
        .pipe(take(1))
        .subscribe(resolve, reject);
    });
  }

  private async createDocumentInGraphQL() {
    await this.documentCommandService.createDocument(this.submission);
  }

  // async TEST(documentId: string, email: string) {

  //   //

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
