// app.js

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';

import SimpleBox from './simplebox/simplebox';
import Detail from './detail/src/detail';

import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

ClassicEditor
  .create( document.querySelector( '#editor' ), {
    plugins: [ Alignment, Essentials, Paragraph, Bold, Italic, Heading, Indent, Link, List, Table, TableToolbar, SimpleBox, Detail ],
    toolbar: [ 'alignment', 'heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList', 'outdent', 'indent', '|', 'insertTable', 'detail', 'simpleBox' ],
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    }
  } )
  .then( editor => {
    console.log( 'Editor was initialized', editor );
    CKEditorInspector.attach( editor );
  } )
  .catch( error => {
    console.error( error.stack );
  } );