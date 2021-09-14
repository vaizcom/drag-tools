import { FC, useState } from 'react';
import { Selectable } from './lib/Selectable';
import { SortableCell } from './lib/Sortable';
import classNames from 'classnames';

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
      itemClassName='SelectableItem'>
      <div>Selectable</div>
      <div></div>
      {ITEMS2.map(item => (
        <div key={item} data-id={item} className='SelectableItem'>
          <div
            className={classNames('Item', {
              Selected: selected.includes(item),
            })}>
            {item}
          </div>
        </div>
      ))}

      <div></div>
      <div></div>
      <div>Selectable + Sortable</div>
      <div></div>
      {ITEMS.map((item, index) => (
        <SortableCell itemClassName='SortableItem' key={item} data-id={item} className='SelectableItem' index={index}>
          <div
            className={classNames('Item', {
              Selected: selected.includes(item),
            })}>
            {item}
          </div>
        </SortableCell>
      ))}
    </Selectable>
  );
};
