import { cn } from "@/lib/utils";
import { ConversationList } from "./ConversationList";
import type { ConversationSummary } from "@/lib/messages";

/**
 * Three-panel workspace: conversations | chat | part details.
 * Phones show one panel (list, or the open chat); tablets drop the part panel.
 */
export function MessagesShell({
  conversations,
  activeId,
  details,
  children,
}: {
  conversations: ConversationSummary[];
  activeId?: string;
  /** Right-hand panel (the part and the other person); hidden below xl. */
  details?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex h-[calc(100dvh-7.5rem)] min-h-[540px] overflow-hidden rounded-2xl border border-ink-200">
        <aside
          className={cn(
            "w-full shrink-0 flex-col border-r border-ink-200 bg-white md:flex md:w-[300px] lg:w-[330px]",
            activeId ? "hidden" : "flex",
          )}
        >
          <ConversationList conversations={conversations} activeId={activeId} />
        </aside>
        <section className={cn("min-w-0 flex-1 flex-col", activeId ? "flex" : "hidden md:flex")}>{children}</section>
        {details && <aside className="hidden w-[300px] shrink-0 overflow-y-auto border-l border-ink-200 bg-white xl:block">{details}</aside>}
      </div>
    </div>
  );
}
