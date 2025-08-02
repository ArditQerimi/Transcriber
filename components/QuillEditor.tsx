import React from 'react';
import { SafeAreaView, StyleSheet, Platform, View } from 'react-native';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';

interface QuillEditorComponentProps {
  initialValue?: string; // Prop to receive initial content from parent
  onTextChange?: (html: string) => void; // Prop to pass content to parent
}

export default function QuillEditorComponent({ initialValue, onTextChange }: QuillEditorComponentProps) {
  const _editor = React.createRef<QuillEditor>() as React.RefObject<QuillEditor>;

  return (
    <SafeAreaView style={styles.root}>
      <QuillToolbar editor={_editor as React.RefObject<QuillEditor>} options="full" theme="light" />
      <QuillEditor
        style={styles.editor}
      
        ref={_editor}
        initialHtml={initialValue || '<h1>Quill Editor for react-native</h1>'} // Use initialValue or fallback
        webview={{
          dataDetectorTypes: Platform.OS === 'ios' ? 'none' : ['none'],
        }}
        onTextChange={(data) => onTextChange?.(data.html)} // Pass only the HTML string to parent
        // autoSize={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  root: {
    flex: 1, 
    backgroundColor: '#eaeaea',
  },
  editor: {
    padding: 0,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 5,
    backgroundColor: 'white',
    flex: 1,
  },
});