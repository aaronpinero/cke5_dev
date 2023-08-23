import { ButtonView } from '@ckeditor/ckeditor5-ui';
import { Plugin } from '@ckeditor/ckeditor5-core';

export default class TableOfContentsUI extends Plugin {
  init() {
    const editor = this.editor;
    
    // This will register the detail toolbar button.
    editor.ui.componentFactory.add('toc', (locale) => {
      const command = editor.commands.get('insertToc');
      const buttonView = new ButtonView(locale);
  
      // Create the toolbar button.
      buttonView.set({
        label: 'Add Table of Contents',
        withText: true,
        tooltip: true,
      });
  
      // Bind the state of the button to the command.
      buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');
  
      // Execute the command when the button is clicked (executed).
      this.listenTo(buttonView, 'execute', () =>
        editor.execute('insertToc'),
      );
  
      return buttonView;
    });
  }
}