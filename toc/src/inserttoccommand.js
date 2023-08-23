import { Command } from '@ckeditor/ckeditor5-core';

export default class InsertTableOfContentsCommand extends Command {
  execute() {
    this.editor.model.change( writer => {
      this.editor.model.insertObject( createToc( writer ) );
    } );
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'toc' );
    this.isEnabled = allowedIn !== null;
  }
}

function createToc( writer ) {
  const toc = writer.createElement( 'toc' );
  return toc;
}