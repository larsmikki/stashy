import { Button } from '@/components/ui';

interface Props {
  sort: string;
  order: string;
  onSortChange: (sort: string) => void;
  onOrderChange: (order: string) => void;
}

export default function SortControls({ sort, order, onSortChange, onOrderChange }: Props) {
  const isRandom = sort === 'random';
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Name' },
    { value: 'random', label: 'Random' },
  ];
  const orderOptions = [
    { value: 'desc', label: sort === 'date' ? 'Newest' : 'Z-A' },
    { value: 'asc', label: sort === 'date' ? 'Oldest' : 'A-Z' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1.5">
        {sortOptions.map(option => (
          <Button
            key={option.value}
            size="sm"
            variant={sort === option.value ? 'primary' : 'secondary'}
            onClick={() => onSortChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      {!isRandom && (
        <div className="flex flex-wrap gap-1.5">
          {orderOptions.map(option => (
            <Button
              key={option.value}
              size="sm"
              variant={order === option.value ? 'primary' : 'secondary'}
              onClick={() => onOrderChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
