import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          categories: path.resolve(__dirname, 'categories.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          auth: path.resolve(__dirname, 'auth.html'),
          userDashboard: path.resolve(__dirname, 'user/dashboard.html'),
          userSubmit: path.resolve(__dirname, 'user/submit.html'),
          userComplaints: path.resolve(__dirname, 'user/complaints.html'),
          userCase: path.resolve(__dirname, 'user/case.html'),
          userNotifications: path.resolve(__dirname, 'user/notifications.html'),
          userProfile: path.resolve(__dirname, 'user/profile.html'),
          staffDashboard: path.resolve(__dirname, 'staff/dashboard.html'),
          staffCases: path.resolve(__dirname, 'staff/cases.html'),
          staffCase: path.resolve(__dirname, 'staff/case.html'),
          staffReports: path.resolve(__dirname, 'staff/reports.html'),
          adminDashboard: path.resolve(__dirname, 'admin/dashboard.html'),
          adminCases: path.resolve(__dirname, 'admin/cases.html'),
          adminUsers: path.resolve(__dirname, 'admin/users.html'),
          adminManagement: path.resolve(__dirname, 'admin/management.html'),
          adminSettings: path.resolve(__dirname, 'admin/settings.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
