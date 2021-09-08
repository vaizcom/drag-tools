import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { SelectableDemo } from './SelectableDemo';
import { useLocation } from 'react-use';

enum Nav {
  Selectable,
  Draggable,
}

const NAV = [
  {
    id: Nav.Selectable,
    label: 'Selectable',
    path: 'selectable',
    Component: SelectableDemo,
  },
  {
    id: Nav.Draggable,
    label: 'Draggable',
    path: 'draggable',
    Component: SelectableDemo,
  },
];

function App() {
  const location = useLocation();
  const section = useMemo(() => {
    return NAV.find(n => n.path === location.pathname?.substr(1));
  }, [location]);

  return (
    <div className='App'>
      <header className='Header'>
        <div className='HeaderTitle'>Drag Tools</div>
        <div className='Links'>
          <a href='https://github.com/worx-to/drag-tools'>GitHub</a>
        </div>
      </header>
      <main className='Content'>
        <aside className='Aside'>
          {NAV.map(n => (
            <a
              href={n.path}
              key={n.id}
              onClick={e => {
                e.preventDefault();
                window.history.pushState(null, '', n.path);
              }}
              className={classNames('NavItem', {
                Active: section?.id === n.id,
              })}>
              {n.label}
            </a>
          ))}
        </aside>
        <section className='ViewportSection'>{section && <section.Component />}</section>
      </main>
    </div>
  );
}

export default App;
