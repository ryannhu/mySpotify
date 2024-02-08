interface TableItemProps {
    item: number | string;
    description: string;
  }
  
  export default function TableItem({ item, description }: TableItemProps) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded">
        <span className="text-2xl font-bold">{item}</span>
        <span className="text-sm mt-2">{description}</span>
      </div>
    );
  }