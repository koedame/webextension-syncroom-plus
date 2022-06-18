// 不要になるscriptやiframeなどを削除
const clearAssets = async () => {
  const scriptTags: NodeList = window.document.querySelectorAll('script,link,meta,body>*');
  scriptTags.forEach((value: Node, key: number, parent: NodeList): void => {
    if (value.parentNode) {
      value.parentNode.removeChild(value);
    }
  });
};

export default clearAssets;
