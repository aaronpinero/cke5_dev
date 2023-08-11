/**
 * @file registers the detail toolbar button and binds functionality to it.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

export default class DetailUI extends Plugin {
  init() {
    const editor = this.editor;

    // This will register the detail toolbar button.
    editor.ui.componentFactory.add('detail', (locale) => {
      const command = editor.commands.get('insertDetail');
      const buttonView = new ButtonView(locale);

      // Create the toolbar button.
      buttonView.set({
        label: 'Add details',
        withText: true,
        tooltip: true,
      });

      // Bind the state of the button to the command.
      buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

      // Execute the command when the button is clicked (executed).
      this.listenTo(buttonView, 'execute', () =>
        editor.execute('insertDetail'),
      );

      return buttonView;
    });
  }
}
