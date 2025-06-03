import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import 'react-quill/dist/quill.snow.css';

const HomePage = lazy(() => import("./pages/HomePage"));
const NoPage = lazy(() => import("./pages/NoPage"));
const Layout = lazy(() => import("./pages/Layout"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const MotivationPage = lazy(() => import("./pages/MotivationPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const AddCourseForm = lazy(() => import("./pages/AddCourseForm"));
const EditCourse = lazy(() => import("./pages/EditCourse"));
const TestPage = lazy(() => import("./pages/TestPage"));
const RegistrationPage = lazy(() => import("./pages/RegistrationPage"));
const AddTestForm = lazy(() => import('./pages/AddTestForm'));
const EditProfilePage = lazy(() => import("./pages/EditProfilePage"));
const EditTestForm = lazy(() => import("./pages/EditTestForm"));
const Ui = lazy(() => import("./pages/Ui"));
const { AuthProvider } = require("./context/AuthContext");

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route path="about" element={<AboutPage />} />
                            <Route path="add-course" element={<AddCourseForm />} />
                            <Route path="courses" element={<CoursesPage />} />
                            <Route path="course/:id" element={<CourseDetailPage />} />
                            <Route path="motivation" element={<MotivationPage />} />
                            <Route path="login" element={<LoginPage />} />
                            <Route path="edit-profile" element={<EditProfilePage />} />
                            <Route path="edit-profile/:id" element={<EditProfilePage />} />
                            <Route path="register" element={<RegistrationPage />} />
                            <Route path="profile" element={<UserProfilePage />} />
                            <Route path="edit-course/:id" element={<EditCourse />} />
                            <Route path="test/:id" element={<TestPage />} />
                            <Route path="test-form" element={<AddTestForm />} />
                            <Route path="edit-test/:id" element={<EditTestForm />} />
                            <Route path="ui" element={<Ui />} />
                            <Route path="*" element={<NoPage />} />
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </AuthProvider>
    );
}
