'use client';
import { useAppStore } from '@/store/app.store';
import { StudentDashboard } from './student/components/StudentDashboard';
import { ParentDashboard } from './parent/components/ParentDashboard';
import { TeacherDashboard } from './teacher/components/TeacherDashboard';
import { AdminDashboard } from './admin/components/AdminDashboard';

export const UserExperienceDashboard = () => {
  const { user } = useAppStore();

  if (!user) return null;

  switch (user.role) {
    case 'STUDENT':
      return <StudentDashboard />;
    case 'PARENT':
      return <ParentDashboard />;
    case 'TEACHER':
      return <TeacherDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return <div>Unknown Role</div>;
  }
};
