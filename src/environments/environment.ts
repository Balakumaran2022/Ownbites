export const environment = {
  production: true,
  apiUrl: (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ? '' : 'https://backend2.owct.me',
  belongsTo: '69b256ec99b143835b75ee69',
  outletId: '6a26675eee35a470359a1c44'
};
