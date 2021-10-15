import { FC } from 'react';
import { Sortable, SortableCell } from './lib/Sortable';

interface IProps {}

const ITEMS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
// const ITEMS2 = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

export const SortableDemo: FC<IProps> = () => {
  // const [selected, setSelected] = useState<string[]>([]);

  return (
    <Sortable>
      {ITEMS.map((item, index) => (
        <SortableCell itemClassName='SortableItem' index={index} key={item}>
          <div className='Item'>{item}</div>
        </SortableCell>
      ))}
    </Sortable>
  );
};
