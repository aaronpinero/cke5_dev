/**
 * @file registers the detail toolbar button and binds functionality to it.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView, SwitchButtonView, ContextualBalloon, clickOutsideHandler } from '@ckeditor/ckeditor5-ui';
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
    } );
    switchButton.on( 'execute', () => { switchButton.isOn = !switchButton.isOn } );
    
    this.listenTo( switchButton, 'change:isOn', () => {
      const selection = this.editor.editing.view.document.selection.getSelectedElement();
      if (selection) {
        const modelElement = this.editor.editing.mapper.toModelElement(selection);
        if (modelElement) {
          if (switchButton.isOn) {
            this.editor.model.change( writer => {
              writer.setAttribute('open', 'true', modelElement);
            } );
          }
          else {
            this.editor.model.change( writer => {
              writer.removeAttribute('open', modelElement);
            } );
          }
        }
      }
    } );
    
    // Hide the form view when clicking outside the balloon.
    clickOutsideHandler( {
      emitter: switchButton,
      activator: () => this._balloon.visibleView === switchButton,
      contextElements: [ this._balloon.view.element ],
      callback: () => this._hideUI()
    } );
    
    return switchButton;
  }
  
  _hideUI() {
    this._balloon.remove( this.switchButton );
    this.editor.editing.view.focus();
  }
  
  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    let target = null;
    target = () => view.domConverter.mapViewToDom(
      this._getTargetDetailsWidget(view.document.selection)
    );  
    return {
      target
    };
  }
  
  _getTargetDetailsWidget(selection) {
    const selectionPosition = selection.getFirstPosition();
    if (!selectionPosition) {
      return null;
    }
    const viewElement = selection.getSelectedElement();
    if (viewElement && isWidget(viewElement) && viewElement.name == 'details') {
      return viewElement;
    }
    // let parent = selectionPosition.parent;
    // while (parent) {
    //   if (parent.is('element') && isWidget(parent) && parent.name == 'details') {
    //     return parent;
    //   }
    //   parent = parent.parent;
    // }
    return null;
  }
  
  _showUI() {
    this._balloon.add( {
      view: this.switchButton,
      position: this._getBalloonPositionData()
    } );
    const selection = this.editor.editing.view.document.selection.getSelectedElement();
    if (selection) {
      const modelElement = this.editor.editing.mapper.toModelElement(selection);
      if (modelElement) {
        if (modelElement.getAttribute('open') !== undefined) {
          this.switchButton.set('isOn', true);
        }
        else {
          this.switchButton.set('isOn', false);
        }
      }
    }
  }
  
  _enableBalloonActivators() {
    const editor = this.editor;
    const viewDocument = editor.editing.view.document;
    
    // Handle click on view document and show balloon when
    // the selection is a details widget.
    this.listenTo(viewDocument, 'click', () => {
        const widget = this._getTargetDetailsWidget(viewDocument.selection);
        if (widget) {
          this._showUI();
        }
    });
  }
  
}
