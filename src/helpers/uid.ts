let uid;

if (
  window.hasOwnProperty('crypto') &&
  typeof window.crypto.randomUUID === 'function'
) {
  uid = () => {
    return window.crypto.randomUUID();
  };
} else {
  // uid = () => {
  //   // Fallback: generate pseudo-random UID
  //   return 'xxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  //     const r = (Math.random() * 16) | 0,
  //       v = c == 'x' ? r : (r & 0x3) | 0x8;
  //     return v.toString(16);
  //   });
  // };

  uid = () => {
    return 'id_' + Math.random().toString(16).slice(2);
  };
}

export default uid as () => string;
