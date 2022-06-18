// ファビコン追加
const addFavicon = () => {
  const faviconTag = '<link rel="shortcut icon" href="https://syncroomplus.koeda.me/favicon.ico">';
  document.head.insertAdjacentHTML('beforeend', faviconTag);
};

export default addFavicon;
