export default (a, b, ignoreCase = true) => {
    let first = ignoreCase ? String(a).toLowerCase() : a;
    let second = ignoreCase ? String(b).toLowerCase() : b;
    if (first < second) { return -1}
    if (first > second) { return 1}
    return 0;
}