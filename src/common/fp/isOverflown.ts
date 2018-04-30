export function isOverflown(element) {
    return element && (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth);
}

export default isOverflown;