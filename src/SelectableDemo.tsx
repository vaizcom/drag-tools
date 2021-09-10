import { FC, useState } from 'react';
import { Selectable } from './lib/Selectable';

interface IProps {}

const ITEMS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const ITEMS2 = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

export const SelectableDemo: FC<IProps> = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Selectable
      onSelect={setSelected}
      isEnabled={true}
      containerClassName='Container SelectableContainer'
      selectAreaClassName='Area'
      itemClassName='Item'>
      {ITEMS.map(i => (
        <div key={i} data-id={i} className={`Item Item1 ${selected.includes(i) && ' Selected'}`}>
          {i}
        </div>
      ))}
      {ITEMS2.map(i => (
        <div key={i} data-id={i} className={`Item ${selected.includes(i) && ' Selected'}`}>
          {i}
        </div>
      ))}
    </Selectable>
  );
};
