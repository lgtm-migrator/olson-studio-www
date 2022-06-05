import { ReactElement } from 'react';
import { Banner } from './components/Banner';
import { CardArea } from './components/CardArea';

function App(): ReactElement {
  return (
    <div className="md:w-[900px] max-w-[900px] opacity-95">
      <Banner />
      <CardArea />
    </div>
  );
}

export default App;
