import '../../assets/styles/tailwind.css';
import clearAssets from '../../lib/clearAssets';
import addFavicon from '../../lib/addFavicon';
import mountApp from '../../lib/mountApp';

// 既存のassetsが邪魔になるので、必ず clearAssets() を実行し終わったあとに mountApp() を実行する
clearAssets().then((res) => {
  mountApp();
  addFavicon();
});

if (module.hot) module.hot.accept();
