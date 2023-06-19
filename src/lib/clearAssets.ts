// 不要になるscriptやiframeなどを削除
const clearAssets = async () => {
  const scriptTags: NodeList = window.document.querySelectorAll('script,link,meta,body>*');
  scriptTags.forEach((value: Node, _key: number, _parent: NodeList): void => {
    if (value.parentNode) {
      value.parentNode.removeChild(value);
    }
  });
  window.document.body.removeAttribute('style');
};

export default clearAssets;
