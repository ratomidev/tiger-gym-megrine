type CardProps = {
  title: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">{title}</h2>
      {children}
    </div>
  );
}
