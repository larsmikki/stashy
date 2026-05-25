interface Props {
  count?: number;
}

// Lightweight skeleton placeholders for the media grid. Matches the same
// responsive column count as MediaGrid so the layout doesn't shift when real
// thumbnails arrive.
export default function SkeletonGrid({ count = 24 }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full aspect-square rounded-xl animate-pulse bg-surface2"
        />
      ))}
    </div>
  );
}
