import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  studentName: string;
  semester: string;
  subjectCount: number;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

function SidebarInner({ studentName, semester, subjectCount, activeSection, onSectionChange, onNavigate }: SidebarProps & { onNavigate?: () => void }) {
  const initials = studentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  const navItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'subjects', icon: '◈', label: 'Subjects', badge: subjectCount > 0 ? String(subjectCount) : undefined },
    { id: 'timetable', icon: '▦', label: 'Timetable' },
    { id: 'predictor', icon: '◎', label: 'Grade Predictor' },
  ];

  return (
    <div className="flex flex-col h-full bg-ink">
      <div className="px-5 py-4 border-b border-sidebar-border flex items-center gap-2.5">
        <div className="w-7 h-7 bg-teal flex items-center justify-center flex-shrink-0">
          <span className="font-serif text-sm font-black text-sidebar-foreground tracking-tighter">A</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-medium text-sidebar-foreground tracking-tight font-serif">Axiom</span>
          <span className="text-[8px] tracking-[0.2em] text-sidebar-foreground/35 uppercase">academic management</span>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-sidebar-border flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center font-serif text-sm font-black text-sidebar-foreground flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-medium text-sidebar-foreground truncate">{studentName}</div>
          <div className="text-[9px] text-sidebar-foreground/40 tracking-wider mt-px">{semester}</div>
        </div>
        <div className="w-[7px] h-[7px] rounded-full bg-green flex-shrink-0" />
      </div>

      <nav className="flex-1 py-4 overflow-y-auto custom-scroll">
        <div className="text-[8px] tracking-[0.2em] uppercase text-sidebar-foreground/25 px-5 pb-1.5 pt-3">Navigation</div>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => { onSectionChange(item.id); onNavigate?.(); }}
            className={cn(
              'w-full flex items-center gap-2.5 px-5 py-2.5 transition-colors relative text-left',
              activeSection === item.id
                ? 'bg-teal/20 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-teal'
                : 'hover:bg-sidebar-accent'
            )}
          >
            <div className={cn(
              'w-7 h-7 rounded-md flex items-center justify-center text-xs flex-shrink-0',
              activeSection === item.id ? 'bg-teal/25' : 'bg-sidebar-accent'
            )}>
              {item.icon}
            </div>
            <span className={cn(
              'text-[11px] tracking-wider',
              activeSection === item.id ? 'text-sidebar-foreground font-medium' : 'text-sidebar-foreground/55'
            )}>
              {item.label}
            </span>
            {item.badge && (
              <span className="ml-auto bg-teal text-sidebar-foreground text-[8px] px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-sidebar-border">
        <div className="bg-amber/10 border border-amber/20 rounded-md px-3 py-2.5">
          <div className="text-[8px] tracking-[0.12em] uppercase text-amber/60 mb-0.5">Current Semester</div>
          <div className="font-serif text-base font-bold text-amber">{semester}</div>
          <div className="text-[9px] text-amber/50 mt-px">{subjectCount} subjects</div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col overflow-hidden border-r border-sidebar-border w-[220px] flex-shrink-0">
      <SidebarInner {...props} />
    </aside>
  );
}

export function MobileSidebarTrigger(props: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 text-ink hover:text-teal transition-colors" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[260px] bg-ink border-sidebar-border">
        <SidebarInner {...props} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
