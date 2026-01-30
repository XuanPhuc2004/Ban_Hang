tinymce.init({
  selector: 'textarea.textarea-mce',
  height: 350,

  license_key: 'gpl',

  menubar: true,

  plugins: [
    'lists',
    'link',
    'image',
    'table',
    'code',
    'wordcount'
  ],

  toolbar:
    'undo redo | bold italic underline | bullist numlist | link image | code',

});
