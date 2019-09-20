# QR Code Styling
[![Version](https://img.shields.io/npm/v/qr-code-styling.svg)](https://www.npmjs.org/package/qr-code-styling)

JavaScript library for generating QR codes with a logo and styling.

### Examples
<p float="left">
<img style="display:inline-block" src="https://raw.githubusercontent.com/kozakdenys/qr-code-styling/master/app/assets/facebook_example.png" width="240" />
<img style="display:inline-block" src="https://raw.githubusercontent.com/kozakdenys/qr-code-styling/master/app/assets/instagram_example.png" width="240" />
<img style="display:inline-block" src="https://raw.githubusercontent.com/kozakdenys/qr-code-styling/master/app/assets/telegram_example.png" width="240" />
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

    const qrCode = new QrCodeStyling({
        width: 300,
        height: 300,
        data: "https://www.facebook.com/",
        image: "https://facebookbrand.com/wp-content/themes/fb-branding/assets/images/fb-logo.png?v2",
        dotsOptions: {
            color: "#4267b2",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#e9ebee",
        }
    });

    qrCode.append(document.getElementById("canvas"));
</script>
</body>
</html>
```

### API Documentation

#### QrCodeStyling instance
`new QrCodeStyling(options) => QrCodeStyling`

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

Property          |Type   |Default Value|Description
------------------|-------|-------------|------------------------------------------------------------------------------
hideBackgroundDots|boolean|`true`       |Hide all dots covered by the image
imageSize         |number |`0.4`        |Coefficient of the image size. Not recommended to use ove 0.5. Lower is better

`options.dotsOptions` structure

Property|Type                                |Default Value|Description
--------|------------------------------------|-------------|-----------------
color  |string                              |`'#000'`     |Color of QR dots
type    |string (`'rounded' 'dots' 'square'`)|`'default'`  |Style of QR dots

`options.backgroundOptions` structure

Property|Type  |Default Value
--------|------|-------------
color  |string|`'#fff'`

#### QrCodeStyling methods
`QrCodeStyling.append(container) => void`

Param    |Type       |Description
---------|-----------|-----------
container|DOM element|This container will be used for appending of the QR code

`QrCodeStyling.update(options) => void`

Param  |Type  |Description
-------|------|--------------------------------------
options|object|The same options as for initialization

### License

[MIT License](https://raw.githubusercontent.com/kozakdenys/qr-code-styling/master/LICENSE). Copyright (c) 2019 Denys Kozak

