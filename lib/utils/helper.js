

const isNormalInteger= (str) => {
    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

module.exports = {
    isNormalInteger,
}