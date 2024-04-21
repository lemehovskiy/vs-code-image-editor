# Image Editor VS Code Extension

## Description

The Image Editor extension for Visual Studio Code provides convenient tools for editing images directly within the editor. With this extension, you can perform various image editing tasks seamlessly without leaving your coding environment.

## Features

1. **Compress Images:** Reduce the file size of images while maintaining quality.
2. **Convert to WebP Format:** Convert images to WebP format with adjustable compression.
3. **Compress with auto format:** This feature intelligently combines compression and conversion to WebP formats. It compares the results of both operations and applies the one with the better savings. For instance, suppose you have an image that can achieve a 20% reduction in file size through WebP conversion and only a 15% reduction through compression alone. In that case, the extension will automatically convert the image to WebP format for optimal file size reduction.
4. **Resize Images:** Resize images to fit specific dimensions. (be aware in all resizing operation original aspect ratio will be kept)
5. **Rotate Images:** Easily rotate images to desired angles.

## Usage

1. **Select Images:** Right-click on one or more images in the VS Code explorer.
2. **Select Image Editor:** Choose the "Image Editor" option from the context menu.
3. **Execute Commands:** Select from available commands like rotate, compress, convert, or resize.

## Example

![feature X](https://github.com/lemehovskiy/vs-code-image-editor/blob/main/images/demo.gif?raw=true)

## Supported Files

This extension supports the following file types for conversion and other commands:

### Convert to WebP

- **Input Formats:** PNG, JPEG, GIF

### Compress

- **Input Formats:** PNG, JPEG

### Compress with auto format

- **Input Formats:** PNG, JPEG, GIF

### Other Commands

- **Input Formats:** PNG, JPG, JPEG, GIF

### Handling Unsupported Files

- If you select multiple files and some of them are not supported, they will be skipped during the conversion process.

## Configuration

Settings for the Image Editor extension can be configured in the `settings.json` file of your Visual Studio Code workspace.

### Available Settings

- `image-editor.quality`: Adjusts the quality of the images. For example, setting "image-editor.quality": 80 will result in images being compressed with 80% quality. (optional, default: 80).
- `image-editor.overwrite-original`: Determines whether the original files should be overwritten after executing resize and compress commands. Set to true to overwrite originals, or false to keep them unchanged. (optional, default: true)
- `image-editor.save-limit`: Sets the threshold for savings achieved, terminating operations below this limit. For instance, if image-editor.save-limit is set to 15 and an operation achieves only a 10% reduction in file size, it will be terminated. (optional, default: 15)
- `image-editor.webp-delete-original`: Allows deleting the original file when converting to WebP format. Set to true to delete originals, or false to keep them. (optional, default: true)

Example `settings.json` configuration:

```json
{
    "image-editor.quality": 80,
    "image-editor.overwrite-original": true,
    "image-editor.save-limit": 15,
    "image-editor.webp-delete-original": true,
}
```

## Requirements

- Visual Studio Code version 1.60.0 or higher.

## Issues and Feedback

If you encounter any issues with the Image Editor extension or have any feedback or feature requests, please feel free to [open an issue](https://github.com/lemehovskiy/vs-code-image-editor/issues) on GitHub.

## License

This extension is licensed under the [MIT License](LICENSE).
