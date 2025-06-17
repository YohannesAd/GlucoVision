/**
 * 🎯 PROFESSIONAL UI COMPONENTS LIBRARY
 * Central export file for all reusable UI components organized by feature
 *
 * This file provides a single import source for all shared components:
 * import { Button, FormInput, NavigationHeader } from '../../components/ui';
 *
 * Professional folder structure:
 * - layout/: Screen containers and headers
 * - buttons/: All button types
 * - inputs/: All input fields and pickers
 * - cards/: Information display cards
 * - lists/: List displays and grids
 * - charts/: Data visualization
 * - navigation/: Navigation components
 * - indicators/: Status and progress displays
 * - sections/: Large page sections
 */

// 🏗️ LAYOUT COMPONENTS
export { default as ScreenContainer } from './layout/ScreenContainer';
export { default as FormContainer } from './layout/FormContainer';
export { default as ScreenHeader } from './layout/ScreenHeader';
export { default as NavigationHeader } from './layout/NavigationHeader';
export { default as DashboardHeader } from './layout/DashboardHeader';
export { default as OnboardingLayout } from './layout/OnboardingLayout';

// 🔘 BUTTON COMPONENTS
export { default as Button } from './buttons/Button';
export { default as QuickActionButton } from './buttons/QuickActionButton';

// ✏️ INPUT COMPONENTS
export { default as FormInput } from './inputs/FormInput';
export { default as FieldPicker } from './inputs/FieldPicker';
export { default as OptionGrid } from './inputs/OptionGrid';
export { default as DatePicker } from './inputs/DatePicker';
export { default as DateTimePicker } from './inputs/DateTimePicker';

// 📝 FORM COMPONENTS
export { default as AuthForm } from './forms/AuthForm';
export { default as ValuePicker } from './forms/ValuePicker';

// 📋 CARD COMPONENTS
export { default as StatsCard } from './cards/StatsCard';
export { default as AIInsightCard } from './cards/AIInsightCard';
export { default as GlucoseLogCard } from './cards/GlucoseLogCard';

// 📝 LIST COMPONENTS
export { default as FeatureItem } from './lists/FeatureItem';
export { default as StatisticsGrid } from './lists/StatisticsGrid';
export { default as LogItem } from './lists/LogItem';
export { default as LogsList } from './lists/LogsList';
export { default as CollapsibleLogsList } from './lists/CollapsibleLogsList';

// 📈 CHART COMPONENTS
export { default as GlucoseChart } from './charts/GlucoseChart';

// 🧭 NAVIGATION COMPONENTS
export { default as NavigationLink } from './navigation/NavigationLink';
export { default as NavigationMenu } from './navigation/NavigationMenu';
export { default as ActionSection } from './navigation/ActionSection';

// 🎯 INDICATOR COMPONENTS
export { default as TrendIndicator } from './indicators/TrendIndicator';
export { default as ProgressIndicator } from './indicators/ProgressIndicator';
export { default as PeriodSelector } from './indicators/PeriodSelector';

// 🎨 SECTION COMPONENTS
export { default as AIStatsGrid } from './sections/AIStatsGrid';
export { default as LogFilters } from './sections/LogFilters';
export { default as DataSection } from './sections/DataSection';
export { default as PDFExportSection } from './sections/PDFExportSection';
export { default as PDFExportDateSelector } from './sections/PDFExportDateSelector';
export { default as PDFReportGenerator } from './sections/PDFReportGenerator';
export { default as ResendCodeSection } from './sections/ResendCodeSection';

// 💬 MESSAGE COMPONENTS
export { default as ErrorMessage } from './messages/ErrorMessage';
export { default as FormError } from './messages/FormError';
export { default as SuccessMessage } from './messages/SuccessMessage';
export { default as LoadingState } from './messages/LoadingState';
export { default as EmptyState } from './messages/EmptyState';
export { default as StatusMessage } from './messages/StatusMessage';

// 📄 MODAL COMPONENTS
export { default as PDFExportModal } from './modals/PDFExportModal';
