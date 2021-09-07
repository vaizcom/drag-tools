import { Selectable } from './lib/Selectable';

function App() {
  return (
    <div className='App'>
      <header className='Header'>Selectable Demo – Drag anywhere to start selecting</header>
      <main className='Content'>
        <Selectable selectAreaClassName='Area' />
      </main>
    </div>
  );
}

export default App;
