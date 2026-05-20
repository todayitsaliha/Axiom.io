import { useState } from 'react';
import { useAcademicData } from '@/hooks/useAcademicData';
import { Onboarding } from '@/components/Onboarding';
import { Sidebar, MobileSidebarTrigger } from '@/components/Sidebar';
import { StatsRow } from '@/components/StatsRow';
import { SubjectCard } from '@/components/SubjectCard';
import { AddSubjectForm } from '@/components/AddSubjectForm';
import { SubjectProgress } from '@/components/SubjectProgress';
import { UpcomingAssignments } from '@/components/UpcomingAssignments';
import { GPAOverview } from '@/components/GPAOverview';
import { Timetable } from '@/components/Timetable';
import { TimetableWidget } from '@/components/TimetableWidget';
import { AttendanceWidget } from '@/components/AttendanceWidget';
import { NoticeBoard } from '@/components/NoticeBoard';
import { DailyCatchupPrompt } from '@/components/DailyCatchupPrompt';

const Index = () => {
  const {
    data, addSubject, removeSubject, updateSubject, updateComponent,
    addComponent, removeComponent, addSubComponent, updateSubComponent,
    removeSubComponent, updateStudentInfo, completeOnboarding, addTimeSlot, removeTimeSlot,
  } = useAcademicData();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(data.studentName);
  const [profileSemester, setProfileSemester] = useState(data.semester);

  if (!data.onboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const sidebarProps = {
    studentName: data.studentName,
    semester: data.semester,
    subjectCount: data.subjects.length,
    activeSection,
    onSectionChange: setActiveSection,
  };

  const handleSaveProfile = () => {
    updateStudentInfo(profileName, profileSemester);
    setEditingProfile(false);
  };

  const renderSubjectCard = (sub: typeof data.subjects[0]) => (
    <SubjectCard
      key={sub.id}
      subject={sub}
      onUpdateComponent={(cid, updates) => updateComponent(sub.id, cid, updates)}
      onAddComponent={(comp) => addComponent(sub.id, comp)}
      onRemoveComponent={(cid) => removeComponent(sub.id, cid)}
      onUpdateSubject={(updates) => updateSubject(sub.id, updates)}
      onRemoveSubject={() => removeSubject(sub.id)}
      onAddSubComponent={(cid, sc) => addSubComponent(sub.id, cid, sc)}
      onUpdateSubComponent={(cid, scid, u) => updateSubComponent(sub.id, cid, scid, u)}
      onRemoveSubComponent={(cid, scid) => removeSubComponent(sub.id, cid, scid)}
    />
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <DailyCatchupPrompt
        subjects={data.subjects}
        timetable={data.timetable || []}
        onUpdateComponent={updateComponent}
      />
      <Sidebar {...sidebarProps} />

      <main className="flex flex-col overflow-hidden flex-1 min-w-0">
        {/* Topbar */}
        <div className="bg-paper border-b border-border px-4 md:px-8 py-3.5 flex items-center gap-3 flex-shrink-0">
          {/* Mobile hamburger */}
          <div className="md:hidden flex-shrink-0">
            <MobileSidebarTrigger {...sidebarProps} />
          </div>

          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            {editingProfile ? (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  className="font-serif text-lg md:text-xl font-black tracking-tight bg-paper2 border border-border px-2 py-1 outline-none focus:border-teal w-32 md:w-auto"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveProfile()}
                />
                <input
                  className="text-[11px] bg-paper2 border border-border px-2 py-1 outline-none focus:border-teal font-mono w-24 md:w-auto"
                  value={profileSemester}
                  onChange={e => setProfileSemester(e.target.value)}
                  placeholder="Semester"
                />
                <button onClick={handleSaveProfile} className="text-[9px] text-teal uppercase tracking-wider">Save</button>
              </div>
            ) : (
              <>
                <div className="font-serif text-lg md:text-xl font-black tracking-tight text-ink flex items-baseline gap-2 truncate">
                  Good morning, <em className="text-teal italic">{data.studentName}.</em>
                  <button onClick={() => setEditingProfile(true)} className="text-[9px] text-mid font-mono font-normal tracking-wider hover:text-teal hidden sm:inline">edit</button>
                </div>
                <div className="text-[9px] text-mid tracking-[0.08em] uppercase truncate">{dateStr} · {data.semester}</div>
              </>
            )}
          </div>

          {/* Topbar right — search, notification, profile */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <input
              className="bg-paper2 border border-border px-3.5 py-[7px] text-[11px] font-mono text-ink w-[200px] outline-none placeholder:text-mid focus:border-teal"
              placeholder="Search courses, notices…"
            />
            <div className="w-[34px] h-[34px] bg-paper2 border border-border flex items-center justify-center cursor-pointer relative">
              <span className="text-sm">🔔</span>
              <div className="absolute top-1.5 right-[7px] w-1.5 h-1.5 rounded-full bg-red border border-paper" />
            </div>
            <div className="w-[34px] h-[34px] rounded-full bg-teal flex items-center justify-center font-serif text-[13px] font-black text-paper cursor-pointer">
              {data.studentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scroll p-4 md:p-6">
          {activeSection === 'dashboard' && (
            <>
              <StatsRow subjects={data.subjects} />

              {/* Main grid: Timetable + GPA/Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-6">
                <TimetableWidget subjects={data.subjects} timetable={data.timetable || []} />
                <div className="flex flex-col gap-6">
                  <GPAOverview subjects={data.subjects} />
                  <SubjectProgress subjects={data.subjects} />
                </div>
              </div>

              {/* Bottom grid: Assignments + Attendance + Notices */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <UpcomingAssignments subjects={data.subjects} />
                <AttendanceWidget subjects={data.subjects} timetable={data.timetable || []} />
                <NoticeBoard subjects={data.subjects} />
              </div>
            </>
          )}

          {activeSection === 'subjects' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="font-serif text-xl font-black tracking-tight">
                  All <em className="text-teal italic">Subjects</em>
                </div>
                <button
                  onClick={() => setShowAddSubject(true)}
                  className="text-[9px] text-paper uppercase tracking-wider px-4 py-2 bg-teal hover:bg-teal-mid"
                >
                  + Add Subject
                </button>
              </div>
              {showAddSubject && (
                <div className="mb-4">
                  <AddSubjectForm
                    onAdd={(sub) => { addSubject(sub); setShowAddSubject(false); }}
                    onCancel={() => setShowAddSubject(false)}
                  />
                </div>
              )}
              <div className="flex flex-col gap-4">
                {data.subjects.length === 0 && !showAddSubject && (
                  <div className="border border-border border-dashed bg-paper2/50 py-12 flex flex-col items-center gap-2">
                    <div className="text-mid text-3xl">◈</div>
                    <div className="text-[11px] text-mid">No subjects yet. Add one to get started.</div>
                    <button
                      onClick={() => setShowAddSubject(true)}
                      className="text-[9px] text-teal uppercase tracking-wider mt-1 px-4 py-1.5 bg-teal-pale hover:bg-teal/20"
                    >
                      + Add First Subject
                    </button>
                  </div>
                )}
                {data.subjects.map(renderSubjectCard)}
              </div>
            </>
          )}

          {activeSection === 'timetable' && (
            <Timetable
              subjects={data.subjects}
              timetable={data.timetable || []}
              onAddTimeSlot={addTimeSlot}
              onRemoveTimeSlot={removeTimeSlot}
            />
          )}

          {activeSection === 'predictor' && (
            <>
              <div className="font-serif text-xl font-black tracking-tight mb-4">
                Grade <em className="text-teal italic">Predictor</em>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  {data.subjects.map(renderSubjectCard)}
                  {data.subjects.length === 0 && (
                    <div className="text-[11px] text-mid py-8 text-center border border-border border-dashed">
                      Add subjects from the Dashboard first
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-6">
                  <GPAOverview subjects={data.subjects} />
                  <SubjectProgress subjects={data.subjects} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
