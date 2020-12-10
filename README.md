# QR Code Styling
[![Version](https://img.shields.io/npm/v/qr-code-styling.svg)](https://www.npmjs.org/package/qr-code-styling)

JavaScript library for generating QR codes with a logo and styling.

If you have issues / suggestions / notes / questions, please open an issue or contact me. Let's create a usable library together.
### Examples
<p float="left">
<img style="display:inline-block" src="https://raw.githubusercontent.com/kozakdenys/qr-code-styling/master/src/assets/facebook_example.png" width="240" />
<img style="display:inline-block" src="https://raw.githubusercontent.com/kozakdenys/qr-code-styling/master/src/assets/instagram_example.png" width="240" />
<img style="display:inline-block" src="https://raw.githubusercontent.com/kozakdenys/qr-code-styling/master/src/assets/telegram_example.png" width="240" />
</p>

### Installation

```
npm install qr-code-styling
```

### Ussage

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>QR Code Styling</title>
    <script type="text/javascript" src="https://unpkg.com/qr-code-styling/lib/qr-code-styling.js"></script>
</head>
<body>
<div id="canvas"></div>
<script type="text/javascript">

    const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        data: "https://www.facebook.com/",
        image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
        dotsOptions: {
            color: "#4267b2",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#e9ebee",
        },
        imageOptions: {
            crossOrigin: "anonymous"
        }
    });

    qrCode.append(document.getElementById("canvas"));
</script>
</body>
</html>
```

### API Documentation

#### QRCodeStyling instance
`new QRCodeStyling(options) => QRCodeStyling`

Param  |Type  |Description
-------|------|------------
options|object|Init object

`options` structure

Property         |Type  |Default Value|Description
-----------------|------|-------------|-----------------------------------------------------
width            |number|`300`        |Size of canvas
height           |number|`300`        |Size of canvas
data             |string|             |The date will be encoded to the QR code
image            |string|             |The image will be copied to the center of the QR code
qrOptions        |object|             |Options will be passed to `qrcode-generator` lib
imageOptions     |object|             |Specific image options, details see below
dotsOptions      |object|             |Dots styling options
backgroundOptions|object|             |QR background styling options

`options.qrOptions` structure

Property            |Type                                              |Default Value
--------------------|--------------------------------------------------|-------------
typeNumber          |number (`0 - 40`)                                 |`0`
mode                |string (`'Numeric' 'Alphanumeric' 'Byte' 'Kanji'`)|
errorCorrectionLevel|string (`'L' 'M' 'Q' 'H'`)                        |`'Q'`

`options.imageOptions` structure

Property          |Type                                   |Default Value|Description
------------------|---------------------------------------|-------------|------------------------------------------------------------------------------
hideBackgroundDots|boolean                                |`true`       |Hide all dots covered by the image
imageSize         |number                                 |`0.4`        |Coefficient of the image size. Not recommended to use ove 0.5. Lower is better
crossOrigin       |string(`'anonymous' 'use-credentials'`)|             |Set "anonymous" if you want to download QR code from other origins.

`options.dotsOptions` structure

Property|Type                                |Default Value|Description
--------|------------------------------------|-------------|-----------------
color   |string                              |`'#000'`     |Color of QR dots
type    |string (`'rounded' 'dots' 'classy' 'classyround' 'square'`)|`'default'`  |Style of QR dots

`options.backgroundOptions` structure

Property|Type  |Default Value
--------|------|-------------
color  |string|`'#fff'`

#### QRCodeStyling methods
`QRCodeStyling.append(container) => void`

Param    |Type       |Description
---------|-----------|-----------
container|DOM element|This container will be used for appending of the QR code

`QRCodeStyling.update(options) => void`

Param  |Type  |Description
-------|------|--------------------------------------
options|object|The same options as for initialization

`QRCodeStyling.download(downloadOptions) => void`

Param          |Type  |Description
---------------|------|------------
downloadOptions|object|Options with extension and name of file (not required)

`downloadOptions` structure

Property |Type                          |Default Value|Description
---------|------------------------------|-------------|-----------------------------------------------------
name     |string                        |`'qr'`       |Name of the downloaded file
extension|string (`'png' 'jpeg' 'webp'`)|`'png'`      |File extension

### License

[MIT License](https://raw.githubusercontent.com/kozakdenys/qr-code-styling/master/LICENSE). Copyright (c) 2020 Denys Kozak

