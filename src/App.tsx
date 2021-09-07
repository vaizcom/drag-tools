import { Selectable } from './lib/Selectable';

function App() {
  return (
    <div className='App'>
      <header className='Header'>
        Selectable Demo – Drag anywhere to start selecting
        <div className='Links'>
          <a href='https://github.com/worx-to/drag-tools'>GitHub</a>
        </div>
      </header>
      <main className='Content'>
        <Selectable selectAreaClassName='Area' />
      </main>
    </div>
  );
}

export default App;
