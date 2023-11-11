export default (a, b) => {
    let first = parseInt(a);
    let second = parseInt(b);
    
    if (first < second) { return -1}
    if (first > second) { return 1}
    return 0;
}