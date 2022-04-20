function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const getData = (services, orders) => {
  let data = [];
  let categories = getCategories(services);
  orders.forEach((order) => {
    let color = getRandomColor();
    order.services.forEach((service) => {
      data.push({
        x: new Date(order.startAt).getTime(),
        x2: new Date(order.endAt).getTime(),
        y: categories.findIndex((category) => category === service),
        name: "Room number: " + order.roomNumber,
        orderId: order.id,
        dragDrop: {
          draggableX: false,
        },
        color: color,
      });
    });
  });
  return data;
};

export const getCategories = (services) => {
  let categories = [];
  services.forEach((service) => {
    categories.push(service.name);
  });
  return [...new Set(categories)];
};

export const updateSeries = (services, order) => {
  let elementsToAdd = [];
  let categories = getCategories(services, [order]);
  let color = getRandomColor();
  order.services.forEach((service) => {
    elementsToAdd.push({
      x: new Date(order.startAt).getTime(),
      x2: new Date(order.endAt).getTime(),
      y: categories.findIndex((category) => category === service),
      name: "Room number: " + order.roomNumber,
      orderId: order.id,
      dragDrop: {
        draggableX: false,
      },
      color: color,
    });
  });
  return elementsToAdd;
};

export const formatDateForChart = (date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .substring(0, 10);
};

export const unixToTimeString = (time) => {
  let dateTime = new Date(time);
  let hours =
    dateTime.getHours().toString().length === 1
      ? "0" + dateTime.getHours()
      : dateTime.getHours();
  let minutes =
    dateTime.getMinutes().toString().length === 1
      ? "0" + dateTime.getMinutes()
      : dateTime.getMinutes();

  return hours + ":" + minutes;
};

export const isEqual = function (value, other) {
  let type = Object.prototype.toString.call(value);

  if (type !== Object.prototype.toString.call(other)) return false;

  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;

  let valueLen =
    type === "[object Array]" ? value.length : Object.keys(value).length;
  let otherLen =
    type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  let compare = function (item1, item2) {
    let itemType = Object.prototype.toString.call(item1);

    if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    } else {
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      if (itemType === "[object Function]") {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };

  if (type === "[object Array]") {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  return true;
};
