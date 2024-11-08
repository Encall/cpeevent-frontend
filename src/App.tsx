import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';

import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import Event from './pages/Event';
import Custom404 from './pages/Custom404';
import { AuthContext } from './context/AuthContext';
import MembersPage from './pages/members';
import Post from './pages/Post';

import IndexPage from '@/pages/index';
import DocsPage from '@/pages/docs';
import PricingPage from '@/pages/pricing';
import BlogPage from '@/pages/blog';
import AboutPage from '@/pages/about';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import CalendarPage from '@/pages/calendar';
import TodoPage from '@/pages/todo';
import AllPostEvent from './components/post/AllPostEvent';
import PostDetail from './components/post/postDetail';

function App() {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            <Route element={<IndexPage />} path="/" />
            <Route element={<DocsPage />} path="/docs" />
            <Route element={<PricingPage />} path="/pricing" />
            <Route element={<BlogPage />} path="/blog" />
            <Route element={<AboutPage />} path="/about" />
            <Route
                element={user ? <Navigate to="/" /> : <LoginPage />}
                path="/login"
            />
            <Route
                element={user ? <Navigate to="/" /> : <SignupPage />}
                path="/signup"
            />
            <Route element={<Custom404 />} path="/404" />
            <Route element={<Navigate replace to="/404" />} path="*" />
            <Route
                element={
                    user ? (
                        <ProtectedLayout requiredAccess="1">
                            <Routes>
                                <Route element={<AboutPage />} path="/some" />
                                <Route element={<BlogPage />} path="/another" />
                                {/* Add more protected routes here */}
                            </Routes>
                        </ProtectedLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
                path="/protected/*"
            />
            <Route element={<Event />} path="/events" />
            <Route
                element={
                    <Post>
                        <Outlet />
                    </Post>
                }
                path="/workspace/:eventid"
            >
                {/* <Route index element={<div>312312312</div>} /> */}
                <Route index element={<AllPostEvent></AllPostEvent>} />
                <Route
                    path="post/:postid"
                    element={<PostDetail></PostDetail>}
                />
                {/* <Route path="vote/:postid" element={<div>asd</div>} />
                <Route path="pole/:postid" element={<div>asd</div>} /> */}
                {/* <Route path="post/:postid" element={<Postcopy />} /> */}
            </Route>
            <Route element={<CalendarPage />} path="/calendar" />
            <Route element={<TodoPage />} path="/todo" />
            <Route element={<MembersPage />} path="/workspace/:eventid/members" />
        </Routes>
    );
}

export default App;
