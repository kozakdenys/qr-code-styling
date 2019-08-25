export function getDOMElement(selector) {
    if (!selector) {
        throw "'selector' is required";
    }

    if (selector[0] === ".") {
        const elements = document.getElementsByClassName(selector.substr(1));

        if (elements && elements.length) {
            return elements[0]
        } else {
            throw "Element is not found";
        }
    } else if (selector[0] === "#") {
        const element = document.getElementById(selector.substr(1));

        if (element) {
            return element;
        } else {
            throw "Element is not found";
        }
    } else {
        throw "Unknown selector";
    }
}