import axios from "axios";

export const getServiceTypes = (language) => {
  return axios.get("api/v1/services-type", {
    headers: {
      "accept-language": language,
    },
  });
};

export const getAvailableUnitsCount = ({ startAt, endAt, serviceTypeId }) => {
  return axios.get("api/v1/orders/units/", {
    params: {
      startAt: startAt,
      endAt: endAt,
      serviceTypeId: serviceTypeId,
    },
  });
};

export const createNewOrder = (order) => {
  return axios.post("api/v1/orders", order);
};

export const getAllRooms = () => {
  return axios.get("api/v1/rooms");
};

export const getAllServiceTypes = () => {
  return axios.get("api/v1/services-type");
};

export const getServicesByServiceType = (serviceTypeId) => {
  return axios.get("api/v1/services/" + serviceTypeId);
};

export const getAllOrdersByDate = (date, serviceTypeId) => {
  return axios.get(`api/v1/orders/${serviceTypeId}`, {
    params: {
      date: date,
    },
  });
};

export const updateOrder = (orderId, order) => {
  const orderUpdateRequest = {
    serviceToRemove: order.serviceToRemove,
    serviceToAdd: order.serviceToAdd,
    serviceTypeId: order.selectedServiceType,
  };
  return axios.patch("api/v1/orders/" + orderId, orderUpdateRequest);
};

export const getAllMenus = () => {
  return axios.get("api/v1/menu/menu-item");
};

export const createMenuOrder = (roomId, menuOrder) => {
  return axios.post(`api/v1/menu-order/room/${roomId}`, menuOrder);
};

export const getUnprocessedRoomServiceOrders = () => {
  return axios.get("api/v1/menu-order/unprocessed");
};

export const getIsIpAddressValid = () => {
  return axios.get("api/v1/firewall");
};
