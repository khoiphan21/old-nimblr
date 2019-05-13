import { SendDocumentCommand } from './sendDocument/sendDocumentCommand';
import { UpdateBlockCommand } from './updateBlock/updateBlockCommand';

export type Command = SendDocumentCommand | UpdateBlockCommand;
