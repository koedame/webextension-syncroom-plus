// JWTのPayloadを取得
const decodeJWTPayLoad = (token: string) => {
  const [_header, payload, _sign] = token.split('.');
  if (payload) {
    try {
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
    } catch (e) {
      throw new Error('Invalid token');
    }
  } else {
    throw new Error('Invalid token');
  }
};

export default decodeJWTPayLoad;
