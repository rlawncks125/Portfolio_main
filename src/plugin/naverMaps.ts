export const naverMapsFindAddress = (
  addr: string
): Promise<naver.maps.Service.AddressItemV2[] | null> => {
  return new Promise((resolve, reject) => {
    naver.maps.Service.geocode(
      {
        query: addr,
      },
      (status, response) => {
        if (status === naver.maps.Service.Status.OK) {
          const addresses = response.v2.addresses;
          console.log(addresses);
          if (addresses.length > 0) {
            resolve(addresses);
          } else {
            alert("도로명 또는 주소를 찾을수없음");
          }
        }
      }
    );
  });
};
