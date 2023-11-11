export default (a, b) => {
    let first = a.replace('R$', '').replace('.', '').replace(',','.').trim();
    let second = b.replace('R$', '').replace('.', '').replace(',','.').trim();

    first = parseFloat(first);
    second = parseFloat(second);

    if (first < second) { return -1}
    if (first > second) { return 1}
    return 0;
}