import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform } from 'react-native';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
export default function QuillEditorComponent() {
  const _editor = React.createRef<QuillEditor>() as React.RefObject<QuillEditor>;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <QuillEditor
        style={styles.editor}
        ref={_editor}
        initialHtml="<h1>Quill Editor for react-native</h1>"
        webview={{
            dataDetectorTypes: Platform.OS === 'ios' ? 'none' : ['none']
        }}
      />
      <QuillToolbar editor={_editor as React.RefObject<QuillEditor>} options="full" theme="light" />
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
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#eaeaea',
  },
  editor: {
    flex: 1,
    padding: 0,
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 30,
    marginVertical: 5,
    backgroundColor: 'white',
  },
});