import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget } from '@ckeditor/ckeditor5-widget';

export default class TableOfContentsEditing extends Plugin {
  init() {
    console.log( 'TableOfContentsEditing#init() got called' );
    this._defineSchema();
    this._defineConverters();
  }
  _defineSchema() {
    const schema = this.editor.model.schema;
    schema.register( 'toc', {
      // Behaves like a self-contained block object (e.g. a block image)
      // allowed in places where other blocks are allowed (e.g. directly in the root).
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
      view: {
        name: 'div',
        classes: 'ckeditor-toc'
      }
    } );
    conversion.for( 'editingDowncast' ).elementToElement( {
      model: 'toc',
      view: ( modelElement, { writer: viewWriter } ) => {
        const div = viewWriter.createContainerElement( 'div', { class: 'ckeditor-toc' } );
        return toWidget( div, viewWriter, { label: 'table of contents' } );
      }
    } );
        
  }
}