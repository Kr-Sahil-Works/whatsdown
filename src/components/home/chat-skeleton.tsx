export function LeftSidebarSkeleton() {
  return (
    <div
      className="
        h-full animate-pulse
        w-full md:w-2/5 lg:w-95
        bg-gray-primary
        border-r border-gray-800
        flex flex-col
      "
    >
      {/* HEADER — matches real layout */}
      <div className="flex items-center justify-between px-3 py-2">
        {/* Left: avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-tertiary" />

        {/* Right: icons */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-tertiary" />
          <div className="w-10 h-6 rounded-full bg-gray-tertiary" />
        </div>
      </div>

      {/* Search bar */}
      <div className="px-3 pb-3">
        <div className="w-full h-9 rounded-lg bg-gray-tertiary" />
      </div>

      {/* Chat list */}
      <div className="flex-1 space-y-2 px-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <div className="w-12 h-12 rounded-full bg-gray-tertiary" />
            <div className="flex-1 space-y-2">
              <div className="w-32 h-3 bg-gray-tertiary rounded" />
              <div className="w-20 h-2 bg-gray-tertiary rounded" />
            </div>
            <div className="w-10 h-2 bg-gray-tertiary rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}



export function RightChatSkeleton() {
  return (
    <div
      className="
        h-full flex flex-col animate-pulse
        w-full
        md:flex-1
        bg-background
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3 bg-gray-primary">
        <div className="w-10 h-10 rounded-full bg-gray-tertiary" />
        <div className="flex flex-col gap-2">
          <div className="w-32 h-3 bg-gray-tertiary rounded" />
          <div className="w-20 h-2 bg-gray-tertiary rounded" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        <div className="flex justify-start">
          <div className="w-48 h-8 bg-gray-tertiary rounded-lg" />
        </div>

        <div className="flex justify-end">
          <div className="w-40 h-8 bg-gray-tertiary rounded-lg" />
        </div>

        <div className="flex justify-start">
          <div className="w-56 h-10 bg-gray-tertiary rounded-lg" />
        </div>

        <div className="flex justify-end">
          <div className="w-32 h-8 bg-gray-tertiary rounded-lg" />
        </div>
      </div>

      {/* Input */}
      <div className="p-3 bg-gray-primary">
        <div className="w-full h-10 bg-gray-tertiary rounded-full" />
      </div>
    </div>
  );
}
