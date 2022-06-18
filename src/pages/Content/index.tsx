import '../../assets/styles/tailwind.css';
import clearAssets from '../../lib/clearAssets';
import addFavicon from '../../lib/addFavicon';
import mountApp from '../../lib/mountApp';

const run = async () => {
  // 既存のassetsが邪魔になるので、必ず mountApp() より先に実行しておく
  await clearAssets();

  mountApp();

  addFavicon();
};

run();

if (module.hot) module.hot.accept();
