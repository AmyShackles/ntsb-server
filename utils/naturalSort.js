const naturalSort = function (arr) {
    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: "base",
    });

    if (Array.isArray(arr[0])) {
        return arr.sort((a, b) => collator.compare(a[0], b[0]));
    }
    return arr.sort(collator.compare);
};

module.exports = { naturalSort };
