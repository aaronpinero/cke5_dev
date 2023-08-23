import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget } from '@ckeditor/ckeditor5-widget';

import InsertTableOfContentsCommand from './inserttoccommand';

export default class TableOfContentsEditing extends Plugin {
  init() {
    console.log( 'TableOfContentsEditing#init() got called' );
    this._defineSchema();
    this._defineConverters();
    this.editor.commands.add( 'insertToc', new InsertTableOfContentsCommand( this.editor ) );
  }
  _defineSchema() {
    const schema = this.editor.model.schema;
    schema.register( 'toc', {
      inheritAllFrom: '$blockObject'
    } );
  }
  _defineConverters() {
    const conversion = this.editor.conversion;
    conversion.for( 'upcast' ).elementToElement( {
      model: 'toc',
      view: {
        name: 'div',
        classes: 'ckeditor-toc'
      }
    } );
    conversion.for( 'dataDowncast' ).elementToElement( {
      model: 'toc',
      view: ( modelItem, { writer: viewWriter } ) => createTOCPlaceholder( modelItem, viewWriter )
    } );
    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'toc',
      view: ( modelItem, { writer: viewWriter } ) => {
        const widgetElement = createTOCPlaceholder( modelItem, viewWriter );
        return toWidget( widgetElement, viewWriter );
      }
    } );
    // Helper method for both downcast converters.
    function createTOCPlaceholder( modelItem, viewWriter ) {    
      const placeholder = viewWriter.createContainerElement( 'div', {
        class: 'ckeditor-toc'
      } );
      const innerText = viewWriter.createText( '{tableOfContents}' );
      viewWriter.insert( viewWriter.createPositionAt( placeholder, 0 ), innerText );
      return placeholder;
    }
  }
}