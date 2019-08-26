# QR Code Styling
[![Version](https://img.shields.io/npm/v/qr-code-styling.svg)](https://www.npmjs.org/package/qr-code-styling)

JavaScript library for generating QR codes with a logo and styling.

### Examples
<p float="left">
<img style="display:inline-block" src="https://raw.githubusercontent.com/kozakdenys/qr-code-styling/master/app/assets/facebook_example.png" width="270" />
<img style="display:inline-block" src="https://raw.githubusercontent.com/kozakdenys/qr-code-styling/master/app/assets/instagram_example.png" width="270" />
<img style="display:inline-block" src="https://raw.githubusercontent.com/kozakdenys/qr-code-styling/master/app/assets/telegram_example.png" width="270" />
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
    <title>Title</title>
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
            colour: "#4267b2",
            type: "rounded"
        },
        backgroundOptions: {
            colour: "#e9ebee",
        }
    });

    qrCode.append("#canvas");
</script>
</body>
</html>
```

### API

options                          | type                                                   | required | default value
---------------------------------|--------------------------------------------------------|----------|---------------
`width`                          | `number`                                               |          | 300
`height`                         | `number`                                               |          | 300
`data`                           | `string`                                               | true     |
`image`                          | `string`                                               |          |
`qrOptions.typeNumber`           | `number` (`0 - 40`)                                    |          | 0
`qrOptions.mode`                 | `string` (`'Numeric' 'Alphanumeric' 'Byte' 'Kanji'`)   |          |
`qrOptions.errorCorrectionLevel` | `string` (`'L' 'M' 'Q' 'H'`)                           |          | 'L'
`imageOptions.hideBackgroundDots`| `boolean`                                              |          | true
`imageOptions.imageSize`         | `number`                                               |          | 0.4
`dotsOptions.colour`             | `string`                                               |          | '#000'
`dotsOptions.type`               | `string`  (`'rounded' 'dots' 'default')                |          | 'default'
`backgroundOptions.colour`       | `string`                                               |          | '#fff'

### License

MIT
