import { Plugin } from '@ckeditor/ckeditor5-core';

import TableOfContentsEditing from './tocediting';
import TableOfContentsUI from './tocui';

export default class TableOfContents extends Plugin {
  static get requires() {
    return [ TableOfContentsEditing, TableOfContentsUI ];
  }
}