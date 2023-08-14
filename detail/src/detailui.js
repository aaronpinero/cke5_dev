/**
 * @file registers the detail toolbar button and binds functionality to it.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView, SwitchButtonView, ContextualBalloon } from '@ckeditor/ckeditor5-ui';
import { isWidget } from 'ckeditor5/src/widget';

export default class DetailUI extends Plugin {
  static get requires() {
      return [ContextualBalloon];
  }
  
  init() {
    const editor = this.editor;
    
    this._balloon = this.editor.plugins.get( ContextualBalloon );
    this.switchButton = this._createOpenSwitch();
    
    this._enableBalloonActivators();

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
  
  _createOpenSwitch() {
    const switchButton = new SwitchButtonView();
    switchButton.set( {
      label: 'Open by default',
      withText: true,
      isOn: false
    } );
    switchButton.on( 'execute', () => { switchButton.isOn = !switchButton.isOn } );
    return switchButton;
  }
  
  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    console.log(view.document.selection);
    let target = null;
    target = () => view.domConverter.mapViewToDom(
      this._getClosestSelectedWidget(view.document.selection)
    );  
    return {
      target
    };
  }
  
  _getClosestSelectedWidget(selection) {
    const selectionPosition = selection.getFirstPosition();
    if (!selectionPosition) {
      return null;
    }
    const viewElement = selection.getSelectedElement();
    if (viewElement && isWidget(viewElement)) {
      return viewElement;
    }
    let parent = selectionPosition.parent;
    while (parent) {
      if (parent.is('element') && this.isWidget(parent)) {
        return parent;
      }
      parent = parent.parent;
    }
    return null;
  }
  
  _showUI() {
    this._balloon.add( {
      view: this.switchButton,
      position: this._getBalloonPositionData()
    } );
  }
  
  _enableBalloonActivators() {
    const editor = this.editor;
    const viewDocument = editor.editing.view.document;
    // Handle click on view document and show panel when selection is placed inside the link element.
    // Keep panel open until selection will be inside the same link element.
    this.listenTo(viewDocument, 'click', () => {
        const widget = this._getClosestSelectedWidget(viewDocument.selection);
        if (widget) {
          // Then show panel but keep focus inside editor editable.
          this._showUI();
        }
    });
  }
  
}
