

const isNormalInteger= (str) => {
    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

const deliveryPeriod = () => {
    return 3;
}

const getOrderDates = () => {
    let orderDate = new Date();
    let deliveryDate = new Date();
    deliveryDate.setDate(orderDate.getDate() + deliveryPeriod());
    

    orderDate = orderDate.toLocaleDateString();
    deliveryDate = deliveryDate.toLocaleDateString();

    return {
        orderDate,
        deliveryDate,
    }
}

module.exports = {
    isNormalInteger,
    getOrderDates,
}