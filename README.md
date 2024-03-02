# Image Editor VS Code Extension

## Description
The Image Editor extension for Visual Studio Code provides convenient tools for editing images directly within the editor. With this extension, you can perform various image editing tasks seamlessly without leaving your coding environment.

## Features

1. **Rotate Images:** Easily rotate images to desired angles.
2. **Compress Images:** Reduce the file size of images while maintaining quality.
3. **Convert to WebP Format:** Convert images to WebP format with adjustable compression.
4. **Resize Images:** Resize images to fit specific dimensions.

## Usage
1. **Select Images:** Right-click on one or more images in the VS Code explorer.
2. **Select Image Editor:** Choose the "Image Editor" option from the context menu.
3. **Execute Commands:** Select from available commands like rotate, compress, convert, or resize.
![feature X](https://github.com/lemehovskiy/vs-code-image-editor/blob/main/images/demo.gif?raw=true)

## Configuration
Settings for the Image Editor extension can be configured in the `settings.json` file of your Visual Studio Code workspace.

### Available Settings:

- `image-editor.quality`: Adjust the quality of the images (integer value ranging from 1 to 100, optional, default: 80).
- `image-editor.overwrite-original`: Determine whether the original files should be overwritten after executing resize and compress commands (optional, default: true).

Example `settings.json` configuration:
```json
{
    "image-editor.quality": 80,
    "image-editor.overwrite-original": true
}
```

## Requirements

- Visual Studio Code version 1.60.0 or higher.

## Issues and Feedback

If you encounter any issues with the Image Editor extension or have any feedback or feature requests, please feel free to [open an issue](https://github.com/lemehovskiy/vs-code-image-editor/issues) on GitHub.

## License

This extension is licensed under the [MIT License](LICENSE).